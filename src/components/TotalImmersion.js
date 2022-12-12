import { useState, useEffect, useMemo } from "react";
import { parseCsvFile } from "../utils/parsing";
import { HiFire } from "react-icons/hi";
import { ImHeadphones, ImBook, ImTrophy } from "react-icons/im";

export default function TotalImmersion () {
  const [parsedCsvData, setParsedCsvData] = useState([]);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vQpattUOpPKcUSS8bxlk3P-9OdmCHcNB32FINvEfnQg81WN6OsxK6AIho-gijZROruqizBjlukxKscX/pub?gid=1631773302&single=true&output=csv")
      .then(resp => resp.text())
      .then(csv => parseCsvFile(csv, setParsedCsvData))
      .catch(err => console.log(err));
  }, []);

  const totalActiveImmersionTime = useMemo(() => {
    if (parsedCsvData.length === 0) {
      return "0:00";
    }
    return parsedCsvData.find(d => d["Category"] == "Active total")["All Time"];
  }, [parsedCsvData]);

  const totalPassiveImmersionTime = useMemo(() => {
    if (parsedCsvData.length === 0) {
      return "0:00";
    }
    return parsedCsvData.find(d => d["Category"] == "Passive Listening")["All Time"];
  }, [parsedCsvData]);

  const totalAllImmersionTime = useMemo(() => {
    if (parsedCsvData.length === 0) {
      return "0:00";
    }
    return parsedCsvData.find(d => d["Category"] == "All total")["All Time"];
  }, [parsedCsvData]);

  const daysTracked = useMemo(() => {
    if (parsedCsvData.length === 0) {
      return "0 days";
    }
    return parsedCsvData.find(d => d["Category"] == "All total")[""].replace("/ ", "");
  }, [parsedCsvData]);


  if (parsedCsvData.length === 0) {
    return <p className="loading-messsage">Parsing csv file...</p>;
  }

  return (
    <div className="AllTimeTotals">
      <h1 style={{
        margin: "4px 0 2px 0",
        padding: "0",
        fontSize: "28px",
        fontWeight: "600"
      }}>
        Total Immersion
      </h1>
      <p className="total-days">
        <HiFire className="days-fire"/>
        {daysTracked}
      </p>
      <div className="totals-container">
        <div className="row">
          <div className="totals-card">
            <h2>Active Immersion</h2>
            <p>
              <ImBook style={{display: "none", paddingRight: "4px", marginBottom: "-2px", opacity: "0.8"}}/>
              {totalActiveImmersionTime}
            </p>
          </div>
          <div className="totals-card">
            <h2>Passive Immersion</h2>
            <p>
              <ImHeadphones style={{display: "none", paddingRight: "6px", marginBottom: "-1px", opacity: "0.8"}}/>
              {totalPassiveImmersionTime}
            </p>
          </div>
        </div>
        <div className="row">
          <div className="totals-card">
            <h2>All Immersion</h2>
            <p>
              <ImTrophy style={{color: "#ce82ff", paddingRight: "5px", marginBottom: "-2px", opacity: "0.8"}}/>
              {totalAllImmersionTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
