import './App.css';
import CheckHeader from './header/CheckHeader'
import Header from './header/Header.tsx';
import LoginLanding from './loginLanding/LoginLanding';
import LoginLandingForHelp from './loginLanding/LoginLandingForHelp.jsx';
import Task from './task/Task.tsx';
import Login from './login/Login.tsx'
import Register from './login/Register.tsx'
import Forgot from './login/Forgot.tsx'
import TradesmanList from './tradesmanList/TradesmanList.jsx';
import TradesmanProfile from './tradesmanProfile/TradesmanProfile.tsx';
import TaskList from './taskList/TaskList.tsx';
import PageNotFound from "./404Page";

import "bootstrap-icons/font/bootstrap-icons.css";
import useLocalStorage from 'use-local-storage';
import React, { useCallback } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";


import { ITask } from './task/Task.tsx'

export const api = axios.create({
  baseURL: 'http://tarefaconnect.doc.ic.ac.uk/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

interface UserData {
  email: string,
  forename: string,
  surname: string,
  id: number,
  hashed_password: string,
  tasks: ITask[]
}

function App() {

  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', isDarkMode ? 'dark' : 'light');

  const emptyData: UserData = {
    email: '',
    forename: '',
    surname: '',
    id: -1,
    hashed_password: '',
    tasks: []
  }

  const [userData, setUserData] = useLocalStorage('user_data', emptyData);

  const addTask: (arg0: ITask) => void = useCallback((task) => {
    setUserData(prev => {
      if (!prev) return prev;
      return ({
        ...prev,
        tasks: [...prev.tasks, task]
      })
    }
    );
    return;
  }, [setUserData]);

  const changeTheme = () => {
    setTheme((prev) => {
      return (prev === 'dark' ? 'light' : 'dark');
    })
  }

  return (
    <main className="App" data-theme={theme} style={{ fontFamily: 'var(--font-family)' }}>
      <Router>
        <CheckHeader>
          <Header changeTheme={changeTheme} currentTheme={theme} />
        </CheckHeader>
        <Routes>
          <Route path='/'>
            <Route index element={<Navigate to={'/login'} />} />
            <Route path='login' element={<Login setUserData={setUserData} />} />
            <Route path='register' element={<Register setUserData={setUserData} />} />
            <Route path='forgot' element={<Forgot />} />
            <Route path='home' element={userData === emptyData ? <Navigate to='/login' /> : <LoginLanding />} />
            <Route path='findHelp' element={userData === emptyData ? <Navigate to='/login' /> : <LoginLandingForHelp />} />
            <Route path='tradesmanList' element={userData === emptyData ? <Navigate to='/login' /> : <TradesmanList />} />
            <Route path='tradesmanProfile' element={userData === emptyData ? <Navigate to='/login' /> : <TradesmanProfile />} />
            <Route path='taskList' element={userData === emptyData ? <Navigate to='/login' /> : <TaskList />} />
            <Route path='task' element={userData === emptyData ? <Navigate to='/login' /> : <Task userId={userData.id} startingIndex={-1} taskData={userData.tasks} addTask={addTask} />} />
            <Route path='*' element={<PageNotFound />} />
          </Route>
        </Routes>
      </Router>
    </main >
  );
}

export default App;
