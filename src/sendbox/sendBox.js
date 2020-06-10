import React from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class SendBox extends React.Component {
  constructor() {
    super();
    this.state = {
      messageContent: "",
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          id="chatTextBox"
          placeholder="Enter message..."
          onKeyUp={this.userTyping}
          className={classes.chatTextBox}
          onFocus={this.clickedInput}
        ></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  userTyping = (e) => {
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ messageContent: e.target.value });
  };

  validMessage = (text) => text && text.replace(/\s/g, "").length;

  clickedInput = () => {
    this.props.messageReadFn();
  };

  submitMessage = () => {
    if (this.validMessage(this.state.messageContent)) {
      this.props.submitMessageFn(this.state.messageContent);
      document.getElementById("chatTextBox").value = "";
    }
  };
}

export default withStyles(styles)(SendBox);
