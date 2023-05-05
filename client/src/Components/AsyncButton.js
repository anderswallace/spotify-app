import { useState } from "react";

export default function AsyncButton(props) {
  const [buttonState, setButtonState] = useState("loaded");
  const onClick = async () => {
    setButtonState("loading");
    await props.onClick();
    setButtonState("loaded");
  };

  return (
    <button onClick={onClick} disabled={buttonState === "loading"}>
      {buttonState === "loaded" ? props.children : "Loading..."}
    </button>
  );
}
