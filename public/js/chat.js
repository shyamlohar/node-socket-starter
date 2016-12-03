var myMsgContainer = "myMsgContainer";

$(function (){

	var username = $(".usernameField"),
		usernameBtn = $("#usernameBtn"),
		messageBox = $("#messageBox"),
		sendBtn = $("#messageBtn"),
		ul = $("#chatUl"),
		wholePhone = $('#wholePhone'),
		msgInputSendSection = $('#msgInputSendSection'),
		msg;

	var elem = ul;

	var socket = io.connect();
	
	socket.on('connect', function (){												//console.log('connect');
		//-->when user tries to set username by pressing enter key.
		username.keypress( function (event) {
			if(event.which === 13){
				usernameBtn.click();
			}
		});
	
		//-->When user tries to click Username Button.
		usernameBtn.click(function (){												//console.log('clicked');
			if(username.val() != ''){
				socket.emit('load', username.val());	
				wholePhone.fadeIn(2000).addClass("wholePhone");
				$('.headerSection').fadeOut(500);
			}
			else {
				alert('Add your name to proceed !');
			}
		});	

		//-->when user tries to send message by pressing enter key.
		messageBox.keypress( function (event){
			if(event.key == 'Enter' )
				sendBtn.click();
		});

		//-->When User tries to send message by clicking send button.
		sendBtn.click( function () {												//console.log('send button clicked');
			socket.emit('stoppedTyping');
			msg = messageBox.val();

			if(msg != ''){
				socket.emit('newMessage', msg);
				var myLi = addLi(msg, "myMsgContainer", "myMsg");				
				myLi.insertBefore('.typingLi').slideUp(0).fadeIn(500);				//ul.append(myLi.slideUp(0).fadeIn());
							
				//elem.scrollTop = elem.scrollHeight;
				elem.scrollTop(elem[0].scrollHeight);
				messageBox.val("");
			}
		});

		//--> When user types anything, broadcast characters to other clients.
		messageBox.on('propertychange change input paste', function(event) {

			if((messageBox.val() == '') && (event.which !== 8)){
				socket.emit('stoppedTyping');
			}

			if(messageBox.val() != ''){
				socket.emit('typing', $('#messageBox').val());
			}
			else{
				socket.emit('stoppedTyping');
			}
		});

		//--> When user starts typing, display typingLi <li> to broadcast what user is typing. and empty <li> when user hits enter.
		socket.on('someoneIsTyping', function(data){
			$('.typingLi').show();
			elem.scrollTop(elem[0].scrollHeight);
			if(data === "enter"){
				$('.typingLi').find('div').text('');
			}
			else
				$('.typingLi').find('div').text(data);
		});

		//--> Hides typingLi <li> when user stops typing. 
		socket.on('someoneHasStoppedTyping', function(){
			$('.typingLi').hide();
		});

		//--> Broadcast message to evety other client on server.
		socket.on('broadcastMessage', function (data){
			var otherLi = addLi(data, "yourMsgContainer", "otherMsg");
			otherLi.insertBefore('.typingLi').slideUp(0).fadeIn(500);				//ul.append(otherLi.slideUp(0).fadeIn());
			
			var elem = document.getElementById('chatUl');
			elem.scrollTop = elem.scrollHeight;
		});
	});
});

function addLi(messageText, liClass, divClass) {
	var newLi = $("<div class="+liClass+">  <div class="+divClass+"> </div> </div>");
	newLi.find('div').text(messageText);
	return newLi;
}