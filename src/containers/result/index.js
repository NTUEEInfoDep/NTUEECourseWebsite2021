import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { ResultAPI } from "../../api";
import ResultTable from "./ResultTable";

export default function Result() {
  const [result, setResult] = useState([]);
  useEffect(() => {
    ResultAPI.getResult()
      .then((res) => {
        setResult(res.data);
      })
      .catch((e) => {
        throw new Error(`get result error: ${e}`);
      });
  }, []);
  return (
    <div>
      {!result.length ? (
        <Typography variant="h5">No chosen courses</Typography>
      ) : (
        <>
          <Typography variant="h5">Chosen courses</Typography>
          <ResultTable result={result} />
        </>
      )}
    </div>
  );
}
