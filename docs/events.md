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

# Events
- [beforeHide](#beforeHide)
- [beforeShow](#beforeShow)
- [create](#create)
- [destroy](#destroy)
- [hide](#hide)
- [ready](#ready)
- [show](#show)
- [resizeStart](#resizeStart)
- [resize](#resize)
- [resizeStop](#resizeStop)
- [update](#update)

## beforeHide
This event is triggered when the color picker is about to be hidden. If cancelled, the event will be aborted and the color picker will stay shown.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        beforeHide: function () {
            // Require confirmation to hide
            return confirm('Are you sure you want to hide the color picker?');
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('beforeHide', function () {
            // Require confirmation to hide
            return confirm('Are you sure you want to hide the color picker?');
        })
});
```

## beforeShow
This event is triggered when the color picker is about to be shown. If cancelled, the event will be aborted and the color picker will stay hidden.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        beforeShow: function () {
            // Require confirmation to show
            return confirm('Are you sure you want to show the color picker?');
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('beforeShow', function () {
            // Require confirmation to show
            return confirm('Are you sure you want to show the color picker?');
        })
});
```

## create
This event is triggered after the plugin has been instanciated, but before the color picker has been rendered. Cannot be registered with ```.bind()```.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        create: function () {
            // Do something
        }
    });
});
```

## destroy
This event is triggered when the [destroy](methods.md#destroy) method is called on the plugin and it is going to be destroyed shortly.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        destroy: function () {
            // Do something
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('destroy', function () {
            // Do something
        })
});
```

## hide
This event is triggered after the color picker has been hidden.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        hide: function () {
            // Do something
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('hide', function () {
            // Do something
        })
});
```

## ready
This event is triggered when the color picker has been rendered on the canvas. This will occur once, before the color picker is shown for the first time and the exact timing depends on the value of the [autoshow](properties.md#autoshow) property.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        ready: function () {
            // Do something
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('ready', function () {
            // Do something
        })
});
```

## show
This event is triggered after the color picker has been shown.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        show: function () {
            // Do something
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('show', function () {
            // Do something
        })
});
```

## resizeStart
This event is triggered when the user initiates a resize operation or after a call to the [resize](methods.md#resize) method.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        resizeStart: function () {
            // Do something
        })
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('resizeStart', function () {
            // Do something
        })
});
```

## resize
This event is repeatedly triggered while the user is performing a resize operation. It is also triggered once after a call to the [resize](methods.md#resize) method.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        resize: function () {
            // Do something
        })
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('resize', function () {
            // Do something
        })
});
```

## resizeStop
This event is triggered when the user finishes a resize operation or after a call to the [resize](methods.md#resize) method.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        resizeStop: function () {
            // Do something
        })
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('resizeStop', function () {
            // Do something
        })
});
```

## update
This event is triggered when the user changes the color on the color picker. This event is throttled and the event handler will only be called on average once every 100 milliseconds.
#### Examples
```js
// Bind to the event before instantiating the plugin
$(document).ready(function () {
    $('input.color').chromoselector({
        preview: false,
        update: function () {
            // Show a preview in the background of the input element
            $(this).css(
                'background-color',
                $(this).chromoselector('getColor').getHexString()
            );
        }
    });
});
```
```js
// Bind to the event after instantiating the plugin
$(document).ready(function () {
    $('input.color')
        .chromoselector()
        .bind('update', function () {
            // Do something
        })
});
```
