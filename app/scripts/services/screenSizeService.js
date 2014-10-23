define([
  'jquery',
  'underscore',
  'mps',
  'abstract/MpsClass'
], function($, _, mps, MpsClass) {
  'use strict';

  var ScreenSizeService = MpsClass.extend({

    init: function() {
      this.$screenSize = $('#screenSize');
      this._publish = this.$screenSize.data('publish');

      this._super();
      this._currentSize = null;
      this._newScreenChange();
      $(window).resize(_.bind(this._newScreenChange, this));
    },

    /**
     * Get the current screen size and publish it.
     */
    _newScreenChange: function() {
      this._pubScreenSizeChange(this.getCurrentSize());
    },

    /**
     * Get the current screen size.
     *
     * @return {string} Screen size
     */
    getCurrentSize: function() {
      var $visible = this.$screenSize.find('div:visible');
      var size = $visible.data('size');
      return size;
    },

    /**
     * Publish screen size change.
     *
     * @param  {string} size
     */
    _pubScreenSizeChange: function(size) {
      if (this._publish !== 'all-changes' && this._currentSize === size) {return;}
      this._currentSize = size;
      mps.publish('ScreenSize/change', [size]);
    }

  });

  return new ScreenSizeService();

});
