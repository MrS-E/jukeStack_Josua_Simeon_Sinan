import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import Main from "./components/main";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() { //TESTED
    const domain = "http://localhost:5000";
    const user_ref = useRef(null);
    const pwd_ref = useRef(null);
    const sub_ref = useRef(null);

    const [noRender, changeNoRender] = useState(false);
    const [user, changeUser] = useState("");
    const [passwd, changePasswd] = useState(""); //TODO evtl. hash before server...
    const [login, changeLogin] = useState(false);
    const [failed, changeFailed] = useState("");

    useEffect(() => {
        if (noRender){
            axios.post(domain + "/login", {mail: user, password: passwd}).then(
                (res) => {
                    console.log(res);
                    changeLogin(res.data.login);
                    if (!res.data.login) {
                        changeFailed("Wrong password or e-mail.");
                        sub_ref.current.removeAttribute("disabled");
                    }
                })
                .catch();
            changeNoRender(false);
        }
    }, [user, passwd, login, noRender])

    const handleClick = () => {
        console.log("login")
        sub_ref.current.setAttribute("disabled", true)
        changeFailed("");
        changeUser(user_ref.current.value);
        changePasswd(pwd_ref.current.value);
        changeNoRender(true)
    }

    const mail_reg_ref = useRef(null);
    const fname_reg_ref = useRef(null);
    const lname_reg_ref = useRef(null);
    const pwd_reg_ref = useRef(null);
    const sub_reg_ref = useRef(null);
    const [salu, setSalu] = useState("Sir");
    const [regFail, changeRegFail] = useState("")

    const onOptionChange = e => {
        setSalu(e);
    }

    const handleClick_register = () =>{
        console.log("register");
        changeRegFail("");
        sub_reg_ref.current.setAttribute("disabled", true);
        axios.post(domain+"/register", {
            mail: mail_reg_ref.current.value,
            salutation: salu,
            firstName: fname_reg_ref.current.value,
            lastName: lname_reg_ref.current.value,
            password: pwd_reg_ref.current.value //TODO evtl. hash before server...
        })
            .then((res) => {
                console.log("send");
                console.log(res);
                if (!res.data.register) {
                    changeRegFail("Pls try again!");
                    sub_reg_ref.current.removeAttribute("disabled");
                }
            })
            .catch();
    }

    if (!login) { //TESTED
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                            <Navbar.Toggle aria-controls="navbarScrools" data-bs-target="#navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav>
                                    <NavLink eventKey={1} as={Link} to="/">Login</NavLink>
                                    <NavLink eventKey={2} as={Link} to="/register">Register</NavLink>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                    <div className="container">
                        <Routes>
                            <Route path='/register' element={
                                <div className="Auth-form-container container">
                                    <div className="Auth-form-content">
                                        <h3 className="Auth-form-title">Sign Up</h3>
                                        <div className="form-group mt-3">
                                            <label>Salutation</label><br/>
                                            <input
                                                name={"sal"}
                                                type={"radio"}
                                                className="form-check-input mt-1"                                            checked={salu === "Sir"}
                                                onChange={()=>onOptionChange("Sir")}/>
                                            <span>Sir</span><br/>
                                            <input
                                                name={"sal"}
                                                type={"radio"}
                                                className="form-check-input mt-1"                                            checked={salu === "Madam"}
                                                onChange={()=>onOptionChange("Madam")}/>
                                            <span>Madam</span><br/>
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>First name</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="John"
                                                ref={fname_reg_ref}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Surname</label>
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Doe"
                                                ref={lname_reg_ref}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Email address</label>
                                            <input
                                                type="email"
                                                className="form-control mt-1"
                                                placeholder="Enter email"
                                                ref={mail_reg_ref}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                ref={pwd_reg_ref}
                                                className="form-control mt-1"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                        <div className="d-grid gap-2 mt-3">
                                            <button
                                                type="submit"
                                                ref={sub_reg_ref}
                                                className="btn btn-primary"
                                                onClick={handleClick_register}>
                                                Submit
                                            </button>
                                        </div>
                                        <span className="text-right text-danger mt-2">{regFail}</span>
                                    </div>
                                </div>
                            }/>
                            <Route path='/' element={
                                <div className="Auth-form-container container">
                                    <div className="Auth-form-content">
                                        <h3 className="Auth-form-title">Sign In</h3>
                                        <div className="form-group mt-3">
                                            <label>Email address</label>
                                            <input
                                                type="email"
                                                className="form-control mt-1"
                                                placeholder="Enter email"
                                                ref={user_ref}
                                            />
                                        </div>
                                        <div className="form-group mt-3">
                                            <label>Password</label>
                                            <input
                                                type="password"
                                                ref={pwd_ref}
                                                className="form-control mt-1"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                        <div className="d-grid gap-2 mt-3">
                                            <button type="submit" ref={sub_ref} className="btn btn-primary" onClick={handleClick}>
                                                Submit
                                            </button>
                                        </div>
                                        <span className="text-right text-danger mt-2">{failed}</span>
                                        <p className="forgot-password text-right mt-2">
                                            Forgot <a href="#">password?</a>
                                        </p>
                                    </div>
                                </div>
                            }/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
    else{
        return (
            <Main user={user} domain={domain}/>
        );
    }
}

export default App;
