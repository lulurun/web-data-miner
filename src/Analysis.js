const { IGNORE_TAGS, WEIGHTS } = require('./Constants');
const { getAttr } = require('./ElementUtils');

function getKey(el) {
  const parentIndex = el.parent && el.parent.__wdm && el.parent.__wdm.index || 0;
  return `${parentIndex}${el.name}.${getAttr(el, 'class')}.${getAttr(el, 'style')}`;
}

function getDisplay(el) {
  return `${el.name}#${getAttr(el, 'id')}.${getAttr(el, 'class')}`;
}

function isRoot(el) {
  return el.__wdm.depth === 0;
}

class Analysis {
  constructor($) {
    this.histogram = {};
    $.__wdm = {
      depth: 0,
      key: `/${getKey($)}`,
      display: `/${getDisplay($)}`,
      index: 0,
    };
    this.traverse($);
  }

  updateHistogram(el) {
    if (!(el.__wdm.key in this.histogram)) {
      this.histogram[el.__wdm.key] = {
        display: el.__wdm.display,
        depth: el.__wdm.depth,
        cnt: 0,
        els: [],
      };
    }
    this.histogram[el.__wdm.key].els.push(el);
    this.histogram[el.__wdm.key].cnt += 1;

    let p = el.parent;
    while (!isRoot(p)) {
      this.histogram[p.__wdm.key].cnt += 1;
      p = p.parent;
    }
  }

  process(el, index) {
    if (el.type !== 'tag') return false;
    if (el.name in IGNORE_TAGS) return false;

    el.__wdm = {
      depth: el.parent.__wdm.depth + 1,
      key: `${el.parent.__wdm.key}/${getKey(el)}`,
      display: `${el.parent.__wdm.display}/${getDisplay(el)}`,
      index,
    };
    this.updateHistogram(el);

    return true;
  }

  traverse($) {
    const stack = [$];
    while (stack.length) {
      const el = stack.pop();
      if (el.children) {
        el.children.forEach((x, i) => {
          if (this.process(x, i)) {
            stack.push(x);
          }
        });
      }
    }
  }

  suggest(top = 10) {
    const results = Object.values(this.histogram).map(v => ({
      path: v.display,
      score: v.cnt * WEIGHTS.CUMULATIVE_PRIMES[v.depth],
      els: v.els,
      cnt: v.cnt,
      depth: v.depth,
    }));

    return results.sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    }).slice(0, top);
  }
}

module.exports = Analysis;
