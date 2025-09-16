import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Illustration */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl font-bold text-primary-600 mb-4"
          >
            404
          </motion.div>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/products"
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Browse Products</span>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Cart
            </Link>
            <Link
              to="/wishlist"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Wishlist
            </Link>
            <Link
              to="/profile"
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
