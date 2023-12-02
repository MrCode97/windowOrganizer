const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.listen(7007, () => {
    console.log('Server listening on port 7007');
});