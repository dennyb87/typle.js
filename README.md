# Typles
Jquery plugin for memorable titles

##Usage summary
Typles allow you to apply a human typing effect on your titles or whatever.
The only limitation is to use span, with other element it could work not properly.

##How it works
Typles start to parse the target element in search for text nodes and replace them with a list of span elements containing one sigle character each. In that way you can align your titles as you wish and get responsiveness.

##Example
Html
```
<span class="typles">
    Jquery<span class="highlight">Typles</span><noscript>_</noscript>
</span>
```
Javascript
```
$('.typles').typles({
    loopCount: 0,
    showCursor: true,
    cursorBlink: true,
});
```
