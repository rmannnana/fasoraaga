from django import forms
from .models import Product
from .models import Shop

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'stock', 'image']  # Inclure le champ image
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom de l\'article'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'price': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Prix'}),
            'stock': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Quantité en stock'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }

class ShopUpdateForm(forms.ModelForm):
    class Meta:
        model = Shop
        fields = ['name', 'description', 'location', 'logo']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom de la Boutique'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'location': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Localisation'}),
            'logo': forms.FileInput(attrs={'class': 'form-control'}),
        }

class ProductUpdateForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'stock', 'image']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nom de l\'article'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description'}),
            'price': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Prix'}),
            'stock': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Quantité en stock'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
        }