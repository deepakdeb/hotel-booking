<?php

namespace App\Services;

use Elastic\Elasticsearch\Client;
use Illuminate\Support\Collection;
use Illuminate\Support\LazyCollection;
use Laravel\Scout\Builder;
use Laravel\Scout\Engines\Engine;

class ElasticsearchEngine extends Engine
{
    protected $client;
    protected $index;

    public function __construct(Client $client, $index)
    {
        $this->client = $client;
        $this->index = $index;
    }

    /**
     * Update the given models in the search index.
     *
     * @param  Collection  $models
     * @return void
     */
    public function update($models)
    {
        $params = ['body' => []];

        $models->each(function ($model) use (&$params) {
            $params['body'][] = [
                'update' => [
                    '_id' => $model->getScoutKey(),
                    '_index' => $this->index,
                ]
            ];
            $params['body'][] = [
                'doc' => $model->toSearchableArray(),
                'doc_as_upsert' => true
            ];
        });

        $this->client->bulk($params);
    }

    /**
     * Remove the given models from the search index.
     *
     * @param  Collection  $models
     * @return void
     */
    public function delete($models)
    {
        $params = ['body' => []];

        $models->each(function ($model) use (&$params) {
            $params['body'][] = [
                'delete' => [
                    '_id' => $model->getScoutKey(),
                    '_index' => $this->index,
                ]
            ];
        });

        $this->client->bulk($params);
    }

    /**
     * Perform the given search on the engine.
     *
     * @param  Builder  $builder
     * @return mixed
     */
    public function search(Builder $builder)
    {
        return $this->performSearch($builder, [
            'size' => $builder->limit,
        ]);
    }

    /**
     * Perform the given search on the engine and paginate the results.
     *
     * @param  Builder  $builder
     * @param  int  $perPage
     * @param  int  $page
     * @return mixed
     */
    public function paginate(Builder $builder, $perPage, $page)
    {
        $result = $this->performSearch($builder, [
            'size' => $perPage,
            'from' => ($page - 1) * $perPage,
        ]);

        $result['nbPages'] = (int) ceil($result['hits']['total']['value'] / $perPage);

        return $result;
    }

    /**
     * Perform the search on the engine.
     *
     * @param  Builder  $builder
     * @param  array  $options
     * @return mixed
     */
    protected function performSearch(Builder $builder, array $options = [])
    {
        $params = [
            'index' => $this->index,
            'body' => [
                'query' => [
                    'bool' => [
                        'must' => [
                            [
                                'query_string' => [
                                    'query' => "*{$builder->query}*",
                                    'fields' => ['name^3', 'description^2', 'city', 'country', 'address']
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        if ($sort = $this->sort($builder)) {
            $params['body']['sort'] = $sort;
        }

        if (isset($options['from'])) {
            $params['body']['from'] = $options['from'];
        }

        if (isset($options['size'])) {
            $params['body']['size'] = $options['size'];
        }

        return $this->client->search($params);
    }

    /**
     * Get the sort array for a given builder.
     *
     * @param  Builder  $builder
     * @return array|null
     */
    protected function sort($builder)
    {
        if (count($builder->orders)) {
            return collect($builder->orders)->map(function ($order) {
                return [$order['column'] => $order['direction']];
            })->toArray();
        }
        return null;
    }

    /**
     * Map the given results to a collection of model IDs.
     *
     * @param  mixed  $results
     * @return Collection
     */
    public function mapIds($results)
    {
        return collect($results['hits']['hits'])->pluck('_id');
    }

    /**
     * Map the given results to a collection of models.
     *
     * @param  Builder  $builder
     * @param  mixed  $results
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return Collection
     */
    public function map(Builder $builder, $results, $model)
    {
        if ($results['hits']['total']['value'] === 0) {
            return $model->newCollection();
        }

        $ids = collect($results['hits']['hits'])->pluck('_id')->values()->all();

        return $model->whereIn($model->getQualifiedKeyName(), $ids)
                    ->get()
                    ->sortBy(function ($item) use ($ids) {
                        return array_search($item->getKey(), $ids);
                    });
    }

    /**
     * Map the given results to a lazy collection of models.
     *
     * @param  Builder  $builder
     * @param  mixed  $results
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return LazyCollection
     */
    public function lazyMap(Builder $builder, $results, $model)
    {
        if ($results['hits']['total']['value'] === 0) {
            return LazyCollection::make([]);
        }

        $ids = collect($results['hits']['hits'])->pluck('_id')->values()->all();

        return $model->whereIn($model->getQualifiedKeyName(), $ids)
                    ->cursor()
                    ->sortBy(function ($item) use ($ids) {
                        return array_search($item->getKey(), $ids);
                    });
    }

    /**
     * Get the total count from a raw search result.
     *
     * @param  mixed  $results
     * @return int
     */
    public function getTotalCount($results)
    {
        return $results['hits']['total']['value'];
    }

    /**
     * Flush all of the model's records from the engine.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return void
     */
    public function flush($model, $options = [])
    {
        $this->client->deleteByQuery([
            'index' => $this->index,
            'body' => [
                'query' => [
                    'match_all' => (object) []
                ]
            ]
        ]);
    }

    /**
     * Create the index with the given name.
     *
     * @param  string  $name
     * @param  array  $options
     * @return void
     */
    public function createIndex($name, array $options = [])
    {
        $params = [
            'index' => $name,
            'body' => $options
        ];

        $this->client->indices()->create($params);
    }

    /**
     * Delete the index with the given name.
     *
     * @param  string  $name
     * @return void
     */
    public function deleteIndex($name)
    {
        $params = ['index' => $name];

        try {
            $this->client->indices()->delete($params);
        } catch (\Exception $e) {
            // Index might not exist, that's fine.
        }
    }
}
