import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const productsDom = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartcontent = document.querySelector(".cart-content");
const clearCartBtn = document.querySelector(".clear-cart");


let cart = [];
let buttonsDom = [];
class Products{
 getProducts(){
    return productsData;
 }
}

class UI{

   displayProducts(products){
     let result="";
     products.forEach((item) => {
         result+= `<div class="product">
          <div class="img-container">
            <img src=${item.imageUrl} class="product-img" />
          </div>
          <div class="product-desc">
            <p class="product-price">$ ${item.price}</p>
            <p class="product-title">${item.title}</p>
          </div>
          <button class="btn add-to-cart" data-id=${item.id}>
           
            add to cart
          </button>
        </div>`;

        productsDom.innerHTML = result;
     });
    }

    getAddToCartBtns(){
      const addToCartBtns =[...document.querySelectorAll(".add-to-cart")];
      buttonsDom = addToCartBtns;
      addToCartBtns.forEach((btn)=>{
        const id = btn.dataset.id;

       const isInCart = cart.find((p)=> p.id === parseInt(id));
       if(isInCart){
        btn.innerText = "In Cart";
        btn.disabled = true;
       }
        btn.addEventListener("click",(event)=>{
         event.target.innerText = "In Cart";
         event.target.disabled = true;

        const addedProduct ={...Storage.getProduct(id) , quantity:1};

        cart =[...cart,addedProduct];
       
        
        Storage.saveCart(cart);    
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
           
             });
      });
      
      
    }

    setCartValue(cart){

      let tempCartItems=0;
      const totalPrice =  cart.reduce((acc,curr)=>{
            tempCartItems+= curr.quantity;
            return acc + curr.quantity *curr.price;
        },0);
      cartTotal.innerText = `total price : ${totalPrice.toFixed(2)}`;
      cartItems.innerText = tempCartItems;
    }

    addCartItem(cartItem){
      const div=document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
           <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>$${cartItem.price}</h5>
            </div>
            <div class="cart-item-conteoller">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down"data-id=${cartItem.id}></i>
            </div>
            <i class="fas fa-trash-alt" data-id=${cartItem.id}><i>`;
            cartcontent.appendChild(div);
    }

    setupApp(){
       cart =  Storage.getCart() || [];
       cart.forEach((cartItem)=>this.addCartItem(cartItem));
       this.setCartValue(cart);

    }
    cartLogic(){
     clearCartBtn.addEventListener("click",()=> this.clearCart());
     cartcontent.addEventListener("click",(event)=>{
     
      if(event.target.classList.contains("fa-chevron-up")){
        console.log(event.target.dataset.id);
        const addQuantity = event.target;
        const addedItem = cart.find(cItem => cItem.id == addQuantity.dataset.id);
        addedItem.quantity++;
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
        this.setCartValue(cart);
        Storage.saveCart(cart);
      }
      else if(event.target.classList.contains("fa-chevron-down")){
        const subQuantity = event.target;
       const substractedItem = cart.find(cItem => cItem.id == subQuantity.dataset.id);
       
       if(substractedItem.quantity===1){
        this.removeItem(substractedItem.id);
        cartcontent.removeChild(subQuantity.parentElement.parentElement);
        return;
       }
       substractedItem.quantity--;
       subQuantity.previousElementSibling.innerText = substractedItem.quantity;
       this.setCartValue(cart);
       Storage.saveCart(cart);
      
      }
      else if(event.target.classList.contains("fa-trash-alt")){
        const _removItem = event.target;
        const removedItem = cart.find(cItem => cItem.id == _removItem.dataset.id);
        this.removeItem(removedItem.id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        cartcontent.removeChild(_removItem.parentElement);
      }
     });
    }
    clearCart(){
      cart.forEach((cItem) => this.removeItem(cItem.id));
      while (cartcontent.children) {
        cartcontent.removeChild(cartcontent.children[0]);
        closeModalFunction();
      }
    }

    removeItem(id){
    cart = cart.filter((cItem) => cItem.id !== parseInt(id));
    this.getSingleBtn(id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    }

    getSingleBtn(id){
      const button = buttonsDom.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
      button.innerText= "add to cart";
      button.disabled = false;
    }
}


class Storage{
 static saveProducts(products){
    localStorage.setItem("products" , JSON.stringify(products));
 }
 static getProduct(id){
   const _products = JSON.parse(localStorage.getItem("products"));
   return _products.find((p)=> p.id === parseInt(id));
 }

 static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
 }
 static getCart(){
   return JSON.parse(localStorage.getItem("cart"));

 }
}

document.addEventListener("DOMContentLoaded",()=>{
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    ui.cartLogic();
    Storage.saveProducts(productsData);
})


function showModalFunction (){
    backDrop.style.display="block";
    cartModal.style.opacity="1";
    cartModal.style.top="20%";
}

function closeModalFunction(){
    backDrop.style.display="none";
    cartModal.style.opacity="0";
    cartModal.style.top="-100%";
}



cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
