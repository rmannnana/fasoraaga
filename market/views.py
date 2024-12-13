from django.shortcuts import render, get_object_or_404
from manageproducts.models import Product
from django.db.models import Q


def homeView(request):
    return render(request, 'market/home.html')


def marketplace(request):
    query = request.GET.get('q')  # Récupérer la requête de recherche depuis la barre de recherche
    if query:
        products = Product.objects.filter(
            Q(name__icontains=query) | Q(description__icontains=query)
        )
    else:
        products = Product.objects.all()  # Afficher tous les produits si aucune recherche

    return render(request, 'market/marketplace.html', {'products': products, 'query': query})


def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)  # Récupérer l'article par son ID
    return render(request, 'market/product_detail.html', {'product': product})
