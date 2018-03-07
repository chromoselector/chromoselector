# Documentation
- [Index](../README.md)
  - [Demos](../README.md#demos)
  - [Features](../README.md#features)
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

# Methods
- [api()](#api)
- [destroy()](#destroy)
- [getColor()](#getColor)
- [getHeight()](#getHeight)
- [getWidth()](#getWidth)
- [hide()](#hide)
- [load()](#load)
- [reflow()](#reflow)
- [resize()](#resize)
- [save()](#save)
- [setColor()](#setColor)
- [show()](#show)
- [toggle()](#toggle)

## api()
Provides faster access to the ChromoSelector API.
#### Parameters
```None```
#### Return Value
An [API object](api-object.md)
#### See also
- [API object](api-object.md)

## destroy()
Destroys the color picker, unbinds all registered events and removes itself from the DOM.
#### Parameters
```None```
#### Return Value
```undefined```
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('input.color').chromoselector();
    // Destroy the color picker if we are about
    // to swap out the contents of the page
    $('#changePage').click(function () {
        $('input.color').chromoselector('destroy');
    });
});
```
#### See also
- [destroy event](events.md#destroy)

## getColor()
Retrieves to currently selected color in the picker.
#### Parameters
```None```
#### Return Value
A [Color object](color.md)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Get the current color
    var color = $('#myColorInput').chromoselector('getColor');
    // Print the color to the console in RGB formats
    console.log(color.getRgbString());
});
```
#### See also
- [Color Manipulation](color.md)

## getHeight()
Retrieves the current height of the picker in pixels.
#### Parameters
```None```
#### Return Value
Integer
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Prints the current height
    console.log($('#myColorInput').chromoselector('getHeight'));
});
```

## getWidth()
Retrieves the current width of the picker in pixels.
#### Parameters
```None```
#### Return Value
Integer
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Prints the current width
    console.log($('#myColorInput').chromoselector('getWidth'));
});
```

## hide()
Initiates a hide operation. Note that that the operation may be aborted if a [beforeHide](events.md#beforehide) event returns a value that evaluates to ```false```.
#### Parameters
- int **speed**: Optional. Duration of the transition animation in milliseconds
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Hide picker when the user clicks on an external close button
    $('#closeButton').click(function () {
        $('#myColorInput').chromoselector('hide');
    });
});
```
#### See also
- [beforeHide event](events.md#beforehide)

## load()
Loads the color value from the source text input into the color picker. (Triggers a redraw operation)
#### Parameters
```None```
#### Return Value
```self``` (Can be chained)
#### See also
- Dialog Demo

## reflow()
Repositions the color picker and the icon relatively to the source text input. Should be called when the layout of the page is updated.
#### Parameters
```None```
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    setTimeout(function () {
        // Hide the message at the top of the page
        $('#top_message').click(function () {
            // Fix the position of the colorpicker since the page layout has changed
            $('#myColorInput').chromoselector('reflow');
        });
    }, 1000);
});
```

## resize()
Resizes the color-picker to the specified width.
#### Parameters
- int **size**: The new width
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Set its width to 300px
    $('#myColorInput').chromoselector('resize', 300);
    // The above is the same as:
    // $('#myColorInput').chromoselector({ width:300 });
});
```

## save()
Saves the value of the currently selected color into the source text input.
#### Parameters
```None```
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Same as setting autosave to true
    $('input.color').chromoselector({
        autosave: false,
        update: function () {
            $(this).chromoselector('save');
        }
    });
});
```

## setColor()
Changes the currently selected color in the color picker. This method is serviced asynchronously, so the color change may not occur immediately.
#### Parameters
[Color](color.md) object | Object | string **color**: The new color
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    var $pickers = $('input.color').chromoselector();
    // Set color to green
    $pickers.chromoselector('setColor', '#0f0');
    // Set color to orange
    $pickers.chromoselector('setColor', '#ff8000');
    // Set color to blue
    $pickers.chromoselector('setColor', { r:0, g:0, b:1 });
    // Set color to aqua
    $pickers.chromoselector('setColor', { h:0.5, s:1, l:0.5 });
    // Set color to red
    $pickers.chromoselector('setColor', { c:0, m:1, y: 1, k:0 });
});
```
#### See also
- [Color Manipulation](color.md)

## show()
Shows the color picker.
#### Parameters
- int **speed**: Duration of the transition animation in milliseconds
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Show it immediately
    $('#myColorInput').chromoselector('show');
});
```

## toggle()
Shows the color picker, if it is hidden, and hides it, if it is shown.
#### Parameters
- int **speed**: Duration of the transition animation in milliseconds
#### Return Value
```self``` (Can be chained)
#### Examples
```js
$(document).ready(function () {
    // Create the color picker
    $('#myColorInput').chromoselector();
    // Show it immediately
    $('#myColorInput').chromoselector('toggle', 0);
    // Then hide it
    $('#myColorInput').chromoselector('toggle');
});
```
