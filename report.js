document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const datePicker = document.getElementById('date-picker');
    const monthPicker = document.getElementById('month-picker');
    const showAllBtn = document.getElementById('show-all-btn');

    const summaryRevenueEl = document.getElementById('summary-revenue');
    const summaryOrdersEl = document.getElementById('summary-orders');
    const summaryBestsellerEl = document.getElementById('summary-bestseller');
    const salesLogBody = document.getElementById('sales-log-body');

    // --- Main Function to Generate Report ---
    function generateReport(filterType, filterValue) {
        const salesHistory = JSON.parse(localStorage.getItem('pizzaSalesHistory')) || [];
        let filteredOrders = [];

        // 1. Filter Data based on selection
        if (filterType === 'all') {
            filteredOrders = salesHistory;
        } else if (filterType === 'day' && filterValue) {
            filteredOrders = salesHistory.filter(order => order.date === filterValue);
        } else if (filterType === 'month' && filterValue) {
            filteredOrders = salesHistory.filter(order => order.date.startsWith(filterValue));
        }

        // 2. Calculate Summaries
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        
        // Find best-selling item
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


        // 3. Update DOM with summaries
        summaryRevenueEl.textContent = `฿${totalRevenue.toLocaleString()}`;
        summaryOrdersEl.textContent = totalOrders.toLocaleString();
        summaryBestsellerEl.textContent = bestseller;

        // 4. Populate Detailed Sales Log
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

    // --- Event Listeners ---
    datePicker.addEventListener('change', () => {
        monthPicker.value = ''; // Clear other pickers
        generateReport('day', datePicker.value);
    });

    monthPicker.addEventListener('change', () => {
        datePicker.value = ''; // Clear other pickers
        generateReport('month', monthPicker.value);
    });

    showAllBtn.addEventListener('click', () => {
        datePicker.value = '';
        monthPicker.value = '';
        generateReport('all');
    });

    // --- Initial Load ---
    const today = new Date().toISOString().slice(0, 10);
    datePicker.value = today;
    generateReport('day', today);
});
