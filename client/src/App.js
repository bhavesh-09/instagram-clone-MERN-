import React, { useEffect, createContext, useReducer,useContext } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import CreatePost from './components/CreatePost'
import UserProfile from './components/UserProfile'
import FollowersPost from './components/FollowersPost'
import ResetPassword  from './components/Reset-Password'
import ChangePassword  from './components/ChangePassword'

import { reducer, initialState } from "./reducers/userReducer"

export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const {state,dispatch}= useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push("/")
    }else{
      if (!history.location.pathname.startsWith('/reset'))
        history.push("/login")
    }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowerspost">
        <FollowersPost />
      </Route>
      <Route exact path="/resetpassword">
        <ResetPassword />
      </Route>
      <Route path="/resetpassword/:token">
        <ChangePassword />
      </Route>
    </Switch>


  )
}


// import logo from './logo.svg';


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />

      </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
