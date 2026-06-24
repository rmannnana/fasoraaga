from django.contrib import admin

from .models import ContactRequest, Conversation, Favorite, Message, Notification


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user", "enterprise", "product", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "enterprise__name", "product__name"]


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ["sender", "receiver", "status", "created_at", "responded_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["sender__name", "receiver__name", "message"]


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    inlines = [MessageInline]
    list_display = ["contact_request", "created_at", "updated_at"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["conversation", "sender", "is_read", "created_at"]
    list_filter = ["is_read", "created_at"]
    search_fields = ["sender__email", "content"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["user", "title", "type", "is_read", "created_at"]
    list_filter = ["type", "is_read", "created_at"]
    search_fields = ["user__email", "title", "content"]
