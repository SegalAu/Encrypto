/*
* Encryption Script
* TEA-based text-encryption
* TEA encryption: https://en.wikipedia.org/wiki/Tiny_Encryption_Algorithm
*
*/

var output = document.getElementById('output');




//val: text to be encrypted
//key: symmetric key used for encryption/decryption

function encryptText(){
  //must convert val (of type string) to 2 32bit unsigned integers
  //init v1 and v2 32bit unsigned (init val = 0)
  //split val text into 2 32bit unsigned integers for all text
  //k:    formatted key (128 bits)
  //returnVal: encrypted text to be returned (string)
  val = escape(document.getElementById('input').value);
  key = document.getElementById('key').value;
  console.log('reached encryptText');
  
  var v = new Array(2);
  var i;
  var returnVal = "";
  var k = new Array(4); 

  k[0] = str2long(key.substr(0,4));
  k[1] = str2long(key.substr(4,4));
  k[2] = str2long(key.substr(8,4));
  k[3] = str2long(key.substr(12,4));


  for(i=0;i<val.length;i+=8){
    //str2long: helper function to convert text to 32bit unsigned integers
    v[0] = str2long(val.substr(i,4));
    v[1] = str2long(val.substr(i+4, 4));
    console.log(val.length);
    console.log(i);
    console.log(v[0]);
    console.log(v[1]);
    encryptPair(v, k);
    //encryptPair: encrypts pair of 32bit unsigned integers
    // => append 64bit segment of encrypted text to returnVal
    returnVal += long2str(v[0]) + long2str(v[1]);
  }

  //return encrypted string
  console.log(returnVal);
  output.value = escape(returnVal);
}

function decryptText(){
  //must convert val (of type string) to 2 32bit unsigned integers
  //init v1 and v2 32bit unsigned (init val = 0)
  //split val text into 2 32bit unsigned integers for all text
  //k:    formatted key (128 bits)
  //returnVal: encrypted text to be returned (string)
  val = unescape(document.getElementById('input').value);
  key = document.getElementById('key').value;

  var v = new Array(2);
  var i;
  var returnVal = "";
  var k = new Array(4); 

  k[0] = str2long(key.substr(0,4));
  k[1] = str2long(key.substr(4,4));
  k[2] = str2long(key.substr(8,4));
  k[3] = str2long(key.substr(12,4));

   for(i=0;i<val.length;i+=8){
    //str2long: helper function to convert text to 32bit unsigned integers
    v[0] = str2long(val.substr(i,4));
    v[1] = str2long(val.substr(i+4, 4));
    console.log(val.length);
    console.log(i);
    decryptPair(v, k);
    //decryptPair: encrypts pair of 32bit unsigned integers
    // => append 64bit segment of encrypted text to returnVal
    returnVal += long2str(v[0]) + long2str(v[1]);
  }

  if (returnVal.indexOf("\x00") != -1) {
    // strip trailing null chars resulting from filling 4-char blocks
    returnVal = returnVal.substr(0, returnVal.indexOf("\x00"));
  }

  //return encrypted string
  output.value = unescape(returnVal);
}


/*str2long:
*Converts string to a unique unsigned integers using
*charcode function
* l: 32 bit unsigned that is converted from 4 char string
*/
function str2long(str){
          //shift by multiple of 8 to fit 4 characters in 32bit unsigned
          //**ensures previous inputs aren't overwritten
  var l = str.charCodeAt(0) +
          (str.charCodeAt(1) << 8) +
          (str.charCodeAt(2) << 16) +
          (str.charCodeAt(3) << 24);
          console.log(l);
  return(l);
}

/*long2str:
*Converts assigned unique numeric long using
*fromcharcode function
*/
function long2str(lng){
  var s = String.fromCharCode(
    //'& 0xff' removes everything except least significant byte
    // 0xff => 00000000 00000000 00000000 11111111 , therefore AND + 0xff
    // removes everything except designated char (by adding
    // in right shift to position desired char at least sig byte)
     lng & 0XFF,
     lng>>8 & 0xFF,
     lng>>16 & 0xFF,
     lng>>24 & 0xFF);
    return(s);
}




function encryptPair(v, k){
  //numBits: operate on each bit of 32bit integers
  //retVal:  encrypted string to be returned
  var i;
  var sum = 0;
  var numBits = 32;
  var delta = 0x9e3779b9;
  var a = v[0];
  var b = v[1];
  var k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3]; 
  //taken from TEA encryption algorithm by David Wheeler and Roger Needham
  for(i=0;i<numBits;i++){
    sum+=delta;
    a+=((b<<4)+k0)^(b+sum)^((b>>>5)+k1);
    b+=((a<<4)+k2)^(a+sum)^((a>>>5)+k3);
  }

  //parent variable v1, v2: carry over changes made
  //                        back to encryptText
  console.log(a);
  v[0] = a;
  v[1] = b;
  console.log(v[0]);
  console.log(v[1]);

}

//very similar to encryptPair but reversed order
//when looping across for loop
function decryptPair(v, k){
  //numBits: operate on each bit of 32bit integers
  //retVal:  encrypted string to be returned
  //delta:   const provided by TEA algorithm
  var i;
  var sum = 0xC6EF3720;
  var numBits = 32;
  var delta = 0x9e3779b9;
  var a = v[0];
  var b = v[1];
  var k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3]; 
  //taken from TEA encryption algorithm by David Wheeler and Roger Needham
  for(i=0;i<numBits;i++){
    b-=((a<<4)+k2)^(a+sum)^((a>>>5)+k3);
    a-=((b<<4)+k0)^(b+sum)^((b>>>5)+k1);
    console.log(sum);
    sum-=delta;
  }

  //parent variable v1, v2: carry over changes made
  //                        back to encryptText
  v[0] = a;
  v[1] = b;
}

// Load data from user input.

console.log($('#key').val());

document.getElementById('encryptButton').addEventListener('click', encryptText);
document.getElementById('decryptButton').addEventListener('click', decryptText);