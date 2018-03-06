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

# Properties
- [General Properties](#general-properties)
  - [autosave](#autosave)
  - [autoshow](#autoshow)
  - [effect](#effect)
  - [eventPrefix](#eventPrefix)
  - [icon](#icon)
  - [iconalt](#iconalt)
  - [iconpos](#iconpos)
  - [lazy](#lazy)
  - [minWidth](#minWidth)
  - [maxWidth](#maxWidth)
  - [panel](#panel)
  - [panelAlpha](#panelAlpha)
  - [panelChannelWidth](#panelChannelWidth)
  - [panelChannelMargin](#panelChannelMargin)
  - [panelMode](#panelMode)
  - [panelModes](#panelModes)
  - [pickerClass](#pickerClass)
  - [preview](#preview)
  - [resizable](#resizable)
  - [roundcorners](#roundcorners)
  - [ringwidth](#ringwidth)
  - [shadow](#shadow)
  - [shadowColor](#shadowColor)
  - [speed](#speed)
  - [target](#target)
  - [width](#width)
- [Callbacks](#callbacks)
  - [save()](#save)
  - [load()](#load)
  - [str2color()](#str2color)
  - [color2str()](#color2str)

# General Properties

## autosave
Whether to automatically update the value in the source text input when the user selects a new color. In you set this to false, you will need to manually invoke the [save](methods.md#save) method on the chromoselector object when you would like for the color to be saved.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// This is the default
$(document).ready(function () {
    $('input.color').chromoselector({
        autosave: true
    });
});
```
```js
// This will save the color when the colorpicker loses focus
$(document).ready(function () {
    $('input.color').chromoselector({
        autosave: false
    }).blur(function () {
        $(this).chromoselector('save');
    });
});
```

## autoshow
Whether to automatically show the color picker when the source text input receives focus. If you set this to false, you will need to manually invoke the [show](methods.md#show) and [hide](methods.md#hide)  methods on the chromoselector object when you would like to show and hide the color picker.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// This is the default
$(document).ready(function () {
    $('input.color').chromoselector({
        autoshow: true
    });
});
```
```js
// This will show color picker when the user clicks inside
// the source text input and hide it when the element loses focus
$(document).ready(function () {
    $('input.color').chromoselector({
        autoshow: false
    }).click(function () {
        $(this).chromoselector('show');
    }).blur(function () {
        $(this).chromoselector('hide');
    });
});
```

## effect
Which animation effect to use when showing/hiding the color picker widget. If you wish to disable animations, set the [speed](#speed) property to 0.
#### Values
```"fade"``` or ```"slide"```
#### Default
```"fade"```
#### Examples
```js
// Slides the picker down/up when showing/hiding it
$(document).ready(function () {
    $('input.color').chromoselector({
        effect: 'slide'
    });
});
```
```js
// No animation
$(document).ready(function () {
    $('input.color').chromoselector({
        speed: 0
    });
});
```

## eventPrefix
Defines a prefix to apply to event names. This is useful for resolving conflicts with other js libraries, such as Prototype.js.
#### Values
An alphanumeric string, optionally contaning an underscore
#### Default
```""```
#### Examples
```js
$(document).ready(function () {
    $('input.color').chromoselector({
        eventPrefix: 'myPrefix_',
        // No need to prefix when binding via the property
        hide: function () {
            doSomething();
        }
    });
    // Must prefix when binding manually
    $('input.color').bind('myPrefix_hide', function () {
        doSomethingElse();
    });
});
```

## icon
The URL to an image file. This is used to display an icon beside the color picker, which is then used to show it when clicked.
#### Values
A string containing the URL of the icon to show.
#### Default
```undefined```
#### Examples
```js
// Absolute address
$(document).ready(function () {
    $('input.color').chromoselector({
        icon: 'http://www.chromoselector.com/images/favicon.png'
    });
});
```
```js
// Relative address
$(document).ready(function () {
    $('input.color').chromoselector({
        icon: '../images/favicon.png'
    });
});
```

## iconalt
The text to display instead of the icon if it fails to load.
#### Values
A non empty string.
#### Default
```"Open Color Picker"```
#### Examples
```js
// Shorter string 
$(document).ready(function () {
    $('input.color').chromoselector({
        icon: 'http://www.example.com/invalid.png',
        iconalt: 'Picker'
    });
});
```

## iconpos
Defines on which side of the source text input to display the icon. Does nothing, if the [icon](#icon) property is not set.
#### Values
```"left"``` or ```"right"```
#### Default
```"right"```
#### Examples
```js
// Display icon on left
$(document).ready(function () {
    $('input.color').chromoselector({
        icon: 'http://www.example.com/invalid.png',
        iconpos: 'left'
    });
});
```

## lazy
Whether to defer the rendering of the color picker object.

When set to ```true```, the rendering of the colorpicker does not start until the mouseover event is triggered on the source text input. When set to ```false```, the rendering occurs straight away.

Does nothing, if the [autoshow](#autoshow) property is set to ```false```.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// Render the color picker when the page is loaded
$(document).ready(function () {
    $('input.color').chromoselector({
        lazy: false
    });
});
```

## minWidth
Mimimum width of the color picker widget, not including the side panel.
#### Values
An integer greater than or equal to ```100```.
#### Default
```120```
#### Examples
```js
// This will restrict resizing to the 300px - 400px range
$(document).ready(function () {
    $('input.color').chromoselector({
        minWidth: 300
    });
});
```

## maxWidth
Maximum width of the color picker widget, not including the side panel. This setting is ignored if the value is less than [minWidth](#minwidth).
#### Values
An integer greater than or equal to ```100```.
#### Default
```400```
#### Examples
```js
// This will restrict resizing to the 120px - 300px range
$(document).ready(function () {
    $('input.color').chromoselector({
        maxWidth: 300
    });
});
```

## panel
When set to ```true```, the color picker will have show a side panel with sliders for manipulation of individual color channels.
#### Values
```true``` or ```false```
#### Default
```false```
#### Examples
```js
// Show the panel
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true
    });
});
```

## panelAlpha
When set to ```true```, the color picker will have show a side panel with a slider for manipulating the alpha channel.
#### Values
```true``` or ```false```
#### Default
```false```
#### Examples
```js
// Show the alpha selector
$(document).ready(function () {
    $('input.color').chromoselector({
        panelAlpha: true
    });v
});
```
```js
// Show the panel and the alpha selector
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelAlpha: true
    });
});
```

## panelChannelWidth
The width of each slider in the panel.
#### Values
An integer value between ```10``` and ```40```, inclusive
#### Default
```18```
#### Examples
```js
// Wide sliders in the panel 
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelChannelWidth: 30
    });
});
```
#### See also:
  - [Dimensions](dimensions.md)

## panelChannelMargin
The amount of empty space, in pixels, to leave between sliders in the panel.
#### Values
An integer value between ```0``` and ```50```, inclusive
#### Default
```12```
#### Examples
```js
// No space between sliders in the panel 
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelChannelMargin: 0
    });
});
```
#### See also:
  - [Dimensions](dimensions.md)

## panelMode
The default mode for the panel.
#### Values
```"rgb"```, ```"hsl"``` or ```"cmyk"```
#### Default
```"rgb"```
#### Examples
```js
// Show the HSL selector in panel first
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelMode: 'hsl'
    });
});
```

## panelModes
The available modes for the panel. If an empty array is passed, the mode selector will be hidden and the panel will stay in the mode defined by the [panelMode](#panelmode) property.
#### Values
```Array```
#### Default
```['rgb', 'hsl', 'cmyk']```
#### Examples
```js
// Show only the HSL selector in panel
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelMode: 'hsl',
        panelModes: []
    });
});
```
```js
// Show only the RGB and HSL selectors in panel
$(document).ready(function () {
    $('input.color').chromoselector({
        panel: true,
        panelModes: ['rgb', 'hsl']
    });
});
```

## pickerClass
This property allows you to add an extra class to the DOM element containing the color picker (which already has the ```ui-cs-chromoselector``` class). By doing so, it is possible to over-ride the styling of a color picker (useful when displaying multiple color pickers that have different style on the same page).
#### Values
A string containing a valid reference to a CSS class
#### Default
```""```
#### Examples
CSS:
```css
.dark.ui-cs-chromoselector {
    background: #222233;
    background: rgba(34,34,41,0.95);
    border: 1px solid black;
}
```
JS:
```js
$(document).ready(function () {
    // Display some pickers with default style
    $('input.color').chromoselector();
    // Display some other pickers with dark style
    $('input.dark').chromoselector({
        pickerClass: 'dark'
    });
});
```

## preview
Whether to show a preview box of the currently selected color above the color picker widget. You can show a preview somewhere else by registering to the [update](events.md#update) event.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// This is the default
$(document).ready(function () {
    $('input.color').chromoselector({
        preview: true
    });
});
```
```js
// Don't show a preview
$(document).ready(function () {
    $('input.color').chromoselector({
        preview: false
    });
});
```
```js
// Show a preview in the background of the input element
$(document).ready(function () {
    $('input.color').chromoselector({
        preview: false,
        update: function () {
            $(this).css(
                'background-color',
                $(this).chromoselector('getColor').hex
            );
        }
    });
});
```

## resizable
Whether the color picker should be resizable or not.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// This is the default
$(document).ready(function () {
    $('input.color').chromoselector({
        resizable: true
    });
});
```
```js
// Do not allow resizing
$(document).ready(function () {
    $('input.color').chromoselector({
        resizable: false
    });
});

```

## roundcorners
Whether to use rounded corners on the color picker container.
#### Values
```true``` or ```false```
#### Default
```true```
#### Examples
```js
// This is the default
$(document).ready(function () {
    $('input.color').chromoselector({
        roundcorners: true
    });
});
```
```js
// Show square corners
$(document).ready(function () {
    $('input.color').chromoselector({
        roundcorners: false
    });
});
```
```js
// Here, the value of roundcorners will be
// ignored because we have set a target
$(document).ready(function () {
    $('input.color').chromoselector({
        roundcorners: true,
        target: '#target'
    });
});
```

## ringwidth
The thickness of the hue selector (the outer ring of the color picker), in pixels. Must be less than 25% of minWidth.
#### Values
A positive integer
#### Default
```18```
#### Examples
```js
// Use a wider hue selector for a big picker
$(document).ready(function () {
    $('input.color').chromoselector({
        ringwidth: 25,
        width: 300
    });
});
```

## shadow
The amount of shadow to drop under the color picker in pixels. A value of ```10``` or less is recommended to avoid cropping the shadow.
#### Values
A positive integer or ```0```
#### Default
```6```
#### Examples
```js
// No Shadow
$(document).ready(function () {
    $('input.color').chromoselector({
        shadow: 0
    });
});
```
```js
// Extra shadow
$(document).ready(function () {
    $('input.color').chromoselector({
        shadow: 10
    });
});
```

## shadowColor
The color of the shadow dropped under the color picker.
#### Values
A string representing a color in HEX (```"#fff"``` or ```"#ffffff"```), RGB ```"rgb(255,255,255)"``` and RGBA ```"rgba(255,255,255,1)"```
#### Default
```"rgba(0,0,0,0.6)"```
#### Examples
```js
// White shadow
$(document).ready(function () {
    $('input.color').chromoselector({
        shadowColor: '#ffffff' 
    });
});
```
```js
// A half-transparent, yellow shadow
$(document).ready(function () {
    $('input.color').chromoselector({
        shadowColor: 'rgba(255,255,0,0.5)'
    });
});
```

## speed
The duration of the show/hide animations.
#### Values
A positive integer or ```0```, this will be interpreted as a number of milliseconds, also: ```"fast"```, ```"medium"``` and ```"slow"```
#### Default
```400```
#### Examples
```js
// A slow animation
$(document).ready(function () {
    $('input.color').chromoselector({
        speed: 'slow'
    });
});
```
```js
// No animation
$(document).ready(function () {
    $('input.color').chromoselector({
        speed: 0
    });
});
```

## target
Allows to specify a target container where to put the color picker. If a custom container is used, note that you will need to ensure yourself that the color picker is correctly positioned on the page.
#### Values
```null``` to use the default target container positioned below the source text input.

A selector, a DOM object or a jQuery object are also acceptable and will allow custom positioning of the color picker.
#### Default
```null```
#### Examples
```js
// Sample custom target
$(document).ready(function () {
    $('input.color').chromoselector({
        target: '#myContainer'
    });
});
```

## width
The total width of the color picker widget in pixels. This includes a fixed padding on both sides.
#### Values
An integer between [minWidth](#minwidth) and [maxWidth](#maxwidth). Any values outside of this range will be clipped to the nearest legal value.
#### Default
```180```
#### Examples
```js
// Sets the outside widget width to 320 pixels
$(document).ready(function () {
    $('input.color').chromoselector({
        width: 320
    });
});
```
#### See also:
  - [Dimensions](dimensions.md)

# Callbacks

## save()
This function is responsible for saving back the value of the color to the source element. When not defined, a default internal function is used.
#### Values
```null``` or ```function```
#### Default
```null```
#### Examples
```js
// This is the equivalent of the default function
$(document).ready(function () {
    $('input.color').chromoselector({
        save: function (value) {
            // The value comes in already formatted
            // and only needs to be placed somewhere
            $(this).val(
                value
            ).html(
                value
            );
        }
    });
});
```

## load()
This function is responsible for reading in the value of the color from the source element. When not defined, a default internal function is used.
#### Values
```null``` or ```function```
#### Default
```null```
#### Examples
```js
// This is the equivalent of the default function
$(document).ready(function () {
    $('input.color').chromoselector({
        // The value only needs to be read in here
        // the parsing will be done at a later stage
        load: function () {
            return $(this).val() || $(this).html();
        }
    });
});
```

## str2color()
This function is responsible for parsing a string into a format that can be interpreted by the Color class. When not defined, a default internal function is used.
#### Values
```null``` or ```function```
#### Default
```null```
#### Examples
```js
// HEX without "#"
$(document).ready(function () {
    $('#color5').chromoselector({
        str2color: function (str) {
            return '#' + str;
        },
        color2str: function (color) {
            return color.getHexString().substring(1);
        }
    });
});
```
#### See Also
  - [Color Manipulation](color.md)

## color2str()
This function is responsible for converting a Color object to a human-readable string. When not defined, a default internal function is used.
#### Values
```null``` or ```function```
#### Default
```null```
#### Examples
```js
// Comma-separated RGB
$(document).ready(function () {
    $('#color1').chromoselector({
        color2str: function (color) {
            return color.getRgbString();
        }
     });
});
```
#### See Also
  - [Color Manipulation](color.md)
