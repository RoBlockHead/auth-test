import express, { Request } from 'express';
import dotenv from 'dotenv';
import {checkUser, createUser} from './auth';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { isNamedExportBindings, sys } from 'typescript';
import cookieParser from 'cookie-parser';
dotenv.config()

export const app = express()
const jwtSecret: string= `${process.env.JWTSECRET}`
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views')
app.set('view engine', 'tsx');
app.engine('tsx', require('express-react-views').createEngine());

const checkCookie = (req: Request) => {

    return(req.cookies && req.cookies.accesstoken && jwt.verify(req.cookies.accesstoken, jwtSecret));

}

app.get('/', (req, res) => {
    res.send('Hello World!');
    res.status(200);
});

app.get('/secret', (req, res) => {
    console.log(req.cookies);
    if(checkCookie(req)){
        res.status(200);
        // res.send('SECRETS HEREEEE');
        res.render('secretStuff', {});
    }
    else {
        res.status(401);
        res.redirect('/signin');
    }
});
app.route('/signin')
    .all( (req, res, next) => {
        if(checkCookie(req)){
            if(req.query && req.query.next){
                res.redirect(303, req.query.next.toString());
                return;
            }
            else{
                res.redirect(303, '/secret');
                return;
            }
        }
        else{
            next();
        }
    })
    .get( (req, res) => {
        res.sendFile(__dirname + '/views/auth.html');
    })
    .post( (req, res) => {
        checkUser(req.body.username, req.body.password, (valid: boolean) => {
            if(valid){
                const now = new Date()
                const jwtPayload = {
                    username: req.body.username,
                    ipAddress: req.ip,
                    timestamp: Math.round((now.getTime() + (now.getTimezoneOffset() * 60 * 1000))/1000)
                }
                const jwtToken = jwt.sign(jwtPayload, jwtSecret.toString(), {expiresIn: "7d"})
                res.cookie('accesstoken', jwtToken, { httpOnly: true, sameSite: true, path: '/'} );
                if(req.query && req.query.next) {
                    res.redirect(303, req.query.next.toString());
                }
                else{
                    res.redirect(303, '/secret');
                }
            }
            else{
                res.send('Invalid Credentials');
            }
        });
    })