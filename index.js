const express = require('express');
const app = express();

const path = require('path');
const publicPath = path.join(__dirname, 'public');

const PORT = 8080; // Set localhost port

app.use(express.static(publicPath));
app.get('/', function(req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server on http://localhost:<PORT>
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});