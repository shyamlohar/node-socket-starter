var myMsgContainer = "myMsgContainer";

$(function (){

	var username = $(".usernameField"),
		usernameBtn = $("#usernameBtn"),
		messageBox = $("#messageBox"),
		sendBtn = $("#messageBtn"),
		ul = $("ul"),
		wholePhone = $('#wholePhone'),
		msg;

	var elem = document.getElementById('chatUl');

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
							
				elem.scrollTop = elem.scrollHeight;	
				messageBox.val("");
			}
		});

		//--> When user types anything, broadcast characters to other clients.
		messageBox.on('propertychange change input paste keyup', function(event) {
			//To-Do: do nothing when user clicks on special keys like, Ctrl, Alt etc. 
			if(event.which !== 13){
				socket.emit('typing', $('#messageBox').val());
			}
			else{
				socket.emit('stoppedTyping');
			}
		});

		//--> When user starts typing, display typingLi <li> to broadcast what user is typing. and empty <li> when user hits enter.
		socket.on('someoneIsTyping', function(data){
			$('.typingLi').css('display', 'inline-block');
			if(data === "enter"){
				$('.typingLi').find('div').text('');
			}
			else
				$('.typingLi').find('div').text(data);
		});

		//--> Hides typingLi <li> when user stops typing. 
		socket.on('someoneHasStoppedTyping', function(){
			$('.typingLi').css('display', 'none');
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
	var newLi = $("<li class="+liClass+">  <div class="+divClass+"> </div> </li>");
	newLi.find('div').text(messageText);
	return newLi;
}