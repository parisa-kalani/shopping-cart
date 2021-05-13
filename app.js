import { productsData } from "./products.js";
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let cart = [];

// get products
class Products {
  getProducts() {
    return productsData;
  }
}

// dispaly products :
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">${product.price}</p>
        <p class="product-title">$ ${product.title}</p>
      </div>
      <button class="btn add-to-cart" data-id=${product.id}>
        <i class="fas fa-shopping-cart"></i>
        add to cart
      </button>
    </div>`;
    });
    productsDOM.innerHTML = result;
  }
  getCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((item) => item.id === id);
      if (isInCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = "true";
        // 1. get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        // 2. add product to cart
        cart = [...cart, addedProduct];
        // 3. save cart in local sotrage
        Storage.saveCart(cart);
        // 4. set cart values
        console.log(cart);
        this.setCartValue(cart);
        // 5. dispaly cart item
        this.addCartItem(addedProduct);
        // 6. show the cart
      });
    });
  }

  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return curr.quantity * curr.price + acc;
    }, 0);
    cartTotal.innerText = parseFloat(totalPrice).toFixed(2);
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cart) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<div><img class="cart-item-img" src=${cart.imageUrl} /></div>
 <div class="cart-item-desc">
   <h4>${cart.title}</h4>
   <h5>$ ${cart.price}</h5>
 </div>
 <div class="cart-item-conteoller">
   <i class="fas fa-chevron-up" data-id=${cart.id}></i>
   <p>${cart.quantity}</p>
   <i class="fas fa-chevron-down" data-id=${cart.id}></i>
 </div>`;
    cartContent.appendChild(div);
  }
}

// storage :
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI(0);
  const products = new Products();
  //   get all products :
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  ui.getCartBtns();
  Storage.saveProducts(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
