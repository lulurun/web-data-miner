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

const rp = require('request-promise');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const Analysis = require('../src/Analysis');
const ShapeExtractor = require('../src/ShapeExtractor');

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
  const d1 = process.hrtime(beforeAnalysis);
  console.log('Analysis time: %ds %dms', d1[0], d1[1] / 1000000);

  const [result] = analysis.suggest(1);
  console.log('Repeating pattern:', result.els.length, result.path);

  const beforeExtraction = process.hrtime()
  const extractor = new ShapeExtractor(result.els);
  const d2 = process.hrtime(beforeExtraction);
  console.log('Extraction time: %ds %dms', d2[0], d2[1] / 1000000);

  const fields = extractor.getFields();
  console.log('# Fields:');
  fields.forEach(([key, field]) => {
    console.log(field, key);
  });
  console.log();
  const data = extractor.getData();
  console.log('# Data:');
  data.forEach((x, i) => {
    console.log(`### ${i} ###`);
    Object.keys(x).sort().forEach((k) => {
      console.log(k, x[k]);
    });
    console.log();
  });
})(url);
