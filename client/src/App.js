import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Globe from "react-globe.gl";
import * as d3 from "d3";
import countries from "./country_data.json";
import "./App.css";

function App() {
  const [hoverD, setHoverD] = useState();
  const [data, setData] = useState();

  function findCountryData(name) {
    switch (name) {
      case "United States of America":
        name = "USA";
        break;

      case "North Korea":
        name = "N. Korea";
        break;

      case "South Korea":
        name = "S. Korea";
        break;

      case "United Kingdom":
        name = "UK";
        break;

      default:
        break;
    }

    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].name, "?=", name);

      if (data[i].name.trim() === name) {
        return `
        <br />
        Confirmed Cases: ${data[i].latest_data.confirmed} <br />
        Total Deaths: ${data[i].latest_data.deaths} <br />
        Total Recovered: ${data[i].latest_data.recovered}
        `;
      }
    }

    return `<br />Data not found...`;
  }

  async function getData() {
    const response = await axios.get("/api/v2/covid19");
    setData(response.data.data.data);
  }

  useEffect(() => {
    getData();
  }, []);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat) =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  // eslint-disable-next-line
  const maxVal = useMemo(() => Math.max(...countries.map(getVal)), [countries]);
  colorScale.domain([0, maxVal]);

  return (
    <div className="App">
      <Globe
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        lineHoverPrecision={0}
        polygonsData={countries.filter((d) => d.properties.ISO_A2 !== "AQ")}
        polygonAltitude={(d) => (d === hoverD ? 0.12 : 0.06)}
        polygonCapColor={(d) =>
          d === hoverD ? "steelblue" : colorScale(getVal(d))
        }
        polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
        polygonStrokeColor={() => "#111"}
        polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
        Population: <i>${d.POP_EST}</i>
        ${findCountryData(d.ADMIN)}
      `}
        onPolygonHover={setHoverD}
        polygonsTransitionDuration={300}
      />
    </div>
  );
}

export default App;
