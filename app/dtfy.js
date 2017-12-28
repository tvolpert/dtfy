// use fastCLick library to make mobile touch feel right
//come back to this^^^^


//prompts user to login and authorize scopes
var CLIENT_ID = 'eccb6aca22084f1488bb97ef71922766';
var REDIRECT_URI = 'http://timvolpert.com/dtfy/callback.html';
var scopes = [ //whatchu wanna do?
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'streaming',
		'user-read-recently-played',
]
var loginURL= 
	'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
	'&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
	'&scope=' + encodeURIComponent(scopes.join(' ')) +
	'&response_type=token';

var loginButton = document.getElementById('login-button');
var accessToken = {};
var expiresIn = {};
var templateSource = document.getElementById('result-template').innerHTML,
	template = Handlebars.compile(templateSource),
	resultsPlaceholder = document.getElementById('plop');
var majorTom = {};
var artistName = {};
var trackName = {};
var albumCoverURL = {};

 
	
 
	function logIn() {
		window.open(loginURL, 'Spotify', 'width=450,height=730');
		window.addEventListener('storage', acToke(event));
	}


loginButton.addEventListener('click', logIn);
	
	
	function acToke(event) {
		accessToken = localStorage.getItem('access_token');
		$('button').show();
		$('#plop').addClass('show');
		$('#login-button').hide();
		//window.setTimeout(logIn, 3600000); 
		majorTom = new Worker('/dtfy/app/worker.js');
		majorTom.postMessage([accessToken]);
		majorTom.addEventListener('message', incomingMsg);
	}
	
	function incomingMsg(e) {
		
		trackName = e.data[0];
		artistName = e.data[1];
		albumCoverURL = e.data[2];
		console.log('roger that majorTom.'+trackName+'by '+artistName);
		newJams();
		
	}
	
	function newJams() {
		$('#artist').html('<p>'+artistName+'</p>');
		$('#song').html('<p>'+trackName+'</p>');
		$('#album-cover').attr('src', albumCoverURL);
		$( '.name' ).each(function ( i, box ) {

					var width = $( box ).width(),
						html = '<span style="white-space:nowrap">',
						line = $( box ).wrapInner( html ).children()[ 0 ],
						n = 50;
					
					$( box ).css( 'font-size', n );

					while ( ($( line ).width() > width )  && ( $( box ).css('font-size') > '20px'  ) ) {
						$( box ).css( 'font-size', --n );
					}

					$( box ).text( $( line ).text() );

				})
	}
	
	function getSongInfo() {
			$.ajax ({
			type: 'get',
			url: 'https://api.spotify.com/v1/me/player/currently-playing',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			success: function(response){
				trackName = response.item.name;
				artistName = response.item.artists[0].name;
				albumCoverURL = response.item.album.images[0].url;
				console.log(trackName);
				console.log(artistName);
		
				
			},
			
		});
	}
	

	function nextTrack() {
		$.ajax({
			type: 'post',
            url: 'https://api.spotify.com/v1/me/player/next',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            },
			success: function(){
				
			}
        });
	}
	function prevTrack() {
		$.ajax({
			type: 'post',
            url: 'https://api.spotify.com/v1/me/player/previous',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            },
			success: function(){
					
			}
			
			
        });
	}
	function playIt() {
		$.ajax({
			type: 'put',
            url: 'https://api.spotify.com/v1/me/player/play',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            },
			success: function() {
				
				
			}
			
        });
	}
	function pauseIt() {
		$.ajax({
			type: 'put',
            url: 'https://api.spotify.com/v1/me/player/pause',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            },
			success: function() {
				
				
			}
			
        });
	}
	
	
	
	$('#next').click(nextTrack);
	$('#prev').click(prevTrack);
	$('#start-stop').click(playIt);
	$('#start-stop').click(pauseIt);
	
	
	
