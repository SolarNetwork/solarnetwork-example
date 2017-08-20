# SolarNetwork Datum Loader Example

This project contains a webapp that uses the [Datum Loader][sn-datum-loader]
package to query for datum. See the [API Developer Guide][solarnet-api] for more
information, especially the [SolarQuery guide][solarquery-api].

![demo](docs/datum-loader-demo.gif)

This video is also available at [full size](https://youtu.be/otQJynw4bMI).


## Building

The build uses [NPM][npm] or [Yarn][yarn]. First, initialize the dependencies:

```shell
# NPM
npm install

# or, Yarn
yarn install
```

Then, the development web server can be started via

```shell
# NPM
npm run start

# or, Yarn
yarn run start
```

and then the app can be reached at [localhost:9000](http://localhost:9000). For a
produciton build, use

```shell
# NPM
npm run build -- --config webpack.prod.js

# or, Yarn
yarn run build -- --config webpack.prod.js
```

and the app will be built in the `dist` directory.

  [npm]: https://www.npmjs.com/
  [yarn]: https://yarnpkg.com/
  [solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
  [solarquery-api]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API
  [sn-datum-loader]: https://github.com/SolarNetwork/sn-datum-loader-js
