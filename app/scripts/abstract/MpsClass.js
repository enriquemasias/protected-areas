define([
  'underscore',
  'Class',
  'mps'
], function(_, Class, mps) {
  'use strict';

  var MpsClass = Class.extend({

    _all: {},

    init: function(options) {
      this._cached = [];
      _.each(this._subscriptions, this._subscribe, this);

      if (options && options.register) {
        mps.publish('Router/register', [this]);
      }
    },

    /**
     * Unsubscribe presenter mps subscriptions.
     */
    unsubscribe: function() {
      for (var i = 0; i < this._cached.length; i++) {
        mps.unsubscribe(this._cached[i]);
      }
    },

    /**
     * Subscribe to events and append them to this._subs.
     */
    _subscribe: function(subscription) {
      _.each(subscription, _.bind(function(callback, name) {
        this._cached.push(
          mps.subscribe(name, _.bind(callback, this)));

        // For dev purposes.
        if (this._all[name]) {
          this._all[name] += 1;
        } else {
          this._all[name] = 1;
        }
      },this));
    }

  });

  // For dev purposes. Log all subscriptions.
  mps.all = function() {
    var totalSubs = 0;
    _.each(
      MpsClass.prototype._all, function(subs, name) {
        console.log(name, subs);
        totalSubs += subs;
    });
    return 'Total subscriptions ' + totalSubs;
  };

  return MpsClass;
});
