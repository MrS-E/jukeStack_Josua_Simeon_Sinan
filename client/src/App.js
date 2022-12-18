import { useState } from "react";
import LOGIN from "./login.js";
import REGISTER from "./register.js";
import NFT from "./nft.js";

function App() {
  const [user, changeUser] = useState("");
  const [logemail, changeLogemail] = useState("");
  const [logpw, changeLogpw] = useState("");
  const [regfname, changeRegfname] = useState("");
  const [reglname, changeReglname] = useState("");
  const [regemail, changeRegemail] = useState("");
  const [regpw, changeRegpw] = useState("");
  const [page, changepage] = useState("login");
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
