const express = require('express');
const app = express();

app.get('/api/home', (req, res) => {
    res.status(200).json('Welcome, your app is working well');
});

// Only used for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(4000, () => {
        console.log('Server running at http://localhost:4000');
    });
}

// Export the Express API
module.exports = app;