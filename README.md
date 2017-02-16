# hear-flowdock-speak

A commandline utility to vocalize a Flowdock chat stream.

## Configuration

### config.json
You must set up configuration by copying `config.template.json` to `config.json`
and editting to match your environment.

* `organization` - Your organization name in flowdock
* `flowdockApiKey` - _Optional_ Your Flowdock API key. You can set this here or
in the environment variable.
* `flows` - an array of names of flows to vocalize
* `voices` - A map of Flowdock user names to Mac OS X Voices. If a user is not in the list, they are assigned a random voice.
* `filters` - A collection of regular expressions to improve pronunciations.
* `defaultRequestOptions` - the defaultRequestOptions is an object passed to
the underlying [request](https://www.npmjs.com/package/request) module to use
as default options (ie. proxy settings).

## Installation

`npm install`

## Running

`npm start`
