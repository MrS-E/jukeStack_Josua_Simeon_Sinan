import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs, { useState } from "react";
import "./css/main.css";

function namecheck(changeerror) {
  let input = "";
  let regex = /[^a-zA-Z]+$/;

  if (changeerror === "changeerrorfname") {
    input = document.getElementById("fname");
  } else if (changeerror === "changeerrorlname") {
  }

  if (regex.test(input)) {
    console.log("error");
    changeerror("Please enter a valid name");
  } else {
    changeerror("");
  }
}

function emailcheck(input) {
  var regex = /[^0-9]/gi;
  input.value = input.value.replace(regex, "");
}

function pwcheck(input) {
  var regex = /[^0-9]/gi;
  input.value = input.value.replace(regex, "");
}

function REGISTER(props) {
  let [errorfname, changeerrorfname] = useState("");
  let [errorlname, changeerrorlname] = useState("");
  let [erroremail, changeerroremail] = useState("");
  let [errorpw, changeerrorpw] = useState("");
  return (
    <body>
      <title>Register Form</title>
      <link rel="stylesheet" type="text/css" href="css/main.css"></link>
      <br></br>
      <div class="register">
        <h2>Register Page</h2>
        <br></br>

        <form>
          <label for="fname">First Name:</label>
          <br></br>
          <input
            type="text"
            id="fname"
            class="textfield"
            placeholder="Max"
            onChange={(event) => {
              namecheck(changeerrorfname);
              props.changeRegfname(event.target.value);
            }}
          ></input>
          <p>{errorfname}</p>

          <label for="lname">Last Name:</label>
          <br></br>
          <input
            type="text"
            id="lname"
            class="textfield"
            placeholder="Mustermann"
            onChange={(event) => {
              namecheck(event.data.value, changeerrorlname);
              props.changeReglname(event.target.value);
            }}
          ></input>
          <p>{errorlname}</p>

          <label for="email">E-Mail:</label>
          <br></br>
          <input
            type="text"
            id="email"
            class="textfield"
            placeholder="example@gmail.com"
            onChange={(event) => {
              emailcheck(this);
              props.changeRegemail(event.target.value);
            }}
          ></input>
          <p>{erroremail}</p>

          <label for="pword">Password:</label>
          <br></br>
          <input
            type="Password"
            id="pword"
            class="textfield"
            placeholder="Password"
            onChange={(event) => {
              pwcheck(this);
            }}
          ></input>
          <p>{errorpw}</p>

          <label for="rpword">Repeat Password:</label>
          <br></br>
          <input
            type="Password"
            id="rpword"
            class="textfield"
            placeholder="Repeat Password"
            onChange={(event) => {
              pwcheck(this);
            }}
          ></input>
          <p>{erroremail}</p>
          <br></br>
          <input
            type="button"
            id="regsub"
            value="Submit!"
            class="button"
            onClick={() => {
              props.changepage("login");
            }}
          ></input>
        </form>
      </div>
    </body>
  );
}

export default REGISTER;
