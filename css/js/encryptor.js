/*
* Encryption Script
* TEA-based text-encryption
* TEA encryption: https://en.wikipedia.org/wiki/Tiny_Encryption_Algorithm
*
*/

//val: text to be encrypted
//key: symmetric key used for encryption/decryption

function encryptText(val, key){
  //must convert val (of type string) to 2 32bit unsigned integers
  //init v1 and v2 32bit unsigned (init val = 0)
  //split val text into 2 32bit unsigned integers for all text
  //newKey:    formatted key (128 bits)
  //returnVal: encrypted text to be returned (string)
  var v1;
  var v2;
  var count = 0;
  var newKey = new Array(4);
  var returnVal = "";
  while(count < val.length){
    //str2long: helper function to convert text to 32bit unsigned integers
    v1 = str2long(val.substring(count,4));
    v2 = str2long(val.substring(count+4, count+8));
    //increment to next pair of unsigned
    count += 8;
    //formatKey: take only first 16 bytes of key (TEA uses 128-bit key)
    //newKey: first 16 bytes of key (anything after is disregarded as TEA uses a 128-bit key)
    newKey = formatKey(key);
    //encryptPair: encrypts pair of 32bit unsigned integers
    // => append 64bit segment of encrypted text to returnVal
    returnVal += encryptPair(v1, v2, newKey);
  }

  //return encrypted string
  return(returnval);
}

function decryptText(val, key){
  //must convert val (of type string) to 2 32bit unsigned integers
  //init v1 and v2 32bit unsigned (init val = 0)
  //split val text into 2 32bit unsigned integers for all text
  //newKey:    formatted key (128 bits)
  //returnVal: encrypted text to be returned (string)
  var v1;
  var v2;
  var count = 0;
  var newKey;
  var returnVal = "";
  while(count < val.length){
    //str2long: helper function to convert text to 32bit unsigned integers
    v1 = str2long(val.substring(count,4));
    v2 = str2long(val.substring(count+4, count+8));
    //increment to next pair of unsigned
    count += 8;
    //formatKey: take only first 16 bytes of key (TEA uses 128-bit key)
    //newKey: first 16 bytes of key (anything after is disregarded as TEA uses a 128-bit key)
    newKey = formatKey(key);
    //encryptPair: encrypts pair of 32bit unsigned integers
    // => append 64bit segment of encrypted text to returnVal
    returnVal += decryptPair(v1, v2, newKey);
  }

  //return encrypted string
  return(returnval);
}


/*str2long:
*Converts string to a unique unsigned integers using
*charcode function
* l: 32 bit unsigned that is converted from 4 char string
*/
function str2long(str){
  var l = str.charCodeAt(0) +
          //shift by multiple of 8 to fit 4 characters in 32bit unsigned
          //**ensures previous inputs aren't overwritten
          (str.charCodeAt(1) << 8) +
          (str.charCodeAt(1) << 16) +
          (str.charCodeAt(1) << 24);
  return(l);
}

/*long2str:
*Converts assigned unique numeric long using
*fromcharcode function
*/
function long2str(long){
  var s = String.fromcharcode(
    //'& 0xff' removes everything except least significant byte
    // 0xff => 00000000 00000000 00000000 11111111 , therefore AND + 0xff
    // removes everything except designated char (by adding
    // in right shift to position desired char at least sig byte)
    (long & 0Xff,
    (long >> 8) & 0xff,
    (long >> 16) & 0xff,
    (long >> 24) & 0xff));
    return(s);
}

/*formatKey:
* return key as numeric only array of size 16 bytes
*/
function formatKey(k){
  var retK = [str2long(k.substr(0,4)),
              str2long(k.substr(4,4)),
              str2long(k.substr(8,4)),
              str2long(k.substr(12,4))];
  return retK;

}


function encryptPair(a, b, key){
  //numBits: operate on each bit of 32bit integers
  //retVal:  encrypted string to be returned
  var i;
  var sum = 0;
  var numBits = 32;
  var delta = 0x9e3779b9;
  var retVal = "";
  //taken from TEA encryption algorithm by David Wheeler and Roger Needham
  for(i=0;i<numBits;i++){
    sum+=delta;
    a+=((b<<4)+key[0])^(b+sum)^((b>>5)+key[1]);
    b+=((a<<4)+key[2])^(a+sum)^((a>>5)+key[3]);
  }

  //parent variable v1, v2: carry over changes made
  //                        back to encryptText
  v1 = a;
  v2 = b;
  retVal += (long2str(v1) + long2str(v2));
  //return sum
  return "poop";
}

//very similar to encryptPair but reversed order
//when looping across for loop
function decryptPair(a, b, key){
  //numBits: operate on each bit of 32bit integers
  //retVal:  encrypted string to be returned
  //delta:   const provided by TEA algorithm
  var i;
  var sum = 0;
  var numBits = 32;
  var delta = 0x9e3779b9;
  var retVal = "";
  //taken from TEA encryption algorithm by David Wheeler and Roger Needham
  for(i=0;i<numBits;i++){
    b+=((a<<4)+key[2])^(a+sum)^((a>>5)+key[3]);
    a+=((b<<4)+key[0])^(b+sum)^((b>>5)+key[1]);
    sum-=delta;
  }

  //parent variable v1, v2: carry over changes made
  //                        back to encryptText
  v1 = a;
  v2 = b;
  retVal += (long2str(v1) + long2str(v2));
  //return sum
  return retVal;
}
