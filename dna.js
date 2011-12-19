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


/**
 * the codes of chromosome
 **/
dna.CHROM_CODES = {
  X : 23,
  Y : 24,
  M : 25
};

for (var i=1; i<=22; i++) {
  dna.CHROM_CODES[i] = i;
}

Object.freeze(dna.CHROM_CODES);



/**
 * code => chromosome name
 **/
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
 *
 * @param name     : name of a chromosome
 * @param alphabet : if true, chrX -> X, chrY -> Y, chrM -> M
 **/
dna.getChromCode = function(name, alphabet) {
  name = name.toString();
  var i = name.length;
  var rawCode = '';
  while (--i >= 0) {
    var ch = name.charAt(i);
    if (isNaN(Number(ch))) {
      if (!rawCode) {
        rawCode = ch;
      }
      break;
    }
    rawCode = ch + rawCode;
  }

  var ret = dna.CHROM_CODES[rawCode.toUpperCase()];
  if (!ret) {
    throw new Error("chromosome not found");
  }
  if (alphabet) {
    return dna.CHROM_NAMES[ret];
  var ret = dna.CHROM_CODES[rawCode.toUpperCase()];
  }
  return ret;
};

/**
 *
 * getChromList
 * 
 * get possible rnames from the code
 *
 * 9  -> [9, chr9, Chr9, CHR9, chrom9, Chrom9, CHROM9]
 *
 * @param (string or number) code : chromosome code or chromosome name
 * @param (function) fn: function with its arguments each rname canditate.
 *                       returns some value when rname is valid,
 *                       returns false when invalid.
 *                       if this argument is set,
 *                       getChromList returns the value fn returns.
 **/

dna.getChromList = function(code, fn) {
  var name = dna.CHROM_NAMES[code];
  if (!name) {
    name = dna.CHROM_NAMES[dna.getChromCode(code)];
    if (!name) {
      throw new Error("code must be number");
    }
  }

  var list = [name,
          "chr" + name,
          "Chr" + name, 
          "CHR" + name, 
          "chrom" + name, 
          "Chrom" + name, 
          "CHROM" + name ];

  if (typeof fn != "function") {
    return list;
  }

  var ret = false;

  for (var i=0, l=list.length; i<l; i++) {
    ret = fn(list[i]);
    if (ret) break;
  }

  return ret;
};


/**
 * 0-based coordinate to 1-based coordinate
 **/
dna.getPosLen = function(start, end) {
  start = dna.numberize(start, "start");
  end   = dna.numberize(end, "end");
  var len = end - start;
  var pos = start + 1;

  if (pos <= 0) {
    throw new Error('pos must be larger than 0. start: ' + start + ', end: ' + end);
  }
  if (len <= 0) {
    throw new Error('length must be larger than 0. start: ' + start + ', end: ' + end);
  }
  return [pos, len];
};


/**
 * 1-based coordinate to 0-based coordinate
 **/
dna.getStartEnd = function(pos, len) {
  pos = dna.numberize(pos, "pos");
  len = dna.numberize(len, "len");
  var start = pos - 1;
  var end   = start + len;

  if (start < 0) {
    throw new Error('start must be greater than 0 or 0. pos: ' + pos + ', len: ' + len);
  }
  if (end <= start) {
    throw new Error('end must be less than start. pos: ' + pos + ', len: ' + len);
  }
  return [start, end];
};


/**
 * numberize n. If NaN, throw error or set default
 **/
dna.numberize = function() {
  var n = Array.prototype.shift.call(arguments);
  var _default, name;

  Array.prototype.forEach.call(arguments, function(v) {
    if (typeof v == 'number') {
      _default = v;
    }
    else if (typeof v == 'string') {
      name = v;
    }
    return v;
  });

  var ret = Number(n);
  if (isNaN(n)) {
    if (_default == undefined) {
      throw new Error((name ? name : n) + ' is NaN.');
    }
    else {
      return _default;
    }
  }
  return ret;
};

module.exports = dna;
