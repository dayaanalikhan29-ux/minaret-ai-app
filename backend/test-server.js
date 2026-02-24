const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Test Server</title></head>
        <body>
            <h1>Test Server</h1>
            <form method="POST" action="/ask">
                <input type="text" name="question" placeholder="Type a message..." required>
                <button type="submit">Send</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/ask', (req, res) => {
    console.log('Received POST request:', req.body);
    res.send(`Received: ${req.body.question}`);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
}); 