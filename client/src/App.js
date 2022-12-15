import { useState } from "react";
import LOGIN from "./login.js";
import REGISTER from "./register.js";

function App() {
  const [user, changeUser] = useState("");
  const [page, changepage] = useState("login");
  if (page === "login") {
    return (
      <div className="App">
        <LOGIN changepage={changepage}></LOGIN>
      </div>
    );
  } else {
    return (
      <div className="App">
        <REGISTER changepage={changepage}></REGISTER>
      </div>
    );
  }
}

export default App;
