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

const rp = require('request-promise');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const Analysis = require('../src/Analysis');

const url = process.argv[2];
if (!url) {
  throw new Error('Usage: node suggest.js $URL');
}

(async (url) => {
  const html = await rp.get(url);
  const $ = cheerio.load(minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyElements: true,
  }));

  const beforeAnalysis = process.hrtime()
  const analysis = new Analysis($('body').get(0));
  const d = process.hrtime(beforeAnalysis);
  console.log('Analysis time: %ds %dms', d[0], d[1] / 1000000);

  const results = analysis.suggest(5);
  results.forEach((x) => {
    console.log(x.score, x.path, x.els.length, x.cnt, x.depth);
  });
})(url);
