import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CodeCopyBtn({ children }: { children: any }) {
  const [copyOk, setCopyOk] = React.useState(false);
  const iconColor = copyOk ? "#0af20a" : "#ddd";
  const icon = copyOk ? "check-square" : "copy";
  const handleClick = (e: any) => {
    navigator.clipboard.writeText(children[0].props.children[0]);
    console.log(children);
    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };
  console.log("here3");
  return (
    <div className="code-copy-btn">
      <FontAwesomeIcon icon={icon} onClick={handleClick} />
    </div>
  );
}
