import React from "react";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import styles from "./styles";
const firebase = require("firebase");

class Signup extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPass: "",
      signupError: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  verifyPass = () => this.state.password === this.state.confirmPass;

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.verifyPass()) {
      this.setState({
        signupError: "Passwords do not match.",
      });
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        (authResponse) => {
          const userObject = {
            email: authResponse.user.email,
          };
          firebase
            .firestore()
            .collection("users")
            .doc(this.state.email)
            .set(userObject)
            .then(
              () => {
                this.props.history.push("/dashboard");
              },
              (databaseError) => {
                console.log(databaseError);
                this.setState({
                  signupError: "Failed to add user",
                });
              }
            );
        },
        (authError) => {
          console.log(authError);
          this.setState({
            signupError: "Failed to add user",
          });
        }
      );
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">
                Create a email
              </InputLabel>
              <Input
                name="email"
                autoFocus
                id="signup-email-input"
                onChange={this.handleChange}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-input">
                Create a password
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="signup-password-input"
                onChange={this.handleChange}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-confirmation-input">
                Confirm your password
              </InputLabel>
              <Input
                name="confirmPass"
                type="password"
                id="signup-password-confirmation-input"
                onChange={this.handleChange}
              ></Input>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
          {this.state.signupError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              {this.state.signupError}
            </Typography>
          ) : null}
          <Typography
            component="h5"
            variant="h6"
            className={classes.hasAccountHeader}
          >
            Returning User?{" "}
            <Link to="/login" className={classes.logInLink}>
              Login
            </Link>
          </Typography>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(Signup);
