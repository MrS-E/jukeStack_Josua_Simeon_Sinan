import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/main.css";

function createTdEl(content) {
  let elTd = document.createElement("td");
  elTd.textContent = content;
  return elTd;
}

function createRowEl(entries) {
  let elRow = document.createElement("tr");
  for (let entry of entries) {
    elRow.appendChild(createTdEl(entry));
  }
  return elRow;
}

function addline(songname, songinterpret, songrelease, list) {
  let elTBody = document.querySelector(list);
  let elNewRow = createRowEl([songname, songinterpret, songrelease]);
  elTBody.appendChild(elNewRow);
}

function NFT(props) {
  //if button clicked props.changeUser("user")
  return (
    <>
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
    </>
  );
}

export default NFT;
