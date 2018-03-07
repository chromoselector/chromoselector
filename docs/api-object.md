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

# API object
The purpose of the API object is to shorten the code when accessing the ChromoSelector API.

Example of basic API usage:
```js
$(document).ready(function () {
    // Instanciate the color picker
    $("#myColorInput").chromoselector();
    // Show it
    $("#myColorInput").chromoselector("show");
    // Change color
    $("#myColorInput").chromoselector("setColor", "#123456");
    // Log new color to console in HSL format
    console.log($("#myColorInput").chromoselector("getColor").getHsl());
});
```

Same as above, but using the API object:
```js
$(document).ready(function () {
    // Instanciate the color picker
    var $picker = $("#myColorInput").chromoselector();
    // Get an instance of the API object
    var api = $picker.chromoselector("api");
    // Now do everything else
    api.show();
    api.setColor("#123456");
    console.log(api.getColor().getHsl());
});
```

Most API object function calls can be chained, so the above can be again reduced to the following:
```js
$(document).ready(function () {
    // Instanciate the color picker and get the API object
    var api = $("#myColorInput").chromoselector().chromoselector("api");
    // Now do everything else
    console.log(
        api.show().setColor("#123456").getColor().getHsl()
    );
});
```
