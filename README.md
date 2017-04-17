# draw.swg.js
Small pure JS SVG library

### About
This library provides simple interface for manipulating SVG elements.

### Installation

 Install `draw.swg.js` file from `src/` directory and attach it to your view file:
```html
<script src="draw.svg.js"></script>
```

 Create your `<svg>` element:

```html
<svg id="svg-id"></svg>
```

Use drawSVG to initialize it:
```js
drawSVG.init('svg-id');
```

##### That's it! Now you are ready to use all *draw.swg.js* features.

### Docs
> All code is commented and easy to understand.

##### Low Level methods
Before you start, you need to create an empty `<path>` element by:
```js
drawSVG.createElement('element-id');
```
Now you can use simple pre-made methods to draw lines using `PathHelper`:
```js
PathHelper.moveTo(10,10);
PathHelper.lineTo(20,10);
```
> createElement() defines PathHelper itemId, so you dont need to set it by yourself, you can change it using `PathHelper.setItemId('id')`

You can also use cunstructions like this:
```js
PathHelper.moveTo(10,10).lineTo(20,10);
```
There is also a method to close your path:
```js
PathHelper.closePath();
```
The code above will create horizontal line (10px in length).(<img width=40px src="http://i.imgur.com/fQUxYFA.jpg">)
##### Pre-sets of basic figures
You can also use pre-made logic for:
<ul>
<li>Arrow</li>
<li>Rectangle(path)</li>
<li>Ellipse</li>
<li>Generatable line (used to generate long paths)</li>
</ul>

Example(arrow):
```js
//Draw an arrow from (20;110) to (60;160) with id 'arrow'
drawSVG.drawObject('arrow').arrow(20, 110, 60, 160);
```


arrow:<img src="http://i.imgur.com/3Zuyp5K.png">


The code above will create arrow, pointing from (10;10) to (50;50).

If you want to initialize an object and edit it after:
('false' wil not allow drowObject() create an element automaticly.)
```js
drawSVG.createElement('handled-ellipse');
//do some important stuff
drawSVG.drawObject('handled-ellipse', false).ellipse(400, 110, 300, 200);
```

circle:<img src="http://i.imgur.com/SPDIyxV.png">
<br>

The code above will create ellipse.
