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
    user: /*"jukSiSiJo"*/ "root",
    host: /*"i-kf.ch"*/ "localhost",
    password: /*process.env.DB_KEY || require("./variables").DB_KEY*/ "", //careful key is in not sync file "keys.env" like (DB_KEY="...")
    database: "jukeStackDB_SimeonSinanJosua",
});
db.connect((err) => {
    if (err) {
        console.log("DB Connection error: ", err);
    } else {
        console.log("Connected to DB!");
    }
});

app.get("/", (req, res) => {
    res.send("Server is running")
}) //TESTED
app.post("/login", (req, res) => {
    const mail = req.body.mail;
    const password = sha256(req.body.password).toString();
    db.query("select UsPasswd, UsRole from TUsers where UsMail = (?)", //select user which has the password --> If I write UsRole the portal won't load, with USRole
        [mail],
        (err, result) => {
            if (err) {
                console.log("login error: ", Date.now(), ":", err)
                res.send({login: false, error: err})
            } else {
                if (result.length === 1) {
                    if (password === result[0].UsPasswd) {
                        if (result[0].UsRole === "admin") {
                            res.send({login: true, admin: true, user: mail, error: null})
                        } else {
                            res.send({login: true, admin: false, user: mail, error: null})
                        }
                    } else {
                        res.send({login: false, error: null, message: "wrong password"})
                    }
                } else {
                    res.send({login: false, error: null, message: "user not found"});
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
        [mail, salutation, first, last, password],
        (err) => {
            if (err) {
                console.log("register error: ", Date.now(), ":", err);
                res.send({register: false, error: err})
            } else {
                res.send({register: true});
            }
        }
    );
}); //TESTED
app.post("/history", (req, res) => { //TESTED
    const mail = req.body.mail;
    const pwd = req.body.pwd;
    axios.post(domain + "/login", {mail: mail, password: pwd}).then((response) => {
        if (response.data.login) {
            db.query("select distinct NFToken, NFName, NFInterpret, NFLength, NFYear, concat(date_format(LenStart, '%d.%m.%Y'),' ', time_format(LenStart, '%H:%i:%s')) as LenDateStart, concat(date_format(LenEnd, '%d.%m.%Y'),' ', time_format(LenEnd, '%H:%i:%s')) as LenDateEnd from TUsers natural join TLendings l natural join TNFTSongs where l.UsMail = (?);",
                [mail], (err, result) => {
                    if (err) {
                        console.log("history error: ", err);
                        res.send({history: [], error: err});
                    } else {
                        if (result.length > 0) {
                            res.send({history: result});
                        } else {
                            res.send({history: [], error: "user has nothing rented yet"})
                        }
                    }
                }
            );
        } else {
            res.send({history: [], error: "Something went wrong"})
        }
    })
}) //TESTED
app.get("/list", (req, res) => { //TESTED
    db.query("select * from TNFTSongs",
        (err, result) => {
            if (err) {
                console.log("list error: ", err);
                res.send({result: null, error: err});
            } else {
                res.send({result: result});
            }
        });
}); //TESTED
app.post("/lend", (req, res) => { //TESTED
    const token = req.body.NFToken;
    const userMail = req.body.mail;
    const userPwd = req.body.pwd;
    axios.post(domain + "/login", {mail: userMail, password: userPwd}).then((response) => {
        if (response.data.login) {
            db.query("select count(*) as amount from TLendings where UsMail = (?) and LenEnd is null;",
                [userMail],
                (err, result) => {
                    if (err) {
                        console.log("lend (select) error: ", err)
                        res.send({lend: false, error: err})
                    } else {
                        if (result[0].amount < 5) {
                            db.query("select count(*) as lent from TLendings where NFToken = (?) and LenEnd is null;",
                                [token], (err, result) => {
                                if(result[0].lent === 0) {
                                    db.query("insert into TLendings(LenStart, NFToken, UsMail) values(now(), ?,?) ",
                                        [token, userMail],
                                        (err) => {
                                            if (err) {
                                                console.log("lend (insert) error: ", err);
                                                res.send({lend: false, error: err})
                                            } else {
                                                res.send({lend: true})
                                            }
                                        });
                                } else {
                                    res.send({lend:false, message:"Already lent."})
                                }
                            })

                        } else {
                            res.send({lend: false, message: "User " + userMail + " has to many outstanding NFTs rents"})
                        }
                    }
                })
        } else {
            res.send({lend: false, error: "not authorized"})
        }
    })
}); //TESTED
app.post("/lendings", (req, res) => { //TESTED
    const userMail = req.body.user;
    const userPwd = req.body.pwd;
    axios.post(domain + "/login", {mail: userMail, password: userPwd}).then((response) => {
        if (response.data.login) {
            db.query("select distinct LenId, NFToken, UsFName, USSName, NFName, NFInterpret, NFLength, NFYear, concat(date_format(LenStart, '%d %M %Y'),' ', time_format(LenStart, '%H:%i:%s')) as LenDate from TUsers natural join TLendings l natural join TNFTSongs where l.UsMail = (?) and LenEnd is null;",
                [userMail],
                (err, result) => {
                    if (err) {
                        console.log("lendings error: ", err);
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
app.post("/return", (req, res) => { //TESTED
    const LenID = req.body.id;
    const mail = req.body.mail;
    const pwd = req.body.pwd;

    axios.post(domain + "/login", {mail: mail, password: pwd}).then((response) => {
        if (response.data.login) {
            db.query("update TLendings set LenEnd = now() where LenId = (?);",
                [/*user,NFToken,*/LenID],
                (err) => {
                    if (err) {
                        console.log("return error: ", err);
                        res.send({return: false, error: err, message: "Something went wrong. Please try again."})
                    } else {
                        res.send({return: true, LenID: LenID, message: "The NFT songs is successful returned."});
                    }
                });
        } else {
            res.send({return: false, message: "Something went wrong. Please try again."})
        }
    });
}); //TESTED
app.post("/user", (req, res) => { //TESTED
    const mail = req.body.user;
    const pwd = req.body.pwd
    axios.post(domain + "/login", {mail: mail, password: pwd}).then((response) => {
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
app.post("/update", (req, res) => { //TESTED
    const user = req.body.user;
    const pwd_old = sha256(req.body.pwd_old).toString();
    const pwd_new = sha256(req.body.pwd_new).toString();
    const mail = req.body.mail_new;
    db.query("update TUsers set UsMail=(?), UsPasswd=(?) where UsMail=(?) and UsPasswd=(?)",
        [mail, pwd_new, user, pwd_old],
        (err, result) => {
            if (err) {
                console.log("update error: ", Date.now(), ":", err);
                res.send({update: false, error: err})
            } else {
                res.send({update: true, result: result});
            }
        }
    );
}) //
app.post("/nft_search", (req, res) => {
    const search = "%" + req.body.search + "%";
    db.query("select *  from TNFTSongs where NFToken like (?) or NFName like (?) or NFInterpret like (?) or NFYear like (?)", [search,search,search,search], (err, response) => {
        if(err) {
            console.log("search error: ", err);
        } else {
            res.send(response);
        }
    })
});
app.post("/admin/:action", (req, res) => {
    const user = req.body.user;
    const pwd = req.body.pwd;
    const attr = req.body.attributes;
    const action = req.params.action;
    axios.post(domain + "/login", {mail: user, password: pwd}).then((response) => {
        if (response.data.login && response.data.admin) {
            const query = {
                sql: undefined,
                values: []
            }
            switch (action) {
                case "check":
                    query.sql = "select 'true' as admin;"
                    break;
                case "all_users":
                    query.sql = "select * from TUsers;";
                    break;
                case "user":
                    query.sql = "select * from TUsers where UsMail=(?);";
                    query.values = [attr.mail];
                    break;
                case "admin":
                    query.sql = "update TUsers set UsRole='admin' where UsMail=(?);";
                    query.values = [attr.mail]
                    break;
                case "lendings":
                    query.sql = "select * from TLendings order by LenStart desc;";
                    break;
                case "remove_lend":
                    query.sql = "update TLendings set LenEnd = now() where LenId=(?);";
                    query.values = [attr.lenId];
                    break;
                case "nfts":
                    query.sql = "select * from TNFTSongs;";
                    break;
                case "delete_nft":
                    query.sql = "delete from TNFTSongs where NFToken=(?);";
                    query.values = [attr.token]
                    break;
                case "add_nft":
                    let tokenName = "NFT";
                    if(attr.interpret !== null) {
                        if(attr.interpret.length >= 3) {
                            tokenName += attr.interpret.substring(0,3);
                        } else if(attr.interpret.length === 2) {
                            tokenName += attr.interpret.substring(0,2) + "X";
                        } else if(attr.interpret.length === 1) {
                            tokenName += attr.interpret.substring(0,1) + "XY";
                        }
                    } else {
                        tokenName += "UKN" //Unknown
                    }
                    if(attr.name.length >= 3) {
                        tokenName += attr.name.substring(0,3);
                    } else if(attr.name.length === 2) {
                        tokenName += attr.name.substring(0,2) + "X";
                    } else if(attr.name.length === 1 ) {
                        tokenName += attr.name.substring(0,1) + "XY";
                    } else {
                        tokenName += "SPC"; //Space
                    }
                    console.log("Year attribute: ", attr.year);
                    if(attr.year !== undefined) {
                        tokenName += attr.year.substring(2,4);
                    } else {
                        tokenName += 99
                    }
                    tokenName += new Date().getTime().toString().substring(8,13);
                    function tok(tokenN) {
                        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                        db.query("select count(*) as token from TNFTSongs where NFToken = (?)",[tokenN], (err, res) => {
                            //let tokenCopy = tokenN;
                            let letterAtEnd = false;
                            if(res[0].token > 0) {
                                for(let i = 0; i < abc.length && !letterAtEnd; i++) {
                                    if(abc.charAt(i) === tokenN.charAt(15)) {
                                        tokenN = tokenN.substring(0, 15) + abc.charAt(i + 1);
                                        letterAtEnd = true;
                                    }
                                }
                                if(!letterAtEnd) {
                                    tokenN = tokenN.substring(0,15) + abc.charAt(0);
                                    console.log("Changed A " + tokenN);
                                }
                                tok(tokenN);
                            } else {
                                db.query("insert into TNFTSongs (NFToken, NFInterpret, NFName, NFLength, NFYear) values (?, ?, ?, ?, ?)", [tokenN, attr.interpret, attr.name, attr.length, attr.year]);
                            }
                        });
                    }
                    tok(tokenName);
                    res.send("Der Benutzer wurde hinzugefügt.");
                    break;
                case "edit_nft":
                    query.sql="update TNFTSongs set NFInterpret=(?), NFName=(?), NFLength=(?), NFYear=(?) where NFToken=(?);";
                    query.values=[attr.interpret, attr.name, attr.lenght, attr.year, attr.token];
                    break;
                default:
                    res.send("command unknown")
            }
            if (query.sql !== undefined) {
                db.query(query.sql, query.values, (err, result) => {
                    res.send(result);
                    if(err) {
                        console.log("admin-tools error: ", err);
                    }
                })
            }
        } else {
            res.send({admin: false, error: "Pls, send admin verification."})
        }
    })
})
schedule.scheduleJob('0 0 * * *', () => { //runs every 24h at 0:0 // when is a lending expired? extra function!
    db.query("", //TODO (Joscupe) select all lendings which have expired or which have no end date (would be nice if start date = 5 days in the past (if not additions are needed by (MrS-E)))
        (err, result) => {
            if (err) {
                console.log("Schedule error: ", err);
            } else {
                result.forEach((d) => {
                    db.query("", //TODO (Joscupe) update lending with end date -> if deletion additions are needed here by (MrS-E & Joscupe)
                        [d.LenId],
                        (err) => {
                            if (err) {
                                console.log("Schedule error: ", err);
                            }
                        });
                });
            }
        });
});

const listener = app.listen(process.env.PORT || require("./variables").PORT, () => {
    console.log("Server started at port " + listener.address().port);
});

const domain = "http://localhost:" + listener.address().port;