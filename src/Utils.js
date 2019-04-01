exports.getHref = (el) => {
  return (el.attribs && el.attribs.href) || '';
};

exports.getSrc = (el) => {
  return (el.attribs && el.attribs.src) || '';
}

exports.isTextElement = (el) => {
  if (el.type === 'text') return true;
  if (el.children) {
    for (let i = 0; i < el.children.length; i += 1) {
      const c = el.children[i];
      if (c.type === 'text') {
        return true;
      }
    }
  }
  return false;
}

exports.getText = (el) => {
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
