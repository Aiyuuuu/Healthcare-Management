import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  tokens: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  role: null,
});

export default AuthContext;