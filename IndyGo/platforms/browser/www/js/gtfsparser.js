function readDropbox(sURL)
{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', sURL, true);
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				if(xmlhttp.status == 200) {
          console.log(xmlhttp.responseText);
				}
			}
		};
		xmlhttp.send(null);
	
}
