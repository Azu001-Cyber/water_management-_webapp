const express = require('express');

const app = express();

const PORT = 3000;

// middelware

app.use(express.json());

// Route 
app.get('/', (req, res) => {
    res.send("Status: Ok");
});

app.get('/data', (req, res) => {
    console.log(req.body);
    res.json({status: "Received"});
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

