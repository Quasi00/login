import React, { ChangeEvent } from "react";
import { useAuth } from "./authContext/authProvider";
import { SignInWithEmail, SignOut, SignUpWithEmail } from "./authContext/auth";
import LoginForm from "./loginSystem/loginForm";
import RegisterForm from "./loginSystem/registerForm";

const Site: React.FC = () => {
  const { currentUser, userLoggedIn, loading, token, websocketService } = useAuth();

  const handleLogout = async () => {
    if (userLoggedIn)await SignOut(token!)
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>Online: {websocketService?.onlineMembers}</h1>
        <button onClick={() => websocketService?.sendMessage('asd')}>Wyslij jd</button>
      </div>
      <h1>Welcome to the App</h1>
      {userLoggedIn ? (
        <div>
          <p>Hello, {currentUser?.displayName}</p>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
      ) : (
        <div>
          <LoginForm/>
          <RegisterForm/>
        </div>
      )}
    </div>
  );
};

export default Site;
