from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Role

User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(source="role", queryset=Role.objects.all(), required=False, allow_null=True, write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "profile_picture",
            "bio",
            "role",
            "role_id",
            "is_active",
            "date_joined",
            "updated_at",
        ]
        read_only_fields = ["id", "is_active", "date_joined", "updated_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    role_id = serializers.PrimaryKeyRelatedField(source="role", queryset=Role.objects.all(), required=False, allow_null=True)

    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone", "password", "role_id"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data["email"].lower()
        username = email
        user = User(username=username, email=email, **validated_data)
        user.set_password(password)
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])

    def validate_old_password(self, value):
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Ancien mot de passe incorrect.")
        return value
