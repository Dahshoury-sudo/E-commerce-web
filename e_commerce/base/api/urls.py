from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #########################################################################
    
    path('products/',views.get_all_products),
    path('signup/',views.register),
    path('add-item/',views.add_item_to_cart),
    path('remove-item-from-cart/',views.remove_item_from_cart),
    path('edit-cart/',views.edit_cart),
    path('add-item-to-wishlist',views.add_item_to_wishlist),
    path('remove-item-from-wishlist',views.remove_item_from_wishlist),
    path('recent-reviews/',views.get_recent_reviews),

]

urlpatterns = [
    # Auth
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/signup/',views.register),

    # Product
    path('products/',views.get_all_products),
    
    # Cart
    path('cart/add/',views.add_item_to_cart),
    path('cart/remove/',views.remove_item_from_cart),
    path('cart/edit/',views.edit_cart),

    # Wishlist
    path('wishlist/add/',views.add_item_to_wishlist),
    path('wishlist/remove/',views.remove_item_from_wishlist),

    # Review
    path('reviews/recent/',views.get_recent_reviews),

]
