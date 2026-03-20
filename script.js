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

  if (name.length < 3) {
    alert("Ism noto‘g‘ri!");
    return;
  }

  if (!phone.startsWith("+998")) {
    alert("Telefon +998 bilan boshlansin");
    return;
  }

  if (address.length < 5) {
    alert("Manzil noto‘g‘ri!");
    return;
  }

  if (cart.length === 0) {
    alert("Savat bo‘sh!");
    return;
  }

  // 🧾 Buyurtma matni
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
  const TOKEN = "8601650175:AAFhb8r_y4YZyyxM7kXq7e6QmXRSJkFh6yM";
  const CHAT_ID = "8459438709";

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    if (res.ok) {
      alert("Buyurtma yuborildi! ✅");
      cart = [];
      renderCart();
    } else {
      alert("Xatolik! ❌");
    }

  } catch (err) {
    alert("Internet xatosi ❌");
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