import React from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

class ChatView extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <h2>Chat view</h2>
      </div>
    );
  }
}

export default withStyles(styles)(ChatView);
