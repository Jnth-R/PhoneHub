/* ==========================================================================
   PHONEHUB MASTER STATE ENGINE & UI CONTROLLER
   Full-featured, interactive, role-specific dynamic prototype simulator
   ========================================================================== */

// --- INITIAL PRODUCT LIST (Mocking Facebook Marketplace 1-Product Buy) ---
const INITIAL_PRODUCTS = {
  Iphone16: {
    id: 'Iphone16',
    title: 'iPhone 16 Pro Max',
    type: 'Second Unit',
    color: 'Black Colour',
    storage: '256 Gb',
    batteryHealth: '95%',
    condition: '99%',
    warranty: 'Garansi on iBox',
    price: 16500000,
    priceStr: 'Rp.16.500.000,00',
    description: 'iPhone 16 Pro Max second kondisi mulus dan terawat dengan storage 256 GB. Semua fungsi normal mulai dari Face ID, kamera depan dan belakang, speaker, mic, hingga tombol berfungsi dengan baik. Battery Health 95%. Lengkap dengan box original.',
    image: 'assets/Iphone16.png',
    status: 'available' // available | sold
  },
  Iphone13: {
    id: 'Iphone13',
    title: 'iPhone 13',
    type: 'New Unit',
    color: 'Midnight Colour',
    storage: '256 Gb',
    batteryHealth: '100%',
    condition: '100%',
    warranty: 'Garansi on iBox',
    price: 8299999,
    priceStr: 'Rp.8.299.999,00',
    description: 'iPhone 13 second kondisi mulus terawat dengan storage 256 GB. Semua fungsi normal mulai dari Face ID, kamera depan belakang, speaker, mic, hingga tombol berfungsi baik. Battery Health 100%. Kelengkapan fullset original garansi iBox.',
    image: 'assets/Iphone13.png',
    status: 'available'
  },
  Iphone17: {
    id: 'Iphone17',
    title: 'iPhone 17 Pro Max',
    type: 'Special Unit',
    color: 'Desert Bronze',
    storage: '512 Gb',
    batteryHealth: '100%',
    condition: '100%',
    warranty: 'Resmi iBox Aktif',
    price: 23000000,
    priceStr: 'Rp.23.000.000,00',
    description: 'iPhone 17 Pro Max Edisi Spesial Desert Bronze / Orange. Unit super langka, mulus 100% tanpa lecet sedikit pun. Lengkap segel box original beserta semua aksesoris bawaan. Garansi resmi iBox aktif panjang.',
    image: 'assets/Iphone17.png',
    status: 'available'
  }
};

// --- PRESET PRODUCT IMAGES FOR SIMULATED ADD-PRODUCT PHOTO ---
const PHOTO_PRESETS = {
  black: 'assets/Iphone16.png',
  midnight: 'assets/Iphone13.png',
  bronze: 'assets/Iphone17.png'
};

// --- REAL-WORLD LOCATION TRACKING COORDINATES (Malang Center to Pakis) ---
const ROUTE_COORDINATES = [
  [-7.9568, 112.6189], // Malang Town Square / Warehouse (Mulai)
  [-7.9585, 112.6300], // Jalan Bandung
  [-7.9630, 112.6450], // Jalan Rampal
  [-7.9650, 112.6650], // Jalan Danau Toba
  [-7.9610, 112.6800], // Jalan Ampeldento
  [-7.9626, 112.6908]  // Jl. Mansion Valley, Pakis (Home / Selesai)
];

// --- GLOBAL APPLICATION STATE ---
let state = {
  products: { ...INITIAL_PRODUCTS },
  cart: [],
  selectedCartItems: [],
  address: "Jl. Mansion Valley No.8 - 22, Genitri, Tirtomoyo, Pakis, Malang, Jawa Timur 65154",
  selectedProduct: null,
  selectedPresetPhoto: 'black', // for adding product mockup

  activeRole: 'customer',   // customer | courier | owner
  currentTab: 'home',       // role-specific active page
  
  // Orders & Progression Database
  orderStatus: 'none',      // none | packing | pickup | delivery | delivered
  orderRating: 0,
  orderItems: [],
  ordersList: [
    { id: 'PH-1024', customer: 'Jonathan Richard', items: 'iPhone 13 (x1)', total: 8299999, status: 'Delivered', rating: 5, date: '25 May' },
    { id: 'PH-1025', customer: 'Angga', items: 'iPhone 16 Pro Max (x1)', total: 16500000, status: 'Delivered', rating: 4, date: '26 May' }
  ],
  
  // Customer List Database (Admin Page)
  customers: [
    { name: 'Jonathan Richard', email: 'joni_123@gmail.com', phone: '08122344178', status: 'Active' },
    { name: 'Angga Wisnu', email: 'angga_wis@gmail.com', phone: '08912344420', status: 'Active' },
    { name: 'Eddy Kurir', email: 'eddy_express@gmail.com', phone: '08121234338', status: 'Active' },
    { name: 'Joni Sitorus', email: 'joni_sit@gmail.com', phone: '08522334419', status: 'Not Active' }
  ],

  // Finance Transactions database
  financeSummary: {
    revenue: 24799999,
    expense: 30000,
    balance: 24769999
  },
  transactions: [
    { id: 'T-001', info: 'Penjualan iPhone 13 (PH-1024)', type: 'income', amount: 8299999 },
    { id: 'T-002', info: 'Penjualan iPhone 16 Pro Max (PH-1025)', type: 'income', amount: 16500000 },
    { id: 'T-003', info: 'Ongkos Kirim Kurir Eddy (PH-1024)', type: 'expense', amount: 15000 },
    { id: 'T-004', info: 'Ongkos Kirim Kurir Eddy (PH-1025)', type: 'expense', amount: 15000 }
  ],

  // Courier state
  courier: {
    name: 'Eddy',
    phone: '08121234338',
    vehicle: 'Honda Vario 125',
    plate: 'N 3431 ABC',
    avatar: '🛵',
    status: 'active', // active | inactive
    totalDeliveries: 2,
    rating: 4.5
  },

  // Chat System State
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

  // Map state
  leafletMap: null,
  leafletCourierMarker: null,
  mapProgress: 0,
  mapAnimationId: null
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  logEvent('PhoneHub Connected Prototype Engine ready.', 'system');
  updateClock();
  setInterval(updateClock, 60000);
  setRole('customer'); // start as customer
});

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const liveTimeEl = document.getElementById('live-time');
  if (liveTimeEl) liveTimeEl.textContent = `${hours}:${minutes}`;
}

// --- LOG SYSTEM MONITOR ---
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

// --- TOAST NOTIFICATION ---
function triggerToast(title, desc, icon = '🔔') {
  const toastEl = document.getElementById('phone-toast');
  if (!toastEl) return;
  toastEl.querySelector('.toast-icon').textContent = icon;
  toastEl.querySelector('.toast-title').textContent = title;
  toastEl.querySelector('.toast-desc').textContent = desc;
  toastEl.classList.add('show');
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 4000);
}

// --- ACTIVE ROLE SWITCHER (RIGHT PANEL) ---
function setRole(role) {
  state.activeRole = role;
  
  // Highlight simulator control button styles
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-role-${role}`).classList.add('active');
  
  logEvent(`Switched system context to: ${role.toUpperCase()}`, role);
  
  // Set default tabs per role
  if (role === 'courier') {
    switchTab('courier-profile');
  } else if (role === 'owner') {
    switchTab('owner-dashboard');
  } else {
    switchTab('home');
  }
}

// --- DYNAMIC TAB NAVIGATION AND NAVBAR RENDERING ---
function switchTab(tabName, payload = null) {
  state.currentTab = tabName;
  
  if (tabName !== 'detail') {
    state.selectedProduct = null;
  }
  
  // Render Dynamic Bottom Navigation Bar
  renderNavbar();
  
  // Render Dynamic Content Screen
  renderScreen(tabName, payload);
}

function renderNavbar() {
  const navbar = document.getElementById('phone-navbar');
  if (!navbar) return;

  // Decide if navbar should be hidden
  const hideNavbarOn = ['detail', 'settings', 'change-address', 'courier-deliveries-detail', 'courier-ride'];
  if (hideNavbarOn.includes(state.currentTab)) {
    navbar.style.display = 'none';
    return;
  }
  navbar.style.display = 'grid';
  navbar.className = `phone-navbar phone-navbar-${state.activeRole}`;

  let navbarHtml = '';

  if (state.activeRole === 'customer') {
    navbarHtml = `
      <div class="nav-item ${state.currentTab === 'home' ? 'active' : ''}" onclick="switchTab('home')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span>Home</span>
      </div>
      <div class="nav-item ${state.currentTab === 'chat' ? 'active' : ''}" onclick="switchTab('chat')">
        <div class="badge-dot" id="chat-badge"></div>
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
        <span>Chat</span>
      </div>
      <!-- Elevated Center Button: Order -->
      <div class="nav-item nav-order-btn ${state.currentTab === 'order' ? 'active' : ''}" onclick="switchTab('order')">
        <div class="nav-order-icon-wrapper">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8.7 13.3-3.6-3.6 1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7z"/></svg>
        </div>
        <span style="margin-top: 18px;">Order</span>
      </div>
      <div class="nav-item ${state.currentTab === 'bag' ? 'active' : ''}" onclick="switchTab('bag')">
        <div class="badge-count" id="bag-badge" style="display: none;">0</div>
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm-1.64-4.25l.03-.12H18.5c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"/></svg>
        <span>Bag</span>
      </div>
      <div class="nav-item ${state.currentTab === 'profile' ? 'active' : ''}" onclick="switchTab('profile')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Profile</span>
      </div>
    `;
  } else if (state.activeRole === 'courier') {
    navbarHtml = `
      <div class="nav-item courier-nav-item ${state.currentTab === 'courier-profile' ? 'active' : ''}" onclick="switchTab('courier-profile')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span>Profil</span>
      </div>
      <div class="nav-item courier-nav-item ${state.currentTab === 'courier-deliveries' ? 'active' : ''}" onclick="switchTab('courier-deliveries')">
        <div class="badge-dot" id="delivery-badge" style="display: ${state.orderStatus !== 'none' && state.orderStatus !== 'delivered' ? 'block' : 'none'};"></div>
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 7h-2V5c0-1.1-.9-2-2-2H4C2.9 3 2 3.9 2 5v10c0 1.1.9 2 2 2h1.22c.46 1.16 1.58 2 2.78 2 1.2 0 2.32-.84 2.78-2h3.44c.46 1.16 1.58 2 2.78 2 1.2 0 2.32-.84 2.78-2H21c.55 0 1-.45 1-1v-5l-3-4z"/></svg>
        <span>Pengiriman</span>
      </div>
      <div class="nav-item courier-nav-item ${state.currentTab === 'courier-history' ? 'active' : ''}" onclick="switchTab('courier-history')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/></svg>
        <span>Riwayat</span>
      </div>
    `;
  } else if (state.activeRole === 'owner') {
    navbarHtml = `
      <div class="nav-item ${state.currentTab === 'owner-dashboard' ? 'active' : ''}" onclick="switchTab('owner-dashboard')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
        <span>Dashboard</span>
      </div>
      <div class="nav-item ${state.currentTab === 'owner-finance' ? 'active' : ''}" onclick="switchTab('owner-finance')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
        <span>Keuangan</span>
      </div>
      <!-- Elevated Center Button: Add Product -->
      <div class="nav-item nav-order-btn ${state.currentTab === 'owner-add-product' ? 'active' : ''}" onclick="switchTab('owner-add-product')">
        <div class="nav-order-icon-wrapper" style="background-color: purple;">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </div>
        <span style="margin-top: 18px;">Tambah</span>
      </div>
      <div class="nav-item ${state.currentTab === 'owner-products' ? 'active' : ''}" onclick="switchTab('owner-products')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 7.5v9l-8 4.5-8-4.5v-9L12 3l8 4.5zm-8 2.2 4.8-2.7L12 4.3 7.2 7 12 9.7z"/></svg>
        <span>Produk</span>
      </div>
      <div class="nav-item ${state.currentTab === 'owner-orders' ? 'active' : ''}" onclick="switchTab('owner-orders')">
        <div class="badge-count" style="display: ${state.orderStatus === 'packing' ? 'block' : 'none'}; top: 2px;">1</div>
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
        <span>Pesanan</span>
      </div>
    `;
  }

  navbar.innerHTML = navbarHtml;
}

// --- RENDER DYNAMIC SCREEN TEMPLATE INJECTORS ---
function renderScreen(screen, payload) {
  const container = document.getElementById('phone-content');
  if (!container) return;
  
  // Leaflet cleanup routine to prevent DOM / state leaks
  if (state.leafletMap) {
    state.leafletMap.remove();
    state.leafletMap = null;
    state.leafletCourierMarker = null;
  }
  if (state.mapAnimationId) {
    cancelAnimationFrame(state.mapAnimationId);
    state.mapAnimationId = null;
  }

  let html = '';
  
  switch(screen) {
    // --- CUSTOMER PAGES ---
    case 'home':
      html = renderHomeScreen();
      break;
    case 'detail':
      const prodId = payload || 'Iphone16';
      state.selectedProduct = state.products[prodId];
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
      
    // --- COURIER PAGES ---
    case 'courier-profile':
      html = renderCourierProfileScreen();
      break;
    case 'courier-deliveries':
      html = renderCourierDeliveriesScreen();
      break;
    case 'courier-deliveries-detail':
      html = renderCourierDeliveriesDetailScreen();
      break;
    case 'courier-ride':
      html = renderCourierRideScreen();
      break;
    case 'courier-history':
      html = renderCourierHistoryScreen();
      break;

    // --- OWNER PAGES ---
    case 'owner-dashboard':
      html = renderOwnerDashboardScreen();
      break;
    case 'owner-finance':
      html = renderOwnerFinanceScreen();
      break;
    case 'owner-add-product':
      html = renderOwnerAddProductScreen();
      break;
    case 'owner-products':
      html = renderOwnerProductsScreen();
      break;
    case 'owner-orders':
      html = renderOwnerOrdersScreen();
      break;

    default:
      html = renderHomeScreen();
  }
  
  container.innerHTML = html;
  
  // Post-render lifecycle setups (Leaflet maps, scrolls)
  if (screen === 'order' && state.orderStatus === 'delivery') {
    initRealWorldLeafletMap('map-canvas');
  }
  if (screen === 'courier-ride' && state.orderStatus === 'delivery') {
    initRealWorldLeafletMap('courier-map-canvas');
  }
  if (screen === 'chat') {
    scrollChatToBottom();
  }
  
  updateBadges();
  updateSimulatorPanel();
}

// --- BADGE REFRESHING ---
function updateBadges() {
  const bagBadge = document.getElementById('bag-badge');
  const chatBadge = document.getElementById('chat-badge');
  const deliveryBadge = document.getElementById('delivery-badge');
  
  const cartTotalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (bagBadge) {
    if (cartTotalQty > 0) {
      bagBadge.style.display = 'block';
      bagBadge.textContent = cartTotalQty;
    } else {
      bagBadge.style.display = 'none';
    }
  }
  
  if (chatBadge) {
    chatBadge.style.display = state.chats.admin.length > 2 ? 'block' : 'none';
  }

  if (deliveryBadge) {
    deliveryBadge.style.display = (state.orderStatus !== 'none' && state.orderStatus !== 'delivered') ? 'block' : 'none';
  }
}

// ==========================================================================
// CUSTOMER SCREENS LOGIC
// ==========================================================================

function renderHomeScreen() {
  // Loop over products and render only available ones (Facebook Marketplace style)
  const availableProducts = Object.values(state.products).filter(p => p.status === 'available');
  
  let productsHtml = '';
  if (availableProducts.length === 0) {
    productsHtml = `
      <div style="grid-column: span 2; text-align: center; padding: 40px 10px; background: #fff; border-radius: 16px;">
        <span style="font-size: 32px; display:block; margin-bottom: 8px;">🛒</span>
        <h4 style="font-size:12px; font-weight:700;">No Phones Available</h4>
        <p style="font-size:10px; color:var(--text-phone-secondary); margin-top: 4px;">All units are sold out. Switch to Admin/Owner role to add more units!</p>
      </div>
    `;
  } else {
    availableProducts.forEach(product => {
      const tagClass = product.type.toLowerCase().includes('new') ? 'new-unit' : '';
      const isSpan2 = product.id === 'Iphone17' ? 'grid-column: span 2; display: flex; flex-direction: row; gap: 14px;' : '';
      const imageBoxStyle = product.id === 'Iphone17' ? 'width: 120px; height: 110px; flex-shrink: 0;' : '';
      const detailsStyle = product.id === 'Iphone17' ? 'justify-content: center;' : '';
      const priceStyle = product.id === 'Iphone17' ? 'font-size: 13.5px; color: darkorange;' : '';
      
      productsHtml += `
        <div class="product-card" onclick="switchTab('detail', '${product.id}')" style="${isSpan2}">
          <div class="product-image-box" style="${imageBoxStyle}">
            <img src="${product.image}" alt="${product.title}">
            <span class="product-condition-tag ${tagClass}">${product.type}</span>
          </div>
          <div class="product-details" style="${detailsStyle}">
            <h4 class="product-title">${product.title}</h4>
            <span class="product-meta">${product.color}</span>
            <span class="product-price" style="${priceStyle}">${product.priceStr}</span>
          </div>
        </div>
      `;
    });
  }

  return `
    <div class="home-welcome-row">
      <div class="profile-avatar-circle" onclick="switchTab('profile')">
        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop" alt="Cat Avatar">
      </div>
      <div class="welcome-text">
        <h4>Good Morning!</h4>
        <h2>Jonathan Richard</h2>
      </div>
      <div class="bell-icon-btn" onclick="triggerToast('Daily Stock Update', 'iPhone 16 Pro Max has been fully restocked!', '🔔')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </div>
    </div>

    <!-- Search Input Bar -->
    <div class="search-bar-wrapper">
      <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <input type="text" placeholder="Search product..." onfocus="switchTab('search')" readonly>
      <div class="filter-btn" onclick="triggerToast('Filter applied', 'Showing only best conditions units', '🔍')">
        <svg style="width:16px;height:16px;color:var(--text-phone-secondary);" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
      </div>
    </div>

    <!-- Promotional Glassmorphism Banner -->
    <div class="promo-slider">
      <div class="promo-tag">LIMITED SPECIAL</div>
      <div class="promo-title">iBox Grade A+ Second</div>
      <div class="promo-desc">Ready 100% full original units under premium quality checks.</div>
    </div>

    <!-- Product Grid Lists -->
    <div class="section-label-row">
      <h3>Recommended Phones</h3>
      <span onclick="triggerToast('Recommended Items', 'Recommended items fetched live', '📱')">See All</span>
    </div>

    <div class="product-grid">
      ${productsHtml}
    </div>
  `;
}

function renderDetailScreen(product) {
  if (!product) return `<p>Product not found.</p>`;
  
  // Check if sold out
  const actionButtonHtml = product.status === 'sold'
    ? `<button class="purchase-btn detail-purchase-btn" style="background:#888; cursor:not-allowed;" disabled>Sold Out</button>`
    : `<button class="purchase-btn detail-purchase-btn" onclick="instantPurchase('${product.id}')">Purchase Now</button>`;

  const cartButtonsHtml = product.status === 'sold'
    ? ''
    : `
      <div class="icon-action-btn" onclick="openProductChat('${product.id}')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v-2zm4-6H6V6h12v2z"/></svg>
      </div>
      <div class="icon-action-btn" onclick="addItemToBag('${product.id}')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.21 9l-4.38-6.56c-.19-.28-.51-.42-.83-.42-.32 0-.64.14-.83.43L6.79 9H2c-.55 0-1 .45-1 1 0 .09.01.18.04.27l2.54 9.27c.23.84 1 1.46 1.88 1.46h13.08c.88 0 1.65-.62 1.88-1.46l2.54-9.27L23 10c0-.55-.45-1-1-1h-4.79zM9 9l3-4.5L15 9H9z"/></svg>
      </div>
    `;

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

    <div class="detail-price" style="color:${product.status === 'sold' ? '#888' : 'var(--text-phone-primary)'};">
      ${product.priceStr} ${product.status === 'sold' ? '<span style="font-size:12px;color:red;font-weight:700;">(SOLD OUT)</span>' : ''}
    </div>
    <div class="detail-title">${product.title}</div>

    <!-- Specifications -->
    <div class="detail-specs-grid">
      <div class="spec-chip"><em>Status</em><span>${product.type}</span></div>
      <div class="spec-chip"><em>Colour</em><span>${product.color}</span></div>
      <div class="spec-chip"><em>Storage</em><span>${product.storage}</span></div>
      <div class="spec-chip"><em>Battery Health</em><span>${product.batteryHealth}</span></div>
      <div class="spec-chip"><em>Condition</em><span>${product.condition}</span></div>
      <div class="spec-chip"><em>Warranty</em><span>${product.warranty}</span></div>
    </div>

    <div class="detail-description-section">
      <h4>Description</h4>
      <p>${product.description}</p>
    </div>

    <div class="detail-action-bar" style="margin-top:20px;">
      ${cartButtonsHtml}
      ${actionButtonHtml}
    </div>
  `;
}

function renderSearchScreen(query = '') {
  let searchResultsHtml = '';
  const searchVal = query.toLowerCase().trim();

  const matched = Object.values(state.products).filter(p => 
    p.status === 'available' && p.title.toLowerCase().includes(searchVal)
  );

  if (searchVal !== '' && matched.length > 0) {
    matched.forEach(product => {
      searchResultsHtml += `
        <div class="product-card" onclick="switchTab('detail', '${product.id}')" style="width:100%; margin-bottom:12px;">
          <div class="product-image-box" style="height:150px;">
            <img src="${product.image}" alt="${product.title}">
            <span class="product-condition-tag">${product.type}</span>
          </div>
          <div class="product-details">
            <h4 class="product-title">${product.title}</h4>
            <span class="product-meta">${product.color}</span>
            <span class="product-price">${product.priceStr}</span>
          </div>
        </div>
      `;
    });
  } else if (searchVal !== '') {
    searchResultsHtml = `
      <div class="bag-empty-state">
        <span style="font-size:48px; margin-bottom:8px;">🔍</span>
        <h3>No Listings Found</h3>
        <p>No available units matched "${query}". Please check another name!</p>
      </div>
    `;
  } else {
    searchResultsHtml = `
      <div class="recent-searches">
        <h4>Recent Searches</h4>
        <div class="recent-search-item" onclick="triggerSearchText('iPhone 16')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>iPhone 16 Pro Max</span>
        </div>
        <div class="recent-search-item" onclick="triggerSearchText('iPhone 13')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>iPhone 13</span>
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
  
  const searchVal = val.toLowerCase().trim();
  const matched = Object.values(state.products).filter(p => 
    p.status === 'available' && p.title.toLowerCase().includes(searchVal)
  );

  if (searchVal === '') {
    box.innerHTML = `
      <div class="recent-searches">
        <h4>Recent Searches</h4>
        <div class="recent-search-item" onclick="triggerSearchText('iPhone 16')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span>iPhone 16 Pro Max</span>
        </div>
      </div>
    `;
  } else if (matched.length > 0) {
    let html = '';
    matched.forEach(p => {
      html += `
        <div class="product-card" onclick="switchTab('detail', '${p.id}')" style="width:100%; margin-bottom:12px;">
          <div class="product-image-box" style="height:150px;">
            <img src="${p.image}" alt="${p.title}">
            <span class="product-condition-tag">${p.type}</span>
          </div>
          <div class="product-details">
            <h4 class="product-title">${p.title}</h4>
            <span class="product-meta">${p.color}</span>
            <span class="product-price">${p.priceStr}</span>
          </div>
        </div>
      `;
    });
    box.innerHTML = html;
  } else {
    box.innerHTML = `
      <div class="bag-empty-state">
        <span style="font-size:48px; margin-bottom:8px;">🔍</span>
        <h3>No Listings Found</h3>
        <p>No available units matched your query. Try another keyword!</p>
      </div>
    `;
  }
}

function triggerSearchText(text) {
  renderScreen('search', text);
}

function renderBagScreen() {
  syncCartSelection();
  if (state.cart.length === 0) {
    return `
      <div class="screen-header">
        <h3 class="screen-title" style="margin-left:0;text-align:left;">Bag</h3>
      </div>
      <div class="bag-empty-state">
        <span class="empty-box-icon">👜</span>
        <h3>Your Bag is Empty</h3>
        <p>Browse the catalog and add products here to check out!</p>
      </div>
    `;
  }
  
  let itemsListHtml = '';
  let cartSubtotal = 0;
  let selectedSubtotal = 0;
  const selectedIds = new Set(state.selectedCartItems);
  
  state.cart.forEach(item => {
    const itemCost = item.product.price * item.quantity;
    const isSelected = selectedIds.has(item.product.id);
    cartSubtotal += itemCost;
    if (isSelected) selectedSubtotal += itemCost;
    
    itemsListHtml += `
      <div class="bag-item-card ${isSelected ? 'selected' : ''}">
        <label class="bag-select-control" title="Pilih item ini">
          <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleCartSelection('${item.product.id}', this.checked)">
          <span></span>
        </label>
        <div class="bag-item-img">
          <img src="${item.product.image}" alt="${item.product.title}">
        </div>
        <div class="bag-item-info">
          <h4 class="bag-item-title">${item.product.title}</h4>
          <span class="bag-item-price">Rp.${itemCost.toLocaleString('id-ID')},00</span>
          
          <div class="bag-item-qty-row">
            <button class="qty-btn" onclick="updateQty('${item.product.id}', -1)">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${item.product.id}', 1)">+</button>
            <button class="buy-one-btn" onclick="purchaseSingleItem('${item.product.id}')">Beli ini</button>
          </div>
        </div>
        <button class="delete-item-btn" onclick="removeItemFromCart('${item.product.id}')">
          <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;
  });
  
  const selectedCount = state.selectedCartItems.length;
  const allSelected = selectedCount === state.cart.length;
  const formattedCartSubtotal = `Rp.${cartSubtotal.toLocaleString('id-ID')},00`;
  const formattedSelectedSubtotal = `Rp.${selectedSubtotal.toLocaleString('id-ID')},00`;
  const activeShipping = selectedCount > 0 ? 15000 : 0;
  const formattedShipping = `Rp.${activeShipping.toLocaleString('id-ID')},00`;
  const grandTotal = `Rp.${(selectedSubtotal + activeShipping).toLocaleString('id-ID')},00`;

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Bag</h3>
      <span style="font-size:12px;color:var(--accent-red);font-weight:700;cursor:pointer;" onclick="clearCart()">Delete All</span>
    </div>

    <div class="bag-selection-toolbar">
      <label class="bag-select-all">
        <input type="checkbox" ${allSelected ? 'checked' : ''} onchange="toggleSelectAllCart(this.checked)">
        <span>Pilih semua produk</span>
      </label>
      <strong>${selectedCount}/${state.cart.length} dipilih</strong>
    </div>

    <div class="bag-items-list">
      ${itemsListHtml}
    </div>

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

    <div class="checkout-summary-box">
      <div class="summary-row">
        <span>Subtotal Bag</span>
        <span>${formattedCartSubtotal}</span>
      </div>
      <div class="summary-row">
        <span>Subtotal Dipilih</span>
        <span>${formattedSelectedSubtotal}</span>
      </div>
      <div class="summary-row">
        <span>Delivery (Eddy Express)</span>
        <span>${formattedShipping}</span>
      </div>
      <div class="summary-row grand-total">
        <span>Total Purchase</span>
        <span>${grandTotal}</span>
      </div>
    </div>

    <button class="purchase-btn purchase-btn-compact" ${selectedCount === 0 ? 'disabled style="background:#999;cursor:not-allowed;"' : ''} onclick="placeOrder()">Purchase Selected</button>
  `;
}

function syncCartSelection() {
  const cartIds = state.cart.map(item => item.product.id);
  state.selectedCartItems = (state.selectedCartItems || []).filter(id => cartIds.includes(id));
}

function toggleCartSelection(prodId, checked) {
  const selected = new Set(state.selectedCartItems || []);
  if (checked) selected.add(prodId);
  else selected.delete(prodId);
  state.selectedCartItems = [...selected];
  renderScreen('bag');
}

function toggleSelectAllCart(checked) {
  state.selectedCartItems = checked ? state.cart.map(item => item.product.id) : [];
  renderScreen('bag');
}

function purchaseSingleItem(prodId) {
  state.selectedCartItems = [prodId];
  placeOrder();
}

function addItemToBag(prodId) {
  const product = state.products[prodId];
  if (product.status === 'sold') {
    triggerToast('Out of Stock', 'This product is already sold out!', '❌');
    return;
  }
  const existing = state.cart.find(item => item.product.id === prodId);
  if (existing) {
    existing.quantity = 1; // 1 product buy system, maximum is 1
    triggerToast('Limit Reached', 'Only 1 unit of this listing can be purchased.', '⚠️');
  } else {
    state.cart.push({ product, quantity: 1 });
    state.selectedCartItems = [...new Set([...(state.selectedCartItems || []), prodId])];
    logEvent(`Customer added ${product.title} to Bag.`, 'customer');
    triggerToast('Added to Bag', `${product.title} added to your shopping list!`, '👜');
  }
  updateBadges();
  renderScreen(state.currentTab);
}

function instantPurchase(prodId) {
  const product = state.products[prodId];
  if (product.status === 'sold') {
    triggerToast('Out of Stock', 'This product is already sold out!', '❌');
    return;
  }
  if (!state.cart.some(item => item.product.id === prodId)) {
    state.cart.push({ product, quantity: 1 });
  }
  state.selectedCartItems = [prodId];
  switchTab('bag');
}

function updateQty(prodId, delta) {
  const existing = state.cart.find(item => item.product.id === prodId);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity > 1) {
      existing.quantity = 1;
      triggerToast('Limit Reached', 'Only 1 unit of this listing can be purchased.', '⚠️');
    }
    if (existing.quantity <= 0) {
      state.cart = state.cart.filter(item => item.product.id !== prodId);
      state.selectedCartItems = (state.selectedCartItems || []).filter(id => id !== prodId);
    }
  }
  updateBadges();
  renderScreen('bag');
}

function removeItemFromCart(prodId) {
  state.cart = state.cart.filter(item => item.product.id !== prodId);
  state.selectedCartItems = (state.selectedCartItems || []).filter(id => id !== prodId);
  updateBadges();
  renderScreen('bag');
}

function clearCart() {
  state.cart = [];
  state.selectedCartItems = [];
  updateBadges();
  renderScreen('bag');
}

function placeOrder() {
  if (state.cart.length === 0) return;
  syncCartSelection();
  const selectedIds = new Set(state.selectedCartItems);
  const selectedItems = state.cart.filter(item => selectedIds.has(item.product.id));
  if (selectedItems.length === 0) {
    triggerToast('Pilih Produk', 'Pilih minimal 1 produk untuk dibeli.', '!');
    return;
  }
  
  // Set products to SOLD (disappears from listing)
  selectedItems.forEach(item => {
    state.products[item.product.id].status = 'sold';
  });

  state.orderStatus = 'packing';
  state.orderRating = 0;
  state.orderItems = selectedItems.map(item => ({ product: item.product, quantity: item.quantity }));
  
  // Compute Total
  const totalAmount = state.orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 15000;
  
  // Append to Orders List
  const newOrderId = 'PH-' + (1000 + Math.floor(Math.random() * 9000));
  const orderedItemsLabel = state.orderItems.map(item => `${item.product.title} (x${item.quantity})`).join(', ');
  state.ordersList.unshift({
    id: newOrderId,
    customer: 'Jonathan Richard',
    items: orderedItemsLabel,
    total: totalAmount - 15000,
    status: 'Pending',
    rating: 0,
    date: 'Today'
  });

  logEvent(`Order ${newOrderId} placed successfully! State: PACKING. Admin preparing order.`, 'customer');
  
  // Inject into Chat Logs
  state.chats.admin.push(
    { sender: 'outgoing', text: `Hi! I just purchased: ${orderedItemsLabel}. Can you please check and prepare the shipment?`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    { sender: 'incoming', text: 'Thank you for your order, Jonathan! We are currently PACKING your iPhone unit. We will assign Eddy to deliver it shortly.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  );
  
  state.cart = state.cart.filter(item => !selectedIds.has(item.product.id));
  state.selectedCartItems = state.cart.map(item => item.product.id);
  updateBadges();
  
  triggerToast('Order Confirmed', 'Your iPhone order is now being packed by the seller!', '🎉');
  switchTab('order');
}

function renderOrderScreen() {
  if (state.orderStatus === 'none') {
    return `
      <div class="screen-header">
        <h3 class="screen-title" style="margin-left:0;text-align:left;">Order</h3>
      </div>
      <div class="bag-empty-state">
        <span class="empty-box-icon">📦</span>
        <h3>No Active Orders</h3>
        <p>You have no ongoing deliveries. Visit the Home tab to place an order!</p>
      </div>
    `;
  }
  
  // Stepper UI
  const stages = ['packing', 'pickup', 'delivery', 'delivered'];
  const activeIdx = stages.indexOf(state.orderStatus);
  const progressPercent = activeIdx * 33.3;
  
  let stepperNodesHtml = '';
  stages.forEach((stage, idx) => {
    let cls = '';
    if (idx < activeIdx) cls = 'completed';
    else if (idx === activeIdx) cls = 'active';
    
    let dotContent = '📦';
    if (stage === 'pickup') dotContent = '🛵';
    if (stage === 'delivery') dotContent = '🗺️';
    if (stage === 'delivered') dotContent = '🏁';
    
    stepperNodesHtml += `
      <div class="stepper-node ${cls}">
        <div class="node-dot">${dotContent}</div>
        <span class="node-label">${stage}</span>
      </div>
    `;
  });

  let bannerTitle = 'PACKING';
  let bannerDesc = 'Seller is preparing your package. Please wait, we will update you soon!';
  
  if (state.orderStatus === 'pickup') {
    bannerTitle = 'PICKUP ASSIGNED';
    bannerDesc = 'Courier Eddy is heading to the warehouse to pick up your package.';
  } else if (state.orderStatus === 'delivery') {
    bannerTitle = 'ON THE WAY';
    bannerDesc = 'Courier Eddy is driving to your address. Track him on the map below!';
  } else if (state.orderStatus === 'delivered') {
    bannerTitle = 'DELIVERED';
    bannerDesc = 'Your package was delivered successfully! Rate your experience.';
  }

  let mapOrRatingHtml = '';
  if (state.orderStatus === 'delivery') {
    mapOrRatingHtml = `
      <div class="live-tracker-map-wrapper">
        <div id="map-canvas" class="leaflet-map-bezel"></div>
        <div class="map-overlay-card">
          <div class="map-overlay-info">
            <h6>Eddy Express Tracking</h6>
            <p>Jalan Raya Pakis-Malang Road</p>
          </div>
          <span style="font-size:12px;color:var(--accent-cyan);font-weight:700;">${Math.round(state.mapProgress)}%</span>
        </div>
      </div>
    `;
  } else if (state.orderStatus === 'delivered') {
    mapOrRatingHtml = `
      <div class="order-tracker-card rating-section">
        <h4 class="rating-title">How was your experience?</h4>
        <div class="star-rating-box" id="star-box">
          ${renderStars()}
        </div>
        <button class="submit-rating-btn" onclick="submitRating()">Submit Rating</button>
      </div>
    `;
  }

  // Active items detail
  let itemsDetailHtml = '';
  state.orderItems.forEach(item => {
    itemsDetailHtml += `
      <div class="order-tracker-card" style="display:flex;gap:12px;align-items:center;">
        <div style="background:#f2f3f6;width:50px;height:50px;border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
          <img src="${item.product.image}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="min-width:0; flex:1;">
          <h5 style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.product.title}</h5>
          <p style="font-size:10px;color:var(--text-phone-secondary);">${item.product.type}, ${item.product.color} | Qty: ${item.quantity}</p>
          <span style="font-size:11px;font-weight:800;">Rp.${(item.product.price * item.quantity).toLocaleString('id-ID')},00</span>
        </div>
      </div>
    `;
  });

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Order</h3>
    </div>

    <div class="tracking-stepper">
      <div class="stepper-progress-line" style="width: ${progressPercent}%;"></div>
      ${stepperNodesHtml}
    </div>

    <div class="tracker-status-box ${state.orderStatus}">
      <h4 class="tracker-status-title">${bannerTitle}</h4>
      <p class="tracker-status-desc">${bannerDesc}</p>
    </div>

    ${mapOrRatingHtml}

    ${itemsDetailHtml}

    <!-- Courier details -->
    ${state.orderStatus !== 'packing' ? `
      <div class="courier-info-box" style="margin-bottom:16px;">
        <div class="courier-avatar">${state.courier.avatar}</div>
        <div class="courier-details">
          <h5 class="courier-name">${state.courier.name}</h5>
          <p class="courier-meta">Motor: ${state.courier.vehicle} | ${state.courier.plate}</p>
        </div>
        <button class="icon-action-btn" style="width:34px;height:34px;border-radius:10px;" onclick="openCourierChat()">
          <svg style="width:14px;height:14px;" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </button>
      </div>
    ` : `
      <div class="order-tracker-card" style="margin-bottom:16px;">
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

function renderStars() {
  let starsHtml = '';
  for(let i=1; i<=5; i++) {
    const cls = i <= state.orderRating ? 'selected' : '';
    starsHtml += `
      <svg class="${cls}" onclick="setRatingValue(${i})" viewBox="0 0 24 24" style="width:28px;height:28px;">
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
    triggerToast('Select Stars', 'Please select a star rating first!', '⚠️');
    return;
  }
  
  logEvent(`Customer rated the delivery ${state.orderRating} stars.`, 'customer');
  triggerToast('Thank You!', 'Feedback submitted successfully!', '💖');
  
  // Update order in list
  if (state.ordersList.length > 0) {
    state.ordersList[0].rating = state.orderRating;
    state.ordersList[0].status = 'Delivered';
  }
  
  state.orderStatus = 'none';
  switchTab('home');
}

// --- PROFILE & SETTINGS ---
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
    </div>
  `;
}

function renderSettingsScreen() {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('profile')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Setting</h3>
    </div>

    <div class="menu-section-title">Account Settings</div>
    <div class="settings-option-card" onclick="openSwitchAccountModal()">
      <div class="settings-option-info">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        <span class="settings-option-label">Switch Simulator Account</span>
      </div>
      <span class="menu-item-arrow"></span>
    </div>

    <div class="menu-section-title">Delivery Address</div>
    <div class="settings-option-card" onclick="switchTab('change-address')">
      <div class="settings-option-info">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span class="settings-option-label">Edit Delivery Location</span>
      </div>
      <span class="menu-item-arrow"></span>
    </div>
  `;
}

function openSwitchAccountModal() {
  logEvent('Switch account clicked inside emulator. Instructed simulator usage.', 'customer');
  triggerToast('Switch Role', 'Use the SIMULATOR PANEL on the right side of the screen to switch accounts!', '👉');
}

function renderChangeAddressScreen() {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('settings')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Change Address</h3>
    </div>

    <div class="address-input-wrapper">
      <label>Delivery Address</label>
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
    triggerToast('Address Saved', 'Your address has been updated.', '🗺️');
    switchTab('settings');
  } else {
    triggerToast('Address Error', 'Address cannot be blank!', '❌');
  }
}

// --- CHAT LOGIC ---
function renderChatScreen() {
  const isCourier = state.activeChatPartner === 'courier';
  const partnerName = isCourier ? 'Eddy | Courier' : 'PhoneHub | Admin';
  const history = isCourier ? state.chats.courier : state.chats.admin;
  
  let messagesHtml = '';
  history.forEach(msg => {
    messagesHtml += `
      <div class="chat-message-bubble ${msg.sender}">
        ${msg.text}
        ${msg.productLink ? `
          <div class="chat-product-box ${msg.sender === 'outgoing' ? 'dark' : ''}">
            <img src="${state.products[msg.productLink].image}">
            <div class="chat-product-details">
              <h5 class="chat-product-title">${state.products[msg.productLink].title}</h5>
              <span class="chat-product-price">${state.products[msg.productLink].priceStr}</span>
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
      <h3 class="screen-title">${partnerName}</h3>
    </div>

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
        <div class="chat-input-icon" onclick="triggerToast('Attachment', 'Photos sharing disabled in mockup', '📎')">
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
  if (area) area.scrollTop = area.scrollHeight;
}

function openProductChat(prodId) {
  state.activeChatPartner = 'admin';
  const prod = state.products[prodId];
  
  state.chats.admin.push({
    sender: 'outgoing',
    text: `Halo, saya tertarik dengan unit ${prod.title} ini. Apakah barangnya masih ready?`,
    productLink: prodId,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  switchTab('chat');
  simulateTypingReply('admin', `Halo Jonathan! Ya, unit ${prod.title} ini ready. Second grade A+ super mulus iBox. Silakan langsung checkout kak sebelum keduluan!`);
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
  
  let reply = 'Tentu kak, kami akan segera memproses pertanyaannya.';
  if (text.toLowerCase().includes('iphone 16')) {
    reply = 'Stok iPhone 16 Pro Max sisa 1 unit lagi kak! Silakan checkout.';
  } else if (text.toLowerCase().includes('detail iphone 13')) {
    reply = 'iPhone 13 new unit original garansi iBox 1 tahun lengkap segel box.';
  } else if (text.toLowerCase().includes('instant')) {
    reply = 'Ya! Pengiriman bisa menggunakan Eddy Express, sampai dalam waktu 1 jam.';
  } else if (text.toLowerCase().includes('eddy') || text.toLowerCase().includes('kurir')) {
    reply = 'Halo kak, saya sedang merapikan paket motor saya.';
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
    
    if (state.currentTab !== 'chat') {
      triggerToast(`New message from ${partner.toUpperCase()}`, replyText, '💬');
    }
    
    logEvent(`${partner.toUpperCase()} replied: "${replyText}"`, partner);
    renderScreen(state.currentTab);
  }, 2000);
}

// ==========================================================================
// REAL-WORLD LEAFLET MAP LOGIC
// ==========================================================================

function initRealWorldLeafletMap(canvasId) {
  const mapElement = document.getElementById(canvasId);
  if (!mapElement) return;

  // Center coordinate around Malang City
  const defaultCenter = [-7.9600, 112.6500];
  
  try {
    // Initialize leaflet map
    state.leafletMap = L.map(canvasId, {
      zoomControl: true,
      attributionControl: false
    }).setView(defaultCenter, 12);

    // Add clean tiles (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(state.leafletMap);

    // Set Custom markers
    const warehouseIcon = L.divIcon({
      className: 'map-pulse-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    const destinationIcon = L.divIcon({
      className: 'map-dest-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const courierIcon = L.divIcon({
      className: 'map-courier-marker',
      html: '🛵',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Add markers to map
    const startCoord = ROUTE_COORDINATES[0];
    const endCoord = ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];

    L.marker(startCoord, { icon: warehouseIcon }).addTo(state.leafletMap)
      .bindPopup("PhoneHub Store Warehouse");

    L.marker(endCoord, { icon: destinationIcon }).addTo(state.leafletMap)
      .bindPopup("Jonathan's House (Jl. Mansion Valley)");

    // Draw route path line
    const routeLine = L.polyline(ROUTE_COORDINATES, {
      color: 'hsl(210, 100%, 50%)',
      weight: 5,
      opacity: 0.7,
      lineCap: 'round'
    }).addTo(state.leafletMap);

    // Fit map view bounds to the path
    state.leafletMap.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

    // Precalculate Courier Marker position along route
    const currentPt = getCoordAlongPath(state.mapProgress / 100);
    state.leafletCourierMarker = L.marker([currentPt[0], currentPt[1]], { icon: courierIcon }).addTo(state.leafletMap);

    // Trigger animation loop
    animateRouteMarker();

  } catch(e) {
    console.error("Leaflet initiation failed: ", e);
    logEvent("Leaflet Map failed to load, falling back to static map coordinates", "system");
  }
}

function getCoordAlongPath(t) {
  if (t <= 0) return ROUTE_COORDINATES[0];
  if (t >= 1) return ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];
  
  const segments = ROUTE_COORDINATES.length - 1;
  const index = Math.floor(t * segments);
  const remainder = (t * segments) - index;
  
  const p0 = ROUTE_COORDINATES[index];
  const p1 = ROUTE_COORDINATES[index + 1];
  
  return [
    p0[0] + (p1[0] - p0[0]) * remainder,
    p0[1] + (p1[1] - p0[1]) * remainder
  ];
}

function animateRouteMarker() {
  function step() {
    if (state.orderStatus !== 'delivery') return;
    
    state.mapProgress += 0.15; // Animation speed step
    
    if (state.mapProgress > 100) {
      state.mapProgress = 100;
      
      // Update courier marker to end
      const endCoord = ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];
      if (state.leafletCourierMarker) {
        state.leafletCourierMarker.setLatLng(endCoord);
      }
      
      // Auto complete delivery once finished
      courierAction('complete');
      return;
    }
    
    // Update marker location
    const pt = getCoordAlongPath(state.mapProgress / 100);
    if (state.leafletCourierMarker) {
      state.leafletCourierMarker.setLatLng(pt);
      // Pan camera slightly to follow courier
      if (state.leafletMap && state.currentTab === 'courier-ride') {
        state.leafletMap.panTo(pt);
      }
    }
    
    // Sync percentages across overlays
    document.querySelectorAll('.map-overlay-card span').forEach(el => {
      el.textContent = `${Math.round(state.mapProgress)}%`;
    });

    updateSimulatorPanel();
    
    state.mapAnimationId = requestAnimationFrame(step);
  }
  
  state.mapAnimationId = requestAnimationFrame(step);
}

// ==========================================================================
// COURIER SCREENS LOGIC (Figma Detailed Layouts)
// ==========================================================================

function renderCourierProfileScreen() {
  const toggleChecked = state.courier.status === 'active' ? 'checked' : '';
  const listItemsHtml = state.orderStatus !== 'none' && state.orderStatus !== 'delivered'
    ? `
      <div class="courier-order-card" style="border-left: 4px solid var(--accent-blue); background:#fff; padding:12px; border-radius:12px; margin-top:10px;" onclick="switchTab('courier-deliveries')">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h5 style="font-weight:700; font-size:12px;">Order ID: PH-7758</h5>
          <span style="font-size:8px; background:#e0f2fe; color:var(--accent-blue); padding:2px 6px; border-radius:10px; font-weight:700;">ACTIVE</span>
        </div>
        <p style="font-size:10px; color:var(--text-phone-secondary); margin-top:4px;">Client: Jonathan Richard</p>
        <span style="font-size:9px; color:var(--accent-blue); font-weight:700; display:block; margin-top:6px;">Detail Pengiriman ➔</span>
      </div>
    `
    : `
      <div style="background:#fff; border-radius:12px; text-align:center; padding:20px; margin-top:10px;">
        <p style="font-size:11px; color:var(--text-phone-secondary);">Tidak ada orderan aktif saat ini</p>
      </div>
    `;

  return `
    <div class="screen-header">
      <div class="welcome-text" style="margin-left:0;">
        <h4>Good Morning!</h4>
        <h2>Welcome Eddy</h2>
      </div>
      <div class="bell-icon-btn" onclick="triggerToast('Kurir Update', 'Rating kinerja meningkat!', '⭐')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </div>
    </div>

    <!-- Performance Cards -->
    <div class="courier-stats-row">
      <div class="courier-stat-box">
        <span>Performance</span>
        <h3>${state.courier.totalDeliveries} Products</h3>
      </div>
      <div class="courier-stat-box">
        <span>Rating</span>
        <h3>⭐ ${state.courier.rating}</h3>
      </div>
    </div>

    <!-- Vehicle Details -->
    <div class="courier-vehicle-card">
      <div class="courier-vehicle-header">Vehicle Details</div>
      <div class="courier-vehicle-row">
        <span>Motorcycle</span>
        <strong>${state.courier.vehicle}</strong>
      </div>
      <div class="courier-vehicle-row">
        <span>Plate Number</span>
        <strong>${state.courier.plate}</strong>
      </div>
    </div>

    <!-- Availability Toggle -->
    <div class="availability-toggle-wrapper">
      <span class="availability-label">Availability Status</span>
      <label class="toggle-switch">
        <input type="checkbox" ${toggleChecked} onchange="toggleCourierAvailability(this)">
        <span class="toggle-slider"></span>
      </label>
    </div>

    <div class="menu-section-title">Order Utama Kurir</div>
    ${listItemsHtml}
  `;
}

function toggleCourierAvailability(el) {
  state.courier.status = el.checked ? 'active' : 'inactive';
  logEvent(`Courier status toggled to: ${state.courier.status.toUpperCase()}`, 'courier');
  triggerToast('Status Updated', `Availability set to ${state.courier.status}`, '🛵');
  renderScreen('courier-profile');
}

function renderCourierDeliveriesScreen() {
  if (state.orderStatus === 'none' || state.orderStatus === 'delivered') {
    return `
      <div class="screen-header">
        <h3 class="screen-title" style="margin-left:0;text-align:left;">Deliveries</h3>
      </div>
      <div class="bag-empty-state">
        <span style="font-size:48px;">📦</span>
        <h3>No Assigned Deliveries</h3>
        <p>You have no active orders to deliver. Rest and drink some coffee!</p>
      </div>
    `;
  }

  // Active delivery layout
  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Deliveries</h3>
    </div>

    <div class="order-tracker-card" style="border-left: 4px solid var(--accent-blue);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h5 style="font-weight:700;">Order ID: PH-7758</h5>
        <span style="font-size:9px; background:#e0f2fe; color:var(--accent-blue); padding:2px 8px; border-radius:20px; font-weight:700; text-transform:uppercase;">${state.orderStatus}</span>
      </div>
      
      <p style="font-size:10px; color:var(--text-phone-secondary);"><strong>Customer:</strong> Jonathan Richard</p>
      <p style="font-size:10px; color:var(--text-phone-secondary); margin-top:2px;"><strong>Alamat:</strong> ${state.address}</p>
      
      <div style="display:flex; justify-content:center; width:100%;">
        <button class="courier-btn" style="background:var(--accent-blue); margin-top:14px;" onclick="switchTab('courier-deliveries-detail')">Lihat Detail Pengiriman</button>
      </div>
    </div>
  `;
}

function renderCourierDeliveriesDetailScreen() {
  // Checklist steps
  const steps = [
    { key: 'packing', label: '1. Packing Gudang' },
    { key: 'pickup', label: '2. Menuju Lokasi Gudang' },
    { key: 'delivery', label: '3. Sedang Di Jalan' }
  ];

  let timelineHtml = '';
  steps.forEach(s => {
    let cls = '';
    if (state.orderStatus === s.key) cls = 'active';
    else if (
      (s.key === 'packing' && state.orderStatus !== 'packing') ||
      (s.key === 'pickup' && state.orderStatus !== 'packing' && state.orderStatus !== 'pickup')
    ) {
      cls = 'completed';
    }

    timelineHtml += `
      <div class="timeline-step ${cls}">
        <div class="timeline-bullet"></div>
        <span class="timeline-label">${s.label}</span>
      </div>
    `;
  });

  let buttonAreaHtml = '';
  if (state.orderStatus === 'packing') {
    buttonAreaHtml = `<button class="courier-btn" style="background:var(--accent-blue);" onclick="courierAction('pickup')">Ambil Paket di Gudang</button>`;
  } else if (state.orderStatus === 'pickup') {
    buttonAreaHtml = `<button class="courier-btn" style="background:purple;" onclick="courierAction('deliver')">Mulai Perjalanan Kurir</button>`;
  } else if (state.orderStatus === 'delivery') {
    buttonAreaHtml = `<button class="courier-btn" style="background:var(--accent-green);" onclick="switchTab('courier-ride')">Buka Navigasi Rute Peta</button>`;
  }

  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('courier-deliveries')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Detail Pengiriman</h3>
    </div>

    <!-- Client Info -->
    <div class="profile-card" style="padding:16px; margin-bottom:16px; text-align:left; align-items:flex-start;">
      <h5 style="font-size:11px; text-transform:uppercase; color:var(--text-phone-secondary);">Profil Customer</h5>
      <h4 style="margin-top:6px; font-weight:700;">Jonathan Richard</h4>
      <p style="font-size:10px; color:var(--text-phone-secondary); line-height:1.4; margin-top:4px;">${state.address}</p>
    </div>

    <!-- Timeline Progress -->
    <div class="order-tracker-card">
      <h5 style="font-size:11px; font-weight:700;">Progress Status</h5>
      <div class="courier-timeline">
        ${timelineHtml}
      </div>
    </div>

    <div style="margin-top:auto; display:flex; justify-content:center; width:100%;">
      ${buttonAreaHtml}
    </div>
  `;
}

function renderCourierRideScreen() {
  return `
    <div class="screen-header">
      <button class="back-btn" onclick="switchTab('courier-deliveries-detail')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        <span>Back</span>
      </button>
      <h3 class="screen-title">Peta Navigasi</h3>
    </div>

    <div class="live-tracker-map-wrapper" style="flex:1; height:320px; margin-bottom:16px;">
      <div id="courier-map-canvas" class="leaflet-map-bezel"></div>
      <div class="map-overlay-card">
        <div class="map-overlay-info">
          <h6>Jarak ke Tujuan</h6>
          <p>Sisa: 2.3 Km (ETA 5 Menit)</p>
        </div>
        <span style="font-size:12px;color:var(--accent-cyan);font-weight:700;">${Math.round(state.mapProgress)}%</span>
      </div>
    </div>

    <div style="display:flex; justify-content:center; width:100%;">
      <button class="courier-btn" style="background:var(--accent-green);" onclick="courierAction('complete')">Konfirmasi Paket Sampai?</button>
    </div>
  `;
}

function renderCourierHistoryScreen() {
  // Filter state.ordersList for delivered ones
  const completed = state.ordersList.filter(o => o.status === 'Delivered');
  let historyHtml = '';
  
  if (completed.length === 0) {
    historyHtml = `
      <div class="bag-empty-state">
        <span style="font-size:40px;">⏱️</span>
        <h3>Belum Ada Riwayat</h3>
        <p>Selesaikan pengantaran pesanan untuk melihat riwayat kinerja Anda disini.</p>
      </div>
    `;
  } else {
    completed.forEach(o => {
      const starRating = o.rating > 0 ? '⭐'.repeat(o.rating) : 'Belum dinilai';
      historyHtml += `
        <div class="owner-product-card" style="margin-bottom:10px;">
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between;">
              <strong style="font-size:12px;">ID: ${o.id}</strong>
              <span class="owner-product-status approved" style="font-size:8px;">DONE</span>
            </div>
            <p style="font-size:10px; color:var(--text-phone-secondary); margin-top:2px;">Client: ${o.customer}</p>
            <p style="font-size:10px; color:var(--text-phone-secondary);">Item: ${o.items}</p>
            <span style="font-size:9px; font-weight:700; color:var(--accent-gold); display:block; margin-top:4px;">Rating: ${starRating}</span>
          </div>
        </div>
      `;
    });
  }

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Riwayat Selesai</h3>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${historyHtml}
    </div>
  `;
}

// --- COURIER CORE STATE ENGINE ACTIONS ---
function courierAction(action) {
  if (action === 'pickup') {
    state.orderStatus = 'pickup';
    logEvent('Courier Eddy picked up package from warehouses.', 'courier');
    triggerToast('Courier Pickup', 'Eddy has picked up package and is loading his scooter!', '🛵');
    
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Halo Jonathan, paket pesanan kamu sudah saya ambil di warehouse. Siap dikirimkan ya kak!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    switchTab('courier-deliveries-detail');
  } else if (action === 'deliver') {
    state.orderStatus = 'delivery';
    state.mapProgress = 0; // reset coordinates map
    logEvent('Courier Eddy started route ride delivery to customer house.', 'courier');
    triggerToast('Out for Delivery', 'Eddy is driving to your address with your phone!', '🗺️');
    
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Saya sudah di jalan ya kak menuju Jl. Mansion Valley. Pantau pergerakan saya di peta!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    switchTab('courier-ride');
  } else if (action === 'complete') {
    state.orderStatus = 'delivered';
    state.courier.totalDeliveries += 1;
    
    // Increment Revenue & log transaction in Owner ledger
    if (state.orderItems.length > 0) {
      const orderVal = state.orderItems.reduce((s, it) => s + (it.product.price * it.quantity), 0);
      state.financeSummary.revenue += orderVal;
      state.financeSummary.expense += 15000;
      state.financeSummary.balance = state.financeSummary.revenue - state.financeSummary.expense;
      
      // Log transactions
      state.transactions.unshift(
        { id: 'T-' + Date.now(), info: `Penjualan iPhone (PH-1026)`, type: 'income', amount: orderVal },
        { id: 'T-E' + Date.now(), info: `Ongkos Kurir Eddy`, type: 'expense', amount: 15000 }
      );
    }

    logEvent('Courier Eddy successfully delivered package. Awaiting Customer feedback.', 'courier');
    triggerToast('Package Delivered', 'iPhone successfully delivered! Client is filling out ratings.', '🏁');
    
    state.chats.courier.push({
      sender: 'incoming',
      text: 'Paketnya sudah diterima ya kak. Terima kasih banyak atas kepercayaannya!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    switchTab('courier-profile');
  }
}

// ==========================================================================
// ADMIN / OWNER SCREENS LOGIC (Figma Detailed Layouts)
// ==========================================================================

function renderOwnerDashboardScreen() {
  // Calculate dynamic stats
  const activeListingsCount = Object.values(state.products).filter(p => p.status === 'available').length;
  const activeUsersCount = state.customers.filter(c => c.status === 'Active').length;
  const totalOrdersCount = state.ordersList.length;
  
  // Format revenue to IDR
  const formattedRevenue = 'Rp ' + state.financeSummary.revenue.toLocaleString('id-ID');

  // Customer Management rows
  let clientRowsHtml = '';
  state.customers.forEach((c, idx) => {
    const badgeClass = c.status === 'Active' ? 'active-status' : 'inactive-status';
    clientRowsHtml += `
      <tr>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone}</td>
        <td><span class="customer-status-badge ${badgeClass}" onclick="toggleCustomerStatus(${idx})">${c.status}</span></td>
      </tr>
    `;
  });

  return `
    <div class="screen-header">
      <div class="welcome-text" style="margin-left:0;">
        <h4>Good Morning!</h4>
        <h2>Welcome Jonathan Richard</h2>
      </div>
      <div class="bell-icon-btn" onclick="triggerToast('Store Alerts', 'Total listings online: ' + ${activeListingsCount}, '📊')">
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1-1.5-1s-1.5.17-1.5 1v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
      </div>
    </div>

    <div class="owner-dashboard-container">
      <!-- Stats grids -->
      <div class="owner-stats-grid">
        <div class="owner-stat-card">
          <span class="owner-stat-label">Total Revenue</span>
          <strong class="owner-stat-value">${formattedRevenue}</strong>
        </div>
        <div class="owner-stat-card">
          <span class="owner-stat-label">Active Listings</span>
          <strong class="owner-stat-value">${activeListingsCount} Items</strong>
        </div>
        <div class="owner-stat-card">
          <span class="owner-stat-label">Active Users</span>
          <strong class="owner-stat-value">${activeUsersCount} Users</strong>
        </div>
        <div class="owner-stat-card">
          <span class="owner-stat-label">Total Orders</span>
          <strong class="owner-stat-value">${totalOrdersCount} Sales</strong>
        </div>
      </div>

      <!-- Sales Chart SVG visual curves -->
      <div class="owner-chart-container">
        <div class="chart-header">
          <span class="chart-title">Sales Chart 22-26</span>
          <span class="chart-period">Monthly</span>
        </div>
        <svg class="svg-chart" viewBox="0 0 300 90">
          <defs>
            <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent-blue)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--accent-blue)" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <!-- Grid lines -->
          <line x1="0" y1="15" x2="300" y2="15" stroke="#f2f3f6" stroke-width="1"/>
          <line x1="0" y1="45" x2="300" y2="45" stroke="#f2f3f6" stroke-width="1"/>
          <line x1="0" y1="75" x2="300" y2="75" stroke="#f2f3f6" stroke-width="1"/>
          
          <!-- Curve shape paths -->
          <path d="M 0,80 Q 50,70 100,55 T 200,40 T 300,10 L 300,90 L 0,90 Z" fill="url(#chart-glow)"/>
          <path d="M 0,80 Q 50,70 100,55 T 200,40 T 300,10" fill="none" stroke="var(--accent-blue)" stroke-width="2.5" stroke-linecap="round"/>
          
          <!-- Markers -->
          <circle cx="100" cy="55" r="4" fill="var(--accent-blue)" stroke="#fff" stroke-width="1.5"/>
          <circle cx="200" cy="40" r="4" fill="var(--accent-blue)" stroke="#fff" stroke-width="1.5"/>
          <circle cx="300" cy="10" r="4" fill="var(--accent-cyan)" stroke="#fff" stroke-width="1.5"/>
        </svg>
      </div>

      <!-- Customer table -->
      <div class="menu-section-title" style="margin-bottom:4px;">Manajemen Customer</div>
      <div class="owner-table-wrapper">
        <table class="owner-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>No Telp</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${clientRowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function toggleCustomerStatus(index) {
  const current = state.customers[index].status;
  state.customers[index].status = current === 'Active' ? 'Not Active' : 'Active';
  logEvent(`Toggled status of client ${state.customers[index].name} to: ${state.customers[index].status.toUpperCase()}`, 'owner');
  renderScreen('owner-dashboard');
}

function renderOwnerFinanceScreen() {
  const incomes = state.transactions.filter(t => t.type === 'income');
  const expenses = state.transactions.filter(t => t.type === 'expense');

  let incomeRows = '';
  incomes.forEach((inc, idx) => {
    incomeRows += `
      <tr>
        <td style="width:20px;">${idx + 1}</td>
        <td>${inc.info}</td>
        <td style="text-align:right; font-weight:700; color:var(--accent-green);">+Rp ${inc.amount.toLocaleString('id-ID')}</td>
      </tr>
    `;
  });

  let expenseRows = '';
  expenses.forEach((exp, idx) => {
    expenseRows += `
      <tr>
        <td style="width:20px;">${idx + 1}</td>
        <td>${exp.info}</td>
        <td style="text-align:right; font-weight:700; color:var(--accent-red);">-Rp ${exp.amount.toLocaleString('id-ID')}</td>
      </tr>
    `;
  });

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Keuangan Toko</h3>
    </div>

    <!-- Balance display card -->
    <div class="finance-summary-box">
      <h5>Total Pendapatan Bersih</h5>
      <h2>Rp ${state.financeSummary.balance.toLocaleString('id-ID')}</h2>
      
      <div class="finance-summary-row">
        <div class="finance-sub-stat">
          <h6>Penerimaan</h6>
          <p>Rp ${state.financeSummary.revenue.toLocaleString('id-ID')}</p>
        </div>
        <div class="finance-sub-stat" style="border-left:1px solid rgba(255,255,255,0.15); padding-left:12px;">
          <h6>Pengeluaran</h6>
          <p>Rp ${state.financeSummary.expense.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>

    <!-- Income History -->
    <div class="menu-section-title" style="margin-bottom:6px;">Income Ledger</div>
    <div class="owner-table-wrapper" style="margin-bottom:16px;">
      <table class="owner-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Rincian Keterangan</th>
            <th style="text-align:right;">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          ${incomeRows || '<tr><td colspan="3" style="text-align:center;">No income logged</td></tr>'}
        </tbody>
      </table>
    </div>

    <!-- Expense History -->
    <div class="menu-section-title" style="margin-bottom:6px;">Expense Ledger</div>
    <div class="owner-table-wrapper">
      <table class="owner-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Keterangan Pengeluaran</th>
            <th style="text-align:right;">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRows || '<tr><td colspan="3" style="text-align:center;">No expenses logged</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function renderOwnerAddProductScreen() {
  const currentPresetImage = PHOTO_PRESETS[state.selectedPresetPhoto];

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Tambahkan Produk</h3>
    </div>

    <div class="add-product-form">
      <label style="font-size:10px; font-weight:700; text-transform:uppercase;">Mock Photo Preset</label>
      <div class="photo-presets-row">
        <button class="photo-preset-btn ${state.selectedPresetPhoto === 'black' ? 'active' : ''}" onclick="selectPresetPhoto('black')">Space Black</button>
        <button class="photo-preset-btn ${state.selectedPresetPhoto === 'midnight' ? 'active' : ''}" onclick="selectPresetPhoto('midnight')">Midnight Blue</button>
        <button class="photo-preset-btn ${state.selectedPresetPhoto === 'bronze' ? 'active' : ''}" onclick="selectPresetPhoto('bronze')">Desert Bronze</button>
      </div>

      <!-- Add photo card -->
      <div class="photo-upload-placeholder" onclick="triggerToast('Foto Produk', 'Mock photo selected via presets', '📷')">
        <img class="photo-preview-img" src="${currentPresetImage}">
        <div style="z-index:2; background:rgba(0,0,0,0.6); padding:6px 12px; border-radius:20px; color:#fff; font-size:9px; font-weight:700;">Selected Preset Photo</div>
      </div>

      <div class="form-group">
        <label>Judul Listing Produk</label>
        <input type="text" id="owner-add-title" class="form-input" placeholder="Contoh: iPhone 16 Pro Max Edisi Spesial">
      </div>

      <div class="form-group">
        <label>Harga Jual (Rupiah)</label>
        <input type="number" id="owner-add-price" class="form-input" placeholder="Contoh: 18500000">
      </div>

      <div class="form-group">
        <label>Kondisi Barang</label>
        <input type="text" id="owner-add-condition" class="form-input" placeholder="Contoh: Grade S Second Mulus 100%">
      </div>

      <div class="form-group" style="margin-bottom:10px;">
        <label>Deskripsi Kelengkapan</label>
        <textarea id="owner-add-desc" class="form-textarea" placeholder="Tuliskan spesifikasi detail barang..."></textarea>
      </div>

      <button class="purchase-btn" style="width:100%; height:44px; background:purple;" onclick="saveOwnerNewProduct()">Tambah Produk Baru</button>
    </div>
  `;
}

function selectPresetPhoto(presetKey) {
  state.selectedPresetPhoto = presetKey;
  renderScreen('owner-add-product');
}

function saveOwnerNewProduct() {
  const judul = document.getElementById('owner-add-title').value;
  const harga = document.getElementById('owner-add-price').value;
  const kondisi = document.getElementById('owner-add-condition').value;
  const deskripsi = document.getElementById('owner-add-desc').value;

  if (judul.trim() === '' || harga.trim() === '' || kondisi.trim() === '') {
    triggerToast('Isi Form', 'Semua field wajib diisi kecuali deskripsi!', '⚠️');
    return;
  }

  const newId = 'Iphone_' + Date.now();
  const parsedPrice = parseFloat(harga);

  state.products[newId] = {
    id: newId,
    title: judul,
    type: kondisi,
    color: state.selectedPresetPhoto === 'bronze' ? 'Desert Bronze' : state.selectedPresetPhoto === 'midnight' ? 'Midnight Blue' : 'Space Black',
    storage: '256 Gb',
    batteryHealth: '99%',
    condition: '98%',
    warranty: 'iBox Aktif',
    price: parsedPrice,
    priceStr: 'Rp.' + parsedPrice.toLocaleString('id-ID') + ',00',
    description: deskripsi || 'Spesifikasi unit original, mulus dan bergaransi.',
    image: PHOTO_PRESETS[state.selectedPresetPhoto],
    status: 'available'
  };

  logEvent(`Owner added new available product list: "${judul}" at Rp ${parsedPrice.toLocaleString('id-ID')}`, 'owner');
  triggerToast('Product Added', 'New phone listed on Marketplace!', '🎉');
  
  switchTab('owner-products');
}

function renderOwnerProductsScreen() {
  let listHtml = '';
  
  Object.values(state.products).forEach(p => {
    const labelCls = p.status === 'available' ? 'approved' : 'sold';
    const labelText = p.status === 'available' ? 'APPROVED' : 'SOLD OUT';
    
    listHtml += `
      <div class="owner-product-card">
        <div class="owner-product-img">
          <img src="${p.image}">
        </div>
        <div class="owner-product-info">
          <h4 class="owner-product-title">${p.title}</h4>
          <span class="owner-product-price">${p.priceStr}</span>
        </div>
        <span class="owner-product-status ${labelCls}">${labelText}</span>
      </div>
    `;
  });

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Daftar Produk</h3>
      <span style="font-size:11px; background:purple; color:#fff; padding:4px 8px; border-radius:10px; font-weight:700; cursor:pointer;" onclick="switchTab('owner-add-product')">+ Tambah</span>
    </div>

    <div style="display:flex; flex-direction:column;">
      ${listHtml}
    </div>
  `;
}

function renderOwnerOrdersScreen() {
  let pendingHtml = '';
  let completedHtml = '';
  
  // Dynamic order cards
  if (state.orderStatus !== 'none' && state.orderStatus !== 'delivered') {
    pendingHtml = `
      <div class="order-tracker-card" style="border-left: 4px solid var(--accent-gold); margin-top:8px;">
        <div style="display:flex; justify-content:space-between;">
          <strong style="font-size:12px;">ID: PH-7758</strong>
          <span style="font-size:8.5px; font-weight:800; color:orange;">WAITING DISPATCH</span>
        </div>
        <p style="font-size:10px; color:var(--text-phone-secondary); margin-top:4px;">Customer: Jonathan Richard</p>
        <p style="font-size:10px; color:var(--text-phone-secondary);">Item: ${state.orderItems.map(it => `${it.product.title} (x${it.quantity})`).join(', ')}</p>
        
        <div style="margin-top:10px; font-size:10px; font-weight:700;">
          Status Terkini: <span style="text-transform:uppercase; color:var(--accent-blue);">${state.orderStatus}</span>
        </div>

        ${state.orderStatus === 'packing' ? `
          <button class="purchase-btn" style="width:100%; margin-top:12px; background:purple;" onclick="ownerAction('dispatch')">Serahkan ke Kurir Eddy</button>
        ` : `
          <p style="font-size:9.5px; color:var(--text-phone-secondary); font-style:italic; margin-top:8px;">Kurir Eddy sedang mengantarkan paket...</p>
        `}
      </div>
    `;
  } else {
    pendingHtml = `
      <div style="text-align:center; padding:30px; background:#fff; border-radius:12px; margin-top:8px;">
        <p style="font-size:11px; color:var(--text-phone-secondary);">Tidak ada pesanan tertunda</p>
      </div>
    `;
  }

  // Completed history
  state.ordersList.forEach(o => {
    completedHtml += `
      <div class="owner-product-card" style="margin-bottom:8px; align-items:flex-start;">
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; width:100%;">
            <strong style="font-size:11px;">ID: ${o.id}</strong>
            <span class="owner-product-status approved" style="font-size:8px;">DELIVERED</span>
          </div>
          <p style="font-size:10px; color:var(--text-phone-secondary); margin-top:2px;">Customer: ${o.customer}</p>
          <p style="font-size:10px; color:var(--text-phone-secondary);">Items: ${o.items}</p>
          <span style="font-size:9px; font-weight:700; color:var(--accent-gold); display:block; margin-top:4px;">Rating: ${o.rating > 0 ? '⭐'.repeat(o.rating) : 'Belum dinilai'}</span>
        </div>
      </div>
    `;
  });

  return `
    <div class="screen-header">
      <h3 class="screen-title" style="margin-left:0;text-align:left;">Status Orders</h3>
    </div>

    <div class="menu-section-title">Pesanan Baru (Proses Kirim)</div>
    ${pendingHtml}

    <div class="menu-section-title" style="margin-top:20px;">Riwayat Pesanan Selesai</div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${completedHtml}
    </div>
  `;
}

function ownerAction(action) {
  if (action === 'dispatch') {
    state.orderStatus = 'pickup';
    logEvent('Owner Jonathan prepared phone package and dispatches courier Eddy.', 'owner');
    triggerToast('Order Dispatched', 'Order handed over to Courier Eddy Express!', '🛵');
    
    // Auto chat notification
    state.chats.admin.push({
      sender: 'incoming',
      text: 'Jonathan, pesanan kamu sudah kami proses dan diserahkan ke kurir kami (Eddy). Unit dijamin mulus dan packing rapi!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    renderScreen('owner-orders');
  }
}

// ==========================================================================
// SIMULATOR DASHBOARD ACTIONS (Right side Panel controller)
// ==========================================================================

function updateSimulatorPanel() {
  const detailsEl = document.getElementById('order-sim-details');
  const dPacking = document.getElementById('dot-packing');
  const dPickup = document.getElementById('dot-pickup');
  const dDelivery = document.getElementById('dot-delivery');
  const dDelivered = document.getElementById('dot-delivered');
  
  if (!detailsEl) return;
  
  [dPacking, dPickup, dDelivery, dDelivered].forEach(dot => {
    if (dot) dot.classList.remove('active');
  });
  
  if (state.orderStatus === 'none') {
    detailsEl.innerHTML = `<em>No active order placed yet. Shop in the Home tab and checkout to trigger real-time order progression!</em>`;
    return;
  }
  
  if (state.orderStatus === 'packing') {
    if (dPacking) dPacking.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: PACKING</strong><br>
      Customer Jonathan Richard has bought the phone listing. The seller is packing the phone. Switch to **Owner Dashboard** to dispatch.
    `;
  } else if (state.orderStatus === 'pickup') {
    if (dPickup) dPickup.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: PACKAGE PICKUP</strong><br>
      Courier Eddy has been assigned. Switch to **Courier Dashboard** to accept pickup or mount the scooter.
    `;
  } else if (state.orderStatus === 'delivery') {
    if (dDelivery) dDelivery.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: ON DELIVERY</strong><br>
      The courier is driving down the street. View the animated Leaflet map (Malang Town Square to Pakis: ${Math.round(state.mapProgress)}%).
    `;
  } else if (state.orderStatus === 'delivered') {
    if (dDelivered) dDelivered.classList.add('active');
    detailsEl.innerHTML = `
      <strong>Order Stage: DELIVERED (SUCCESS)</strong><br>
      Eddy hand-delivered the phone. The customer is currently leaving rating feedback under their Orders page!
    `;
  }
}

function triggerSimulatorAction(action) {
  if (action === 'add-item') {
    addItemToBag('Iphone13');
  } 
  else if (action === 'advance-order') {
    if (state.orderStatus === 'none') {
      logEvent('Cannot progress order. Buy a phone from the emulator first!', 'system');
      triggerToast('Buy Phone First', 'Add a phone to the bag and checkout to begin order tracking!', '🛍️');
      return;
    }
    progressOrderState();
  } 
  else if (action === 'receive-chat') {
    const activePartner = state.activeChatPartner;
    const txt = activePartner === 'courier' 
      ? 'Halo Jonathan, saya sudah dekat nih sama jalan masuk gerbang perumahan.' 
      : 'Halo Jonathan, kami punya unit iPhone 17 Desert Bronze baru masuk mulus 100%. Tertarik dinego?';
      
    simulateTypingReply(activePartner, txt);
  } 
  else if (action === 'price-drop') {
    state.products.Iphone16.price = 14999000;
    state.products.Iphone16.priceStr = 'Rp.14.999.000,00';
    logEvent('Owner launched promotional discount: iPhone 16 Pro Max price dropped to Rp 14.999.000!', 'owner');
    triggerToast('Special Flash Sale', 'iPhone 16 Pro Max dropped to Rp 14.999.000!', '🔥');
    
    renderScreen(state.currentTab);
  }
}

function progressOrderState() {
  if (state.orderStatus === 'packing') {
    ownerAction('dispatch');
  } else if (state.orderStatus === 'pickup') {
    courierAction('pickup');
  } else if (state.orderStatus === 'delivery') {
    courierAction('complete');
  }
  renderScreen(state.currentTab);
}
