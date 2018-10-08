# Amphora Sitemaps

> A Sitemaping module for Amphora that exposes endpoints to get the all the published pages in an XML response.

## Installation & Usage

First install the module:

```ssh
$ npm install -s amphora-sitemaps
```

Then pass the module into Amphora as an item for the `plugins` array property.

```javascript
amphora({
  ...
  plugins: [
    ...
    require('amphora-sitemaps'),
    ...
  ],
  ...
})
```

At startup time the module will create and expose endpoints that you can hit in your browser to get the all the published pages in an XML response for that site. `eg. yoursite.com/sitemap`
