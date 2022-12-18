import {useEffect, useState} from "react";
import Start from "./components/start/start";
import usePost from "./components/hooks/usePost";

function App() {
  const [user, changeUser] = useState(""); //TODO (MrS-E) make object/array not singular useStates
  const [passwd, changePasswd] = useState("");
  const [login, changeLogin] = useState(false);

  const [newUser, changeNewUser] = useState([false, null]);
  const [url, changeUrl] = useState("");
  const [data_post, changeDataPost] = useState({})
  const {data, loading, error} = usePost(url, data_post)
  useEffect(()=>{
    if(newUser[0]){
      changeUrl("http://localhost:5000/register");
      changeDataPost(newUser[1]);
    }else{
      changeUrl("http://localhost:5000/login");
      changeDataPost({mail:user, password:passwd, login: login})
    }
  }, [newUser, {mail:user, password:passwd, login: login}])

  if(data){
    console.log(data);
    if(Object.keys(data).includes("login")){
      changeLogin(data.login)
    }
  }
  if(error) console.log(error);

  if(login===false || error) {
    return (
      <div>
        <Start changeUser={changeUser} changePasswd={changePasswd} newUser={changeNewUser}/>
      </div>
    );
  }else if(loading){
    return(
      <h1>Loading...</h1>
    );
  }
  else if(login){
    return(
        <h1>login was successful</h1>
    );
  }
}

export default App;
