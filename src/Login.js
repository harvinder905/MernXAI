import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Login({ onLoginSuccess, goToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>Don't have an account? <span onClick={goToRegister} className="auth-link">Register</span></p>
    </div>
  );
}

export default Login;
