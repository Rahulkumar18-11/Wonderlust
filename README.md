# WanderLust (Tour and Travels Project)

The Wanderlust Project is a full-stack travel listing web application designed to help users explore, view, and manage vacation accommodations, cabins, beach houses, and villas. It allows travelers to browse destinations, explore locations on Google Maps, book stays with email confirmation, and manage property listings and verified reviews.

## Key Features
- **Dynamic Travel Listings**: Browse over 44 travel destinations with pricing, ratings, and filters.
- **Interactive Google Maps**: Integrated Google Maps with one-click direct directions and exact location markers.
- **User Authentication & Authorization**: Secure signup, login, session cookies, and role-based permissions (only listing and review owners can modify their content).
- **Review System**: Create, view, edit, and delete verified traveler reviews and ratings.
- **Reservation & Email Confirmation**: Booking widget with instant email confirmation and newsletter subscription.
- **Containerized with Docker**: Dockerfile and Docker Compose with containerized MongoDB for zero-configuration setup.

## Tech Stack
- **Frontend**: EJS templates, Bootstrap 5, FontAwesome, Remix Icons, CSS3
- **Backend**: Node.js, Express.js, Express Session, Passport.js
- **Database**: MongoDB & Mongoose with Docker persistence
- **Cloud & Maps**: Cloudinary for images, Google Maps

## How to Install & Run

### Method 1: Using Docker Compose (Recommended)
```bash
docker compose up -d
```
Access the application at [http://localhost:8000](http://localhost:8000).

### Method 2: Manual Node.js Setup
1. Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed sample data (optional):
   ```bash
   npm run seed
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open [http://localhost:8000](http://localhost:8000) in your browser.
