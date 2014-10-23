'use strict';

require.config({
  baseUrl: './scripts',

  paths: {
    jquery: '../../bower_components/jquery/dist/jquery',
    underscore: '../../bower_components/underscore/underscore',
    backbone: '../../bower_components/backbone/backbone',
    text: '../../bower_components/requirejs-text/text',
    mps: '../../bower_components/minpubsub/minpubsub.src',
    Class: '../../bower_components/Class.js/Class',
    uri: '../../bower_components/uri-templates/uri-templates',
    moment: '../../bower_components/moment/moment',
    underscoreString: '../../bower_components/underscore.string/lib/underscore.string',
    handlebars: '../../bower_components/handlebars/handlebars',
    d3: '../../bower_components/d3/d3'
  },

  shim: {
    jquery: {
      exports: '$'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    Class: {
      exports: 'Class'
    },
    underscoreString: {
      deps: ['underscore'],
      exports: '_string'
    },
    handlebars: {
      exports: 'Handlebars'
    }
  }

});

require([
  'underscore',
  'mps',
  'router'
], function(_, mps, Router) {
  // dev
  window.mps = mps;

  new Router();
  setTimeout(function() {
    window.a = new Date();
    window.a.setYear(1995);
    window.mps.publish('Timeline/date-change', [a])
  }, 0);
});
