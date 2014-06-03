dna
==========
Utility functions to handle DNA/RNA strings in bioinformatics. (Node.js)

## Installation ##
    
    git clone git://github.com/shinout/dna.git

    OR

    npm install dna

## API Documentation ##
- dna.complStrand(str, rev, rna)
- dna.getRandomSeq(len, rna)
- dna.getFormat(chr, start, end, strand)
- dna.parseFormat(str, objFormat)
- dna.writeFasta(rname, seq, wstream, num)
- dna.padN(seq, len, options)
- dna.writeFastq(name, seq, qual, wstream)
- dna.getPosLen(start, end)
- dna.getStartEnd(pos, len)
- dna.numberize()

### dna.complStrand(str, rev, rna) ###
Gets a complementary strand of **str**.

If **rev** is true, reverse the sequence. (5' -> 3').

If **rna** is true, T -> U .

    dna.complStrand("ACCTG") // TGGAC
    dna.complStrand("ACCTG", true) // CAGGT
    dna.complStrand("ACCTG", null, true) // UGGAC
    dna.complStrand("ACCTG", true, true) // CAGGU


### dna.getRandomSeq(len, rna) ###
Gets a random sequence with length **len**.

If **rna** is true, T -> U.


### dna.getFormat(chr, start, end, strand) ###
Gets a formatted position expression by four information.

Here is the formatted position expression.

    chr13:12345678-13456789,-
    <reference name>:<0 based start>-<0 based end>,<strand>

So this function returns

**chr**:**start**-**end**,**strand**


### dna.parseFormat(str, objFormat) ###
Parses **str** as a formatted position expression.

if **objFormat** is true, returns 

    { chr    : "chr13",
      start  : 12345678,
      end    : 13456789,
      strand : '-'
    }

By default, returns an array.

    ["chr13", 12345678, 13456789, '-']

### dna.writeFasta(rname, seq, wstream, num) ###
Writes fasta to **wstream**.

**rname** is the reference name. Required.

**seq** is the sequence to write. Required.

**wstream** is a writable stream. By default, process.stdout.

**num** is number to fold. By default, 50.

Returns nothing.

    dna.writeFasta("title", "GCTTCAA");
    // >title
    // GCTTCAA

### dna.padN(seq, len, options) ###
Pads N till the **seq**.length becomes **len**.

**seq** is a string.
**len** is a number.

**options** is optional object.

If **options.cutIfOver** is true, and **seq**.length > **len** already, cuts the **seq**.

If **options.left** is true, pads Ns to the right of **seq**. (N are padded at the right by default.)


    dna.padN("ACGA", 10) // ACGANNNNNN
    dna.padN("ACGA", 3)  // ACGA
    dna.padN("ACGA", 3, {cutIfOver: true})  // ACG
    dna.padN("ACGA", 10, {left: true}) // NNNNNNACGA


### dna.writeFastq(name, seq, qual, wstream) ###
Writes fastq to **wstream**.

**name** is the name of the sequence. Required.

**seq** is the sequence to write. Required.

**qual** is the base quality of the sequence. **qual**.length === ***seq***.length.

**wstream** is a writable stream. By default, process.stdout.

Returns boolean (the wstream is writable or not).

    dna.writeFastq("title", "GCTTCAA", "IIHHHAI");
    // @title
    // GCTTCAA
    // +
    // IIHHHAI


### dna.getPosLen(start, end) ###
Returns 1-based coordinate position and the length from 0-based coordinate start and end.

Returns an array.

Returns [**start**+1, **end**-**start**]

    dna.getPosLen(3, 10) // [4, 7]


### dna.getStartEnd(pos, len) ###
Returns 0-based coordinate start and end from 1-based coordinate position and the length.

Returns an array.

Returns [**pos**-1, **pos** + **len** -1]

    dna.getStartEnd(3, 10) // [2, 12]


### dna.numberize(num, _default) ###
### dna.numberize(num, name) ###

Numberize **num**.

If Number(num) is NaN, returns **_default** if given. Otherwise throw an error.
**name** is used to specify which number occurs the error.

    dna.numberize("14") // 14
    dna.numberize("AA", 10) // 10
    dna.numberize("AA", "position") // throws an error: "position is NaN"


## unstable APIs ##
### dna.getChromCode(name, nothrow) ###
Gets the code (id) of a given chromosome

- chr9  -> 9
- chr22 -> 22
- chrX  -> 23
- chrY  -> 24
- chrM  -> 25
- others: -> an exception is thrown.

**name** is the name of a chromosome.

If **nothrow** is true and not found, returns the original value.


### dna.getRegularName(name) ###
Gets the canonical names of a given chromosome.

- 9  -> chr9
- chromosome22 -> chr22
- CHRUN_GN000239 -> chrUn_gl000239
- others: -> throw exception

**name** is the name of a chromosome


### dna.getChromList(code, fn) ###
Gets possible reference names from the code

- 9  -> [9, chr9, Chr9, CHR9, chrom9, Chrom9, CHROM9]

**code** is a chromosome code or chromosome name

**fn** is optional.
Function with its arguments each rname candidate.
Returns some value when rname is valid,
Returns false when invalid.
If this argument is set, **dna.getChromList()** returns the value **fn** returns.

