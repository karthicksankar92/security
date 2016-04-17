var n=0,phi=0;
var p=123e10,q=123e10;
var e,d;
var msg="kota";
function get_e(phi){
	var rel=5;
   
   while (gcd(phi,rel)!=1)
      rel++;
   return rel;
}
function gcd(a,b){
	var r;
   while (b>0)
   {
      r=a%b;
      a=b;
      b=r;
   }
   return a;

}
function get_d(e)
{	d=1;
	while(d<phi)
	{
		if((d*e)%phi!=1) d=d+2;
		else break;
	}
return d;
}
function modular_pow(base, exponent, modulus){
    if (modulus ==1) return 0;
   	var c=1;
    for (e_prime = 1;e_prime<=exponent;e_prime++)
        c = (c * base)%modulus;
    return c;
}

function RSAEncrypt()
{

	var msg=document.getElementById('chatText').value;

	var p=parseInt(document.getElementById('p').value),q=parseInt(document.getElementById('q').value);
	if(is_prime(p)==true&&is_prime(q)==true)
	{
	n=p*q;
	phi=(p-1)*(q-1);
	
	e=get_e(phi);
	d=get_d(e);
	}
	else 
		alert("Enter prime numbers");

	
	document.getElementById('key_d').value=d;
	document.getElementById('key_n').value=n;
	document.getElementById('d').value=d;
	document.getElementById('n').value=n;
	c=modular_pow(msg, e,n);
	// console.log("c"+c);
	document.getElementById('ciphertext').value=c;
	return c;
}
function RSADecrypt()
{
	
var cipher=document.getElementById('ciphertext').value;

	var d=parseInt(document.getElementById('d').value),n=parseInt(document.getElementById('n').value);
	var plaintext=modular_pow(cipher, d,n);
	document.getElementById('decryptedtext').value=plaintext;

	return plaintext;
}
function is_prime(x)
{
	for(var i=2;i<x;i++)
	{
		if(x%i==0) return false;
	}
	return true;
}
