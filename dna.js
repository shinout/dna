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
 * getRandomSeq
 * get random DNA sequence
 * @param number  len  : sequence length
 * @return string : DNA sequence
 */
dna.getRandomSeq = function(len, rna) {
  var seq = '';
  for (var i=0; i<len; i++) {
    var p = Math.random();
    if (p > 0.75) {
      seq += 'A';
    }
    else if (p > 0.5) {
      seq += 'G';
    }
    else if (p > 0.25) {
      seq += (rna) ? 'U' : 'T';
    }
    else {
      seq += 'C';
    }
  }
  return seq;
};

dna.getRandomFragment = dna.getRandomSeq;


/**
 * get a formatted region expression string
 **/
dna.getFormat = function(chr, start, end, strand) {
  if (Array.isArray(chr)) {
  return chr[0] + ':' + chr[1] + '-' + chr[2] + ((chr[3]) ? ("," + chr[3]) : '');
  }
  if (typeof chr == 'object') {
  return chr.chr + ':' + chr.start + '-' + chr.end + ((chr.strand) ? ("," + chr.strand) : '');
  }
  return chr + ':' + start + '-' + end + ((strand) ? ("," + strand) : '');
};


/**
 * get chromosome, start, end from the following format
 * chr21:123456-4444444,+
 * returns array [chr, start, end, strand]
 **/
dna.parseFormat = function(str, objFormat) {
  var strand = str.slice(-2).charAt(1);
  var a = str.slice(0, -2).split(':');
  var startEnd = a.pop().split("-").map(function(v) { return Number(v) });
  var chr = a.join(':');
  startEnd.unshift(chr);
  startEnd.push(strand);


  return (objFormat) ? {
    chr    : startEnd[0],
    start  : startEnd[1],
    end    : startEnd[2],
    strand : startEnd[3],
  } : startEnd;
};


/**
 * write FASTA format to WritableStream
 *
 * rname   : reference name
 * seq     : sequence
 * wstream : default process.stdout
 * num     : the length of each line
 **/
dna.writeFasta = function(rname, seq, wstream, num) {
  if (!wstream) wstream = process.stdout;
  num = dna.numberize(num, 50);
  
  wstream.write('>' + rname + '\n');
  while (seq.length) {
    wstream.write(seq.slice(0, num) + '\n');
    seq = seq.slice(num);
  }
  wstream.write('\n');
};


/**
 * N * 200
 **/
Object.defineProperty(dna, 'N200', {
  value : (function() {
    var ret = [];
    for (var i=0; i<200; i++) ret.push('N');
    return ret.join('');
    })(),
  writable: false
});



/**
 * pad N till the total sequence length will be seq
 * seq       : sequence
 * len       : length (number)
 * options   :
 *   cutIfOver : if true && seq.length > len, cut the seq
 *   left      : if true, set N to left.
 **/
dna.padN = function(seq, len, options) {
  options || (options = {});
  len = dna.numberize(len, 'length');
  var till = len - seq.length;
  if (till < 0) {
    return (!!options.cutIfOver) ? seq.slice(0, len) : seq;
  }

  var Ns = '';

  while (till > 0) {
    if (till >= 200) {
      Ns += dna.N200;
      tills -= 200;
    }
    else {
      Ns += dna.N200.slice(0, till);
      till = 0;
    }
  }
  return (options.left) ? Ns + seq : seq + Ns;
};


/**
 * write FASTQ format to WritableStream
 *
 * name    : sequence name
 * seq     : sequence
 * qual    : base quality score (the length must be equal to that of seq)
 * wstream : WritableStream. default process.stdout
 *
 * returns true or false (writable or not)
 **/
dna.writeFastq = function(name, seq, qual, wstream) {
  if (seq.length != qual.length) throw new Error('seq.length does not match with qual.length');
  if (!wstream) wstream = process.stdout;
  
  return wstream.write(['@'+name, seq, '+', qual].join('\n') + '\n');
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
  if (n === false || isNaN(n)) {
    if (_default == undefined) {
      throw new Error((name ? name : n) + ' is NaN.');
    }
    else {
      return _default;
    }
  }
  return ret;
};


/**
 * code => chromosomes
 * hg19 compatible
 **/
dna.CHROM_NAMES = [
  'chrX'
 ,'chrY'
 ,'chrM'
 ,'chr6_ssto_hap7'
 ,'chr6_mcf_hap5'
 ,'chr6_cox_hap2'
 ,'chr6_mann_hap4'
 ,'chr6_apd_hap1'
 ,'chr6_qbl_hap6'
 ,'chr6_dbb_hap3'
 ,'chr17_ctg5_hap1'
 ,'chr4_ctg9_hap1'
 ,'chr1_gl000192_random'
 ,'chrUn_gl000225'
 ,'chr4_gl000194_random'
 ,'chr4_gl000193_random'
 ,'chr9_gl000200_random'
 ,'chrUn_gl000222'
 ,'chrUn_gl000212'
 ,'chr7_gl000195_random'
 ,'chrUn_gl000223'
 ,'chrUn_gl000224'
 ,'chrUn_gl000219'
 ,'chr17_gl000205_random'
 ,'chrUn_gl000215'
 ,'chrUn_gl000216'
 ,'chrUn_gl000217'
 ,'chr9_gl000199_random'
 ,'chrUn_gl000211'
 ,'chrUn_gl000213'
 ,'chrUn_gl000220'
 ,'chrUn_gl000218'
 ,'chr19_gl000209_random'
 ,'chrUn_gl000221'
 ,'chrUn_gl000214'
 ,'chrUn_gl000228'
 ,'chrUn_gl000227'
 ,'chr1_gl000191_random'
 ,'chr19_gl000208_random'
 ,'chr9_gl000198_random'
 ,'chr17_gl000204_random'
 ,'chrUn_gl000233'
 ,'chrUn_gl000237'
 ,'chrUn_gl000230'
 ,'chrUn_gl000242'
 ,'chrUn_gl000243'
 ,'chrUn_gl000241'
 ,'chrUn_gl000236'
 ,'chrUn_gl000240'
 ,'chr17_gl000206_random'
 ,'chrUn_gl000232'
 ,'chrUn_gl000234'
 ,'chr11_gl000202_random'
 ,'chrUn_gl000238'
 ,'chrUn_gl000244'
 ,'chrUn_gl000248'
 ,'chr8_gl000196_random'
 ,'chrUn_gl000249'
 ,'chrUn_gl000246'
 ,'chr17_gl000203_random'
 ,'chr8_gl000197_random'
 ,'chrUn_gl000245'
 ,'chrUn_gl000247'
 ,'chr9_gl000201_random'
 ,'chrUn_gl000235'
 ,'chrUn_gl000239'
 ,'chr21_gl000210_random'
 ,'chrUn_gl000231'
 ,'chrUn_gl000229'
 ,'chrUn_gl000226'
 ,'chr18_gl000207_random'
];

for (var i=22; i>=1; i--) {
  dna.CHROM_NAMES.unshift("chr" + i);
}

dna.CHROM_NAMES.unshift("chrNULL"); // for zero

Object.freeze(dna.CHROM_NAMES);

/**
 * chromosome name (lower case) => code
 **/
dna.CHROM_CODES = dna.CHROM_NAMES.reduce(function(ret, name, code) {
  ret[name.toLowerCase()] = code;
  return ret;
}, {});

Object.freeze(dna.CHROM_CODES);


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
 * @param nothrow  : if true and not found, returns the original value
 **/
dna.getChromCode = function(name, nothrow) {
  name = name.toString().split(/[ \t]+/g).join('').toLowerCase();
  var i = name.length;
  if (name.slice(0,3) != 'chr') {
    name = 'chr' + name;
  }
  if (name.slice(0, 10) == 'chromosome') {
    name = 'chr' + name.slice(10);
  }
  else if (name.slice(0, 5) == 'chrom') {
    name = 'chr' + name.slice(5);
  }

  var ret = dna.CHROM_CODES[name];
  if (!ret) {
    if (nothrow) return name;

    throw new Error("unknown chromosome name : " + name);
  }
  return ret;
};

/**
 *
 * getRegularName
 * 
 * get the canonical names of a given chromosome
 *
 * 9  -> chr9
 * chromosome22 -> chr22
 * CHRUN_GN000239 -> chrUn_gl000239
 * others: -> throw exception
 *
 * @param name     : name of a chromosome
 **/
dna.getRegularName = function(name) {
  return dna.CHROM_NAMES[dna.getChromCode(name)];
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
 * @param (function) fn: function with its arguments each rname candidate.
 *                       returns some value when rname is valid,
 *                       returns false when invalid.
 *                       if this argument is set,
 *                       getChromList returns the value fn returns.
 **/

dna.getChromList = function(code, fn) {
  var name = dna.CHROM_NAMES[code];
  if (!name) {
    name = dna.getChromCode(code, true);
  }

  var list = [name,
          "chr" + name,
          "Chr" + name, 
          "CHR" + name, 
          "chrom" + name, 
          "Chrom" + name, 
          "CHROM" + name,
          "chromosome" + name,
          "Chromosome" + name ];

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


module.exports = dna;
