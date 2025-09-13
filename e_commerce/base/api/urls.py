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
    path('recent-reviews/',views.get_recent_reviews),
    path('add-item-to-wishlist/<str:pk>',views.add_item_to_wishlist),
    path('remove-item-from-wishlist/<str:pk>',views.remove_item_from_wishlist),

]
