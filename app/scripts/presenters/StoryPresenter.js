define([
  'backbone',
  'abstract/MpsClass',
  'mps',
  'views/StoryView',
  'text!csv/stories.csv'
], function(Backbone, MpsClass, mps, StoryView, STORIES_CSV){

  'use strict';

  var StoryModel = Backbone.Model.extend({

    defaults: {
      title: null,
      description: null
    }
  });

  var StoryPresenter = MpsClass.extend({

    _options: {
      delay : 3000
    },

    _subscriptions: [{
      'Timeline/date-change': function(date) {
        var year = date.getFullYear();
        var result = this.stories[year];

        this.view._empty();

        if (result) {
          this.pubTimelineStop();
          this.view._render(result);
          this.pubMapSetCenter(_.toNumber(result.lat), _.toNumber(result.lng));
          _.debounce(this.pubTimelinePlay, this._options.delay)();
        }
      }
    }],

    init: function() {
      this.status = new StoryModel();
      this.view = new StoryView();

      this.stories = _.groupBy(_.csv(STORIES_CSV), 'year');
      this._super(); //{register: true}
    },

    pubStoryDataChange: function(data) {
      mps.publish('Story/load-data', [data]);
    },

    pubTimelinePlay: function() {
      mps.publish('Timeline/play', []);
    },

    pubTimelineStop: function() {
      mps.publish('Timline/stop', []);
    },

    pubMapSetCenter: function(lat, lng) {
      mps.publish('Map/set-center', [[lat, lng]])
    }
  });

  return StoryPresenter;

});
