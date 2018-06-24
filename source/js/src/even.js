(function (window) {
  'use strict';

  var Even = {};

  Even.backToTop = function () {
    var $backToTop = $('#back-to-top');

    $(window).scroll(function () {
      if ($(window).scrollTop() > 100) {
        $backToTop.fadeIn(1000);
      } else {
        $backToTop.fadeOut(1000);
      }
    });

    $backToTop.click(function () {
      $('body,html').animate({ scrollTop: 0 });
    });
  };

  Even.mobileNavbar = function () {
    var $mobileNav = $('#mobile-navbar');
    var $mobileNavIcon = $('.mobile-navbar-icon');
    var slideout = new Slideout({
      'panel': document.getElementById('mobile-panel'),
      'menu': document.getElementById('mobile-menu'),
      'padding': 180,
      'tolerance': 70
    });
    slideout.disableTouch();

    $mobileNavIcon.click(function () {
      slideout.toggle();
    });

    slideout.on('beforeopen', function () {
      $mobileNav.addClass('fixed-open');
      $mobileNavIcon.addClass('icon-click').removeClass('icon-out');
    });

    slideout.on('beforeclose', function () {
      $mobileNav.removeClass('fixed-open');
      $mobileNavIcon.addClass('icon-out').removeClass('icon-click');
    });

    $('#mobile-panel').on('touchend', function () {
      slideout.isOpen() && $mobileNavIcon.click();
    });
  };

  Even.toc = function () {
    var SPACING = 20;
    var $toc = $('.post-toc'),
        $footer = $('.post-footer');

    if ($toc.length) {
      var minScrollTop = $toc.offset().top - SPACING;
      var maxScrollTop = $footer.offset().top - $toc.height() - SPACING;

      var tocState = {
        start: {
          'position': 'absolute',
          'top': minScrollTop
        },
        process: {
          'position': 'fixed',
          'top': SPACING
        },
        end: {
          'position': 'absolute',
          'top': maxScrollTop
        }
      }

      $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();

        if (scrollTop < minScrollTop) {
          $toc.css(tocState.start);
        } else if (scrollTop > maxScrollTop) {
          $toc.css(tocState.end);
        } else {
          $toc.css(tocState.process);
        }
      })
    }

    var HEADERFIX = 30;
    var $toclink = $('.toc-link'),
        $headerlink = $('.headerlink');

    var headerlinkTop = $.map($headerlink, function (link) {
      return $(link).offset().top;
    });

    $(window).scroll(function () {
      var scrollTop = $(window).scrollTop();

      for (var i = 0; i < $toclink.length; i++) {
        var isLastOne = i + 1 === $toclink.length,
            currentTop = headerlinkTop[i] - HEADERFIX,
            nextTop = isLastOne ? Infinity : headerlinkTop[i+1] - HEADERFIX;

        if (currentTop < scrollTop && scrollTop <= nextTop) {
          $($toclink[i]).addClass('active');
        } else {
          $($toclink[i]).removeClass('active');
        }
      }
    });
  };

  Even.fancybox = function () {
    if ($.fancybox){
      $('.post').each(function () {
        $(this).find('img').each(function () {
          $(this).wrap('<a class="fancybox" href="' + this.src + '" title="' + this.alt + '"></a>');
        });
      });

      $('.fancybox').fancybox({
        openEffect	: 'elastic',
        closeEffect	: 'elastic'
      });
    }
  };

  Even.visits = function () {
    var $visits = $('.post-visits');

    function updateVisits(dom, time) {
      var text = dom.text() + ' ' + time;
      dom.text(text);
    }

    function addCounter(Counter) {
      var query = new AV.Query(Counter);

      var url = $visits.data('url').trim();
      var title = $visits.data('title').trim();

      query.equalTo('url', url);
      query.find().then(function (results) {
        if (results.length > 0) {
          var counter = results[0];
          counter.save(null, {
            fetchWhenSave: true
          }).then(function (counter) {
            counter.increment('time', 1);
            return counter.save();
          }).then(function (counter) {
            updateVisits($visits, counter.get('time'));
          });
        } else {
          var newcounter = new Counter();
          newcounter.set('title', title);
          newcounter.set('url', url);
          newcounter.set('time', 1);

          newcounter.save().then(function (counter) {
            updateVisits($visits, newcounter.get('time'));
          });
        }
      }, function (error) {
        console.log('Error:' + error.code + " " + error.message);
      });
    }

    function showTime(Counter) {
      $visits.each(function () {
        var $this = $(this);
        var query = new AV.Query(Counter);
        var url = $this.data('url').trim();

        query.equalTo('url', url);
        query.find().then(function (results) {
          if (results.length === 0) {
            updateVisits($this, 0);
          } else {
            var counter = results[0];
            updateVisits($this, counter.get('time'));
          }
        }, function (error) {
          console.log('Error:' + error.code + " " + error.message);
        });
      })
    }

    if (typeof AV === 'object') {
      var Counter = AV.Object.extend('Counter');
      if ($visits.length === 1) {
        addCounter(Counter);
      } else {
        showTime(Counter);
      }
    }
  }

  var inputArea = document.querySelector("#local-search-input");
  var getSearchFile = function(){
    var path = "https://liuyou2015.github.io/search.xml";
    Even.search(path);
  }

  inputArea.onfocus = function(){ getSearchFile() }

  Even.search = function (path) {
    var $search = $('#search')
    var $mask = $('#mask')
    var $header = $('#search-header')
    var $input = $('#local-search-input')
    var $result = $('#local-search-result')

    $search.click(function () {
      $('.search').show();
      if ($('.search-wrapper').hasClass('syuanpi')) {
        $('.search-wrapper').addClass('bloom')
      }
    })
    $mask.click(function () {
      if ($('.search-wrapper').hasClass('syuanpi')) {
        $('.search-wrapper').removeClass('bloom').addClass('dead').one('webkitAnimationEnd AnimationEnd', function() {
          $(this).removeClass('dead');
          $('.search').hide();
        })
      } else $('.search').hide();
    })
    $header.click(function () {
      if ($('.search-wrapper').hasClass('syuanpi')) {
        $('.search-wrapper').removeClass('bloom').addClass('dead').one('webkitAnimationEnd AnimationEnd', function() {
          $(this).removeClass('dead');
          $('.search').hide();
        })
      } else $('.search').hide();
    })

    $.ajax({
      url: path,
      dataType: 'xml',
      success: function (xmlResponse) {
        var searchData = $('entry', xmlResponse).map(function () {
          return {
            title: $('title', this).text(),
            content: $('content', this).text(),
            url: $('url', this).text()
          };
        }).get();

        $input.on('input', function (e) {
          if (e.target.value.length == 0 || e.target.value == '') {
            $header.removeClass('slide')
            $input.removeClass('slide')
            $result.removeClass('slide')
            $header.removeClass('fadeOut').addClass('fadeIn')
            $result.html('');
            console.log('none!')
          } else {
            $header.addClass('slide')
            $input.addClass('slide')
            $result.addClass('slide')
            $header.removeClass('fadeIn').addClass('fadeOut')
            $result.show();
            var str = '<ul class=\"search-result-list syuanpi back-1 riseIn-light\"  style=\"color:white\">';
            var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
            $result.html('');
            if (this.value.trim().length <= 0) {
              return;
            }
            searchData.forEach(function (data) {
              var isMatch = true;
              var content_index = [];
              var data_title = data.title.trim().toLowerCase();
              var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
              var data_url = data.url;
              var index_title = -1;
              var index_content = -1;
              var first_occur = -1;
              // only match artiles with not empty titles and contents
              if (data_title != '' && data_content != '') {
                keywords.forEach(function (keyword, i) {
                  index_title = data_title.indexOf(keyword);
                  index_content = data_content.indexOf(keyword);
                  if (index_title < 0 && index_content < 0) {
                    isMatch = false;
                  } else {
                    if (index_content < 0) {
                      index_content = 0;
                    }
                    if (i == 0) {
                      first_occur = index_content;
                    }
                  }
                });
              }
              // show search results
              if (isMatch) {
                str += "<a href='" + data_url + "' class='search-result-title'><li class='search-result-item'><font color=\"white\">" + data_title + "</font></a>";
                var content = data.content.trim().replace(/<[^>]+>/g, "");
                if (first_occur >= 0) {
                  // cut out 100 characters
                  var start = first_occur - 20;
                  var end = first_occur + 80;
                  if (start < 0) {
                    start = 0;
                  }
                  if (start == 0) {
                    end = 100;
                  }
                  if (end > content.length) {
                    end = content.length;
                  }
                  var match_content = content.substr(start, end);
                  // highlight all keywords
                  keywords.forEach(function (keyword) {
                    var regS = new RegExp(keyword, "gi");
                    match_content = match_content.replace(regS, "<span class=\"search-keyword\">" + keyword + "</span>");
                  });

                  str += "<p class=\"search-result\">" + match_content + "...</p>"
                }
                str += "</li>";
              }
            });
            str += "</ul>";
            str += "<hr class='end-line'>";
            $result.html(str);
          }
        })
      }
    })
  }

  window.Even = Even;
})(window);
