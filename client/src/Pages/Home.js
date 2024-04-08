import { useState, useEffect, useMemo, useContext } from "react";
import { useRef } from "react";
import { io } from "socket.io-client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { OutlinedInput, Button, Typography, Box, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { UserContext } from "./UserContext";
import Header from "./Header";

function Home() {
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState([]);
  const { userInfo } = useContext(UserContext);
  const [initialChat, setInitialChat] = useState(false);
  const chatContainerRef = useRef(null);
  const username = userInfo?.username;
  const socket = useMemo(
    () =>
      io("http://localhost:4000", {
        withCredentials: true,
      }),
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (payload) => {
      setMessages([...messages, payload]);
      scrollToBottom();
    });

    return () => {
      socket.off("receive-message");
    };
  }, [messages]);

  useEffect(() => {
    if (!initialChat) {
      socket.emit("get-previous-data");
      setInitialChat(true);
    }
    socket.on("prev-chat-history", (prevChat) => {
      setMessages(prevChat);
      scrollToBottom(); // Scroll to bottom when previous chat history is received
    });
    return () => {
      socket.off("prev-chat-history");
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const messageHandler = (e) => {
    e.preventDefault();
    console.log(message);
    if (!username) {
      alert(`please login to send message`);
      return;
    }
    if (message) socket.emit("send-message", { message, username });
    setMessage("");
  };

  return (
    <div>
      <Header />
      <Box
        ref={chatContainerRef}
        sx={{
          height: "80vh",
          width: "90vw",
          maxWidth: "90vw",
          backgroundColor: "transparent",
          paddingLeft: "5px",
          margin: "auto",
          border: "2px solid black",
          borderRadius: "5px",
          paddingRight: "5px",
          overflow: "hidden",
          overflowY: "scroll",
          backgroundColor: "#d3dfe8",
        }}
      >
        {
          <Stack>
            {messages.map((payload, index) => {
              if (payload.message) {
                return (
                  <div
                    key={index}
                    className={
                      payload.author === username
                        ? "my-message"
                        : "other-message"
                    }
                  >
                    <Typography className="ownerInfo">
                      {payload.author === username
                        ? "~ you"
                        : "~ " + payload.author}
                    </Typography>
                    <Typography className="msgContent">
                      {payload.message}
                    </Typography>
                    <p
                      style={{
                        fontSize: "10px",
                        margin: "0px",
                        textAlign: "right",
                      }}
                    >
                      {payload.createdAt}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </Stack>
        }
      </Box>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <form onSubmit={messageHandler} className="form">
          <OutlinedInput
            placeholder="send message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "300px", marginRight: "20px" }}
          />
          <Button variant="contained" color="primary" type="submit">
            Send{" "}
            <SendIcon
              fontSize="small"
              sx={{ marginLeft: "10px", marginTop: "-5px" }}
            />
          </Button>
        </form>
      </div>
      <Outlet />
    </div>
  );
}

export default Home;
