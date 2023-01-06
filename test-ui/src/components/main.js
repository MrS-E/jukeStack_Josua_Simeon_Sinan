import React from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Button, Container, Nav, Navbar, NavDropdown, NavLink} from "react-bootstrap";
import User from "./user/user";
import Nft from "./nft/nft";
import Home from "./home/home";
import Admin from "./admin/admin";
import {useCookies} from "react-cookie";
import AdminUsers from "./admin/admin_users";
import AdminNfts from "./admin/admin_nfts";
import AdminRents from "./admin/admin_rents";
import NFTAll from "./nft/nft_all";
import NFTHistory from "./nft/nft_history";
import NFTRent from "./nft/nft_rent";

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
                                    <NavLink eventKey={2} as={Link} to="/nft/all">Lend Songs</NavLink>
                                    <NavLink eventKey={3} as={Link} to="/nft/history">History</NavLink>
                                    <NavLink eventKey={4} as={Link} to="/nft/rent">Return</NavLink>
                                    {props.admin?<NavDropdown title="Admin">
                                        <NavDropdown.Item eventKey={5} as={Link} to="/admin/users">Users</NavDropdown.Item>
                                        <NavDropdown.Item eventKey={6} as={Link} to="/admin/nfts">NFTs</NavDropdown.Item>
                                        <NavDropdown.Item eventKey={7} as={Link} to="/admin/rents">Rents</NavDropdown.Item>
                                    </NavDropdown>:""}
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
                        <Route path='/nft/all' element={<NFTAll domain={props.domain}/>}/>
                        <Route path='/nft/history' element={<NFTHistory domain={props.domain}/>}/>
                        <Route path='/nft/rent' element={<NFTRent domain={props.domain}/>}/>
                        <Route path='/nft/*' element={<Nft domain={props.domain}/>}/>
                        <Route path='/admin/users' element={<AdminUsers domain={props.domain}/>}/>
                        <Route path='/admin/nfts' element={<AdminNfts domain={props.domain}/>}/>
                        <Route path='/admin/rents' element={<AdminRents domain={props.domain}/>}/>
                        <Route path='/admin/*' element={<Admin domain={props.domain}/>}/>
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