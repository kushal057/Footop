const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const findSearchType = async (searchTerm) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // Navigate to the link
        await page.goto('https://sortitoutsi.net/search/database');

        // Search for the player
        await page.type('input[name="search"]', searchTerm);
        await page.click('button[type="submit"]');

        // Wait for the first table row
        const firstTableRow = await page.waitForSelector('tbody > tr:first-child');

        // If the first table row is not found, show an error message
        if (!firstTableRow) {
            console.error(`${searchTerm} not found.`);
            return;
        }

        const searchType = await page.$$eval("tbody > tr:first-child .row-title div", elements => elements.map(element => element.textContent.trim()))

        console.log((searchType[0]).split(' ')[0].toLowerCase())
        if ((searchType[0]).split(' ')[0].toLowerCase() === 'person') {
            return "player";
        } else if ((searchType[0]).split(' ')[0].toLowerCase() === 'team') {
            return "team";
        } else {
            return "other";
        }
    } catch (error) {
        console.error('Error determining search type:', error);
    } finally {
        await browser.close();
    }
}

module.exports = { findSearchType }