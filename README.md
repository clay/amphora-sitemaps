# Amphora Sitemaps

> A Sitemaping module for Amphora that exposes endpoints to get the all the published pages in an XML response.

## Installation & Usage

First install the module:

```ssh
$ npm install -s amphora-sitemaps
```

Then, require the module and pass all the options you need to start the plugin:
```javascript
const amphoraSitemaps = require('amphora-sitemaps'),
  amphoraSitemapsPlugin = amphoraSitemaps({ _news: { component: 'article' }});
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

## Endpoints
At startup time, the module will create the following XML endpoints:

### _sitemaps
Get the all the published pages.

`eg. yoursite.com/_sitemap`

### _news
Get pages based on the [Google News Sitemap](https://support.google.com/news/publisher-center/answer/74288?hl=en) guidelines.

You should pass the `component` you want to use to fetch said the pages (See [Installation & Usage](/#installation--usage) for reference).

`eg. yoursite.com/_news`
