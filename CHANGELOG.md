# [Changelog](https://github.com/yola/pixabayjs/releases)

## 0.3.2
* Set the requested page on the response when the request errors ([#13][13])
[13] https://github.com/yola/pixabayjs/pull/13

## 0.3.1
* Updates to README ([#11][11])
[11] https://github.com/yola/pixabayjs/pull/11

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
