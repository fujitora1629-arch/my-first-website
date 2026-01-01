const products = [
    { id: 1, name: "3 ពណ៌", price: 30, img: "Krem1.jpg" },
    { id: 2, name: "រំយោល", price: 10, img: "Krem2.jpg" },
    { id: 3, name: "ម្លិះ", price: 10, img: "Krem3.jpg" },
    { id: 4, name: "ត្របែកព្រៃ", price: 10, img: "Krem4.jpg" },
    { id: 5, name: "ប៉ុងផ្កាអាថ៌កំបាំង", price: 1.5, img: "Krem5.jpg" },
    { id: 6, name: "កុលាប", price: 10, img: "Krem6.jpg" },
    { id: 7, name: "ឈូក", price: 10, img: "Krem7.jpg" },
    { id: 8, name: "ផ្គរលាន់", price: 10, img: "Krem8.jpg" },
    { id: 9, name: "រំដួល", price: 10, img: "Krem9.jpg" },
    { id: 10, name: "នគររាជ", price: 10, img: "Krem10.jpg" },
    { id: 11, name: "ទឹកដោះ", price: 10, img: "Krem11.jpg" },
    { id: 12, name: "អង្គារដី", price: 10, img: "Krem12.jpg" },
    { id: 13, name: "បណ្ដោងស្រោប Lip Oil", price: 5, img: "Krem13.jpg" },
    { id: 14, name: "បណ្ដោង Coquette", price: 3, img: "Krem14.jpg" },
    { id: 15, name: "បណ្ដោង Filligree", price: 3, img: "Krem15.jpg" },
    { id: 16, name: "ប្រដាប់កិប", price: 3, img: "Krem16.jpg" },
    { id: 17, name: "បណ្ដោង Glitter", price: 3, img: "Krem17.jpg" },
    { id: 18, name: "បណ្ដោងកញ្ចក់", price: 3, img: "Krem18.jpg" },
    { id: 19, name: "បណ្ដោង Petal", price: 3, img: "Krem19.jpg" }
];

let cart = JSON.parse(localStorage.getItem('pichPiseyCart')) || {}; 
const grid = document.getElementById('product-grid');

// --- SHOP PAGE LOGIC ---
function render() {
    if (!grid) return; 
    grid.innerHTML = '';
    products.forEach(p => {
        const qty = cart[p.id] || 0;
        grid.innerHTML += `
            <div class="product-card">
                <div class="img-box"><img src="images/${p.img}"></div>
                <div class="product-info"><span>${p.name}</span><span>$${p.price}</span></div>
                <button class="add-btn ${qty > 0 ? 'hidden' : ''}" onclick="updateQty(${p.id}, 1, '${p.img}')">👜 បញ្ចូលក្នុងកាបូប</button>
                <div class="qty-container ${qty > 0 ? '' : 'hidden'}">
                    <button class="qty-btn" onclick="updateQty(${p.id}, -1, '${p.img}')">−</button>
                    <input type="text" class="qty-input" value="${qty}" readonly>
                    <button class="qty-btn" onclick="updateQty(${p.id}, 1, '${p.img}')">+</button>
                </div>
            </div>`;
    });
    updateUI(); 
}

function updateQty(id, delta, imgPath) {
    if (!cart[id]) cart[id] = 0;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];

    localStorage.setItem('pichPiseyCart', JSON.stringify(cart));
    updateUI(imgPath);
    render(); 
}

function updateUI(imgPath) {
    let total = Object.values(cart).reduce((a, b) => a + b, 0);
    const badge = document.getElementById('cart-badge');
    const barText = document.getElementById('cart-count-text');
    const lastImg = document.getElementById('last-item-img');
    const bar = document.getElementById('checkout-bar');

    if (badge) badge.innerText = total;
    if (barText) barText.innerText = `${total} មុខទំនិញ`; // Total products in Khmer
    if (imgPath && lastImg) lastImg.src = `images/${imgPath}`;

    if (total > 0 && bar) {
        bar.classList.add('show');
    } else if (bar) {
        bar.classList.remove('show');
    }
}

// --- CHECKOUT PAGE LOGIC ---
function renderCheckoutPage() {
    const bagContainer = document.getElementById('bag-items-container');
    const summaryList = document.getElementById('summary-items');
    if (!bagContainer) return;

    bagContainer.innerHTML = '';
    summaryList.innerHTML = '';
    let subtotal = 0;

    products.forEach(p => {
        const qty = cart[p.id] || 0;
        if (qty > 0) {
            let itemTotal = p.price * qty;
            subtotal += itemTotal;

            // Interactive Bag List (Khmer: បោះបង់ = Remove)
            bagContainer.innerHTML += `
                <div class="bag-item" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #eee; padding:15px 0;">
                    <div style="display:flex; align-items:center; gap:15px; flex:1;">
                        <img src="images/${p.img}" style="width:60px; height:60px; object-fit:contain;">
                        <span style="font-weight:bold;">${p.name}</span>
                    </div>
                    <div style="display:flex; align-items:center; border:1px solid #ddd; border-radius:5px; margin: 0 20px;">
                        <button onclick="changeQtyInCheckout(${p.id}, -1)" style="padding:5px 12px; border:none; background:#f9f9f9; cursor:pointer;">">−</button>
                        <span style="padding:0 15px; font-weight:bold;">${qty}</span>
                        <button onclick="changeQtyInCheckout(${p.id}, 1)" style="padding:5px 12px; border:none; background:#f9f9f9; cursor:pointer;">+</button>
                    </div>
                    <button onclick="removeItemFromCheckout(${p.id})" style="color:#ff4d4d; border:none; background:none; cursor:pointer; font-weight:bold;">បោះបង់</button>
                </div>`;

            // Simple Summary List
            summaryList.innerHTML += `
                <div style="display:flex; justify-content:space-between; margin:8px 0;">
                    <span>${p.name} x ${qty}</span>
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>`;
        }
    });

    const deliveryFee = subtotal > 0 ? 1.5 : 0;
    document.getElementById('final-price').innerText = `$${(subtotal + deliveryFee).toFixed(2)}`;

    if (subtotal === 0) {
        bagContainer.innerHTML = '<p style="text-align:center; padding:30px; color:#888;">កន្ត្រកទំនិញរបស់អ្នកនៅទំនេរ។</p>';
    }
}

function changeQtyInCheckout(id, delta) {
    if (!cart[id]) cart[id] = 0;
    cart[id] += delta;
    if (cart[id] <= 0) delete cart[id];
    localStorage.setItem('pichPiseyCart', JSON.stringify(cart));
    renderCheckoutPage();
}

function removeItemFromCheckout(id) {
    delete cart[id];
    localStorage.setItem('pichPiseyCart', JSON.stringify(cart));
    renderCheckoutPage();
}

render();
if (window.location.pathname.includes('checkout.html')) {
    renderCheckoutPage();
}