# Typle.js
Jquery plugin for memorable titles

##Description
Typle.js allow you to apply a human typing effect on your titles or whatever.

##How it works
Typle.js start to parse the target element in search for text nodes and replace them with a list of span elements containing one sigle character each. In that way you can align your titles as you wish and get responsiveness.

##Example
Html
```
<span class="typle">
    Typle<span class="highlight">.js</span><noscript>_</noscript>
</span>
```
Javascript
```
$('.typle').typle({
    loopCount: 0,
    showCursor: true,
    cursorBlink: true,
});
```
