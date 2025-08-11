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
    
    // New elements for payment modal
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalTotalPriceEl = document.getElementById('modal-total-price');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    // New elements for sales report
    const dailySalesEl = document.getElementById('daily-sales');
    const showSalesBtn = document.getElementById('show-sales-btn');

    let currentOrder = [];
    let currentTotal = 0;

    // --- Functions for Menu and Order ---

    function renderMenu() {
        menuGrid.innerHTML = '';
        menuData.forEach(item => {
            const menuItemHTML = `
                <div class="menu-item">
                    <img src="https://placehold.co/400x300/d92027/ffffff?text=${item.name.replace('พิซซ่า','')}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="price-buttons">
                        <button class="add-btn" data-name="${item.name}" data-type="slice" data-price="${prices.slice}">
                            1 ชิ้น (฿${prices.slice})
                        </button>
                        <button class="add-btn" data-name="${item.name}" data-type="tray" data-price="${prices.tray}">
                            1 ถาด (฿${prices.tray})
                        </button>
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
                li.innerHTML = `<span>${item.name}${typeText}</span><span>฿${item.price}</span>`;
                orderItemsList.appendChild(li);
            });
        }
        calculateTotal();
    }

    function calculateTotal() {
        currentTotal = currentOrder.reduce((sum, item) => sum + item.price, 0);
        totalPriceEl.textContent = `฿${currentTotal}`;
        // Enable/disable checkout button based on total
        checkoutBtn.disabled = currentTotal === 0;
    }

    function handleAddItem(event) {
        if (event.target.classList.contains('add-btn')) {
            const name = event.target.dataset.name;
            const type = event.target.dataset.type;
            const price = parseInt(event.target.dataset.price);

            currentOrder.push({ name, type, price });
            updateOrder();
        }
    }

    function handleClearOrder() {
        currentOrder = [];
        updateOrder();
    }

    // --- NEW Functions for Payment ---
    
    function showPaymentModal() {
        modalTotalPriceEl.textContent = `฿${currentTotal}`;
        paymentModal.style.display = 'block';
    }

    function closePaymentModal() {
        paymentModal.style.display = 'none';
    }

    function handleConfirmPayment() {
        // 1. Record the sale
        recordSale(currentTotal);
        // 2. Give feedback to user
        alert(`บันทึกยอดขายจำนวน ฿${currentTotal} เรียบร้อยแล้ว`);
        // 3. Close the modal
        closePaymentModal();
        // 4. Clear the current order for the next customer
        handleClearOrder();
        // 5. Update the daily sales display
        displayDailySales();
    }

    // --- NEW Functions for Sales Recording ---

    function getTodayString() {
        return new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    }

    function recordSale(amount) {
        const today = getTodayString();
        // Get existing sales data from localStorage, or create a new object if none exists
        let salesData = JSON.parse(localStorage.getItem('pizzaShopSales')) || {};
        
        // Add current sale amount to today's total
        salesData[today] = (salesData[today] || 0) + amount;

        // Save the updated data back to localStorage
        localStorage.setItem('pizzaShopSales', JSON.stringify(salesData));
    }

    function displayDailySales() {
        const today = getTodayString();
        let salesData = JSON.parse(localStorage.getItem('pizzaShopSales')) || {};
        const todaySales = salesData[today] || 0;
        dailySalesEl.textContent = `฿${todaySales}`;
    }

    // --- Attach Event Listeners ---
    menuGrid.addEventListener('click', handleAddItem);
    clearOrderBtn.addEventListener('click', handleClearOrder);
    
    // New Listeners
    checkoutBtn.addEventListener('click', showPaymentModal);
    closeModalBtn.addEventListener('click', closePaymentModal);
    confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    showSalesBtn.addEventListener('click', displayDailySales);

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == paymentModal) {
            closePaymentModal();
        }
    });

    // --- Initial Load ---
    renderMenu();
    displayDailySales(); // Show sales from the start
});
