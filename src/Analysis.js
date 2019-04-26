const { IGNORE_TAGS, WEIGHTS } = require('./Constants');
const { getAttr } = require('./ElementUtils');

function getPath(el) {
  let p = el;
  let path = '';
  while (p) {
    path = `/${p.name}[${p.__wdm && p.__wdm.index || 0}]${path}`;
    p = p.parent;
  }
  return path;
}

function getKey(el, index) {
  // return `/${el.parent.__wdm.index}${el.name}.${getAttr(el, 'class')}.${getAttr(el, 'style')}`;
  return `/${el.parent.__wdm.index}${el.name}`;
}

class Analysis {
  constructor($) {
    this.histogram = {};
    // traversal
    const stack = [$];
    while (stack.length) {
      const el = stack.pop();
      if (el.children) {
        el.children.forEach((x, i) => {
          if (this.add(x, i)) {
            stack.push(x);
          }
        });
      }
    }
    // scoring
    const results = Object.values(this.histogram).forEach(v => {
      v.score = v.cnt * WEIGHTS.CUMULATIVE_PRIMES[v.depth];
    });
  }

  top(num) {
    return Object.values(this.histogram).sort((a, b) => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    }).slice(0, num);
  }

  update(el) {
    if (!(el.__wdm.key in this.histogram)) {
      this.histogram[el.__wdm.key] = {
        depth: el.__wdm.depth,
        cnt: 0,
        els: [],
      };
    }
    this.histogram[el.__wdm.key].els.push(el);
    this.histogram[el.__wdm.key].cnt += 1;

    let p = el.parent;
    while (p.__wdm.depth !== 0) {
      this.histogram[p.__wdm.key].cnt += 1;
      p = p.parent;
    }
  }

  add(el, index) {
    if (el.type !== 'tag') return false;
    if (el.name in IGNORE_TAGS) return false;

    el.__wdm = {
      key: `${el.parent.__wdm.key}${getKey(el, index)}`,
      index,
      depth: el.parent.__wdm.depth + 1,
    };
    this.update(el);

    return true;
  }

}

module.exports = Analysis;
