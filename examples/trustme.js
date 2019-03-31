/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/*
 * Assuming Analysis.js can always correctly find listing data by calling Analysis.suggest(1),
 * this script is trying to convert the listing data into a table
 *
 * usage:
 * $ node extract_data_list.js ${URL}
 *
 * try below urls:
 * 'https://github.com/topics'
 * 'https://www.google.com/search?q=github'
 * 'https://www.amazon.co.jp/b/?node=2386870051'
 */

const { Scraper, kickoff } = require('kick-off-crawling');
const Analysis = require('../src/Analysis');
const Extractor = require('../src/Extractor');

class DataListScraper extends Scraper {
  scrape($) {
    const analysis = new Analysis($('body').get(0), 25);
    const [result] = analysis.suggest(1);
    console.log(result.els.length, result.path);

    const extractor = new Extractor();
    extractor.getTable(result.els);
  }
}

const url = process.argv[2];
if (!url) {
  throw new Error('Usage: node ${process.argv[1]} $URL');
}

kickoff(url, new DataListScraper(), { headless: true, minify: true });
