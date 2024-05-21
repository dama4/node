const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample data
let items = [
  { id: 1, epiphanie: 'Item 1' },
  { id: 2, henriette: 'Item 2' },
  { id: 3, damars: 'Item 3' },
];

// GET request to retrieve all items
app.get('/items', (req, res) => {
  res.json(items);
});

// POST request to create a new item
app.post('/items', (req, res) => {
  const { name } = req.body;
  const newItem = { id: items.length + 1, name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT request to update an item
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    items[index].name = name;
    res.json(items[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE request to delete an item
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const index = items.findIndex(item => item.id === parseInt(id));
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
