# pixabayjs
A Javascript Wrapper for the Pixabay API. To learn more about Pixabay, read the [docs](http://pixabay.com/api/docs/).

## Setup

1. Install dependencies:

    `npm install`


## Testing
1. Run tests:

    `npm test`

## Using Pixabayjs

```javascript
var pixabay = require('pixabayjs');

// Authenticate the client to make requests
pixabay.authenticate('username', 'api_key');

// Set default query parameters to make with every request
pixabay.defaults({safesearch: 'true'});

// Create a request handler
var handler = pixabay
    .request()
    .query({order: 'latest'})
    .search(['dogs', 'puppies']);

// Get the request promise
var request = handler.get();

// Use the request promise
request
    .then(...)
    .done();

// Get the next set of results
var request2 = handler.next();

// Get a specific page
handler.page(3);
var request3 = hander.get();


```

Refer to Pixabay's API [documentation](http://pixabay.com/api/docs/) for the possible query parameters to use with `pixabay.defaults` and `request().query`. **Note:** Use `request().search` specifically for pixabay's `q` request parameter; doing otherwise will cause the `q` parameter to be overwritten.

## License
MIT
