const { IGNORE_TAGS, WEIGHTS } = require('./Constants');

function getAttrClass($) {
  if (!$.attribs || !$.attribs.class) return '';
  return `.${$.attribs.class}`;
}

function getAttrStyle($) {
  if (!$.attribs || !$.attribs.style) return '';
  return `.${$.attribs.style}`;
}

function getAttrId($) {
  if (!$.attribs || !$.attribs.id) return '';
  return `#${$.attribs.id}`;
}

function getKeyStr($array) {
  return $array.map(el => `/${el.name}${getAttrClass(el)}(${getAttrStyle(el)})`).join('');
}

function getDisplayStr($array) {
  return $array.map(el => `/${el.name}${getAttrId(el)}${getAttrClass(el)}`).join('');
}

class Analysis {
  constructor($, maxDepth = 15) {
    this.maxDepth = maxDepth;
    this.stack = [];
    this.histogram = {};
    this.build($);
  }

  update($array) {
    for (let i = 1; i <= $array.length; i += 1) {
      const $prefixArray = $array.slice(0, i);
      const str = getKeyStr($prefixArray);
      if (!(str in this.histogram)) {
        this.histogram[str] = {
          display: getDisplayStr($prefixArray),
          cnt: 0,
          len: i,
          els: [],
        };
      }
      this.histogram[str].cnt += 1;

      if (i === $array.length) {
        this.histogram[str].els.push($array[$array.length - 1]);
      }
    }
  }

  build($, depth = 0) {
    this.update(this.stack);

    if (!$.children || $.children.length === 0) return;
    if (depth === this.maxDepth) return;
    $.children.forEach((x) => {
      if (x.type === 'text') return;
      if (x.name in IGNORE_TAGS) return;
      this.stack.push(x);
      this.build(x, depth + 1);
      this.stack.pop();
    });
  }

  suggest(top = 10) {
    const results = Object.values(this.histogram).map(v => ({
      path: v.display,
      score: v.cnt * WEIGHTS.MAGIC_NUMBERS_2[v.len - 1],
      els: v.els,
      cnt: v.cnt,
      len: v.len,
    }));

    return results.sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    }).slice(0, top);
  }

  scrape(index = 0) {
    const results = this.suggest(index + 1);
    console.log(results);
    results[0].els.forEach((x) => {
      console.log(x);
    });
  }

  dump() {
    Object.keys(this.histogram).sort().forEach((k) => {
      const v = this.histogram[k];
      console.log(k, v.display);
    });
  }
}

module.exports = Analysis;
