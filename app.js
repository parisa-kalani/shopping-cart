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
        <p class="product-price">${product.price}/p>
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
        console.log(event.target);
        event.target.innerText = "In Cart";
        event.target.disabled = "true";
        // 1. get product from products
        // 2. add product to cart
        // 3. save cart in local sotrage
        // 4. set cart values
        // 5. dispaly cart item
        // 6. show the cart
      });
    });
  }
}

// storage :
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
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
