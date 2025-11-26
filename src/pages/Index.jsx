import { useState } from "react";
import Login from "@/components/Login";
import TodoDashboard from "@/components/TodoDashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("isLoggedIn") === "true";
    } catch {
      return false;
    }
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem("isLoggedIn", "true");
    } catch {}
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem("isLoggedIn");
    } catch {}
  };

  return (
    <>
      {isLoggedIn ? (
        <TodoDashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default Index;
