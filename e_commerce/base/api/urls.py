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

]
