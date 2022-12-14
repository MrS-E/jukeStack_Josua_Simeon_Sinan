import { key } from "./db_key.js"; //keyfile with has an exported const with db key (file is in .gitignore)
import sha256 from "crypto-js/sha256";
const express = require("express");
const mysql = require("mysql");
let schedule = require('node-schedule');
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json()); //to manage the parsing of the body from react app

const db = mysql.createConnection({ //DB Connection
    user: "jukSiSiJo", //TODO (Joscupe) user
    host: "i-kf.ch",
    password: key, //careful key is in not sync file "db_key.js" under key const
    database: "jukeStackDB_SimeonSinanJosua",
});

app.get("/login", (req, res)=>{
    const mail = req.body.mail;
    const password = sha256(req.body.password);
    db.query("select UsPasswd from TUsers where UsMail = (?)", //select user which has the password
        [mail],
        (err, result) => {
        if(err){
            console.log("login:",err)
            res.send({login:false, error: err})
        }else{
            if(result.length===1){
                if(password===result[0]){
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

    db.query("insert into TUsers values(?,?,?,?,?)", //TODO (Joscupe) insert user
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
    db.query("select * from TNFTSongs",//TODO (Joscupe) select all songs from db
        (err, result)=>{
        if(err){
            console.log("list:",err);
            res.send({result: null, error: err});
        }else{
            res.send({result: result});
        }
    });
});

app.post("/lend", (req, res)=>{
    const token = req.body.NFToken;
    const userMail = req.body.mail;
    db.query("select count(*) from TLendings where UsMail = '(?)' and LenEnd is null;", //TODO (Joscupe) select all active lends from user
        [userMail],
        (err, result)=>{
        if(err){
            console.log("lend (select):", err)
            res.send({lend:false, error: err})
        }else{
            if(result.length<5){
                db.query("insert into TLandings(LenStart, NFToken, UsMail) values(now(), ?,?) ", //TODO (Joscupe) insert TLendings
                    [token, userMail],
                    (err) => {
                        if(err){
                            console.log("lend (insert):", err);
                            res.send({lend:false, error:err})
                        }else{
                            res.send({lend: true})
                        }
                    });
            }else{
                res.send({lend:false, error:"user "+userMail+" has to many outstanding Lendings"})
            }
        }
        })
});

app.get("/lendings", (req, res)=>{
    const userMail = req.body.mail;
    db.query("select distinct UsFName, USSName, NFName, NFInterpret, NFLength, NFYear, LenStart from TUsers natural join TLendings l natural join TNFTSongs where l.UsMail = (?);", //TODO (Joscupe) select all lend songs from user which have no end date (if return with deletion additions are needed by (MrS-E)).
        [userMail],
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
    const user = req.body.mail; // Don't need it
    const NFToken = req.body.NFtoken; // Don't need it
    const LenID = req.body.songId;
    db.query("update TLendings set LenEnd = now() where LenId = (?);", //TODO (Joscupe) update of lending with end time. -> (MrS-E) edit of function
        [/*user,NFToken,*/LenID],
        (err)=>{
        if(err){
            console.log("return:",err);
            res.send({return:false, error:err})
        }else{
            res.send({return:true, song: NFToken, user: user});
        }
        });
});

schedule.scheduleJob('0 0 * * *', ()=>{ //runs every 24h at 0:0 // when is a lending expired? extra function
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