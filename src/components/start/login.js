import React, {useRef} from 'react';

function Login(props) {
    const user = useRef(null);
    const pwd = useRef(null)
    const handelClick = () => {
        props.changeUser(user.current.value);
        props.changePasswd(pwd.current.value);
        props.newUser([false, null])
    }

    return (
        <div>
            <form>
                <input ref={user} type={"text"}/>
                <input ref={pwd} type={"password"}/>
                <button onClick={handelClick}>login</button>
            </form>
        </div>
    );
}

export default Login;