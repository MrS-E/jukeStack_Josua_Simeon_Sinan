import { key } from "./db_key"; //keyfile with has an exported const with db key (file is in .gitignore)
import sha256 from "crypto-js/sha256";
const express = require("express");
const mysql = require("mysql");
var schedule = require('node-schedule');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json()); //to manage the parsing of the body from react app

const db = mysql.createConnection({ //DB Connection
    user: "root", //TODO (Joscupe) user
    host: "localhost",
    password: key, //careful key is in not sync file "db_key.js" under key const
    database: "employeeSystem",
});

app.get("/login", (req, res)=>{
    const mail = req.body.mail;
    const password = sha256(req.body.password);
    db.query("", //TODO (Joscupe) select user which has the password
        [mail, password],
        (err, result) => {
        if(err){
            console.log("login:",err)
            res.send({login:false, error: err})
        }else{
            if(result.length===1){
                if(password===result[0].UsPasswd){
                    result.send({login:true, user: mail, error: null})
                }else{
                    result.send({login:false, error: "wrong password"})
                }
            }else{
                res.send({login:false, error: "user not found"});
            }
        }
    });
});

app.post("/register", (req, res) => {
    const mail = req.body.mail;
    const salutation = req.body.salutation;
    const first = req.body.firstName;
    const last = req.body.lastName;
    const password = sha256(req.body.password);

    db.query("", //TODO (Joscupe) insert user
        [mail, salutation,first,last,password],
        (err) => {
            if (err) {
                console.log(err);
                res.send({register:false, error:err})
            } else {
                res.send({register:true});
            }
        }
    );
});

app.get("/list", (req, res)=>{
    db.query("",//TODO (Joscupe) select all songs from db
        (err, result)=>{
        if(err){
            console.log("list:",err);
            res.send({result: null, error: err});
        }else{
            res.send({result: result});
        }
    });
});

app.post("/lent", (req, res)=>{
    const token = req.body.NFToken;
    const user = req.body.mail;
    db.query("", //TODO (Joscupe) select all active lents from user
        [user],
        (err, result)=>{
        if(err){
            console.log("lent (select):", err)
            res.send({lent:false, error: err})
        }else{
            if(result.length<5){
                db.query("", //TODO (Joscupe) insert TLendings
                    [token, user],
                    (err) => {
                        if(err){
                            console.log("lent (insert):", err);
                            res.send({lent:false, error:err})
                        }else{
                            res.send({lent: true})
                        }
                    });
            }else{
                res.send({lent:false, error:"user "+user+" has to many outstanding borrowings"})
            }
        }
        })
});

app.get("/lendings", (req, res)=>{
    const user = req.body.mail;
    db.query("", //TODO (Joscupe) select all lent songs from user which have no end date (if return with deletion additions are needed by (MrS-E)).
        [user],
        (err, result)=>{
        if(err){
            console.log("lendings:",err);
            res.send({lending:undefined, error:err});
        }else{
            if(result.length>0) {
                res.send({lending: result});
            }else{
                res.send({lending:null, error:"user has nothing rented"})
            }
        }
        }
    );
});

app.put("/return", (req, res)=>{
    const user = req.body.mail;
    const NFToken = req.body.NFtoken;
    const LentID = req.body.songId;
    db.query("", //TODO (Joscupe) update of lending with end time. Maybe deletion -> (MrS-E) edit of function
        [user,NFToken,LentID],
        (err)=>{
        if(err){
            console.log("return:",err);
            res.send({return:false, error:err})
        }else{
            res.send({return:true, song: NFToken, user: user});
        }
        });
});

schedule.scheduleJob('0 0 * * *', ()=>{ //runs every 24h at 0:0
    db.query("", //TODO (Joscupe) select all lendings which have expired or which have no end date (would be nice if start date = 5 days in the past (if not additions are needed by (MrS-E)))
        (err, result)=>{
            if(err){
                console.log(err);
            }else{
                result.forEach((d)=>{
                    db.query("", //TODO (Joscupe) update lending with end date -> if deletion additions are needed here by (MrS-E & Joscupe)
                        [d.LenId],
                        (err)=>{
                            if(err){
                                console.log(err);
                            }
                        });
                });
            }
        });
});

app.listen(8080, () => {
    console.log("Server started at port 8080");
});