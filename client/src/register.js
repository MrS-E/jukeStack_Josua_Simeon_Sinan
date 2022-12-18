import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/main.css";

function REGISTER(props) {
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
          ></input>
          <br></br>
          <br></br>

          <label for="lname">Last Name:</label>
          <br></br>
          <input
            type="text"
            id="lname"
            class="textfield"
            placeholder="Mustermann"
          ></input>
          <br></br>
          <br></br>

          <label for="email">E-Mail:</label>
          <br></br>
          <input
            type="text"
            id="email"
            class="textfield"
            placeholder="example@gmail.com"
          ></input>
          <br></br>
          <br></br>

          <label for="pword">Password:</label>
          <br></br>
          <input
            type="Password"
            id="pword"
            class="textfield"
            placeholder="Password"
          ></input>
          <br></br>
          <br></br>

          <label for="rpword">Repeat Password:</label>
          <br></br>
          <input
            type="Password"
            id="rpword"
            class="textfield"
            placeholder="Repeat Password"
          ></input>
          <br></br>
          <br></br>
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
