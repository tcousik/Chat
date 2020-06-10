import React from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Paper,
  withStyles,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import styles from "./styles";
const firebase = require("firebase");

class NewChat extends React.Component {
  constructor() {
    super();
    this.state = {
      friend: null,
      message: null,
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Send a message.
          </Typography>
          <form className={classes.form} onSubmit={this.submitNewChat}>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-username">
                Enter Your Friend's Email
              </InputLabel>
              <Input
                name="friend"
                required
                className={classes.input}
                autoFocus
                onChange={this.handleChange}
                id="new-chat-username"
              ></Input>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-message">
                Enter Your Message
              </InputLabel>
              <Input
                required
                name="message"
                className={classes.input}
                onChange={this.handleChange}
                id="new-chat-message"
              ></Input>
            </FormControl>
          </form>
        </Paper>
      </main>
    );
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitNewChat = async (e) => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
  };

  buildDocKey = () =>
    [firebase.auth().currentUser.email, this.state.friend].sort().join(":");

  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();
    return chat.exists;
  };
  userExists = async () => {
    const usersSnapshot = await firebase.firestore().collection("users").get();
    const exists = usersSnapshot.docs
      .map((_doc) => _doc.data().email)
      .includes(this.state.username);
    this.setState({ serverError: !exists });
    return exists;
  };
}

export default withStyles(styles)(NewChat);
