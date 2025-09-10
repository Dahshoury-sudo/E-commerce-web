from decouple import config
import os
my_secret = config('SECRET_KEY')
print(type(my_secret))