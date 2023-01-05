import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/main.css";

/*axios.post("http://localhost:5000/").then((res) => {
  console.log(res);
});*/

function NFT(props) {
  //if button clicked props.changeUser("user")
  return (
    <>
      <div className="owned">
        <header>
          <h1>Lend NFTs</h1>
          <table id="ownedsongs">
            <thead>
              <tr>
                <th>Song name</th>
                <th>Song interpret</th>
                <th>Release date</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </header>
      </div>
      <div className="owned">
        <body>
          <h1>NFTs to lean</h1>
          <table id="leansongs">
            <thead>
              <tr>
                <th>Song name</th>
                <th>Song interpret</th>
                <th>Release date</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </body>
      </div>
    </>
  );
}

export default NFT;
