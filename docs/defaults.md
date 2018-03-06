# Documentation
- [Index](../README.md)
  - [Demos](../README.md#demos)
  - [Features](../README.md#features)
  - [Requirements](../README.md#requirements)
  - [Install](../README.md#install)
  - [Build](../README.md#build)
- [Screenshots](screenshots.md)
- [Gettings started](gettings-started.md)
- API
  - [Properties](properties.md)
  - [Events](events.md)
  - [Methods](methods.md)
  - [Api Object](api-object.md)
  - [Overriding defaults](defaults.md)
  - [Color manipulation](color.md)
- [Dimensions](dimensions.md)
- [Theming](theming.md)

# Overriding Defaults
The default values for all properties and all the default event handlers can be easily over-ridden at runtime.

#### The getter and setter functions
The default can be accessed through jQuery's prototype object. For example:
```js
$(document).ready(function () {
    // Get the value of a default
    console.log( // prints true or false
        $.fn.chromoselector.defaults("resizable")
    );

    // Set a new default value
    $.fn.chromoselector.defaults("resizable", false);

    // The setter function can be chained
    $.fn.chromoselector
        .defaults("resizable", false)
        .defaults("shadow", 0)
        .defaults("speed", 0);
});
```

#### Practical example
Over-riding defaults is useful when you are instanciating many color pickers which all share some parameters. Take this code, for example, where the defaults are not altered:
```js
$(document).ready(function () {
    // Instanciate 3 similar pickers the simple way,
    // by specifying all the properties each time
    $("#myPicker1").chromoselector({
        shadow: 10,
        resizable: false,
        width: 200
    });
    $("#myPicker2").chromoselector({
        shadow: 10,
        resizable: false,
        width: 250
    });
    $("#myPicker3").chromoselector({
        shadow: 10,
        resizable: false,
        width: 300
    });
});
```

By altering the default values we can reduce the above code to:
```js
$(document).ready(function () {
    // Change the defaults
    $.fn.chromoselector
        .defaults("shadow", 10)
        .defaults("resizable", false);
    // Here we only pass the properties that differ to the new defaults
    $("#myPicker1").chromoselector({ width: 200 });
    $("#myPicker2").chromoselector({ width: 250 });
    $("#myPicker3").chromoselector({ width: 300 });
});
```