from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ContactRequest, Conversation, Favorite, Message, Notification
from .serializers import (
    ContactRequestSerializer,
    ConversationSerializer,
    FavoriteSerializer,
    MessageSerializer,
    NotificationSerializer,
    accept_contact_request,
)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related("enterprise", "product", "product__enterprise", "product__category")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ContactRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status"]

    def get_queryset(self):
        enterprise = getattr(self.request.user, "enterprise", None)
        if enterprise is None:
            return ContactRequest.objects.none()
        return ContactRequest.objects.filter(Q(sender=enterprise) | Q(receiver=enterprise)).select_related("sender", "receiver")

    def perform_create(self, serializer):
        sender = self.request.user.enterprise
        contact_request = serializer.save(sender=sender)
        Notification.objects.create(
            user=contact_request.receiver.owner,
            title="Nouvelle demande de contact",
            content=f"{sender.name} souhaite entrer en relation avec votre entreprise.",
            type=Notification.Type.CONTACT_REQUEST,
        )

    def _ensure_receiver(self, contact_request):
        enterprise = getattr(self.request.user, "enterprise", None)
        return enterprise is not None and contact_request.receiver == enterprise

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        contact_request = self.get_object()
        if not self._ensure_receiver(contact_request):
            return Response({"detail": "Action reservee a l'entreprise destinataire."}, status=status.HTTP_403_FORBIDDEN)
        if contact_request.status != ContactRequest.Status.PENDING:
            return Response({"detail": "Cette demande a deja ete traitee."}, status=status.HTTP_400_BAD_REQUEST)
        conversation = accept_contact_request(contact_request)
        return Response(ConversationSerializer(conversation, context={"request": request}).data)

    @action(detail=True, methods=["post"])
    def decline(self, request, pk=None):
        contact_request = self.get_object()
        if not self._ensure_receiver(contact_request):
            return Response({"detail": "Action reservee a l'entreprise destinataire."}, status=status.HTTP_403_FORBIDDEN)
        if contact_request.status != ContactRequest.Status.PENDING:
            return Response({"detail": "Cette demande a deja ete traitee."}, status=status.HTTP_400_BAD_REQUEST)
        contact_request.status = ContactRequest.Status.DECLINED
        contact_request.responded_at = timezone.now()
        contact_request.save(update_fields=["status", "responded_at"])
        return Response(ContactRequestSerializer(contact_request, context={"request": request}).data)


class ConversationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        enterprise = getattr(self.request.user, "enterprise", None)
        if enterprise is None:
            return Conversation.objects.none()
        return (
            Conversation.objects.filter(Q(contact_request__sender=enterprise) | Q(contact_request__receiver=enterprise))
            .select_related("contact_request", "contact_request__sender", "contact_request__receiver")
            .prefetch_related("messages")
            .annotate(unread_count=Count("messages", filter=Q(messages__is_read=False) & ~Q(messages__sender=self.request.user)))
        )

    @action(detail=True, methods=["post"])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        serializer = MessageSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        message = serializer.save(conversation=conversation, sender=request.user)
        conversation.save(update_fields=["updated_at"])

        recipient_enterprise = conversation.contact_request.receiver
        if recipient_enterprise.owner == request.user:
            recipient_enterprise = conversation.contact_request.sender
        Notification.objects.create(
            user=recipient_enterprise.owner,
            title="Nouveau message",
            content=f"Vous avez recu un nouveau message dans une conversation FasoRaaga.",
            type=Notification.Type.NEW_MESSAGE,
        )
        return Response(MessageSerializer(message, context={"request": request}).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        conversation = self.get_object()
        Message.objects.filter(conversation=conversation, is_read=False).exclude(sender=request.user).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["type", "is_read"]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response(NotificationSerializer(notification, context={"request": request}).data)

    @action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)
