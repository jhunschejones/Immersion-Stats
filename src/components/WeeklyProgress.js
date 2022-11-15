import { useState, useEffect } from "react";
import Papa from "papaparse";
import ProgressRing from "./ProgressRing";

export default function WeeklyProgress () {
  const [parsedCsvData, setParsedCsvData] = useState([]);

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: (results) => {
        setParsedCsvData(results.data);
      }
    });
  };

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?gid=1631773302&single=true&output=csv")
      .then(resp => resp.text())
      .then(csv => parseFile(csv))
      .catch(err => console.log(err));
  }, []);

  if (parsedCsvData.length === 0) {
    return <p>Parsing csv file...</p>
  }

  return (
    <>
      <h1 style={{margin: "0 0 12px 0", padding: "0", fontSize: "28px", fontWeight: "600"}}>
        Weekly Progress:
      </h1>
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {parsedCsvData.slice(0, 3).map((progressReport, index) => {
          // cut the trailing `%` off of this string
          const progressNumber = progressReport["% Complete"].slice(0, progressReport["% Complete"].length - 1);

          return <ProgressRing
            key={index}
            stroke={8}
            radius={85}
            progress={progressNumber}
            title={progressReport["Category"]}
            progressAmount={progressReport["This Week"]}
          />
        })}
      </div>
    </>
  );
}
