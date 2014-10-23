define([
  'jquery',
  'underscore',
  'underscoreString',
  'mps',
  'backbone',
  'views/MapView',
  'abstract/MpsClass',
], function($, _, _string, mps, Backbone, MapView, MpsClass) {

  'use strict';

  var StatusModel = Backbone.Model.extend({
    defaults: {
      zoom: null,
      center: null,
      basemap: null,
    }
  });

  var MapPresenter = MpsClass.extend({

    _subscriptions: [{
      'Router/init': function(route) {
        this.status.set(_.pick(route,
          'zoom', 'center', 'basemap'));

        this.view.addProtectedAreasLayer();
        this.view.map.setView(route.center, route.zoom);
      }
    }, {
      'Map/zoom-in': function() {
        this.view.zoomIn();
      }
    }, {
      'Map/zoom-out': function() {
        this.view.zoomOut();
      }
    }, {
      'Map/basemap-change': function(name) {
        this.status.set('basemap', name);
        mps.publish('Router/update', []);
      }
    }, {
      'Timeline/date-change': function(date) {
        this.view.updateProtectedAreas(date);
      }
    }],

    init: function() {
      this.view = new MapView(this);
      this.status = new StatusModel();
      this._setStatusEvents();
      this._super({register: true});
    },

    _setStatusEvents: function() {
      this.status.on('change:zoom', this._pubZoomChange, this);
      this.status.on('change:center', this._pubCenterChange, this);
      this.status.on('change:basemap', this._changeBasemap, this);
    },

    /**
     * Publish map zoom changes.
     */
    _pubZoomChange: function() {
      mps.publish('Map/zoom-change', [this.status.get('zoom')]);
      mps.publish('Router/update', []);
    },

    /**
     * Publish map center changes.
     */
    _pubCenterChange: function() {
      mps.publish('Map/center-change',[this.status.get('center')]);
      mps.publish('Router/update', []);
    },

    /**
     * Change map basemap.
     */
    _changeBasemap: function() {
      var basemap = this.status.get('basemap');
      this.view.changeBasemap(basemap);
    },

    /**
     * Return map params to the RouterPresenter so it can
     * update the url.
     *
     * @return {object} Map url params
     */
    getRouteParams: function() {
      return _.pick(this.status.toJSON(),
        'zoom', 'center', 'basemap');
    }

  });

  return MapPresenter;

});
