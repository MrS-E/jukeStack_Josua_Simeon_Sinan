import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useCookies} from "react-cookie";
import Popup from "../popup";

function AdminUsers(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const [checked, changeCheck] = useState(false);
    const [value, changeValue] = useState();
    const [users, changeUsers] = useState([]);
    const [loading, changeLoading] = useState(true);
    const [trigger, changeTrigger] = useState(false)
    const search = useRef(null);

    useEffect(() => {
        axios.post(props.domain + "/admin/check", {user: cookies.name, pwd: cookies.pwd, attributes: {}})
            .then((res_check) => {
                changeCheck(res_check.data[0].admin === "true");
                if (res_check.data[0].admin === "true") {
                    axios.post(props.domain + "/admin/all_users", {
                        user: cookies.name,
                        pwd: cookies.pwd
                    }).then((res) => {
                        changeUsers(res.data);
                        changeLoading(false);
                    })
                } else {
                    changeLoading(false)
                }
            })
    }, [])

    const update_data = (typ, value) =>{
        switch (typ){
            case "search":
                axios.post(props.domain+"/admin/user_search", {user: cookies.name, pwd: cookies.pwd, attributes: {search: value}}).then((res)=>{
                    changeUsers(res.data);
                })
                break;
            case "normal":
                axios.post(props.domain + "/admin/all_users", {user: cookies.name, pwd: cookies.pwd}).then((res) => {
                    changeUsers(res.data);
                })
                break;
        }
    }
    const deleteUser = mail =>{
        if (window.confirm("Do you really want to delete this user. He can't visit the site again... ヽ༼ ಠ益ಠ ༽ﾉ") === true) {
            changeTrigger(false)
            axios.post(props.domain + "/admin/remove_user", {
                user: cookies.name,
                pwd: cookies.pwd,
                attributes: {usMail: mail}
            }).then(() => {
                update_data("normal");
                alert("user " + mail + " deleted");
            })
        }else{
            alert("Deletion was stopped ☜(⌒▽⌒)☞")
        }
    }
    const editAdminStatus = (role, mail) => {
        changeTrigger(false)
        if(role==="admin"){
            axios.post(props.domain+"/admin/remove_admin", {user: cookies.name, pwd: cookies.pwd, attributes: {usMail: mail}}).then(()=>{
                alert("User status of user "+mail+" updates to role")
                update_data("normal")
            })
        }else{
            axios.post(props.domain+"/admin/appoint_admin", {user: cookies.name, pwd: cookies.pwd, attributes: {usMail: mail}}).then(()=>{
                alert("User status of user "+mail+" updates to admin")
                update_data("normal")
            })
        }
    }
    const userHandler = e =>{
        let user = {};
        for (let d of users) {
            if (d.UsMail === e.currentTarget.id) {
                user = d;
                break;
            }
        }
        changeValue(
            <div>
                <h3>User</h3>
                <div className="row">
                    <div className="col-3"><strong>Salutation:</strong></div>
                    <div className="col-9">{user.UsSalutation}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Fist name:</strong></div>
                    <div className="col-9">{user.UsFName}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Last name:</strong></div>
                    <div className="col-9">{user.UsSName}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Email:</strong></div>
                    <div className="col-9">{user.UsMail}</div>
                </div>
                <div className="row">
                    <div className="col-3"><strong>Role:</strong></div>
                    <div className="col-9">{user.UsRole}</div>
                </div>
                <div className="row">
                    <button className="btn btn-primary m-1" onClick={()=>deleteUser(user.UsMail)}>Delete</button>
                    <button className="btn btn-primary m-1" onClick={()=>editAdminStatus(user.UsRole, user.UsMail)}>Edit admin status</button>
                </div>
            </div>
        )
        changeTrigger(true);
    }

    if (checked && !loading) {
        return (
            <>
                <div className="mt-4">
                    <h3>Admin user panel</h3>
                    <div className="row">
                        {/*<div className="col-2">
                            <button className="btn btn-outline-info" onClick={}>Add Users</button>
                        </div>
                        <div className="col-2"></div>*/}
                        <div className="col-12">
                            <input type="text" className="form-control" ref={search} placeholder="Search" onChange={()=>update_data("search", search.current.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Salutation</th>
                                    <th>First name</th>
                                    <th>Last name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users ? users.map((d, key) => {
                                    return (
                                        <tr key={key+d.UsMail} id={d.UsMail} onClick={e=>userHandler(e)}>
                                            <td>{d.UsSalutation}</td>
                                            <td>{d.UsFName}</td>
                                            <td>{d.UsSName}</td>
                                            <td>{d.UsMail}</td>
                                            <td>{d.UsRole}</td>
                                        </tr>
                                    );
                                }) : <tr>
                                    <td colSpan={5}>Loading</td>
                                </tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}>
                    {value}
                </Popup>
            </>
        );
    }
    else if (loading) {
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

export default AdminUsers;