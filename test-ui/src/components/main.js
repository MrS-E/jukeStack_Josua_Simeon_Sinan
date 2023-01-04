import React from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Button, Container, Nav, Navbar, NavLink} from "react-bootstrap";
import User from "./user/user";
import Nft from "./nft/nft";
import Home from "./home/home";
import Admin from "./admin/admin";
import {useCookies} from "react-cookie";

function Main(props) {
    const [cookies, setCookie] = useCookies(['user']);
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
                        <Container fluid>
                            <Navbar.Brand>SiSiJo</Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbarScrools" data-bs-target="#navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                                    <NavLink eventKey={0} as={Link} to="/">Home</NavLink>
                                    <NavLink eventKey={1} as={Link} to="/user">User</NavLink>
                                    <NavLink eventKey={2} as={Link} to="/nft">Songs</NavLink>
                                    {props.admin?<NavLink eventKey={3} as={Link} to="/admin">Admin</NavLink>:""}
                                </Nav>
                                <Navbar.Text>
                                    Signed in as {props.user}
                                    <Button variant="outline-success" style={{marginLeft:"2vw"}} onClick={()=>{
                                        setCookie('name', undefined, { path: '/' });
                                        setCookie('pwd', undefined, { path: '/' });
                                        window.location.reload();
                                    }
                                    }>Log out</Button>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </Container>
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