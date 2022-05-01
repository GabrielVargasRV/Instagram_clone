import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./styles.css";
import store from "./store.js";

//Pages
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const CompleteInfo = React.lazy(() => import("./pages/CompleteInfo"));
const CreatePost = React.lazy(() => import("./pages/CreatePost"));
const PostPage = React.lazy(() => import("./pages/PostPage"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Inbox = React.lazy(() => import("./pages/Inbox"));
const PostModal = React.lazy(() => import("./components/PostModal"))

import Header from "./components/Header";

//Loading
import Loading from "./components/LoadingInstagram";


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
