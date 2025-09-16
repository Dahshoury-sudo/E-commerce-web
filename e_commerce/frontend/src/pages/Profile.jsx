import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  Settings,
  LogOut,
  Edit3,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Cart Items', value: totalItems, icon: ShoppingBag },
    { label: 'Wishlist Items', value: wishlistItems.length, icon: Heart },
    { label: 'Orders Placed', value: 0, icon: Package },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-100 p-3 rounded-full">
                        <stat.icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Added items to cart</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Added items to wishlist</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="h-6 w-6 text-primary-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">View Cart</div>
                      <div className="text-sm text-gray-600">{totalItems} items</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="h-6 w-6 text-red-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">View Wishlist</div>
                      <div className="text-sm text-gray-600">{wishlistItems.length} items</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => navigate('/products')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Package className="h-6 w-6 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Browse Products</div>
                      <div className="text-sm text-gray-600">Shop now</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Order History</div>
                      <div className="text-sm text-gray-600">View orders</div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-500 text-lg mb-4">No orders yet</div>
                <p className="text-gray-400 mb-8">Start shopping to see your order history here</p>
                <button
                  onClick={() => navigate('/products')}
                  className="btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wishlist</h2>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="btn-outline"
                >
                  View All
                </button>
              </div>
              
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-500 text-lg mb-4">No wishlist items</div>
                  <p className="text-gray-400 mb-8">Save items you love by clicking the heart icon</p>
                  <button
                    onClick={() => navigate('/products')}
                    className="btn-primary"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistItems.slice(0, 6).map((item) => (
                    <div key={item.product_id} className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={item.img_url || '/images/default_product.png'}
                        alt="Product"
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          e.target.src = '/images/default_product.png';
                        }}
                      />
                      <h3 className="font-medium text-gray-900 line-clamp-2">Product Name</h3>
                      <p className="text-primary-600 font-semibold mt-1">
                        ${item.final_price}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={user?.username || ''}
                        disabled
                        className="input-field bg-gray-50"
                      />
                      <button className="btn-outline">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input-field bg-gray-50"
                      />
                      <button className="btn-outline">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="space-y-4">
                  <button className="btn-outline w-full text-left">
                    Change Password
                  </button>
                  <button className="btn-outline w-full text-left">
                    Notification Preferences
                  </button>
                  <button className="btn-outline w-full text-left">
                    Privacy Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
