from django.utils import timezone
from rest_framework import serializers

from apps.directory.models import Enterprise
from apps.directory.serializers import EnterpriseSerializer, ProductSerializer

from .models import ContactRequest, Conversation, Favorite, Message, Notification


class FavoriteSerializer(serializers.ModelSerializer):
    enterprise_detail = EnterpriseSerializer(source="enterprise", read_only=True)
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "user", "enterprise", "enterprise_detail", "product", "product_detail", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def validate(self, attrs):
        enterprise = attrs.get("enterprise")
        product = attrs.get("product")
        if bool(enterprise) == bool(product):
            raise serializers.ValidationError("Choisissez soit une entreprise, soit un produit.")
        return attrs


class ContactRequestSerializer(serializers.ModelSerializer):
    sender_detail = EnterpriseSerializer(source="sender", read_only=True)
    receiver_detail = EnterpriseSerializer(source="receiver", read_only=True)

    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "sender",
            "sender_detail",
            "receiver",
            "receiver_detail",
            "message",
            "status",
            "created_at",
            "responded_at",
        ]
        read_only_fields = ["id", "sender", "status", "created_at", "responded_at"]

    def validate_receiver(self, value):
        request = self.context["request"]
        sender = getattr(request.user, "enterprise", None)
        if sender is None:
            raise serializers.ValidationError("Vous devez configurer votre entreprise avant d'envoyer une demande.")
        if value == sender:
            raise serializers.ValidationError("Vous ne pouvez pas contacter votre propre entreprise.")
        return value


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.get_full_name", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "sender_name", "content", "is_read", "created_at"]
        read_only_fields = ["id", "conversation", "sender", "sender_name", "is_read", "created_at"]


class ConversationSerializer(serializers.ModelSerializer):
    contact_request = ContactRequestSerializer(read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    unread_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "contact_request", "messages", "unread_count", "created_at", "updated_at"]
        read_only_fields = ["id", "contact_request", "messages", "unread_count", "created_at", "updated_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "user", "title", "content", "type", "is_read", "created_at"]
        read_only_fields = ["id", "user", "created_at"]


def accept_contact_request(contact_request):
    contact_request.status = ContactRequest.Status.ACCEPTED
    contact_request.responded_at = timezone.now()
    contact_request.save(update_fields=["status", "responded_at"])
    conversation, _ = Conversation.objects.get_or_create(contact_request=contact_request)
    Notification.objects.create(
        user=contact_request.sender.owner,
        title="Demande de contact acceptee",
        content=f"{contact_request.receiver.name} a accepte votre demande de contact.",
        type=Notification.Type.CONTACT_ACCEPTED,
    )
    return conversation
