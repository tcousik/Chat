import React from "react";
import ChatList from "../chatlist/chatList";
import ChatView from "../chatview/chatView";
import SendBox from "../sendbox/sendBox";
import styles from "./styles";
import { Button, withStyles } from "@material-ui/core";
const firebase = require("firebase");

class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      friends: [],
      chats: [],
    };
  }

  render() {
    const { classes } = this.props;

    if (this.state.email) {
      return (
        <div className="dashboard-container" id="dashboard-container">
          <ChatList
            history={this.props.history}
            userEmail={this.state.email}
            selectChatFn={this.selectChat}
            chats={this.state.chats}
            selectedChatIndex={this.state.selectedChat}
            newChatBtnFn={this.newChatBtnClicked}
          ></ChatList>
          {this.state.newChatFormVisible ? null : (
            <ChatView
              user={this.state.email}
              chat={this.state.chats[this.state.selectedChat]}
            ></ChatView>
          )}
          {this.state.selectedChat !== null &&
          !this.state.newChatFormVisible ? (
            <SendBox
              messageReadFn={this.messageRead}
              submitMessageFn={this.submitMessage}
            ></SendBox>
          ) : null}

          <Button onClick={this.signOut} className={classes.signOutBtn}>
            Sign Out
          </Button>
        </div>
      );
    } else {
      return <div>LOADING....</div>;
    }
  }

  signOut = () => firebase.auth().signOut();

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectedChat: null });

  newChatSubmit = async (chatObj) => {
    const docKey = this.buildDocKey(chatObj.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        messages: [
          {
            message: chatObj.message,
            sender: this.state.email,
          },
        ],
        users: [this.state.email, chatObj.sendTo],
        receiverHasRead: false,
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_user) => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  messageRead = () => {
    const chatIndex = this.state.selectedChat;
    const docKey = this.buildDocKey(
      this.state.chats[chatIndex].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.receiverClicksChat(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      return null;
    }
  };

  receiverClicksChat = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  componentWillMount = () => {
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) this.props.history.push("/login");
      else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (res) => {
            const chats = res.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats,
              friends: [],
            });
          });
      }
    });
  };
}

export default withStyles(styles)(Dashboard);
