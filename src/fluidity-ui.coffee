$ ->
  touchable = false
  mobile = false

  initTouch = ->
    p = navigator.platform
    if (p == 'iPad') or (p == 'iPhone') or (p == 'iPod')
      touchable = true
    if (p == 'iPhone') or (p == 'iPod')
      mobile = true
  initTouch()

  initDebugger = ->
    debugWindow = $('<div/>').attr({id:"flui-debug"})
    clearDebugger = $('<div/>').attr({id:"flui-debug-clear"})
    debugConsole = $('<div/>').attr({id:"flui-debug-console"})
    body = $('body')
    body.append(debugWindow)
    debugWindow.append(clearDebugger)
    debugWindow.append(debugConsole)
    $('#flui-debug-clear').bind 'click', ->
      $('#flui-debug-console').empty()

  window.flui =
    touchable: touchable
    mobile: mobile

    preloadTransitions: (time)->
      if time is 0 or time is "undefined"
        $('html').removeClass 'flui-preload'
      else
        setTimeout ->
          $('html').removeClass 'flui-preload'
        , time

    console: (message) ->
      initDebugger() unless $("#flui-debug").length > 0
      console.log message
      $('#flui-debug-console').prepend(message + "<br/>")

    openurl: (url)->
      if flui.touchable
        a = $('<a/>' ,{class: "hiddenurl", href: url, target: "_blank"})
        body = $('body')
        body.append(a)
        $('.hiddenurl').trigger('click')
      else
        window.open(url, "_self")

    confirm: (message, confirmation, cancellation) ->
      if flui.touchable
        if confirm(message)
          confirmation()
        else
          cancellation() unless typeof cancellation is "undefined"
      else
        if modalTimer isnt null
          window.clearTimeout(modalTimer)
          modalTimer = null
        initModal() unless $("#flui-modal").length > 0
        $('#flui-modal-message').html(message)
        $('#flui-modal').addClass('show')

        $('#flui-confirm').bind 'click', ->
          $('#flui-modal').removeClass('show')
          confirmation()
          modalTimer = setTimeout ->
            $('#flui-modal').remove()
          , 5000

        $('#flui-cancel').bind 'click', ->
          $('#flui-modal').removeClass('show')
          cancellation() unless typeof cancellation is "undefined"
          modalTimer = setTimeout ->
            $('#flui-modal').remove()
          , 5000

    slider: (el) ->
      el.bind 'change', ->
        value = $(this).val()
        width = el.width()
        newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"))
        if el.next().prop('tagName') is 'OUTPUT'
          output = el.next("output")
          owidth = output.width()
          if newPoint < 0
            newPlace = 0
          else if newPoint > 1
            newPlace = width
          else
            offset = newPoint * (owidth/width)
            newPlace = newPoint - offset
          output.css({
            left: (newPlace * 100) + "%"
          }).val(value)

    initSliders: ->
      sliders = $("input[type='range']")
      sliders.map ->
        flui.slider $(this)

    show: (el, time) ->
      el.css 'display', 'block'
      if time is 0 or time is "undefined"
        el.addClass('show')
      else
        setTimeout ->
          el.addClass('show')
        , time

    hide: (el, time)->
      el.removeClass('show')
      if time is 0 or "undefined"
        el.css 'display', 'none'
      else
        setTimeout (el)->
          el.css 'display', 'none'
        , time

    lCarousel: (el) ->
      pos = parseInt el.css 'left'
      if isNaN(pos)
        pos = 0
      el.css 'left', "#{pos - 100}%"

    rCarousel: (el) ->
      pos = parseInt el.css 'left'
      el.css 'left', (pos + 100) + "%"

    flyInMenu: (el, direction) ->
      left = parseInt el.css('left')
      top = parseInt el.css('top')
      bottom = parseInt el.css('bottom')
      width = parseInt el.css('width')
      height = parseInt el.css 'height'
      screenwidth = parseInt $('body').css('width')
      screenheight = parseInt $('body').css('height')
      menuwidth = Math.round(((width / screenwidth) * 100) * -1)
      menuheight = Math.round((height / screenheight) * 100)
      if direction
        if direction is 'left'
          if left < -1
            el.css 'left', "0%"
          else
            el.css 'left', "#{menuwidth}%"
        if direction is 'right'
          if left > 99
            el.css 'left', "#{(100 + menuwidth)}%"
          if left < 100
            el.css 'left', "100%"
       if direction is 'bottom'
          if bottom < 0
            el.css "bottom", "0%"
          if bottom >= 0
            console.log menuheight
            el.css "bottom", "#{menuheight * -1}%"


    flyAwayMenu: (el, main, direction) ->
      left = parseInt el.css('left')
      width = parseInt el.css('width')
      screenwidth = parseInt $('body').css('width')
      menuwidth = Math.round(((width / screenwidth) * 100) * -1)
      if direction
        if direction is 'left'
          if left < -1
            el.css 'left', "0%"
            main.css 'left', "#{menuwidth * -1}%"
          else
            el.css 'left', "#{menuwidth}%"
            main.css 'left', "0%"
        if direction is 'right'
          if left > 99
            el.css 'left', "#{(100 +menuwidth)}%"
            main.css 'left', "#{menuwidth * 1}%"
          if left < 100
            el.css 'left', "100%"
            main.css 'left', "0%"

    scrollable: (el) ->
      el = el.get(0)
      if(!el)
        return
      el.addEventListener 'touchstart', ->
        startTopScroll = el.scrollTop
        if startTopScroll <= 0
          el.scrollTop = 1
        if startTopScroll + el.offsetHeight >= el.scrollHeight
          el.scrollTop = el.scrollHeight - el.offsetHeight - 1
      , false

    inscrollable: (el)->
      el.on 'touchmove', (e)->
        e.preventDefault()

    orientable: ->
      if mobile
        adjustOrientationChange = ->
          switch window.orientation
            when -0, 0
              window.scrollTo(0, 1)
        adjustOrientationChange()

        window.onorientationchange = ->
          adjustOrientationChange()

    # -------------------
    # Touch Enabled Forms
    # -------------------
    touchableForms: ->
      if touchable
        $('html').removeClass('flui-notouch')

        txtinputs = $("select, textarea, input[type='text'], input[type='password'], input[type='number'], input[type='email'], input[type='url'], input[type='search'], input[type='tel'], input[type='date'], input[type='datetime'], input[type='datetime-local'], input[type='color']")

        txtinputs.map ->
          input = $(this)
          input.bind 'touchstart', (e)->
            e.preventDefault()
          input.tap (e)->
            input.focus()
            e.preventDefault()

        $('label[for]').bind 'touchstart', (e)->
          e.preventDefault()

        radios = $("input[type='radio']")
        radios.map ->
          radio = $(this)
          id = radio.prop 'id'
          $(this).bind 'touchstart', (e)->
            $(this).prop('checked',false)
            e.preventDefault()
          $(this).tap (e)->
            $(this).prop 'checked',true
            e.preventDefault()
          $("label[for='#{id}']").tap (e)->
            radio.prop 'checked',true
            e.preventDefault()

        checkboxes = $("input[type='checkbox']")
        checkboxes.map ->
          chkbox = $(this)
          id = chkbox.prop 'id'
          chkbox.bind 'touchstart', (e)->
            e.preventDefault()
          chkbox.tap (e)->
            checked = chkbox.prop 'checked'
            if checked == true
              chkbox.prop 'checked',false
            else
              chkbox.prop 'checked', true
            e.preventDefault()
          $("label[for='#{id}']").tap (e)->
            checked = chkbox.prop 'checked'
            if checked == true
              chkbox.prop 'checked',false
            else
              chkbox.prop 'checked', true
            e.preventDefault()

# More UI


    init: ->
      flui.orientable()
      flui.touchableForms()
      flui.initSliders()
  flui.init()
