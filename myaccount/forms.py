from django import forms
from manageproducts.models import Shop

class ShopCreationForm(forms.ModelForm):
    class Meta:
        model = Shop
        fields = ['name', 'description', 'location', 'logo']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom de la Boutique'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'location': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Localisation'}),
            'logo': forms.FileInput(attrs={'class': 'form-control'}),
        }
