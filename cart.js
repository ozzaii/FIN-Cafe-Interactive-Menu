// cart.js
async function placeOrder(customerName, tableNumber) {
    try {
        const response = await fetch('/api/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customerName,
                tableNumber,
                items: cart,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to place order');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
}

document.getElementById('customer-details').addEventListener('submit', async (e) => {
    e.preventDefault();
    const customerName = document.getElementById('customer-name').value;
    const tableNumber = document.getElementById('table-number').value;
    
    try {
        const result = await placeOrder(customerName, tableNumber);
        console.log('Order placed:', result);
        cart = [];
        updateCartDisplay();
        document.getElementById('order-form').classList.add('hidden');
        alert('Order placed successfully!');
    } catch (error) {
        alert('Failed to place order. Please try again.');
    }
});
