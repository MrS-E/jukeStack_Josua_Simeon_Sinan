const sha256 = require("crypto-js/sha256");
const express = require("express");
const mariadb = require("./mariadb.js").mariadb;
const schedule = require('node-schedule');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); //to manage the parsing of the body from react app

const db = new mariadb({
    user: "jukSiSiJo",
    host: "i-kf.ch",
    password: process.env.DB_KEY || require("../variables.js").DB_KEY,
    database: "jukeStackDB_SimeonSinanJosua"
})

app.get("/", (req, res)=>{
    res.send("Server is running")
})

app.post("/login", (req, res)=>{

    const mail = req.body.mail;
    const password = sha256(req.body.password);
    db.query("select UsPasswd from TUsers where UsMail = (?)", //select user which has the password
        [mail]).then(
        (result) => {
        if(result.typ === "error"){
            console.log("login:",result.data)
            res.send({login:false, error: result.data, body:req.body})
        }else{
            if(result.data.length===1){
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

    db.query("insert into TUsers values(?,?,?,?,?)",
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
    db.query("select * from TNFTSongs").then(
        (result)=>{
            console.log(result)
        if(result.typ==="error"){
            console.log("list:",result.data);
            res.send({result: null, error: result.data});
        }else{
            res.send({result: result.data});
        }
    });
});

app.post("/lend", (req, res)=>{
    const token = req.body.NFToken;
    const userMail = req.body.mail;
    db.query("select count(*) from TLendings where UsMail = '(?)' and LenEnd is null;",
        [userMail]).then(
        (result)=>{
        if(result.typ==="error"){
            console.log("lend (select):", result.data)
            res.send({lend:false, error: result.data})
        }else{
            if(result.data.length<5){
                db.query("insert into TLandings(LenStart, NFToken, UsMail) values(now(), ?,?) ",
                    [token, userMail]).then(
                    (result) => {
                        if(result.typ === "error"){
                            console.log("lend (insert):", result.data);
                            res.send({lend:false, error: result.data})
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

app.get("/lendings/:user", (req, res)=>{
    const userMail = req.params.user;
    db.query("select distinct UsFName, USSName, NFName, NFInterpret, NFLength, NFYear, LenStart from TUsers natural join TLendings l natural join TNFTSongs where l.UsMail = (?);",
        [userMail]).then(
        (result)=>{
        if(result.typ==="error"){
            console.log("lendings:",result.data);
            res.send({lending:undefined, error:result.data});
        }else{
            if(result.length>0) {
                res.send({lending: result.data});
            }else{
                res.send({lending:null, error:"user has nothing rented"})
            }
        }
        }
    );
});

app.put("/return/:id", (req, res)=>{
    const LenID = req.params.id;
    db.query("update TLendings set LenEnd = now() where LenId = (?);",
        [/*user,NFToken,*/LenID]).then(
        (result)=>{
        if(result.typ==="error"){
            console.log("return:",result.data);
            res.send({return:false, error:result.data})
        }else{
            res.send({return:true, /*song: NFToken, user: user*/});
        }
        });
});

schedule.scheduleJob('0 0 * * *', ()=>{ //runs every 24h at 0:0 // when is a lending expired? extra function!
    db.query("", //TODO (Joscupe) select all lendings which have expired or which have no end date (would be nice if start date = 5 days in the past (if not additions are needed by (MrS-E)))
        (err, result)=>{
            if(err){
                console.log(err);
            }else{
                result.forEach((d)=>{
                    db.query("", //TODO (Joscupe) update lending with end date -> if deletion additions are needed here by (MrS-E & Joscupe)
                        [d.LenId]).then(
                        (result)=>{
                            if(result.typ==="error"){
                                console.log(result.data);
                            }
                        });
                });
            }
        });
});

app.listen(require("../variables").PORT, () => {
    console.log("Server started at port "+ require("../variables").PORT);
});