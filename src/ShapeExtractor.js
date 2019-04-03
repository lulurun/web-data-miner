const { IGNORE_TAGS } = require('./Constants');
const { getAttr, getText, isText } = require('./ElementUtils');

class ShapeExtractor {
  constructor(elementList) {
    this.key2Field = {};
    this.records = [];
    this.seq = 0;

    elementList.slice(0, 5).forEach((el) => {
      const record = {};
      this._parse(el, record);
      this.records.push(record);
    });
  }

  getFields() {
    return Object.entries(this.key2Field);
  }

  getData() {
    return this.records;
  }

  _getField(key) {
    if (!(key in this.key2Field)) {
      this.seq += 1;
      this.key2Field[key] = `Field${this.seq}`;
    }
    return this.key2Field[key];
  }

  _parse(el, record, keys = [], idx = 0) {
    const key = keys.join('/');
    if (el.type !== 'tag') return;

    if (el.name === 'a') {
      const field = this._getField(`${key}/href`);
      record[field] = getAttr(el, 'href');
    } else if (el.name === 'img') {
      const field = this._getField(`${key}/src`);
      record[field] = getAttr(el, 'src');
    }

    if (isText(el)) {
      const field = this._getField(`${key}/${el.name}`);
      record[field] = getText(el);
    } else if (el.children) {
      el.children.forEach((x, i) => {
        keys.push(`${el.name}${idx}`);
        this._parse(x, record, keys, i);
        keys.pop();
      });
    }
  }
}

module.exports = ShapeExtractor;
