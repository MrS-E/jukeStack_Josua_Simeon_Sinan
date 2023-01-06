import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Popup from "../popup";

function AdminRents(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [lendings, changeLend] = useState([])
    const [checked, changeCheck] = useState(false);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false);
    const [value, changeValue] = useState()
    const search = useRef(null);

    useEffect(()=>{
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
            .then((res_check)=>{
                changeCheck(res_check.data[0].admin === "true");
                if(res_check.data[0].admin==="true"){
                    axios.post(props.domain+"/admin/lendings", {user:cookies.name, pwd:cookies.pwd, attributes:{}})
                         .then((res_rents)=>{
                             changeLend(res_rents.data)
                             changeLoading(false);
                         })
                }else{
                    changeLoading(false);
                }
            })
    }, [])

    const update_data = (typ, value) => {
        switch (typ){
            case "search":
                axios.post(props.domain+"/admin/lendings_search", {user: cookies.name, pwd: cookies.pwd, attributes: {search: value}}).then((res)=>{
                    changeLend(res.data);
                })
                break;
            case "normal":
                axios.post(props.domain + "/admin/lendings", {user: cookies.name, pwd: cookies.pwd}).then((res) => {
                    changeLend(res.data);
                })
                break;
        }
    }
    const deleteLend = (LenID) =>{
        changeTrigger(false);
        axios.post(props.domain+"/admin/remove_lend", {user: cookies.name, pwd: cookies.pwd, attributes: {lenId: LenID}}).then(()=>{
            update_data("normal");
            alert("End of rent set");
        })
    }
    const lendHandler = e =>{
        console.log(e.currentTarget.id);
        let lend = {};
        for (let d of lendings) {
            if (d.LenId.toString() === e.currentTarget.id.toString()) {
                lend = d;
                break;
            }
        }
        changeValue(
            <div>
                <h3>Lending</h3>
                <div className="row">
                    <div className="col-3"><strong>ID:</strong></div>
                    <div className="col-9">{lend.LenId}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>User:</strong></div>
                    <div className="col-9">{lend.UsMail}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>NFT token:</strong></div>
                    <div className="col-9">{lend.NFToken}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>NFT name:</strong></div>
                    <div className="col-9">{lend.NFName}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>NFT interpret:</strong></div>
                    <div className="col-9">{lend.NFInterpret}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Start date:</strong></div>
                    <div className="col-9">{lend.LenDateStart}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>End date:</strong></div>
                    <div className="col-9">{lend.LenDateEnd}</div>
                </div>
                <div className="row">
                    <button className="btn btn-primary m-1" onClick={()=>deleteLend(lend.LenId)}>Delete</button>
                </div>
            </div>
        )
        changeTrigger(true);
    }

    if (checked && !loading) {
    return (
        <>
            <div className="mt-4">
                <h3>Admin lendings history panel</h3>
                <div className="col-12">
                    <input type="text" className="form-control" ref={search} placeholder="Search" onChange={()=>update_data("search", search.current.value)}/>
                </div>
                <div className="row">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>user</th>
                            <th>nft name</th>
                            <th>nft interpret</th>
                            <th>start</th>
                            <th>end</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lendings?lendings.map((d, key)=>{
                            return(
                                <tr key={key+"_"+d.LenId+"_admin"} id={d.LenId} onClick={e=>lendHandler(e)}>
                                    <td>{d.UsMail}</td>
                                    <td>{d.NFName}</td>
                                    <td>{d.NFInterpret}</td>
                                    <td>{d.LenDateStart}</td>
                                    <td>{d.LenDateEnd}</td>
                                </tr>
                            );
                        }):<tr><td colSpan={4}>Loading</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <Popup trigger={trigger} changeTrigger={changeTrigger}>
                {value}
            </Popup>
        </>
    );
    }else if (loading) {
            return (
                <div className="mt-4">
                    <h3>Loading</h3>
                </div>
            )
    }
    else {
        return (
            <div className="mt-4">
                <h3>You are a bit misguided, please go back to the normal sites.</h3>
            </div>
        );
    }
}

export default AdminRents;