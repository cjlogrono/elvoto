var primary_h = 0;
var colors = ["2e4874", "B32735","00ced1","FFB400"];
var interval;
var count = 0;
var x = Math.floor(Math.random() * 4);

function changeColor(count, turn){
  
      var c1;
      var c2;
      var d1; 
      var d2;
  
      switch(turn){
          
        case 0:
          c1 = colors[1];
          c2 = colors[0];
          break;
        
        case 1:
          c1 = colors[2];
          c2 = colors[1];
          break;
        case 2:
          c1 = colors[3];
          c2 = colors[2];
          break;
        
        case 3:
          c1 = colors[0];
          c2 = colors[3];
          break;
          
      }
  
      $('body')
        .css('background', '-moz-radial-gradient(center, ellipse cover,#'+c1+' '+count+'%, #'+c2+' '+count+'%,)')
        .css('background', '-webkit-radial-gradient(center, ellipse cover,#'+c1+' '+count+'%,#'+c2+' '+count+'%)')
        .css('background', 'radial-gradient(ellipse at center, #'+c1+' '+count+'%, #'+c2+' '+count+'%');
  
      if(count == 20){
        $('.header.active p').css('color', "#"+c1);
        $('.poll p').css('color', "#"+c2);
        $('.poll.answered .col-xs-8, .bar').css('background', "#"+c2);
      }
        
}

(function($){

    $.fn.autoFont = function(){
    
        this.each(function(){
        
          var cont = true;
          var divW = $(this).width();
          var divH = $(this).height();

          while(cont){

            var fSize = $(this).find('p').css('font-size');
            var size = Number(fSize.substr(0,(fSize.length - 2)));
            var pW = $(this).find('p').width();
            var pH = $(this).find('p').height();
            
            //console.log(divW + " - " + pW + " - " + divH + " - " + pH);
            
            if(pH < divH && pW < divW){

              $(this).find('p').css('fontSize', ++size);

            }else{

              if($(this).attr('id') === "create")
                $(this).find('p').css('fontSize', size - 15);
              else 
                $(this).find('p').css('fontSize', size - 1);
              cont = false;
            }
          }

          $(this).find('p').css('margin-top', ($(this).height() / 2) - ($(this).find('p').height() / 2));
          
        });
      
      
        if($('#signUp').length != 0)
          $('#signUp').find('p').css('fontSize', parseInt($('#create').find('p').css('font-size').slice(0,2))).css('top', ($('#signUp, #signOut').height() / 2) - ($('#signUp, #signOut').find('p').height() / 2));
        if($('#signOut').length != 0)
          $('#signOut').find('p').css('fontSize', parseInt($('#create').find('p').css('font-size').slice(0,2)) - 1).css('top', ($('#signUp, #signOut').height() / 2) - ($('#signUp, #signOut').find('p').height() / 2));
        if($('#create').length != 0)
        $('#search input').css('fontSize', parseInt($('#create').find('p').css('font-size').slice(0,2)));
    }
    
    $.fn.wallpaper = function(){
      console.log(x);
      interval = setInterval(function(){
          if(count === 100){
            count = 0;
            if(x == 3)
              x = 0;
            else
              x++;
            clearInterval(interval);
            setTimeout(function(){
            
              $('body').wallpaper();
            },4000);
          }else{
            count++;
            changeColor(count, x);
          } 
      }, 1);
    }

}(jQuery));

function optimize(){

	var w_width = $(window).width();

	if(primary_h == 0){
		if($(window).height() < 500)
			primary_h = 530;
		else
			primary_h = $(window).height();

	}else if(primary_h < $(window).height())
		primary_h = $(window).height();

	if(w_width < 320)
		w_width = 320;
  
  if(w_width > 768){
    $('#nav').css('height', primary_h * .075);
    $('main').css('height', primary_h * 0.925).css('padding-top', primary_h * 0.025);
  }else{
    $('#nav').css('height', primary_h * .15);
    $('main').css('height', primary_h * 0.85).css('padding-top', primary_h * 0.01);
  }
  $('.autoFont').autoFont();
  
}

function getTopPolls(){

  $.ajax({
		url: '/getTopPolls',
		data: {},
		method: 'POST'
	}).then(function (response) {
  
    var destination;
    if($('.active').length == 1)
      destination = "#topRecent";
    else
      destination = "#top";
    
    response.forEach(function(currentPoll){
    
      $(destination + " .pollCont").append('<div class="col-xs-12 col-md-6 poll"><div class="row"><div class="col-xs-12 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.poll+'?</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.one+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.two+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.three+'</p></div><div class="col-xs-6 autoFont">  <p style="font-size: 19px; top: 0.109375px;">'+currentPoll.four+'</p></div></div></div>');
    });
  }).catch(function (err){
  	console.error(err);
  });
}

function getRecentPolls(){

  $.ajax({
		url: '/getRecentPolls',
		data: {},
		method: 'POST'
	}).then(function (response) {
  
    var destination;
    if($('.active').length == 1)
      destination = "#topRecent";
    else
      destination = "#recent";
    
    response.forEach(function(currentPoll){
    
      $(destination + " .pollCont").append('<div class="col-xs-12 col-md-6 poll"><div class="row"><div class="col-xs-12 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.poll+'?</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.one+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.two+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.three+'</p></div><div class="col-xs-6 autoFont">  <p style="font-size: 19px; top: 0.109375px;">'+currentPoll.four+'</p></div></div></div>');
    });
  }).catch(function (err){
  	console.error(err);
  });
}

function getUserPolls(){

  $.ajax({
		url: '/getUserPolls',
		data: {},
		method: 'POST'
	}).then(function (response) {
    
    response.forEach(function(currentPoll){
    
      $("#myPolls .pollCont").append('<div class="col-xs-12 col-md-6 poll"><div class="row"><div class="col-xs-12 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.poll+'?</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.one+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.two+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.three+'</p></div><div class="col-xs-6 autoFont">  <p style="font-size: 19px; top: 0.109375px;">'+currentPoll.four+'</p></div></div></div>');
    });
  }).catch(function (err){
  	console.error(err);
  });
}

function getSearchPolls(key){

  $.ajax({
		url: '/getSearchPolls',
		data: {key:key},
		method: 'POST'
	}).then(function (response) {
    
    console.log(response);
    $('#searchResults').empty();
    response.forEach(function(currentPoll){
    
      $("#searchResults").append('<div class="col-xs-12 col-md-4 poll"><div class="row"><div class="col-xs-12 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.poll+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.one+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.two+'</p></div><div class="col-xs-6 autoFont"><p style="font-size: 19px; top: 0.109375px;">'+currentPoll.three+'</p></div><div class="col-xs-6 autoFont">  <p style="font-size: 19px; top: 0.109375px;">'+currentPoll.four+'</p></div></div></div>');
    });
  }).catch(function (err){
  	console.error(err);
  });
}

function loadPolls(){

  if($('#myPolls').length != 1){
    getTopPolls();
    getRecentPolls();
  }else{
    getUserPolls();
    if($('#top.active').length == 1)
      getTopPolls();
    else
      getRecentPolls();
  }
}

$(document).on('click', '#topRecent #recent', function(){
  
  $('#topRecent #top').removeClass('active');
  $('#topRecent #top p').css('color', 'black');
  $('#topRecent #recent').addClass('active');
  $('#topRecent #recent p').css('color', $('.poll p').css('color'));
  $('#topRecent .pollCont').empty();
  
  getRecentPolls();
});

$(document).on('click', '#topRecent #top', function(){
  
  $('#topRecent #recent').removeClass('active');
  $('#topRecent #recent p').css('color', 'black');
  $('#topRecent #top').addClass('active');
  $('#topRecent #top p').css('color', $('.poll p').css('color'));
  $('#topRecent .pollCont').empty();
  
  getTopPolls();
});

$(document).on('click', '#signInNow', function(){
  
  var data = {

		username: $('#username').val(),
		password: $('#password').val()
	};
  
	$.ajax({
		url: '/signInUser',
		data: data,
		method: 'POST'
	}).then(function (response) {
  
		if(response != "bad"){
      window.location = response.redirect;
    }else{
      alert("incorrect credentials");
    }
    
    
  	}).catch(function (err){
  		console.error(err);
  	});
});

$(document).on('click', '#signUpNow', function(){
  
  var data = {

		username: $('#username').val(),
		password: $('#password').val(),
    email: $('#email').val()
	};
  
	$.ajax({
		url: '/signUpUser',
		data: data,
		method: 'POST'
	}).then(function (response) {
  
		if(response == "email"){
      alert("email already exists");
		}else if(response == "username"){
      alert("username already exists");
    }else{
      alert("account created");
      window.location = "/signIn";
    }
    
  	}).catch(function (err){
  		console.error(err);
  	});
});

$(document).on('click', '#submitPoll', function(){
  
  var data = {

		poll: $('#pollQuestion').val().replace("?", ""),
		valueOne: $('#valueOne').val(),
    valueTwo: $('#valueTwo').val(),
    valueThree: $('#valueThree').val(),
    valueFour: $('#valueFour').val(),
	};
  
	$.ajax({
		url: '/submitPoll',
		data: data,
		method: 'POST'
	}).then(function (response) {
    
      alert("poll added");
      window.location = "/";
    
  	}).catch(function (err){
  		console.error(err);
  	});
});

$(document).on('focus', '#search input', function(){

	if($.trim($('#search input').val()) === 'Search for a poll here....'){

		$('#search input').val('');
	}

	$(this).keyup(function(){

		var keywords = $('#search input').val();
		var keywords_count = keywords.length;
		var w_width = $(window).width();

		if(keywords_count < 2){
      
      $('#search').removeClass('using');
      $('#top, #recent, #myPolls, #topRecent').css('display', '');
      $('#searchResults').remove();
      
    }else{
      
      $('#search').addClass('using');
      $('#top, #recent, #myPolls, #topRecent').css('display', 'none');
      
      if(!$('#searchResults').length){
        $('#search .row').append('<div class="col-xs-12" id="searchResults" style="height:80%; width: 90%; left: 5%;"></div>');
      }
      
      getSearchPolls(keywords);
    }

	});
}).on('blur', '#search input', function(){

	if($.trim($('#search input').val()) === ''){

		$('#search input').val('Search for a poll here....');
	}
});

$(document).on('click', '.poll', function(){
    
    window.location = "/poll/"+$(this).find('.col-xs-12 p').text().replace("?", "");
});

$('#ballot').submit(function(event){
    event.preventDefault();
    console.log('/pollVote/'+$('.header p').text().replace("?", "")+'?value='+$('input[name=pollValue]:checked').val());
    $.ajax({
      url: '/pollVote/'+$('.header p').text().replace("?", "")+'?value='+$('input[name=pollValue]:checked').val(),
      data: {},
      method: 'POST'
    }).then(function (response) {

      alert("ballot submitted!");
      window.location = "/poll/"+$('.header p').text().replace("?", "");
    }).catch(function (err){
      console.error(err);
    });
  
  });

$(document).on('click', 'form .button p', function(){

  $(document).find('#ballot').submit();
});

$(window).on('load', function(){
  
	$(document).ready(function(){

		optimize();
    $('body').wallpaper();
    loadPolls();
  });	
});

$(window).resize(function(){

  $('p').css('fontSize', 0);
	optimize();
});