import reactjs from "react";

function REGISTER() {
  return (
    <div>
      <title>Register Form</title>
      <link rel="stylesheet" type="text/css" href="css/register.css"></link>
      <br></br>
      <form>
        <label for="fname">First Name:</label>
        <input type="text" id="fname"></input>
        <br></br>

        <label for="lname">Last Name:</label>
        <input type="text" id="lname"></input>
        <br></br>

        <label for="email">E-Mail:</label>
        <input type="text" id="email"></input>
        <br></br>

        <label for="pword">Password:</label>
        <input type="Password" id="pword"></input>
        <br></br>

        <label for="rpword">Repeat Password:</label>
        <input type="Password" id="rpword"></input>
        <br></br>
        <input type="button" name="regsub" id="button" value="Submit!"></input>
      </form>
    </div>
  );
}

export default REGISTER;
