
/* eslint-env node */
const FlowdockStream = require('flowdock-stream');
const Say = require('say');
const config = require('./config.json');
var apikey = process.env.FLOWDOCK_API_KEY ? process.env.FLOWDOCK_API_KEY : config.flowdockApiKey;
if (!apikey) {
  console.error('Flowdock API key not set. Check your configuration.');
}
var flowdockStream = FlowdockStream.createClient(
  config.organization,
  config.flows,
  apikey,
  config.defaultRequestOptions);

var voices = [''];

if (process.platform === 'linux') {
  // Assumes voices installed for Festival (http://www.festvox.org/)
  voices = ['voice_rab_diphone', 'voice_ked_diphone', 'voice_kal_diphone',
    'voice_don_diphone', 'voice_en1_mbrola', 'voice_us1_mbrola',
    'voice_us2_mbrola', 'voice_us3_mbrola'];
} else if (process.platform == 'darwin') {
  // MacOS
  voices = ['Alex', 'Agnes', 'Bruce', 'Kathy',
    'Junior', 'Princess', 'Vicki', 'Ralph',
    'Victoria', 'Fred', 'Albert', 'Whisper'];
}
// Windows [ignores the voice parameter](https://github.com/Marak/say.js/issues/46).


var speakingVoices = config.voices;

var lastSpoke = {};
var lastSpeaker = '';

var filters = config.filters;
// Precompile all the filter regular expressions
for (let i = 0; i < filters.length; i++) {
  let flags = 'flags' in filters[i] ? filters[i].flags : 'gi';
  filters[i].re = new RegExp(filters[i].match, flags);
}

flowdockStream.on('ready', function onReady() {
  let flows = '';
  for (let id in flowdockStream.flows) {
    flows += ` ${flowdockStream.flows[id].name}`;
  }
  Say.speak(`Connected to ${flows}.`);
  console.log(`Connected to ${flows}.`);
});

flowdockStream.on('data', function flowDockEventHandler(data) {
  var sourceFlow = flowdockStream.flows[data.flow];
  if (data.event === 'message') {
    var prolog = '';
    var from = (data.user) ? sourceFlow.users[data.user] : null;
    if (from != lastSpeaker) {
      lastSpeaker = from;
      if (!(from in speakingVoices)) {
        speakingVoices[lastSpeaker] = voices[Math.floor(Math.random() * voices.length)];
      }
      var now = Date.now() / 1000;
      if (!(from in lastSpoke) || (now - lastSpoke[from] > 300)) {
        lastSpoke[from] = now;
        prolog = `This is ${from}, `;
      }
    }
    var msg = data.content;
    for (let i = 0; i < filters.length; i++) {
      msg = msg.replace(filters[i].re, filters[i].say);
    }
    console.log(`${from}: ${msg}`);
    Say.speak(prolog + msg, speakingVoices[from]);
  } else {
    console.log(data.event);
  }
});

flowdockStream.on('error', function realGoodErrorHandler(err) {
  throw err;
});
