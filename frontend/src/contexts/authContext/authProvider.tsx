import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "./authSystem";
import { authSystem } from "./authSystem";
import { WebSocketService, websocketService } from "../websocket/websocket";

interface AuthContextProps {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
  token: string | null;
  websocketService: WebSocketService | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    websocketService.connect()
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setUserLoggedIn(true);
      setToken(storedToken);
      authSystem.setUser(JSON.parse(storedUser), storedToken);
    } else if (storedToken) {
      authSystem.setUser(null, storedToken);
    }

    const unsubscribe = authSystem.onAuthStateChanged(initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(token: string | null) {
    try {
      if (token) {
        setToken(token);
        localStorage.setItem("authToken", token);
          const response = await fetch('http://192.168.1.102:80/checkToken', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
          });

          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          
          const userData = await response.json();
          if (userData.error) {
            setCurrentUser(null);
            setUserLoggedIn(false);
            setToken(null);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("authToken");
          } else if (userData) {
            setCurrentUser(userData as User);
            setUserLoggedIn(true);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            console.log("User data from API:", userData);
          }
        console.log(token)
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setToken(null);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    token,
    websocketService
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
