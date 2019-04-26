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

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const minimist = require('minimist');
const DataMiner = require('../index');
const ShapeExtractor = require('../src/ShapeExtractor');

const args = minimist(process.argv.slice(2));
const [url] = args._;
if (!url) {
  const node = process.argv[0].split('/').slice(-1);
  const script = process.argv[1].split('/').slice(-1);
  throw new Error(`Usage: ${node} ${script} $URL [--trustme] [--suggest=$NUM]`);
}

const suggest = args.trustme ? 1 : (args.suggest || 5);

function getAttr(el, attr) {
  return (el.attribs && el.attribs[attr]) || '';
};

function getPath(el) {
  let p = el;
  let path = '';
  while (p) {
    path = `/${p.name}${getAttr(p, 'id')}${path}`;
    p = p.parent;
  }
  return path;
}

(async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const html = await page.content();

  browser.close();

  const $ = cheerio.load(minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyElements: true,
    continueOnParseError: true,
  }));

  const beforeAnalysis = process.hrtime()
  const miner = new DataMiner($('body').get(0));
  const d1 = process.hrtime(beforeAnalysis);
  console.log('Analysis Time: %ds %dms', d1[0], d1[1] / 1000000);

  const candidates = miner.candidates(suggest);
  console.log('Repeating Pattern:');
  candidates.forEach((r) => {
    console.log(r.score, r.els.length, getPath(r.els[0]), r.cnt, r.depth);
  });

  if (! args.trustme) return;

  const beforeExtraction = process.hrtime()
  const [fields, data] = miner.extract();
  const d2 = process.hrtime(beforeExtraction);
  console.log('Extraction Time: %ds %dms', d2[0], d2[1] / 1000000);

  const numFields = Object.entries(fields).length;
  console.log('# Fields:');
  for (let i = 0; i < numFields; i += 1) {
    console.log(i, fields[i]);
  }
  console.log();

  console.log('# Data:');
  data.forEach((x, i) => {
    console.log(`### ${i} ###`);
    for (let i = 0; i < numFields; i += 1) {
      console.log(i, x[i]);
    }
    console.log();
  });
})(url);
