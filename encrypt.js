function more()
{
     var index_url = "http://polarityweb.weebly.com/";
       chrome.tabs.create({
       url: index_url});
}

function text_update()
{
	var action = document.getElementById('action').value;
	var txt_in  = document.getElementById('text_input');
	var txt_out = document.getElementById('text_output');
	var txt_in_val = txt_in.value;
	if(action == 'Decryption')
	{
		txt_in_val = unescape(decodeURIComponent(atob(txt_in_val)));
	}
	var passwd = document.getElementById('passwd').value;
	localStorage["pass"] = passwd;
	var out = '';

	var p = 0;

	for(n in txt_in_val)
	{
		ch = txt_in_val[n];
		if(action == 'Encryption')
		{
			outbuf = ch.charCodeAt(0) + passwd[p].charCodeAt(0);
			outbuf = String.fromCharCode(outbuf);
			out += outbuf;
		}
		else if(action == 'Decryption')
		{
			outbuf = ch.charCodeAt(0) - passwd[p].charCodeAt(0);
			outbuf = String.fromCharCode(outbuf);
			out += outbuf;
		}

		p++;
		if(p == passwd.length) p = 0;
	}

	if(action == 'Encryption')
	{
		out = btoa(encodeURIComponent(escape((out))));
	}

	txt_out.value = out;
}
console.log($('#text_input').val());
document.getElementById('text_input').addEventListener('keyup', text_update);
document.getElementById('text_output').addEventListener('keyup', text_update);
document.getElementById('passwd').addEventListener('keyup', text_update);
document.getElementById('action').addEventListener('change', text_update);
document.getElementById('clickme').addEventListener('click', more);
document.addEventListener('DOMContentLoaded', load);
