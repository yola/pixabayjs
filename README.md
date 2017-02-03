# pixabayjs

[![build status][travis-image]][travis-url]

A Javascript Wrapper for the Pixabay API. To learn more about Pixabay, read the [docs][docs].

## Installation
`npm i pixabayjs`

## Example Usage
```javascript
var pixabay = require('pixabayjs');

// Authenticate the client to make requests
pixabay.authenticate('username', 'api_key');

// Set default query parameters to make with every request
pixabay.defaults = {safesearch: true};

// Get a ResultList
var search = ['dogs', 'puppies'];
var options = {editors_choice: true};
var onSuccess = function(response) {
  console.log('Success');
  return response;
};
var onFailure = function(response) {
  console.log('Failure');
  return response;
};

var resultList = pixabay.resultList(search, options, onSuccess, onFailure);

// Get a promise for a page of results
var resultsPromise = resultList.next(); // page 1

// Get a promise for the next page of results
var resultsPromise2 = resultList.next(); // page 2

// Get the previous page of results
var resultPromise3 = resultList.previous(); // cached promise for page 1
```

## Development

1. Install dependencies:

    `npm install`

1. Run tests:

    `npm test`

## API
### `pixabay`
The high level client wrapper used to set authentication, set default query parameters, and create `ResultList`s.

#### authenticate `pixabay.authenticate(apiKey)`
`authenticate` is used to set your `apiKey`, provided to you from [Pixabay][registration], on the client. The values are used each time a `ResultList` is created.

#### defaults `pixabay.defaults`
Use `defaults` to set default query parameters for each created `ResultList`. Takes an object.

#### imageResultList `pixabay.imageResultList(search, options, onSuccess, onFailure)`
Returns a `ResultList` instance using the authentication credentials and defaults previously set.

- `search`: Array of search terms
- `options`: Object of key-value pairs to set the query parameters sent with the request to Pixabay. See the [documentation][docs] for a list of supported query parameters.
  - **Note:** Do not set `q`. Use the `search` argument instead.
- `onSuccess`: A function called on a successful response.
- `onFailure`: A function called on a failed response.

#### videoResultList `pixabay.videoResultList(search, options, onSuccess, onFailure)`
Returns a `ResultList` instance using the authentication credentials and defaults previously set.

- `search`: Array of search terms
- `options`: Object of key-value pairs to set the query parameters sent with the request to Pixabay. See the [documentation][docs] for a list of supported query parameters.
  - **Note:** Do not set `q`. Use the `search` argument instead.
- `onSuccess`: A function called on a successful response.
- `onFailure`: A function called on a failed response.

##### Callbacks
The callbacks should take a `response` argument, which is the processed response from the request. See below for what the `response` object looks like.

### ResultList
A generator that makes requests to Pixabay and returns a promise for each.

#### next `ResultList.next()`
Returns a promise for the next page of results. Normally begins with the first page, but the initial page can be set by setting the `page` key in the `options` passed into `pixabay.resultList()`.

#### previous `ResultList.previous()`
Returns a promose for the previous page of results. Will throw an error when requesting pages numbered <= 1;

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
    totalHits: 199,
    totalPages: 4
}
```

The `error` and `page` keys are set by Pixabayjs for convenience. When an error occurs, `error` will be set to the error's text, `page` will contain the requested page, `totalHits` and `totalPages` will be `null`, and `hits` will be an empty array.

## License
MIT

[docs]: http://pixabay.com/api/docs/
[registration]: https://pixabay.com/en/accounts/register/
[travis-image]: https://travis-ci.org/yola/pixabayjs.svg?branch=master
[travis-url]: https://travis-ci.org/yola/pixabayjs
