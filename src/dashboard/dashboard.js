import React from "react";
import ChatList from "../chatlist/chatList";
import { useRadioGroup } from "@material-ui/core";
const firebase = require("firebase");

export default class Dashboard extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      email: null,
      chats: [],
    };
  }

  selectChat = (chatIndex) => {};

  newChatBtnClicked = () => {
    this.setState({
      newChatFormVisible: true,
      selectedChat: null,
    });
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async (_usr) => {
      if (!_usr) {
        this.props.history.push("/login");
      } else {
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", _usr.email)
          .onSnapshot(async (result) => {
            const chats = result.docs.map((_doc) => _doc.data());
            await this.setState({
              email: _usr.email,
              chats: chats,
            });
            console.log(this.state);
          });
      }
    });
  };

  render() {
    return (
      <div>
        <div>Dashboard</div>
        <ChatList
          selectChat={this.selectChat}
          newChatBtn={this.newChatBtnClicked}
          chat={this.state.chats}
          userEmail={this.state.email}
          history={this.props.history}
          selectedChatIndex={this.state.selectedChat}
        />
      </div>
    );
  }
}
