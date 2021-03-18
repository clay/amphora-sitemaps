# Amphora Sitemaps

> A Sitemaping module for Amphora that exposes endpoints to get the all the published pages in an XML response.

## Installation & Usage

First install the module:

```ssh
$ npm install -s amphora-sitemaps
```

Then, require the module and pass all the options you need to start the plugin:
```javascript
/**
 * Gets the keywords from each content.
 * 
 * @param {Object} data
 * @returns {Promise}
 */
function getKeywords(data) {
  ...
}

/**
 * Filters content by the criteria you choose.
 * 
 * @param {Object} data
 * @returns {boolean}
 */
function componentFilter(data) {
  ...
}

const amphoraSitemaps = require('amphora-sitemaps'),
  amphoraSitemapsPlugin = amphoraSitemaps({ 
    _news: {
      components: ['article', 'gallery'],
      getKeywords,
      componentFilter
    }
  });
```

After that, pass the module into Amphora as an item for the `plugins` array property.

```javascript
amphora({
  ...
  plugins: [
    ...
    amphoraSitemapsPlugin,
    ...
  ],
  ...
})
```

## Options

The options object is used to initialize some endpoints like `_news`.

The object should have the following format:

```javascript
var options = {
  _news: { // Endpoint name
    component: 'article' // The component used to get the data for the sitemap
  }
}
```

## Endpoints

At startup time, the module will create the following XML endpoints:

### _sitemaps

Gets all the published pages.

`eg. yoursite.com/_sitemap`

### _news

Gets pages based on the [Google News Sitemap](https://support.google.com/news/publisher-center/answer/74288?hl=en) guidelines.

In order to meet these guidelines, you must pass a component name with the properties `canonicalUrl` and `date` because those fields are required.

`eg. yoursite.com/_news`
