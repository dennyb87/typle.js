(function($){

    var Typles = function(elem, options) {

        // element
        this.el = elem;
        // options
        this.options = $.extend({}, $.fn.typles.defaults, options);

        // typing speed
        this.typeSpeed = this.options.typeSpeed;
        // delay before typing
        this.startDelay = this.options.startDelay;
        // backspacing speed
        this.backSpeed = this.options.backSpeed;
        // delay before backspacing
        this.backDelay = this.options.backDelay;

        // number of loops 0 = infinite
        this.loopCount = this.options.loopCount;
        // true = infinite
        this.infiniteLoop = (this.loopCount < 1) ? true : false;
        // current loop number
        this.curLoop = 0;

        // show cursor
        this.showCursor = this.options.showCursor;
        // custom cursor
        this.cursorChar = this.options.cursorChar;
        // cursor blink animation through javascript
        this.cursorBlink = this.options.cursorBlink;
        // cursor blink speed
        this.blinkSpeed = this.options.blinkSpeed;
        // cursor element from the DOM
        this.cursor = null;

        // cursor class
        this.cursorClass = 'typles-cursor';
        // class for visible elements
        this.showClass = 'typles-show';

        // characters references
        this.characters = [];
        // characters widths
        this.charsWidths = [];
        // characters length
        this.charsLength = 0;
        // initial character index
        this.charPos = 0;
        // element width that is the sum of charsWidths
        this.elemWidth = 0;

        // setup the plugin before run
        this.setup();
    };

    Typles.prototype = {

        constructor: Typles,

        typewrite: function() {

            var self = this,
                // get current char
                char = this.characters[this.charPos],
                // check if current char is the last one
                lastChar = this.charPos === (this.charsLength - 1),
                // calculate distance to perform by sum the widths of
                // the remaining characters to type and convert it to
                // percent to get responsiveness
                idx = this.charPos + 1,
                step = this.charsWidths.slice(0, idx),
		        distance = this.sumArray(step),
		        percent = (distance / this.elemWidth) * 100;

            // stop cursor blink on typing
		    this.stopBlink();

            self.timeout = setTimeout(function() {

		        $(char).toggleClass(self.showClass);
		        $(self.cursor).css({'left' : percent+'%'});

		        if (lastChar){
		            // custom callback call
		            self.options.onStringTyped();
		            // start cursor blink on string typed
		            self.startBlink();

		            self.curLoop++;
		            // check if is the last iteration
		            var endLoop = self.curLoop === self.loopCount;
		            // return if loop is not inifite and loop is ended
                    if (!self.infiniteLoop && endLoop) {
                        return;
                    }
                    return setTimeout(function() {
                        self.backspace();
                    }, self.backDelay);
		        }

		        self.charPos++;
		        return self.typewrite();

            }, self.humanDelay(self.options.typeSpeed));
        },

        backspace: function(){

            var self = this,
                // get current char
                char = this.characters[this.charPos],
                // check if current char is the last one
                lastChar = this.charPos === 0,
                // calculate distance to perform by sum the widths of
                // the remaining characters to delete and convert it to
                // percent to get responsiveness
                idx = this.charPos,
                step = this.charsWidths.slice(0, idx),
		        distance = this.sumArray(step),
		        percent = (distance / this.elemWidth) * 100;

		    // stop cursor blink on backspacing
		    this.stopBlink();

            self.timeout = setTimeout(function() {

		        $(char).toggleClass(self.showClass);
		        $(self.cursor).css({'left' : percent+'%'});

		        if (lastChar){
		            // custom callback call
		            self.options.onStringDeleted();
		            // start cursor blink on string deleted
		            self.startBlink();
                    return setTimeout(function() {
                        self.typewrite();
                    }, self.startDelay);
		        }

		        self.charPos--;
		        return self.backspace();

            }, self.humanDelay(self.options.backSpeed));
        },

        run: function() {
            // run the plugin!!!
            var self = this;
            self.timeout = setTimeout(function() {
                self.typewrite();
            }, self.startDelay);
        },

        setup: function() {
            // parse the element and replace every character
            // with a wrapped character
            // and store characters references
            this.characters = this.parse(this.el);
            // store characters length
            this.charsLength = this.characters.length;
            // store the width of every character in the sequence
            this.charsWidths = this.getCharWidths();
            // the width of the element from the sum of the characters
            this.elemWidth = this.sumArray(this.charsWidths);
            // create cursor and insert in the DOM
            // start blink if this.cursorBlink is true
            this.cursor = this.cursorInit();
            // run the plugin
            this.run();
        },

        sumArray: function(arr) {
            // initial value 0 permit to return 0 for empty array
            return arr.reduce(
                function(a, b){
                    return a + b;
            }, 0);
        },

        humanDelay: function(speed) {
            // simulate delay of human typing
            return Math.round(Math.random() * 70) + speed;
        },

        getCharWidths: function(){
            // get characters widths
            var charsWidths = [];
            $.each(this.characters, function(i, chr){
                charsWidths.push($(chr).width());
            });
            return charsWidths;
        },

        cursorInit: function() {
            // create cursor and append it to the element
            var self = this,
                cursor = this.wrapChar(this.cursorChar);

            if (this.showCursor) {
                self.startBlink();
                cursor.addClass(this.showClass);
            };

            cursor.addClass(this.cursorClass);
            $(this.el).append(cursor);

            return cursor;
        },

        startBlink: function(){
            if (!this.cursorBlink || !this.showCursor){ return; };
            var self = this;
            self.blink = setInterval(function() {
                self.cursor.toggleClass(self.showClass);
            }, self.blinkSpeed);
        },

        stopBlink: function(){
            if (!this.cursorBlink || !this.showCursor){ return; };
            clearInterval(this.blink);
            this.cursor.addClass(this.showClass);
        },

        wrapChar: function(chr) {
            // wrap character in a span element
            return $('<span>').text(chr);
        },

        charToSpan: function(node) {
            // it put each character of the text node in a span element
            // return a list of span elements
            // with one sigle character each
		    var self = this,
		        text = $(node).text().trim().split(''),
		        wrappedchars = [];
		    $.each(text, function(i, chr){
		        var wrapper = self.wrapChar(chr)
		        wrappedchars.push(wrapper);
		    })

            // replace text node with span elements
            $(node).replaceWith(wrappedchars);

		    return wrappedchars;
        },

        parse: function(elem) {
            // it's a recursive method and it traverse all children
            // in search for text nodes, it return a list of span
            // elements with one single character each
            var self = this,
                nodes = $(elem).contents(),
                characters = [];

		    $.each(nodes, function(i, node){
                var isElementNode = node.nodeType === Node.ELEMENT_NODE,
		            isTextNode = node.nodeType === Node.TEXT_NODE,
		            wrappedchars = [];
		        if (isElementNode){
		            wrappedchars = self.parse(node);
		        } else if (isTextNode){
		            wrappedchars = self.charToSpan(node);
		        }
		        characters = characters.concat(wrappedchars);
		    });

		    return characters;
        },
    };

    $.fn.typles = function(options) {

        return this.each(function() {

            var elem = $(this),
                instance = elem.data('typles');
            // Return if this element already has a plugin instance
            if (instance){
                return;
            }
            // pass options to plugin constructor
            var typles = new Typles(this, options);
            // Store plugin object in this element's data
            elem.data('typles', typles);
        });
    };

    $.fn.typles.defaults = {
        // typing speed
        typeSpeed: 20,
        // delay before start typing
        startDelay: 1000,
        // backspacing speed
        backSpeed: 0,
        // delay before backspacing
        backDelay: 2000,
        // 0 = infinite
        loopCount: 0,
        // show cursor
        showCursor: true,
        // character for cursor
        cursorChar: "_",
        // simple blink animation through javascript
        cursorBlink: true,
        // cursor blink speed
        blinkSpeed: 300,
        // callback when string is typed
        onStringTyped: function() {},
        // callback when string is deleted
        onStringDeleted: function() {}
    };

})(jQuery);
