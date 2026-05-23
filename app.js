/* ==========================================================================
   PHONEHUB CORE STATE ENGINE & UI CONTROLLER
   ========================================================================== */

// --- PRODUCT DATABASE ---
const PRODUCTS = {
  Iphone16: {
    id: 'Iphone16',
    title: 'Iphone 16 Pro Max',
    type: 'Second Unit',
    color: 'Black Colour',
    storage: '256 Gb',
    batteryHealth: '95%',
    condition: '99%',
    warranty: 'Garansi on iBox',
    price: 16500000,
    priceStr: 'Rp.16.500.000,00',
    description: 'iPhone 16 Pro Max second kondisi mulus dan terawat dengan storage 256 GB. Semua fungsi normal mulai dari Face ID, kamera depan dan belakang, speaker, mic, hingga tombol berfungsi dengan baik. Battery Health 95%. Lengkap dengan box original.',
    image: 'assets/Iphone16.png'
  },
  Iphone13: {
    id: 'Iphone13',
    title: 'Iphone 13',
    type: 'New Unit',
    color: 'Midnight Colour',
    storage: '256 Gb',
    batteryHealth: '100%',
    condition: '100%',
    warranty: 'Garansi on iBox',
    price: 8299999,
    priceStr: 'Rp.8.299.999,00',
    description: 'iPhone 13 second kondisi mulus terawat dengan storage 256 GB. Semua fungsi normal mulai dari Face ID, kamera depan belakang, speaker, mic, hingga tombol berfungsi baik. Battery Health 100%. Kelengkapan fullset original garansi iBox.',
    image: 'assets/Iphone13.png'
  },
  Iphone17: {
    id: 'Iphone17',
    title: 'Iphone 17 Pro Max',
    type: 'Special Unit',
    color: 'Desert Bronze',
    storage: '512 Gb',
    batteryHealth: '100%',
    condition: '100%',
    warranty: 'Resmi iBox Aktif',
    price: 23000000,
    priceStr: 'Rp.23.000.000,00',
    description: 'iPhone 17 Pro Max Edisi Spesial Desert Bronze / Orange. Unit super langka, mulus 100% tanpa lecet sedikit pun. Lengkap segel box original beserta semua aksesoris bawaan. Garansi resmi iBox aktif panjang.',
    image: 'assets/Iphone17.png'
  }
};


// --- GLOBAL APPLICATION STATE ---
let state = {
  currentTab: 'home',      // active tab/screen
  activeRole: 'customer',   // customer | courier | owner
  cart: [],                 // { product, quantity }
  orderItems: [],           // last placed order snapshot
  address: "Jl. Mansion Valley No.8 - 22, Genitri, Tirtomoyo, Pakis, Malang, Jawa Timur 65154",
  selectedProduct: null,    // product detail context
  
  // Order System State Machine
  // none -> packing -> pickup -> delivery -> delivered
  orderStatus: 'none', 
  orderRating: 0,
  orderCourier: {
    name: 'Eddy',
    phone: '08121234338',
    vehicle: 'Honda Vario',
    plate: 'N 3431 ABC',
    avatar: '\u{1F6F5}'
  },
  
  // Chat History Engine
  chats: {
    admin: [
      { sender: 'incoming', text: 'Good morning, Jonathan! Welcome to PhoneHub.', time: '10:00' },
      { sender: 'incoming', text: 'Let us know if you have any questions about our iPhones. We guarantee iBox units only!', time: '10:01' }
    ],
    courier: [
      { sender: 'incoming', text: 'Halo kak, saya Eddy kurir PhoneHub. Saya akan mengantar paketnya.', time: '12:00' }
    ]
  },
  activeChatPartner: 'admin', // admin | courier
  
  // Map Tracking Simulation
  mapAnimationId: null,
  mapProgress: 0, // 0 to 100
};

// --- SYSTEM INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  logEvent('PhoneHub Connected Prototype Engine ready.', 'system');
  updateClock();
  setInterval(updateClock, 60000);
  switchTab('home');
});

// Update Emulator Clock
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  const liveTimeEl = document.getElementById('live-time');
  if (liveTimeEl) liveTimeEl.textContent = timeStr;
}

// --- SYSTEM LOGGER MONITOR ---
function logEvent(message, type = 'system') {
  const consoleEl = document.getElementById('log-console');
  if (!consoleEl) return;
  
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const logLine = document.createElement('div');
  logLine.className = `log-line ${type}`;
  logLine.innerHTML = `[${time}] [${type.toUpperCase()}]: ${message}`;
  
  consoleEl.appendChild(logLine);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function clearLogs() {
  const consoleEl = document.getElementById('log-console');
  if (consoleEl) {
    consoleEl.innerHTML = '<div class="log-line system">[SYSTEM]: Console logs cleared.</div>';
  }
}

// --- TOAST NOTIFICATIONS ---
function triggerToast(title, desc, icon = '') {
  const toastEl = document.getElementById('phone-toast');
  if (!toastEl) return;
  
  const toastIcon = toastEl.querySelector('.toast-icon');
  toastIcon.textContent = icon;
  toastIcon.style.display = icon ? 'flex' : 'none';
  toastEl.querySelector('.toast-title').textContent = title;
  toastEl.querySelector('.toast-desc').textContent = desc;
  
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 4000);
}

// --- SWITCH ACTIVE ROLE ---
function setRole(role) {
  state.activeRole = role;
  
  // Update Simulator Button styles
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-role-${role}`).classList.add('active');
  
  logEvent(`Switched system context to: ${role.toUpperCase()}`, role);
  
  // Sync Phone screen with Role Action
  if (role === 'courier') {
    switchTab('courier-dashboard');
  } else if (role === 'owner') {
    switchTab('owner-dashboard');
  } else {
    // If returning to Customer
    switchTab('home');
  }
}

// --- TAB NAVIGATION MANAGER ---
function switchTab(tabName, payload = null) {
  state.currentTab = tabName;
  
  // Reset selected detail if leaving detail tab
  if (tabName !== 'detail') {
    state.selectedProduct = null;
  }
  
  // Handle bottom navigation highlights
  const navbar = document.getElementById('phone-navbar');
  const navItems = document.querySelectorAll('.nav-item');
  
  // Hide bottom navbar on sub-screens (e.g. details, settings, courier/owner view)
  const isSubScreen = ['detail', 'settings', 'change-address', 'courier-dashboard', 'owner-dashboard'].includes(tabName);
  if (navbar) {
    navbar.style.display = isSubScreen ? 'none' : 'grid';
  }
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-tab') === tabName) {
      item.classList.add('active');
    }
  });

  // Log action
  if (!isSubScreen && tabName !== 'chat') {
    logEvent(`Customer navigated to tab: ${tabName.toUpperCase()}`, 'customer');
  }
  
  renderScreen(tabName, payload);
}

// --- RENDER DYNAMIC SCREEN TEMPLATES ---
function renderScreen(screen, payload) {
  const container = document.getElementById('phone-content');
  if (!container) return;
  
  // Cancel map loops if leaving delivery tracking screen
  if (state.mapAnimationId) {
    cancelAnimationFrame(state.mapAnimationId);
    state.mapAnimationId = null;
  }

  let html = '';
  
  switch(screen) {
    case 'home':
      html = renderHomeScreen();
      break;
      
    case 'detail':
      const prodId = payload || 'Iphone16';
      state.selectedProduct = PRODUCTS[prodId];
      html = renderDetailScreen(state.selectedProduct);
      break;
      
    case 'search':
      html = renderSearchScreen(payload);
      break;
      
    case 'bag':
      html = renderBagScreen();
      break;
      
    case 'profile':
      html = renderProfileScreen();
      break;
      
    case 'settings':
      html = renderSettingsScreen();
      break;
      
    case 'change-address':
      html = renderChangeAddressScreen();
      break;
      
    case 'order':
      html = renderOrderScreen();
      break;
      
    case 'chat':
      html = renderChatScreen();
      break;
      
    case 'courier-dashboard':
      html = renderCourierDashboard();
      break;
      
    case 'owner-dashboard':
      html = renderOwnerDashboard();
      break;
      
    default:
      html = renderHomeScreen();
  }
  
  container.innerHTML = html;
  
  // Post-render lifecycle hooks (e.g. initializing map canvas or scrollable chat)
  if (screen === 'order' && state.orderStatus === 'delivery') {
    initLiveMapCanvas();
  }
  if (screen === 'chat') {
    scrollChatToBottom();
  }
  
  updateBadges();
  updateSimulatorPanel();
}

// --- BADGE UPDATES ---
function updateBadges() {
  const bagBadge = document.getElementById('bag-badge');
  const chatBadge = document.getElementById('chat-badge');
  
  // Bag Badge count
  const cartTotalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (bagBadge) {
    if (cartTotalQty > 0) {
      bagBadge.style.display = 'block';
      bagBadge.textContent = cartTotalQty;
    } else {
      bagBadge.style.display = 'none';
    }
  }
  
  // Chat Dot Notification
  if (chatBadge) {
    chatBadge.style.display = state.chats.admin.length > 2 ? 'block' : 'none';
  }
}

// --- RENDER COMPONENT: HOME SCREEN ---
function renderHomeScreen() {
  return `
    <div class="home-welcome-row">
      <div class="profile-avatar-circle" onclick="switchTab('profile')">
        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop" alt="Cat Avatar">
      </div>
      <div class="welcome-text">
        <h4>Good Morning!</h4>
        <h2>Jonathan Richard</h2>
      </div>
      <div class="bell-icon-btn" onclick="triggerToast('Daily Stock Update', 'iPhone 16 Pro Max has been fully restocked!', '')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </div>
    </div>

    <!-- Search Input Bar -->
    <div class="search-bar-wrapper">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" placeholder="Search product..." onfocus="switchTab('search')" readonly>
      <div class="filter-btn" onclick="triggerToast('Filter applied', 'Showing only best conditions units', '')">
        <svg style="width:16px;height:16px;color:var(--text-phone-secondary);" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
      </div>
    </div>

    <!-- Promotional glassmorphism banner card -->
    <div class="promo-slider">
      <div class="promo-tag">LIMITED SPECIAL</div>
      <div class="promo-title">iBox Grade A+ Second</div>
      <div class="promo-desc">Ready 100% full original units under premium quality checks.</div>
    </div>

    <!-- Product Grid Lists -->
    <div class="section-label-row">
      <h3>Recommended Phones</h3>
      <span>See All</span>
    </div>

    <div class="product-grid">
      <!-- Item 1: iPhone 16 Pro Max -->
      <div class="product-card" onclick="switchTab('detail', 'Iphone16')">
        <div class="product-image-box">
          <img src="${PRODUCTS.Iphone16.image}" alt="iPhone 16 Pro Max">
          <span class="product-condition-tag">${PRODUCTS.Iphone16.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone16.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone16.color}</span>
          <span class="product-price">${PRODUCTS.Iphone16.priceStr}</span>
        </div>
      </div>

      <!-- Item 2: iPhone 13 -->
      <div class="product-card" onclick="switchTab('detail', 'Iphone13')">
        <div class="product-image-box">
          <img src="${PRODUCTS.Iphone13.image}" alt="iPhone 13">
          <span class="product-condition-tag new-unit">${PRODUCTS.Iphone13.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone13.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone13.color}</span>
          <span class="product-price">${PRODUCTS.Iphone13.priceStr}</span>
        </div>
      </div>

      <!-- Item 3: iPhone 17 Pro Max Special -->
      <div class="product-card" onclick="switchTab('detail', 'Iphone17')" style="grid-column: span 2; display: flex; flex-direction: row; gap: 14px;">
        <div class="product-image-box" style="width: 120px; height: 110px; flex-shrink: 0;">
          <img src="${PRODUCTS.Iphone17.image}" alt="iPhone 17 Pro Max">
          <span class="product-condition-tag" style="background: linear-gradient(135deg, orange, darkorange);">${PRODUCTS.Iphone17.type}</span>
        </div>
        <div class="product-details" style="justify-content: center;">
          <h4 class="product-title" style="white-space: normal; overflow: visible; font-size: 13px;">${PRODUCTS.Iphone17.title}</h4>
          <span class="product-meta" style="margin-bottom: 4px;">${PRODUCTS.Iphone17.color} (512GB)</span>
          <span class="product-price" style="font-size: 13.5px; color: darkorange;">${PRODUCTS.Iphone17.priceStr}</span>
        </div>
      </div>
    </div>

  `;
}

// --- RENDER COMPONENT: DETAIL SCREEN ---
function renderDetailScreen(product) {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('home')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Detail Product</h3>
    </div>

    <div class="detail-image-slider">
      <img src="${product.image}" alt="${product.title}">
    </div>

    <div class="detail-price">${product.priceStr}</div>
    <div class="detail-title">${product.title}</div>

    <!-- Specifications Details Chips -->
    <div class="detail-specs-grid">
      <div class="spec-chip">
        <em>Status</em>
        <span>${product.type}</span>
      </div>
      <div class="spec-chip">
        <em>Colour</em>
        <span>${product.color}</span>
      </div>
      <div class="spec-chip">
        <em>Storage</em>
        <span>${product.storage}</span>
      </div>
      <div class="spec-chip">
        <em>Battery Health</em>
        <span>${product.batteryHealth}</span>
      </div>
      <div class="spec-chip">
        <em>Condition</em>
        <span>${product.condition}</span>
      </div>
      <div class="spec-chip">
        <em>Warranty</em>
        <span>${product.warranty}</span>
      </div>
    </div>

    <!-- Description -->
    <div class="detail-description-section">
      <h4>Description</h4>
      <p>${product.description}</p>
    </div>

    <!-- Bottom Detail Bar -->
    <div class="detail-action-bar">
      <div class="icon-action-btn" onclick="openProductChat('${product.id}')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
      </div>
      <div class="icon-action-btn" onclick="addItemToBag('${product.id}')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.88 1.46h13.08c.88 0 1.65-.62 1.88-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9zm3 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
      </div>
      <button class="purchase-btn detail-purchase-btn" onclick="instantPurchase('${product.id}')">Purchase Now</button>
    </div>
  `;
}

// --- RENDER COMPONENT: SEARCH SCREEN ---
function renderSearchScreen(query = '') {
  let searchResultsHtml = '';
  
  if (query.trim().toLowerCase() === 'iphone 16 pro max') {
    searchResultsHtml = `
      <div class="product-card" onclick="switchTab('detail', 'Iphone16')" style="width:100%;">
        <div class="product-image-box" style="height:150px;">
          <img src="${PRODUCTS.Iphone16.image}" alt="iPhone 16 Pro Max">
          <span class="product-condition-tag">${PRODUCTS.Iphone16.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone16.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone16.color}</span>
          <span class="product-price">${PRODUCTS.Iphone16.priceStr}</span>
        </div>
      </div>
    `;
  } else {
    searchResultsHtml = `
      <div class="recent-searches">
        <h4>Recent Searches</h4>
        <div class="recent-search-item" onclick="triggerSearchText('Iphone 16 Pro Max')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>Iphone 16 Pro Max</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('home')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Search</h3>
    </div>

    <div class="search-bar-wrapper">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" id="active-search-input" value="${query}" placeholder="Search product..." oninput="handleSearchInputChange(this.value)">
    </div>

    <div id="search-results-box">
      ${searchResultsHtml}
    </div>
  `;
}

function handleSearchInputChange(val) {
  const box = document.getElementById('search-results-box');
  if (!box) return;
  
  if (val.toLowerCase().includes('orange') || val.toLowerCase().includes('bronze')) {
    box.innerHTML = `
      <div class="product-card" onclick="switchTab('detail', 'Iphone17')" style="width:100%;">
        <div class="product-image-box" style="height:150px;">
          <img src="${PRODUCTS.Iphone17.image}" alt="iPhone 17 Pro Max">
          <span class="product-condition-tag" style="background: linear-gradient(135deg, orange, darkorange);">${PRODUCTS.Iphone17.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone17.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone17.color}</span>
          <span class="product-price">${PRODUCTS.Iphone17.priceStr}</span>
        </div>
      </div>
    `;
  } else if (val.toLowerCase().includes('iphone 16')) {
    box.innerHTML = `
      <div class="product-card" onclick="switchTab('detail', 'Iphone16')" style="width:100%;">
        <div class="product-image-box" style="height:150px;">
          <img src="${PRODUCTS.Iphone16.image}" alt="iPhone 16 Pro Max">
          <span class="product-condition-tag">${PRODUCTS.Iphone16.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone16.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone16.color}</span>
          <span class="product-price">${PRODUCTS.Iphone16.priceStr}</span>
        </div>
      </div>
    `;
  } else if (val.toLowerCase().includes('iphone 13')) {
    box.innerHTML = `
      <div class="product-card" onclick="switchTab('detail', 'Iphone13')" style="width:100%;">
        <div class="product-image-box" style="height:150px;">
          <img src="${PRODUCTS.Iphone13.image}" alt="iPhone 13">
          <span class="product-condition-tag new-unit">${PRODUCTS.Iphone13.type}</span>
        </div>
        <div class="product-details">
          <h4 class="product-title">${PRODUCTS.Iphone13.title}</h4>
          <span class="product-meta">${PRODUCTS.Iphone13.color}</span>
          <span class="product-price">${PRODUCTS.Iphone13.priceStr}</span>
        </div>
      </div>
    `;
  } else if (val.trim() === '') {
    box.innerHTML = `
      <div class="recent-searches">
        <h4>Recent Searches</h4>
        <div class="recent-search-item" onclick="triggerSearchText('Iphone 16 Pro Max')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>Iphone 16 Pro Max</span>
        </div>
      </div>
    `;
  } else {
    box.innerHTML = `
      <div class="bag-empty-state">
        <div class="empty-box-icon"></div>
        <h3>No Units Found</h3>
        <p>No listings match your search keyword. Try another name!</p>
      </div>
    `;
  }
}

function triggerSearchText(text) {
  renderScreen('search', text);
}

// --- RENDER COMPONENT: BAG / CART SCREEN ---
function renderBagScreen() {
  if (state.cart.length === 0) {
    return `
      <div class="screen-header">
        <h3 class="screen-title" style="margin-left:0;text-align:left;">Bag</h3>
      </div>
      <div class="bag-empty-state">
        <div class="empty-box-icon"></div>
        <h3>Your Bag is Empty</h3>
        <p>You haven't placed any items here yet. Let's find something you'll love!</p>
      </div>
    `;
  }
  
  // Cart items list render
  let itemsListHtml = '';
  let subtotal = 0;
  
  state.cart.forEach(item => {
    const itemCost = item.product.price * item.quantity;
    subtotal += itemCost;
    
    itemsListHtml += `
      <div class="bag-item-card">
        <div class="bag-item-img">
          <img src="${item.product.image}" alt="${item.product.title}">
        </div>
        <div class="bag-item-info">
          <h4 class="bag-item-title">${item.product.title}</h4>
          <span class="bag-item-price">Rp.${(item.product.price * item.quantity).toLocaleString('id-ID')},00</span>
          
          <div class="bag-item-qty-row">
            <button class="qty-btn" onclick="updateQty('${item.product.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${item.product.id}', 1)">+</button>
          </div>
        </div>
        <button class="delete-item-btn" onclick="removeItemFromCart('${item.product.id}')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;
  });
  
  const formattedSubtotal = `Rp.${subtotal.toLocaleString('id-ID')},00`;
  const shippingCost = 15000;
  const formattedShipping = `Rp.${shippingCost.toLocaleString('id-ID')},00`;
  const grandTotal = `Rp.${(subtotal + shippingCost).toLocaleString('id-ID')},00`;

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Bag</h3>
      <span style="font-size:12px;color:var(--accent-red);font-weight:700;cursor:pointer;" onclick="clearCart()">Delete All</span>
    </div>

    <div class="bag-items-list">
      ${itemsListHtml}
    </div>

    <!-- Active Shipping Address Card -->
    <div class="checkout-address-card">
      <div class="checkout-address-card-header">
        <h5>Delivery Address</h5>
        <span onclick="switchTab('change-address')">Change</span>
      </div>
      <div class="address-text-block">
        <svg style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-right:4px;" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span id="current-checkout-address">${state.address}</span>
      </div>
    </div>

    <!-- Checkout Pricing Summary Box -->
    <div class="checkout-summary-box">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formattedSubtotal}</span>
      </div>
      <div class="summary-row">
        <span>Delivery Courier</span>
        <span>${formattedShipping}</span>
      </div>
      <div class="summary-row grand-total">
        <span>Total Purchase</span>
        <span>${grandTotal}</span>
      </div>
    </div>

    <button class="purchase-btn purchase-btn-compact" onclick="placeOrder()">Purchase</button>
  `;
}

// Bag actions
function addItemToBag(prodId) {
  const product = PRODUCTS[prodId];
  const existing = state.cart.find(item => item.product.id === prodId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ product, quantity: 1 });
  }
  
  logEvent(`Customer added ${product.title} to Bag.`, 'customer');
  triggerToast('Added to Bag', `${product.title} added to your shopping list!`, '');
  updateBadges();
  renderScreen(state.currentTab);
}

function instantPurchase(prodId) {
  addItemToBag(prodId);
  switchTab('bag');
}

function updateQty(prodId, delta) {
  const existing = state.cart.find(item => item.product.id === prodId);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      state.cart = state.cart.filter(item => item.product.id !== prodId);
    }
  }
  updateBadges();
  renderScreen('bag');
}

function removeItemFromCart(prodId) {
  state.cart = state.cart.filter(item => item.product.id !== prodId);
  updateBadges();
  renderScreen('bag');
}

function clearCart() {
  state.cart = [];
  updateBadges();
  renderScreen('bag');
  logEvent('Customer cleared shopping cart.', 'customer');
}

// --- RENDER COMPONENT: PROFILE SCREEN ---
function renderProfileScreen() {
  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Profile</h3>
    </div>

    <div class="profile-card">
      <div class="profile-avatar-large">
        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop" alt="Cat Avatar">
      </div>
      <h4 class="profile-name">Jonathan Richard</h4>
      <span class="profile-email">joni_123@gmail.com</span>
    </div>

    <div class="menu-section-title">Order History</div>
    <div class="menu-list">
      <div class="menu-item" onclick="switchTab('order')">
        <div class="menu-item-icon">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 8H5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm-7 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm7-11H5c-1.1 0-2 .9-2 2h18c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <div class="menu-item-label">View Order History</div>
        <span class="menu-item-arrow"></span>
      </div>
    </div>

    <div class="menu-section-title">Others</div>
    <div class="menu-list">
      <div class="menu-item" onclick="switchTab('settings')">
        <div class="menu-item-icon">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
        </div>
        <div class="menu-item-label">Setting</div>
        <span class="menu-item-arrow"></span>
      </div>
      <div class="menu-item" onclick="triggerToast('Notifications', 'System is active and notifications are on!', '')">
        <div class="menu-item-icon">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
        <div class="menu-item-label">Notification</div>
        <span class="menu-item-arrow"></span>
      </div>
    </div>
  `;
}

// --- RENDER COMPONENT: SETTINGS SCREEN ---
function renderSettingsScreen() {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('profile')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Setting</h3>
    </div>

    <div class="menu-section-title">Account</div>
    <div class="settings-option-card" onclick="openSwitchAccountModal()">
      <div class="settings-option-info">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 8H5c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zM12 15c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
        <span class="settings-option-label">Switch Account</span>
      </div>
      <span class="menu-item-arrow"></span>
    </div>

    <div class="menu-section-title">Address</div>
    <div class="settings-option-card" onclick="switchTab('change-address')">
      <div class="settings-option-info">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span class="settings-option-label">Change Address</span>
      </div>
      <span class="menu-item-arrow"></span>
    </div>
  `;
}

function openSwitchAccountModal() {
  // Rather than opening an overlay, we will log a switch trigger and switch role to courier
  logEvent('Opened Account Switch panel in Settings', 'customer');
  triggerToast('Switch Role', 'To change account roles, use the SIMULATOR PANEL on the right!', '');
}

// --- RENDER COMPONENT: CHANGE ADDRESS SCREEN ---
function renderChangeAddressScreen() {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('settings')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Setting</h3>
    </div>

    <div class="address-input-wrapper">
      <label>Address</label>
      <textarea class="address-textarea" id="address-input-box" placeholder="Type your address here...">${state.address}</textarea>
    </div>

    <button class="purchase-btn" style="width:100%; background-color:var(--accent-blue);" onclick="saveAddressChange()">Confirm</button>
  `;
}

function saveAddressChange() {
  const newVal = document.getElementById('address-input-box').value;
  if (newVal.trim() !== '') {
    state.address = newVal;
    logEvent(`Shipping address updated to: ${newVal}`, 'customer');
    triggerToast('Address Updated', 'Shipping address successfully saved!', '');
    switchTab('settings');
  } else {
    triggerToast('Address Error', 'Address field cannot be left blank!', '');
  }
}

// --- PLACE ACTIVE PURCHASE ORDER ---
function placeOrder() {
  if (state.cart.length === 0) return;
  
  state.orderStatus = 'packing';
  state.orderRating = 0;
  state.orderItems = state.cart.map(item => ({ product: item.product, quantity: item.quantity }));
  logEvent('Order placed successfully! State: PACKING. Admin preparing order.', 'customer');
  
  // Add item info into Admin chat
  const orderedItemsStr = state.cart.map(item => `${item.product.title} (x${item.quantity})`).join(', ');
  state.chats.admin.push(
    { sender: 'outgoing', text: `Hi! I just purchased: ${orderedItemsStr}. Can you please double check and send it via Eddy?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { sender: 'incoming', text: 'Thank you for your order, Jonathan! We are currently PACKING your iPhone unit. Eddy will pick it up shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  );
  
  state.cart = []; // clear cart
  updateBadges();
  
  triggerToast('Order Confirmed', 'Your iPhone order is now being packed by the seller!', '');
  switchTab('order');
  
  // Set automatic simulator progression helper (Packing -> Pickup in 10s)
  setTimeout(() => {
    if (state.orderStatus === 'packing') {
      progressOrderState();
    }
  }, 10000);
}

// --- RENDER COMPONENT: ORDER HISTORY & LIVE TRACKER ---
function renderOrderScreen() {
  if (state.orderStatus === 'none') {
    return `
      <div class="screen-header">
        <h3 class="screen-title" style="margin-left:0;text-align:left;">Order</h3>
      </div>
      <div class="bag-empty-state">
        <div class="empty-box-icon"></div>
        <h3>You haven't placed any orders yet</h3>
        <p>Looks like you haven't placed an order yet. Let's find something you'll love!</p>
      </div>
    `;
  }
  
  // 1. Progress Step Visuals
  const stages = ['packing', 'pickup', 'delivery', 'delivered'];
  const activeIdx = stages.indexOf(state.orderStatus);
  const progressPercent = activeIdx * 33.3;
  
  let stepperNodesHtml = '';
  stages.forEach((stage, idx) => {
    let cls = '';
    if (idx < activeIdx) cls = 'completed';
    else if (idx === activeIdx) cls = 'active';
    
    // Icon mappings
    let dotContent = '\u{1F4E6}';
    if (stage === 'pickup') dotContent = '\u{1F6F5}';
    if (stage === 'delivery') dotContent = '\u{1F69A}';
    if (stage === 'delivered') dotContent = '\u{1F3C1}';
    
    stepperNodesHtml += `
      <div class="stepper-node ${cls}">
        <div class="node-dot">${dotContent}</div>
        <span class="node-label">${stage}</span>
      </div>
    `;
  });

  // 2. Status Banner Box Content
  let bannerTitle = 'PACKING';
  let bannerDesc = 'Seller is preparing your package. Please wait, we will update you soon!';
  
  if (state.orderStatus === 'pickup') {
    bannerTitle = 'PACKAGE PICKUP';
    bannerDesc = 'Your package has been picked up by the courier.';
  } else if (state.orderStatus === 'delivery') {
    bannerTitle = 'ON DELIVERY';
    bannerDesc = 'Courier is on the way to your address. Arriving shortly.';
  } else if (state.orderStatus === 'delivered') {
    bannerTitle = 'DELIVERED';
    bannerDesc = 'Your package has been delivered successfully!';
  }

  // 3. Sub-layouts (Map or Rating)
  let subContentHtml = '';
  if (state.orderStatus === 'delivery') {
    subContentHtml = `
      <div class="live-tracker-map-wrapper">
        <canvas id="map-canvas" class="live-map-canvas"></canvas>
        <div class="map-overlay-card">
          <div class="map-overlay-info">
            <h6>Courier Location</h6>
            <p>Moving along Pakis-Malang Road</p>
          </div>
          <span style="font-size:12px;color:var(--accent-cyan);font-weight:700;">${Math.round(state.mapProgress)}%</span>
        </div>
      </div>
    `;
  } else if (state.orderStatus === 'delivered') {
    subContentHtml = `
      <div class="order-tracker-card rating-section">
        <h4 class="rating-title">How was your experience?</h4>
        <div class="star-rating-box" id="star-box">
          ${renderStars()}
        </div>
        <button class="submit-rating-btn" onclick="submitRating()">Rate Seller</button>
      </div>
    `;
  }

  const orderItems = state.orderItems.length > 0
    ? state.orderItems
    : [{ product: PRODUCTS.Iphone16, quantity: 1 }];

  let orderItemsHtml = '';
  orderItems.forEach(item => {
    orderItemsHtml += `
      <div class="order-tracker-card" style="display:flex;gap:12px;align-items:center;">
        <div style="background:#f2f3f6;width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
          <img src="${item.product.image}" alt="${item.product.title}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="min-width:0;">
          <h5 style="font-size:12px;font-weight:700;white-space:normal;">${item.product.title}</h5>
          <p style="font-size:10px;color:var(--text-phone-secondary);">${item.product.type}, ${item.product.color}, Qty: ${item.quantity}</p>
          <span style="font-size:11px;font-weight:800;">Rp.${(item.product.price * item.quantity).toLocaleString('id-ID')},00</span>
        </div>
      </div>
    `;
  });

  // 4. Base Visuals for Order Card
  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Order</h3>
    </div>

    <!-- Stepper Node Progress -->
    <div class="tracking-stepper">
      <div class="stepper-progress-line" style="width: ${progressPercent}%;"></div>
      ${stepperNodesHtml}
    </div>

    <!-- Tracker Banner Status Box -->
    <div class="tracker-status-box ${state.orderStatus}">
      <h4 class="tracker-status-title">${bannerTitle}</h4>
      <p class="tracker-status-desc">${bannerDesc}</p>
    </div>

    <!-- Live Map Canvas or Ratings Section -->
    ${subContentHtml}

    <!-- Package Detail Info Card -->
    ${orderItemsHtml}

    <!-- Courier / Shipping details -->
    ${state.orderStatus !== 'packing' ? `
      <div class="courier-info-box">
        <div class="courier-avatar">${state.orderCourier.avatar}</div>
        <div class="courier-details">
          <h5 class="courier-name">${state.orderCourier.name}</h5>
          <p class="courier-meta">Vehicle: ${state.orderCourier.vehicle} | Plate: ${state.orderCourier.plate}</p>
        </div>
        <button class="icon-action-btn" style="width:34px;height:34px;border-radius:10px;" onclick="openCourierChat()">
          <svg style="width:14px;height:14px;" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </button>
      </div>
    ` : `
      <div class="order-tracker-card">
        <h5 style="font-size:11px;font-weight:700;margin-bottom:4px;">Delivery Address</h5>
        <p style="font-size:10px;color:var(--text-phone-secondary);line-height:1.4;">${state.address}</p>
      </div>
    `}
  `;
}

function openCourierChat() {
  state.activeChatPartner = 'courier';
  switchTab('chat');
}

// --- RENDERING SVG RATINGS STARS ---
function renderStars() {
  let starsHtml = '';
  for(let i=1; i<=5; i++) {
    const cls = i <= state.orderRating ? 'selected' : '';
    starsHtml += `
      <svg class="${cls}" onclick="setRatingValue(${i})" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    `;
  }
  return starsHtml;
}

function setRatingValue(val) {
  state.orderRating = val;
  const box = document.getElementById('star-box');
  if (box) box.innerHTML = renderStars();
}

function submitRating() {
  if (state.orderRating === 0) {
    triggerToast('Select Stars', 'Please select at least 1 star to rate the seller!', '');
    return;
  }
  
  logEvent(`Customer submitted ${state.orderRating} rating for PhoneHub shop!`, 'customer');
  triggerToast('Rating Submitted', 'Thank you for your feedback!', '');
  state.orderStatus = 'none'; // reset order tracking
  switchTab('home');
}

// --- REAL-TIME COURIER MAP SIMULATION (CANVAS) ---
function initLiveMapCanvas() {
  const canvas = document.getElementById('map-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set resolution
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  // Map points coordinate data (Warehouse -> Pakis -> Customer house)
  const warehouse = { x: 30, y: 150, label: 'PhoneHub HQ' };
  const destination = { x: canvas.width - 40, y: 40, label: 'Your House' };
  
  // Curve points
  const points = [
    warehouse,
    { x: canvas.width * 0.3, y: 140 },
    { x: canvas.width * 0.5, y: 90 },
    { x: canvas.width * 0.7, y: 110 },
    destination
  ];
  
  function drawMap(progress) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Background Map Grid Lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.width; i+=40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for(let j=0; j<canvas.height; j+=40) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke();
    }
    
    // Draw Rivers / Decor shapes
    ctx.fillStyle = '#b3e5fc';
    ctx.beginPath();
    ctx.arc(-20, 80, 80, 0, Math.PI*2);
    ctx.fill();
    
    // Draw Roads (Connecting path Spline)
    ctx.strokeStyle = '#cfd8dc';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let i=1; i<points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Draw Trailed/Completed Path (Blue line)
    ctx.strokeStyle = 'hsl(210, 100%, 50%)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Precompute courier point along path based on progress percent
    const currentPt = getPointAlongPath(points, progress / 100);
    
    // Draw sub-path to courier position
    ctx.lineTo(currentPt.x, currentPt.y);
    ctx.stroke();
    
    // Draw Warehouse Terminal Icon Pin
    ctx.fillStyle = 'hsl(225, 20%, 15%)';
    ctx.beginPath(); ctx.arc(warehouse.x, warehouse.y, 10, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.fillText('', warehouse.x - 7, warehouse.y + 3);
    
    // Draw Customer House Terminal Icon Pin
    ctx.fillStyle = 'var(--accent-green)';
    ctx.beginPath(); ctx.arc(destination.x, destination.y, 12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('', destination.x - 7, destination.y + 4);
    
    // Draw Courier Moving Pin Icon
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(currentPt.x, currentPt.y, 12, 0, Math.PI*2);
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    ctx.fillStyle = '#fff';
    ctx.fillText('', currentPt.x - 7, currentPt.y + 4);
  }
  
  function getPointAlongPath(pts, t) {
    // Linear spline interpolation
    if (t <= 0) return pts[0];
    if (t >= 1) return pts[pts.length - 1];
    
    const count = pts.length - 1;
    const segment = Math.floor(t * count);
    const localT = (t * count) - segment;
    
    const p0 = pts[segment];
    const p1 = pts[segment + 1];
    
    return {
      x: p0.x + (p1.x - p0.x) * localT,
      y: p0.y + (p1.y - p0.y) * localT
    };
  }
  
  function update() {
    if (state.orderStatus !== 'delivery') return;
    
    state.mapProgress += 0.15; // smooth step speed
    if (state.mapProgress > 100) {
      state.mapProgress = 100;
      drawMap(100);
      
      // Auto complete delivery once map concludes
      progressOrderState();
      return;
    }
    
    drawMap(state.mapProgress);
    state.mapAnimationId = requestAnimationFrame(update);
  }
  
  update();
}

// --- RENDER COMPONENT: LIVE CHAT SCREEN ---
function renderChatScreen() {
  const isCourier = state.activeChatPartner === 'courier';
  const partnerName = isCourier ? 'Eddy | Courier' : 'PhoneHub | Admin';
  const history = isCourier ? state.chats.courier : state.chats.admin;
  
  let messagesHtml = '';
  history.forEach(msg => {
    messagesHtml += `
      <div class="chat-message-bubble ${msg.sender}">
        ${msg.text}
        
        <!-- Embedded details mockups -->
        ${msg.productLink ? `
          <div class="chat-product-box ${msg.sender === 'outgoing' ? 'dark' : ''}">
            <img src="${PRODUCTS[msg.productLink].image}">
            <div class="chat-product-details">
              <h5 class="chat-product-title">${PRODUCTS[msg.productLink].title}</h5>
              <span class="chat-product-price">${PRODUCTS[msg.productLink].priceStr}</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  });

  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('home')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title" id="chat-partner-title">${partnerName}</h3>
    </div>

    <!-- Scrollable Messages Area -->
    <div class="chat-messages-scroll" id="chat-scroll-area">
      ${messagesHtml}
      <div class="chat-typing-bubble" id="chat-typing" style="display:none;">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>

    <!-- Quick Answers Trigger Suggestion -->
    <div class="quick-replies-row">
      <span class="quick-reply-tag" onclick="sendQuickReply('Apakah stok iPhone 16 masih ada?')">Apakah stok iPhone 16 ada?</span>
      <span class="quick-reply-tag" onclick="sendQuickReply('Saya mau tanya rincian detail iPhone 13')">Rincian detail iPhone 13</span>
      <span class="quick-reply-tag" onclick="sendQuickReply('Apakah pengiriman bisa instant?')">Pengiriman instant?</span>
    </div>

    <!-- Input text box row -->
    <form class="chat-input-row" onsubmit="handleSendChatMessage(event)">
      <div class="chat-input-box">
        <input type="text" id="chat-text-input" placeholder="Type here...">
        <div class="chat-input-icon" onclick="triggerToast('Attachment', 'Sending photos disabled in prototype', '')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </div>
      </div>
      <button class="chat-send-btn" type="submit">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </form>
  `;
}

function scrollChatToBottom() {
  const area = document.getElementById('chat-scroll-area');
  if (area) {
    area.scrollTop = area.scrollHeight;
  }
}

function openProductChat(prodId) {
  state.activeChatPartner = 'admin';
  const prod = PRODUCTS[prodId];
  
  // Inject automatic message payload
  state.chats.admin.push({
    sender: 'outgoing',
    text: `Halo, saya tertarik dengan unit ${prod.title} ini. Apakah barangnya ready?`,
    productLink: prodId,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  switchTab('chat');
  
  // Simulate Auto reply
  simulateTypingReply('admin', `Halo Jonathan! Ya, unit ${prod.title} ini grade A+ second mulus 100% original. Stoknya sedang rebutan kak, silakan checkout langsung!`);
}

function handleSendChatMessage(event) {
  event.preventDefault();
  const input = document.getElementById('chat-text-input');
  if (!input || input.value.trim() === '') return;
  
  const text = input.value;
  input.value = '';
  
  sendUserMessage(text);
}

function sendUserMessage(text) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const partner = state.activeChatPartner;
  
  state.chats[partner].push({ sender: 'outgoing', text, time });
  logEvent(`Customer sent chat to ${partner.toUpperCase()}: "${text}"`, 'customer');
  
  renderScreen('chat');
  
  // Simple smart reply matching keywords
  let reply = 'Tentu kak, kami akan segera memproses pertanyaannya.';
  if (text.toLowerCase().includes('iphone 16')) {
    reply = 'Stok iPhone 16 Pro Max sisa 1 unit lagi kak! Silakan checkout.';
  } else if (text.toLowerCase().includes('detail iphone 13')) {
    reply = 'iPhone 13 new unit original garansi iBox 1 tahun lengkap segel box.';
  } else if (text.toLowerCase().includes('instant')) {
    reply = 'Ya! Pengiriman bisa menggunakan Eddy Express, sampai dalam waktu 1 jam.';
  } else if (text.toLowerCase().includes('eddy') || text.toLowerCase().includes('kurir')) {
    reply = 'Halo kak, saya sedang mengemas dan merapikan barangnya di motor saya.';
  }
  
  simulateTypingReply(partner, reply);
}

function sendQuickReply(text) {
  sendUserMessage(text);
}

function simulateTypingReply(partner, replyText) {
  const typingEl = document.getElementById('chat-typing');
  if (typingEl) typingEl.style.display = 'flex';
  scrollChatToBottom();
  
  setTimeout(() => {
    if (typingEl) typingEl.style.display = 'none';
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.chats[partner].push({ sender: 'incoming', text: replyText, time });
    
    // Alert user if not on chat screen
    if (state.currentTab !== 'chat') {
      triggerToast(`New message from ${partner.toUpperCase()}`, replyText, '');
    }
    
    logEvent(`${partner.toUpperCase()} replied: "${replyText}"`, partner);
    renderScreen(state.currentTab);
  }, 2000);
}

// --- RENDER COMPONENT: COURIER SIMULATOR DASHBOARD ---
function renderCourierDashboard() {
  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Courier Dashboard</h3>
    </div>

    <div class="profile-card" style="padding:16px;">
      <h4>Active Courier: Eddy</h4>
      <p style="font-size:11px;color:var(--text-phone-secondary);">Delivery Partner | Vehicle: Honda Vario (N 3431 ABC)</p>
    </div>

    <div class="menu-section-title">Active Orders to Deliver</div>
    
    ${state.orderStatus !== 'none' && state.orderStatus !== 'delivered' ? `
      <div class="order-tracker-card" style="border-left: 4px solid var(--accent-blue);">
        <h5 style="font-weight:700;">Order ID: PH-7758</h5>
        <p style="font-size:10px;color:var(--text-phone-secondary);margin-bottom:8px;">Customer: Jonathan Richard</p>
        
        <!-- Status indicator button controls -->
        <div style="font-size:11px;font-weight:700;margin-bottom:12px;">
          Current Status: <span style="text-transform:uppercase;color:var(--accent-blue);">${state.orderStatus}</span>
        </div>

        <div style="display:flex;gap:8px;">
          ${state.orderStatus === 'packing' ? `
            <button class="purchase-btn" style="background:var(--accent-blue);" onclick="courierAction('pickup')">Pick Up Package</button>
          ` : ''}
          ${state.orderStatus === 'pickup' ? `
            <button class="purchase-btn" style="background:purple;" onclick="courierAction('deliver')">Start Delivery Ride</button>
          ` : ''}
          ${state.orderStatus === 'delivery' ? `
            <button class="purchase-btn" style="background:var(--accent-green);" onclick="courierAction('complete')">Confirm Delivered</button>
          ` : ''}
        </div>
      </div>
    ` : `
      <div class="bag-empty-state" style="padding:30px 0;">
        <div class="empty-box-icon"></div>
        <h3>No active deliveries</h3>
        <p>All phone packages have been delivered. Time to take a coffee break!</p>
      </div>
    `}

    <button class="purchase-btn" style="width:100%;margin-top:20px;background:#555;" onclick="setRole('customer')">Exit Courier Mode</button>
  `;
}

function courierAction(action) {
  if (action === 'pickup') {
    state.orderStatus = 'pickup';
    logEvent('Courier Eddy has picked up the package from the warehouse.', 'courier');
    triggerToast('Courier Pickup', 'Eddy has picked up your package and is securing it!', '');
    
    // Courier message automatically sent
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Halo Jonathan, paket iPhone 16 Pro Max kamu sudah saya ambil dari warehouse. Siap meluncur!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } else if (action === 'deliver') {
    state.orderStatus = 'delivery';
    state.mapProgress = 0; // reset map coordinates
    logEvent('Courier Eddy started the delivery ride to customer house.', 'courier');
    triggerToast('Out for Delivery', 'Eddy is on the way to your address with your phone!', '');
    
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Saya sudah jalan ya kak menuju Jl. Mansion Valley. Silakan dipantau lokasinya di peta aplikasi!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  } else if (action === 'complete') {
    state.orderStatus = 'delivered';
    logEvent('Courier Eddy arrived and completed delivery successfully.', 'courier');
    triggerToast('Package Delivered', 'Your iPhone 16 Pro Max has been delivered! Please rate the shop.', '');
    
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Paketnya sudah diterima ya kak oleh Jonathan Richard. Terima kasih banyak!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }
  
  renderScreen('courier-dashboard');
  updateSimulatorPanel();
}

// --- RENDER COMPONENT: OWNER / ADMIN DASHBOARD ---
function renderOwnerDashboard() {
  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Owner Dashboard</h3>
    </div>

    <div class="profile-card" style="padding:16px;background:linear-gradient(135deg, #111 0%, #222 100%);color:#fff;">
      <h4 style="color:#fff;">PhoneHub Store Manager</h4>
      <p style="font-size:11px;opacity:0.8;">Admin: Jonathan (Owner Mode)</p>
    </div>

    <!-- Metrics row -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;">
      <div style="background:#fff;padding:12px;border-radius:10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.02);">
        <span style="font-size:9px;color:var(--text-phone-secondary);text-transform:uppercase;display:block;">Total Sales</span>
        <strong style="font-size:13px;">Rp 16.500.000</strong>
      </div>
      <div style="background:#fff;padding:12px;border-radius:10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.02);">
        <span style="font-size:9px;color:var(--text-phone-secondary);text-transform:uppercase;display:block;">Active Orders</span>
        <strong style="font-size:13px;">${state.orderStatus !== 'none' ? '1 Order' : '0 Orders'}</strong>
      </div>
    </div>

    <div class="menu-section-title">Store Operations</div>
    <div class="menu-list">
      <div class="menu-item" onclick="triggerToast('Stock Manage', 'iPhone 16 Pro Max stock replenished (10 units)', '')">
        <div class="menu-item-icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 7.5v9l-8 4.5-8-4.5v-9L12 3l8 4.5zm-8 2.2 4.8-2.7L12 4.3 7.2 7 12 9.7zm-6 6.1 5 2.8v-7.2L6 8.6v7.2zm7 2.8 5-2.8V8.6l-5 2.8v7.2z"/></svg></div>
        <div class="menu-item-label">Replenish iPhone Stock</div>
      </div>
      <div class="menu-item" onclick="triggerSimulatorAction('price-drop')">
        <div class="menu-item-icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 4 14h6l-2 8 8-12h-6l2-8z"/></svg></div>
        <div class="menu-item-label">Launch Discount Promo</div>
      </div>
    </div>

    <button class="purchase-btn" style="width:100%;margin-top:20px;background:#555;" onclick="setRole('customer')">Exit Owner Mode</button>
  `;
}

// --- SIMULATOR CONTROL PANEL LOGIC & SYNC ---
function updateSimulatorPanel() {
  const detailsEl = document.getElementById('order-sim-details');
  const dPacking = document.getElementById('dot-packing');
  const dPickup = document.getElementById('dot-pickup');
  const dDelivery = document.getElementById('dot-delivery');
  const dDelivered = document.getElementById('dot-delivered');
  
  if (!detailsEl) return;
  
  // Reset all active dots
  [dPacking, dPickup, dDelivery, dDelivered].forEach(dot => {
    if (dot) dot.classList.remove('active');
  });
  
  if (state.orderStatus === 'none') {
    detailsEl.innerHTML = `<em>No active order placed yet. Shop in the Home tab and checkout to trigger real-time order progression!</em>`;
    return;
  }
  
  // Highlight active simulator steps
  if (state.orderStatus === 'packing') {
    dPacking.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: PACKING</strong><br>
      The customer has purchased the phone. The merchant (PhoneHub Owner) is packing the unit and marking it ready for shipping.
    `;
  } else if (state.orderStatus === 'pickup') {
    dPickup.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: PACKAGE PICKUP</strong><br>
      Courier Eddy has picked up the package. He is mounting it on his motorcycle and preparing to start the delivery.
    `;
  } else if (state.orderStatus === 'delivery') {
    dDelivery.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: ON DELIVERY</strong><br>
      The courier is driving down the street. The client can view his real-time position live on the Canvas map! (Map progress: ${Math.round(state.mapProgress)}%)
    `;
  } else if (state.orderStatus === 'delivered') {
    dDelivered.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: DELIVERED (SUCCESS)</strong><br>
      The courier has successfully hand-delivered the package. The customer is currently filling out the stars rating feedback sheet!
    `;
  }
}

// --- FAST ACTION TRIGGERS FROM SIMULATOR PANEL ---
function triggerSimulatorAction(action) {
  if (action === 'add-item') {
    addItemToBag('Iphone13');
  } 
  else if (action === 'advance-order') {
    if (state.orderStatus === 'none') {
      logEvent('Cannot progress order. Please buy a phone first from the emulator!', 'system');
      triggerToast('Buy Phone First', 'Add a phone to the bag and checkout to begin order tracking!', '');
      return;
    }
    progressOrderState();
  } 
  else if (action === 'receive-chat') {
    const activePartner = state.activeChatPartner;
    const txt = activePartner === 'courier' 
      ? 'Halo Jonathan, saya sudah dekat nih sama jalan masuk gerbang perumahan.' 
      : 'Halo Jonathan, kami punya unit iPhone 16 Pro Max second grade S super mulus baru masuk. Mau dinego?';
      
    simulateTypingReply(activePartner, txt);
  } 
  else if (action === 'price-drop') {
    PRODUCTS.Iphone16.price = 14999999;
    PRODUCTS.Iphone16.priceStr = 'Rp.14.999.000,00';
    logEvent('Owner launched promotional discount: iPhone 16 Pro Max dropped to Rp 14.999.000!', 'owner');
    triggerToast('Special Flash Sale', 'iPhone 16 Pro Max price dropped to Rp 14.999.000!', '');
    
    // Refresh screen to reflect price drops
    renderScreen(state.currentTab);
  }
}

// Progress through Order stages
function progressOrderState() {
  if (state.orderStatus === 'packing') {
    courierAction('pickup');
  } else if (state.orderStatus === 'pickup') {
    courierAction('deliver');
  } else if (state.orderStatus === 'delivery') {
    courierAction('complete');
  }
  
  // Refresh UI screen
  renderScreen(state.currentTab);
}






