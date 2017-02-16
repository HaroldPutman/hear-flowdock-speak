
/* eslint-env node */
const FlowdockStream = require('flowdock-stream');
const Say = require('say');
const config = require('./config.json');
const apikey = process.env.FLOWDOCK_API_KEY ? process.env.FLOWDOCK_API_KEY : config.flowdockApiKey;
if (!apikey) {
  console.error('Flowdock API key not set. Check your configuration.');
}
const flowdockStream = FlowdockStream.createClient(
  config.organization,
  config.flows,
  apikey,
  config.defaultRequestOptions);

const voices = config.voices;


const speakingVoices = config.userVoices;

const lastSpoke = {};
var lastSpeaker = '';

const filters = config.filters;
// Precompile all the filter regular expressions
for (let i = 0; i < filters.length; i++) {
  let flags = 'flags' in filters[i] ? filters[i].flags : 'gi';
  filters[i].re = new RegExp(filters[i].match, flags);
}

flowdockStream.on('ready', function onReady() {
  let flows = '';
  let keys = Object.keys(flowdockStream.flows);
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) {
      flows += (keys.length - i == 1) ? ' and' : ',';
    }
    flows += ` ${flowdockStream.flows[keys[i]].name}`;
  }
  Say.speak(`Connected to ${flows}.`);
  console.log(`Connected to ${flows}.`);
});

flowdockStream.on('data', function flowDockEventHandler(data) {
  let sourceFlow = flowdockStream.flows[data.flow];
  if (data.event === 'message') {
    let prolog = '';
    let from = (data.user) ? sourceFlow.users[data.user] : null;
    if (from != lastSpeaker) {
      lastSpeaker = from;
      if (!(from in speakingVoices)) {
        speakingVoices[lastSpeaker] = voices[Math.floor(Math.random() * voices.length)];
      }
      let now = Date.now() / 1000;
      if (!(from in lastSpoke) || (now - lastSpoke[from] > 300)) {
        lastSpoke[from] = now;
        prolog = `This is ${from}, `;
      }
    }
    let msg = data.content;
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
