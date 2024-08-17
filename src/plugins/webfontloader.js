// src/plugins/webfontloader.js

export function loadFonts() {
    // Example code to load web fonts
    WebFont.load({
      google: {
        families: ['Roboto:100,300,400,500,700,900', 'Material Icons']
      }
    });
  }
  