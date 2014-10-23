define([
  'underscore'
], function(_) {
  'use strict';

  _.mixin({
    /**
     * @return {object} Return current url params.
     */
    parseUrl: function() {
      var e;
      // Regex for replacing addition symbol with a space
      var a = /\+/g;
      var r = /([^&=]+)=?([^&]*)/g;
      var d = function(s) {
        return decodeURIComponent(s.replace(a, ' '));
      };
      // var q = window.location.search.substring(1);
      // No push state:
      var q = window.location.hash.split('?')[1];
      var urlParams = {};

      // Parses URL parameters:
      while ((e = r.exec(q))) {
        urlParams[d(e[1])] = d(e[2]);
      }

      return urlParams;
    },
    clean: function(o) {
      _.each(o, function(v, k) {
        if(!v) {
          delete o[k];
        }
      });
      return o;
    },
    toNumber: function(val) {
      if ((val === undefined || val === null || String(val).trim() === '')) {
        return undefined;
      } else if (isNaN(val)) {
        return undefined;
      } else {
        return Number(val);
      }
    },
    /**
     * Return the supplied string without accents.
     */
    omitAccents: function(text) {
      var accents = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç';
      var original = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc';

      for (var i=0; i < accents.length; i++) {
        text = text.replace(accents.charAt(i), original.charAt(i));
      }

      return text;
    },
    /**
     * CSV to Object.
     */
    csv: function(csv) {
      var lines = csv.split('\n');
      var result = [];
      var headers = lines[0].split('|');
      for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split('|');
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      return result;
    }
  });
});

