import React, { ChangeEvent, useState } from "react";
import { SignUpWithEmail } from "../authContext/auth";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPasswords, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | undefined>()
  const [emailError, setEmailError] = useState<string | undefined>()
  const [displayNameError, setDisplayNameError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>()

  const handleRegister = async () => {
    var dataError = false;
    if (!/^[A-Za-z0-9+_.-]{1,}@[A-Za-z0-9.-]+$/.test(email)){
      setEmailError('Błędny format adresu email')
      dataError = true;
    } else {
      setEmailError(undefined)
    }
    if (!/^[A-Za-z0-9+-_.!#]{5,}$/.test(displayName)){
      setDisplayNameError('Nazwa musi mieć minimum 5 znaków i może skład się tylko z liter, cyfr i znaków specjalnych ( +-_.!# )')
      dataError = true;
    } else {
      setDisplayNameError(undefined)
    }
    if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password))){
      setPasswordError('Hasło musi zawierać co najmniej 8 znaków, w tym: jedną małą literę, jedną wielką literę, jedną cyfrę oraz jeden znak specjalny (@$!%*?&)');
      dataError = true;
    } else {
      setPasswordError(undefined)
    }
    if (password !== confirmPassword){
      setConfirmPasswordError('Hasła różnią się od siebie');
      dataError = true;
    } else {
      setConfirmPasswordError(undefined)
    }

    if (dataError) return;


    const res = await SignUpWithEmail(email, displayName, password)
    if (res?.error){
      switch (res.error) {
        case 'email_used':
          setServerError('Wybrany email jest już używany')
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

  const handleChangeEmail = (e:ChangeEvent<HTMLInputElement>) => {
    setEmailError(undefined)
    setEmail(e.target.value)
  }
  const handleChangeDisplayName = (e:ChangeEvent<HTMLInputElement>) => {
    setDisplayNameError(undefined)
    setDisplayName(e.target.value)
  }
  const handleChangePassword = (e:ChangeEvent<HTMLInputElement>) => {
    setPasswordError(undefined)
    setPassword(e.target.value)
  }
  const handleChangeConfirmPassword = (e:ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordError(undefined)
    setConfirmPassword(e.target.value)
  }

  return (
    <div>
      {serverError?<p style={{color:'red'}}>{serverError}</p>:null}
      <p>Please sign up.</p>
      <p>
        Email {emailError?<span style={{color:'red'}} title={emailError}>( ! )</span>:null}<br />
        <input type="email" value={email} onChange={handleChangeEmail}/>
      </p>
      <p>
        DisplayName {displayNameError?<span style={{color:'red'}} title={displayNameError}>( ! )</span>:null}<br />
        <input type="text" value={displayName} onChange={handleChangeDisplayName}/>
      </p>
      <p>
        Password {passwordError?<span style={{color:'red'}} title={passwordError}>( ! )</span>:null}<button onClick={() => setShowPassword(!showPasswords)}>{showPasswords?'hide':'show'}</button><br />
        <input type={showPasswords?'text':'password'} value={password} onChange={handleChangePassword}/>
      </p>
      <p>
        Conform Password {confirmPasswordError?<span style={{color:'red'}} title={confirmPasswordError}>( ! )</span>:null}<br />
        <input type={showPasswords?'text':'password'} value={confirmPassword} onChange={handleChangeConfirmPassword}/>
      </p>
      <button onClick={() => handleRegister()}>Register</button>
    </div>
  );
};

export default RegisterForm;
