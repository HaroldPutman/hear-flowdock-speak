# hear-flowdock-speak

A commandline utility to vocalize a Flowdock chat stream.

## Quickstart

```
$ npm install -g hear-flowdock-speak`
```
Configure your environment and then:
```
$ hear-flowdock-speak
```

## Configuration

### Environment Variables

Set your Flowdock personal API token in an environment variable
`FLOWDOCK_API_KEY`. You can find this Token by logging in to Flowdock
(or CA Agile Central) and visiting [https://www.flowdock.com/account/tokens](https://www.flowdock.com/account/tokens).

```
$ FLOWDOCK_API_KEY=abcdef0123456789 hear-flowdock-speak
```

### config.json

You must set up configuration by copying `config.template.json` to `config.json`
and editing to match your environment.

* `organization` - Your organization name in flowdock
* `flowdockApiKey` - _Optional_ Your Flowdock API key. You can set this here or
in the environment variable.
* `flows` - an array of names of flows to vocalize.
* `voices` - an array of names of the available voices for your platform. See the [say](https://www.npmjs.com/package/say) package for details.
* `userVoices` - A map of Flowdock user names to OS Voices. If a user is not in the list, they are assigned a random voice from `voices`.
* `filters` - A collection of regular expressions to improve pronunciations. This is an array of objects with these properties:
  * `match`- The regular expression to match (remember to escape backslashes)
  * `flags` - Optional regex flags. The default is `gi`
  * `say` - The replacement text. Use `$1` to refer to first capture group.
* `defaultRequestOptions` - the defaultRequestOptions is an object passed to
the underlying [request](https://www.npmjs.com/package/request) module to use
as default options (ie. proxy settings).
