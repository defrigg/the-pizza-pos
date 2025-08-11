document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    const menuData = [
        { id: 1, name: 'พิซซ่าฮาวาเอี้ยน', description: 'แป้งพิซซ่านุ่มๆ พร้อมกับปูอัดแฮมและสัปรดเสริฟคู่กับชีสเยิ้มๆ' },
        { id: 2, name: 'ผักโขมแฮมชีส', description: 'แป้งพิซซ่านุ่มๆ ผักโขมคัดอย่างดีพร้อมแฮมหอมๆ ชีสยืดๆ' },
        { id: 3, name: 'เบค่อนชีส', description: 'แป้งพิซซ่านุ่มๆ เอาใจสายเบค่อนหอมๆพร้อมชีสยืดๆ' },
        { id: 4, name: 'ไส้กรอกชีส', description: 'แป้งพิซซ่านุ่มๆ พร้อมกับไส้กรอก พร้อมชีสยืดๆ' },
        { id: 5, name: 'แฮมชีส', description: 'แป้งพิซซ่านุ่มๆ แฮมคู่กับชีสเยิ้มๆ' },
        { id: 6, name: 'ข้าวโพดชีส', description: 'แป้งพิซซ่านุ่มๆ ข้าวโพดคัดอย่างดีพร้อมกับชีสยืดๆ' },
        { id: 7, name: 'ซีฟู้ด', description: 'แป้งพิซซ่านุ่มๆ ยกทะเลมาทั้งหมดไม่ว่าจะเป็นกุ้ง หอย หมึก พร้อมชีสเยิ้มๆ' },
    ];
    const prices = { slice: 25, tray: 189 };
    let currentOrder = [];
    let currentTotal = 0;

    // --- DOM Elements ---
    // Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    
    // POS View
    const menuGrid = document.querySelector('.menu-grid');
    const orderItemsList = document.getElementById('order-items');
    const totalPriceEl = document.getElementById('total-price');
    const clearOrderBtn = document.getElementById('clear-order-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Kitchen View
    const kitchenOrderList = document.getElementById('kitchen-order-list');

    // Report View
    const datePicker = document.getElementById('date-picker');
    const monthPicker = document.getElementById('month-picker');
    const showAllBtn = document.getElementById('show-all-btn');
    const summaryRevenueEl = document.getElementById('summary-revenue');
    const summaryOrdersEl = document.getElementById('summary-orders');
    const summaryBestsellerEl = document.getElementById('summary-bestseller');
    const salesLogBody = document.getElementById('sales-log-body');

    // Shared Modal
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTotalPriceEl = document.getElementById('modal-total-price');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    // =======================================================
    // --- NAVIGATION LOGIC ---
    // =======================================================
    function handleNavClick(event) {
        const targetView = event.target.dataset.view;

        // Update button active state
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === targetView);
        });

        // Update view visibility
        views.forEach(view => {
            view.classList.toggle('active', view.id === targetView);
        });

        // Refresh data for the activated view
        if (targetView === 'kitchen-view') {
            renderKitchenOrders();
        } else if (targetView === 'report-view') {
            const today = new Date().toISOString().slice(0, 10);
            datePicker.value = today;
            monthPicker.value = '';
            generateReport('day', today);
        }
    }


    // =======================================================
    // --- POS FUNCTIONS ---
    // =======================================================
    function renderMenu() {
        menuGrid.innerHTML = '';
        menuData.forEach(item => {
            const menuItemHTML = `
                <div class="menu-item">
                    <img src="https://placehold.co/400x300/e74c3c/ffffff?text=${item.name.replace('พิซซ่า','')}" alt="${item.name}">
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="price-buttons">
                            <button class="add-btn" data-name="${item.name}" data-type="slice" data-price="${prices.slice}">
                                ชิ้น ฿${prices.slice}
                            </button>
                            <button class="add-btn" data-name="${item.name}" data-type="tray" data-price="${prices.tray}">
                                ถาด ฿${prices.tray}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            menuGrid.innerHTML += menuItemHTML;
        });
    }

    function updateOrder() {
        orderItemsList.innerHTML = '';
        if (currentOrder.length === 0) {
            orderItemsList.innerHTML = '<li class="placeholder">ยังไม่มีรายการ...</li>';
        } else {
            currentOrder.forEach(item => {
                const li = document.createElement('li');
                const typeText = item.type === 'slice' ? ' (ชิ้น)' : ' (ถาด)';
                li.innerHTML = `<span>${item.name}${typeText}</span><span>฿${item.price.toLocaleString()}</span>`;
                orderItemsList.appendChild(li);
            });
        }
        calculateTotal();
    }

    function calculateTotal() {
        currentTotal = currentOrder.reduce((sum, item) => sum + item.price, 0);
        totalPriceEl.textContent = `฿${currentTotal.toLocaleString()}`;
        checkoutBtn.disabled = currentTotal === 0;
    }

    function handleAddItem(event) {
        const button = event.target.closest('.add-btn');
        if (button) {
            const { name, type, price } = button.dataset;
            currentOrder.push({ name, type, price: parseInt(price) });
            updateOrder();
        }
    }

    function handleClearOrder() {
        currentOrder = [];
        updateOrder();
    }

    function showPaymentModal() {
        modalTotalPriceEl.innerHTML = `฿${currentTotal.toLocaleString()}`;
        paymentModal.style.display = 'flex';
    }

    function closePaymentModal() {
        paymentModal.style.display = 'none';
    }

    function handleConfirmPayment() {
        // 1. Send to kitchen queue
        const newOrder = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit'}),
            items: [...currentOrder], // Create a copy
        };
        const kitchenQueue = JSON.parse(localStorage.getItem('pizzaKitchenQueue')) || [];
        kitchenQueue.push(newOrder);
        localStorage.setItem('pizzaKitchenQueue', JSON.stringify(kitchenQueue));

        // 2. Save to permanent sales history
        const history = JSON.parse(localStorage.getItem('pizzaSalesHistory')) || [];
        const newRecord = {
            id: newOrder.id,
            date: new Date().toISOString().slice(0, 10),
            items: [...currentOrder],
            total: currentTotal
        };
        history.push(newRecord);
        localStorage.setItem('pizzaSalesHistory', JSON.stringify(history));
        
        // 3. Finalize
        alert(`บันทึกยอดขายจำนวน ฿${currentTotal.toLocaleString()} เรียบร้อยแล้ว`);
        closePaymentModal();
        handleClearOrder();
    }


    // =======================================================
    // --- KITCHEN FUNCTIONS ---
    // =======================================================
    function renderKitchenOrders() {
        kitchenOrderList.innerHTML = '';
        const kitchenQueue = JSON.parse(localStorage.getItem('pizzaKitchenQueue')) || [];

        if (kitchenQueue.length === 0) {
            kitchenOrderList.innerHTML = '<p class="placeholder">ยังไม่มีออเดอร์</p>';
            return;
        }

        kitchenQueue.forEach(order => {
            const itemsHTML = order.items.map(item => {
                const typeText = item.type === 'slice' ? ' (ชิ้น)' : ' (ถาด)';
                return `<li>- ${item.name}${typeText}</li>`;
            }).join('');

            const orderCardHTML = `
                <div class="kitchen-order-card">
                    <div class="order-header">
                        <h3>ออเดอร์ #${order.id.toString().slice(-4)}</h3>
                        <span>เวลา: ${order.timestamp}</span>
                    </div>
                    <ul class="order-items-list">
                        ${itemsHTML}
                    </ul>
                    <button class="complete-order-btn" data-order-id="${order.id}">✅ เสร็จสิ้น</button>
                </div>
            `;
            kitchenOrderList.innerHTML += orderCardHTML;
        });
    }

    function handleCompleteOrder(event) {
        const button = event.target.closest('.complete-order-btn');
        if (!button) return;

        const orderIdToComplete = parseInt(button.dataset.orderId);
        let kitchenQueue = JSON.parse(localStorage.getItem('pizzaKitchenQueue')) || [];
        kitchenQueue = kitchenQueue.filter(order => order.id !== orderIdToComplete);
        localStorage.setItem('pizzaKitchenQueue', JSON.stringify(kitchenQueue));
        renderKitchenOrders();
    }

    // =======================================================
    // --- REPORT FUNCTIONS ---
    // =======================================================
    function generateReport(filterType, filterValue) {
        const salesHistory = JSON.parse(localStorage.getItem('pizzaSalesHistory')) || [];
        let filteredOrders = [];

        if (filterType === 'all') {
            filteredOrders = salesHistory;
        } else if (filterType === 'day' && filterValue) {
            filteredOrders = salesHistory.filter(order => order.date === filterValue);
        } else if (filterType === 'month' && filterValue) {
            filteredOrders = salesHistory.filter(order => order.date.startsWith(filterValue));
        }

        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        
        const itemCounts = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const itemName = `${item.name} (${item.type === 'slice' ? 'ชิ้น' : 'ถาด'})`;
                itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
            });
        });

        let bestseller = '-';
        let maxCount = 0;
        for (const item in itemCounts) {
            if (itemCounts[item] > maxCount) {
                bestseller = item;
                maxCount = itemCounts[item];
            }
        }
        if (maxCount > 0) {
            bestseller += ` (${maxCount} รายการ)`;
        }

        summaryRevenueEl.textContent = `฿${totalRevenue.toLocaleString()}`;
        summaryOrdersEl.textContent = totalOrders.toLocaleString();
        summaryBestsellerEl.textContent = bestseller;

        salesLogBody.innerHTML = '';
        if (filteredOrders.length === 0) {
            salesLogBody.innerHTML = '<tr><td colspan="4">ไม่พบข้อมูลการขายในช่วงเวลานี้</td></tr>';
            return;
        }

        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(order.id).toLocaleString('th-TH')}</td>
                    <td>${item.name}</td>
                    <td>${item.type === 'slice' ? 'ชิ้น' : 'ถาด'}</td>
                    <td>฿${item.price.toLocaleString()}</td>
                `;
                salesLogBody.appendChild(row);
            });
        });
    }

    // =======================================================
    // --- EVENT LISTENERS & INITIALIZATION ---
    // =======================================================
    // Navigation
    navButtons.forEach(btn => btn.addEventListener('click', handleNavClick));

    // POS
    menuGrid.addEventListener('click', handleAddItem);
    clearOrderBtn.addEventListener('click', handleClearOrder);
    checkoutBtn.addEventListener('click', showPaymentModal);
    closeModalBtn.addEventListener('click', closePaymentModal);
    confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    window.addEventListener('click', (event) => {
        if (event.target == paymentModal) closePaymentModal();
    });

    // Kitchen
    kitchenOrderList.addEventListener('click', handleCompleteOrder);

    // Reports
    datePicker.addEventListener('change', () => {
        monthPicker.value = '';
        generateReport('day', datePicker.value);
    });
    monthPicker.addEventListener('change', () => {
        datePicker.value = '';
        generateReport('month', monthPicker.value);
    });
    showAllBtn.addEventListener('click', () => {
        datePicker.value = '';
        monthPicker.value = '';
        generateReport('all');
    });

    // --- Initial Load ---
    renderMenu();
});
/* ... โค้ดส่วนบนเหมือนเดิม ... */

    // Shared Modal
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTotalPriceEl = document.getElementById('modal-total-price');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn'); // NEW: Select the cancel button

/* ... โค้ดฟังก์ชันเหมือนเดิม ... */

    // =======================================================
    // --- EVENT LISTENERS & INITIALIZATION ---
    // =======================================================
    // Navigation
    navButtons.forEach(btn => btn.addEventListener('click', handleNavClick));

    // POS
    menuGrid.addEventListener('click', handleAddItem);
    clearOrderBtn.addEventListener('click', handleClearOrder);
    checkoutBtn.addEventListener('click', showPaymentModal);
    
    // Modal Buttons
    closeModalBtn.addEventListener('click', closePaymentModal);
    confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    cancelPaymentBtn.addEventListener('click', closePaymentModal); // NEW: Add event listener for cancel button

    window.addEventListener('click', (event) => {
        if (event.target == paymentModal) closePaymentModal();
    });

/* ... โค้ดส่วนที่เหลือเหมือนเดิม ... */
