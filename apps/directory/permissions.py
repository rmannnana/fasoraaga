from rest_framework import permissions


class IsEnterpriseOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner = getattr(obj, "owner", None) or getattr(getattr(obj, "enterprise", None), "owner", None)
        return request.user.is_authenticated and (request.user.is_staff or owner == request.user)
