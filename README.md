Hotel Booking Platform
======================

A full-stack hotel booking platform built with Laravel, React.js, Inertia.js, and Tailwind CSS. Features real-time booking notifications, multi-currency support, and guest booking capabilities.

🚀 Features
-----------

### ✅ Mandatory Features

*   **User Roles & Authentication** (Admin, User, Guest)
    
*   **Hotel Search with Elasticsearch** (Filter by location, dates, amenities)
    
*   **Guest Booking System** (Book without account, email confirmation)
    
*   **Admin Dashboard** (CRUD operations for hotels and bookings)
    
*   **Responsive Design** (Tailwind CSS for mobile/desktop)
    

### ✅ Optional Features

*   **Multi-Currency Support** (USD, EUR, GBP with real-time conversion)
    
*   **Advanced Search Filters** (Price range, amenities, dates)
    

🛠️ Tech Stack
--------------

*   **Backend**: Laravel 12, Laravel Reverb, Laravel Scout
    
*   **Frontend**: React.js, Inertia.js, Tailwind CSS
    
*   **Search**: Elasticsearch with Laravel Scout
    
*   **Real-time**: Laravel Reverb (WebSockets)
    
*   **Database**: MySQL
    

📦 Installation
---------------

### Prerequisites

*   PHP 8.2+
    
*   Composer
    
*   Node.js 16+
    
*   MySQL 8.0+
    
*   Elasticsearch 8.x
    

### 1\. Clone the Repository

```bash
git clone https://github.com/deepakdeb/hotel-booking.git
cd hotel-booking
```

### 2\. Install Dependencies

```bash
# PHP dependencies
composer install

# JavaScript dependencies
npm install
```
### 3\. Environment Setup

```bash
cp .env.example .env
php artisan key:generate
```
Update `.env` with your database credentials:

```bash
DB_DATABASE=hotel_booking
DB_USERNAME=root
DB_PASSWORD=

# Reverb Configuration
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=hotel-booking-platform
REVERB_APP_KEY=base64:your-generated-key
REVERB_APP_SECRET=your-generated-secret
REVERB_HOST=127.0.0.1
REVERB_PORT=8080

# Elasticsearch
SCOUT_DRIVER=elasticsearch
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_INDEX=hotel_booking
```
### 4\. Database Setup

```bash
# Run migrations and seeders
php artisan migrate --seed

# Generate Reverb keys
php artisan reverb:key:generate
```
### 5\. Elasticsearch Setup

```bash
# Using Docker
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.11.0

# Import data into Elasticsearch
php artisan scout:import "App\\Models\\Hotel"
```
🚀 Running the Application
--------------------------

### Start Development Servers

Open **multiple terminal tabs**:

**Terminal 1 - Laravel Application**

```bash
php artisan serve
```
**Terminal 2 - Reverb Server**

```bash
php artisan reverb:start
```
**Terminal 3 - Frontend Build**

```bash
npm run dev
```
**Terminal 4 - Elasticsearch** (if not using Docker)

```bash
# Start Elasticsearch service
elasticsearch
```
### Access the Application

*   **Main Application**: [http://localhost:8000](http://localhost:8000)
    
*   **Reverb Dashboard**: [http://localhost:8080](http://localhost:8080)
    
*   **Elasticsearch**: [http://localhost:9200](http://localhost:9200)
    

👤 Default Accounts
-------------------

### Admin Account

*   **Email**: [admin@hotelbooking.com](https://mailto:admin@hotelbooking.com)
    
*   **Password**: password
    
*   **Access**: Full admin privileges, hotel management
    

### User Account

*   **Email**: [user@hotelbooking.com](https://mailto:user@hotelbooking.com)
    
*   **Password**: password
    
*   **Access**: Book hotels, view personal bookings
    

### Guest Access

*   No account needed for bookings
    
*   Access bookings via email and reference number
    

🎯 Usage Guide
--------------

### For Guests

1.  Search hotels using filters
    
2.  Select room and dates
    
3.  Book without creating account
    
4.  Receive confirmation email with reference
    
5.  Access booking later via guest portal
    

### For Registered Users

1.  Create account or login
    
2.  Search and book hotels
    
3.  View booking history
    
4.  Manage existing bookings
    

### For Administrators

1.  Login with admin credentials
    
2.  Manage hotels (CRUD operations)

3. Manage rooms from hotels(CRUD)
    
4.  View all bookings
    
5.  Monitor real-time booking notifications
    

🔧 Troubleshooting
------------------

### Common Issues

**WebSocket Connection Failed**

```bash

# Ensure Reverb server is running
php artisan reverb:start

# Check port 8080 is available
lsof -i :8080
```
**Elasticsearch Connection Error**

```bash
# Start Elasticsearch
docker start elasticsearch

# Or install locally
brew install elasticsearch
```
**Environment Variables**

```bash
# Clear cache
php artisan optimize:clear

# Regenerate keys
php artisan reverb:key:generate
```
📁 Project Structure
--------------------

```bash
hotel-booking-platform/
├── app/
│   ├── Models/          # Eloquent models
│   ├── Http/
│   │   ├── Controllers/ # Application controllers
│   │   └── Middleware/  # Custom middleware
│   ├── Policies/        # Authorization policies
│   └── Events/          # Real-time events
├── resources/
│   └── js/
│       ├── Components/  # React components
│       ├── Layouts/     # Layout components
│       └── Pages/       # Inertia pages
├── config/              # Configuration files
└── database/
    ├── migrations/      # Database migrations
    └── seeders/         # Test data seeders
```

* * *

**Happy Booking!** 🏨✈️