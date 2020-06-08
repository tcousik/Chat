import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
const firebase = require("firebase");

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loginError: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(
        () => {
          this.props.history.push("/dashboard");
        },
        (loginError) => {
          this.setState({
            loginError: "Server error",
          });
          console.log(loginError);
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
            Log In
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-email-input">
                Enter your email
              </InputLabel>
              <Input
                name="email"
                autoComplete="email"
                autoFocus
                id="login-email-input"
                onChange={this.handleChange}
              ></Input>
            </FormControl>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-password-input">
                Enter your password
              </InputLabel>
              <Input
                name="password"
                type="password"
                id="login-password-input"
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
              Log In
            </Button>
          </form>
          {this.state.loginError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              Incorrect login information
            </Typography>
          ) : null}
          <Typography
            component="h5"
            variant="h6"
            className={classes.noAccountHeader}
          >
            New User?{" "}
            <Link to="/signup" className={classes.signUpLink}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(Login);
