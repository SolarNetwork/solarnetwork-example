# SolarNetwork Control Toggle Example

This project contains a webapp that uses the [ControlToggler][sn-control-toggler] class
to manage a switch attached to a SolarNode between on/off states.

## Building

Development server can be run via

  npm run start

and then the app can be reached at [localhost:9000](http://localhost:9000). For a
produciton build, use

  npm run build -- --config webpack.prod.js

and the output will be in the `dist` directory.


  [solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
  [sn-api-core]: https://github.com/SolarNetwork/sn-api-core-js
  [sn-control-toggler]: https://github.com/SolarNetwork/sn-control-toggler-js
