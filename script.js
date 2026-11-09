const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const cartCount = document.getElementById("cartCount");
const noResults = document.getElementById("noResults");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutSection = document.getElementById("checkoutSection");
const backToCart = document.getElementById("backToCart");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutMessage = document.getElementById("checkoutMessage");

let cart = [];

try {
  const savedCart = localStorage.getItem("technestCart");

  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);

    if (Array.isArray(parsedCart)) {
      cart = parsedCart.filter(function (item) {
        return (
          typeof item.name === "string" &&
          typeof item.price === "number" &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0
        );
      });
    }
  }
} catch (error) {
  cart = [];
}

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function searchProducts() {
  const searchText = searchInput.value.trim().toLowerCase();
  const products = document.querySelectorAll(".product-card");
  let found = 0;

  products.forEach(function (product) {
    const isMatch = product.innerText.toLowerCase().includes(searchText);

    product.style.display = isMatch ? "" : "none";

    if (isMatch) {
      found++;
    }
  });

  noResults.hidden = found > 0;
}

searchButton.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchProducts();
  }
});

document.querySelectorAll(".add-to-cart").forEach(function (button) {
  button.addEventListener("click", function () {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingProduct = cart.find(function (item) {
      return item.name === name;
    });

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1,
      });
    }

    updateCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(function (item, index) {
    total += item.price * item.quantity;
    count += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(item.price);

    info.appendChild(name);
    info.appendChild(price);

    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";

    minus.addEventListener("click", function () {
      item.quantity--;

      if (item.quantity <= 0) {
        cart.splice(index, 1);
      }

      updateCart();
    });

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity.toLocaleString("fa-IR");

    const plus = document.createElement("button");
    plus.textContent = "+";

    plus.addEventListener("click", function () {
      item.quantity++;
      updateCart();
    });

    const remove = document.createElement("button");
    remove.textContent = "حذف";
    remove.className = "remove-item";

    remove.addEventListener("click", function () {
      cart.splice(index, 1);
      updateCart();
    });

    controls.appendChild(minus);
    controls.appendChild(quantity);
    controls.appendChild(plus);
    controls.appendChild(remove);

    row.appendChild(info);
    row.appendChild(controls);

    cartItems.appendChild(row);
  });

  cartCount.textContent = count.toLocaleString("fa-IR");
  cartTotal.textContent = formatPrice(total);

  if (cart.length === 0) {
    cartItems.textContent = "سبد خرید شما خالی است.";
  }

  try {
    localStorage.setItem("technestCart", JSON.stringify(cart));
  } catch (error) {
    console.warn("ذخیره سبد خرید امکان‌پذیر نبود.");
  }
}

cartButton.addEventListener("click", function () {
  cartPanel.hidden = false;
});

closeCart.addEventListener("click", function () {
  cartPanel.hidden = true;
});

clearCart.addEventListener("click", function () {
  cart = [];
  updateCart();
});

updateCart();
// رفتن به صفحه تسویه حساب
checkoutButton.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("سبد خرید شما خالی است!");
    return;
  }

  cartPanel.hidden = true;
  checkoutSection.hidden = false;
  checkoutMessage.hidden = true;

  updateCheckoutSummary();

  checkoutSection.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// بازگشت به سبد خرید
backToCart.addEventListener("click", function () {
  checkoutSection.hidden = true;
  cartPanel.hidden = false;

  cartPanel.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// نمایش خلاصه سفارش
function updateCheckoutSummary() {
  checkoutSummary.innerHTML = "";

  let total = 0;

  cart.forEach(function (item) {
    total += item.price * item.quantity;

    const productRow = document.createElement("p");

    productRow.textContent =
      item.name +
      " × " +
      item.quantity.toLocaleString("fa-IR") +
      " — " +
      formatPrice(item.price * item.quantity);

    checkoutSummary.appendChild(productRow);
  });

  const totalElement = document.createElement("h3");
  totalElement.textContent = "مجموع پرداخت: " + formatPrice(total);

  checkoutSummary.appendChild(totalElement);
}

// ثبت سفارش آزمایشی
checkoutForm.addEventListener("submit", function (event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("سبد خرید شما خالی است!");
    return;
  }

  checkoutMessage.textContent =
    "سفارش آزمایشی شما با موفقیت ثبت شد. این سفارش فقط نمایشی است و اطلاعاتی به سرور ارسال نشده است.";

  checkoutMessage.hidden = false;
});
