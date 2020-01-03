const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send({ hello: 'again', bye: "for now" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);