import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs, { useState } from "react";
import "./css/main.css";

function charactercheck(changeerror, input, type) {
  let regexemail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  let regexpw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,64}$/;

  if (!regexemail.test(input) && type === "username") {
    changeerror("Please enter a username");
  } else if (!regexpw.test(input) && type === "pw") {
    changeerror(
      "Please enter a password with 8-64 characters upper and lower case letters, numbers and special characters"
    );
  } else {
    changeerror("");
  }
}

function LOGIN(props) {
  let [errorusername, changeerrorusername] = useState(" ");
  let [errorpw, changeerrorpw] = useState(" ");
  //if button clicked props.changeUser("user")
  return (
    <body>
      <title>Login Form</title>
      <link rel="stylesheet" type="text/css" href="css/main.css"></link>
      <br></br>
      <div class="login">
        <h2>Login Page</h2>
        <br></br>

        <form>
          <label for="email">E-Mail:</label>
          <br></br>
          <input
            type="text"
            id="email"
            placeholder="Username"
            class="textfield"
            onChange={(event) => {
              charactercheck(
                changeerrorusername,
                event.target.value,
                "username"
              );
              props.changeLogemail(event.target.value);
            }}
          ></input>

          <p>{errorusername}</p>

          <label for="pword">Password:</label>
          <input
            type="Password"
            id="pword"
            placeholder="Password"
            class="textfield"
            onChange={(event) => {
              charactercheck(changeerrorpw, event.target.value, "pw");
              props.changeLogpw(event.target.value);
            }}
          ></input>

          <p>{errorpw}</p>

          <input
            type="button"
            id="login"
            value="Log In"
            class="button"
            onClick={() => {
              props.changepage("nft");
            }}
          ></input>
          <br></br>
          <input
            type="button"
            id="reg"
            value="Register Now"
            class="button"
            onClick={() => {
              props.changepage("register");
            }}
          ></input>
        </form>
      </div>
    </body>
  );
}

export default LOGIN;
