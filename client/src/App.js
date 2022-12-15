import { useState } from "react";
import LOGIN from "./login.js";

function App() {
  const [user, changeUser] = useState("");
  const [page, changepage] = useState("");
  if (page === "login.js") {
    return (
      <div className="App">
        <LOGIN changepage={changepage}></LOGIN>
      </div>
    );
  }
  return (
    <div className="App">
      <LOGIN changeUser={changeUser}></LOGIN>
    </div>
  );
}

export default App;
