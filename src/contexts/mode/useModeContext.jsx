import { useContext } from "react";
import { ModeContext } from "./mode";

export const useModeContext = () => {
  return useContext(ModeContext);
};
