import { useState } from "react";
import LOGIN from "./login.js";

function App() {
  const [user, changeUser] = useState("");
  const [page, changepage] = useState("login");
  if (page === "login") {
    return (
      <div className="App">
        <LOGIN changepage={changepage}></LOGIN>
      </div>
    );
  }else {
    return (
        <div className="App">
         hey
        </div>
    );
  }
}

export default App;
