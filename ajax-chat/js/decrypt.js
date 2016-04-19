var algo='';
$('body').on('change','[name=algorithm1]',function()
	{
		 algo=$('#algorithm1').val();
		 if(algo==1 || algo==4 || algo==5)
		 {
			$('#decryptkey').show();

		 }
		 else
		 {
			 $('#decryptkey').hide();

		 }
		if(algo==2 || algo==3)
		{	
			 $('#prikey').show();
			 // $('#decryptkey').hide();
			
		}
		else
		{
			// $('#decryptkey').show();
			$('#prikey').hide();
		}
		if(algo==3 || algo==4)
		{
			// $('#prikey').show();
			$('#plaintext').show();

			// $('#decryptkey').hide();


		}
		else
		{	
			$('#plaintext').hide();
			// $('#prikey').hide();
			// $('#decryptkey').show();


		}
		if(algo==6)
		{
			
			$('#d').show();
			$('#n').show();
		}
		else
		{
			
			$('#d').hide();
			$('#n').hide();
		}
	});

// var sendplaintext=function(text)
// {
// plaintext=text;
// console.log(plaintext);
// }
$('#decryptbutton').click(function()
{	var plaintext=$('#plaintext').val();
	var ciphertext=$('#ciphertext').val();
	var decryptkey=$('#decryptkey').val();
	var encryptkey=$('#key').val();
function do_status(s) {
			document.getElementById('decryptstatusTime').value = s;
}
     if(algo==0)
		   	{
		   		bootbox.alert('Please provide decryption algorithm');

		   	}
		   	else
		   	{
		  //  		if(decryptkey!=encryptkey)
				// {

				// 	bootbox.alert('Key doesnt match');
				// }
			switch(algo) {
				
			    case '1':    //AES
			        var before = new Date();

			          var decrypted = CryptoJS.AES.decrypt(ciphertext, decryptkey);
					
				     var decryptedString=decrypted.toString(CryptoJS.enc.Utf8);
				     var after = new Date();
				     do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(decrypted) + " bytes";
				     document.getElementById('decryptedtext').value = decryptedString;
        
			         
			        break;
			    case '2':   //RSA
                    var before = new Date();

			        var privkey=$('#prikey').val();
			        var decrypt = new JSEncrypt();
         			 decrypt.setPrivateKey(privkey);
			         var uncrypted = decrypt.decrypt(ciphertext);
          			 var after = new Date();
			         do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(decrypt) + " bytes";

			         document.getElementById('decryptedtext').value = uncrypted;

          			$('#decryptedtext').value=uncrypted;
			        break;
			    case '3':   //Digital
                    var before = new Date();
			        
			    	var decypt=doVerify(ciphertext);
			    	 var after = new Date();
			        do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(decrypt) + " bytes";

			        // key = $('#key').val();''
			        break;
			    case '4':  //Hash
			        
			        // console.log('decrypt:'+plaintext);
                    var before = new Date();
			        var hash = CryptoJS.HmacSHA256(plaintext, decryptkey);
  				    hash2 = CryptoJS.enc.Base64.stringify(hash);
  				     var after = new Date();
			         do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(hash) + " bytes";

			        console.log("hash2 "+hash2);
			        if(ciphertext===hash2)
			        {
                     document.getElementById('decryptedtext').value = "This signature is *VALID*";

			        }
			        else
			        {
                      document.getElementById('decryptedtext').value = "This signature is *INVALID*";

			        }
			        // key = $('#key').val();
			        // encrypted = Crypto.HMAC(Crypto.SHA1, text, key);
			        break;
			 		case '5':
                    var before = new Date();
			 		var decypted=AESDecryptCtr(ciphertext,decryptkey,256);
			 		 var after = new Date();
			        do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(decrypted) + " bytes";

                    document.getElementById('decryptedtext').value = decypted;

			 		     break;
			 	    case '6':
 				   var before = new Date();

			 	    var decypted=RSADecrypt();
			 	     var after = new Date();
			        do_status("Decryption Time: " + (after - before) + "ms");
			         // document.getElementById('decryptmemory').value = "Memory Used: "+sizeof(decrypted) + " bytes";

			 	         break;
			    default:
			        console.log(false);
			}
		}
			// console.log(encrypted);

});