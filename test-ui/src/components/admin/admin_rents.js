import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";

function AdminRents(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [lendings, changeLend] = useState([])

    useEffect(()=>{
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
            .then((res_check)=>{
                if(res_check.data[0].admin==="true"){
                    axios.post(props.domain+"/admin/lendings", {user:cookies.name, pwd:cookies.pwd, attributes:{}}) //TODO maybe possible to parse more to nft from server with join to TNFTs
                         .then((res_rents)=>{ changeLend(res_rents.data)})
                }
            })
    }, [])

    return (
        <div className="mt-4">
            <h3>Admin lendings history panel</h3>
            <div className="row">
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
                            <tr key={key+"_"+d.LenId+"_admin"} id={d.LenId}>
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
        </div>

    );
}

export default AdminRents;