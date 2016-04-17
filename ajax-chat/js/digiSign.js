function doSign() {
  console.log("hi");
  var privkey=$('#pubkey').val();
  var plaintext = $('#chatText').val();

  console.log({key:key});

  var rsa = new RSAKey();

  rsa.readPrivateKeyFromPEMString(privkey);
  var hashAlg = $('#hashalg').val();
  var hSig = rsa.signString(plaintext, hashAlg);
  return hSig;
  console.log({hSig:hSig});
  // document.form1.siggenerated.value = linebrk(hSig, 64);
}

function doVerify(ciphertext,plaintext) {
 
  var sMsg = $('#plaintext').val();
  var hSig = ciphertext;
  var x509 = new X509();
  x509.readCertPEM($('#prikey').val());
  var isValid = x509.subjectPublicKeyRSA.verifyString(sMsg, hSig);

  // display verification result
  if (isValid) {
    document.getElementById('decryptedtext').value = "This signature is *VALID*";

    console.log("valid");
    // _displayStatus("valid");
  } else {
    document.getElementById('decryptedtext').value = "This signature is *INVALID*";

    console.log("invalid");

    // _displayStatus("invalid");
  }
}

function copyMsgAndSig() {
  _displayStatus("reset");
  document.form1.msgverified.value = document.form1.msgsigned.value; 
  document.form1.sigverified.value = document.form1.siggenerated.value; 
}

function _displayStatus(sStatus) {
  var div1 = document.getElementById("verifyresult");
  if (sStatus == "valid") {
    div1.style.backgroundColor = "skyblue";
    div1.innerHTML = "This signature is *VALID*.";
  } else if (sStatus == "invalid") {
    div1.style.backgroundColor = "deeppink";
    div1.innerHTML = "This signature is *NOT VALID*.";
  } else {
    div1.style.backgroundColor = "yellow";
    div1.innerHTML = "Please fill values below and push [Verify this sigunature] button.";
  }
}
