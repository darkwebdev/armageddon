
$.scrollingParallax('img/bg-tile.png', {
    disableIE6: true,
    bgRepeat: true
});
preload(['img/stars-sprite.png']);

$(function(){

    $('.star').randomPos();

    /* Preload graphics*/

    preload([
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

    $('.generator form').on('submit', function(e){
        e.preventDefault();
        shortenUrl(generateMsgUrl());
        $('.twitter a').data('url', generateMsgUrl());
    })
});

function scrollHandler() {
    var delta = document.body.offsetHeight - $('.meteor').offset().top -700;
    $('.debug').text(delta);

    if (delta > 2100) {
        // in outer space
        $('.futurama').removeClass('crash');
    } else if (delta > 1560) {
        $('.futurama').addClass('crash');
        $('.kenny').removeClass('crash');
    } else if (delta > 1250) {
        $('.kenny').addClass('crash');
        $('.hammer').removeClass('crash');
    } else if (delta > 670) {
        $('.hammer').addClass('crash');
        $('.moon').removeClass('crash');
    } else if (delta > 100) {
        // hit atmosphere
        $('.moon').addClass('crash').children('.moon-full').removeClass('visible');
        $('.explosion-1').removeClass('visible');
        $('.meteor').removeClass('pause');
        $('.fire-1').removeClass('blink');
        $('.fire-2').removeClass('blink-2');
    } else if (delta > 0) {
        // dig into the planet
	    $('.meteor').addClass('visible pause');
	    $('.earth').addClass('visible');
	    $('.explosion-1').addClass('visible');
	    $('.explosion-2').removeClass('visible');
	    $('.explosion-3').removeClass('visible');
	    $('.continuum, body>div:first-child').removeClass('shake');
	    $('.overlay').removeClass('visible').find('.popup').removeClass('visible');
        $('.fire-1').addClass('blink');
        $('.fire-2').addClass('blink-2');
    } else if ($('.explosion-1').hasClass('visible')){
        // planet chain explosion
	    $('.meteor').removeClass('visible');
	    $('.earth').removeClass('visible');
	    $('.explosion-1').removeClass('visible');
	    $('.explosion-2').addClass('visible');
	    if (!$('.explosion-3').hasClass('visible')) {
		    setTimeout(function(){
			    $('.explosion-2').removeClass('visible');
			    $('.explosion-3').addClass('visible');
			    $('.continuum, body>div:first-child').addClass('shake');
                $('.overlay').addClass('visible');
		    }, 500);
	    }
    }
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
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
        success: function(data){
            console.log(data.shorturl);
            $('.popup').addClass('visible').find('.url').text(data.shorturl);
        },
        error: function(){
            $('.popup').addClass('visible').find('.url').text(url);
        }
    });
}

$.fn.selectText = function() {
    var text = this[0],
        range,
        selection;
    if (document.body.createTextRange) { //ms
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) { //all others
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$.fn.randomPos = function() {
    var elemWidth = $(this).width(),
        elemHeight = $(this).height(),
        posX,
        posY;
    return this.each(function(i){
        posX = (Math.random() * ($(document).width() - elemWidth)).toFixed();
        posY = (Math.random() * ($(document).height() - elemHeight)).toFixed();
        $(this).css({
            left: posX + 'px',
            top: posY + 'px',
            backgroundPosition: (-35*i) + 'px 0'
        });
    });
}
function generateMsgUrl() {
    return 'http://' + window.location.host + window.location.pathname + '?msg='+$('.generator .new-msg').val();
}