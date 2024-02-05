import { useEffect, useState } from "react";
import "src/App.css";
import InfoBox from "src/InfoBox";
import Map from "src/Map";
import {
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
} from "@material-ui/core";
import Table from "src/Table";
import { sortData } from "src/util";
import LineGraph from "src/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  // https://disease.sh/v3/covid-19/all

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  console.log("DATA ABOUT COUNTRIES::::", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl>
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value={country}>{country}</MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Header */}
        {/* Title + Select input DropDown --------------DONE */}

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />

          {/* InfoBox */}
        </div>

        {/* Map */}
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          {/* Table */}
          <Table countries={tableData} />

          <h3>Worldwide new cases</h3>

          <LineGraph />
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}
export default App;
