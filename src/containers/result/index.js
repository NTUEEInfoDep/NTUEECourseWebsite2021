import React, { useEffect, useState } from "react";
// import { Tab } from "@material-ui/core";
import { ResultAPI } from "../../api";

export default function Result() {
  const [result, setResult] = useState([]);
  useEffect(() => {
    ResultAPI.getResult()
      .then((res) => {
        setResult(res.data);
      })
      .catch((e) => console.log(`get result error: ${e}`));
  });
  return <div>{result}</div>;
}
