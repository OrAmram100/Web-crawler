import React, { useState } from "react";
import axios from "axios";
import "./crawler.css"

const Crawler = () => {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(0);
  const [message, setMessage] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Generating file...");
    try {
      const { data } = await axios.get(
        `http://localhost:8082/crawl?url=${url}&depth=${depth}`
      );
      setMessage(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="crawler">
      <h1>Web Crawler</h1>
      <h3>by Or Amram</h3>
      <br></br>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="labelsWrapper">
        <label className="textLabel" htmlFor="url">URL:</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <label htmlFor="depth">Depth:</label>
        <input
          min={0}
          type="number"
          id="depth"
          value={depth}
          onChange={(e) => setDepth(e.target.value)}
        />
        <br />
        <button type="submit">Crawl</button>
        </div>
      </form>
      <h3>{message}</h3>
    </div>
  );
};

export default Crawler;
