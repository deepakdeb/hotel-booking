<?php

namespace App\Providers;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\EngineManager;

class ScoutElasticsearchServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(Client::class, function () {
            return ClientBuilder::create()
                ->setHosts([config('scout.elasticsearch.hosts')[0]])
                ->build();
        });
    }

    public function boot()
    {
        resolve(EngineManager::class)->extend('elasticsearch', function () {
            return new \App\Services\ElasticsearchEngine(
                app(Client::class),
                config('scout.elasticsearch.index')
            );
        });
    }
}