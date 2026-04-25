let cart = [];

// loader
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loader").style.display = "none";
});

function addToCart(name, price) {
  let item = cart.find(i => i.name === name);

  if (item) item.qty++;
  else cart.push({ name, price, qty: 1 });

  renderCart();
  showToast(name + " qo‘shildi ✅");
}
function increase(index) {
  cart[index].qty++;
  renderCart();
}

function decrease(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.innerText = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
function renderCart() {
  let cartList = document.getElementById("cart");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartList.innerHTML += `
      <li style="margin-bottom:10px;">
        <b>${item.name}</b><br>
        
        <button onclick="decrease(${index})">➖</button>
        ${item.qty}
        <button onclick="increase(${index})">➕</button>
        
        <button onclick="removeItem(${index})" style="color:red;">❌</button>
      </li>
    `;
  });

  document.getElementById("total").innerText = "Jami: " + total + " so'm";
}

async function sendOrder() {
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();

  // Validatsiya
  if (name.length < 3) { alert("Ism noto‘g‘ri!"); return; }
  if (!phone.startsWith("+998")) { alert("Telefon +998 bilan boshlansin"); return; }
  if (address.length < 5) { alert("Manzil noto‘g‘ri!"); return; }
  if (cart.length === 0) { alert("Savat bo‘sh!"); return; }

  let items = cart.map(i => `${i.name} x${i.qty}`).join("\n");
  let total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const text =
    `🍔 Yangi buyurtma!

👤 Ism: ${name}
📞 Telefon: ${phone}
📍 Manzil: ${address}

🛒 Buyurtma:
${items}

💰 Jami: ${total} so'm`;

  // 🔐 TELEGRAM CONFIG
  const TOKEN = "8232650087:AAEQtCj3DkXlrb8NxdeGPyklgbJamyD4Hy8";
  const CHAT_IDS = ["983089996", "8701773479"]; // IDlar ro'yxati

  try {
    // Har bir ID uchun alohida so'rov yuborish
    for (const chat_id of CHAT_IDS) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat_id,
          text: text
        })
      });
    }

    alert("Buyurtma yuborildi! ✅");
    cart = [];
    renderCart();

  } catch (err) {
    alert("Internet xatosi yoki serverda muammo yuz berdi ❌");
    console.log(err);
  }
}

function scrollToMenu() {
  document.getElementById("menuTitle").scrollIntoView({
    behavior: "smooth"
  });
}

document.getElementById("phone").addEventListener("input", function () {
  if (!this.value.startsWith("+998")) {
    this.value = "+998";
  }
});