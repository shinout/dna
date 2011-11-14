var dna = {};

/**
 * complStrand
 * make a complementary strand of str
 * @param string  str  : DNA sequence
 * @param boolean rev  : if true, reverse the sequence. (5' -> 3'). default: false.
 * @param boolean rna: if true, T -> U . default: false.
 * @return string : complementary DNA sequence
 */
dna.complStrand = function(str, rev, rna) {
  var ret = [];
  var i = 0;
  str.split('').forEach(function(c) {
    switch (c) {
      case 'a':
        ret[i] = rna ? 'u' : 't';
        break;
      case 'A':
        ret[i] = rna ? 'U' : 'T';
        break;
      case 't':
      case 'u':
        ret[i] = 'a';
        break;
      case 'T':
      case 'U':
        ret[i] = 'A';
        break;
      case 'c':
        ret[i] = 'g';
        break;
      case 'C':
        ret[i] = 'G';
        break;
      case 'g':
        ret[i] = 'c';
        break;
      case 'G':
        ret[i] = 'C';
        break;
      default:
        ret[i] = c;
        break;
    }
    i++;
  });
	return (rev) ? ret.reverse().join('')
							 : ret.join('');
}


/**
 * getRandomFragment
 * get random DNA fragment
 * @param number  len  : fragment length
 * @return string : DNA fragment
 */
dna.getRandomFragment = function(len, rna) {
  var fragment = '';
  for (var i=0; i<len; i++) {
    var p = Math.random();
    if (p > 0.75) {
      fragment += 'A';
    }
    else if (p > 0.5) {
      fragment += 'G';
    }
    else if (p > 0.25) {
      fragment += (rna) ? 'U' : 'T';
    }
    else {
      fragment += 'C';
    }
  }
  return fragment;
}

dna.CHROM_CODES = {
  X : 23,
  Y : 24,
  M : 25
};

for (var i=1; i<=22; i++) {
  dna.CHROM_CODES[i] = i;
}

Object.freeze(dna.CHROM_CODES);

dna.CHROM_NAMES = Object.keys(dna.CHROM_CODES).reduce(function(ret, name) {
  var code = dna.CHROM_CODES[name];
  ret[code] = name;
  return ret;
}, {});

Object.freeze(dna.CHROM_NAMES);

/**
 *
 * getChromCode
 * 
 * get the code (id) of a given chromosome
 *
 * chr9  -> 9
 * chr22 -> 22
 * chrX  -> 23
 * chrY  -> 24
 * chrM  -> 25
 *
 * others: -> throw exception
 **/
dna.getChromCode = function(name) {
  name = name.toString();
  if (name.toLowerCase().indexOf("chr") == 0) {
    name = name.slice(3);
  }
  var ret = dna.CHROM_CODES[name.toUpperCase()];
  if (!ret) throw new Error("chromosome not found");
  return ret;
};

module.exports = dna;
