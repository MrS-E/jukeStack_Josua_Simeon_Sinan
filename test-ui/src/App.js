import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import Main from "./components/main";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCookies } from 'react-cookie'; //to use cookies


function App() { //TESTED
    const [cookies, setCookie] = useCookies(['user']); //to set and get cookies to 'user'
    const domain = "http://localhost:5000"; //so domain is only once defined
    /*Stuff for login*/
    const user_ref = useRef(null);
    const pwd_ref = useRef(null);
    const sub_ref = useRef(null);

    const [noRender, changeNoRender] = useState(false);
    const [user, changeUser] = useState("");
    const [passwd, changePasswd] = useState("");
    const [login, changeLogin] = useState(false);
    const [failed, changeFailed] = useState("");
    const [admin, changeAdmin] = useState(false);

    useEffect(()=>{ //autologin -> checks if cookies are defined and loges in the user
        if(cookies.name && cookies.pwd){
            changeNoRender(true);
            changeUser(cookies.name);
            changePasswd(cookies.pwd);
        }
    },[])

    useEffect(() => { //login function to authenticate the user
        if (noRender){ //so only a few useEffects go to server
            axios.post(domain + "/login", {mail: user, password: passwd}).then( //gets verification from server
                (res) => {
                    changeLogin(res.data.login); //to login
                    changeAdmin(res.data.admin); //to check if admin -> visible in navbar
                    if (!res.data.login) {
                        if (res.data.message){
                            changeFailed(res.data.message);
                        }else{
                            changeFailed("Wrong password or email.")
                        }
                        sub_ref.current.removeAttribute("disabled"); //to remove the set attribute in login button
                    }else{
                        setCookie('name', user, { path: '/' });
                        setCookie('pwd', passwd, { path: '/' });
                    }
                })
                .catch();
            changeNoRender(false);
        }
    }, [user, passwd, login])

    const handleClick = () => { //function which is triggered by clicking the login button
        sub_ref.current.setAttribute("disabled", true) //sets attribute to login button
        changeFailed("");
        changeUser(user_ref.current.value); //sets values to useState so useEffect is triggered
        changePasswd(pwd_ref.current.value);
        changeNoRender(true) //sets Render to true so useEffect can send request to server
        setTimeout(()=>{sub_ref.current.removeAttribute("disabled")}, 1000) //if no response comes from the server button gets permanent disabled, to prevent this button attribute are removed after 1 second
    }

    /*Stuff for register*/
    const mail_reg_ref = useRef(null); //hooks for register form
    const fname_reg_ref = useRef(null);
    const lname_reg_ref = useRef(null);
    const pwd_reg_ref = useRef(null);
    const sub_reg_ref = useRef(null);
    const [salu, setSalu] = useState("Sir");
    const [regFail, changeRegFail] = useState("")

    const onOptionChange = e => {//function for radio button in register because no possible over useRef hook
        setSalu(e);
    }

    const handleClick_register = () =>{ //function which is triggered by signup button
        const pwd_regex = /^(?:(?:(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]))|(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))|(?:(?=.*[0-9])(?=.*[a-z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|\]))).{8,32}$/ //regex from https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/
        const mail_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //regex from https://emailregex.com/
        //console.log(pwd_regex.test(pwd_reg_ref.current.value))
        changeRegFail(""); //changes failure message to empty string
        sub_reg_ref.current.setAttribute("disabled", true); //sets attribute to signup button
        if(pwd_regex.test(pwd_reg_ref.current.value) || mail_regex.test(mail_reg_ref.current.value)) {
            axios.post(domain + "/register", {
                mail: mail_reg_ref.current.value,
                salutation: salu,
                firstName: fname_reg_ref.current.value===""?"-":fname_reg_ref.current.value,
                lastName: lname_reg_ref.current.value===""?"-":lname_reg_ref.current.value,
                password: pwd_reg_ref.current.value
            })
                .then((res) => {
                    if (!res.data.register) {
                        changeRegFail("Pls try again!");
                        sub_reg_ref.current.removeAttribute("disabled"); //removes disabled attribute in signup button if register was not successful
                    } else {
                        window.location.href = window.location.href.replace("register", ""); //if register was successful sets user to login page
                    }
                })
                .catch();
        }else{
            if(pwd_regex.test(pwd_reg_ref.current.value)){
                changeRegFail("Please check if password matches requirements.");
            }else if(mail_regex.test(mail_reg_ref.current.value)){
                changeRegFail("Please check if mail is defined and is a viable email address.");
            }
            else{
                changeRegFail("Please check if mail is defined and password matches requirements.");
            }
            sub_reg_ref.current.removeAttribute("disabled");
        }
    }

    //html code for not authorized users
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
                                <div className="Auth-form-container container mt-4">
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
                                            <span className="fs-6" >Please use 8 and more letters but less then 50, at least one digit, one lowercase character, one uppercase character, one special character</span>
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
                                <div className="Auth-form-container container mt-4">
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
                                            {/*Forgot <a href="#">password?</a> {/*forgotten password (not in use)*/}
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
    else{ //html code for authorized users
        return (
            <Main user={user} domain={domain} admin={admin}/>
        );
    }
}

export default App;
