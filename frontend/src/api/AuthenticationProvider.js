import { createContext } from "react";
import useBackend from "./useBackend";

/**
 * The shared context for authenticated backend actions
 *
 * @type {React.Context<{doLogin: function, doLogout: function,
 * getRandomMaze: function, isAuthenticated: boolean, userProfile: {}}>}
 */
export const AuthenticatedContext = createContext({});
/**
 * A component that provides authentication context to its children.
 *
 * @param {ReactNode} children - The children to be wrapped with the authentication context.
 * @return {ReactElement} - The wrapped children
 */
export default function AuthenticationProvider({ children }) {
  const values = useBackend();
  return (
    <AuthenticatedContext.Provider value={values}>
      {children}
    </AuthenticatedContext.Provider>
  );
}
