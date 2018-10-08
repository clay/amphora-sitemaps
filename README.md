# Amphora Sitemaps

> A Sitemaping module for Amphora that expose endpoints that you can hit in your to get the all the published articles in an XML response.

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

At startup time the module will create the db schema and table needed to work properly, this will be made using the amphora database adapter.
