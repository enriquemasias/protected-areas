define([
  'underscore',
  'backbone',
  'handlebars',
  'presenters/RouterPresenter',
  'presenters/MapPresenter',
  'presenters/TimelinePresenter',
  'presenters/StoryPresenter',
  'helpers/underscoreMixinsHelper'
], function(_, Backbone, Handlebars, Presenter, MapPresenter, TimelinePresenter, StoryPresenter) {

  'use strict';

  var Router = Backbone.Router.extend({

    initialized: false,

    routes: {
      '(:zoom)(/)(:lat)(/)(:lng)(/)(:basemap)(/)': 'index'
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      Backbone.history.start();

      // CartoDB Hack
      cdb.core.Template.compilers = _.extend(cdb.core.Template.compilers, {
        handlebars: typeof(Handlebars) === 'undefined' ? null : Handlebars.compile
      });
    },

    index: function(zoom, lat, lng, basemap) {
      if (!this.initialized) {
        // Set router-registrable presenters
        new MapPresenter();
        new TimelinePresenter();
        new StoryPresenter();

      }

      var params = _.extend({
        zoom: zoom,
        lat: lat,
        lng: lng,
        basemap: basemap
      }, _.parseUrl());

      if (!this.initialized) {
        this.presenter.initRoute(params, 'index');
        this.initialized = true;
      } else {
        this.presenter.newRoute(params);
      }
    },

    /**
     * Used by RouterPresenter to navigate
     * to a new route.
     *
     * @param  {string} route
     * @param  {object} options Backbone.Router.navigate params
     */
    navigateTo: function(route, options) {
      this.navigate(route, options);
    }

  });

  return Router;

});
