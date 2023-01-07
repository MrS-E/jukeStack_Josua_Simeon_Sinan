import React, {useRef, useState} from 'react';
import Popup from "../popup";
import axios from "axios";
import usePost from "../../hook/usePost";
import {useCookies} from "react-cookie";

function User(props) {
    const domain = props.domain;
    /*hooks for cookies*/
    const [cookies, setCookie] = useCookies(['user']);
    /*hooks for values*/
    const [trigger, changeTrigger] = useState(false);
    const [form, changeForm] = useState();
    /* hook for fetching all userdata*/
    const {data, loading} = usePost(domain+"/user", {user: cookies.name, pwd:cookies.pwd})
    /*hooks for forms*/
    const pwd_old=useRef(null);
    const mail_new=useRef(null);
    const pwd_new=useRef(null);

    const changeMail=()=>{ //function which updates data if mail changes and updates cookies
        changeTrigger(false);
        const mail = mail_new.current.value
        axios.post(domain+"/update",{ //server request to change mail
            user: cookies.name,
            pwd_old: pwd_old.current.value,
            pwd_new: pwd_old.current.value,
            mail_new: mail
        }).then((res)=>{
            if(res.data.result.affectedRows<1){
                alert("Something happened that shouldn't happen, nothing was changed. Please check the entered password.")
            }else{
                alert("Mail changed")
                setCookie('name', mail, { path: '/' }); //function to update cookies
                window.location.reload(); //auto reload of page after change -> changes should be visible
            }
        })
    }
    const changePwd=()=>{ //function to change pwd and update cookies
        changeTrigger(false);
        const pwd = pwd_new.current.value
        axios.post(domain+"/update",{ //server request to change data
            user: cookies.name,
            pwd_old: pwd_old.current.value,
            pwd_new: pwd,
            mail_new: cookies.name
        }).then((res)=>{
            if(res.data.result.affectedRows<1){
                alert("Something happened that shouldn't happen, nothing was changed. Please check the entered password.")
            }else{
                alert("Password changes")
                setCookie('pwd', pwd, { path: '/' }) //function to update cookies
            }
        })
    }
    const handleChangePasswd = () =>{ //to handle onclick on button 'change password'
        changeTrigger(true); //set popup visible
        changeForm( //sets dom children of popup
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
    const handleChangeMail = () => { //function to handle onclick of button 'change mail' (similar like handleChangePasswd)
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
    const handleDeleteUser = () =>{ //function to handle 'delete user'
        if (window.confirm("Are you sure you want to leave us, you CAN'T come back") === true) { //confirm popup to be secure from misclicks
            axios.post(props.domain + "/remove_user", {user: cookies.name, pwd: cookies.pwd}).then((res) => {
                setCookie('name', undefined, {path: '/'}); //logout + popup + reload
                setCookie('pwd', undefined, {path: '/'});
                alert(res.data);
                window.location.reload();
            })
        }else{
            alert("Yeah ヽ(´▽`)/") //nice message if user doesn't delete account
        }
    }

    if(data) {
        /*HTML TEXT*/
        return (
        <div className="mt-4">
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
                <div className="row">
                    <div className="col-3 mt-1">
                        <button className="btn btn-dark" onClick={handleDeleteUser}>Delete Account</button>
                    </div>
                </div>
            </div>
            <div>
                <Popup trigger={trigger} changeTrigger={changeTrigger}> {/*popup component with parsed value as children*/}
                    {form}
                </Popup>
            </div>
        </div>
        );
    }else if(loading){ //loading message
        return(
        <div className="mt-4">
            <h1>User is Loading</h1>
        </div>);
    }else{
        return "";
    }
}

export default User;