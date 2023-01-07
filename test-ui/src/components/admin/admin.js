import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Accordion from "react-bootstrap/Accordion";

/*CODE NOT IN ACTIVE USE, COMBINES ALL THE LISTS OF ALL 3 ADMIN FRONTEND FILES*/

function Admin(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [users, changeUsers] = useState([])
    const [lendings, changeLend] = useState([])
    const [nfts, changeNFTs] = useState([])

    useEffect( ()=> { //check if user is admin
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
             .then((res_check)=>{
                 changeCheck(res_check.data[0].admin === "true");
                 changeLoading(false)
        })
    },[])

    useEffect(()=>{ //get all data if checked changes -> checked is confirmed
        if(checked){
            axios.post(props.domain+"/admin/all_users", {user:cookies.name, pwd:cookies.pwd,  attributes:{}})
                .then((res_users)=>{ changeUsers(res_users.data)})
            axios.post(props.domain+"/admin/lendings", {user:cookies.name, pwd:cookies.pwd, attributes:{}})
                .then((res_rents)=>{ changeLend(res_rents.data)})
            axios.post(props.domain+"/admin/nfts", {user:cookies.name, pwd:cookies.pwd, attributes:{}})
                .then((res_ntfs)=>{ changeNFTs(res_ntfs.data)})
        }
    }, [checked])

    const userHandler = e => { //onclick handler -> no functionality
        console.log(e.currentTarget.id)
    }

    const lendHandler = e => { //onclick handler -> no functionality
        console.log(e.currentTarget.id)
    }

    const nftHandler = e => { //onclick handler -> no functionality
        console.log(e.currentTarget.id)
    }

    /*HTML OUTPUT*/
    if(checked && !loading) {
        return (
            <div className="mt-4">
                <h3>Admin</h3>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>All users</Accordion.Header>
                        <Accordion.Body>
                            <div className="overflow-auto h-50">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Salutation</th>
                                        <th>fist Name</th>
                                        <th>last Name</th>
                                        <th>Mail</th>
                                        <th>Role</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {users?users.map((d, key)=>{
                                            return(
                                                <tr key={key+d.UsMail} id={d.UsMail} onClick={e=>userHandler(e)}>
                                                    <td>{d.UsSalutation}</td>
                                                    <td>{d.UsFName}</td>
                                                    <td>{d.UsSName}</td>
                                                    <td>{d.UsMail}</td>
                                                    <td>{d.UsRole}</td>
                                                </tr>
                                            );
                                        }):<tr><td colSpan={5}>Loading</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>All rents</Accordion.Header>
                        <Accordion.Body>
                            <div className="overflow-auto h-50">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>user</th>
                                        <th>token</th>
                                        <th>start</th>
                                        <th>end</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {lendings?lendings.map((d, key)=>{
                                        return(
                                            <tr key={key+"_"+d.LenId+"_admin"} id={d.LenId} onClick={e=>lendHandler(e)}>
                                                <td>{d.UsMail}</td>
                                                <td>{d.NFToken}</td>
                                                <td>{d.LenStart}</td>
                                                <td>{d.LenEnd}</td>
                                            </tr>
                                        );
                                    }):<tr><td colSpan={4}>Loading</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>All NFTs</Accordion.Header>
                        <Accordion.Body>
                            <div className="overflow-auto h-50">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Name</th>
                                        <th>Interpret</th>
                                        <th>Length</th>
                                        <th>Year</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {nfts?nfts.map((d, key)=>{
                                        return(
                                            <tr key={key+d.NFToken} id={d.NFToken} onClick={e=>nftHandler(e)}>
                                                <td>{d.NFToken}</td>
                                                <td>{d.NFName}</td>
                                                <td>{d.NFInterpret}</td>
                                                <td>{d.NFLength}</td>
                                                <td>{d.NFYear}</td>
                                            </tr>
                                        );
                                    }):<tr><td colSpan={5}>Loading</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }
    else if(loading){
        return (
            <div className="mt-4">
                <h3>Loading</h3>
            </div>
        )
    }
    else{
        return(
            <div className="mt-4">
                <h3>You are a bit misguided, please go back to the normal sites.</h3>
            </div>
        );
    }
}

export default Admin;