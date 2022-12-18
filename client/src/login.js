import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/main.css";



function LOGIN(props) {
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
              props.changeLogemail(event.target.value);
            }}
          ></input>
          <br></br>
          <br></br>
          <label for="pword">Password:</label>
          <input
            type="Password"
            id="pword"
            placeholder="Password"
            class="textfield"
            onChange={(event) => {
              props.changeLogpw(event.target.value);
            }}
          ></input>
          <br></br>
          <br></br>
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
