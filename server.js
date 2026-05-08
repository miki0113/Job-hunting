const express = require('express');
const app = express();
app.use(express.static(__dirname));
const PORT = process.env.PORT || 80;
app.listen(PORT);
