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
    const password = req.body.password; //TODO hash later
    db.query("", [mail, password], (err, result) => {
        if(err){
            console.log(err)
        }else{
            if(result.length===1){
                res.send(true);
            }else{
                res.send(false);
            }
        }
    }) //TODO (Joscupe) select user which has the password
})

app.listen(5000, () => {
    console.log("Server started");
});