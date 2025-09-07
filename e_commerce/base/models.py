from django.db import models
from django.contrib.auth.models import AbstractUser
import random

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20,blank=True,null=True,unique=True)




class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name



class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8,decimal_places=2)
    stock = models.PositiveIntegerField()
    categories = models.ManyToManyField(Category,related_name='products',blank=True)
    img = models.ImageField(null=True,default='default_product.png')

    def __str__(self):
        return self.name



class Order(models.Model):
    customer = models.ForeignKey(User,on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    @property
    def total_price(self):
        return sum(item.quantity * item.price for item in self.items.all())
    
    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("paid", "Paid"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
    ("cancelled", "Cancelled"),
]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
 
    def __str__(self):
        return self.customer.username if self.customer else "Guest Cart"



class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return self.product.name        



class Payment(models.Model):
    customer = models.ForeignKey(User,on_delete=models.CASCADE,related_name='payments')
    order = models.OneToOneField(Order,on_delete=models.CASCADE,related_name='payment')
    amount = models.DecimalField(decimal_places=2,max_digits=10,default=50)

    METHOD_CHOICES = [
        ("credit_card","Credit Card"),
        ("debit_card","Debit Card"),
        ("cash","Cash"),
        ("paypal","PayPal"),
        ("bank_transfer","Bank Transfer")
    ]

    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("paid", "Paid"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
    ("cancelled", "Cancelled"),
    ]

    method = models.CharField(max_length=50,choices=METHOD_CHOICES)
    status = models.CharField(max_length=50,choices=STATUS_CHOICES,default='pending')
    created = models.DateTimeField(auto_now_add = True)
    updated = models.DateTimeField(auto_now = True)
    transaction_id = models.CharField(max_length=100, null=True, unique=True)

    def __str__(self):
        return self.customer.username if self.customer else "Guest Cart" 




class Cart(models.Model):
    customer = models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    created = models.DateTimeField(auto_now_add=True)
    @property
    def total_price(self):
        return sum(item.quantity * item.price for item in self.items.all())

    def __str__(self):
        return self.customer.username if self.customer else "Guest Cart"




class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=8,decimal_places=2)

    def __str__(self):
        return self.product.name

    



