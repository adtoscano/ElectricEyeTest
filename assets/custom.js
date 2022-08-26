window.addEventListener('load', function () {
    updateDefaultOption();
});

function addItemToCart(type, productId, quantity)
{
    data = {
            "id": productId,
            "quantity": quantity
            }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() 
    {
        if (request.readyState === 4) 
        {
            if(this.status === 200)
            {
                addToCartSuccess(type, this);
            }
            else
            {
                addToCartFail(this);
            }
        }
    }

    request.open("POST", '/cart/add.js', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send(JSON.stringify(data));
}

function addToCartSuccess(type, obj) 
{ 
    if(type === true)
    {
        let cart = getCart();
console.log(cart);
        updateCartCounter(cart);
        showCartPopup(cart);
    }
    else
    {
        window.location.replace('/checkout');
    }
}

function addToCartFail(obj) 
{ 
   document.getElementById("div_error").style.display = 'block';
   document.getElementById("error_message").innerHTML = JSON.parse(obj.responseText).description;
 }

 function updateCartCounter(cart)
 {
    var element = document.getElementById("CartCount");
    element.classList.remove("hide");

    document.querySelector('[data-cart-count]').innerHTML = cart.item_count;
 }

 function getCart()
 {
    var request = new XMLHttpRequest(); 

    request.open("GET", '/cart.js', false);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    request.send();

    if (request.readyState === 4)
    {
        return JSON.parse(request.responseText);
    }

    return false;
 }

 function showCartPopup(cart)
 {
    document.getElementById("btn_popup_cart").innerHTML = "VIEW CART (" + cart.item_count + ")";
    document.getElementById("product_title").innerHTML = cart.items[0].product_title;
    document.getElementById("product_variant_title").innerHTML = cart.items[0].variant_title;
    document.getElementById("modal_product_image").src = cart.items[0].image;

    openModal();
 }

 function openModal()
 {
    let modal = document.getElementById("modal_add_to_cart");
    modal.classList.remove("hidden");
 }

function closeModal()
{
    let modal = document.getElementById("modal_add_to_cart");
    modal.classList.add("hidden");
}

function productVariantChanged(obj)
{
    var option = obj.options[obj.selectedIndex];

    let variantId = option.value;
    let image = option.getAttribute('data-image');
    let handle = option.getAttribute('data-handle');
    let price = option.getAttribute('data-price');
    let currency = option.getAttribute('data-currency');

    price = parseFloat(price / 100).toFixed(2).replaceAll('.', ',');

    const parentDiv = obj.parentNode;

    let productImage = parentDiv.querySelector('.grid-view-item__image');
    productImage.srcset = '';
    productImage.src = image;

    let productLink = parentDiv.querySelector('.grid-view-item__link');
    productLink.href = '{{ shop.url }}' + "/products/" + handle + "?variant=" + variantId;

    let productPrice = parentDiv.querySelector('.price-item');
    productPrice.innerHTML = "$" + price + " " + currency;
}

function updateDefaultOption()
{
    var selects = document.getElementsByClassName("custom_select");

    for (var i = 0; i < selects.length; i++)
    {
        var options = selects[i].options;

        for (var j = 0; j < options.length; j++)
        {
            if(options[j].disabled === false)
            {
                selects[i].selectedIndex = j;
                productVariantChanged(selects[i]);
                return;
            }
        }
    }
}

function getSelectedVariant()
{
    alert('get variant!!!!');

    return 43233745699073;
}