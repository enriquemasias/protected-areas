define([
  'underscore',
  'backbone',
  'text!queries/protected_areas.psql',
  'text!cartocss/protected_areas.cartocss'
], function(_, Backbone, PROTECTED_AREAS_PSQL, PROTECTED_AREAS_CSS) {
  'use strict';

  /**
   * Basemap tile url.
   */
  var TILE_LAYERS = {
    default: 'https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png',
    'nokia-day': 'https://4.maps.nlp.nokia.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24',
    terrain: 'https://{s}.tiles.mapbox.com/v3/mapbox.natural-earth-hypso/{z}/{x}/{y}.png',
    satellite: 'https://{s}.tiles.mapbox.com/v3/mapbox.blue-marble-topo-bathy-jan/{z}/{x}/{y}.png',
    'cartodb-eco': 'https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png'
  };

  /**
   * Default Leaflet Map options.
   */
  var MAP_OPTIONS = {
    zoomControl: false,
    attributionControl: false,
  };

  var MapView = Backbone.View.extend({

    el: '#mapView',

    events: {
      'click #zoomInBtn': 'zoomIn',
      'click #zoomOutBtn': 'zoomOut'
    },

    initialize: function(presenter) {
      this.presenter = presenter;
      this.render();
    },

    /**
     * Render the leaflet map.
     *
     * @param  {object} params Map params
     */
    render: function() {
      this.map = L.map(this.el, MAP_OPTIONS);
      this.tileLayer = L.tileLayer(TILE_LAYERS.default);
      this.tileLayer.addTo(this.map);
      this._setMapEvents();
    },

    /**
     * Set leaflet map events.
     */
    _setMapEvents: function() {
      this.map.on('zoomend', _.bind(this._onZoomEnd, this));
      this.map.on('moveend', _.bind(this._onCenterChange, this));
    },

    addProtectedAreasLayer: function() {
      var options = {
        user_name: 'simbiotica',
        type: 'cartodb',
        sublayers: [{
          title: 'Protected Areas',
          slug: 'protected-areas',
          sql: this.getPASql(2014),
          cartocss: PROTECTED_AREAS_CSS
        }]
      };

      cartodb.createLayer(this.map, options)
        .addTo(this.map)
        .done(_.bind(function(layer) {
          this.PALayer = layer.getSubLayer(0);
        }, this));
    },

    updateProtectedAreas: function(date) {
      var sql = this.getPASql(date.getFullYear());
      this.PALayer.setSQL(sql);
    },

    getPASql: function(year) {
      return _.str.sprintf(PROTECTED_AREAS_PSQL, {year: year});
    },

    /**
     * Triggered when the map zoom changes.
     */
    _onZoomEnd: function(event) {
      var zoom = event.target.getZoom();
      this.presenter.status.set('zoom', zoom);
    },

    /**
     * Triggered when the map center changes.
     */
    _onCenterChange: function(event) {
      var centerObj = event.target.getCenter();
      var center = [centerObj.lat, centerObj.lng];
      this.presenter.status.set('center', center);
    },

    /**
     * Fit map to supplied bounds.
     *
     * @param  {Bounds} bounds Leaflet bounds object.
     */
    _fitBounds: function(bounds) {
      this.map.fitBounds(bounds);
    },

    /**
     * Map zoom in.
     */
    zoomIn: function() {
      this.map.zoomIn();
    },

    /**
     * Map zoom out.
     */
    zoomOut: function() {
      this.map.zoomOut();
    },

    /**
     * Change basemap.
     *
     * @param  {string} basemap
     */
    changeBasemap: function(basemap) {
      this.tileLayer.setUrl(TILE_LAYERS[basemap]);
    }

  });

  return MapView;

});
