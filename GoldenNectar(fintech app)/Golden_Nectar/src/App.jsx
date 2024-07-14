import React, { useEffect } from 'react';
import './App.css';
import Login from './components/Login/Login';
import Home from './components/Home/home';
import { useUserStore } from './lib/userStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // Log the user object
      if (user) {
        fetchUserInfo(user?.uid);
      } else {
        fetchUserInfo(null); // handle the case when there is no user
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading"><img src="./public/gnload.gif" alt="" /></div>;

  return (
    <>
      {currentUser ? (
        <Home />
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
