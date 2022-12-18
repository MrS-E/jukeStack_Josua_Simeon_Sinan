import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs from "react";
import "./css/main.css";

function nonumbers(input){
  var regex = /[^0-9]/gi;
  input.value = input.value.replace(regex,"");
}

function nospecialcharacters(input){
  var regex = /[^0-9]/gi;
  input.value = input.value.replace(regex,"");
}

function noinjectioncharacters(input){
  var regex = /[^0-9]/gi;
  input.value = input.value.replace(regex,"");
}

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
            onChange={(event) => {
              nonumbers(this);
              nospecialcharacters(this);
              noinjectioncharacters(this);
              props.changeRegfname(event.target.value);
            }}
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
            onChange={(event) => {
              nonumbers(this);
              nospecialcharacters(this);
              noinjectioncharacters(this);
              props.changeReglname(event.target.value);
            }}
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
            onChange={(event) => {
              nospecialcharacters(this);
              noinjectioncharacters(this);
              props.changeRegemail(event.target.value);
            }}
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
            onChange={(event) => {
              noinjectioncharacters(this);
            }}
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
            onChange={(event) => {
              noinjectioncharacters(this);
            }}
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
