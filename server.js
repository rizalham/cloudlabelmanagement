const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware gratis
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Koneksi MongoDB Atlas GRATIS
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model Label GRATIS
const labelSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ['product', 'shipping', 'barcode', 'qr'] },
  content: {
    text: String,
    barcodeData: String,
    qrData: String,
    companyName: String,
    address: String,
    phone: String
  },
  size: { type: String, default: '4x6' },
  format: { type: String, default: 'PDF' },
  userId: String,
  organizationId: String,
  printCount: { type: Number, default: 0 },
  status: { type: String, default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Label = mongoose.model('Label', labelSchema);

// API Routes GRATIS
app.get('/api/labels', async (req, res) => {
  try {
    const labels = await Label.find();
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/labels', async (req, res) => {
  try {
    const label = new Label(req.body);
    await label.save();
    res.status(201).json(label);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Barcode generator endpoint (GRATIS menggunakan library js)
app.post('/api/generate-barcode', async (req, res) => {
  const { data, type = 'CODE128' } = req.body;
  
  // Untuk sementara return data, nanti integrate dengan library barcode gratis
  res.json({
    barcode: data,
    type: type,
    imageUrl: `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(data)}&code=Code128&dpi=96`,
    generatedAt: new Date()
  });
});

// QR Code generator (GRATIS menggunakan API eksternal)
app.post('/api/generate-qrcode', async (req, res) => {
  const { data, size = '200x200' } = req.body;
  
  res.json({
    qrcode: data,
    imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`,
    generatedAt: new Date()
  });
});

// Label template system (GRATIS)
const templates = [
  {
    id: 'shipping-1',
    name: 'Shipping Label Standard',
    type: 'shipping',
    fields: ['sender_name', 'sender_address', 'receiver_name', 'receiver_address', 'tracking_number'],
    defaultSize: '4x6'
  },
  {
    id: 'product-1',
    name: 'Product Label Basic',
    type: 'product',
    fields: ['product_name', 'price', 'barcode', 'sku', 'description'],
    defaultSize: '3x2'
  }
];

app.get('/api/templates', (req, res) => {
  res.json(templates);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - FREE VERSION`);
});