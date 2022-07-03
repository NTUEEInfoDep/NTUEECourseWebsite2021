import React, { useEffect, useState } from "react";
import { Typography, Container } from "@material-ui/core";
import { ResultAPI } from "../../api";
import ResultTable from "./ResultTable";

export default function Result() {
  const [result, setResult] = useState([]);
  const [id2Name, setId2Name] = useState({});
  useEffect(() => {
    ResultAPI.getResult()
      .then((res) => {
        setResult(res.data.results);
        setId2Name(res.data.coursesId2Name);
      })
      .catch(() => {
        setResult([]);
      });
  }, []);
  return (
    <Container maxWidth="md">
      {!result.length ? (
        <Typography variant="h5">No chosen courses</Typography>
      ) : (
        <>
          <Typography variant="h5">Chosen courses</Typography>
          <ResultTable result={result} id2Name={id2Name} />
        </>
      )}
    </Container>
  );
}
