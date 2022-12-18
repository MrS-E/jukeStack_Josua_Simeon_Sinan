import React from 'react';
import {BrowserRouter, Link, NavLink, Route, Routes} from 'react-router-dom';
import Login from "./login";
import Register from "./register";
function Start(props) {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <NavLink as={Link} to="/">Login</NavLink>
                    <NavLink as={Link} to="/register">Register</NavLink>
                </div>
                <div className="container">
                    <Routes>
                        <Route path='/register' element={<Register changeUser={props.changeUser} newUser={props.newUser}/>}/>
                        <Route path='/' element={<Login changeUser={props.changeUser} changePasswd={props.changePasswd} newUser={props.newUser}/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Start;
