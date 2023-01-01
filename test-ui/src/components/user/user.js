import React, {useState} from 'react';
import Popup from "../popup";
import useGet from "../../hook/useGet";

function User(props) {
    const user = props.user
    const domain = props.domain;
    const [trigger, changeTrigger] = useState(false);
    console.log(props.domain)
    const {data, loading, error} = useGet(domain+"/user/?mail="+user);

    if(error) console.log(error);

    const handleChangePasswd = () =>{
        changeTrigger(true);
    };

    const  handleChangeMail = () => {
        changeTrigger(true);
    }

    if(data) {
        return (
            <div className={"row"}>
                <h1>User</h1>
                <div className={"userName"}>
                    <div>
                        <h3>Salutaion</h3>
                        <p>{data.user.salutation}</p>
                    </div>
                    <div>
                        <h3>First Name</h3>
                        <p>{data.user.fname}</p>
                    </div>
                    <div>
                        <h3>Surname</h3>
                        <p>{data.user.lname}</p>
                    </div>
                </div>
                <div>
                    <h3>Mail</h3>
                    <p>{data.user.mail}</p>
                </div>
                <div className="row">
                    <button className="btn-dark" onClick={handleChangePasswd}>Change Password</button>
                    <button className="btn-dark" onClick={handleChangeMail}>Change E-Mail</button>
                </div>
                <div>
                    <Popup trigger={trigger} changeTrigger={changeTrigger}>
                        <div>
                            <h1>Hello</h1> {/*TODO (MrS-E) change form*/}
                        </div>
                    </Popup>
                </div>
            </div>
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