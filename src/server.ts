import express from 'express';
import dotenv from 'dotenv';

dotenv.config()

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!');
    res.status(200);
});

app.get('/secret', (req, res) => {
    if(req.headers.authorization) {
        res.status(200);
        res.send('Authorized');
    }
    else {
        res.status(401);
        res.setHeader('WWW-Authenticate', 'Basic realm="user Visible Realm"');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
});