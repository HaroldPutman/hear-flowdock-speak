#!/usr/bin/env node

'use strict';

const FlowdockStream = require('flowdock-stream');
const Say = require('say');
const homedir = require('os').homedir();
const config = require(`${homedir}/.hear-flowdock-speak.json`);
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

// Precompile all the filter regular expressions
const filters = config.filters.map(function compile(filter) {
  let flags = 'flags' in filter ? filter.flags : 'gi';
  return {
    re: new RegExp(filter.match, flags),
    say: filter.say
  };
});

flowdockStream.on('ready', function onReady() {
  let flowList = Object.values(flowdockStream.flows)
    .reduce(function list(acc, flow, idx, arr) {
      if (idx === 0) {
        return acc + flow.name;
      }
      return acc + ((arr.length - idx > 1) ? ', ' : ' and ') + flow.name;
    }, '');
  Say.speak(`Connected to ${flowList}.`);
  console.log(`Connected to ${flowList}.`);
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
    let msg = data.content.substring(0, 224);
    if (msg.length < data.content.length) {
      msg.replace(/\w+$/, '');
      msg += ' clipped';
    }
    filters.forEach(function process(filter) {
      msg = msg.replace(filter.re, filter.say);
    });
    console.log(`${from}: ${msg}`);
    Say.speak(prolog + msg, speakingVoices[from]);
  }
});

flowdockStream.on('error', function realGoodErrorHandler(err) {
  throw err;
});
