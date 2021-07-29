import React from "react";
import Top from "./TopSection";
import Explanation from "./ExplanationSection";
import Usage from "./UsageSection";
import Footer from "./Footer.js";
export default function Main() {
  return (
    <div>
      <Top />
      <Explanation />
      <div style={{ height: "95px" }} />
      <hr
        style={{
          height: "5px",
          border: "none",
          borderTop: "5px double #62deda",
          width: "90%"
        }}
      />
      <Usage />
      <Footer />
    </div>
  );
}
