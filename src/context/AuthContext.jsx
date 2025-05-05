export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (jwt, userInfo = null) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    if (userInfo) {
      localStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    setIsAuthenticated(!!token);
  }, [token]);

  return (
    // <AuthContext.Provider
    //   value={{ token, isAuthenticated, login, logout, user }}
    // >
    //   {children}
    // </AuthContext.Provider>

    { children }
  );
};
