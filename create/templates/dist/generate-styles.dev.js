"use strict";

var indent = require('../utils/indent');

var _require = require('../utils/colors'),
    colorThemeCSSProperties = _require.colorThemeCSSProperties;

module.exports = function (options) {
  var template = options.template,
      theming = options.theming;
  var customColor = theming.customColor,
      color = theming.color,
      fillBars = theming.fillBars;
  var styles = '';
  var themeRgb = [0, 122, 255];

  if (customColor && color) {
    var customProps = colorThemeCSSProperties("".concat(color));
    themeRgb = customProps['--zmp-theme-color-rgb'].split(',').map(function (n) {
      return n.trim();
    });
    styles += indent(0, "\n      /* Custom color theme properties */\n      :root {\n        ".concat(Object.keys(customProps).filter(function (prop) {
      return prop !== '--zmp-tabbar-fill-link-active-color' && prop !== '--zmp-tabbar-fill-link-active-border-color';
    }).map(function (prop) {
      return "".concat(prop, ": ").concat(customProps[prop], ";");
    }).join('\n        '), "\n      }\n      :root.theme-dark,:root .theme-dark {\n        ").concat(Object.keys(customProps).map(function (prop) {
      return "".concat(prop, ": ").concat(customProps[prop], ";");
    }).join('\n        '), "\n      }\n    "));
  }

  if (fillBars) {
    styles += indent(0, "\n      /* Invert navigation bars to fill style */\n    ");
  }

  if (includeTailwind) {
    styles += indent(0, "\n      @import \"./tailwind.css\";\n      ");
  }

  if (template === 'split-view') {
    styles += indent(0, "\n      /* Left Panel right border when it is visible by breakpoint */\n      .panel-left.panel-in-breakpoint:before {\n        position: absolute;\n        right: 0;\n        top: 0;\n        height: 100%;\n        width: 1px;\n        background: rgba(0,0,0,0.1);\n        content: '';\n        z-index: 6000;\n      }\n\n      /* Hide navbar link which opens left panel when it is visible by breakpoint */\n      .panel-left.panel-in-breakpoint ~ .view .navbar .panel-open[data-panel=\"left\"] {\n        display: none;\n      }\n\n      /*\n        Extra borders for main view and left panel for iOS theme when it behaves as panel (before breakpoint size)\n      */\n      .ios .panel-left:not(.panel-in-breakpoint).panel-in ~ .view-main:before,\n      .ios .panel-left:not(.panel-in-breakpoint).panel-closing ~ .view-main:before {\n        position: absolute;\n        left: 0;\n        top: 0;\n        height: 100%;\n        width: 1px;\n        background: rgba(0,0,0,0.1);\n        content: '';\n        z-index: 6000;\n      }\n    ");
  } else {
    styles += indent(0, "\n      /* Your app custom styles here */\n    ");
  }

  return styles.trim();
};