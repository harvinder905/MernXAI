import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful. You can now log in.');
      onRegisterSuccess();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
