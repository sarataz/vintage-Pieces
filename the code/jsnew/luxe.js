function changeTheme() {
    var currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'red') {
        setTheme('pink');
    } else {
        setTheme('red');
    }
}

function setTheme(theme) {
    localStorage.setItem("theme", theme);
    document.documentElement.className = theme;
}

function sortItems() {
    if (document.getElementsByName("filter")[0].value == "reload") {
        window.location.reload();
        return;
    }
    
    var table, rows, switching, i, x, y, shouldSwitch;
    data = document.getElementsByClassName("Products");
    var increasing = document.getElementsByName("filter")[0].value == "inc";

    for (var j = 0; j < data.length; j++) {
      table = data[j];
  
      switching = true;
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.children;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 0; i < (rows.length - 1); i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;
          /* Get the two elements you want to compare,
          one from current row and one from the next: */
          x = $(rows[i]).data('price');
          y = $(rows[i + 1]).data('price');
          // Check if the two rows should switch place:
          if (increasing && Number(x) > Number(y) || !increasing && Number(x) < Number(y)) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
  }

$(".add").click(function() {
    var image = $(this).siblings('img').attr('src');
    var name = $(this).siblings('h3').html();
    var price = $(this).parent().data('price');

    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({
        id: cart.length + 1,
        name,
        image,
        price
    });
    localStorage.setItem('cart', JSON.stringify(cart));
});

$(".slideAction").click(function() {
    var sibling = $(this).siblings('.slidedown');
    if (sibling.css('display') == 'none')
        $(this).siblings('.slidedown').slideDown();
    else
        $(this).siblings('.slidedown').slideUp();
});

$(document).ready(function () {
    setTheme(localStorage.getItem("theme"));
    refreshCart();
});

function refreshCart() {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    var cartBody = $('.cart-products');
    cartBody.html('');

    var sum = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        sum += item.price;

        cartBody.append(newProduct(item.id, item.image, item.name, item.price));
    }

    $('#total-price').html(sum + " SR");
    $('#number-of-products').html(cart.length);

    if (cart.length == 0) {
        $(".removeall").remove();
        $("#CC").remove();
    }
}

function remove(id) {
    $('[data-id="' + id + '"]').remove();
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(c => c.id != id);
    localStorage.setItem('cart', JSON.stringify(cart));

    refreshCart();
}

function removeAll() {
    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < cart.length; i++) {
        remove(cart[i].id);
    }
}

function changeTotal() {
  var cart = JSON.parse(localStorage.getItem('cart') || '[]');
  var total = 0;

  $(".cart-item-quantity").each(function(el, ind) {
    var value = $(ind).val();

    if (value < 1 || value > 12 || isNaN(value)) {
        // do nothing
    } else {
      total += cart[el].price * parseInt(value);
    }
  });
  $('#total-price').html(total + " SR");
}

function proceed() {
    var failed = false;

    $(".cart-item-quantity").each(function(el, ind) {
        var value = $(ind).val();
        if (value < 1 || value > 12 || isNaN(value)) {
            alert('Please select correct quantities! (More than 0 and less than 12).');
            failed = true;
        }
    });

    if (failed)
        return;

    var cart = JSON.parse(localStorage.getItem('cart') || '[]');
    var total = 0;
    invoice = $(
      '<div class="order-table"><table><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody></tbody></table></div>'
    );
  
    for (var i = 0; i < cart.length; i++) {
      item_name = cart[i].name;
      item_quantity = $("#qnt-" + cart[i].id).val();
      item_price = parseInt(item_quantity) * parseInt(cart[i].price);
      total += item_price;
      tr = $(
        "<tr><td>" +
          item_name +
          "</td><td>" +
          item_quantity +
          "</td><td>" +
          item_price +
          " SR</td></tr>"
      );
      tr.appendTo(invoice.find("tbody"));
    }
  
    tr = $("<tr><td>Total</td><td>" + total + " SR</td><td></td></tr>");
    tr.appendTo(invoice.find("tbody"));
  
    var win = window.open("", "Print-Window");
  
    win.document.open();
  
    win.document.write(
      '<html><body onload="window.print()">' + invoice.html() + "</body></html>"
    );
  
    win.document.close();
  
    setTimeout(function () {
      win.close();
    }, 10);
  
    removeAll();
}

function newProduct(id, image, name, price) {
    return '<div class="product" data-id="' + id + '">'
    + '    <img src="' + image + '">'
    + '    <div class="product-info">'
    + '        <h3 class="product-name">' + name + '</h3>'
    + '        <h4 class="product-price">' + price + ' SR</h4>'
    + '        <p class="product-quantity">Qnt: <input type="number" value="1" onchange="changeTotal()" class="cart-item-quantity" id="qnt-' + id + '">'
    + '        <a class="product-remove" onclick="remove('+ id + ')">'
    + '            <i class="fa fa-trash" aria-hidden="true"></i>'
    + '            <span class="remove">Remove</span>'
    + '        </a>'
    + '    </div>'
    + '</div>'
}

$(".menu-btn").click(function() {
  if ($("ul.nav").css('display') == 'block')
    $("ul.nav").slideUp();
  else
    $("ul.nav").slideDown();
});