/**
 * complStrand
 * make a complementary strand of str
 * @param string  str  : DNA sequence
 * @param boolean rev  : if true, reverse the sequence. (5' -> 3'). default: false.
 * @param boolean rna: if true, T -> U . default: false.
 * @return string : complementary DNA sequence
 */
module.exports.complStrand = function(str, rev, rna) {
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
module.exports.getRandomFragment = function(len, rna) {
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

