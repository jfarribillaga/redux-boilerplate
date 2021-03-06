// Example file. Copy this to your project. Change then names of the referenced files or comment
// them out. Convention is to name sass partials to start with an '_'
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bootstrapModules = require('./bootstrap-modules');

module.exports = {
  verbose: true, // Set to true to show diagnostic information

  // IMPORTANT: Set next two configuration so you can customize
  // bootstrapCustomizations: gets loaded before bootstrap so you can configure the variables used
  // by bootstrap mainSass: gets loaded after bootstrap, so you can override a bootstrap style.
  // NOTE, these are optional.

  // Use preBootstrapCustomizations to change $brand-primary. Ensure this
  // preBootstrapCustomizations does not depend on other bootstrap variables.
  preBootstrapCustomizations: './src/config/bootstrap/_pre-bootstrap-customizations.scss',

  // Use bootstrapCustomizations to utilize other sass variables defined in
  // preBootstrapCustomizations or the _variables.scss file. This is useful to set one
  // customization value based on another value.
  bootstrapCustomizations: './src/config/bootstrap/_bootstrap-customizations.scss',

  //mainSass: './_main.scss',

  // Default for the style loading
  //styleLoader: 'style-loader!css-loader!sass-loader',
  styleLoader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
  //
  // If you want to use the ExtractTextPlugin
  //   and you want compressed
  //     styleLoader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
  //
  // If you want expanded CSS
  //   styleLoader: ExtractTextPlugin.extract('style-loader',
  // 'css-loader!sass?outputStyle=expanded'),

  scripts: bootstrapModules.scripts,
  styles: bootstrapModules.styles
};

