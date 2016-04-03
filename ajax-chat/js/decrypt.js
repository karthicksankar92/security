var algo='';
$('body').on('change','[name=algorithm1]',function()
	{
		 algo=$('#algorithm1').val();
		if(algo==2)
		{
			$('#decryptkey').hide();
			$('#prikey').show();
		}
		else
		{
			$('#decryptkey').show();
			$('#prikey').hide();
		}
	});
var plaintext=''
var sendplaintext=function(text)
{
plaintext=text;
console.log(plaintext);
}
$('#decryptbutton').click(function()
{
	var ciphertext=$('#ciphertext').val();
	var decryptkey=$('#decryptkey').val();
	var encryptkey=$('#key').val();

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
			          var decrypted = CryptoJS.AES.decrypt(ciphertext.toString(), decryptkey);
			

				 var decryptedString=decrypted.toString(CryptoJS.enc.Utf8);
				 console.log(decryptedString);
			         document.getElementById('decryptedtext').value = decryptedString;

          			// $('#decryptedtext').value=decryptedString;
			         
			        break;
			    case '2':   //RSA
			        var privkey=$('#prikey').val();
			   console.log('Private:'+privkey);

			        var decrypt = new JSEncrypt();
         			 decrypt.setPrivateKey(privkey);
			    console.log('ciphertext:'+ciphertext);

          			var uncrypted = decrypt.decrypt(ciphertext);
          			console.log('decrypted:'+uncrypted);
			         document.getElementById('decryptedtext').value = uncrypted;

          			$('#decryptedtext').value=uncrypted;
			        break;
			    case '3':   //Digital
			        

			        // key = $('#key').val();''
			        break;
			    case '4':  //Hash
			        

			        console.log('decrypt:'+plaintext);
			        hash1= Crypto.HMAC(Crypto.SHA1, plaintext, encryptkey);
			        hash2= Crypto.HMAC(Crypto.SHA1, plaintext, decryptkey);
			        if(hash1===hash2)
			        {
			         document.getElementById('decryptedtext').value = plaintext;
			        }
			        // key = $('#key').val();
			        // encrypted = Crypto.HMAC(Crypto.SHA1, text, key);
			        break;
			 
			    default:
			        console.log(false);
			}
		}
			// console.log(encrypted);

});