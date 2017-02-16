
/* eslint-env node */
var FlowdockStream = require('flowdock-stream');
var config = require('./config.json');
var org = config.ORGANIZATION;
var flows = config.FLOWS;
var apikey = process.env.FLOWDOCK_API_KEY;
var defaultRequestOptions = { };
var say = require('say');
var flowdockStream = FlowdockStream.createClient(org, flows, apikey, defaultRequestOptions);

var voices = ['Alex', 'Agnes', 'Bruce', 'Kathy', 'Junior', 'Princess', 'Vicki',
  'Ralph', 'Victoria', 'Fred', 'Albert'];

var speakingVoices = config.VOICES;

var lastSpoke = {};
var lastSpeaker = '';

flowdockStream.on('ready', function onReady() {
  say.speak('Connected.');
  console.log('flowdockStream is ready, flows:\r\n', flowdockStream.flows);
});

flowdockStream.on('data', function flowDockEventHandler(data) {
  var sourceFlow = flowdockStream.flows[data.flow];
  if (data.event === 'message') {
    var prolog = '';
    var from = (data.user) ? sourceFlow.users[data.user] : null;
    if (from != lastSpeaker) {
      lastSpeaker = from;
      if (!(from in speakingVoices)) {
        speakingVoices[lastSpeaker] = voices[Math.floor(Math.random() * voices.length)];;
      }
      var now = Date.now() / 1000;
      if (!(from in lastSpoke) || (now - lastSpoke[from] > 300)) {
        lastSpoke[from] = now;
        prolog = `This is ${from}, `;
      }
    }
    var msg = data.content
      .replace(/^@(\w+)/g, '(to $1)')
      .replace(/ @(\w+)/g, '$1')
/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      'a url')
      .replace(/\bsolr\b/g, 'solar')
      .replace(/\brsync\b/g, 'arsink')
      .replace(/\bkoubot\b/g, 'Koobot')
      .replace(/FWIW/, 'For what its worth');
    console.log(`a message from ${from}, ${data.content} -> ${msg}`);
    say.speak(prolog + msg, speakingVoices[from]);
  }
});

flowdockStream.on('error', function realGoodErrorHandler(err) {
  throw err;
});
