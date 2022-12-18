import React, {useRef, useState} from 'react';

function Register(props) {
    let url;
    let data_post={};
    const fname = useRef(null);
    const lname = useRef(null);
    const mail = useRef(null);
    const pwd1 = useRef(null);
    const pwd2 = useRef(null);
    const [salu, changeSalu] = useState("Sir");
    let err;
    const handelClick = () => {
        if(pwd1.current.value === pwd2.current.value){
            data_post={
                mail: mail.current.value,
                salutation: salu,
                firstName: fname.current.value,
                lastName: lname.current.value,
                password: pwd1.current.value
            };
            url="https://locallost:5000/register";
            props.newUser([true, data_post]);
        }else{
            err="passwords are not matching";
        }
    }
    return (
        <div>
            <form>
                <div>
                    <input type={"radio"} id={"sir"} value={"Sir"} onClick={()=>changeSalu("Sir")}/>
                    <label htmlFor={"sir"}>Sir</label><br/>
                    <input type={"radio"} id={"madam"} value={"Madam"} onClick={()=>changeSalu("Madam")}/>
                    <label htmlFor={"madam"}>Madam</label><br/>
                </div>
                <label htmlFor={"fname"}>First name:</label><br/>
                <input id={"fname"} ref={fname} type={"text"} maxLength={45}/>
                <label htmlFor={"lname"}>Last name:</label><br/>
                <input id={"lname"} ref={lname} type={"text"} maxLength={45}/>
                <label htmlFor={"mail"}>E-Mail:</label><br/>
                <input id={"mail"} ref={mail} type={"email"} maxLength={45}/>
                <label htmlFor={"passwd"}>Password:</label><br/>
                <input id={"passwd"} ref={pwd1} type={"password"}/>
                <label htmlFor={"passwd2"}>Repeat Password::</label><br/>
                <input id={"passwd2"} ref={pwd2} type={"password"}/>
                {err}
                <button onClick={handelClick}>Register</button>
            </form>
        </div>
    );
}

export default Register;