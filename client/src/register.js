import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import reactjs, { useState } from "react";
import "./css/main.css";

function charactercheck(changeerror, input, type) {
  let regexname = /[^a-zA-Z]/;
  let regexemail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  let regexpw =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,64}$/;

  if (regexname.test(input) && type === "name") {
    changeerror("Please enter a valid name");
  } else if (!regexemail.test(input) && type === "email") {
    changeerror("Please enter a valid email-adress");
  } else if (!regexpw.test(input) && type === "pw") {
    changeerror(
      "Please enter a password with 8-64 characters upper and lower case letters, numbers and special characters"
    );
  } else {
    changeerror("");
  }
}

function submitcheck(
  errorfname,
  errorlname,
  erroremail,
  errorpw,
  errorpwrep,
  changepage,
  changeerror,
  changeRegpw,
  adduser
) {
  let pw = document.getElementById("pword").value;
  let pwrep = document.getElementById("rpword").value;

  if (pw === pwrep) {
    if (
      errorfname === "" &&
      errorlname === "" &&
      erroremail === "" &&
      errorpw === "" &&
      errorpwrep === ""
    ) {
      changepage("login");
      changeRegpw(pw);
      adduser();
    }
  } else {
    changeerror("Password doesn't match with first Password");
  }
}

function REGISTER(props) {
  let [errorfname, changeerrorfname] = useState(" ");
  let [errorlname, changeerrorlname] = useState(" ");
  let [erroremail, changeerroremail] = useState(" ");
  let [errorpw, changeerrorpw] = useState(" ");
  let [errorpwrep, changeerrorpwrep] = useState(" ");
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
              charactercheck(changeerrorfname, event.target.value, "name");
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
              charactercheck(changeerrorlname, event.target.value, "name");
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
              charactercheck(changeerroremail, event.target.value, "email");
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
              charactercheck(changeerrorpw, event.target.value, "pw");
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
              charactercheck(changeerrorpwrep, event.target.value, "pw");
            }}
          ></input>
          <p>{errorpwrep}</p>
          <br></br>
          <input
            type="button"
            id="regsub"
            value="Submit!"
            class="button"
            onClick={() => {
              submitcheck(
                errorfname,
                errorlname,
                erroremail,
                errorpw,
                errorpwrep,
                props.changepage,
                changeerrorpwrep,
                props.changeRegpw,
                props.adduser
              );
            }}
          ></input>
          <input
            type="button"
            id="back"
            value="Back to Login"
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
