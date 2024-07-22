import { useContext } from "react";
import { LeadersContext } from "./leaders";

export const useLeadersContext = () => {
  return useContext(LeadersContext);
};
