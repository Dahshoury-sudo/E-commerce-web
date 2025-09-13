from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from base.models import Product,Review,WishList

class ProductSerializer(ModelSerializer):
    img_url = serializers.SerializerMethodField()
    average_rating = serializers.FloatField(read_only=True)  # comes from @property
    categories = serializers.StringRelatedField(many=True)  # 👈 uses __str__ from Category
    tags = serializers.StringRelatedField(many=True)   # 👈 uses __str__ from Tag
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_img_url(self, obj):
        return obj.img.url if obj.img else None


class RecentReviewSerializer(ModelSerializer):
    customer = serializers.StringRelatedField()
    product = serializers.StringRelatedField()
    class Meta:
        model = Review
        fields = '__all__'



class WishListSerializer(ModelSerializer):
    class Meta:
        model = WishList
        fields = '__all__'