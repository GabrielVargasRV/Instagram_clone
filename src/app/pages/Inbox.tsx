import React, { useState, useEffect,useRef } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase.js";
import Loading from "../components/Loading";

import '../../styles/inbox.css'

import {stateType, userDataType,userType} from "../../utilities/utils"

interface Props {
  userData: userDataType
}

const Inbox: React.FC<Props> = ({ userData }) => {
  const { id } = useParams<any>();
  const dummy = useRef<any | null>(null);
  const [chats, setChats] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [messeges, setMesseges] = useState([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getChats = async () => {
    await db
      .collection("chats")
      .where("usersname", "array-contains", userData.username)
      .orderBy("lastMsgDate","desc")
      .onSnapshot((snapshot:any) => {
        const chatsArr:any = [];
        snapshot.docs.forEach((chat:any) => {
          chat.data().users.forEach((user:userType) => {
            if (user.username !== userData.username) {
              chatsArr.push({
                ...chat.data(),
                id: chat.id,
                profilePhoto: user.photoURL,
                username: user.username,
              });
            }
          });
        });
        setChats(chatsArr);
        if (dummy.current) {
          dummy.current.scrollIntoView({ behavior: "smooth" });
        }
        setIsLoading(false);
      });
  };

  const getChat = async () => {
    const snapshot = await db.collection("chats").doc(id).get();
    snapshot.data().users.forEach((u:userType) => {
      if (u.username !== userData.username) {
        setChatInfo(u);
      }
    });
    await db
      .collection("chats")
      .doc(id)
      .collection("messeges")
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot:any) => {
        const arr:any = [];
        snapshot.docs.forEach((m:any) => {
          arr.push({ id: m.id, ...m.data() });
        });
        setMesseges(arr);
        if (dummy.current) {
          dummy.current.scrollIntoView({ behavior: "smooth" });
        }
      });
  };

  const sendMessege = async (e:any) => {
    e.preventDefault();
    if (text.length) {
      const now = Date.now();
      const obj = {
        text: text,
        createdAt: now,
        username: userData.username,
      };
      await db.collection("chats").doc(id).collection("messeges").add(obj);
      setText("");
      await db
        .collection("chats")
        .doc(id)
        .update({ lastMsg: obj, lastMsgDate: now });
    dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (id) {
      getChat();
    }
    getChats();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="Inbox">
      <Helmet>
        <title>Instagram - Inbox</title>
      </Helmet>
      <div className="chats">
        <div className="chats-header">
          <p>{userData.username}</p>
          <button>
            <i className="fas fa-chevron-down"></i>
          </button>
        </div>
        <div className="chats-container">
          {chats.length ? (
            <div>
              {chats.map((c) => (
                <Link to={`/inbox/${c.id}`} className="chats-item link">
                  <img src={c.profilePhoto} alt="" />
                  <div>
                    <p>{c.username}</p>
                    <p style={{opacity:60+'%'}} >
                      {c.lastMsg
                        ? c.lastMsg.text.length > 25
                          ? `${c.lastMsg.text.substr(0, 25)}...`
                          : c.lastMsg.text
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <div>
        {id ? (
          chatInfo ? (
          <div className="chat">
            <div className="chat-header">
              <img src={chatInfo.photoURL} alt="" />
              <p>{chatInfo.username}</p>
            </div>
            <div className="chat-body">
              <div className="messeges-container">
                {messeges.map((m) => {
                  return (
                    <p
                      className={
                        m.username === userData.username ? "my-msg" : "msg"
                      }
                    >
                      {m.text}
                    </p>
                  );
                })}
                <div ref={dummy} ></div>
              </div>
              <div className="messege-form">
                <form onSubmit={sendMessege}>
                  <textarea
                    name=""
                    placeholder="Messege..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></textarea>
                  <button type="submit">Send</button>
                </form>
              </div>
            </div>
          </div>
          ) : (
            <div>loading...</div>
          )
        ) : (
          <div
            style={{
              width: 100 + "%",
              height: 100 + "%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="fas fa-paper-plane"
              style={{ transform: "scale(3)", margin: 20 + "px" }}
            ></i>
            <p style={{ fontSize: 24 + "px", fontWeight: 100 }}>
              Your Messeges
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state:stateType) => ({
  userData: state.userData,
});

const mapDispatchToProps = (dispatch:any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
