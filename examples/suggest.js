/* eslint-disable class-methods-use-this */
/*
 * This script is for easily testing different url.
 * usage:
 * $ node suggest.js ${URL}
 *
 * try below urls:
 * 'https://github.com/topics'
 * 'https://www.google.com/search?q=github'
 * 'https://www.amazon.co.jp/b/?node=2386870051'
 */

const { Scraper, kickoff } = require('kick-off-crawling');
const Analysis = require('../src/Analysis');

class SimpleScraper extends Scraper {
  scrape($) {
    const analysis = new Analysis($('body').get(0), 25);
    const results = analysis.suggest(5);
    results.forEach((x) => {
      console.log(x.score, x.path, x.els.length, x.cnt, x.len);
    });
  }
}

const url = process.argv[2];
if (!url) {
  throw new Error('Usage: node suggest.js $URL');
}

kickoff(url, new SimpleScraper(), { headless: true });
