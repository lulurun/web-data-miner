const ignoreTagList = [
  'script',
  'header',
  'footer',
  'select',
  'em',
  'strong',
  'b',
  'hr',
  'br',
  'i',
];

const ignoreTagMap = {};
ignoreTagList.forEach(k => {
  ignoreTagMap[k] = 1;
});

exports.IGNORE_TAGS = ignoreTagMap;

exports.WEIGHTS = {
  FIBONACCI: [
    1, 1, 2, 3, 5, 8,
    13, 21, 34, 55, 89,
    144, 233, 377, 610,
    987,
  ],
  CUMULATIVE_PRIMES: [
    2, 5, 10, 17, 28,
    41, 58, 77, 100, 129,
    160, 197, 238, 281, 328,
    381, 440, 501, 568, 639,
    712, 791, 874, 963, 1060,
  ],
};
