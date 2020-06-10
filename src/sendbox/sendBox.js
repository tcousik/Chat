import React from "react";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class SendBox extends React.Component {
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
    console.log("typing");
  };

  clickedInput = () => {
    console.log("clicked input");
  };

  submitMessage = () => {
    console.log("submit");
  };
}

export default withStyles(styles)(SendBox);
