
import React, { createContext, useState, useEffect } from 'react';
import * as jwt_decode from 'jwt-decode';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (token) {
      const decodedToken = jwt_decode(token.split('=')[1]);
      setUser(decodedToken);
    }
  }, []);
useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObject = JSON.parse(storedUser);
      setUser(userObject);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);


  return (
    <UserContext.Provider value={{ user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
