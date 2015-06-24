# pixabayjs
A Javascript Wrapper for the Pixabay API. To learn more about Pixabay, read the [docs][docs].

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

// Create a RequestFactory
var requestFactory = pixabay.requestFactory();

// Configure the RequestFactory, using Pixabay's query parameters
var resultList = requestFactory    
    .query({order: 'latest'})
    .search(['dogs', 'puppies'])
    .resultList();

// Get a promise for a page of results
var resultsPromise = resultList.next();

// Get a promise for the next page of results
var resultsPromise2 = resultList.next();
```

Refer to Pixabay's API [documentation][docs] for the possible query parameters to use with `pixabay.defaults` and `request().query`. **Note:** Use `request().search` specifically for pixabay's `q` request parameter; doing otherwise will cause the `q` parameter to be overwritten.

## API
### `pixabay`
The high level client wrapper used set authentication, set default query parameters, and create `RequestFactory`s.

#### `pixabay.authenticate(username, apiKey)`
`authenticate` is used to set your `username` and `apiKey`, provided to you from [Pixabay][registration], on the client. The values are used each time a `RequestFactory` is created.

#### `pixabay.defaults({object})`
Use `defaults` to set default query parameters for each created `RequestFactory`. Takes an object.

#### `pixabay.requestFactory({options})`
Returns a `RequestFactory` instance using the authentication credentials and defaults priviously set.

Options are:
- `host`: defaults to `pixabay.com`.
- `path`: defaults to `api`.
- `protocol`: defaults to `https`.
- `query`: defaults to `{}`. An alternative to `RequestFactory.query()`.
- `search`: defaults to `[]`. An alternative to `RequestFactory.search()`.

### `RequestFactory`
An object used to configure a request to Pixabay.

#### `RequestFactory.get({options})`
Syntatical sugar for `RequestFactory.resultList(options).next()`. See `RequestFactory.resultList()` and `ResultList.next()` for further information.

#### `RequestFactory.query({obj})`
Used to set the query parameters sent with the Pixabay request. See the [documentation][docs] for a list of supported query parameters. **Note::** Use `RequestFactory.search()` specifically for the `q` query parameter; doing otherwise will cause your search string to be overwritten.

#### `RequestFactory.search([arr]`
Used to set an array of terms to search for. The array is converted into a query string before making the request.

#### `RequestFactory.resultList({options})`
Returns a `ResultList` object.

Options are:
- `onFailure`: an optional callback that is invoked when a request errors out.
- `onSuccess`: an optional callback that is invoked when a request succeeds.
- `page`: defaults to `1`. The results page to begin receiving results from.

##### Callbacks
The callbacks should take a `response` argument, which is the processed response from the request. See below for what the `response` object looks like.

### `ResultList`
A generator that makes requests to Pixabay and returns a promise for each.

#### `ResultList.next()`
Returns a promise for the next page of results. Normally begins with the first page, but the initial page can be set by setting the `page` key in the `options` passed into `RequestFactory.resultList({options})`.

### Pixabay Results
By default, a response will be in the following form:

```javascript
{
    error: null,
    page: 1,
    hits: [
        {
           id_hash: '779def4966ad3741-1356479553',
           type: 'photo',
           thumbURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/ef2c43ccb41a18d6_68.jpg',
           previewURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/28d20b56447d87bf_150.jpg',
           previewWidth: 150,
           previewHeight: 112,
           webformatURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/286a88431d7a9651_640.jpg',
           webformatWidth: 640,
           webformatHeight: 480,
           largeImageURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/14f48b3f589431efa50561c7_1280.jpg',
           fullHDURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/e1849b5c833c6dc8554eded5_1920.jpg',
           imageURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/94f19b8545cf5355895bbcfa.jpg',
           imageWidth: 3264,
           imageHeight: 2448,
           vectorURL: 'https://pixabay.com/get/d665608aa966adad0e6e/1356479553/fd35g48942gfzs8d9zfs98df.svg',
           user: 'WikiImages'
       },
    ],
    totalHits: 199
}
```

The `error` and `page` keys are set by Pixabayjs for convenience. When an error occurs, `error` will be set to the error's text, both `page` and `totalHits` will be `null`, and `hits` will be an empty array.

## License
MIT

[docs]: http://pixabay.com/api/docs/
[registration]: https://pixabay.com/en/accounts/register/
