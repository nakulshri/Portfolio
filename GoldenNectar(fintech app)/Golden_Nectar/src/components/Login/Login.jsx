import React, { useState } from 'react';
import './login.css';
import { db,auth } from '../../lib/firebase'; 
import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const handleLogin= async(e)=>{
    e.preventDefault();
    const formData = new FormData(e.target)

    const{email,password}=Object.fromEntries(formData);
   
    try {
        await signInWithEmailAndPassword(auth,email,password);

        
    } catch (err) {
        console.log(err)
    
    }

    
    
 }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { name: username, email, password } = Object.fromEntries(formData);

    try {
      // Check if the username is already taken
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        throw new Error('Username is already taken. Please choose another one.');
      }

      // Simulate registration logic
      const res = await createUserWithEmailAndPassword(auth, email, password);


      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        id: res.user.uid,
      });

      await setDoc(doc(db, 'userTransaction', res.user.uid), {
        
      });
      await setDoc(doc(db, 'userBudgets', res.user.uid), {
        food: 0,
        transport: 0,
        shopping: 0,
        utilities: 0
    });

      toast.success('Registration successful!', {
        className: 'black',
      });
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error(error.message, {
        className: 'black',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to check if the username already exists
  async function checkUsernameExists(username) {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }

  // Simulate a registration process (since Firebase auth logic is missing)
  async function simulateRegister({ username, email, password }) {
    // Simulate a user registration process
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ user: { uid: `${Date.now()}` } });
      }, 1000);
    });
  }

  return (
    <div className="login">
      <div className="hero">
        <h1>
          <span>
            <span className="purple">Golden Nectar </span>Plan Today,
          </span>
          Prosper Tomorrow
        </h1>
      </div>
      <div className="form">
        <div className="loginform">
          <form onSubmit={handleLogin} >  
            <h2>Login</h2>
            <div className="form-group">
              <input type="email" id="loginEmail" name="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" id="loginPassword" name="password" placeholder="Password" required />
            </div>
            <div className="form-group">
              <button type="submit">o</button>
            </div>
          </form>
        </div>
        <div className="signupform">
          <form onSubmit={handleRegister}>
            <h2>Sign Up</h2>
            <div className="form-group">
              <input type="text" id="signupName" name="name" placeholder="Name" required />
            </div>
            <div className="form-group">
              <input type="email" id="signupEmail" name="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="password" id="signupPassword" name="password" placeholder="Password" required />
            </div>
            <div className="form-group">
              <button type="submit">o</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
