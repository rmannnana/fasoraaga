from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['firstname', 'lastname', 'telephone', 'mail', 'password1', 'password2']


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['firstname', 'lastname', 'telephone', 'mail']
        widgets = {
            'firstname': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Prénom'}),
            'lastname': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom'}),
            'telephone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Numéro de téléphone'}),
            'mail': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Adresse e-mail'}),
        }