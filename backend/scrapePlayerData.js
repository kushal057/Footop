const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const scrapePlayerImages = async (playerName) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto('https://sortitoutsi.net/search/database');

    // Search for the player
    await page.type('input[name="search"]', playerName);
    await page.click('button[type="submit"]');

    // Wait for the first table row
    const firstTableRow = await page.waitForSelector('tbody > tr:first-child');

    // If the first table row is not found, show an error message
    if (!firstTableRow) {
      console.error(`Player ${playerName} not found.`);
      return;
    }
    
    // Click on the player's row
    await page.click('tbody > tr:first-child .row-title a');

    // Wait for the first `div` with the class of `row` on the new page
    await page.waitForSelector('.row');

    // Click on the first row in the new page
    await page.click('tbody > tr:first-child .row-title a');

    // Wait for the first `div` with the class of `row` on the player profile page
    await page.waitForSelector('.row');

    // Wait for all images to load
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('.row div > img');
      return Array.from(images).every(img => img.complete);
    });

    // Get the three image URLs from the children `divs`
    const imageURLs = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('.row div > img');
      return Array.from(imgElements, (img) => img.src);
    });

    const response = [{itemName: "playerImage", itemValue: imageURLs[2]}, {itemName: "clubImage", itemValue: imageURLs[1]}
                      , {itemName: "countryImage", itemValue: imageURLs[0]}]
    return response

  } catch (error) {
    console.error('Error scraping player images:', error);
  } finally {
    await browser.close();
  }
};

const getHyperLinkText = async (playerName) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto('https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=' + encodeURIComponent(playerName));

    //  Wait for the first `div` with the class of `row` on the new page
     await page.waitForSelector('tr td.hauptlink a');
     const hrefValue = await page.evaluate(() => {
      const anchorElement = document.querySelector('tr td.hauptlink a');
      return anchorElement ? anchorElement.getAttribute('href') : null;
    });
    return hrefValue;

  } catch (error) {
    console.error('Error scraping player images:', error);
  } finally {
    await browser.close();
  }
};

const useHyperLinkText = async (playerName) => {
  const hyperLink = await getHyperLinkText(playerName)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const response = [];

  try {
    // Navigate to the link
    const myURL = 'https://www.transfermarkt.com' + hyperLink
    await page.goto(myURL);

    await page.waitForSelector(".data-header__headline-wrapper");
    const textArray = await page.$$eval(".data-header__headline-wrapper", elements => elements.map(element => element.textContent.trim()));
    const shirtNumber = textArray[0].split("\n")[0].trim();
    const playerName = textArray[0].split("\n")[textArray[0].split("\n").length - 1].trim();
    const response = [];
    response.push({itemName: "shirtNumber", itemValue: shirtNumber})
    response.push({itemName: "playerName", itemValue: playerName});

    const infoTableContentArray = await page.$$eval(".info-table__content", elements => elements.map(element => element.textContent.trim()));
    for (let i = 0; i < infoTableContentArray.length; i += 2) {
      const itemName = infoTableContentArray[i].toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); //CamelCase
      const itemValue = infoTableContentArray[i + 1];
      response.push({ itemName, itemValue });
    }
    
    const playerPerformanceLink = await page.evaluate(() => {
      const anchorElement = document.querySelector('#player-performance-table + a');
      return anchorElement ? anchorElement.getAttribute('href') : null;
    });
    await page.goto('https://www.transfermarkt.com' + playerPerformanceLink);

    await page.waitForSelector(".summary");
    const playerPerformanceArray = await page.$$eval(".summary + table td", elements => elements.map(element => element.textContent.trim()));
    response.push({itemName: "matchesPlayed", itemValue: playerPerformanceArray[2]});    
    response.push({itemName: "goals", itemValue: playerPerformanceArray[3]});    
    response.push({itemName: "assists", itemValue: playerPerformanceArray[4]});    
    response.push({itemName: "yellowCards", itemValue: playerPerformanceArray[5]}); 
    response.push({itemName: "redCards", itemValue: playerPerformanceArray[7]}); 
    response.push({itemName: "minutesPlayed", itemValue: playerPerformanceArray[8]}); 
    console.log(playerPerformanceLink)
    return response;

  } catch (error) {
    console.error('Error scraping player images:', error);
  } finally {
    await browser.close();
  }
};

const mainFunctionForPlayer = async (playerName) => {
  try {
    const [playerImagesResponse, playerInfoResponse] = await Promise.all([
      scrapePlayerImages(playerName),
      useHyperLinkText(playerName),
    ]);

    // Concatenate the responses into a new response array
    const finalResponse = playerInfoResponse.concat(playerImagesResponse);

    // Filter out items with missing or undefined values
    const filteredResponse = finalResponse.filter(item => item.itemValue !== undefined && item.itemValue !== '');

    console.log('Final Response:', filteredResponse);
    return filteredResponse;
  } catch (error) {
    console.error('Error in mainFunctionForPlayer:', error);
  }
};


module.exports = { mainFunctionForPlayer };
