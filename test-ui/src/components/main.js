import React, {useState} from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import User from "./user/user";
import Nft from "./nft/nft";
import Home from "./home/home";
import Admin from "./admin/admin";

function Main(props) {
    const [navlink, changeNavlink] = useState("");
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                        <Navbar.Toggle aria-controls="navbarScrools" data-bs-target="#navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav>
                                <NavLink eventKey={1} as={Link} to="/">Home</NavLink>
                                <NavLink eventKey={2} as={Link} to="/user">User</NavLink>
                                <NavLink eventKey={3} as={Link} to="/nft">NFT-Songs</NavLink>
                                {navlink}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className="container">
                    <Routes>
                        <Route path='/user' element={<User domain={props.domain}/>}/>
                        <Route path='/nft' element={<Nft domain={props.domain}/>}/>
                        <Route path='/admin' element={<Admin domain={props.domain}/>}/>
                        <Route exact path='/' element={<Home domain={props.domain}/>}/>
                        <Route path='*' element={
                           <div className="row">
                               <h1>404 Not Found</h1>
                               <p>Please use only the official webpages</p>
                           </div>
                        }/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Main;