# hear-flowdock-speak

A commandline utility to vocalize a Flowdock chat stream.

## Configuration

You must set up configuration by copying `config.template.json` to `config.json`
and editting to match your environment.

* `ORGANIZATION` - Your organization name in flowdock
* `PERSONAL_API_KEY` - Your Flowdock API key
* `FLOWS` - an array of names of flows to vocalize
* `VOICES` - A map of Flowdock user names to Mac OS X Voices. If a user is not in the list, they are assigned a random voice.

## Installation

`npm install`

## Running

`npm start`
