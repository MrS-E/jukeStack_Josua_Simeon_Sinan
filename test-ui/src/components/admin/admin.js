import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Accordion from "react-bootstrap/Accordion";

function Admin(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [users, changeUsers] = useState([])
    const [lendings, changeLend] = useState([])
    const [nfts, changeNFTs] = useState([])

    useEffect( ()=> {
        axios.post(props.domain + "/admin", {user: cookies.name, pwd: cookies.pwd, command: "check", attributes: {}})
             .then((res_check)=>{
                 changeCheck(res_check.data.result[0].admin)
                if(res_check.data.result[0].admin){
                    axios.post(props.domain+"/admin", {user:cookies.name, pwd:cookies.pwd, command:"all_user", attributes:{}})
                         .then((res_users)=>{ changeUsers(res_users.data.result)})
                    axios.post(props.domain+"/admin", {user:cookies.name, pwd:cookies.pwd, command:"lending", attributes:{}})
                         .then((res_rents)=>{ changeLend(res_rents.data.result)})
                    axios.post(props.domain+"/admin", {user:cookies.name, pwd:cookies.pwd, command:"all_ntfs", attributes:{}})
                         .then((res_ntfs)=>{ changeNFTs(res_ntfs.data.results)})
                }
        })
    },[])

    const userHandler = e => {
        console.log(e.currentTarget.id)
    }

    const lendHandler = e => {
        console.log(e.currentTarget.id)
    }

    const nftHandler = e => {
        console.log(e.currentTarget.id)
    }

    if(checked) {
        return (
            <div>
                <h3>Admin</h3>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
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
                                        {users.map((d, key)=>{
                                            return(
                                                <tr key={key+d.UsMail} id={d.UsMail} onClick={e=>userHandler(e)}>
                                                    <td>{d.UsSalutation}</td>
                                                    <td>{d.UsFName}</td>
                                                    <td>{d.UsSName}</td>
                                                    <td>{d.UsMail}</td>
                                                    <td>{d.UsRole}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>All rents</Accordion.Header>
                        <Accordion.Body>
                            <div className="overflow-auto h-50">
                                <table className="table table-hover">
                                    <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>user</th>
                                        <th>token</th>
                                        <th>start</th>
                                        <th>end</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {lendings.map((d, key)=>{
                                        return(
                                            <tr key={key+d.LenId} id={d.LenId} onClick={e=>lendHandler(e)}>
                                                <td>{d.LenId}</td>
                                                <td>{d.UsMail}</td>
                                                <td>{d.NFToken}</td>
                                                <td>{d.LenStart}</td>
                                                <td>{d.LenEnd}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
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
                                    {nfts.map((d, key)=>{
                                        return(
                                            <tr key={key+d.NFToken} id={d.NFToken} onClick={e=>nftHandler(e)}>
                                                <td>{d.NFToken}</td>
                                                <td>{d.NFName}</td>
                                                <td>{d.NFInterpret}</td>
                                                <td>{d.NFLength}</td>
                                                <td>{d.NFYear}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }else{
        return(
            <div>
                <h3>You are a bit misguided, please go back to the normal sites.</h3>
            </div>
        );
    }
}

export default Admin;