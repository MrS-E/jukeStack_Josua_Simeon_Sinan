import React, {useRef, useState} from 'react';
import Popup from "../popup";
import axios from "axios";
import usePost from "../../hook/usePost";
import {useCookies} from "react-cookie";

function User(props) {
    const domain = props.domain;
    const [cookies, setCookie] = useCookies(['user']);
    const [trigger, changeTrigger] = useState(false);
    const [form, changeForm] = useState();
    const {data, loading} = usePost(domain+"/user", {user: cookies.name, pwd:cookies.pwd})
    const pwd_old=useRef(null);
    const mail_new=useRef(null);
    const pwd_new=useRef(null);

    const changeMail=()=>{
        axios.post(domain+"/update",{
            user: cookies.name,
            pwd_old: pwd_old.current.value,
            pwd_new: pwd_old.current.value,
            mail_new: mail_new.current.value
        }).then((res)=>{
            if(res.data.result.affectedRows<1){
                alert("Something happened that shouldn't happen, nothing was changed. Please check the entered password.")
            }else{
                setCookie('name', mail_new.current.value, { path: '/' });
            }
        })
    }
    const changePwd=()=>{
        axios.post(domain+"/update",{
            user: cookies.name,
            pwd_old: pwd_old.current.value,
            pwd_new: pwd_new.current.value,
            mail_new: cookies.name
        }).then((res)=>{
            if(res.data.result.affectedRows<1){
                alert("Something happened that shouldn't happen, nothing was changed. Please check the entered password.")
            } else{
                setCookie('pwd', pwd_new.current.value, { path: '/' });

            }
        })
    }

    const handleChangePasswd = () =>{
        changeTrigger(true);
        changeForm(
            <div>
                <h3>Change Password</h3>
                <div className="form-group mt-3">
                    <label>Old password:</label>
                    <input
                        type="password"
                        className="form-control mt-1"
                        ref={pwd_old}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>New password:</label>
                    <input
                        type="password"
                        className="form-control mt-1"
                        ref={pwd_new}
                    />
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary" onClick={changePwd}>
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    const  handleChangeMail = () => {
        changeTrigger(true);
        changeForm(
            <div>
                <h3>Change Mail</h3>
                <div className="form-group mt-3">
                    <label>Password:</label>
                    <input
                        type="password"
                        className="form-control mt-1"
                        ref={pwd_old}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>New mail:</label>
                    <input
                        type="email"
                        className="form-control mt-1"
                        placeholder="john.doe@gmail.com"
                        ref={mail_new}
                    />
                </div>
                <div className="form-group mt-3">
                    <button type="submit" className="btn btn-primary" onClick={changeMail}>
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    if(data) {
        return (
        <>
            <div className="row">
                <h1>User</h1>
                <div className="row">
                    <div className="col-2"><p><strong>Salutation:</strong></p></div>
                    <div className="col-10"><p>{data.user.salutation}</p></div>
                </div>
                <div className="row">
                    <div className="col-2"><p><strong>First Name:</strong></p></div>
                    <div className="col-10"><p>{data.user.fname}</p></div>
                </div>
                <div className="row">
                    <div className="col-2"><p><strong>Surname</strong></p></div>
                    <div className="col-10"><p>{data.user.lname}</p></div>
                </div>
                <div className="row">
                    <div className="col-2"><p><strong>Mail</strong></p></div>
                    <div className="col-10"><p>{data.user.mail}</p></div>
                </div>
                <div className="row">
                    <div className="col-3 mt-1">
                        <button className="btn btn-dark" onClick={handleChangePasswd}>Change Password</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 mt-1">
                        <button className="btn btn-dark" onClick={handleChangeMail}>Change E-Mail</button>
                    </div>
                </div>
            </div>
            <div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}>
                    {form}
                </Popup>
            </div>
        </>
        );
    }else if(loading){
        return(
        <div>
            <h1>User is Loading</h1>
        </div>);
    }else{
        return "";
    }
}

export default User;