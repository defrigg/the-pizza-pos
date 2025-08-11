document.addEventListener('DOMContentLoaded', () => {

    const menuData = [
        { id: 1, name: 'พิซซ่าฮาวาเอี้ยน', description: 'แป้งพิซซ่านุ่มๆ พร้อมกับปูอัดแฮมและสัปรดเสริฟคู่กับชีสเยิ้มๆ' },
        { id: 2, name: 'ผักโขมแฮมชีส', description: 'แป้งพิซซ่านุ่มๆ ผักโขมคัดอย่างดีพร้อมแฮมหอมๆ ชีสยืดๆ' },
        { id: 3, name: 'เบค่อนชีส', description: 'แป้งพิซซ่านุ่มๆ เอาใจสายเบค่อนหอมๆพร้อมชีสยืดๆ' },
        { id: 4, name: 'ไส้กรอกชีส', description: 'แป้งพิซซ่านุ่มๆ พร้อมกับไส้กรอก พร้อมชีสยืดๆ' },
        { id: 5, name: 'แฮมชีส', description: 'แป้งพิซซ่านุ่มๆ แฮมคู่กับชีสเยิ้มๆ' },
        { id: 6, name: 'ข้าวโพดชีส', description: 'แป้งพิซซ่านุ่มๆ ข้าวโพดคัดอย่างดีพร้อมกับชีสยืดๆ' },
        { id: 7, name: 'ซีฟู้ด', description: 'แป้งพิซซ่านุ่มๆ ยกทะเลมาทั้งหมดไม่ว่าจะเป็นกุ้ง หอย หมึก พร้อมชีสเยิ้มๆ' },
    ];

    const prices = {
        slice: 25,
        tray: 189,
    };

    // --- DOM Elements ---
    const menuGrid = document.querySelector('.menu-grid');
    const orderItemsList = document.getElementById('order-items');
    const totalPriceEl = document.getElementById('total-price');
    const clearOrderBtn = document.getElementById('clear-order-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTotalPriceEl = document.getElementById('modal-total-price');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    const dailySalesEl = document.getElementById('daily-sales');
    const showSalesBtn = document.getElementById('show-sales-btn');

    let currentOrder = [];
    let currentTotal = 0;

    // --- Menu and Order Functions ---
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

    // --- Payment Functions ---
    function showPaymentModal() {
        modalTotalPriceEl.innerHTML = `฿${currentTotal.toLocaleString()}`;
        paymentModal.style.display = 'flex';
    }

    function closePaymentModal() {
        paymentModal.style.display = 'none';
    }

    function handleConfirmPayment() {
        sendOrderToKitchen();
        recordSale(currentTotal);
        alert(`บันทึกยอดขายจำนวน ฿${currentTotal.toLocaleString()} เรียบร้อยแล้ว`);
        closePaymentModal();
        handleClearOrder();
        displayDailySales();
    }

    function sendOrderToKitchen() {
        if (currentOrder.length === 0) return;
        const kitchenQueue = JSON.parse(localStorage.getItem('pizzaKitchenQueue')) || [];
        const newOrder = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit'}),
            items: currentOrder,
        };
        kitchenQueue.push(newOrder);
        localStorage.setItem('pizzaKitchenQueue', JSON.stringify(kitchenQueue));
    }

    // --- Sales Recording ---
    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function recordSale(amount) {
        const today = getTodayString();
        let salesData = JSON.parse(localStorage.getItem('pizzaShopSales')) || {};
        salesData[today] = (salesData[today] || 0) + amount;
        localStorage.setItem('pizzaShopSales', JSON.stringify(salesData));
    }

    function displayDailySales() {
        const today = getTodayString();
        let salesData = JSON.parse(localStorage.getItem('pizzaShopSales')) || {};
        const todaySales = salesData[today] || 0;
        dailySalesEl.textContent = `฿${todaySales.toLocaleString()}`;
    }

    // --- Event Listeners ---
    menuGrid.addEventListener('click', handleAddItem);
    clearOrderBtn.addEventListener('click', handleClearOrder);
    checkoutBtn.addEventListener('click', showPaymentModal);
    closeModalBtn.addEventListener('click', closePaymentModal);
    confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    showSalesBtn.addEventListener('click', displayDailySales);
    
    window.addEventListener('click', (event) => {
        if (event.target == paymentModal) {
            closePaymentModal();
        }
    });

    // --- Initial Load ---
    renderMenu();
    displayDailySales();
});
