/**
 * AromaCraft Coffee Roasters - Master Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    cart: JSON.parse(localStorage.getItem('aromao_cart') || '[]'),
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    appliedPromo: null,
    quiz: {
      currentStep: 0,
      answers: {}
    },
    customizingProduct: null,
    customizationSelection: {
      size: 'regular',
      milk: 'whole',
      sweetness: '50',
      temperature: 'hot',
      addons: []
    },
    orderType: 'delivery',
    paymentMethod: 'card'
  };

  // DOM Elements
  const DOM = {
    productsGrid: document.getElementById('productsGrid'),
    categoriesBar: document.getElementById('categoriesBar'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    cartBtn: document.getElementById('cartBtn'),
    cartBadge: document.getElementById('cartBadge'),
    cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
    cartDrawerClose: document.getElementById('cartDrawerClose'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartDiscountRow: document.getElementById('cartDiscountRow'),
    cartDiscount: document.getElementById('cartDiscount'),
    cartShipping: document.getElementById('cartShipping'),
    cartTax: document.getElementById('cartTax'),
    cartTotal: document.getElementById('cartTotal'),
    couponInput: document.getElementById('couponInput'),
    applyCouponBtn: document.getElementById('applyCouponBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    customizerBackdrop: document.getElementById('customizerBackdrop'),
    customizerClose: document.getElementById('customizerClose'),
    customizerBody: document.getElementById('customizerBody'),
    customizerPrice: document.getElementById('customizerPrice'),
    addToCartCustomBtn: document.getElementById('addToCartCustomBtn'),
    checkoutBackdrop: document.getElementById('checkoutBackdrop'),
    checkoutClose: document.getElementById('checkoutClose'),
    checkoutForm: document.getElementById('checkoutForm'),
    quizContainer: document.getElementById('quizContainer'),
    reservationForm: document.getElementById('reservationForm'),
    newsletterForm: document.getElementById('newsletterForm'),
    mobileNavToggle: document.getElementById('mobileNavToggle'),
    navMenu: document.getElementById('navMenu'),
    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    renderCategories();
    renderProducts();
    renderQuiz();
    updateCartUI();
    setupEventListeners();
  }

  // =========================================================================
  // Toast Notification System
  // =========================================================================
  function showToast(title, message, icon = '☕') {
    if (!DOM.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    DOM.toastContainer.appendChild(toast);

    // Trigger reflow for animation
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // =========================================================================
  // Categories & Filtering
  // =========================================================================
  function renderCategories() {
    if (!DOM.categoriesBar) return;
    DOM.categoriesBar.innerHTML = COFFEE_DATA.categories.map(cat => `
      <button class="category-tab ${state.activeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');
  }

  function getFilteredProducts() {
    let list = [...COFFEE_DATA.products];

    // Filter Category
    if (state.activeCategory !== 'all') {
      list = list.filter(item => item.category === state.activeCategory);
    }

    // Filter Search
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    switch (state.sortBy) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // default order
        break;
    }

    return list;
  }

  function renderProducts() {
    if (!DOM.productsGrid) return;
    const products = getFilteredProducts();

    if (products.length === 0) {
      DOM.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">No coffees found</h3>
          <p style="color: var(--text-muted);">Try a different keyword or browse our full menu categories.</p>
        </div>
      `;
      return;
    }

    DOM.productsGrid.innerHTML = products.map(prod => `
      <article class="product-card" data-product-id="${prod.id}">
        <div class="product-image-wrap">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy" />
          <div class="product-tags-row">
            <span class="badge-tag">${prod.roastLevel}</span>
            ${(prod.tags || []).slice(0, 1).map(tag => `<span class="badge-tag" style="background: rgba(200, 155, 110, 0.9); color: #1a120b;">${tag}</span>`).join('')}
          </div>
        </div>
        <div class="product-body">
          <div class="product-meta-row">
            <span>${prod.categoryName}</span>
            <div class="product-rating">
              <span>★</span>
              <span>${prod.rating.toFixed(1)}</span>
              <span style="color: var(--text-muted); font-size: 0.75rem;">(${prod.reviewsCount})</span>
            </div>
          </div>
          <h3 class="product-title">${prod.name}</h3>
          <p class="product-desc">${prod.description}</p>
          <div class="product-footer">
            <span class="product-price">$${prod.price.toFixed(2)}</span>
            <div class="card-actions">
              ${prod.isCustomizable ? `
                <button class="btn btn-secondary btn-sm customize-btn" data-id="${prod.id}">
                  ⚙️ Customize
                </button>
                <button class="btn btn-primary btn-sm quick-add-btn" data-id="${prod.id}">
                  + Add
                </button>
              ` : `
                <button class="btn btn-primary btn-sm quick-add-btn" data-id="${prod.id}">
                  + Add to Cart
                </button>
              `}
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // =========================================================================
  // Drink Customizer Logic
  // =========================================================================
  function openCustomizer(productId) {
    const product = COFFEE_DATA.products.find(p => p.id === productId);
    if (!product) return;

    state.customizingProduct = product;
    // Reset custom selections
    state.customizationSelection = {
      size: 'regular',
      milk: 'whole',
      sweetness: '50',
      temperature: 'hot',
      addons: []
    };

    renderCustomizerModal();
    DOM.customizerBackdrop.classList.add('active');
  }

  function renderCustomizerModal() {
    const p = state.customizingProduct;
    if (!p) return;

    const opts = COFFEE_DATA.customizationOptions;

    DOM.customizerBody.innerHTML = `
      <div class="customizer-product-summary">
        <img src="${p.image}" alt="${p.name}" />
        <div>
          <h3 style="font-size: 1.2rem; margin-bottom: 0.25rem;">${p.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${p.description}</p>
          <div style="font-size: 0.8rem; color: var(--accent-gold); margin-top: 0.4rem;">
            🔥 ${p.calories} &nbsp;|&nbsp; ⚡ ${p.caffeine}
          </div>
        </div>
      </div>

      <!-- Size Selector -->
      <div class="option-group">
        <div class="option-group-title">
          <span>Choose Size</span>
          <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Select 1</span>
        </div>
        <div class="pill-selector-grid">
          ${opts.sizes.map(s => `
            <div class="pill-option ${state.customizationSelection.size === s.id ? 'active' : ''}" data-group="size" data-id="${s.id}">
              <div>${s.name}</div>
              <small style="color: var(--accent-gold);">${s.extraPrice > 0 ? '+$' + s.extraPrice.toFixed(2) : 'Standard'}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Milk Selector -->
      <div class="option-group">
        <div class="option-group-title">
          <span>Choice of Milk</span>
          <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Select 1</span>
        </div>
        <div class="pill-selector-grid">
          ${opts.milks.map(m => `
            <div class="pill-option ${state.customizationSelection.milk === m.id ? 'active' : ''}" data-group="milk" data-id="${m.id}">
              <div>${m.name}</div>
              <small style="color: var(--accent-gold);">${m.extraPrice > 0 ? '+$' + m.extraPrice.toFixed(2) : 'Included'}</small>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Sweetness Level -->
      <div class="option-group">
        <div class="option-group-title">
          <span>Sweetness & Sugar</span>
        </div>
        <div class="pill-selector-grid">
          ${opts.sweetness.map(sw => `
            <div class="pill-option ${state.customizationSelection.sweetness === sw.id ? 'active' : ''}" data-group="sweetness" data-id="${sw.id}">
              ${sw.name}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Temperature Preference -->
      <div class="option-group">
        <div class="option-group-title">
          <span>Drink Temperature</span>
        </div>
        <div class="pill-selector-grid">
          ${opts.temperatures.map(t => `
            <div class="pill-option ${state.customizationSelection.temperature === t.id ? 'active' : ''}" data-group="temperature" data-id="${t.id}">
              ${t.name}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Flavor Add-ons & Boosts -->
      <div class="option-group">
        <div class="option-group-title">
          <span>Custom Add-ons & Syrups</span>
          <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">Optional</span>
        </div>
        <div class="addon-checkbox-list">
          ${opts.addons.map(add => {
            const isChecked = state.customizationSelection.addons.includes(add.id);
            return `
              <div class="addon-checkbox-item ${isChecked ? 'checked' : ''}" data-addon-id="${add.id}">
                <span>${add.name}</span>
                <span style="color: var(--accent-gold); font-weight: 600;">
                  ${add.price > 0 ? '+$' + add.price.toFixed(2) : 'Free'}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    updateCustomizerPrice();
  }

  function calculateCustomizedPrice() {
    if (!state.customizingProduct) return 0;
    let base = state.customizingProduct.price;
    const opts = COFFEE_DATA.customizationOptions;

    // Size extra
    const s = opts.sizes.find(x => x.id === state.customizationSelection.size);
    if (s) base += s.extraPrice;

    // Milk extra
    const m = opts.milks.find(x => x.id === state.customizationSelection.milk);
    if (m) base += m.extraPrice;

    // Addons extra
    state.customizationSelection.addons.forEach(aid => {
      const addon = opts.addons.find(x => x.id === aid);
      if (addon) base += addon.price;
    });

    return base;
  }

  function updateCustomizerPrice() {
    const finalPrice = calculateCustomizedPrice();
    if (DOM.customizerPrice) {
      DOM.customizerPrice.textContent = `$${finalPrice.toFixed(2)}`;
    }
  }

  // =========================================================================
  // Cart Logic & Storage
  // =========================================================================
  function saveCart() {
    localStorage.setItem('aromao_cart', JSON.stringify(state.cart));
    updateCartUI();
  }

  function addToCart(productId, isCustomized = false) {
    const product = COFFEE_DATA.products.find(p => p.id === productId);
    if (!product) return;

    if (!isCustomized) {
      // Default standard order
      const existing = state.cart.find(item => item.id === product.id && !item.isCustomized);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({
          cartId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          isCustomized: false,
          summary: 'Standard Regular'
        });
      }
      showToast('Added to Cart', `${product.name} has been added!`, '☕');
    } else {
      // Customized order
      const opts = COFFEE_DATA.customizationOptions;
      const sizeObj = opts.sizes.find(s => s.id === state.customizationSelection.size);
      const milkObj = opts.milks.find(m => m.id === state.customizationSelection.milk);
      const sweetObj = opts.sweetness.find(sw => sw.id === state.customizationSelection.sweetness);
      const tempObj = opts.temperatures.find(t => t.id === state.customizationSelection.temperature);
      const addonNames = state.customizationSelection.addons
        .map(aid => opts.addons.find(a => a.id === aid)?.name)
        .filter(Boolean);

      const summaryParts = [
        sizeObj?.name,
        milkObj?.name,
        sweetObj?.name,
        tempObj?.name,
        addonNames.length ? `+ ${addonNames.join(', ')}` : null
      ].filter(Boolean);

      const unitPrice = calculateCustomizedPrice();

      state.cart.push({
        cartId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        id: product.id,
        name: product.name,
        image: product.image,
        price: unitPrice,
        quantity: 1,
        isCustomized: true,
        summary: summaryParts.join(' • ')
      });

      DOM.customizerBackdrop.classList.remove('active');
      showToast('Custom Brew Added', `${product.name} (Customized) added to your order!`, '✨');
    }

    saveCart();
    triggerCartBadgeBump();
  }

  function triggerCartBadgeBump() {
    if (!DOM.cartBadge) return;
    DOM.cartBadge.classList.add('bump');
    setTimeout(() => DOM.cartBadge.classList.remove('bump'), 300);
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    if (DOM.cartBadge) {
      DOM.cartBadge.textContent = totalItems;
    }

    if (!DOM.cartItemsContainer) return;

    if (state.cart.length === 0) {
      DOM.cartItemsContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🛒</div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Your Cart is Empty</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
            Discover our artisan blends, cold brews, and fresh treats.
          </p>
          <button class="btn btn-primary btn-sm" id="emptyCartExploreBtn">
            Explore Menu
          </button>
        </div>
      `;
      if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = true;
    } else {
      if (DOM.checkoutBtn) DOM.checkoutBtn.disabled = false;
      DOM.cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item" data-cart-id="${item.cartId}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-customizations">${item.summary}</div>
            <div class="cart-item-bottom">
              <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
              <div class="qty-stepper">
                <button class="qty-btn" data-action="decrease" data-cart-id="${item.cartId}">−</button>
                <span class="qty-count">${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-cart-id="${item.cartId}">+</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    calculateTotals();
  }

  function calculateTotals() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    let shipping = subtotal > 0 ? (state.orderType === 'pickup' ? 0.00 : 2.99) : 0.00;

    if (state.appliedPromo && subtotal >= (state.appliedPromo.minSpend || 0)) {
      if (state.appliedPromo.discountPercent) {
        discount = (subtotal * state.appliedPromo.discountPercent) / 100;
      }
      if (state.appliedPromo.freeShipping) {
        shipping = 0;
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * 0.08; // 8% sales tax
    const total = taxableAmount + shipping + tax;

    if (DOM.cartSubtotal) DOM.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    if (DOM.cartDiscountRow && DOM.cartDiscount) {
      if (discount > 0) {
        DOM.cartDiscountRow.style.display = 'flex';
        DOM.cartDiscount.textContent = `-$${discount.toFixed(2)}`;
      } else {
        DOM.cartDiscountRow.style.display = 'none';
      }
    }

    if (DOM.cartShipping) {
      DOM.cartShipping.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    }

    if (DOM.cartTax) DOM.cartTax.textContent = `$${tax.toFixed(2)}`;
    if (DOM.cartTotal) DOM.cartTotal.textContent = `$${total.toFixed(2)}`;

    return { subtotal, discount, shipping, tax, total };
  }

  // =========================================================================
  // Interactive Coffee Quiz Matcher
  // =========================================================================
  function renderQuiz() {
    if (!DOM.quizContainer) return;
    const questions = COFFEE_DATA.quizQuestions;
    const currentQ = questions[state.quiz.currentStep];

    if (state.quiz.currentStep < questions.length) {
      const progress = ((state.quiz.currentStep + 1) / questions.length) * 100;
      DOM.quizContainer.innerHTML = `
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%;"></div>
        </div>
        <div class="quiz-step-header">
          <span style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; text-transform: uppercase;">
            Step ${state.quiz.currentStep + 1} of ${questions.length}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">Find Your Brew</span>
        </div>
        <h3 class="quiz-question-title">${currentQ.question}</h3>
        <div class="quiz-options-grid">
          ${currentQ.options.map(opt => `
            <button class="quiz-option-btn" data-value="${opt.value}">
              ${opt.label}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      // Show Match Result
      const match = calculateQuizMatch();
      DOM.quizContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
          <span class="section-tag">✨ Your Perfect Coffee Match</span>
          <h3 style="font-size: 1.75rem; margin-top: 0.5rem;">We recommend the ${match.name}!</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.3rem;">${match.matchReason}</p>
        </div>
        <div class="quiz-result-box">
          <img src="${match.image}" alt="${match.name}" class="quiz-result-img" />
          <div style="flex: 1;">
            <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">${match.roastLevel}</div>
            <h4 style="font-size: 1.3rem; margin: 0.3rem 0;">${match.name}</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${match.description}</p>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
              <span style="font-size: 1.4rem; font-weight: 700; color: var(--accent-cream);">$${match.price.toFixed(2)}</span>
              <div style="display: flex; gap: 0.6rem;">
                <button class="btn btn-secondary btn-sm" id="retakeQuizBtn">↺ Retake Quiz</button>
                <button class="btn btn-primary btn-sm" id="addQuizMatchBtn" data-id="${match.id}">+ Add Match to Order</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function calculateQuizMatch() {
    const answers = state.quiz.answers;
    let matchId = 'prod-1'; // Default: Caramel Macchiato

    if (answers[1] === 'bold' || answers[2] === 'intense') {
      matchId = answers[3] === 'black' ? 'prod-5' : 'prod-3'; // Double Espresso or Nitro Cold Brew
    } else if (answers[1] === 'cold') {
      matchId = answers[3] === 'dairy' ? 'prod-4' : 'prod-3'; // Hazelnut Praline Iced Latte or Nitro
    } else if (answers[1] === 'cozy' || answers[3] === 'plant') {
      matchId = 'prod-2'; // Vanilla Oat Flat White
    } else if (answers[2] === 'light') {
      matchId = 'prod-8'; // Ethiopian Yirgacheffe Beans
    }

    const prod = COFFEE_DATA.products.find(p => p.id === matchId) || COFFEE_DATA.products[0];
    return {
      ...prod,
      matchReason: 'Tailored precisely for your taste profile, desired energy kick, and roast preference.'
    };
  }

  // =========================================================================
  // Checkout & Order Placement Flow
  // =========================================================================
  function handleCheckoutSubmit(e) {
    e.preventDefault();

    if (state.cart.length === 0) {
      showToast('Empty Cart', 'Please add coffee items before checking out.', '⚠️');
      return;
    }

    const formData = new FormData(e.target);
    const orderData = {
      name: formData.get('custName') || 'Valued Customer',
      phone: formData.get('custPhone') || '555-0199',
      address: formData.get('custAddress') || '123 Coffee Lane',
      instructions: formData.get('custNotes') || '',
      type: state.orderType,
      payment: state.paymentMethod,
      totals: calculateTotals(),
      items: [...state.cart],
      orderId: 'AC-' + Math.floor(100000 + Math.random() * 900000),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Render Order Confirmation
    renderOrderConfirmation(orderData);

    // Clear cart
    state.cart = [];
    state.appliedPromo = null;
    saveCart();
  }

  function renderOrderConfirmation(order) {
    const modalContent = DOM.checkoutBackdrop.querySelector('.customizer-modal');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 class="brand-font" style="font-size: 1.35rem;">Order Confirmed! 🎉</h3>
        <button class="modal-close-btn" id="closeConfirmationBtn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="order-success-card">
          <div class="success-icon-badge">✓</div>
          <h2 style="font-size: 1.6rem; margin-bottom: 0.3rem;">Thank You, ${order.name}!</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            Your artisanal coffee is being freshly ground and prepared with care.
          </p>

          <!-- Order Tracker -->
          <div class="order-tracker-bar">
            <div class="tracker-step active">
              <div class="tracker-dot">✓</div>
              <span>Received</span>
            </div>
            <div class="tracker-step active">
              <div class="tracker-dot">☕</div>
              <span>Brewing</span>
            </div>
            <div class="tracker-step">
              <div class="tracker-dot">🛵</div>
              <span>${order.type === 'pickup' ? 'Ready for Pickup' : 'Out for Delivery'}</span>
            </div>
            <div class="tracker-step">
              <div class="tracker-dot">✨</div>
              <span>Enjoy</span>
            </div>
          </div>

          <!-- Digital Receipt -->
          <div class="digital-receipt">
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem;">
              <div>
                <strong style="color: var(--accent-gold);">Order ID:</strong> ${order.orderId}<br>
                <small style="color: var(--text-muted);">Placed at: ${order.time}</small>
              </div>
              <div style="text-align: right;">
                <span class="badge-tag" style="text-transform: uppercase;">${order.type}</span><br>
                <small style="color: var(--text-muted); text-transform: uppercase;">${order.payment}</small>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
              ${order.items.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                  <span>${item.quantity}x ${item.name}</span>
                  <span style="color: var(--accent-cream);">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.3rem;">
              <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                <span>Subtotal:</span>
                <span>$${order.totals.subtotal.toFixed(2)}</span>
              </div>
              ${order.totals.discount > 0 ? `
                <div style="display: flex; justify-content: space-between; color: var(--color-success);">
                  <span>Discount:</span>
                  <span>-$${order.totals.discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
                <span>Tax:</span>
                <span>$${order.totals.tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; color: var(--accent-gold); margin-top: 0.3rem; padding-top: 0.4rem; border-top: 1px solid rgba(255,255,255,0.06);">
                <span>Grand Total:</span>
                <span>$${order.totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.print()">🖨️ Print Receipt</button>
            <button class="btn btn-primary btn-sm" id="doneOrderBtn">Continue Browsing</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('closeConfirmationBtn')?.addEventListener('click', () => {
      DOM.checkoutBackdrop.classList.remove('active');
    });
    document.getElementById('doneOrderBtn')?.addEventListener('click', () => {
      DOM.checkoutBackdrop.classList.remove('active');
    });

    showToast('Order Placed Successfully!', `Order ${order.orderId} is being prepared.`, '🎉');
  }

  // =========================================================================
  // Event Listeners Setup
  // =========================================================================
  function setupEventListeners() {
    // Mobile Nav Toggle
    DOM.mobileNavToggle?.addEventListener('click', () => {
      DOM.navMenu?.classList.toggle('open');
    });

    // Close Mobile Nav on click link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        DOM.navMenu?.classList.remove('open');
      });
    });

    // Category Tabs Filter
    DOM.categoriesBar?.addEventListener('click', e => {
      const btn = e.target.closest('.category-tab');
      if (!btn) return;
      state.activeCategory = btn.dataset.category;
      renderCategories();
      renderProducts();
    });

    // Search Input
    DOM.searchInput?.addEventListener('input', e => {
      state.searchQuery = e.target.value;
      renderProducts();
    });

    // Sort Dropdown
    DOM.sortSelect?.addEventListener('change', e => {
      state.sortBy = e.target.value;
      renderProducts();
    });

    // Product Card Buttons (Add / Customize)
    DOM.productsGrid?.addEventListener('click', e => {
      const quickAddBtn = e.target.closest('.quick-add-btn');
      if (quickAddBtn) {
        const prodId = quickAddBtn.dataset.id;
        addToCart(prodId, false);
        return;
      }

      const customizeBtn = e.target.closest('.customize-btn');
      if (customizeBtn) {
        const prodId = customizeBtn.dataset.id;
        openCustomizer(prodId);
        return;
      }
    });

    // Customizer Modal Pill Choices & Add-ons
    DOM.customizerBody?.addEventListener('click', e => {
      const pill = e.target.closest('.pill-option');
      if (pill) {
        const group = pill.dataset.group;
        const val = pill.dataset.id;
        state.customizationSelection[group] = val;
        renderCustomizerModal();
        return;
      }

      const addonItem = e.target.closest('.addon-checkbox-item');
      if (addonItem) {
        const addonId = addonItem.dataset.addonId;
        const idx = state.customizationSelection.addons.indexOf(addonId);
        if (idx > -1) {
          state.customizationSelection.addons.splice(idx, 1);
        } else {
          state.customizationSelection.addons.push(addonId);
        }
        renderCustomizerModal();
        return;
      }
    });

    DOM.addToCartCustomBtn?.addEventListener('click', () => {
      if (state.customizingProduct) {
        addToCart(state.customizingProduct.id, true);
      }
    });

    DOM.customizerClose?.addEventListener('click', () => {
      DOM.customizerBackdrop.classList.remove('active');
    });

    DOM.customizerBackdrop?.addEventListener('click', e => {
      if (e.target === DOM.customizerBackdrop) {
        DOM.customizerBackdrop.classList.remove('active');
      }
    });

    // Cart Drawer Toggle
    DOM.cartBtn?.addEventListener('click', () => {
      DOM.cartDrawerBackdrop.classList.add('active');
    });

    DOM.cartDrawerClose?.addEventListener('click', () => {
      DOM.cartDrawerBackdrop.classList.remove('active');
    });

    DOM.cartDrawerBackdrop?.addEventListener('click', e => {
      if (e.target === DOM.cartDrawerBackdrop) {
        DOM.cartDrawerBackdrop.classList.remove('active');
      }
    });

    // Cart Items Stepper (+ / -)
    DOM.cartItemsContainer?.addEventListener('click', e => {
      const btn = e.target.closest('.qty-btn');
      if (!btn) {
        const exploreBtn = e.target.closest('#emptyCartExploreBtn');
        if (exploreBtn) {
          DOM.cartDrawerBackdrop.classList.remove('active');
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const cartId = btn.dataset.cartId;
      const action = btn.dataset.action;
      const itemIndex = state.cart.findIndex(i => i.cartId === cartId);

      if (itemIndex > -1) {
        if (action === 'increase') {
          state.cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
          state.cart[itemIndex].quantity -= 1;
          if (state.cart[itemIndex].quantity <= 0) {
            state.cart.splice(itemIndex, 1);
            showToast('Item Removed', 'Coffee item removed from cart.', '🗑️');
          }
        }
        saveCart();
      }
    });

    // Apply Coupon Code
    DOM.applyCouponBtn?.addEventListener('click', () => {
      const code = DOM.couponInput?.value.trim().toUpperCase();
      if (!code) return;

      if (COFFEE_DATA.promoCodes[code]) {
        const promo = COFFEE_DATA.promoCodes[code];
        const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (subtotal < (promo.minSpend || 0)) {
          showToast('Coupon Notice', `Code requires minimum order of $${promo.minSpend}`, '⚠️');
          return;
        }

        state.appliedPromo = promo;
        calculateTotals();
        showToast('Promo Applied!', promo.description, '🎟️');
      } else {
        showToast('Invalid Code', 'Please check promo code and try again.', '❌');
      }
    });

    // Checkout Modal Trigger
    DOM.checkoutBtn?.addEventListener('click', () => {
      DOM.cartDrawerBackdrop.classList.remove('active');
      resetCheckoutModal();
      DOM.checkoutBackdrop.classList.add('active');
    });

    DOM.checkoutClose?.addEventListener('click', () => {
      DOM.checkoutBackdrop.classList.remove('active');
    });

    DOM.checkoutBackdrop?.addEventListener('click', e => {
      if (e.target === DOM.checkoutBackdrop) {
        DOM.checkoutBackdrop.classList.remove('active');
      }
    });

    DOM.checkoutForm?.addEventListener('submit', handleCheckoutSubmit);

    // Quiz Options Click
    DOM.quizContainer?.addEventListener('click', e => {
      const optBtn = e.target.closest('.quiz-option-btn');
      if (optBtn) {
        const val = optBtn.dataset.value;
        state.quiz.answers[state.quiz.currentStep + 1] = val;
        state.quiz.currentStep += 1;
        renderQuiz();
        return;
      }

      const retakeBtn = e.target.closest('#retakeQuizBtn');
      if (retakeBtn) {
        state.quiz.currentStep = 0;
        state.quiz.answers = {};
        renderQuiz();
        return;
      }

      const addMatchBtn = e.target.closest('#addQuizMatchBtn');
      if (addMatchBtn) {
        const prodId = addMatchBtn.dataset.id;
        addToCart(prodId, false);
      }
    });

    // Table Reservation Form
    DOM.reservationForm?.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('resName')?.value;
      const guests = document.getElementById('resGuests')?.value;
      const date = document.getElementById('resDate')?.value;
      const time = document.getElementById('resTime')?.value;

      showToast('Table Reserved! ☕', `Confirmed for ${name} (${guests} guests) on ${date} at ${time}.`, '📅');
      e.target.reset();
    });

    // Newsletter Form
    DOM.newsletterForm?.addEventListener('submit', e => {
      e.preventDefault();
      const email = e.target.querySelector('input[type="email"]')?.value;
      showToast('Subscribed!', `Welcome to the AromaCraft club (${email}). Check your inbox for a 15% welcome voucher!`, '💌');
      e.target.reset();
    });

    // Copy Promo Code in Announcement Bar
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code || 'COFFEE10';
        navigator.clipboard?.writeText(code);
        showToast('Code Copied!', `Use '${code}' at checkout for 10% OFF.`, '📋');
      });
    });
  }

  function resetCheckoutModal() {
    const modalContent = DOM.checkoutBackdrop.querySelector('.customizer-modal');
    if (!modalContent) return;

    // Reset standard checkout form structure
    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 class="brand-font" style="font-size: 1.35rem;">Complete Your Coffee Order</h3>
        <button class="modal-close-btn" id="checkoutCloseBtn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="checkout-tabs">
          <button type="button" class="checkout-tab-btn ${state.orderType === 'delivery' ? 'active' : ''}" data-type="delivery">
            🛵 Doorstep Delivery
          </button>
          <button type="button" class="checkout-tab-btn ${state.orderType === 'pickup' ? 'active' : ''}" data-type="pickup">
            🏬 In-Store Cafe Pickup
          </button>
        </div>

        <form id="checkoutForm">
          <div class="form-grid">
            <div class="form-group">
              <label>Your Full Name *</label>
              <input type="text" name="custName" class="form-control" placeholder="e.g. Alex Rivera" required />
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="tel" name="custPhone" class="form-control" placeholder="e.g. (555) 234-5678" required />
            </div>
            <div class="form-group full-width" id="addressFieldGroup">
              <label>${state.orderType === 'delivery' ? 'Delivery Address *' : 'Pickup Location'}</label>
              <input type="text" name="custAddress" class="form-control" value="${state.orderType === 'pickup' ? 'AromaCraft Downtown Flagship (742 Evergreen Blvd)' : ''}" placeholder="${state.orderType === 'delivery' ? 'Street, Apartment / Suite, Zip Code' : 'Downtown Flagship'}" required />
            </div>
            <div class="form-group full-width">
              <label>Special Brewing / Barista Instructions</label>
              <input type="text" name="custNotes" class="form-control" placeholder="e.g. Extra hot please, ring doorbell" />
            </div>
          </div>

          <h4 style="font-size: 0.95rem; margin-bottom: 0.75rem; color: var(--accent-latte);">Select Payment Method</h4>
          <div class="payment-methods-grid">
            <div class="payment-card-option ${state.paymentMethod === 'card' ? 'active' : ''}" data-pay="card">
              💳 Credit / Debit Card
            </div>
            <div class="payment-card-option ${state.paymentMethod === 'apple_pay' ? 'active' : ''}" data-pay="apple_pay">
              📱 Apple / Google Pay
            </div>
            <div class="payment-card-option ${state.paymentMethod === 'cod' ? 'active' : ''}" data-pay="cod">
              💵 Cash on Delivery
            </div>
          </div>

          <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.3rem;">
              <span style="color: var(--text-muted);">Order Total to Pay:</span>
              <strong style="color: var(--accent-gold); font-size: 1.1rem;">${DOM.cartTotal ? DOM.cartTotal.textContent : '$0.00'}</strong>
            </div>
            <small style="color: var(--text-muted); font-size: 0.78rem;">🔒 256-bit Encrypted Simulated Transaction</small>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem;">
            Confirm & Place Coffee Order
          </button>
        </form>
      </div>
    `;

    // Reattach listeners
    document.getElementById('checkoutCloseBtn')?.addEventListener('click', () => {
      DOM.checkoutBackdrop.classList.remove('active');
    });

    document.querySelectorAll('.checkout-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.orderType = btn.dataset.type;
        resetCheckoutModal();
        calculateTotals();
      });
    });

    document.querySelectorAll('.payment-card-option').forEach(card => {
      card.addEventListener('click', () => {
        state.paymentMethod = card.dataset.pay;
        resetCheckoutModal();
      });
    });

    document.getElementById('checkoutForm')?.addEventListener('submit', handleCheckoutSubmit);
  }

  // Launch App
  init();
});
