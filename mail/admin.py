from django.contrib import admin

from .models import User, Email

class EmailsAdmin(admin.ModelAdmin):
    list_display = ("user", "sender", "subject", "body", "timestamp","read", "archived")
# Register your models here.
admin.site.register(User)
admin.site.register(Email,EmailsAdmin)