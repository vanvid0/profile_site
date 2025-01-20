(function ($) {
  'use strict';

// PC/SP判定
// スクロールイベント
// リサイズイベント
// スムーズスクロール

  /* ここから */
  var break_point = 640;//ブレイクポイント
  var mql = window.matchMedia('screen and (max-width: '+break_point+'px)');//、MediaQueryListの生成
  var deviceFlag = mql.matches ? 1 : 0; // 0 : PC ,  1 : SP

// pagetop
  var timer = null;
  // var $pageTop = $('#pagetop');
  // $pageTop.hide();

// スクロールイベント
  $(window).on('scroll touchmove', function () {

    // スクロール中か判定
    if (timer !== false) {
      clearTimeout(timer);
    }

    // 200ms後にフェードイン
    timer = setTimeout(function () {
      if ($(this).scrollTop() > 100) {
        // $('#pagetop').fadeIn('normal');
      } else {
        // $pageTop.fadeOut();
      }
    }, 200);

    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    var footHeight = parseInt($('#footer').innerHeight());


    if (deviceFlag == 0) { // → PC
      if (scrollHeight - scrollPosition <= footHeight) {
        // 現在の下から位置が、フッターの高さの位置にはいったら
        // $pageTop.css({
        //   'position': 'absolute',
        //   'bottom': footHeight
        // });
      }
    } else { // → SP
      // $pageTop.css({
      //   'position': 'fixed',
      //   'bottom': '20px'
      // });
    }

  });


// リサイズイベント

  var checkBreakPoint = function (mql) {
    deviceFlag = mql.matches ? 1 : 0;// 0 : PC ,  1 : SP
    // → PC
    if (deviceFlag == 0) {
    } else {
      // →SP
    }
    deviceFlag = mql.matches;
  }

// ブレイクポイントの瞬間に発火
  mql.addListener(checkBreakPoint);//MediaQueryListのchangeイベントに登録

// 初回チェック
  checkBreakPoint(mql);



  var Header = {
    init:function(){
      this.$btn = $('.nav-btn');
      this.$nav = $('.nav-wrap');
      this.event();
    },
    event:function(){
      var _this = this;
      this.$btn.on('click',function(){
        if($(this).hasClass('active')){
          _this.close();
        }else{
          _this.open();
        }
      });
    },
    open:function(){
      this.$btn.addClass('active');
      this.$nav.addClass('active');
    },
    close:function(){
      this.$btn.removeClass('active');
      this.$nav.removeClass('active');
    }
  };
  Header.init();


// スムーズスクロール
// #で始まるアンカーをクリックした場合にスムーススクロール
  $('a[href^="#"]').on('click', function () {
    var speed = 500;
    // アンカーの値取得
    var href = $(this).attr('href');
    // 移動先を取得
    var target = $(href == '#' || href == '' ? 'html' : href);
    // 移動先を数値で取得
    var position = target.offset().top;

    // スムーススクロール
    $('body,html').animate({
      scrollTop: position
    }, speed, 'swing');
    return false;
  });


  /* animation
  ------------------------------*/

  // scroll effects
  $.fn.acs = function (options) {

    var elements = this;
    var defaults = {
      screenPos: 1.4,
      className: 'is-animated'
    };
    var setting = $.extend(defaults, options);


    $(window).on('load scroll', function () {
      add_class_in_scrolling();
    });

    function add_class_in_scrolling() {
      var winScroll = $(window).scrollTop();
      var winHeight = $(window).height();
      var scrollPos = winScroll + (winHeight * setting.screenPos);

      if (elements.offset().top < scrollPos) {
        elements.addClass(setting.className);
      }
    }
  }

  $('.anm, [class*="anm-"], .anm-list > *').each(function () {
    $(this).acs();
  });

  $('.c-text01-box > *,.c-text02-box > *,.home-tab-map > *').each(function () {
    $(this).acs();
  });



  // list animation delay
  $.fn.anmDelay = function (options) {
    var elements = this;
    var defaults = {
      delay: 0.2,
      property: 'animation-delay'
    };
    var setting = $.extend(defaults, options);

    var index = elements.index();
    var time = index * setting.delay;
    elements.css(setting.property, time + 's');
  }

  $('.anm-list > *').each(function () {
    $(this).anmDelay();
  });


  // var slider01 = $('.l-slider01-block__slider');
  // if(slider01[0]){
  //   slider01.slick({
  //     autoplay:true,
  //     slidesToShow:3,
  //     slidesToScroll:1,
  //     centerMode: true,
  //     speed:2000,
  //     nextArrow:'<button class="slick-next slick-arrow" aria-label="Next" type="button" style=""></button>',
  //     prevArrow:'<button class="slick-prev slick-arrow" aria-label="Prev" type="button" style=""></button>',
  //     responsive: [
  //       {
  //         breakpoint: 641,
  //         settings: {
  //           slidesToShow:1,
  //           speed:800,
  //         }
  //       }
  //     ]
  //   });
  // }

})(jQuery);

var ztxt = new Ztextify("h3", {
  event: "pointer",
});