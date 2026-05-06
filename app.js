/* ===============================
   Urban Style Online — app.js v2
   Dark Streetwear Edition
   =============================== */

/* ---------- Productos ---------- */
const PRODUCTS = [
  { id:1, title:'Camiseta Slime', category:'camisetas', gender:'unisex',
    sizes:['S','M','L','XL'], colors:['Blanco','Negro'],
    material:'Algodón 100%', price:45000, badge:'new',
    images:['imagenes/camiseta_slime.jpg'],
    description:'Camiseta streetwear minimalista con tejido suave y corte relajado. Perfecta para el día a día con actitud.'
  },
  { id:2, title:'Camiseta Graffiti Soul', category:'camisetas', gender:'hombre',
    sizes:['M','L','XL'], colors:['Negro','Rojo'],
    material:'Algodón orgánico', price:55000, badge:'hot',
    images:['imagenes/camiseta_grafiti.jpg'],
    description:'Camiseta con estampado urbano inspirado en el arte callejero. El espíritu del grafiti en tu piel.'
  },
  { id:3, title:'Camiseta High Boys', category:'camisetas', gender:'unisex',
    sizes:['S','M','L'], colors:['Blanco','Rosa pastel'],
    material:'Algodón', price:49000, badge:'',
    images:['imagenes/camiseta_gighboys.jpg'],
    description:'Camiseta de estilo urbano con estampado minimalista de la firma High Boys.'
  },
  { id:4, title:'Chaqueta Street Wave', category:'chaquetas', gender:'hombre',
    sizes:['M','L','XL'], colors:['Azul','Gris'],
    material:'Denim', price:120000, badge:'new',
    images:['imagenes/chaqueta_jean.jpg'],
    description:'Chaqueta jean con gráficos serigrafiados. Intervenida a mano con técnica de spray art.'
  },
  { id:5, title:'Sudadera Supreme', category:'sudaderas', gender:'unisex',
    sizes:['S','M','L'], colors:['Verde','Blanco'],
    material:'Algodón + poliéster', price:110000, badge:'sale',
    images:['imagenes/sudadera_supreme.jpg'],
    description:'Sudadera oversize con estampado inspirado en la vida urbana. Comodidad sin sacrificar el estilo.'
  },
  { id:6, title:'Chaqueta Night Runner', category:'chaquetas', gender:'unisex',
    sizes:['M','L','XL'], colors:['Negro','Azul marino'],
    material:'Algodón peinado', price:130000, badge:'',
    images:['imagenes/chaqueta_reflectiva.jpg'],
    description:'Chaqueta premium con detalles reflectivos. Diseñada para brillar en la oscuridad urbana.'
  },
  { id:7, title:'Pantalón Cargo Flex', category:'pantalones', gender:'unisex',
    sizes:['M','L','XL'], colors:['Oliva','Negro'],
    material:'Gabardina elástica', price:98000, badge:'',
    images:['imagenes/pantalon_cargo.jpg'],
    description:'Pantalón cargo con bolsillos funcionales y ajuste cómodo. El clásico que nunca falla.'
  },
  { id:8, title:'Pantalón Cuerina Design', category:'pantalones', gender:'hombre',
    sizes:['M','L','XL'], colors:['Gris','Negro'],
    material:'Cuerina', price:89000, badge:'new',
    images:['imagenes/pantalon_diseño.jpg'],
    description:'Pantalón ancho de cuerina con diseño exclusivo. Elegancia streetwear en cada detalle.'
  },
  { id:9, title:'Jean Ancho Clásico', category:'pantalones', gender:'mujer',
    sizes:['S','M','L'], colors:['Beige','Verde pastel'],
    material:'Jean', price:92000, badge:'',
    images:['imagenes/jean_ancho.jpg'],
    description:'Pantalón de tiro alto y corte ancho. La tendencia urbana femenina que domina las calles.'
  },
  { id:10, title:'Gorra Beisbolera', category:'accesorios', gender:'unisex',
    sizes:['Única'], colors:['Negro','Blanco'],
    material:'Algodón 100%', price:35000, badge:'',
    images:['imagenes/gorra.jpg'],
    description:'Gorra con diseño bordado exclusivo. El complemento perfecto para cualquier look.'
  },
  { id:11, title:'Bolso Keepall', category:'accesorios', gender:'unisex',
    sizes:['Única'], colors:['Negro','Gris'],
    material:'Lona Monogram', price:78000, badge:'hot',
    images:['imagenes/bolso.jpg'],
    description:'Bolso tipo bandolera ideal para la ciudad. Estilo y comodidad en cada salida.'
  },
  { id:12, title:'Gafas Diseño Urbano', category:'accesorios', gender:'unisex',
    sizes:['Única'], colors:['Plateado','Negro'],
    material:'Policarbonato', price:67000, badge:'new',
    images:['imagenes/gafas_de_sol.jpg'],
    description:'Gafas de sol con diseño llamativo y urbano. Protección solar con actitud.'
  }
];

/* ---------- Utilidades ---------- */
const $ = (sel, ctx=document) => ctx?.querySelector(sel) ?? null;
const $$ = (sel, ctx=document) => Array.from((ctx || document).querySelectorAll(sel));
const formatCurrency = v => `$${Number(v).toLocaleString('es-CO')} COP`;
const escapeHtml = str => {
  if(typeof str !== 'string') return str;
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s]);
};

/* ---------- Carrito ---------- */
let cart;
try {
  cart = JSON.parse(localStorage.getItem('uso_cart_v2') || '[]');
  if(!Array.isArray(cart)) cart = [];
} catch { cart = []; }

function saveCart(){
  localStorage.setItem('uso_cart_v2', JSON.stringify(cart));
  updateMiniCount();
}
function updateMiniCount(){
  const count = cart.reduce((s,i) => s + (i.qty||0), 0);
  $$('#miniCartCount').forEach(el => el.textContent = count);
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg, sub=''){
  let toast = $('#globalToast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">🛍️</span><div><div class="toast-msg"></div><div class="toast-sub"></div></div>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-msg').textContent = msg;
  toast.querySelector('.toast-sub').textContent = sub;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ---------- Add to cart ---------- */
function addToCart(id, qty=1, size='', color=''){
  const prod = PRODUCTS.find(p => p.id === id);
  if(!prod) return;
  const ex = cart.find(i => i.id===id && i.size===size && i.color===color);
  if(ex) ex.qty += qty;
  else cart.push({id:prod.id, title:prod.title, price:prod.price, qty, size, color, image:prod.images[0]});
  saveCart();
  showToast(`${prod.title} añadido`, `${qty} unidad${qty>1?'es':''} • ${size||'Talla única'}`);
}

/* ---------- Header scroll ---------- */
function initHeader(){
  const header = $('.site-header');
  if(!header) return;
  const onScroll = () => {
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});

  // Hamburger
  const ham = $('.hamburger');
  const mobileNav = $('.mobile-nav');
  if(ham && mobileNav){
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }

  // Search
  const searchInput = $('#headerSearch');
  const searchDropdown = $('#searchDropdown');
  if(searchInput && searchDropdown){
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if(q.length < 2){ searchDropdown.classList.remove('open'); return; }
      const results = PRODUCTS.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ).slice(0, 5);
      if(results.length === 0){
        searchDropdown.innerHTML = '<div class="search-no-results">Sin resultados para "'+escapeHtml(q)+'"</div>';
      } else {
        searchDropdown.innerHTML = results.map(p => `
          <a class="search-result-item" href="product.html?id=${p.id}">
            <img src="${p.images[0]}" alt="${escapeHtml(p.title)}">
            <div>
              <div class="sri-title">${escapeHtml(p.title)}</div>
              <div class="sri-price">${formatCurrency(p.price)}</div>
            </div>
          </a>
        `).join('');
      }
      searchDropdown.classList.add('open');
    });
    document.addEventListener('click', e => {
      if(!e.target.closest('.header-search')) searchDropdown.classList.remove('open');
    });
  }
}

/* ---------- Initializadores por página ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body?.dataset?.page || '';
  if($('#year')) $('#year').textContent = new Date().getFullYear();
  updateMiniCount();
  initHeader();

  try {
    if(page === 'index')    initIndex();
    if(page === 'catalog')  initCatalog();
    if(page === 'product')  initProduct();
    if(page === 'cart')     initCart();
    if(page === 'checkout') initCheckout();
  } catch(err){
    console.error('Error init:', err);
  }
});

/* ======= INDEX ======= */
function initIndex(){
  const grid = $('#homeProducts');
  if(!grid) return;
  renderCards(PRODUCTS.slice(0, 8), grid);

  // Filtros de categoría rápidos
  $$('.pill[data-cat]').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.pill[data-cat]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      const list = cat === 'all' ? PRODUCTS.slice(0,8) : PRODUCTS.filter(p => p.category === cat).slice(0,8);
      renderCards(list, grid);
    });
  });

  // Newsletter form
  const nlForm = $('#newsletterForm');
  if(nlForm){
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      if(input && input.value.includes('@')){
        showToast('¡Suscrito!', 'Recibirás las últimas novedades');
        input.value = '';
      }
    });
  }
}

/* ======= CATALOG ======= */
function initCatalog(){
  const grid = $('#productGrid');
  const countEl = $('#catalogCount');
  if(!grid) return;

  const filterCategory = $('#filterCategory');
  const filterGender   = $('#filterGender');
  const filterSize     = $('#filterSize');
  const filterPrice    = $('#filterPrice');
  const priceVal       = $('#priceVal');
  const sortSelect     = $('#sortSelect');
  const clearBtn       = $('#clearFilters');

  function render(list){
    if(countEl) countEl.textContent = `${list.length} producto${list.length!==1?'s':''}`;
    if(list.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <span class="empty-icon">🔍</span>
        <h3>Sin resultados</h3>
        <p>Prueba con otros filtros</p>
      </div>`;
      return;
    }
    renderCards(list, grid);
  }

  function applyFilters(){
    let list = PRODUCTS.slice();
    if(filterPrice) list = list.filter(p => p.price <= Number(filterPrice.value));
    if(filterCategory?.value !== 'all') list = list.filter(p => p.category === filterCategory.value);
    if(filterGender?.value !== 'all')   list = list.filter(p => p.gender === filterGender.value);
    if(filterSize?.value !== 'all')     list = list.filter(p => p.sizes.includes(filterSize.value));
    if(sortSelect?.value === 'price-asc')  list.sort((a,b) => a.price - b.price);
    if(sortSelect?.value === 'price-desc') list.sort((a,b) => b.price - a.price);
    render(list);
  }

  if(filterPrice){
    if(priceVal) priceVal.textContent = Number(filterPrice.value).toLocaleString('es-CO');
    filterPrice.addEventListener('input', () => {
      if(priceVal) priceVal.textContent = Number(filterPrice.value).toLocaleString('es-CO');
      applyFilters();
    });
  }
  [filterCategory, filterGender, filterSize, sortSelect].forEach(el => el?.addEventListener('change', applyFilters));
  clearBtn?.addEventListener('click', () => {
    if(filterCategory) filterCategory.value = 'all';
    if(filterGender)   filterGender.value   = 'all';
    if(filterSize)     filterSize.value     = 'all';
    if(filterPrice){ filterPrice.value = 200000; if(priceVal) priceVal.textContent = '200,000'; }
    if(sortSelect) sortSelect.value = 'featured';
    render(PRODUCTS);
  });

  render(PRODUCTS);
}

/* ======= PRODUCT DETAIL ======= */
function initProduct(){
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || PRODUCTS[0].id;
  const product = PRODUCTS.find(p => p.id === id);
  const detail = $('#productDetail');
  if(!detail) return;
  if(!product){ detail.innerHTML = '<p class="empty-state"><span class="empty-icon">😕</span><h3>Producto no encontrado</h3></p>'; return; }

  let selectedSize = product.sizes[0];
  let selectedColor = product.colors[0];
  let qty = 1;

  detail.innerHTML = `
    <div class="gallery-wrap">
      <img class="main-img" id="mainImg" src="${product.images[0]}" alt="${escapeHtml(product.title)}">
      <div class="thumbs-row" id="thumbsRow">
        ${product.images.map((src,i) => `
          <div class="thumb ${i===0?'active':''}" data-src="${src}">
            <img src="${src}" alt="Vista ${i+1}">
          </div>`).join('')}
      </div>
    </div>
    <div class="product-info">
      <div class="eyebrow">${escapeHtml(product.category)} • ${escapeHtml(product.material)}</div>
      <h2>${escapeHtml(product.title)}</h2>
      <div class="product-price">${formatCurrency(product.price)}</div>
      <p class="product-desc">${escapeHtml(product.description)}</p>

      <span class="selector-label">Talla</span>
      <div class="size-buttons" id="sizeButtons">
        ${product.sizes.map(s => `<button class="size-btn ${s===selectedSize?'selected':''}" data-size="${s}">${s}</button>`).join('')}
      </div>

      <span class="selector-label">Color</span>
      <div class="color-buttons" id="colorButtons">
        ${product.colors.map(c => `<button class="color-btn ${c===selectedColor?'selected':''}" data-color="${c}">${c}</button>`).join('')}
      </div>

      <div class="qty-row">
        <div class="qty-control">
          <button class="qty-btn" id="decQty">−</button>
          <span class="qty-num" id="qtyNum">1</span>
          <button class="qty-btn" id="incQty">+</button>
        </div>
        <button class="add-to-cart-btn" id="addBtn">Añadir al carrito</button>
      </div>
    </div>
  `;

  // Thumbs
  $$('.thumb', detail).forEach(t => {
    t.addEventListener('click', () => {
      $$('.thumb', detail).forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const img = $('#mainImg');
      if(img) img.src = t.dataset.src;
    });
  });

  // Talla
  $$('.size-btn', detail).forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.size-btn', detail).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  // Color
  $$('.color-btn', detail).forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.color-btn', detail).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedColor = btn.dataset.color;
    });
  });

  // Cantidad
  $('#incQty')?.addEventListener('click', () => { qty++; $('#qtyNum').textContent = qty; });
  $('#decQty')?.addEventListener('click', () => { if(qty>1){ qty--; $('#qtyNum').textContent = qty; } });

  // Añadir
  $('#addBtn')?.addEventListener('click', () => {
    addToCart(product.id, qty, selectedSize, selectedColor);
    const btn = $('#addBtn');
    if(btn) btn.animate([{transform:'scale(1)'},{transform:'scale(0.96)'},{transform:'scale(1)'}],{duration:200});
  });
}

/* ======= CART ======= */
function initCart(){
  const itemsEl  = $('#cartItems');
  const emptyEl  = $('#cartEmpty');
  const sideEl   = $('#cartSidebar');
  if(!itemsEl) return;

  function render(){
    updateMiniCount();
    if(cart.length === 0){
      if(itemsEl) itemsEl.innerHTML = '';
      if(emptyEl) emptyEl.style.display = 'block';
      if(sideEl)  sideEl.style.display = 'none';
      return;
    }
    if(emptyEl) emptyEl.style.display = 'none';
    if(sideEl)  sideEl.style.display = 'block';

    itemsEl.innerHTML = cart.map((it,idx) => `
      <div class="cart-item">
        <img src="${it.image}" alt="${escapeHtml(it.title)}">
        <div class="cart-item-info">
          <div class="cart-item-title">${escapeHtml(it.title)}</div>
          <div class="cart-item-meta">Talla: ${escapeHtml(it.size||'—')} · Color: ${escapeHtml(it.color||'—')}</div>
          <div style="display:flex;gap:8px;align-items:center">
            <div class="qty-control" style="display:inline-flex">
              <button class="qty-btn dec" data-i="${idx}">−</button>
              <span class="qty-num">${it.qty}</span>
              <button class="qty-btn inc" data-i="${idx}">+</button>
            </div>
            <button class="btn ghost sm del" data-i="${idx}" style="color:var(--accent);border-color:rgba(255,45,85,0.2)">Eliminar</button>
          </div>
        </div>
        <div class="cart-item-price">${formatCurrency(it.price*it.qty)}</div>
      </div>
    `).join('');

    const subtotal = cart.reduce((s,i) => s+(i.price*i.qty), 0);
    const shipping = subtotal >= 120000 ? 0 : 12000;
    const total = subtotal + shipping;

    if(sideEl){
      sideEl.innerHTML = `
        <h3>Tu orden</h3>
        <div class="cart-row-summary"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="cart-row-summary"><span>Envío</span><span>${shipping===0?'<span style="color:var(--neon)">GRATIS</span>':formatCurrency(shipping)}</span></div>
        <div class="cart-total"><span>Total</span><span>${formatCurrency(total)}</span></div>
        <a href="checkout.html" class="btn primary" style="width:100%;justify-content:center;margin-bottom:10px">Finalizar compra</a>
        <button id="emptyCartBtn" class="btn ghost" style="width:100%;justify-content:center">Vaciar carrito</button>
        ${subtotal < 120000 ? `<p style="margin-top:12px;font-size:13px;color:var(--muted);text-align:center;font-family:'Space Mono',monospace">Agrega ${formatCurrency(120000-subtotal)} más para envío gratis 🚀</p>` : ''}
      `;
      $('#emptyCartBtn')?.addEventListener('click', () => {
        if(confirm('¿Vaciar carrito?')){ cart = []; saveCart(); render(); }
      });
    }

    $$('.inc').forEach(b => b.addEventListener('click', e => { cart[+e.currentTarget.dataset.i].qty++; saveCart(); render(); }));
    $$('.dec').forEach(b => b.addEventListener('click', e => {
      const i = +e.currentTarget.dataset.i;
      if(cart[i].qty > 1) cart[i].qty--; else cart.splice(i,1);
      saveCart(); render();
    }));
    $$('.del').forEach(b => b.addEventListener('click', e => { cart.splice(+e.currentTarget.dataset.i,1); saveCart(); render(); }));
  }

  render();
}

/* ======= CHECKOUT ======= */
function initCheckout(){
  const form    = $('#checkoutForm');
  const result  = $('#orderResult');
  const orderEl = $('#orderItems');
  const totalEl = $('#orderTotal');
  let selectedPayment = '';

  const subtotal = cart.reduce((s,i) => s+(i.price*i.qty), 0);
  const shipping  = subtotal >= 120000 ? 0 : 12000;
  const total     = subtotal + shipping;

  if(orderEl) orderEl.innerHTML = cart.map(it => `
    <div class="order-item">
      <img src="${it.image}" alt="${escapeHtml(it.title)}">
      <div class="order-item-name">${escapeHtml(it.title)} x${it.qty}</div>
      <div class="order-item-price">${formatCurrency(it.price*it.qty)}</div>
    </div>
  `).join('') + `<div style="padding:12px 0;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-family:'Space Mono',monospace;font-size:14px"><span>Envío</span><span>${shipping===0?'GRATIS':formatCurrency(shipping)}</span></div>`;

  if(totalEl) totalEl.textContent = formatCurrency(total);

  // Payment methods
  $$('.payment-method').forEach(pm => {
    pm.addEventListener('click', () => {
      $$('.payment-method').forEach(p => p.classList.remove('selected'));
      pm.classList.add('selected');
      selectedPayment = pm.dataset.payment;
    });
  });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    $$('.error').forEach(el => el.textContent = '');
    let valid = true;
    if(!form.fullname.value.trim()){ $('#err-name').textContent = 'Ingresa tu nombre'; valid=false; }
    if(!form.address.value.trim()){ $('#err-address').textContent = 'Ingresa tu dirección'; valid=false; }
    if(!form.phone.value.trim()){ $('#err-phone').textContent = 'Ingresa tu teléfono'; valid=false; }
    if(!form.email.value.match(/^[^@]+@[^@]+\.[a-z]+$/i)){ $('#err-email').textContent = 'Correo inválido'; valid=false; }
    if(!selectedPayment){ $('#err-payment').textContent = 'Selecciona un método de pago'; valid=false; }
    if(!valid) return;

    const orderNum = '#'+Math.floor(Math.random()*900000+100000);
    if(result) result.innerHTML = `
      <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:36px;text-align:center;margin-top:24px">
        <div style="font-size:64px;margin-bottom:16px">🎉</div>
        <h2 style="font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:2px;margin-bottom:8px">¡Pedido Confirmado!</h2>
        <p style="color:var(--muted);font-size:17px;margin-bottom:16px">Gracias, <strong>${escapeHtml(form.fullname.value)}</strong>. Te contactaremos pronto.</p>
        <div style="font-family:'Space Mono',monospace;background:var(--bg2);padding:14px 24px;border-radius:10px;display:inline-block;margin-bottom:24px">
          Pedido <span style="color:var(--accent)">${orderNum}</span>
        </div>
        <br>
        <a href="catalog.html" class="btn primary">Seguir comprando</a>
      </div>
    `;
    cart = []; saveCart(); updateMiniCount();
    form.style.display = 'none';
  });
}

/* ======= Render cards helper ======= */
function renderCards(list, container){
  const badgeLabel = { new:'NUEVO', hot:'🔥 HOT', sale:'OFERTA' };
  const badgeClass = { new:'new', hot:'', sale:'sale' };
  container.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="card-img-wrap">
        <img src="${p.images[0]}" alt="${escapeHtml(p.title)}" loading="lazy">
        ${p.badge ? `<span class="card-badge ${badgeClass[p.badge]||''}">${badgeLabel[p.badge]||p.badge}</span>` : ''}
        <div class="card-overlay">
          <a href="product.html?id=${p.id}" class="btn ghost sm">Ver</a>
          <button class="btn primary sm add-now" data-id="${p.id}">+ Carrito</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-category">${escapeHtml(p.category)}</div>
        <div class="card-title">${escapeHtml(p.title)}</div>
        <div class="card-price">${formatCurrency(p.price)}</div>
        <div class="card-colors">
          ${p.colors.slice(0,3).map(c => `<span class="color-dot" title="${c}" style="background:${colorToHex(c)}"></span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
  $$('.add-now', container).forEach(b => b.addEventListener('click', e => addToCart(Number(e.currentTarget.dataset.id), 1)));
}

function colorToHex(color){
  const map = {
    'negro':'#111','blanco':'#f0eff4','rojo':'#e63946','azul':'#3a86ff',
    'gris':'#6b7280','verde':'#2d6a4f','oliva':'#606c38','beige':'#d4a373',
    'plateado':'#adb5bd','rosa pastel':'#ffb3c6','verde pastel':'#b7e4c7',
    'azul marino':'#1d3557'
  };
  return map[color.toLowerCase()] || '#555';
}
