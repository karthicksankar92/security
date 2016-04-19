$('#compose-button').click(function (){

var algo=$('#algorithm').val();
var key = $('#key').val();
var text = $('#chatText').val();
var publickey=$('#pubkey').val();
var RSApublicKey= $('#key_d').val();
var RSAprivateKey=$('#key_n').val();
switch(algo) {
			    case '1':    //AES
			        
			            
	         document.getElementById('compose-subject').value = "AES key";
	         document.getElementById('compose-message').value = "Hi, I am sharing my AES Encryption key here. Use this key to decrypt the Ciphertext.\nKey: "+key;
			        
			        
			        break;
			    case '2':   //RSA
	         document.getElementById('compose-subject').value = "Your RSA Public key";
	         document.getElementById('compose-message').value = "Hi, I have used your RSA Public key to encrypt the text. Use your private key to decrypt the Ciphertext.\nYour Public key: "+publickey;
			 
			        break;
			    case '3':   //Digital
	         document.getElementById('compose-subject').value = "Digital Signature Information";
	         document.getElementById('compose-message').value = "Hi, I am sharing my Digital Signature Public key Certificate here and text I have send you. Please verify that the text you received was original.\nPlain Text: "+ text +"\nPublic Key: ";
			    
			        break;
			    case '4':  //Hash
			        
	         document.getElementById('compose-subject').value = "Hashing Information";
	         document.getElementById('compose-message').value = "Hi, I am sharing my Hashing function key here and text I have send you. Please verify that the text you recieved was original.\nPlain Text: "+ text +"\nKey: "+key;
			     
			        break;
			 	case '5':// AES builtin
	         document.getElementById('compose-subject').value = "AES My Own Implementation Key";
	         document.getElementById('compose-message').value = "Hi, I am sharing my AES own implementation Encryption key: "+ key +" here. Use this key to decrypt the Ciphertext";
			 	     
			 		break;
			 	case '6':
	         document.getElementById('compose-subject').value = "RSA Builtin Key";
	         document.getElementById('compose-message').value = "Hi, I am sharing my RSA own implementation key here. Use this key to decrypt the Ciphertext\nExponent: "+ RSApublicKey+"\nModulo key: "+RSAprivateKey;

			 	break
			    default:
	         document.getElementById('compose-subject').value = "Share your RSA Public Key";
	         document.getElementById('compose-message').value = "Hi, I would like to chat with you. Please share your Public Key to start the communication. ";

			        console.log(false);
			}

}); 