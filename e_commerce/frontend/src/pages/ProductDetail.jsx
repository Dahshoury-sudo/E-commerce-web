import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus,
  Truck,
  RotateCcw,
  Shield,
  Share2,
  ArrowLeft
} from 'lucide-react';
import { productsAPI, reviewsAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productsAPI.getById(id);
        setProduct(response.data.product);
        
        // Fetch reviews for this product (you might need to create this API endpoint)
        // const reviewsResponse = await reviewsAPI.getByProduct(id);
        // setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    const result = await addItem(product.id, quantity);
    if (result.success) {
      setQuantity(1);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
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
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">Product not found</div>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const images = [product.img_url].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[selectedImage] || '/images/default_product.png'}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/default_product.png';
              }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/images/default_product.png';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Products</span>
            <span>/</span>
            {product.categories && product.categories.length > 0 && (
              <>
                <span>{product.categories[0]}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product.name}</span>
          </div>

          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(product.average_rating)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.average_rating.toFixed(1)}) • 0 reviews
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(product.final_price)}
            </span>
            {product.original_price && product.original_price > product.final_price && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
                {product.discount && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
                    -{product.discount}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Categories & Tags */}
          <div className="space-y-2">
            {product.categories && product.categories.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Categories:</span>
                <div className="flex flex-wrap gap-1">
                  {product.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              product.stock > 10 
                ? 'text-green-600' 
                : product.stock > 0 
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
            <span className="text-sm text-gray-500">
              ({product.stock} available)
            </span>
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            )}
            
            <button
              onClick={handleWishlistToggle}
              className={`btn-outline flex items-center justify-center space-x-2 ${
                isWishlisted 
                  ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                  : ''
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
            </button>
            
            <button className="btn-secondary flex items-center justify-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <Truck className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Free Shipping</div>
                <div className="text-xs text-gray-500">On orders over $50</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <RotateCcw className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Easy Returns</div>
                <div className="text-xs text-gray-500">30-day return policy</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <div className="font-medium text-sm">Secure Payment</div>
                <div className="text-xs text-gray-500">100% secure checkout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="text-gray-500">No reviews yet</div>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to review this product
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
