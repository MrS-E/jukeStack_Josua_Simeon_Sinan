import { useState } from "react";
import LOGIN from "./login.js";
import REGISTER from "./register.js";
import NFT from "./nft.js";
import Axios from "axios";

function App() {
  const [user, changeUser] = useState("");
  const [logemail, changeLogemail] = useState("");
  const [logpw, changeLogpw] = useState("");
  const [regfname, changeRegfname] = useState("");
  const [reglname, changeReglname] = useState("");
  const [regemail, changeRegemail] = useState("");
  const [regpw, changeRegpw] = useState("");
  const [page, changepage] = useState("login");

  const adduser = () => {
    Axios.post("http://localhost:3001/create", {
      firstname: regfname,
      lastname: reglname,
      username: regemail,
      password: regpw,
    });
  };

  if (page === "login") {
    return (
      <div className="App">
        <LOGIN changepage={changepage}></LOGIN>
      </div>
    );
  } else if (page === "register") {
    return (
      <div className="App">
        <REGISTER changepage={changepage}></REGISTER>
      </div>
    );
  } else if (page === "nft") {
    return (
      <div className="App">
        <NFT changepage={changepage}></NFT>
      </div>
    );
  }
}

export default App;
