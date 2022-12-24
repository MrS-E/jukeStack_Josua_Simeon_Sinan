import React, {useState} from 'react';
import Popup from "../popup";
import useGet from "../../hook/useGet";

function User(props) {
    const user = props.user
    const domain = props.domain;
    const [trigger, changeTrigger] = useState(true);
    const {data, loading, error} = useGet(domain+"/user/?"+user);

    const handleChangePasswd = () =>{
        changeTrigger(true);
    };

    const  handleChangeMail = () => {
        changeTrigger(true);
    }

    if(data) {
        return (
            <div>
                <h1>User</h1>
                <div className={"userName"}>
                    <div>
                        <h3> </h3>
                        <p>{data.UsSalutation}</p>
                    </div>
                    <div>
                        <h3>First Name</h3>
                        <p>{data.UsFName}</p>
                    </div>
                    <div>
                        <h3>Surname</h3>
                        <p>{data.UsSName}</p>
                    </div>
                </div>
                <div>
                    <h3>Mail</h3>
                    <p>{data.UsMail}</p>
                </div>
                <div>
                    <button onClick={handleChangePasswd}>Change Password</button>
                    <button onClick={handleChangePasswd}>Change E-Mail</button>
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