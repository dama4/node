const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello Epiphanie!How Are You Doing?');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
