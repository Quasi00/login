import React, { useState } from "react";
import { SignInWithEmail } from "../authContext/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const [showPasswords, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | undefined>()

  const handleLogin = async () => {
    const res = await SignInWithEmail(email, password)
    if (res?.error){
      switch (res.error) {
        case 'user_notfound':
          setServerError('Podany email nie jest powiązany z żadnym kontem')
          break;
        case 'test_error':
          setServerError('Testowy błąd z serwera')
          break;
        default:
          setServerError('Nieznany błąd')
          break;
      }
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      {serverError?<p style={{color:'red'}}>{serverError}</p>:null}
      <p>Sign in</p>
      <p>Email<br />
      <input id="email" type="text" onChange={(e) => setEmail(e.target.value)}/></p>
      <p>Password <button type="button" onClick={() => setShowPassword(!showPasswords)}>{showPasswords?'hide':'show'}</button><br />
      <input type={showPasswords?'text':'password'} onChange={(e) => setPassword(e.target.value)}/></p>
      <button>Login</button>
    </form>
  );
};

export default LoginForm;
