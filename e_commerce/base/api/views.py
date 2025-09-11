from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsCreator,UnAuthenticated
from rest_framework.permissions import IsAdminUser,IsAuthenticated,AllowAny
from django.contrib.auth import authenticate,login,logout
from base import models
from . serializers import ProductSerializer



@api_view(['POST'])
@permission_classes([UnAuthenticated])
def register(request):
    email = request.data.get('email').strip()
    password1 = request.data.get('password1').strip()
    password2 = request.data.get('password2').strip()
    username = request.data.get('username').strip()

    if password1 != password2:
        return Response({"error":"passwords doesn't match"},status=status.HTTP_400_BAD_REQUEST)
    
    if models.User.objects.filter(username=username).exists():
        return Response({"error":"username already exists"},status=status.HTTP_400_BAD_REQUEST)
    
    if models.User.objects.filter(email=email).exists():
        return Response({"error":"email already exists"},status=status.HTTP_400_BAD_REQUEST)


    try:
        user = models.User.objects.create_user(
        username = username,
        email = email,
        password= password1,
        )

        return Response({"message":"user created"},status=status.HTTP_201_CREATED)
    
    except:
        return Response({"error":"error occurred try again"})




@api_view(['GET'])
@permission_classes([IsCreator])
def get_all_products(request):
    products = models.Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response({"products":serializer.data},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_item_to_cart(request):
    user = request.user
    product_id = request.data.get('product_id')
    product_quantity = int(request.data.get('product_quantity'))

    product = models.Product.objects.get(id = product_id)
    
    cart,cart_created = models.Cart.objects.get_or_create(customer = user)
    cart_item,item_created = models.CartItem.objects.get_or_create(cart = cart,product=product,defaults={"quantity":product_quantity,"price":product.final_price})

    if not item_created:
        cart_item.quantity += product_quantity
        cart_item.save()
        print(cart_item.subtotal)

    return Response({"message":"item added to cart"},status=status.HTTP_201_CREATED)

