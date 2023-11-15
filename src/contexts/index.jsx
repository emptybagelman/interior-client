import React, { useState, useContext, createContext } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [usersUsername, setUsersUsername] = useState()
  const [cubeMap,setCubeMap] = useState()

  return (
    <AuthContext.Provider value={{ user, setUser, usersUsername, setUsersUsername, cubeMap, setCubeMap }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)


const RoomContext = createContext()

export const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState()

  return (
    <RoomContext.Provider value={{room, setRoom}}>
      {children}  
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext)