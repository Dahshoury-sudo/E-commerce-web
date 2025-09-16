import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye,
  Plus
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    await addItem(product.id, 1);
    setIsLoading(false);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }

    setIsLoading(true);
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    setIsLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="product-card group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.img_url || '/images/default_product.png'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/images/default_product.png';
            }}
          />
          
          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{product.discount}%
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="p-2 bg-white text-gray-600 hover:text-primary-600 rounded-full shadow-lg transition-colors"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Quick View Button */}
          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-center space-x-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Quick View</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Categories */}
          {product.categories && product.categories.length > 0 && (
            <p className="text-xs text-gray-500">
              {product.categories.join(', ')}
            </p>
          )}

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {renderStars(product.average_rating)}
              </div>
              <span className="text-sm text-gray-500">
                ({product.average_rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.final_price)}
            </span>
            {product.original_price && product.original_price > product.final_price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 10 
                ? 'bg-green-100 text-green-800' 
                : product.stock > 0 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
            
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
