import React, {useState} from 'react';
import Popup from "../popup";
import useGet from "../../hook/useGet";

function User(props) {
    const user = props.user
    const domain = props.domain;
    const [trigger, changeTrigger] = useState(true);
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
            <div>
                <h1>User</h1>
                <div className={"userName"}>
                    <div>
                        <h3>Salutaion</h3>
                        <p>{data.user.UsSalutation}</p>
                    </div>
                    <div>
                        <h3>First Name</h3>
                        <p>{data.user.UsFName}</p>
                    </div>
                    <div>
                        <h3>Surname</h3>
                        <p>{data.user.UsSName}</p>
                    </div>
                </div>
                <div>
                    <h3>Mail</h3>
                    <p>{data.user.UsMail}</p>
                </div>
                <div>
                    <button onClick={handleChangePasswd}>Change Password</button>
                    <button onClick={handleChangeMail}>Change E-Mail</button>
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