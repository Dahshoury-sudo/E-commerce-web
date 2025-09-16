# E-Commerce Frontend

A modern, responsive e-commerce frontend built with React, Vite, and Tailwind CSS, connected to a Django REST API backend.

## Features

- 🛍️ **Product Catalog** - Browse products with filtering, search, and sorting
- 🛒 **Shopping Cart** - Add/remove items, quantity management
- ❤️ **Wishlist** - Save favorite products
- 👤 **User Authentication** - Login/register with JWT tokens
- 💳 **Checkout Process** - Complete order placement
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion
- 🔄 **Real-time Updates** - Zustand for state management

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── auth/           # Authentication components
│   │   ├── layout/         # Layout components (Header, Footer)
│   │   └── ui/             # UI components (ProductCard, LoadingSpinner)
│   ├── pages/              # Page components
│   │   ├── auth/           # Login/Register pages
│   │   ├── Home.jsx        # Homepage
│   │   ├── Products.jsx    # Product catalog
│   │   ├── ProductDetail.jsx # Product details
│   │   ├── Cart.jsx        # Shopping cart
│   │   ├── Wishlist.jsx    # Wishlist
│   │   ├── Checkout.jsx    # Checkout process
│   │   ├── Profile.jsx     # User profile
│   │   └── NotFound.jsx    # 404 page
│   ├── services/           # API services
│   │   └── api.js          # API configuration and endpoints
│   ├── store/              # State management
│   │   ├── authStore.js    # Authentication state
│   │   ├── cartStore.js    # Cart state
│   │   └── wishlistStore.js # Wishlist state
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## API Integration

The frontend connects to the Django backend through REST API endpoints:

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Products
- `GET /api/products/` - Get all products
- `POST /api/products/get/` - Get product by ID

### Cart
- `GET /api/cart/items/` - Get cart items
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/edit/` - Update cart item quantity
- `DELETE /api/cart/remove/` - Remove item from cart

### Wishlist
- `GET /api/wishlist/items/` - Get wishlist items
- `POST /api/wishlist/add/` - Add item to wishlist
- `DELETE /api/wishlist/remove/` - Remove item from wishlist

### Orders
- `POST /api/order/add/` - Place order
- `PATCH /api/order/cancel/` - Cancel order

### Reviews
- `GET /api/reviews/recent/` - Get recent reviews
- `POST /api/reviews/add/` - Add review

## State Management

The app uses Zustand for state management with three main stores:

### AuthStore
- User authentication state
- Login/logout functionality
- Token management

### CartStore
- Shopping cart items
- Cart operations (add, remove, update)
- Cart totals

### WishlistStore
- Wishlist items
- Wishlist operations (add, remove)

## Styling

The app uses Tailwind CSS for styling with:

- Custom color palette (primary, secondary)
- Responsive design utilities
- Component classes (btn-primary, btn-outline, etc.)
- Custom animations with Framer Motion

## Features Overview

### Product Catalog
- Grid/list view toggle
- Advanced filtering (category, price, rating)
- Search functionality
- Sorting options
- Pagination

### Shopping Cart
- Add/remove items
- Quantity management
- Price calculations
- Move to wishlist
- Persistent cart state

### User Authentication
- JWT-based authentication
- Automatic token refresh
- Protected routes
- Form validation

### Checkout Process
- Billing information form
- Order summary
- Payment method selection
- Order placement

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Adaptive layouts

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Environment Variables

Make sure to set the correct API URL for production:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Hosting Options

The built app can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
