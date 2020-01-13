const express = require('express');
const app = express();
require('./services/passport');
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
console.log("listening at port", PORT)
app.listen(PORT);