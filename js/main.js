$.scrollingParallax('img/bg-tile.png', {
	disableIE6: true,
	bgRepeat: true
});

$(function() {

	$('.star').randomPos();

	/* Preload graphics*/

	preload([
		'img/bg-tile.png',
		'img/stars-sprite.png',
//        'img/explosion-1.png',
		'img/explosion-2.png',
		'img/explosion-3.jpg'
	]);

	/* Apply parallax scroll handler*/

	window.onscroll = scrollHandler;

	/* Apply text message with Google font */

	WebFontConfig = {
		google: { families: [ 'Marck+Script::latin,cyrillic' ] }
	};
	$('body').append('<script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"></script>');
	var msg = getParameterByName('msg');
	if (msg) {
		$('.message').text(msg);
	}

	/* Generate custom message link */

	$('.new-msg').on('change, click, paste, keydown, keyup', function(){
        $('.message').text($(this).val());
    })
    $('.generator form').on('submit', function(e) {
		e.preventDefault();
		shortenUrl(generateMsgUrl());
	});

    $('.once-more').on('click', function(e) {
        e.preventDefault();
        onceMore();
    });
});

function scrollHandler() {
	var delta = document.body.offsetHeight - $('.meteor').offset().top - 700;

	if (delta > 2100) {
		// in outer space
	} else if (delta > 1560) {
		$('.futurama').addClass('crash');
	} else if (delta > 1250) {
		$('.kenny').addClass('crash');
	} else if (delta > 670) {
		$('.hammer').addClass('crash');
	} else if (delta > 100) {
		// hit atmosphere
		$('.moon').addClass('crash').children('.moon-full').removeClass('visible');
	} else if (delta > -100) {
		// dig into the planet
		$('.meteor').addClass('visible pause');
		$('.earth').addClass('visible');
		$('.fire-1').addClass('blink');
		$('.fire-2').addClass('blink-2');
	} else {
		// planet chain explosion
		$('.meteor').removeClass('visible');
		$('.earth').removeClass('visible');
		$('.explosion-2').addClass('visible');
        $('.overlay').addClass('visible').children('.overlay-content').addClass('visible');
        $('.continuum, body>div:first-child').addClass('shake');
	}
}

function preload(arrayOfImages) {
	$(arrayOfImages).each(function() {
		(new Image()).src = this;
	});
}

function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function shortenUrl(url) {
	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
		url: 'http://is.gd/create.php',
		data: {
			format: 'json',
			'url': url
		},
		success: function(data) {
			$('.popup').showShortUrl(data.shorturl);
			$('.twitter').generateTwitterButton(data.shorturl);
		},
		error: function() {
			$('.popup').showShortUrl(url);
			$('.twitter').generateTwitterButton(url);
		}
	});
}
$.fn.showShortUrl = function(url) {
    $('.popup-overlay').addClass('visible');
	$(this).addClass('visible').find('.url').text(url);
	return this;
}
$.fn.generateTwitterButton = function(url) {
	$(this).html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url + '" data-size="large"></a>');
	$('body').append('<script src="http://platform.twitter.com/widgets.js"></script>');
	return this;
}
$.fn.randomPos = function() {
	var elemWidth = $(this).width(),
		elemHeight = $(this).height(),
		posX,
		posY;
	return this.each(function(i) {
		posX = (Math.random() * ($(document).width() - elemWidth)).toFixed();
		posY = (Math.random() * ($(document).height() - elemHeight)).toFixed();
		$(this).css({
			left: posX + 'px',
			top: posY + 'px',
			backgroundPosition: (-35 * i) + 'px 0'
		});
	});
}
function generateMsgUrl() {
	return 'http://' + window.location.host + window.location.pathname + '?msg=' + $('.generator .new-msg').val();
}

function onceMore() {
    $(document).scrollTop(0);
    window.location.reload();
}