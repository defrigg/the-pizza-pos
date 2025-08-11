document.addEventListener('DOMContentLoaded', () => {

    const kitchenOrderList = document.getElementById('kitchen-order-list');

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

    // --- Real-time Update Listener ---
    // This listens for changes in localStorage from other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'pizzaKitchenQueue') {
            renderKitchenOrders();
        }
    });

    // --- Event Listeners ---
    kitchenOrderList.addEventListener('click', handleCompleteOrder);

    // --- Initial Load ---
    renderKitchenOrders();
});
