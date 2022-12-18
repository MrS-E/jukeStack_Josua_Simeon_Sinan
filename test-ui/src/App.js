import axios from "axios";
import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';

function App() {
    const user_ref = useRef();
    const pwd_ref = useRef();
    const sub_ref = useRef();

    const [user, changeUser] = useState("");
    const [passwd, changePasswd] = useState("");
    const [login, changeLogin] = useState(false)

    const [failed, changeFailed] = useState("");
    useEffect(() => {
        console.log(user, passwd)
        axios.post("http://localhost:5000/login", {mail: user, password: passwd}).then(
            (res) => {
                console.log(res);
                changeLogin(res.data.login);
                sub_ref.current.removeAttribute("disabled")
                if(!res.data.login){
                    changeFailed("Wrong password or e-mail.")
                }
            }
        )
    }, [user, passwd])

    const handleClick = () => {
        //console.log(user_ref)
        sub_ref.current.setAttribute("disabled", true)
        changeFailed("");
        changeUser(user_ref.current.value);
        changePasswd(pwd_ref.current.value);
    }

    const mail_reg_ref = useRef();
    const fname_reg_ref = useRef();
    const lname_reg_ref = useRef();
    const pwd_reg_ref = useRef();
    const sub_reg_ref = useRef();
    const [salu, setSalu] = useState("Sir")

    const onOptionChange = e => {
        setSalu(e.target.value)
    }
    const [regData, changerRegData] = useState({});


    useEffect(() => {
        console.log(user, passwd)
        axios.post("http://localhost:5000/register", regData).then(
            (res) => {
                console.log(res);
                if(!res.data.register){
                    changeFailed("Wrong password or e-mail.")
                    sub_reg_ref.current.removeAttribute("disabled")
                }
            }
        )
    }, )
    const handleClick_register = () =>{
        sub_reg_ref.current.setAttribute("disabled", true)
        changerRegData({
            mail: mail_reg_ref.current.value,
            salutation: salu,
            firstName: fname_reg_ref.current.value,
            lastName: lname_reg_ref.current.value,
            password: pwd_reg_ref.current.value
        });
        changeFailed("");
    }

    if (!login) {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <NavLink as={Link} to="/">Login</NavLink>
                        <NavLink as={Link} to="/register">Register</NavLink>
                    </div>
                    <div className="container">
                        <Routes>
                            <Route path='/register' element={
                                <div className="App">
                                    <h1>register:</h1>
                                    <p>salutation</p>
                                    <input name={"sal"} type={"radio"} checked={salu === "Sir"} nChange={onOptionChange}/><span>Sir</span><br/>
                                    <input name={"sal"} type={"radio"} checked={salu === "Madam"} onChange={onOptionChange}/><span>Madam</span><br/>
                                    <p>first name</p>
                                    <input ref={fname_reg_ref} type={"text"}/>
                                    <p>last name</p>
                                    <input ref={lname_reg_ref} type={"text"}/>
                                    <p>mail</p>
                                    <input ref={mail_reg_ref} type={"email"}/>
                                    <p>password</p>
                                    <input ref={pwd_reg_ref} type={"password"}/>
                                    {failed}
                                    <button ref={sub_reg_ref} onClick={handleClick_register}>login</button>
                                </div>
                            }/>
                            <Route path='/' element={
                                <div className="App">
                                    <h1>login:</h1>
                                    <p>mail:</p>
                                    <input ref={user_ref} type={"text"}/>
                                    <p>password:</p>
                                    <input ref={pwd_ref} type={"password"}/>
                                    {failed}
                                    <button onClick={handleClick} ref={sub_ref}>login</button>
                                </div>
                            }/>
                        </Routes>
                    </div>
                </BrowserRouter>
            </div>
        );
    }else{
        return (
            <h1>Login successful</h1>
        );
    }
}

export default App;
