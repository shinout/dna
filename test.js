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

/**
 * getChromCode
 **/
console.assert(22, dna.getChromCode("chromosome22"));
console.assert(23, dna.getChromCode("CHRX"));
console.assert(23, dna.getChromCode("CHROMX"));
console.assert(40, dna.getChromCode("chrUn_gl000222"));
console.assert(40, dna.getChromCode("ChrUn_GL000222"));
console.assert('chr12-afsd', dna.getChromCode("chr12-afsd", true));

/**
 * getRegularName
 **/
console.assert('chrX', dna.getRegularName("chrx"));
console.assert('chrX', dna.getRegularName("x"));
console.assert('chrX', dna.getRegularName("CHROMOSOME X"));
console.assert('chr21', dna.getRegularName("chrom 21"));
console.assert('chr21', dna.getRegularName("c h r o m 21"));


