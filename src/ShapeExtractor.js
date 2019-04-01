const { IGNORE_TAGS } = require('./Constants');
const { getHref, getSrc, getText, isTextElement } = require('./Utils');

class ShapeExtractor {
  constructor() {
    this.fields = {};
    this.records = [];
    this.seq = 0;
  }

  getField(key) {
    if (!(key in this.fields)) {
      this.seq += 1;
      const field = `Field${this.seq}`;
      this.fields[key] = field;
    }
    return this.fields[key];
  }

  getTable(elList) {
    elList.slice(0, 5).forEach((x) => {
      console.log('#################');
      this.parse([], 0, x);
      console.log();
      console.log();
    });
  }

  produce(key, val) {
    const field = this.getField(key);
    console.log(field, val);
  }

  parse(keys, idx, el) {
    let key = keys.join('/');
  
    if (isTextElement(el)) {
      this.produce(key + `/${el.name}`, getText(el));
    } else if (el.type === 'tag') {
      if (el.name === 'a') {
        key += '/href';
        this.produce(key, getHref(el));
      } else if (el.name === 'img') {
        key += '/src';
        this.produce(key, getSrc(el));
      }

      if (el.children) {
        el.children.forEach((x, i) => {
          keys.push(`${el.name}${idx}`);
          this.parse(keys, i, x);
          keys.pop();
        });
      }

    } else if (el.type === 'text') {
      this.produce(key, el.data);
    }
  }
}

module.exports = ShapeExtractor;
