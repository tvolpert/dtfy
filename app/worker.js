ajaxOne = new XMLHttpRequest();
ajaxTwo = new XMLHttpRequest();
var accessToken = {}
var resp = {}
var respString = {}
var trackName = {}
var previous = null;
var current = null;
 

onmessage = function(e) {
	console.log('this is majorTom to groundControl');
	accessToken = e.data[0];
	console.log('workyBoi sez: '+accessToken);
	transmissionOne();
	setInterval(transmissionTwo, 300);
		
}

function transmissionOne() {
	
	ajaxOne.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		resp = JSON.parse(ajaxOne.response).item;
		
		current = resp.name;
		console.log('now playing: ' + current + ' by ' +resp.artists[0].name +' cover art: '+ resp.album.images[0].url);
		postMessage([current, resp.artists[0].name, resp.album.images[0].url ]);
		}
	}		
	ajaxOne.open('GET','https://api.spotify.com/v1/me/player/currently-playing');
	ajaxOne.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	ajaxOne.send();

}

function transmissionTwo() {

	ajaxTwo.onreadystatechange = function() {
	
		if (this.readyState == 4 && this.status == 200) {
			resp = JSON.parse(ajaxTwo.response);
			respString = JSON.stringify(ajaxTwo.response);
			current = resp.item.name;
			if (previous && current && previous !== current) {
				console.log('comin in hot: ' + current + ' by ' +resp.item.artists[0].name +' cover art: '+ resp.item.album.images[0].url);
                postMessage([current, resp.item.artists[0].name, resp.item.album.images[0].url ]);
                }
			previous = current
		}
	}
	ajaxTwo.open('GET','https://api.spotify.com/v1/me/player/currently-playing');
	ajaxTwo.setRequestHeader('Authorization', 'Bearer ' + accessToken);
	ajaxTwo.send();

	}