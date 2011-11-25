var dna = require('./dna');

/**
 * poslen test
 **/
var poslen_cases = [
  {
    pos: 1345,
    len: 1001,
    start: 1344,
    end: 1344 + 1001,
    name : "normal01"
  }
  /**
   * TODO
   * more aggressive cases!!!!!!
   **/
];

poslen_cases.forEach(function(c) {
  var poslen = dna.getPosLen(c.start, c.end)
  console.assert(poslen[0] == c.pos);
  console.assert(poslen[1] == c.len);

  var startend = dna.getStartEnd(c.pos, c.len)
  console.assert(startend[0] == c.start);
  console.assert(startend[1] == c.end);
});
