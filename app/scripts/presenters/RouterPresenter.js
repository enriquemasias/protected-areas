define([
  'underscore',
  'mps',
  'uri',
  'abstract/MpsClass',
  'services/screenSizeService'
], function(_, mps, UriTemplate, MpsClass, screenSizeService) {
  'use strict';

  var RouterPresenter = MpsClass.extend({

    _defaults: {
      index: {
        zoom: 2,
        lat: 8,
        lng: -32,
        basemap: 'nokia-day'
      }
    },

    _name: null,

    _uriTemplate: {
      index: '{/zoom}{/lat}{/lng}{/basemap}{?date}'
    },

    _subscriptions: [{
      'Router/register': function(presenter) {
        this._registerPresenter(presenter);
      }
    }, {
      'Router/update': function() {
        this._updateRoute();
      }
    }],

    /**
     * @param  {object} view The Router
     */
    init: function(view) {
      this.view = view;
      this._presenters = [];
      this._super();
    },

    /**
     * Publish 'Router/init' from the router.
     *
     * @param  {object} params Destandarized params.
     */
    initRoute: function(params, name) {
      this._name = name;
      var route = this._standarizeParams(params);
      mps.publish('Router/init', [route]);
      mps.publish('Router/new', [route]);
    },

    /**
     * Publish a new route from url.
     *
     * @param  {object} params Destandarized params.
     */
    newRoute: function(params) {
      var route = this._standarizeParams(params);
      mps.publish('Router/new', [route]);
    },

    /**
     * Update url silently by getting params from presenters.
     */
    _updateRoute: function() {
      var params = this._destandarizeParams(
        this._getPresenterParams(this._presenters));

      var route = this._getRoute(params);

      this.view.navigateTo(route, {
        silent: true
      });
    },

    /**
     * Register a presenter. When updating the url the RouterPresenter
     * will take route params from this presenters.
     *
     * @param  {object} presenter
     */
    _registerPresenter: function(presenter) {
      this._presenters = _.union(this._presenters, [presenter]);
    },

    /**
     * Standarize params get destandarized params from
     * the url and make them friendly to use on the app.
     *
     * @param  {object} params Destandarized params
     */
    _standarizeParams: function(params) {
      var p = {};
      params = _.extend({}, this._defaults[this._name],
       _.clean(params));

      p.name = this._name;
      p.screenSize = screenSizeService.getCurrentSize();
      p.zoom = _.toNumber(params.zoom);
      p.center = [_.toNumber(params.lat), _.toNumber(params.lng)];
      p.basemap = params.basemap;

      return p;
    },

    /**
     * Destandarize params are used to create
     * a new route url.
     *
     * Also validates route params. Not the values, just the combination of them.
     *
     * eg. on the sidebar filter, just sector or initiative can be
     * selected at the same time.
     *
     * @param {object} params    Standarized params (eg. from presenters)
     * @param {object} newParams Standarized params extend over the params
     */
    _destandarizeParams: function(params, newParams) {
      var p = {};
      params = _.extend({}, _.clean(params));

      p.zoom = params.zoom;
      p.lat = params.center[0].toFixed(2);
      p.lng = params.center[1].toFixed(2);
      p.basemap = params.basemap;

      return p;
    },

    /**
     * Return route URL for supplied route params.
     *
     * @param  {object} params The route params
     * @return {string} The route URL
     */
    _getRoute: function(params) {
      var url = new UriTemplate(this._uriTemplate[this._name]).fillFromObject(params);
      return decodeURIComponent(url);
    },

    /**
     * Return param object representing state from all registered presenters
     * that implement getRouteParams().
     *
     * @param  {array} presenters The registered presenters
     * @return {object} Params representing state from all presenters
     */
    _getPresenterParams: function(presenters) {
      var p = {};

      _.each(presenters, function(presenter) {
        _.extend(p, presenter.getRouteParams());
      }, this);

      return p;
    }

  });

  return RouterPresenter;

});
