import { useContext, useMemo } from "react";
import { parseCsvFile } from "../utils/parsing";
import { HiFire } from "react-icons/hi";
import { ImHeadphones, ImBook, ImTrophy } from "react-icons/im";
import { AggregatedImmersionContext } from "../providers/AggregatedImmersionProvider";

export default function TotalImmersion () {
  const { aggregatedImmersionData: data, aggregatedImmersionIsLoading: isLoading } = useContext(AggregatedImmersionContext);

  const parsedCsvData = useMemo(() => {
    if (isLoading) return [];
    return parseCsvFile(data);
  }, [isLoading, data]);

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


  if (isLoading) {
    return <p className="loading-messsage">Fetching csv file...</p>;
  }

  return (
    <div className="TotalImmersion">
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
        <div className="totals-row">
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
          <div className="totals-card">
            <h2>All Immersion</h2>
            <p>
              <ImTrophy style={{color: "#ce82ff", paddingRight: "8px", marginBottom: "-3px", opacity: "0.8"}}/>
              {totalAllImmersionTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
