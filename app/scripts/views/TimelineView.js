define([
  'underscore',
  'backbone',
  'd3'
], function(_, Backbone, d3) {

  'use strict';

  var TimelineView = Backbone.View.extend({

    el: '#timelineView',

    events: {
      'click .play-btn': '_play',
      'click .stop-btn': '_stop'
    },

    initialize: function(presenter) {
      this.presenter = presenter;
      this.$playBtn = this.$el.find('.play-btn');
      this.$stopBtn = this.$el.find('.stop-btn');
      this.$timelineControls = this.$el.find('.timelineControls');
      this.$timelineSvg = this.$el.find('.timeline-svg');
      this.render();
    },

    /**
     * Render D3 timeline.
     */
    render: function() {
      var self = this;
      var margin = {top: 0, right: 10, bottom: 0, left: 10};
      var width = this.$timelineSvg.width() - margin.left - margin.right;
      var height = this.$timelineSvg.height() - margin.bottom - margin.top;

      var timedate = _.map(_.range(1819, 2014 + 1), function(year) {
        var date = new Date();
        date.setYear(year);
        date.setMonth(0, 1);
        return date;
      });

      // Draw SVG
      this.svg = d3.select(this.$timelineSvg.get(0))
          .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', this.getTranslate(margin.left, margin.top));

      // xscale
      this.xscale = d3.time.scale()
          .domain([timedate[0], timedate[timedate.length-1]])
          .range([0, width])
          .clamp(true);

      this.brush = d3.svg.brush()
        .x(this.xscale)
        .extent(this.xscale.domain())
        .on('brush', function() {
          self._onBrush(this);
        })
        .on('brushend', function() {
          self._onBrushEnd(this);
        });

      this.slider = this.svg.append('g')
        .attr('class', 'slider')
        .attr('transform', 'translate(0,0)')
        .call(this.brush);

      this.slider.select('.background')
          .style('cursor', 'pointer')
          .attr('height', height);
    },

    _onBrush: function(event) {
      var date = this.xscale.invert(d3.mouse(event)[0]);
      var x = this.xscale(date);
      var year = date.getFullYear();
      if (this.currentYear === year) {return;}

      this.currentYear = year;
      this.presenter.pubTimelineDateChange(date);
    },

    _onBrushEnd: function(event) {
    },

    _play: function() {
      this.$stopBtn.removeClass('hidden');
      this.$playBtn.addClass('hidden');
    },

    _stop: function() {
      this.$stopBtn.addClass('hidden');
      this.$playBtn.removeClass('hidden');
    },

    getTranslate: function(x, y) {
      return 'translate(' + x + ',' + y + ')';
    }

  });

  return TimelineView;

});
