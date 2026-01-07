import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState({
    name: '',
    type: 'product',
    content: {
      text: '',
      barcodeData: '',
      companyName: ''
    }
  });

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/labels');
      setLabels(response.data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/labels', newLabel);
      fetchLabels();
      setNewLabel({
        name: '',
        type: 'product',
        content: { text: '', barcodeData: '', companyName: '' }
      });
    } catch (error) {
      console.error('Error creating label:', error);
    }
  };

  const generateBarcode = async () => {
    if (!newLabel.content.barcodeData) return;
    try {
      const response = await axios.post('http://localhost:3000/api/generate-barcode', {
        data: newLabel.content.barcodeData
      });
      console.log('Barcode generated:', response.data);
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  };

  return (
    <div className="container">
      <h1>Cloud Label Management System - FREE VERSION</h1>
      
      {/* Label Creation Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Label Name"
          value={newLabel.name}
          onChange={(e) => setNewLabel({...newLabel, name: e.target.value})}
          required
        />
        
        <select
          value={newLabel.type}
          onChange={(e) => setNewLabel({...newLabel, type: e.target.value})}
        >
          <option value="product">Product Label</option>
          <option value="shipping">Shipping Label</option>
          <option value="barcode">Barcode Only</option>
          <option value="qr">QR Code</option>
        </select>
        
        <textarea
          placeholder="Label Content"
          value={newLabel.content.text}
          onChange={(e) => setNewLabel({
            ...newLabel, 
            content: {...newLabel.content, text: e.target.value}
          })}
        />
        
        <input
          type="text"
          placeholder="Barcode Data (optional)"
          value={newLabel.content.barcodeData}
          onChange={(e) => setNewLabel({
            ...newLabel, 
            content: {...newLabel.content, barcodeData: e.target.value}
          })}
        />
        
        <button type="button" onClick={generateBarcode}>
          Generate Barcode
        </button>
        
        <button type="submit">Create Label</button>
      </form>
      
      {/* Labels List */}
      <div className="labels-list">
        <h2>Your Labels ({labels.length})</h2>
        {labels.map(label => (
          <div key={label._id} className="label-card">
            <h3>{label.name}</h3>
            <p>Type: {label.type}</p>
            <p>Created: {new Date(label.createdAt).toLocaleDateString()}</p>
            <p>Print Count: {label.printCount}</p>
            <button onClick={() => window.print()}>Print Label</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
