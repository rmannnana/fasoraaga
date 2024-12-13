from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from manageproducts.models import Shop
from .forms import ShopCreationForm


@login_required
def myaccount(request):
    return render(request, 'myaccount/myaccount.html')


@login_required
def create_shop(request):
    return render(request, 'myaccount/create_shop.html')

@login_required
def create_shop(request):
    if request.method == 'POST':
        form = ShopCreationForm(request.POST, request.FILES)
        if form.is_valid():
            shop = form.save(commit=False)
            shop.owner = request.user  # Associer la boutique à l'utilisateur connecté
            shop.save()
            # Mettre à jour l'utilisateur pour indiquer qu'il a une boutique
            request.user.haveShop = True
            request.user.save()
            return redirect('shopView')  # Redirige vers la page de gestion de la boutique
    else:
        form = ShopCreationForm()

    return render(request, 'myaccount/create_shop.html', {'form': form})