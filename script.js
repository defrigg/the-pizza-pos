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

    const menuGrid = document.querySelector('.menu-grid');
    const orderItemsList = document.getElementById('order-items');
    const totalPriceEl = document.getElementById('total-price');
    const clearOrderBtn = document.getElementById('clear-order-btn');

    let currentOrder = [];

    // Function to generate menu items on the page
    function renderMenu() {
        menuGrid.innerHTML = ''; // Clear existing menu
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

    // Function to update the order display
    function updateOrder() {
        orderItemsList.innerHTML = ''; // Clear current list
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

    // Function to calculate and display the total price
    function calculateTotal() {
        const total = currentOrder.reduce((sum, item) => sum + item.price, 0);
        totalPriceEl.textContent = `฿${total}`;
    }

    // Event handler for adding items
    function handleAddItem(event) {
        if (event.target.classList.contains('add-btn')) {
            const name = event.target.dataset.name;
            const type = event.target.dataset.type;
            const price = parseInt(event.target.dataset.price);

            currentOrder.push({ name, type, price });
            updateOrder();
        }
    }

    // Event handler for clearing the order
    function handleClearOrder() {
        currentOrder = [];
        updateOrder();
    }

    // Attach event listeners
    menuGrid.addEventListener('click', handleAddItem);
    clearOrderBtn.addEventListener('click', handleClearOrder);

    // Initial setup
    renderMenu();
});
