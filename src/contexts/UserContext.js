// import { createContext, useState } from "react";

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState("");
//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

import { createContext, useReducer } from "react";

export const UserContext = createContext(null);
export const UserDispatchContext = createContext(null);

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(UserReducer, "");
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}
function UserReducer(user, action) {
  switch (action.type) {
    case "login": {
      return action.user;
    }
    case "logout": {
      return "";
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
