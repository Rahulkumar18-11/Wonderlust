# WANDERLUST-TRAVEL-

# WanderLust (Tour and Travels Project)

The Wanderlust Project is a full-stack travel listing web application designed to help users explore, view, and manage vacation accommodations, cabins, beach houses, and villas. It allows travelers to browse destinations, explore locations on Google Maps, calculate travel distance from user location, book stays with real-time price calculators and email confirmation, checkout through multiple payment gateways, and manage verified reviews.

## Key Features
- **Dynamic Travel Listings**: Browse over 44 travel destinations across global beaches, mountains, cities, and iconic spots with pricing and filters.
- **Interactive Google Maps with Distance Calculation**: Real-time GPS distance calculation from the user's current location, along with one-click direct Google Maps turn-by-turn directions.
- **Booking & Checkout Flow**: Real-time night and guest calculation, 18% GST and cleaning fee breakdowns, instant UPI / QR Code, Credit/Debit Card, Net Banking, and Pay on Arrival options.
- **Digital Confirmation Voucher**: Post-payment receipt with unique booking reference (`WL-XXXXXX`), keyless smart lock door PIN code, printable invoice, and Google Maps links.
- **User Authentication & Authorization**: Secure signup, login, session cookies, password visibility toggle, real-time password strength meter, and role-based permissions (only listing and review owners can modify their content).
- **Review System**: Create, view, edit, and delete verified traveler reviews and ratings.
- **Reservation & Email Confirmation**: Booking reservation details and newsletter subscription.
- **Containerized with Docker**: Dockerfile and Docker Compose with containerized MongoDB for zero-configuration setup.

## Tech Stack
- **Frontend**: EJS templates, Bootstrap 5, FontAwesome 6, CSS3
- **Backend**: Node.js, Express.js, Express Session, Passport.js
- **Database**: MongoDB & Mongoose with Docker volume persistence
- **Cloud & Maps**: Cloudinary for images, Google Maps Directions & Geolocation API

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
