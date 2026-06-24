from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Role, User


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    search_fields = ["name"]


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("FasoRaaga", {"fields": ("phone", "profile_picture", "bio", "role")}),
    )
    list_display = ["email", "first_name", "last_name", "role", "is_active", "date_joined"]
    list_filter = ["is_active", "role", "is_staff"]
    search_fields = ["email", "first_name", "last_name", "phone"]
