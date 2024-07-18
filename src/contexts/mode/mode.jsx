import { createContext, useState } from "react";

export const ModeContext = createContext(null);

export const ModeProvider = ({ children }) => {
  const [easyMode, setEasyMode] = useState(false);

  const onCheckedMode = () => setEasyMode(prev => !prev);

  return <ModeContext.Provider value={{ easyMode, setEasyMode, onCheckedMode }}>{children}</ModeContext.Provider>;
};
