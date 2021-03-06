$(document).ready(function() {

  function torque(layer) {
    function _torque() {}

    _torque.reach = function(slide) {
      var i = slide.get('step').value;

      function formaterForRange(start, end) {
        start = start.getTime ? start.getTime() : start;
        end = end.getTime ? end.getTime() : end;
        var span = (end - start) / 1000;
        var ONE_DAY = 3600 * 24;
        var ONE_YEAR = ONE_DAY * 31 * 12;

        function pad(n) {
          return n < 10 ? '0' + n : n;
        };

        // lest than a day
        if (span < ONE_DAY) return function(t) {
          return pad(t.getUTCHours()) + ":" + pad(t.getUTCMinutes());
        };
        if (span < ONE_YEAR) return function(t) {
          return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCDate()) + "/" + pad(t.getUTCFullYear());
        };
        return function(t) {
          return pad(t.getUTCMonth() + 1) + "/" + pad(t.getUTCFullYear());
        };
      }

      function getTimeOrStep(s) {
        var tb = layer.getTimeBounds();
        if (!tb) return;
        if (tb.columnType === 'date') {
          if (tb && tb.start !== undefined) {
            var f = formaterForRange(tb.start, tb.end);
            // avoid showing invalid dates
            if (!_.isNaN(layer.stepToTime(s).getYear())) {
              return f(layer.stepToTime(s));
            }
          }
        } else {
          return s;
        }
      }

      function truncate(s, length) {
        return s.substr(0, length - 1) + (s.length > length ? '…' : '');
      }

      var parser = new DOMParser(),
        doc = parser.parseFromString(slide.html(), 'text/html');

      var l = i * $('.slider').width() / layer.options.steps,
        tooltip = ['<div class="slide-tip slide-tip-' + i + '" style="left:' + l + 'px">',
          '<div class="tooltip">',
          '<h1>' + getTimeOrStep(i) + '</h1>',
          $(doc).find('h1').text(),
          '</div>',
          '</div>'
        ].join("\n");

      $('.slider').append(tooltip);
      var $tip = $('.slide-tip-' + i + ' .tip'),
        $tooltip = $('.slide-tip-' + i + ' .tooltip'),
        w = $tip.width() / 2

      $tip.css({
        margin: -w
      });

      var t = O.Trigger({});

      function check(changes) {
        if (changes.step >= i - 2 && changes.step < i + 2) {
          t.trigger();

          if (!$tooltip.is(':visible')) {
            $tooltip.fadeIn(150);
          }
        } else if (changes.step >= i + 2 && changes.step < i + 5) {
          setTimeout(function() {
            $('.tooltip').fadeOut(150);
          }, 2000);
        }
      };

      layer.on('change:time', check);
      t.clear = function() {
        layer.off('change:time', check);
      }
      return t;
    }

    _torque.pause = function() {
      return O.Action(function() {
        layer.pause();
      });
    }

    _torque.play = function() {
      return O.Action(function() {
        layer.play()
      });
    }

    return _torque;
  }

  O.Template({
    actions: {
      'insert time': function() {
        return "- step: " + this.torqueLayer.getStep()
      },
      'pause': function() {
        return "S.torqueLayer.actions.pause()";
      },
      'play': function() {
        return "S.torqueLayer.actions.play()";
      }
    },

    init: function() {
      var self = this;


      // var baseurl = this.baseurl = 'https://{s}.tiles.mapbox.com/v4/smbtc.k6n48gb6/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic21idGMiLCJhIjoiVXM4REppNCJ9.pjaLujYj-fcCPv5evG_0uA#3/17.98/-2.81';
      var map = this.map = L.map('map', {
        center: [20.1385, -46.0547],
        minZoom: 1,
        zoom: 2,
        maxZoom: 3,
        zoomControl: false
      });
      // var basemap = this.basemap = L.tileLayer(baseurl, {
      //   attribution: 'data OSM - map CartoDB'
      // }).addTo(map);
      this.duration = '18';

      var slides = this.slides = O.Actions.Slides('slides');
      var story = this.story = O.Story();
    },

    _resetActions: function(actions) {
      // update footer title and author
      var title_ = actions.global.title === undefined ? '' : actions.global.title,
        author_ = actions.global.author === undefined ? 'Using' : 'By ' + actions.global.author + ' using';

      document.getElementById('title').innerHTML = title_;
      document.getElementById('author').innerHTML = author_;
      document.title = title_ + " | " + author_ + ' Odyssey.js';

      document.getElementById('slides_container').style.display = "block";

      document.getElementById('slides').innerHTML = '';

      // first slide is the header, skip it
      for (var i = 0; i < actions.length; ++i) {
        var slide = actions[i];
        var tmpl = "<div class='slide' style='display:none'>"
        tmpl += slide.html();
        tmpl += "</div>";

        document.getElementById('slides').innerHTML += tmpl;

        var ac = O.Parallel(
          O.Actions.CSS($("#slides_container")).addClass('visible'),
          this.slides.activate(i),
          slide(this)
          // resizeAction
        );

        if (!slide.get('step')) return;

        this.story.addState(
          torque(this.torqueLayer).reach(slide), ac
        )
      }
    },

    update: function(actions) {
      var self = this;

      if ($("#slides_container").hasClass("visible")) {
        $("#slides_container").removeClass("visible");
      }

      if (this.duration && (this.duration !== actions.global.duration)) {
        this.duration = actions.global.duration || 18;
      }

      if (this.torqueLayer && ("http://" + self.torqueLayer.options.user + ".cartodb.com/api/v2/viz/" + self.torqueLayer.options.stat_tag + "/viz.json" !== actions.global.vizjson)) {
        this.map.removeLayer(this.torqueLayer);

        // hack to stop (not remove) binding
        this.torqueLayer.stop();
        $('.cartodb-timeslider').remove();
        $('.cartodb-legend-stack').remove();
        this.torqueLayer = null;
        this.created = false;
      }

      if (!this.torqueLayer) {
        if (!this.created) { // sendCode debounce < vis loader
          cdb.vis.Loader.get(actions.global.vizjson, function(vizjson) {
            // find index for the torque layer
            for (var i = vizjson.layers.length; i > 0; --i) {
              if (i !== 0) {
                cartodb.createLayer(self.map, vizjson, {
                    layerIndex: i -1
                  })
                  .done(function(layer) {
                    if (layer.type === 'torque') {
                      // self.map.fitWorld();

                      actions.global.duration && layer.setDuration(actions.global.duration);

                      self.torqueLayer = layer;
                      self.torqueLayer.stop();

                      self.map.addLayer(self.torqueLayer);

                      self.torqueLayer.on('change:steps', function() {
                        self.torqueLayer.play();
                        self.torqueLayer.actions = torque(self.torqueLayer);
                        self._resetActions(actions);
                      });
                    } else {
                      self.map.addLayer(layer);
                    }
                  }).on('error', function(err) {
                    console.log("some error occurred: " + err);
                  });
              }
            }
            return -1;
          });

          this.created = true;
        }

        return;
      }

      this.story.clear();

      $('.slide-tip').remove();

      this._resetActions(actions);

      if (this.created) {
        this.torqueLayer.setDuration(actions.global.duration);
        this.torqueLayer.stop();
        $('.button').removeClass('stop');
      }
    }
  });


});
