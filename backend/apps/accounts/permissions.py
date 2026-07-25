from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrAdmin(BasePermission):
    """Permission to check if user is owner or admin."""
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or request.user == obj.user or request.user.role == 'admin'


class IsAdmin(BasePermission):
    """Permission to check if user is admin."""
    message = "Only administrators can perform this action."
    
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.role == 'admin')


class IsAdminOrReadOnly(BasePermission):
    """Permission to allow read-only access to anyone, write access to admins."""
    
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and (request.user.is_staff or request.user.role == 'admin')


class IsStandardUser(BasePermission):
    """Permission to check if user is a standard user."""
    message = "Only standard users can perform this action."
    
    def has_permission(self, request, view):
        return request.user and request.user.role == 'user'
