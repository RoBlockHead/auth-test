import express from 'express';
import dotenv from 'dotenv';
import {checkUser, createUser} from './auth';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { sys } from 'typescript';
dotenv.config()

const app = express()
const jwtSecret:jwt.Secret = process.env.JWTSECRET
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
        res.send('oops');
    }
});

app.get('/auth', (req, res) => {
    const accesstoken = req.cookies.accesstoken;
    if(jwt.verify(accesstoken, jwtSecret, ))
    res.status(200);
    res.sendFile(process.cwd() + '/src/auth.html'); 
    
});
app.post('/signin', (req, res) => {
    checkUser(req.body.username, req.body.password, (valid: boolean) => {
        if(valid){
            const now = new Date()
            const jwtPayload = {
                username: "",
                ipAddress: req.ip,
                timestamp: Math.round((now.getTime() + (now.getTimezoneOffset() * 60 * 1000))/1000)
            }
            const jwtToken = jwt.sign(jwtPayload, jwtSecret.toString(), {expiresIn: "7d"})
            res.cookie('accesstoken', jwtToken, { httpOnly: true} );
            res.send('Valid Credentials');
            return;
        }
        else{
            res.send('Invalid Credentials');
        }
    });
})
app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`);
});