import React from "react";
import ChatList from "../chatlist/chatList";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import ChatView from "../chatview/chatView";
import SendBox from "../sendbox/sendBox";
const firebase = require("firebase");

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: [],
    };
  }

  selectChat = (chatIndex) => {
    this.setState({ selectedChat: chatIndex });
  };

  newChatBtnClicked = () => {
    this.setState({
      newChatFormVisible: true,
      selectedChat: null,
    });
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (_user) => {
      if (!_user) {
        this.props.history.push("/login");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _user.email)
          .onSnapshot(async (result) => {
            const chats = result.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _user.email,
              chats: chats,
            });
          });
      }
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ChatList
          selectChatFn={this.selectChat}
          newChatBtnFn={this.newChatBtnClicked}
          chats={this.state.chats}
          userEmail={this.state.email}
          history={this.props.history}
          selectedChatIndex={this.state.selectedChat}
        />
        {this.state.newChatFormVisible ? null : (
          <ChatView
            user={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
            index={this.state.selectedChat}
          />
        )}
        {this.state.selectedChat !== null && !this.state.newChatFormVisible ? (
          <SendBox />
        ) : null}
        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
