const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 3000;
const STATIC_PATH = './static';
const LOG_ROOT_PATH = './log/';

const POST_BODY_SIZE = '50mb';
const bodyParser = require('body-parser');
const parser = bodyParser.text({limit : POST_BODY_SIZE});

if(!fs.existsSync(LOG_ROOT_PATH))
    fs.mkdirSync(LOG_ROOT_PATH);

app.listen(PORT, () => {
    console.log(`Application started and listening port ${PORT}`);
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
})

app.post('/', parser, (req, res) => {
    if(req.body === undefined) {
        res.statusCode = 404;
        res.end();
        return;
    }

    let append = req.header('append');
    let path = req.header('logfile');
    if(!append || !path) {
        res.statusCode = 400;
        res.end();
        return;
    }

    let flag = append === 'true' ? 'a' : 'w';
    let stream = fs.createWriteStream(LOG_ROOT_PATH + path + '.log', { flags : flag});
    stream
        .on('open', () => {
            stream.write(req.body);
            stream.end();
    })
        .on('finish', () => {
            res.statusCode = 200;
            res.end();
        })
        .on('error', () => {
            res.statusCode = 406;
            res.end();
        });
})

//app.use(bodyParser.text());
app.use(express.static(STATIC_PATH));