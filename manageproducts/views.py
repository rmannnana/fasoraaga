from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Order, OrderItem, Product, Shop
from .forms import ProductForm, ShopUpdateForm, ProductUpdateForm
from cart.models import Cart, CartItem

@login_required
def shopView(request):
    shop = get_object_or_404(Shop, owner=request.user)  # Récupérer la boutique de l'utilisateur connecté
    products = Product.objects.filter(shop=shop)  # Récupérer tous les produits de la boutique
    return render(request, 'manageproducts/manageshop.html', {'shop': shop, 'products': products})

@login_required
def add_product(request):
    # Logique pour ajouter un produit (à développer)
    return render(request, 'manageproducts/add_product.html')

@login_required
def edit_shop(request):
    # Logique pour modifier la boutique (à développer)
    return render(request, 'manageproducts/edit_shop.html')


@login_required
def add_product(request):
    # Vérifier si l'utilisateur a une boutique
    try:
        shop = Shop.objects.get(owner=request.user)  # Assurer la récupération correcte de la boutique
    except Shop.DoesNotExist:
        return redirect('create_shop')  # Rediriger si l'utilisateur n'a pas de boutique

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.shop = shop  # Associer le produit à la boutique récupérée
            product.save()  # Sauvegarder le produit avec la relation de boutique établie
            return redirect('shopView')  # Rediriger vers la page de gestion de la boutique
    else:
        form = ProductForm()

    return render(request, 'manageproducts/add_product.html', {'form': form})

@login_required
def edit_shop(request):
    shop = get_object_or_404(Shop, owner=request.user)  # Récupérer la boutique de l'utilisateur connecté

    if request.method == 'POST':
        form = ShopUpdateForm(request.POST, request.FILES, instance=shop)
        if form.is_valid():
            form.save()
            return redirect('shopView')  # Rediriger vers la page de gestion de la boutique après la mise à jour
    else:
        form = ShopUpdateForm(instance=shop)

    return render(request, 'manageproducts/edit_shop.html', {'form': form})

@login_required
def edit_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, shop__owner=request.user)

    if request.method == 'POST':
        form = ProductUpdateForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('shopView')  # Rediriger vers la page de gestion de la boutique après la mise à jour
    else:
        form = ProductUpdateForm(instance=product)

    return render(request, 'manageproducts/edit_product.html', {'form': form, 'product': product})

@login_required
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, shop__owner=request.user)
    product.delete()
    return redirect('shopView')

@login_required
def create_order(request):
    cart = Cart.objects.get(user=request.user)
    cart_items = cart.items.all()
    orders_dict = {}

    # Regrouper les articles par boutique
    for item in cart_items:
        shop_id = item.product.shop.id
        if shop_id not in orders_dict:
            orders_dict[shop_id] = []  # Créer une nouvelle liste pour cette boutique
        orders_dict[shop_id].append(item)

    # Créer des commandes pour chaque boutique
    for shop_id, items in orders_dict.items():
        shop = get_object_or_404(Shop, id=shop_id)
        order = Order.objects.create(user=request.user, shop=shop, total_amount=0)

        for item in items:
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
            order.total_amount += item.product.price * item.quantity

        order.save()

    # Vider le panier après avoir passé la commande
    cart.items.all().delete()

    return redirect('view_cart')

@login_required
def view_orders(request):
    shop = get_object_or_404(Shop, owner=request.user)
    orders = shop.orders.filter(status='pending')  # Afficher uniquement les commandes en attente
    return render(request, 'manageproducts/view_orders.html', {'orders': orders})

@login_required
def validate_cart(request):
    # Récupérer le panier de l'utilisateur
    cart = Cart.objects.get(user=request.user)
    cart_items = cart.items.all()
    orders_dict = {}

    # Regrouper les articles par boutique
    for item in cart_items:
        shop_id = item.product.shop.id  # Récupérer l'identifiant de la boutique
        if shop_id not in orders_dict:
            orders_dict[shop_id] = []  # Créer une nouvelle liste pour cette boutique
        orders_dict[shop_id].append(item)

    # Créer des commandes pour chaque boutique
    for shop_id, items in orders_dict.items():
        shop = get_object_or_404(Shop, id=shop_id)
        order = Order.objects.create(user=request.user, shop=shop, total_amount=0)

        for item in items:
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity, price=item.product.price)
            order.total_amount += item.product.price * item.quantity

        order.save()

    # Vider le panier après avoir passé la commande
    cart.items.all().delete()

    # Recharger la page avec un message de succès
    return render(request, 'cart/view_cart.html', {'cart_items': [], 'message': 'Votre commande a été validée avec succès ! Les boutiques concernées vous contacteront sous peu.'})

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, shop__owner=request.user)

    if request.method == 'POST' and 'validate_order' in request.POST:
        # Marquer la commande comme validée
        order.status = 'confirmed'
        order.save()
        return redirect('view_orders')

    return render(request, 'manageproducts/order_detail.html', {'order': order})