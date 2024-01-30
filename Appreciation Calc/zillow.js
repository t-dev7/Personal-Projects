const cheerio = require("cheerio")
const axios = require("axios")
const express = require("express");
const puppeteer = require('puppeteer');
const { getElementsByTagType } = require("domutils");
const app = express()

const msubDiv = new Map();

const house = {
    address: "",
    price: 0
}




const getQuotes = async () => {

    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
  
    // Open a new page
    const page = await browser.newPage();
  
    // On this new page:
    // - open the "http://quotes.toscrape.com/" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto("https://www.realtor.com/realestateandhomes-detail/3800-Rollingwood-Dr_Fairfield_CA_94534_M14102-84735", {
      waitUntil: "domcontentloaded",
    });

      // Extracting a single element using a CSS selector
  const elements = await page.$$('a'); // Example selector: td

  const tableDiv = await page.$$('.nearby-homes-table')

  /* for (const element of elements) {
    const elementText = await page.evaluate(element => element.href, element);
    console.log('Extracted element:', elementText);
  } */

  

  const result = await page.evaluate(() => {
    let final = []
    let mocktable = []
    mocktable[0] = []
    mocktable[1] = []
    mocktable[2] = 0
  //  let tableData = document.querySelectorAll("div[id='Nearby Home Values'], td")
  //let tableData = document.getElementById("Price & Tax History").querySelectorAll('td')
  //let tRows = document.getElementById("Price & Tax History").querySelector("div[data-testid='price-history-container']").querySelectorAll('tr')
  let t = document.getElementById("Price & Tax History").querySelector("table")
  let j = 0
  let k = 2

  mocktable[2] = (t.rows.length)

  // let i be the year, k be the price
    for(let row of t.rows){

      let i = 0
      for(let cell of row.cells){
        if(i == 0){
          console.log(cell.innerText)
          mocktable[0].push(cell.innerText)}
        if(i==2){
          console.log(cell.innerText)
          mocktable[1].push(cell.innerText)}
        i+=1
      }

    }

  return mocktable
  });

  console.log(result)

    // Close the browser
    await browser.close();
  };

  // Start the scraping
  getQuotes();



