import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import Main from "./components/main";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCookies } from 'react-cookie';

function App() { //TESTED
    const [cookies, setCookie] = useCookies(['user']);
    const domain = "http://192.168.1.107:5000"; //FIXME
    const user_ref = useRef(null);
    const pwd_ref = useRef(null);
    const sub_ref = useRef(null);

    const [noRender, changeNoRender] = useState(false);
    const [user, changeUser] = useState("");
    const [passwd, changePasswd] = useState("");
    const [login, changeLogin] = useState(false);
    const [failed, changeFailed] = useState("");
    const [admin, changeAdmin] = useState(false);

    useEffect(()=>{
        if(cookies.name && cookies.pwd){
            changeNoRender(true);
            changeUser(cookies.name);
            changePasswd(cookies.pwd);
        }
    },[])

    useEffect(() => {
        if (noRender){
            axios.post(domain + "/login", {mail: user, password: passwd}).then(
                (res) => {
                    changeLogin(res.data.login);
                    changeAdmin(res.data.admin);
                    if (!res.data.login) {
                        if (res.data.message){
                            changeFailed(res.data.message);
                        }else{
                            changeFailed("Wrong password or email.")
                        }
                        sub_ref.current.removeAttribute("disabled");
                    }else{
                        setCookie('name', user, { path: '/' });
                        setCookie('pwd', passwd, { path: '/' });
                    }
                })
                .catch();
            changeNoRender(false);
        }
    }, [user, passwd, login])

    const handleClick = () => {
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
                if (!res.data.register) {
                    changeRegFail("Pls try again!");
                    sub_reg_ref.current.removeAttribute("disabled");
                }else{
                   window.location.href=window.location.href.replace("register","");
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
                                                name="sal"
                                                type="radio"
                                                className="form-check-input m-1"                                            checked={salu === "Sir"}
                                                onChange={()=>onOptionChange("Sir")}/>
                                            <span>Sir</span><br/>
                                            <input
                                                name="sal"
                                                type="radio"
                                                className="form-check-input m-1"                                            checked={salu === "Madam"}
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
                            <Route path='*' element={
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
                                            {/*3Forgot <a href="#">password?</a> {/*TODO forget password*/}
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
            <Main user={user} domain={domain} admin={admin}/>
        );
    }
}

export default App;
