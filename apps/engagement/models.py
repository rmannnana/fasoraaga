from django.conf import settings
from django.db import models

from apps.directory.models import Enterprise, Product


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    enterprise = models.ForeignKey(Enterprise, on_delete=models.CASCADE, null=True, blank=True, related_name="favorites")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name="favorites")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                check=(
                    (models.Q(enterprise__isnull=False) & models.Q(product__isnull=True))
                    | (models.Q(enterprise__isnull=True) & models.Q(product__isnull=False))
                ),
                name="favorite_targets_one_object",
            ),
            models.UniqueConstraint(fields=["user", "enterprise"], condition=models.Q(enterprise__isnull=False), name="unique_enterprise_favorite"),
            models.UniqueConstraint(fields=["user", "product"], condition=models.Q(product__isnull=False), name="unique_product_favorite"),
        ]


class ContactRequest(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "pending"
        ACCEPTED = "accepted", "accepted"
        DECLINED = "declined", "declined"

    sender = models.ForeignKey(Enterprise, on_delete=models.CASCADE, related_name="sent_contact_requests")
    receiver = models.ForeignKey(Enterprise, on_delete=models.CASCADE, related_name="received_contact_requests")
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.sender} -> {self.receiver} ({self.status})"


class Conversation(models.Model):
    contact_request = models.OneToOneField(ContactRequest, on_delete=models.CASCADE, related_name="conversation")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class Notification(models.Model):
    class Type(models.TextChoices):
        CONTACT_REQUEST = "contact_request", "contact request"
        CONTACT_ACCEPTED = "contact_accepted", "contact accepted"
        NEW_MESSAGE = "new_message", "new message"
        SYSTEM = "system", "system"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=160)
    content = models.TextField(blank=True)
    type = models.CharField(max_length=30, choices=Type.choices, default=Type.SYSTEM)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
