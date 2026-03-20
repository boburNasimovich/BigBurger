const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "8232650087:AAEQtCj3DkXlrb8NxdeGPyklgbJamyD4Hy8";
const CHAT_ID = "983089996";

app.post("/order", async (req, res) => {
  const { name, phone, address, cart } = req.body;

  let items = cart.map(i => `${i.name} x${i.qty}`).join("\n");

  const text = `
🍔 Yangi buyurtma!

👤 ${name}
📞 ${phone}
📍 ${address}

🛒:
${items}
`;

  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: text
  });

  res.json({ success: true });
});

app.listen(3000, () => console.log("Server ishlayapti 🚀"));