define([
  'backbone',
  'underscore',
  'handlebars',
  'text!templates/story.handlebars'
], function(Backbone, _, Handlebars, tpl){

  var StoryView = Backbone.View.extend({

    el: '#storyView',

    template: Handlebars.compile(tpl),

    _empty: function() {
      this.$el.html('');
    },

    _render: function(data) {
      this.$el.html(this.template(data[0]));
    }

  });

  return StoryView;

});
