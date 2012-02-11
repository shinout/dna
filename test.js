function assert() {
	console.log.apply(console, arguments);
	console.assert(arguments[0] == arguments[1], arguments[2] || "FAILED");
}

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
  assert(poslen[0], c.pos);
  assert(poslen[1], c.len);

  var startend = dna.getStartEnd(c.pos, c.len)
  assert(startend[0], c.start);
  assert(startend[1], c.end);
});

/**
 * getChromCode
 **/
assert(22, dna.getChromCode("chromosome22"));
assert(23, dna.getChromCode("CHRX"));
assert(23, dna.getChromCode("CHROMX"));
assert(40, dna.getChromCode("chrUn_gl000222"));
assert(40, dna.getChromCode("ChrUn_GL000222"));
assert('chr12-afsd', dna.getChromCode("chr12-afsd", true));

/**
 * getRegularName
 **/
assert('chrX', dna.getRegularName("chrx"));
assert('chrX', dna.getRegularName("x"));
assert('chrX', dna.getRegularName("CHROMOSOME X"));
assert('chr21', dna.getRegularName("chrom 21"));
assert('chr21', dna.getRegularName("c h r o m 21"));

/**
 * padN 
 **/
assert('hogeNNNN', dna.padN("hoge", 8));
assert('NNNNNNhoge', dna.padN("hoge", 10, {left: true}));


/**
 * parseFormat
 **/
var fmt = "chr21:123456-4444444,+";
var parsed = dna.parseFormat(fmt);
assert(parsed[0], "chr21");
assert(parsed[1], 123456);
assert(typeof parsed[1], "number");
assert(parsed[2], 4444444);
assert(typeof parsed[2], "number");
assert(parsed[3], "+");

var parsed2 = dna.parseFormat(fmt, true);
assert(parsed2.chr, "chr21");
assert(parsed2.start, 123456);
assert(typeof parsed2.start, "number");
assert(parsed2.end, 4444444);
assert(typeof parsed2.end, "number");
assert(parsed2.strand, "+");



