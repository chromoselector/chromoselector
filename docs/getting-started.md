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

# Getting Started
The chromoselector color picker has two operational modes.

Below you can see step-by-step guide on setting up the chromoselector color picker in both modes.

### Inline Mode
This is the default mode. When using this mode, the color picker is automatically shown under the element to which it was attached when the user clicks on this element.

The first step in integrating the chromoselector color picker into a web page is to upload the ```chromoselector.min.js```, ```chromoselector.min.css``` to your web server.

Next, you need to include these files in the ```head``` element of your page, as follows:

```html
<html>
<head>
    <!-- include the CSS file -->
    <link rel="stylesheet" href="chromoselector.min.css" />
    <!-- include the JavaScript files -->
    <script src="https://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
    <!-- N.B.: jQuery MUST be included BEFORE the chromoselector script -->
    <script src="chromoselector.min.js" type="text/javascript"></script>
</head>
<body>
    ...
</body>
</html>
```

At this point you need to create a form in the ```body``` element of your page and add an ```input``` element to it. We will later attach the color picker to this element.

```html
<form method="post">
    <div>
        <label for="my_color">Pick a color: </label>
        <input type="text" id="my_color" name="color" value="#ff0000" />
    </div>
</form>
```

The last step is to attach the color picker to the ```input``` element. To accomplish this, we create a ```script``` element in the ```head``` of the page. Then we schedule the execution of our code upon the completion of the page load by using the ```$(document).ready()``` jQuery method. Inside the ready method, we find the desired element using a jQuery selector, and call the ```chromoselector``` method on it.

```js
$(document).ready(function (){
    $("#my_color").chromoselector();
});
```

At this point the color picker is fully integrated and the code for the entire page should look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Chromoselector inline demo page</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="chromoselector.min.css" />
    <script src="https://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
    <script src="chromoselector.min.js" type="text/javascript"></script>
    <script type="text/javascript">
    $(document).ready(function () {
        $("#my_color").chromoselector();
    });
    </script>
</head>
<body>
    <form action="process.php">
        <div>
            <label for="my_color">Pick a color:</label>
            <input id="my_color" name="color" type="text" value="#ff0000" />
        </div>
    </form>
</body>
</html>
```

#### Static mode
This is the alternate operational mode. When using this mode, you must specify where the color picker will be shown. This mode is especially useful when you want to always display the color picker on the page or when integrating the color picker into a dialog. See [demos](demos.md) for sample jQuery UI dialog and jQuery mobile dialog integrations.

The first step in integrating the chromoselector color picker into a web page is to upload the ```chromoselector.min.js```, ```chromoselector.min.css``` to your web server.

Next, you need to include these files in the ```head``` element of your page, as follows:

```html
<html>
<head>
    <!-- include the CSS file -->
    <link rel="stylesheet" href="chromoselector.min.css" />
    <!-- include the JavaScript files -->
    <script src="https://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
    <!-- N.B.: jQuery MUST be included BEFORE the chromoselector script -->
    <script src="chromoselector.min.js" type="text/javascript"></script>
</head>
<body>
    ...
</body>
</html>
```

At this point you need to create a form in the ```body``` element of your page and add an ```input``` element to it. We will later attach the color picker to this element. You also need to add a target element somewhere on the page, which is where the color picker will be appended to. In this example, we place the ```input``` element inside our target element, a ```div``` element with an ```id``` set to ```"picker"```.

```html
<form action="process.php" method="post">
    <div id="picker">
        <input type="text" id="my_color" name="color" value="#ff0000" />
    </div>
</form>
```

At this point, we are finished preparing the HTML and we are missing the JavaScript code that will create the color picker. In order to put the color picker into the static mode, we specify a target as a property when calling the chromoselector API and set it to the value of ```"#picker"```. This will append the color picker to the element with the id of ```"picker"```, our ```div``` element. Also, since by default the color picker will be shown when the user clicks on the ```input``` element, we need to override this behaviour by setting the [autoshow property](properties.md#autoshow) to ```false```. And lastly, since we have set the [autoshow property](properties.md#autoshow) to ```false```, we need to show the picker as soon as it is initialised. We accomplish this by calling the [show method](methods.md#show) on the color picker inside the [create event](events.md#create).

```js
$(document).ready(function () {
    $("#my_color").chromoselector({
        target: "#picker",
        autoshow: false,
        create: function () {
            $(this).chromoselector("show", 0);
        },
        width: 260
    });
});
```

Although the integration of the color picker at this point is finished we might still want to add a bit of a style so that it looks pretty. To accomplish this we can add the following snippet to the ```head``` element of our page, as by setting the color into static mode, we discard the default styling.

```html
<style type="text/css">
    #picker {
        border: 1px solid;
        float: left;
        padding: 1em;
        background-color: #e4ccc1;
    }
    input {
        width: 100%;
    }
</style>
```

At this point the color picker is fully integrated and the code for the entire page should look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Chromoselector static mode demo page</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="chromoselector.min.css" />
    <script src="https://code.jquery.com/jquery-3.0.0.min.js" type="text/javascript"></script>
    <script src="chromoselector.min.js" type="text/javascript"></script>
    <script type="text/javascript">
    $(document).ready(function () {
        $("#my_color").chromoselector({
            target: "#picker",
            autoshow: false,
            create: function () {
                $(this).chromoselector("show", 0);
            },
            width: 260
        });
    });
    </script>
    <style type="text/css">
        #picker {
            border: 1px solid;
            float: left;
            padding: 1em;
            background-color: #e4ccc1;
        }
        input {
            width: 100%;
        }
    </style>
</head>
<body>
    <form action="process.php">
        <div id="picker">
            <input id="my_color" name="color" type="text" value="#ff0000" />
        </div>
    </form>
</body>
</html>
```
