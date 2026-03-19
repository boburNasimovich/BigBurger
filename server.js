const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const TOKEN = "8601650175:AAFhb8r_y4YZyyxM7kXq7e6QmXRSJkFh6yM";
const CHAT_ID = "8459438709";

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