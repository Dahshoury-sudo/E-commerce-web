import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  CreditCard, 
  Truck, 
  MapPin,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, clearCart, fetchCartItems } = useCartStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      full_name: user?.username || '',
      email: user?.email || '',
      phone_number: '',
      full_address: '',
      country: '',
      order_notes: '',
      payment_method: 'credit_card',
    },
  });

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      await ordersAPI.placeOrder(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Order placement failed:', error);
      const message = error.response?.data?.error || 'Failed to place order';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const shippingCost = totalPrice >= 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg mb-4">Your cart is empty</div>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8">
          {/* Billing Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary-600" />
              Billing Information
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('full_name', { required: 'Full name is required' })}
                    type="text"
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone_number', { required: 'Phone number is required' })}
                    type="tel"
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input-field"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  {...register('full_address', { required: 'Address is required' })}
                  rows={3}
                  className="input-field"
                  placeholder="Enter your complete address"
                />
                {errors.full_address && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register('country', { required: 'Country is required' })}
                  className="input-field"
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="other">Other</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes
                </label>
                <textarea
                  {...register('order_notes')}
                  rows={3}
                  className="input-field"
                  placeholder="Any special instructions or notes for your order"
                />
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                  Payment Method
                </h3>

                <div className="space-y-3">
                  {[
                    { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                    { value: 'debit_card', label: 'Debit Card', icon: CreditCard },
                    { value: 'paypal', label: 'PayPal', icon: CreditCard },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        {...register('payment_method')}
                        type="radio"
                        value={method.value}
                        className="mr-3"
                      />
                      <method.icon className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex items-center space-x-4">
                  <img
                    src={item.img_url || '/images/default_product.png'}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/images/default_product.png';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Price Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                <span className="text-gray-900">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    formatPrice(shippingCost)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatPrice(tax)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Secure SSL encrypted checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>Free shipping on orders over $50</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
