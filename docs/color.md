# Documentation
- [Index](../README.md)
  - [Demos](../README.md#demos)
  - [Features](../README.md#features)
  - [Requirements](../README.md#requirements)
  - [Install](../README.md#install)
  - [Build](../README.md#build)
- [Screenshots](screenshots.md#screenshots)
- [Gettings started](getting-started.md#getting-started)
- API
  - [Properties](properties.md#properties)
  - [Events](events.md#events)
  - [Methods](methods.md#methods)
  - [Api Object](api-object.md#api-object)
  - [Overriding defaults](defaults.md#overriding-defaults)
  - [Color manipulation](color.md#color-manipulation)
- [Dimensions](dimensions.md#dimensions)
- [Theming](theming.md#theming)

# Color Manipulation
The color management module is Open Source and is available at [https://github.com/roccivic/color-module](https://github.com/roccivic/color-module).

#### Getting a color
Assuming that the plugin has already been instanciated, getting it's current color is an API call to [getColor()](methods.md#getcolor):
```js
var color = $("#myColorInput").chromoselector("getColor");
```

#### Setting a color
See the [setColor()](methods.md#setcolor) method in the API below for valid formats. The method may delay execution under load, so consider this a request to change the color, the actual color change may happen a little later.
```js
$("#myColorInput").chromoselector("setColor", aNewColor);
```

## Color API
Below is an overview of the Color class. Colors are internally stored in the color picker using objects of this class, and are also passed around the color picker API in a few methods.

If necessary, it is possible to access the Color object, through ```$.fn.chromoselector.Color```

```js
// Black
var color1 = new $.fn.chromoselector.Color();
// Red, see the setColor method for valid formats
var color2 = new $.fn.chromoselector.Color('#f00');
```

## Supported color formats
#### String color formats
```js
// HEX
"#ff8800"
// SHORTHAND HEX (input only)
"#f80"
// HEXA
"#ff8800ff"
// SHORTHAND HEXA (input only)
"#ff8f"
// RGB
"rgb(255,0,186)"
"rgb(100%,0%,20%)"  // input only
// RGBA
"rgba(255,0,186,0.5)"
"rgba(100%,0%,20%,0.5)" // input only
// HSL
"hsl(282,100%,37%)"
// HSLA
"hsla(282,100%,37%,0.5)"
// CMYK
"device-cmyk(0.3,1,0,0.27)"
```

#### Object color formats
All values are normalized between 0 and 1, inclusive.
```js
// RGB
{ r: 0.27, g: 0.12, b: 0 }
// RGBA
{ r: 0.27, g: 0.12, b: 0, a: 0.5 }
// HSL
{ h: 0.54, s: 0.15, l: 0.33 }
// HSLA
{ h: 0.54, s: 0.15, l: 0.33 a: 0.5 }
// CMYK
{ c: 0.3, m: 1, y: 0, k: 0.27 }
```

## Instanciating
```js
// defaults to black
var black = new $.fn.chromoselector.Color();
// use any supported format from above to create a specific color
var color1 = new $.fn.chromoselector.Color("#f80");
var color2 = new $.fn.chromoselector.Color("rgba(255,0,186,0.5)");
var color3 = new $.fn.chromoselector.Color({ h: 0.54, s: 0.15, l: 0.33 });
// Instanciate a new $.fn.chromoselector.Color object, using an existing Color object (create copy)
var color4 = new $.fn.chromoselector.Color(color3);
```

## Setting a color
```js
var color = new $.fn.chromoselector.Color();
// use any supported format from above to set a specific color
color.setColor("#f80");
color.setColor("rgba(255,0,186,0.5)");
color.setColor({ h: 0.54, s: 0.15, l: 0.33 });
// Set the new color, using an existing Color object
var anotherColor = new $.fn.chromoselector.Color("#0f0");
color.setColor(anotherColor);
```
The `setColor()` method is chainable to allow easy conversions.
```js
var color = new $.fn.chromoselector.Color();
color.setColor("#fff").getRgbaString();
color.setColor("#fff").getHsla();
```

## Getting a color
#### getHexString()
Returns the color as a string in hexadecimal format
```js
color.getHexString();
// returns
"#ff8800"
```
#### getHexaString()
Returns the color as a string in hexadecimal format, including the alpha channel
```js
color.getHexaString();
// returns
"#ff8800ff"
```
#### getRgbString()
Returns the color as a string in RGB format
```js
color.getRgbString();
// returns
"rgb(255,0,186)"
```
#### getRgbaString()
Returns the color as a string in RGBA format
```js
color.getRgbaString();
// returns
"rgba(255,0,186,0.5)"
```
#### getHslString()
Returns the color as a string in HSL format
```js
color.getHslString();
// returns
"hsl(282,100%,37%)"
```
#### getHslaString()
Returns the color as a string in HSLA format
```js
color.getHslaString();
// returns
"hsla(282,100%,37%,0.5)"
```
#### getCmykString()
Returns the color as a string in CMYK format
```js
color.getCmykString();
// returns
"device-cmyk(0.3,1,0,0.27)"
```
#### getRgb()
Returns the color an object in RGB format
```js
color.getRgb();
// returns
{ r: 0.27, g: 0.12, b: 0 }
```
#### getRgba()
Returns the color an object in RGBA format
```js
color.getRgba();
// returns
{ r: 0.27, g: 0.12, b: 0, a: 0.5 }
```
#### getHsl()
Returns the color an object in HSL format
```js
color.getHsl();
// returns
{ h: 0.54, s: 0.15, l: 0.33 }
```
#### getHsla()
Returns the color an object in HSLA format
```js
color.getHsla();
// returns
{ h: 0.54, s: 0.15, l: 0.33 a: 0.5 }
```
#### getCmyk()
Returns the color as JS object in CMYK format
```js
color.getCmyk();
// returns
{ c: 0.3, m: 1, y: 0, k: 0.27 }
```

## Getting a contrasting color
#### getTextColor()
Useful for when you are storing a background color and need to know whther to use white or black as a foreground.
```js
var color = new $.fn.chromoselector.Color("#ff0"); // yellow
color.getTextColor().getHexString();
// returns
"#000"
```

Change the input textfield colors on update
```js
$("#textfield").chromoselector({
    preview: false,
    update: function() {
        var color = $(this).chromoselector("getColor");
        $(this).css({
            "background-color": color.getHexString(),
            "color": color.getTextColor().getHexString()
        });
    }
});
```

## Manipulating the alpha channel alone
#### getAlpha()
```js
var color = new $.fn.chromoselector.Color({ h: 0.54, s: 0.15, l: 0.33 a: 0.5 });
color.getAlpha();
// returns
0.5
```
#### setAlpha()
```js
var color = new $.fn.chromoselector.Color({ h: 0.54, s: 0.15, l: 0.33 a: 0.5 });
color.setAlpha(color.getAlpha() - 0.1); // lower alpha by 10%
color.getAlpha();
// returns
0.4
```
The `setAlpha()` method is chainable.
```js
var color = new $.fn.chromoselector.Color();
color.setAlpha(0.5).getRgbaString();
```
