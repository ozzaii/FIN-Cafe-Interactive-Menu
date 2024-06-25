// menu.js
async function fetchMenuItems() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

async function displayMenu() {
    const menuContainer = document.getElementById('menu-items');
    const menuItems = await fetchMenuItems();
    menuItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Price: ₺${item.price}</p>
            <button onclick="addToCart(${item._id})">Add to Cart</button>
        `;
        menuContainer.appendChild(itemElement);
    });
}

document.addEventListener('DOMContentLoaded', displayMenu);
