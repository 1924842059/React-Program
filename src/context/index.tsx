import React, { ReactNode } from "react";
import { AuthProvider } from "context/auth-context";
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
  //children是Authprovider的一个子节点可以写成<AuthProvider children={children}/>
};
