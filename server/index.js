const sha256 = require("crypto-js/sha256");
const express = require("express");
const mysql = require("mysql2"); //mysql2 because with mysql I have the error: 'ER_NOT_SUPPORTED_AUTH_MODE'
const schedule = require('node-schedule');
const cors = require("cors");
const axios = require("axios")

const app = express();
app.use(cors());
app.use(express.json()); //to manage the parsing of the body from react app

const db = mysql.createConnection({ //DB Connection
    user: "jukSiSiJo",
    host: "i-kf.ch",
    password: process.env.DB_KEY || require("./variables").DB_KEY, //careful key is in not sync file "keys.env" like (DB_KEY="...")
    database: "jukeStackDB_SimeonSinanJosua",
});
db.connect((err) =>{
    if (err){
        console.log(err)
    } else {
        console.log("Connected!");
    }
});

app.get("/", (req, res)=>{
    res.send("Server is running")
}) //TESTED
app.post("/login", (req, res)=>{
    const mail = req.body.mail;
    const password = sha256(req.body.password).toString();
    db.query("select UsPasswd from TUsers where UsMail = (?)", //select user which has the password
        [mail],
        (err, result) => {
            if(err){
                console.log("login", Date.now(), ":", err)
                res.send({login:false, error: err})
            }else{
                if(result.length===1){
                    if(password===result[0].UsPasswd){
                        if(result[0].UsRole==="admin") {
                            res.send({login: true, admin: true, user: mail, error: null})
                        }else {
                            res.send({login: true, admin: false, user: mail, error: null})
                        }
                    }else{
                        res.send({login:false,error: null, message: "wrong password"})
                    }
                }else{
                    res.send({login:false,error: null, message: "user not found"});
                }
            }
        });
}); //TESTED
app.post("/register", (req, res) => { //TESTED
    const mail = req.body.mail;
    const salutation = req.body.salutation;
    const first = req.body.firstName;
    const last = req.body.lastName;
    const password = sha256(req.body.password).toString();
    db.query("insert into TUsers (UsMail, UsSalutation, UsFName, UsSName, UsPasswd) values(?,?,?,?,?)",
        [mail, salutation,first,last,password],
        (err) => {
            if (err) {
                console.log("register:", Date.now(), ":",err);
                res.send({register:false, error:err})
            } else {
                res.send({register:true});
            }
        }
    );
}); //TESTED
app.get("/list", (req, res)=>{ //TESTED
    db.query("select * from TNFTSongs",
        (err, result)=>{
            if(err){
                console.log("list:",err);
                res.send({result: null, error: err});
            }else{
                res.send({result: result});
            }
        });
}); //TESTED
app.post("/lend", (req, res)=>{ //TESTED
    const token = req.body.NFToken;
    const userMail = req.body.mail;
    const userPwd = req.body.pwd;
    axios.post(domain+"/login", {mail:userMail, password:userPwd}).then((response)=>{
        if(response.data.login){
            db.query("select count(*) as many from TLendings where UsMail = (?) and LenEnd is null;",
                [userMail],
                (err, result)=>{
                    if(err){
                        console.log("lend (select):", err)
                        res.send({lend:false, error: err})
                    }else{
                        if(result[0].many<5){
                            db.query("insert into TLendings(LenStart, NFToken, UsMail) values(now(), ?,?) ",
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
                            res.send({lend:false, message:"User "+userMail+" has to many outstanding NFTs rents"})
                        }
                    }
                })
        }else{
            res.send({lend:false, error:"not authorized"})
        }
    })
}); //TESTED
app.post("/lendings", (req, res)=>{ //TESTED
    const userMail = req.body.user;
    const userPwd = req.body.pwd;
    axios.post(domain+"/login", {mail:userMail, password:userPwd}).then((response)=>{
        if(response.data.login) {
            db.query("select distinct LenId, NFToken, UsFName, USSName, NFName, NFInterpret, NFLength, NFYear, concat(date_format(LenStart, '%d %M %Y'),' ', time_format(LenStart, '%H:%i:%s')) as LenDate from TUsers natural join TLendings l natural join TNFTSongs where l.UsMail = (?) and LenEnd is null;",
                [userMail],
                (err, result) => {
                    if (err) {
                        console.log("lendings:", err);
                        res.send({lending: [], error: err});
                    } else {
                        if (result.length > 0) {
                            res.send({lending: result});
                        } else {
                            res.send({lending: [], error: "user has nothing rented"})
                        }
                    }
                }
            );
        }
    })
}); //TESTED
app.post("/return", (req, res)=> {
    const LenID = req.body.id;
    const mail = req.body.mail;
    const pwd = req.body.pwd;

    axios.post(domain + "/login", {mail: mail, password: pwd}).then((response) => {
        if (response.data.login) {
            db.query("update TLendings set LenEnd = now() where LenId = (?);",
                [/*user,NFToken,*/LenID],
                (err) => {
                    if (err) {
                        console.log("return:", err);
                        res.send({return: false, error: err, message:"Something went wrong. Please try again."})
                    } else {
                        res.send({return: true, LenID: LenID, message:"The NFT songs is successful returned."});
                    }
                });
        }else{
            res.send({return:false, message:"Something went wrong. Please try again."})
        }
    });
});
app.post("/user", (req, res)=>{ //TESTED
    const mail = req.body.user;
    const pwd = req.body.pwd
    axios.post(domain+"/login", {mail:mail, password:pwd}).then((response)=> {
        if (response.data.login) {
            db.query("select UsMail, UsSalutation, UsFName, UsSName from TUsers where UsMail=(?)", [mail], (err, result) => {
                if (err) {
                    res.send({user: undefined, error: err});
                } else {
                    if (result[0].UsMail && result[0].UsSalutation && result[0].UsFName && result[0].UsSName) {
                        res.send({
                            user: {
                                mail: result[0].UsMail,
                                salutation: result[0].UsSalutation,
                                fname: result[0].UsFName,
                                lname: result[0].UsSName
                            }
                        });
                    } else {
                        res.send({user: undefined, error: "Something strange"});
                    }
                }
            })
        }
    })
}) //TESTED
app.post("/admin", (req, res)=>{
    const user = req.body.admin;
    const pwd = req.body.pwd;
    const command = req.body.command;
    const attr = req.body.attributes;
    db.query("", [user, pwd], (err, result)=>{ //TODO (Joscupe) select if admin
        if(result.length===1){
            console.log("admin verified");
            res.send({admin: true});
            const query = {
                sql: undefined,
                values: []
            }
            switch(command){
                case "all_user":
                    query.sql = ""; //TODO (Joscupe) select * users
                    break;
                case "user":
                    query.sql = ""; //TODO (Joscupe) select user with mail
                    query.values = [attr.mail];
                    break;
                case "lending":
                    query.sql = ""; //TODO (Joscupe) select everything from lending
                    break;
                case "remove_lend":
                    query.sql = ""; //TODO (Joscupe) remove lending at id
                    query.values = [attr.lenId];
                    break;
                default: res.status(501).send("command unknown")
            }
            query.sql!==undefined ? db.query(query.sql, query.values, (err, result)=> {err ? res.sendStatus(503).send({result:undefined, error: err}) : res.send({result:result})}) : res.sendStatus(503).send({result: undefined, error:"db error, no connection"});
        }else{
            res.sendStatus(418).send({admin: false, error:"Pls, send admin verification."})
        }
    })
})
app.post("/update", (req, res)=>{ //TESTED
    const user = req.body.user;
    const pwd_old = sha256(req.body.pwd_old).toString();
    const pwd_new = sha256(req.body.pwd_new).toString();
    const mail = req.body.mail_new;
    db.query("update TUsers set UsMail=(?), UsPasswd=(?) where UsMail=(?) and UsPasswd=(?)",
        [mail, pwd_new,user,pwd_old],
        (err, result) => {
            console.log(result)
            if (err) {
                console.log("update:", Date.now(), ":",err);
                res.send({update:false, error:err})
            } else {
                res.send({update:true, result: result});
            }
        }
    );
}) //TESTED
schedule.scheduleJob('0 0 * * *', ()=>{ //runs every 24h at 0:0 // when is a lending expired? extra function!
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

const listener = app.listen(process.env.PORT||require("./variables").PORT, () => {
    console.log("Server started at port " + listener.address().port);
});

const domain = "http://localhost:"+listener.address().port;