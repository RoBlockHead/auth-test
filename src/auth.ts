import sq from '@journeyapps/sqlcipher';
const sqlite3 = sq.verbose();
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config;

var usersDB = new sqlite3.Database('users.db', ); 
const saltRounds = 10

export const createUser = async (username: string, password: string) => {
    await bcrypt.hash(password, saltRounds, (err: Error, hash: string) => {
        if(err){
            return console.error(err);
        }
        usersDB.run(`INSERT INTO users('username','password') VALUES('${username}','${hash}')`);
    });
}
export const checkUser = async (username: string, password: string, callback: Function) => {
    setTimeout(() => {
        let passHash: string;
        usersDB.get(`SELECT DISTINCT * FROM users WHERE username = '${username}'`, (err: Error, row: any) => {
            if (err) {
                callback(false);
                return console.error(err);
            }
            else if(!row){
                callback(false);
                return false;
            }
            bcrypt.compare(password, row.password, (err: Error, same: boolean) => {
                if (err) {
                    // console.log(typeof(password));
                    callback(false);
                    return console.error(err);
                }
                callback(same);
            });
            // console.log(row.password);
            // passHash = row.password;
            return;
        });
    }, 0) 
    // if(!passHash){
    //     return false;
    // }
    // console.log('password' + password);
    // console.log('passHash' + passHash);
    // let match = await bcrypt.compare(password, passHash, (err: Error, same: boolean) => {
    //     if (err) {
    //         // console.log(typeof(password));
    //         console.log(passHash);
    //         return console.error(err);
    //     }
    //     callback(same);
    // });
    // return match;
}
usersDB.serialize(() => {
    // Specify the cipher version
    usersDB.run("PRAGMA cipher_compatability = 4");

    usersDB.run(`PRAGMA key = '${process.env.SQLITEPASSWORD}'`)
    // usersDB.run("DROP TABLE users")
    usersDB.run("CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY NOT NULL UNIQUE, password TEXT NOT NULL );")
});
const main = async () => {
    usersDB.get("SELECT * FROM users", (err: Error, row: any) => {
        if (err) {
            return console.error(err);
        }
    });
    checkUser('yeetus', 'password123', (match: Boolean) => {
        console.log(match);
    })
}
main();
