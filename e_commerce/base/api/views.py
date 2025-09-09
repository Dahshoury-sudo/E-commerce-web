from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsCreator
from base import models
from . serializers import ProductSerializer
@api_view(['GET','POST'])
@permission_classes([IsCreator])
def get_all_products(request):
    products = models.Product.objects.all()
    serializer = ProductSerializer(products,many=True)

    return Response({"products":serializer.data},status=status.HTTP_200_OK)