# [Changelog](https://github.com/yola/pixabayjs/releases)

## 2.0.3 
* Fix pagination for the video endpoint ([#51][51])
* Support 'url' as an option again ([#50][50])
[50]: https://github.com/yola/pixabayjs/pull/50
[51]: https://github.com/yola/pixabayjs/pull/51

## 2.0.2
* Lower Superagent dependency from 1.7.2 to 1.2.0 ([#46][46])
[46]: https://github.com/yola/pixabayjs/pull/46

## 2.0.1
* Add CommonJS export ([#44][44])
[44]: https://github.com/yola/pixabayjs/pull/44

## 2.0.0
* Change `resultList` to `imageResultList` for images ([#42][42])
* Introduce `videoResultList` for videos
[42]: https://github.com/yola/pixabayjs/pull/42

## 1.0.2
* Pin dependencies to minor version ([#39][39])
[39]: https://github.com/yola/pixabayjs/pull/39

## 1.0.1
* Update dependencies to latest version where applicable. ([#37][37])
[37]: https://github.com/yola/pixabayjs/pull/37

## 1.0.0
* Updated client to match pixabay's new API. ([#33][33])
    * `username` is no longer a parameter needed by the API. `pixabayjs.authenticate` now only accepts a `apiKey` argument: `pixabayjs.authenticate(apiKey)`.
    * HTTP is no longer supported. However, client was already defaulting to HTTPS.
    * New API keys have been issued. Old API keys will not work after 2/1/2016.
    * Image hash IDs will need to be changed. Use the old hash with the new API key to get the new hash.
[33]: https://github.com/yola/pixabayjs/pull/33

## 0.5.2
* Wrapped error parsing in try/catch block in case error was not valid JSON ([#29][29])
* Changed module loading to use es6 ([#30][30])
[29]: https://github.com/yola/pixabayjs/pull/29
[30]: https://github.com/yola/pixabayjs/pull/30

## 0.5.1
* Added es6 support through the use of Babel. ([#27][27])
[27]: https://github.com/yola/pixabayjs/pull/27

## 0.5.0
* `pixabayjs` API changes ([#19][19])
    - `pixabayjs.defaults` is now an object instead of a function.
    - `pixabayjs.requestFactory` has been replaced with `pixabayjs.resultList`, which returns a new `ResultList`.
    - Intermediary `RequestFactory` removed.
* Internal changes to reduce dependency on state.
[19]: https://github.com/yola/pixabayjs/pull/19

## 0.4.0
* Added `previous` function to `ResultList`. Comes with promise caching ([#15][15])
* Replace `host`, `protocol`, and `path` options with `url` for RequestFactory ([#14][14])
* Set the requested page on the response when the request errors ([#13][13])
[13]: https://github.com/yola/pixabayjs/pull/13
[14]: https://github.com/yola/pixabayjs/pull/14
[15]: https://github.com/yola/pixabayjs/pull/15

## 0.3.1
* Updates to README ([#11][11])
[11]: https://github.com/yola/pixabayjs/pull/11

## 0.3.0
* Refactor of API to support pagination ([#8][8])
    * `request` is now `requestFactory` and returns a `RequestFactory` object.
    * `RequestFactory` supports the same interface as `request` with the addition of `resultList` which returns a `ResultList` object.
    * Both `get` and `resultList` now allow an `options` argument. See README for details.
    * `ResultList` has single method, `next`, which returns a results response. Subsequent calls will request new pages of results.
* Response format has changed. See README for details.
[8]: https://github.com/yola/pixabayjs/pull/8

## 0.2.1
* Removed lodash dependencies where possible ([#4][4])
[4]: https://github.com/yola/pixabayjs/pull/4

## 0.2.0
* Authorization credentials are optional ([#3][3])
* Renamed `authorize` to `authenticate`
[3]: https://github.com/yola/pixabayjs/pull/3

## 0.1.0
* Initial client ([#1][1])
[1]: https://github.com/yola/pixabayjs/pull/1
