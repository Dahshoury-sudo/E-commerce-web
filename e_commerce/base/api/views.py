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



@api_view(['POST'])
@permission_classes(UnAuthenticated)
def login(request):
    email = request.data.get('email').strip()
    password = request.data.get('password').strip()

    user = authenticate(request,email=email,password=password)

    if user == None:
        return Response({"message":"either the email or password is wrong"},status=status.HTTP_400_BAD_REQUEST)
    else:
        login(request,user)
        return Response({"message":"login successful"},status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsCreator])
def get_all_products(request):
    products = models.Product.objects.all()
    serializer = ProductSerializer(products,many=True)
    return Response({"products":serializer.data},status=status.HTTP_200_OK)

