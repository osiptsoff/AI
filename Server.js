const express = require('express');
const app = express();

const PORT = 3000;
const STATIC_PATH = './static';

app.listen(PORT, () => {
    console.log(`Application started and listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
})

app.use(express.static(STATIC_PATH));


