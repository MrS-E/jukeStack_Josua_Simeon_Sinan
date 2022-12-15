import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/login.css";

function LOGIN(props) {
  //if button clicked props.changeUser("user")
  return (
    <body>
      <title>Login Form</title>
      <link rel="stylesheet" type="text/css" href="css/login.css"></link>
      <br></br>
      <div class="login">
        <h2>Login Page</h2>
        <br></br>
        <form>
          <label for="email">E-Mail:</label>
          <br></br>
          <input type="text" id="textfield" placeholder="Username"></input>
          <br></br>
          <br></br>
          <label for="pword">Password:</label>
          <input type="Password" id="textfield" placeholder="Password"></input>
          <br></br>
          <br></br>
          <input
            type="button"
            name="login"
            id="button"
            value="Log In Here"
          ></input>
          <br></br>
          <input
            type="button"
            name="reg"
            id="button"
            value="Register Now"
            as={Link}
            to="/register.js"
          ></input>
        </form>
      </div>
    </body>
  );
}

export default LOGIN;
