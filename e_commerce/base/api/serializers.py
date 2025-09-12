from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
# from base.models import 
from base.models import Product

class ProductSerializer(ModelSerializer):
    categories = serializers.StringRelatedField(many=True)  # 👈 uses __str__ from Category
    tags = serializers.StringRelatedField(many=True)   # 👈 uses __str__ from Tag
    class Meta:
        model = Product
        fields = '__all__'


