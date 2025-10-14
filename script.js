/* Product data: replace images/names/prices as needed */
const PRODUCTS = [
  { key:'oud-al-amir', name:'Oud Al Amir', price:399, volume:'50ml', desc:'Signature woody-amber oud with saffron and resin.', img:'images/oud ameer.png' },
  { key:'1-million', name:'1 Million', price:349, volume:'50ml', desc:'Velvet rose with warm balsamic notes.', img:'images/1m.png' },
  { key:'badee-oud', name:'Badee-oud', price:399, volume:'50ml', desc:'Deep amber, vanilla & smoky oud trail.', img:'images/badee.jpeg' },
  { key:'creed-aventus', name:'Creed Aventus', price:349, volume:'50ml', desc:'Fresh bergamot with musk base.', img:'images/creed aventus.png' },
  { key:'marj', name:'Marj', price:599, volume:'50ml', desc:'Smooth oud wrapped in floral velvet.', img:'images/marj.png' },
  { key:'ultra-male', name:'Ultra Male', price:399, volume:'50ml', desc:'Elegant jasmine with amber warmth.', img:'images/ultra male.jpg' }
];

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

const productsContainer = $('#products');
const cartToggle = $('#cart-toggle');
const cartCountEl = $('#cart-count');
const cartItemsEl = $('#cart-items');
const cartEmptyEl = $('#cart-empty');
const checkoutForm = $('#checkout-form');
const orderDetailsInput = $('#order_details');
const clearCartBtn = $('#clear-cart');
const toast = $('#toast');

let cart = JSON.parse(localStorage.getItem('qasr_cart') || '[]');

/* Helpers */
function saveCart(){ localStorage.setItem('qasr_cart', JSON.stringify(cart)); updateCartUI(); }
function showToast(msg){ toast.textContent = msg; toast.style.display = 'block'; setTimeout(()=>{ toast.style.display='none'; }, 2500); }
function formatPrice(n){ return '₹' + n.toFixed(0); }

/* Render products */
function renderProducts(){
  productsContainer.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <h3>${p.name}</h3>
      <p class="desc">${p.desc}</p>
      <div style="display:flex;align-items:center;gap:8px;width:100%">
        <div class="price">${formatPrice(p.price)} • ${p.volume}</div>
      </div>
      <div class="actions">
        <button class="btn btn-primary add-to-cart" data-key="${p.key}">Add to cart</button>
        <button class="btn btn-ghost view-details" data-key="${p.key}">View</button>
      </div>
    `;
    productsContainer.appendChild(card);
  });
}

/* Cart UI */
function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  if(cart.length === 0){
    cartEmptyEl.hidden = false;
    cartItemsEl.hidden = true;
    checkoutForm.hidden = true;
  } else {
    cartEmptyEl.hidden = true;
    cartItemsEl.hidden = false;
    checkoutForm.hidden = false;
    cartItemsEl.innerHTML = '';
    cart.forEach(item=>{
      const p = PRODUCTS.find(x=>x.key===item.key);
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <div>
          <div style="font-weight:700">${p.name}</div>
          <div class="small">${p.volume} • ${formatPrice(p.price)}</div>
        </div>
        <div class="qty-control">
          <button class="qty-decrease" data-key="${item.key}">−</button>
          <div class="small qty">${item.qty}</div>
          <button class="qty-increase" data-key="${item.key}">+</button>
        </div>
        <div style="margin-left:12px;font-weight:700">${formatPrice(p.price * item.qty)}</div>
      `;
      cartItemsEl.appendChild(row);
    });
  }
}

/* Cart operations */
function addToCart(key){
  const idx = cart.findIndex(c=>c.key===key);
  if(idx === -1) cart.push({key, qty:1});
  else cart[idx].qty++;
  saveCart();
  showToast('Added to cart');
}
function changeQty(key, delta){
  const idx = cart.findIndex(c=>c.key===key);
  if(idx === -1) return;
  cart[idx].qty += delta;
  if(cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart();
}

/* Checkout form population */
function populateOrderDetails(){
  const items = cart.map(item=>{
    const p = PRODUCTS.find(x=>x.key===item.key);
    return `${p.name} × ${item.qty} — ${formatPrice(p.price*item.qty)}`;
  }).join(' | ');
  const total = cart.reduce((s,i)=>s + (PRODUCTS.find(p=>p.key===i.key).price * i.qty),0);
  orderDetailsInput.value = `Items: ${items} || Total: ${formatPrice(total)}`;
}

/* Event listeners */
function addToCart(key){
  const idx = cart.findIndex(c=>c.key===key);
  if(idx === -1) cart.push({key, qty:1});
  else cart[idx].qty++;

  saveCart();

  // Show alert popup
  const product = PRODUCTS.find(p => p.key === key);
  alert(`✅ "${product.name}" added to cart!`);

  // Optional: keep toast as well
  showToast(`Added "${product.name}" to cart`);
  if(e.target.matches('.qty-increase')) changeQty(e.target.dataset.key, 1);
  if(e.target.matches('.qty-decrease')) changeQty(e.target.dataset.key, -1);
  if(e.target.id === 'cart-toggle'){ window.scrollTo({top: document.getElementById('order-section').offsetTop - 20, behavior:'smooth'}); }
  if(e.target.id === 'clear-cart'){ cart = []; saveCart(); showToast('Cart cleared'); }
});

/* Intercept form submit to add order details */
checkoutForm.addEventListener('submit', (ev)=>{
  populateOrderDetails();
  // default submit will post to Formspree or Netlify Forms
  showToast('Placing order...');
  // after submit, clear cart (Formspree will redirect or show message)
  setTimeout(()=>{ cart = []; saveCart(); }, 1000);
});

/* Init */
renderProducts();
updateCartUI();
document.getElementById('year').textContent = new Date().getFullYear();

/* Autosave on unload */
window.addEventListener('beforeunload', ()=> localStorage.setItem('qasr_cart', JSON.stringify(cart)));




