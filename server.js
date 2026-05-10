const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

const saveDir = path.join(__dirname, 'PDF');
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

app.use(express.static(__dirname));
const upload = multer({ dest: saveDir });

app.get('/api/files', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        res.json(files || []);
    });
});

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
