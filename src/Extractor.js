const { IGNORE_TAGS } = require('./Constants');

function getClass(el) {
  return (el.attribs && el.attribs.class) || '';
}

function getHref(el) {
  return (el.attribs && el.attribs.href) || '';
}

function getText(el) {
  let text = '';
  const _ = (el) => {
    if (el.type === 'tag') {
      if (el.children) {
        el.children.forEach((c) => {
          _(c);
        });
      }
    } else if (el.type === 'text') {
      text += el.data;
    }
  };
  _(el);
  return text;
}

class Extractor {
  constructor() {
    this.fields = {};
    this.records = [];
    this.seq = 0;
  }

  newField() {
    const name = `Field${this.seq}`;
    this.seq += 1;
    return name;
  }

  getTable(elList) {
    elList.slice(0, 5).forEach((x) => {
      const record = {};
      this.parse([], record, x);
      console.log('----------------------')
      Object.entries(record).forEach(([k, v]) => {
        console.log(k, v[1]);
        console.log(k, v[0]);
      });
      console.log();     
    });
  }

  getFieldName(key) {
    if (!(key in this.fields)) {
      this.fields[key] = this.newField();
    }
    return this.fields[key];
  }

  parse(keys, record, el) {
    const cls = getClass(el);
    if (cls) keys.push(cls);

    let key = keys.join('__');
    if (el.type === 'text') {
      record[this.getFieldName(key)] = [key, el.data];
    } else if (el.name === 'a') {
      key += '__href';
      record[this.getFieldName(key)] = [key, getHref(el)];
    }


    if (el.children) {
      for (let i = 0; i < el.children.length; i += 1) {
        const c = el.children[i];
        if (c.type === 'text') {
          record[this.getFieldName(key)] = [key, getText(el)];
          return;
        }
      }
      el.children.forEach((x) => {
        this.parse(keys, record, x);
      });
    }
  }
}

module.exports = Extractor;
