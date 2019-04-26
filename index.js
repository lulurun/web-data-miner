const Analysis = require('./src/Analysis');
const Extractor = require('./src/ShapeExtractor');

class DataMiner {
  constructor($) {
    $.__wdm = {
      key: `/${$.name}`,
      index: 0,
      depth: 0,
    };
    this.analysis = new Analysis($);
  }

  candidates(num = 10) {
    return this.analysis.top(num);
  }

  extract() {
    const topCandidate = this.candidates(1)[0];
    const extractor = new Extractor(topCandidate.els);
    return [extractor.getFields(), extractor.getData()];
  }
}

module.exports = DataMiner;
