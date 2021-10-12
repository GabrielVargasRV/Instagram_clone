import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles.css";
import store from "./store.js";

//Pages
const Home = React.lazy(() => import("./app/pages/Home"));
const Login = React.lazy(() => import("./app/pages/Login"));
const CompleteInfo = React.lazy(() => import("./app/pages/CompleteInfo"));
const CreatePost = React.lazy(() => import("./app/pages/CreatePost"));
const PostPage = React.lazy(() => import("./app/pages/PostPage"));
const Profile = React.lazy(() => import("./app/pages/Profile"));
const Inbox = React.lazy(() => import("./app/pages/Inbox"));
const PostModal = React.lazy(() => import("./app/components/Post-Modal"))

import Header from "./app/components/Header";

//Loading
import Loading from "./app/components/Loading";


const App: React.FC = () => {

  return (
    <Router>
      <Provider store={store} >
        <React.Suspense fallback={<Loading />}>
          <PostModal />
          <Header />
          <Route exact path="/" >
            <Login />
          </Route>
          <Route exact path="/post/:id" >
            <PostPage />
          </Route>
          <Route exact path="/profile/:username" >
            <Profile />
          </Route>
          <Route exact path="/home" >
            <Home />
          </Route>
          <Route exact path="/com-info" >
            <CompleteInfo />
          </Route>
          <Route exact path="/create-post" >
            <CreatePost />
          </Route>
          <Route exact path="/inbox" >
            <Inbox />
          </Route>
          <Route exact path="/inbox/:id" >
            <Inbox />
          </Route>
        </React.Suspense>
      </Provider>
    </Router>
  );
};

export default App;
