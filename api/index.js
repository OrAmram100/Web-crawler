const express = require("express");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const fs = require('fs');
const async = require('async')

// Enable CORS for all routes
app.use(cors());

// Load environment variables from .env file
dotenv.config();

// Set up middleware for parsing JSON and adding security headers
app.use(express.json());
app.use(helmet());

// Set up logging middleware
app.use(morgan("common"));

app.get('/crawl', async (req, res) => {
    const { url, depth } = req.query; 
  
    const results = await crawl(url, depth);
    res.send('File created successfully!');

    // Write the results to a JSON file on the server
    fs.writeFileSync('results.json', JSON.stringify(results ));
  });
  
// Define the crawl function for recursively crawling images from a URL up to a certain depth
  async function crawl(url, maxDepth) {
    const results = { results: [] }; 
    const queue = async.queue(crawlPage, 30); // Initialize an async queue with a max concurrency of 30
  
    queue.push({ url: url, depth: 0 }); // Add the initial URL to the queue with depth 0
  
    await queue.drain(); // Wait for the queue to finish processing all URLs
  
    return results; 
  
    async function crawlPage(page) {
      const { url, depth } = page; 
  
      if (depth > maxDepth) { 
        return; 
      }
  
      try {
        const response = await axios.get(url); // Make a GET request to the URL
        const $ = cheerio.load(response.data); // Load the response HTML into Cheerio
  
        $('img').each((i, elem) => { // Loop through all img elements on the page
          const imageUrl = $(elem).attr('src'); // Extract the image URL from the src attribute
          results.results.push({ // Add the image URL and source URL to the results object
            imageUrl: imageUrl,
            sourceUrl: url,
            depth: depth
          });
        });
  
        $('a').each((i, elem) => { // Loop through all anchor elements on the page
          const link = $(elem).attr('href'); // Extract the href attribute
          if (link && link.startsWith('http')) { // Check if the link is an absolute URL
            queue.push({ url: link, depth: depth + 1 }); // If so, add it to the queue with an incremented depth
          }
        });
      } catch (error) { 
        console.error(`Error crawling ${url}: ${error}`);
      }
    }
  }

// Start the server and listen on port 8082
app.listen(8082, () => {
  console.log("Backend server is running!");
});
