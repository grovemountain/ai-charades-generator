const express = require('express');
const app = express();
require('dotenv').config();

// Middleware to parse JSON bodies
app.use(express.json());

// The original home endpoint
app.get('/api/home', (req, res) => {
    res.status(200).json('Welcome, your app is working well!!!');
});

// New charades endpoint
app.get('/api/charades', async (req, res) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 100,
                system: "Du är en app som genererar svenska ordpar för charader. Svara endast med ordparet.",
                messages: [{
                    role: "user",
                    content: "Generera ett svenskt ordpar för en charad. Det ska vara ett verb i presens particip form (t.ex. 'springande') följt av ett substantiv (t.ex. 'katt'). Svara endast med ordparet, inget annat."
                }]
            })
        });

        // Log API response for debugging
        console.log('API Status:', response.status);
        const responseText = await response.text();
        console.log('API Response:', responseText);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            throw new Error('Invalid JSON response from API');
        }

        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new Error('Unexpected API response format');
        }

        res.json({ ordpar: data.content[0].text.trim() });
    } catch (error) {
        console.error('Detailed error:', error);
        res.status(500).json({
            error: 'Kunde inte generera ordpar',
            details: error.message
        });
    }
});

// Only used for local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(4000, () => {
        console.log('Server running at http://localhost:4000');
    });
}

// Export the Express API
module.exports = app;