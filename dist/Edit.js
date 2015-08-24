define(['exports', 'module', 'esri/request', 'esri/layers/GraphicsLayer'], function (exports, module, _esriRequest, _esriLayersGraphicsLayer) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Edit = (function () {
    function Edit(params) {
      _classCallCheck(this, Edit);

      this.map = params.map;
      this.layer = params.layer;
      this.dummyLayer = new _esriLayersGraphicsLayer();
      this.cache = [];
      this.map.add(this.dummyLayer);
    }

    _createClass(Edit, [{
      key: '_edit',
      value: function _edit(graphic, type) {
        var usePost = true;
        var action = '/' + type.toLowerCase() + 'Features';
        var data = graphic.toJSON();
        var map = this.map;
        var layer = this.layer;
        var url = layer.url + action;
        map.remove(layer);
        this.dummyLayer.clear();
        (0, _esriRequest)({
          url: url,
          content: {
            features: JSON.stringify([data]),
            f: 'json'
          },
          handleAs: 'json'
        }, { usePost: usePost }).then(function (_) {
          return map.add(layer);
        }).otherwise(function (_) {
          return map.add(layer);
        });
      }
    }, {
      key: 'add',
      value: function add(graphic) {
        var immediate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (immediate) {
          this._edit(graphic, 'add');
        } else {
          this.cache.push({ type: 'add', graphic: graphic });
          this.dummyLayer.add(graphic);
        }
      }
    }, {
      key: 'update',
      value: function update(graphic) {
        var immediate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (immediate) {
          this._edit(graphic, 'update');
        } else {
          this.cache.push({ type: 'add', graphic: graphic });
          this.dummyLayer.add(graphic);
        }
      }
    }, {
      key: 'del',
      value: function del(graphic) {
        var immediate = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

        if (immediate) {
          this._edit(graphic, 'delete');
        } else {
          this.cache.push({ type: 'delete', graphic: graphic });
          this.dummyLayer.add(graphic);
        }
      }
    }, {
      key: 'save',
      value: function save() {
        var _this = this;

        if (this.cache.length) {
          this.cache.map(function (x) {
            return _this._edit(x.graphic, x.type);
          });
          this.dummyLayer.clear();
          this.cache.length = 0;
        }
      }
    }]);

    return Edit;
  })();

  module.exports = Edit;
});
//# sourceMappingURL=Edit.js.map
