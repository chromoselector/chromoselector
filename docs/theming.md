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

# Theming
The color picker can be themed in the chromoselector.css file.

Here is a sample structures of elements you might expect to see in a color picker and their classes:
```html
<!--
The outermost container is the target element, it is generated
automatically, unless you have manually specified a target.
 -->
<div>
    <!-- The optional icon, used to open the color picker -->
    <a class="ui-cs-icon">
        <img />
    </a>
    <div class="ui-cs-chromoselector">
        <!-- This element contains the parts that make up a color picker -->
        <div class="ui-cs-supercontainer">
            <div class="ui-cs-container">
                <!-- Color picker preview -->
                <div class="ui-cs-preview-container">
                    <div class="ui-cs-preview-widget">
                        ...
                    </div>
                </div>
                <!-- This element contains the canvases on which the color picker is rendered -->
                <div class="ui-cs-widget">
                    ...
                </div>
            </div>
            <!-- This element contains the canvas on which the side panel is rendered -->
            <div class="ui-cs-panel">
                ...
            </div>
            <!--
            This element is what you drag to resize the color picker.
            It may or may not exist.
            -->
            <canvas class="ui-cs-resizer"></canvas>
        </div>
    </div>
</div>
```

To change the style of the picker, you can either edit its CSS file directly, or you can assign a class to pickers via the pickerClass property. Afterwards, you can override the styles as follows:

#### JS code
```js
$(document).ready(function () {
    $("#input").chromoselector({
        pickerClass: "dark",
        shadowColor: "rgba(255,255,255,0.5)"
    });
});
```

#### CSS code
```css
.dark.ui-cs-chromoselector {
    background: #222233;
    background: rgba(34,34,41,0.95);
    border: 1px solid black;
}
```
