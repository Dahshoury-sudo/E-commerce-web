import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Trash2,
  ArrowLeft,
  Plus
} from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const navigate = useNavigate();
  const { 
    items, 
    isLoading, 
    fetchWishlistItems, 
    removeItem 
  } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistItems();
    }
  }, [isAuthenticated, fetchWishlistItems]);

  const handleAddToCart = async (product) => {
    const result = await addItem(product.product_id, 1);
    if (result.success) {
      await removeItem(product.product_id);
      toast.success('Added to cart and removed from wishlist');
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    await removeItem(productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">
            Please login to view your wishlist and save your favorite items.
          </p>
          <div className="space-x-4">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/products" className="btn-outline">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading wishlist..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-600 mb-8">
            Save items you love by clicking the heart icon on any product.
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          My Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.product_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="relative mb-4">
              <Link to={`/product/${item.product_id}`}>
                <img
                  src={item.img_url || '/images/default_product.png'}
                  alt="Product"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/images/default_product.png';
                  }}
                />
              </Link>
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemoveFromWishlist(item.product_id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <Link
                to={`/product/${item.product_id}`}
                className="block"
              >
                <h3 className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2">
                  Product Name
                </h3>
              </Link>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(item.final_price)}
                </span>
                {item.original_price && item.original_price > item.final_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.original_price)}
                  </span>
                )}
              </div>

              {/* Discount Badge */}
              {item.discount && item.discount > 0 && (
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  -{item.discount}%
                </span>
              )}

              {/* Rating */}
              {item.average_rating > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.average_rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({item.average_rating.toFixed(1)})
                  </span>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full btn-primary flex items-center justify-center space-x-2 mt-4"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-12 text-center">
        <Link
          to="/products"
          className="btn-outline inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
