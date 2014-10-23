define([
  'jquery',
  'underscore',
  'underscoreString',
  'mps',
  'backbone',
  'abstract/MpsClass',
  'views/TimelineView'
], function($, _, _string, mps, Backbone, MpsClass, TimelineView) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      date: null
    }
  });

  var TimelinePresenter = MpsClass.extend({

    _subscriptions: [{
      'Router/init': function(route) {
        this.status.set(_.pick(route,
          'date'));
      }
    }],

    init: function() {
      this.view = new TimelineView(this);
      this.status = new StatusModel();
      this._setStatusEvents();
      this._super({register: true});
    },

    _setStatusEvents: function() {
    },

    pubTimelineDateChange: function(date) {
      mps.publish('Timeline/date-change', [date]);
    },

    getRouteParams: function() {
      return _.pick(this.status.toJSON(),
        'date');
    }

  });

  return TimelinePresenter;

});
