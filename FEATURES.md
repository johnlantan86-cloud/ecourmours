# Kigali Great Market - Complete Feature Guide

## Overview
Kigali Great Market is a modern buyer and seller marketplace website built with Vue 3 and Vite. It allows sellers to create stores, list products, and manage their inventory, while buyers can browse sellers and their products.

---

## Features

### 🏠 **Home Page**
- Beautiful landing page with navigation
- Call-to-action buttons for buyers and sellers
- "How It Works" section explaining the marketplace flow
- Responsive design that works on all devices

### 👥 **Buyer Registration**
Buyers can register with:
- Full Name
- Email Address
- Phone Number
- Location/Address
- National ID Number (for security)
- Password

**How it works:**
- Buyer account data is saved to browser's localStorage
- Buyers can then browse the marketplace
- Multiple buyers can register

### 🏪 **Seller Registration**
Sellers can register with:
- Full Name
- Business Name
- Email Address
- Phone Number
- Business Location
- National ID Number (for security)
- ID Photo Upload (image file)
- Password

**How it works:**
- Seller account data is saved to browser's localStorage
- Each seller gets their own dashboard
- Sellers can start adding products immediately
- ID photo is stored with the seller profile

### 📦 **Seller Dashboard**
Complete product management system where sellers can:

**View Their Store Info:**
- Business name and ID photo displayed prominently
- Location, phone, and email visible
- Professional profile display

**Add Products:**
- Product name
- Price (with decimal support)
- Product image (upload image file)
- Product description
- Create as many products as needed

**Manage Products:**
- View all products in a beautiful grid layout
- Edit product details (name, price, image, description)
- Delete products from inventory
- Real-time updates with localStorage

**Seller Profile Display:**
- Unique seller profile with ID photo and business details
- All products displayed in organized grid
- Contact information prominently shown

### 🛍️ **Marketplace (Buyer View)**
Browse and discover sellers:

**Search Functionality:**
- Search sellers by business name
- Search by location
- Real-time filtering

**Seller Listings:**
- Each seller displayed as a card with:
  - ID photo
  - Business name
  - Owner name
  - Location
  - Phone and email
  - Preview of first 3 products

**Product Cards:**
- Product image
- Product name
- Price display
- Product description
- Easy navigation to full seller store

### 👤 **Seller Profile Page**
Full seller store view with:
- Large seller information display
- Complete ID photo and verification details
- All products in inventory
- Contact information readily available
- Product cards showing:
  - Image
  - Name
  - Description
  - Price
  - Contact seller button

---

## Technical Features

### Data Storage
- **localStorage API** for persistent data storage
- Buyers stored as JSON objects
- Sellers stored with product inventory
- Current user session tracking
- All data persists even after browser restart

### Data Structure

**Buyer Object:**
```javascript
{
  id: timestamp,
  name: "Full Name",
  email: "email@example.com",
  phone: "phone number",
  location: "address",
  idnumber: "ID number",
  password: "password",
  registeredAt: "ISO date string"
}
```

**Seller Object:**
```javascript
{
  id: timestamp,
  name: "Owner Name",
  businessName: "Business Name",
  email: "email@example.com",
  phone: "phone number",
  location: "location",
  idnumber: "ID number",
  idphoto: "base64 image data",
  password: "password",
  products: [
    {
      id: timestamp,
      name: "Product Name",
      price: 99.99,
      image: "base64 image data",
      description: "Product description"
    }
  ],
  registeredAt: "ISO date string"
}
```

### Routing
- **Home** (`/`) - Landing page
- **Buyer Register** (`/buyer-register`) - Buyer registration form
- **Seller Register** (`/seller-register`) - Seller registration form
- **Seller Dashboard** (`/seller-dashboard`) - Seller product management
- **Marketplace** (`/marketplace`) - Browse sellers
- **Seller Profile** (`/seller/:id`) - Individual seller store

---

## How to Use

### For Sellers:

1. **Register as Seller**
   - Click "Register as Seller" on home page
   - Fill in all required information
   - Upload your ID photo
   - Click "Register as Seller"

2. **Add Products**
   - You'll be redirected to your dashboard
   - Click "+ Add Product" button
   - Upload product image
   - Enter product name and price
   - Add optional description
   - Click "Add Product"

3. **Manage Products**
   - View all your products on the dashboard
   - Click "Edit" to modify product details
   - Click "Delete" to remove a product
   - Changes are saved immediately

4. **View Your Store**
   - Go to Marketplace to see your store listed
   - Click "View Full Store" to see your complete storefront
   - Buyers can view your ID verification
   - Buyers can contact you via the information shown

### For Buyers:

1. **Register as Buyer**
   - Click "Register as Buyer" on home page
   - Fill in your information
   - Provide National ID for security
   - Click "Register as Buyer"

2. **Browse Marketplace**
   - Click "Browse Products" in navigation
   - See all registered sellers
   - Search for specific sellers by name or location
   - View products preview from each seller

3. **Visit a Seller's Store**
   - Click "View Full Store" to see complete inventory
   - See seller's verified ID information
   - View all products with prices and descriptions
   - Click "Contact Seller" to see their phone and email

---

## Security Features

- **National ID Verification**: Both buyers and sellers must provide ID numbers
- **ID Photo for Sellers**: Sellers must upload their ID photo for trust and verification
- **localStorage Privacy**: Data is stored locally in the browser
- **User Sessions**: Current user is tracked for personalization
- **Password Protection**: Accounts require passwords (note: stored in localStorage for demo)

---

## UI/UX Features

- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Beautiful Color Scheme**: Professional red and gray color palette
- **Smooth Animations**: Hover effects and transitions
- **Icon Support**: Emoji icons for easy navigation and visual appeal
- **Form Validation**: Required fields ensure data completeness
- **Image Preview**: Upload previews before submission
- **Grid Layouts**: Products displayed in organized card grids
- **Search Functionality**: Easy seller discovery
- **Navigation**: Sticky navbar for easy access

---

## Browser Storage
All data is stored in the browser's localStorage, which means:
- Data persists when you close and reopen the browser
- Data is specific to this domain
- You can clear data through browser settings
- No server backend required for this demo version

---

## Future Enhancements (Optional)

- Backend server integration with database
- Real payment processing
- Product ratings and reviews
- Seller ratings and testimonials
- Direct messaging between buyers and sellers
- Order tracking
- Wishlist functionality
- Advanced search filters
- Product categories
- Multi-language support
- Admin dashboard

---

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5174/` (or the next available port)

---

## File Structure

```
src/
├── pages/
│   ├── Home.vue
│   ├── BuyerRegister.vue
│   ├── SellerRegister.vue
│   ├── SellerDashboard.vue
│   ├── Marketplace.vue
│   └── SellerProfile.vue
├── components/
│   └── HelloWorld.vue
├── App.vue
├── main.js
├── router.js
└── style.css
```

---

## Technology Stack

- **Framework**: Vue 3
- **Build Tool**: Vite
- **Routing**: Vue Router
- **Storage**: Browser localStorage
- **Styling**: CSS 3 with responsive design
- **Image Handling**: Base64 encoding for image storage

---

## Testing the Application

1. **Register a Seller**
   - Go to home page
   - Click "Register as Seller"
   - Fill in sample data
   - Upload a sample image

2. **Add Products**
   - After registration, you'll be on the dashboard
   - Add 2-3 sample products with images

3. **Browse as Buyer**
   - Open a new browser tab or use incognito mode
   - Go to home page
   - Click "Browse Products" or "Register as Buyer"
   - See your seller listed in the marketplace
   - Click "View Full Store" to see all products

4. **Test Seller Management**
   - Go back to seller dashboard
   - Edit a product (change name or price)
   - Delete a product
   - Verify changes appear in the marketplace

---

## Notes

- All data is stored locally in the browser's localStorage
- Perfect for testing and demonstration purposes
- Easy to extend with backend integration
- Mobile-friendly and responsive
- No external API dependencies
- Fast loading times

---

**Enjoy using Kigali Great Market!** 🏪🌟
