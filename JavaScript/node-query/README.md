# SolarQuery Node JS Sample App

The `node-query.js` script is s small node.js application that makes use of the [solarnetwork-d3][solarnetwork-d3] package to easily query a single SolarNode's data and print out the results.

# Install

You must have `npm` installed, and then run

```sh
npm install
```

from within the same directory as the `package.json` file to install the package dependencies.

Then you can run

```sh
node node-query.js
```

to print out the available options:

```
Usage: node node-query.js [OPTIONS]

Execute a SolarQuery datum query and show the results.

  -n, --node=ARG        node ID
  -s, --source=ARG+     source ID
  -b, --begin-date=ARG  begin date, in YYYY-MM-DD HH:mm or YYYY-MM-DD format
  -e, --end-date=ARG    end date, exclusive if --aggregate used
  -a, --aggregate=ARG   aggregate, e.g. FiveMinute, Hour, Day, Month
  -p, --property=ARG+   output property, e.g. wattHours
  -h, --help            show this help
```

At a minimum, you must provide the `--node`, `--begin-date`, and `--end-date` arguments. To return results for a specific source, add the `--source` argument.

For example, to show a week's worth of energy data for node `199` **by day** for sources `Solar` and `DB` you could execute:

```sh
node sn-agg-query.js -n 199 -s Solar -s DB -p wattHours -p wattHoursReverse -b 2016-01-01 -e 2016-01-08 -a Day
```

This will print out all the returned data grouped by source, followed by the raw property values, if `-p` was used:

```js
{ DB:
   [ { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-01',
       time: '00:00',
       wattHours: 25059.063,
       wattHoursReverse: 11301 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-02',
       time: '00:00',
       wattHours: 33642.965 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-03',
       time: '00:00',
       wattHours: 33951.994,
       wattHoursReverse: 46 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-04',
       time: '00:00',
       wattHours: 24758.983,
       wattHoursReverse: 9439 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-05',
       time: '00:00',
       wattHours: 26569.059,
       wattHoursReverse: 14942 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-06',
       time: '00:00',
       wattHours: 25395.013,
       wattHoursReverse: 14226 },
     { nodeId: 199,
       sourceId: 'DB',
       date: '2016-01-07',
       time: '00:00',
       wattHours: 32522.948,
       wattHoursReverse: 3740 } ],
  Solar:
   [ { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-01',
       time: '00:00',
       wattHours: 24350 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-02',
       time: '00:00',
       wattHours: 4600 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-03',
       time: '00:00',
       wattHours: 4160 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-04',
       time: '00:00',
       wattHours: 21650 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-05',
       time: '00:00',
       wattHours: 27330 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-06',
       time: '00:00',
       wattHours: 26840 },
     { nodeId: 199,
       sourceId: 'Solar',
       date: '2016-01-07',
       time: '00:00',
       wattHours: 9270 } ] }
```

```
** Source: DB **

Dates: 2016-01-01,2016-01-02,2016-01-03,2016-01-04,2016-01-05,2016-01-06,2016-01-07

wattHours: 25059.063,33642.965,33951.994,24758.983,26569.059,25395.013,32522.948

wattHoursReverse: 11301,,46,9439,14942,14226,3740


** Source: Solar **

Dates: 2016-01-01,2016-01-02,2016-01-03,2016-01-04,2016-01-05,2016-01-06,2016-01-07

wattHours: 24350,4600,4160,21650,27330,26840,9270

wattHoursReverse: ,,,,,,
```

  [solarnetwork-d3]: https://github.com/SolarNetwork/solarnetwork-d3
