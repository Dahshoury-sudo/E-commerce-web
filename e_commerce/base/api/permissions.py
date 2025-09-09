from rest_framework.permissions import BasePermission
from base.models import User
    

class IsCreator(BasePermission):
    message = 'you are not allowed here yasta only mahmoud and mohamed' # this shows as response if the condition returned false
    def has_permission(self, request,view):
        if request.user.is_authenticated:
            return request.user.email in ['mohamed1@gmail.com','mohamed@gmail.com']
        else:
            return False