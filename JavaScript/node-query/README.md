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
Usage: node sn-agg-query.js [OPTIONS]

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


  [solarnetwork-d3]: https://github.com/SolarNetwork/solarnetwork-d3
