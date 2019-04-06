const { getAttr, getText, isText } = require('./ElementUtils');

class ShapeExtractor {
  constructor(elementList) {
    this.key2Field = {};
    this.records = [];
    this.seq = 0;

    elementList.forEach((el) => {
      const record = {};
      this._parse(el, record);
      this.records.push(record);
    });
  }

  getFields() {
    const field2key = {};
    Object.entries(this.key2Field).forEach(([k, f]) => {
      field2key[f] = k;
    });
    return field2key;
  }

  getData() {
    return this.records;
  }

  _getFieldNumber(key) {
    if (!(key in this.key2Field)) {
      this.key2Field[key] = this.seq;
      this.seq += 1;
    }
    return this.key2Field[key];
  }

  _parse(el, record, keys = [], idx = 0) {
    const key = keys.join('/');
    if (el.type !== 'tag') return;

    if (el.name === 'a') {
      const field = this._getFieldNumber(`${key}/href`);
      record[field] = getAttr(el, 'href');
    } else if (el.name === 'img') {
      const field = this._getFieldNumber(`${key}/src`);
      record[field] = getAttr(el, 'src');
    }

    if (isText(el)) {
      const field = this._getFieldNumber(`${key}/${el.name}${idx}`);
      if (!(field in record)) {
        record[field] = [];
      }
      record[field].push(getText(el));
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
