/*
 * usage:
 * $ node getdata.js $URL [--suggest=$NUM][--trustme]
 *  $URL: this target url to scrape data.
 *  suggest=$NUM: return top $NUM of dom paths that are most likely to contain listing data.
 *                default value is 5
 *  trustme: extract records from the dom path where contains the listing data (suggest = 1)
 *
 * try below urls:
 * 'https://github.com/topics'
 * 'https://www.google.com/search?q=github'
 * 'https://www.amazon.co.jp/b/?node=2386870051'
 */
const rp = require('request-promise');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const minimist = require('minimist');
const Analysis = require('../src/Analysis');
const ShapeExtractor = require('../src/ShapeExtractor');

const args = minimist(process.argv.slice(2));
const [url] = args._;
if (!url) {
  const node = process.argv[0].split('/').slice(-1);
  const script = process.argv[1].split('/').slice(-1);
  throw new Error(`Usage: ${node} ${script} $URL [--trustme] [--suggest=$NUM]`);
}

const suggest = args.trustme ? 1 : (args.suggest || 5);

(async (url) => {
  const html = await rp.get(url);
  const $ = cheerio.load(minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyElements: true,
    continueOnParseError: true,
  }));

  const beforeAnalysis = process.hrtime()
  const analysis = new Analysis($('body').get(0));
  const d1 = process.hrtime(beforeAnalysis);
  console.log('Analysis Time: %ds %dms', d1[0], d1[1] / 1000000);

  const results = analysis.suggest(suggest);
  console.log('Repeating Pattern:');
  results.forEach((r) => {
    console.log(r.els.length, r.path);
  });

  if (! args.trustme) return;

  const listingData = results[0];
  const beforeExtraction = process.hrtime()
  const extractor = new ShapeExtractor(listingData.els);
  const d2 = process.hrtime(beforeExtraction);
  console.log('Extraction Time: %ds %dms', d2[0], d2[1] / 1000000);

  const fields = extractor.getFields();
  const numFields = Object.entries(fields).length;
  console.log('# Fields:');
  for (let i = 0; i < numFields; i += 1) {
    console.log(i, fields[i]);
  }
  console.log();

  const data = extractor.getData();
  console.log('# Data:');
  data.forEach((x, i) => {
    console.log(`### ${i} ###`);
    for (let i = 0; i < numFields; i += 1) {
      console.log(i, x[i]);
    }
    console.log();
  });
})(url);
