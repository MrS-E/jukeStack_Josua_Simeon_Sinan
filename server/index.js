import { key } from "./db_key"; //keyfile with has an exported const with db key (file is in .gitignore)
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json()); //to manage the parsing of the body from react app

const db = mysql.createConnection({ //DB Connection
    user: "root", //TODO (joscupe) user
    host: "localhost",
    password: key,
    database: "employeeSystem",
});

app.get("/login", (req, res)=>{
    const mail = req.body.mail;
    const password = req.body.password; //TODO (MrS-E) hash later
    db.query("", [mail, password], //TODO (Joscupe) select user which has the password
        (err, result) => {
        if(err){
            console.log(err)
            res.send({login:false, error: err})
        }else{
            if(result.length===1){
                if(password===result[0].UsPasswd){
                    result.send({login:true, error: null})
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
    const password = req.body.password; //TODO (MrS-E) hash

    db.query("", [mail, salutation,first,last,password], //TODO (Joscupe) insert user
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


app.listen(5000, () => {
    console.log("Server started at port 5000");
});