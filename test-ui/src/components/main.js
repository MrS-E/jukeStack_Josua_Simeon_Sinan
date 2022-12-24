import React from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Nav, Navbar, NavLink} from "react-bootstrap";
import User from "./user/user";
import Nft from "./nft/nft";
import Home from "./home/home";

function Main(props) {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                        <Navbar.Toggle aria-controls="navbarScrools" data-bs-target="#navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav>
                                <NavLink as={Link} to="/">Home</NavLink>
                                <NavLink as={Link} to="/user">User</NavLink>
                                <NavLink as={Link} to="/nft">NFT-Songs</NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div className="container">
                    <Routes>
                        <Route path='/user' element={<User user={props.user} domain={props.domain}/>}/>
                        <Route path='/nft' element={<Nft user={props.user} domain={props.domain}/>}/>
                        <Route exact path='/' element={<Home user={props.user} domain={props.domain}/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Main;