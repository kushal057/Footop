const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const scrapeTeamImages = async (teamName) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto('https://sortitoutsi.net/search/database');

    // Search for the player
    await page.type('input[name="search"]', teamName);
    await page.click('button[type="submit"]');

    // Wait for the first table row
    const firstTableRow = await page.waitForSelector('tbody > tr:first-child');

    // If the first table row is not found, show an error message
    if (!firstTableRow) {
      console.error(`Player ${teamName} not found.`);
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

    // Get the three image URLs from the children `divs` using page.evaluate
    const imageURLs = await page.$$eval(".row div > img", elements => elements.map(element => element.getAttribute("src").trim()));

    const response = [
      { itemName: "nationImage", itemValue: imageURLs[0] },
      { itemName: "leagueImage", itemValue: imageURLs[1] },
      { itemName: "teamImage", itemValue: imageURLs[2] }
    ];
    console.log(response)
    return response;

  } catch (error) {
    console.error('Error scraping player images:', error);
  } finally {
    await browser.close();
  }
};

const getHyperLinkText = async (teamName) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the link
    await page.goto('https://www.transfermarkt.com/schnellsuche/ergebnis/schnellsuche?query=' + encodeURIComponent(teamName));

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

const useHyperLinkText = async (teamName) => {
  const hyperLink = await getHyperLinkText(teamName)
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the link
    const myURL = 'https://www.transfermarkt.com' + hyperLink
    await page.goto(myURL);

    await page.waitForSelector(".data-header__headline-wrapper");
    const teamName = await page.$$eval(".data-header__headline-wrapper", elements => elements.map(element => element.textContent.trim()));
    const leagueName = await page.$$eval(".data-header__club a", elements => elements.map(element => element.textContent.trim()));
    const nationName = await page.$$eval(".data-header__content a img", elements => elements.map(element => element.getAttribute("title").trim()));

    const infoResponse = [];
    infoResponse.push({ itemName: "leagueName", itemValue: leagueName[0] }) // Use leagueName[0] to get the single element
    infoResponse.push({ itemName: "teamName", itemValue: teamName[0] }) // Use teamName[0] to get the single element
    infoResponse.push({ itemName: "nationName", itemValue: nationName[0] }) // Use nationName[0] to get the single element

    const playerNumberArray = await page.$$eval(".items tr .rn_nummer", elements => elements.map(element => element.textContent.trim()));
    const playerImageArray = await page.$$eval(".items .inline-table td img", elements => elements.map(element => element.getAttribute("src").trim()));
    const playerNameArray = await page.$$eval(".items .inline-table .hauptlink a", elements => elements.map(element => element.textContent.trim()));
    const playerPositionArray = await page.$$eval(".items .inline-table tr:last-child td", elements => elements.map(element => element.textContent.trim()));

    for (let i = 0; i < playerNumberArray.length; i += 2) {
      infoResponse.push({ playerNumber: playerNumberArray[i], playerImage: playerImageArray[i], playerName: playerNameArray[i], playerPosition: playerPositionArray[i] })
    }
    console.log(infoResponse)
    return infoResponse;

  } catch (error) {
    console.error('Error scraping player info:', error);
  } finally {
    await browser.close();
  }
};

const mainFunctionForTeam = async (teamName) => {
  try {
    const playerImagesResponse = await scrapeTeamImages(teamName);
    const playerInfoResponse = await useHyperLinkText(teamName);
    const validObjects = playerInfoResponse.filter(obj => obj.itemName !== undefined && obj.itemValue !== undefined);

    // Filter out the objects without "itemName" or "itemValue"
    const filteredObjects = playerInfoResponse.filter(obj => obj.itemName === undefined || obj.itemValue === undefined);

    // Create a squad object with the filtered array
    const squadObject = { itemName: "squad", itemValue: filteredObjects };

    // Concatenate the valid objects and the squad object
    const newPlayerInfoResponse = validObjects.concat(squadObject);

    // Concatenate the responses into a new response array
    const finalResponse = playerImagesResponse.concat(newPlayerInfoResponse);
    console.log(finalResponse)
    return finalResponse;
  } catch (error) {
    console.error('Error in mainFunctionForTeam:', error);
  }
};

module.exports = { mainFunctionForTeam };
