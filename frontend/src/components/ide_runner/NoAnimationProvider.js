import { useContext, useState } from "react";
import { AnimationState } from "./AnimationProvider";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";

export default function NoAnimationProvider({ tournamentID, children }) {
  const [animationState, setAnimationState] = useState(AnimationState.NONE);
  const { submitUserEntry } = useContext(AuthenticatedContext);
}
