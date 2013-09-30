(function() {
  $(function() {
    var initDebugger, initTouch, mobile, touchable;
    touchable = false;
    mobile = false;
    initTouch = function() {
      var p;
      p = navigator.platform;
      if ((p === 'iPad') || (p === 'iPhone') || (p === 'iPod')) {
        touchable = true;
      }
      if ((p === 'iPhone') || (p === 'iPod')) {
        return mobile = true;
      }
    };
    initTouch();
    initDebugger = function() {
      var body, clearDebugger, debugConsole, debugWindow;
      debugWindow = $('<div/>').attr({
        id: "flui-debug"
      });
      clearDebugger = $('<div/>').attr({
        id: "flui-debug-clear"
      });
      debugConsole = $('<div/>').attr({
        id: "flui-debug-console"
      });
      body = $('body');
      body.append(debugWindow);
      debugWindow.append(clearDebugger);
      debugWindow.append(debugConsole);
      return $('#flui-debug-clear').bind('click', function() {
        return $('#flui-debug-console').empty();
      });
    };
    window.flui = {
      touchable: touchable,
      mobile: mobile,
      preloadTransitions: function(time) {
        if (time === 0 || time === "undefined") {
          return $('html').removeClass('flui-preload');
        } else {
          return setTimeout(function() {
            return $('html').removeClass('flui-preload');
          }, time);
        }
      },
      console: function(message) {
        if (!($("#flui-debug").length > 0)) {
          initDebugger();
        }
        console.log(message);
        return $('#flui-debug-console').prepend(message + "<br/>");
      },
      openurl: function(url) {
        var a, body;
        if (flui.touchable) {
          a = $('<a/>', {
            "class": "hiddenurl",
            href: url,
            target: "_blank"
          });
          body = $('body');
          body.append(a);
          return $('.hiddenurl').trigger('click');
        } else {
          return window.open(url, "_self");
        }
      },
      confirm: function(message, confirmation, cancellation) {
        var modalTimer;
        if (flui.touchable) {
          if (confirm(message)) {
            return confirmation();
          } else {
            if (typeof cancellation !== "undefined") {
              return cancellation();
            }
          }
        } else {
          if (modalTimer !== null) {
            window.clearTimeout(modalTimer);
            modalTimer = null;
          }
          if (!($("#flui-modal").length > 0)) {
            initModal();
          }
          $('#flui-modal-message').html(message);
          $('#flui-modal').addClass('show');
          $('#flui-confirm').bind('click', function() {
            $('#flui-modal').removeClass('show');
            confirmation();
            return modalTimer = setTimeout(function() {
              return $('#flui-modal').remove();
            }, 5000);
          });
          return $('#flui-cancel').bind('click', function() {
            $('#flui-modal').removeClass('show');
            if (typeof cancellation !== "undefined") {
              cancellation();
            }
            return modalTimer = setTimeout(function() {
              return $('#flui-modal').remove();
            }, 5000);
          });
        }
      },
      slider: function(el) {
        return el.bind('change', function() {
          var newPlace, newPoint, offset, output, owidth, value, width;
          value = $(this).val();
          width = el.width();
          newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
          if (el.next().prop('tagName') === 'OUTPUT') {
            output = el.next("output");
            owidth = output.width();
            if (newPoint < 0) {
              newPlace = 0;
            } else if (newPoint > 1) {
              newPlace = width;
            } else {
              offset = newPoint * (owidth / width);
              newPlace = newPoint - offset;
            }
            return output.css({
              left: (newPlace * 100) + "%"
            }).val(value);
          }
        });
      },
      initSliders: function() {
        var sliders;
        sliders = $("input[type='range']");
        return sliders.map(function() {
          return flui.slider($(this));
        });
      },
      show: function(el, time) {
        el.css('display', 'block');
        if (time === 0 || time === "undefined") {
          return el.addClass('show');
        } else {
          return setTimeout(function() {
            return el.addClass('show');
          }, time);
        }
      },
      hide: function(el, time) {
        el.removeClass('show');
        if (time === 0 || "undefined") {
          return el.css('display', 'none');
        } else {
          return setTimeout(function(el) {
            return el.css('display', 'none');
          }, time);
        }
      },
      lCarousel: function(el) {
        var pos;
        pos = parseInt(el.css('left'));
        if (isNaN(pos)) {
          pos = 0;
        }
        return el.css('left', "" + (pos - 100) + "%");
      },
      rCarousel: function(el) {
        var pos;
        pos = parseInt(el.css('left'));
        return el.css('left', (pos + 100) + "%");
      },
      flyInMenu: function(el, direction) {
        var bottom, height, left, menuheight, menuwidth, screenheight, screenwidth, top, width;
        left = parseInt(el.css('left'));
        top = parseInt(el.css('top'));
        bottom = parseInt(el.css('bottom'));
        width = parseInt(el.css('width'));
        height = parseInt(el.css('height'));
        screenwidth = parseInt($('body').css('width'));
        screenheight = parseInt($('body').css('height'));
        menuwidth = Math.round(((width / screenwidth) * 100) * -1);
        menuheight = Math.round((height / screenheight) * 100);
        if (direction) {
          if (direction === 'left') {
            if (left < -1) {
              el.css('left', "0%");
            } else {
              el.css('left', "" + menuwidth + "%");
            }
          }
          if (direction === 'right') {
            if (left > 99) {
              el.css('left', "" + (100 + menuwidth) + "%");
            }
            if (left < 100) {
              el.css('left', "100%");
            }
          }
        }
        if (direction === 'bottom') {
          if (bottom < 0) {
            el.css("bottom", "0%");
          }
          if (bottom >= 0) {
            console.log(menuheight);
            return el.css("bottom", "" + (menuheight * -1) + "%");
          }
        }
      },
      flyAwayMenu: function(el, main, direction) {
        var left, menuwidth, screenwidth, width;
        left = parseInt(el.css('left'));
        width = parseInt(el.css('width'));
        screenwidth = parseInt($('body').css('width'));
        menuwidth = Math.round(((width / screenwidth) * 100) * -1);
        if (direction) {
          if (direction === 'left') {
            if (left < -1) {
              el.css('left', "0%");
              main.css('left', "" + (menuwidth * -1) + "%");
            } else {
              el.css('left', "" + menuwidth + "%");
              main.css('left', "0%");
            }
          }
          if (direction === 'right') {
            if (left > 99) {
              el.css('left', "" + (100 + menuwidth) + "%");
              main.css('left', "" + (menuwidth * 1) + "%");
            }
            if (left < 100) {
              el.css('left', "100%");
              return main.css('left', "0%");
            }
          }
        }
      },
      scrollable: function(el) {
        el = el.get(0);
        if (!el) {
          return;
        }
        return el.addEventListener('touchstart', function() {
          var startTopScroll;
          startTopScroll = el.scrollTop;
          if (startTopScroll <= 0) {
            el.scrollTop = 1;
          }
          if (startTopScroll + el.offsetHeight >= el.scrollHeight) {
            return el.scrollTop = el.scrollHeight - el.offsetHeight - 1;
          }
        }, false);
      },
      inscrollable: function(el) {
        return el.on('touchmove', function(e) {
          return e.preventDefault();
        });
      },
      orientable: function() {
        var adjustOrientationChange;
        if (mobile) {
          adjustOrientationChange = function() {
            switch (window.orientation) {
              case -0:
              case 0:
                return window.scrollTo(0, 1);
            }
          };
          adjustOrientationChange();
          return window.onorientationchange = function() {
            return adjustOrientationChange();
          };
        }
      },
      touchableForms: function() {
        var checkboxes, radios, txtinputs;
        if (touchable) {
          $('html').removeClass('flui-notouch');
          txtinputs = $("select, textarea, input[type='text'], input[type='password'], input[type='number'], input[type='email'], input[type='url'], input[type='search'], input[type='tel'], input[type='date'], input[type='datetime'], input[type='datetime-local'], input[type='color']");
          txtinputs.map(function() {
            var input;
            input = $(this);
            input.bind('touchstart', function(e) {
              return e.preventDefault();
            });
            return input.tap(function(e) {
              input.focus();
              return e.preventDefault();
            });
          });
          $('label[for]').bind('touchstart', function(e) {
            return e.preventDefault();
          });
          radios = $("input[type='radio']");
          radios.map(function() {
            var id, radio;
            radio = $(this);
            id = radio.prop('id');
            $(this).bind('touchstart', function(e) {
              $(this).prop('checked', false);
              return e.preventDefault();
            });
            $(this).tap(function(e) {
              $(this).prop('checked', true);
              return e.preventDefault();
            });
            return $("label[for='" + id + "']").tap(function(e) {
              radio.prop('checked', true);
              return e.preventDefault();
            });
          });
          checkboxes = $("input[type='checkbox']");
          return checkboxes.map(function() {
            var chkbox, id;
            chkbox = $(this);
            id = chkbox.prop('id');
            chkbox.bind('touchstart', function(e) {
              return e.preventDefault();
            });
            chkbox.tap(function(e) {
              var checked;
              checked = chkbox.prop('checked');
              if (checked === true) {
                chkbox.prop('checked', false);
              } else {
                chkbox.prop('checked', true);
              }
              return e.preventDefault();
            });
            return $("label[for='" + id + "']").tap(function(e) {
              var checked;
              checked = chkbox.prop('checked');
              if (checked === true) {
                chkbox.prop('checked', false);
              } else {
                chkbox.prop('checked', true);
              }
              return e.preventDefault();
            });
          });
        }
      },
      init: function() {
        flui.orientable();
        flui.touchableForms();
        return flui.initSliders();
      }
    };
    return flui.init();
  });

}).call(this);
