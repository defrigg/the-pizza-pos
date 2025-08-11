:root {
    --primary-red: #d92027;
    --primary-green: #297a38;
    --light-cream: #fdf5e6;
    --dark-grey: #333;
    --light-grey: #f4f4f4;
    --checkout-blue: #007bff;
}

body {
    font-family: 'Kanit', sans-serif;
    margin: 0;
    background-color: var(--light-cream);
    color: var(--dark-grey);
}

header {
    background-color: var(--primary-red);
    color: white;
    text-align: center;
    padding: 1rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

header h1 {
    margin: 0;
    font-size: 2.5rem;
}

.main-container {
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 1rem;
}

.menu-section {
    flex: 3;
    min-width: 300px;
}

.menu-section h2, .order-section h2 {
    color: var(--primary-green);
    border-bottom: 3px solid var(--primary-green);
    padding-bottom: 0.5rem;
    margin-top: 0;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
}

.menu-item {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
}

.menu-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.menu-item img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    background-color: #eee;
}

.menu-item h3 {
    margin: 0.5rem 0;
    color: var(--dark-grey);
    font-size: 1.2rem;
}

.menu-item p {
    font-size: 0.85rem;
    color: #666;
    flex-grow: 1;
    margin-bottom: 1rem;
}

.price-buttons {
    display: flex;
    gap: 0.5rem;
}

.price-buttons button {
    flex: 1;
    background-color: var(--primary-green);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Kanit', sans-serif;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.price-buttons button:hover {
    background-color: #21602d;
}

.order-section {
    flex: 1;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.order-box, .sales-report-box {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    position: sticky;
    top: 1rem;
}

#order-items {
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 35vh;
    overflow-y: auto;
}

#order-items li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--light-grey);
}

#order-items li.placeholder {
    justify-content: center;
    color: #999;
}

#order-items li:last-child {
    border-bottom: none;
}

.total-area {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid var(--dark-grey);
}

#total-price {
    color: var(--primary-red);
}

.action-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.action-buttons button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s, opacity 0.2s;
}

#clear-order-btn {
    background-color: var(--primary-red);
    color: white;
}

#clear-order-btn:hover {
    background-color: #b21a21;
}

#checkout-btn {
    background-color: var(--checkout-blue);
    color: white;
}

#checkout-btn:hover {
    background-color: #0069d9;
}

#checkout-btn:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

/* NEW: Sales Report Styles */
.sales-summary {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
}
#daily-sales {
    color: var(--primary-green);
    font-size: 1.5rem;
}
#show-sales-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 0.5rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    cursor: pointer;
}

/* NEW: Modal Styles */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.6);
}

.modal-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 2rem;
    border: 1px solid #888;
    width: 90%;
    max-width: 400px;
    border-radius: 8px;
    text-align: center;
    position: relative;
}

.close-btn {
    color: #aaa;
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.qr-code-img {
    width: 80%;
    max-width: 250px;
    margin: 1rem auto;
    display: block;
    border: 1px solid #ccc;
}

.note {
    font-size: 0.9rem;
    color: var(--primary-red);
}

#confirm-payment-btn {
    width: 100%;
    padding: 0.8rem;
    background-color: var(--primary-green);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
    }
    .order-section {
        flex-direction: column;
    }
}
