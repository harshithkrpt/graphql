import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const RenderText = ({ url }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(url)
      .then((x) => x.text())
      .then((y) => setText(y));
  }, [url, setText]);

  return (
    <div>
      <div>--------</div>
      <p>{text}</p>
      <div>--------</div>
    </div>
  );
};

export default RenderText;
