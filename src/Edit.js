import * as esriRequest from 'esri/request';
import * as GraphicsLayer from 'esri/layers/GraphicsLayer';

class Edit {
  constructor(params) {
    this.map = params.map;
    this.layer = params.layer;
    this.dummyLayer = new GraphicsLayer();
    this.cache = [];
    this.map.add(this.dummyLayer);
  }

  _edit(graphic, type) {
    let usePost = true;
    let action = `/${type.toLowerCase()}Features`;
    let data = graphic.toJSON();
    let map = this.map;
    let layer = this.layer;
    let url = layer.url + action;
    map.remove(layer);
    this.dummyLayer.clear();
    esriRequest({
      url,
      content: {
        features: JSON.stringify([data]),
        f: 'json'
      },
      handleAs: 'json'
    }, { usePost })
    .then(_ => map.add(layer))
    .otherwise(_ => map.add(layer));
  }

  add(graphic, immediate = true) {
    if (immediate) {
      this._edit(graphic, 'add');
    } else {
      this.cache.push({ type: 'add', graphic });
      this.dummyLayer.add(graphic);
    }
  }

  update(graphic, immediate = true) {
    if(immediate) {
      this._edit(graphic, 'update');
    } else {
      this.cache.push({ type: 'add', graphic });
      this.dummyLayer.add(graphic);
    }
  }

  remove(graphic, immediate = true) {
    if(immediate) {
      this._edit(graphic, 'delete');
    } else {
      this.cache.push({ type: 'delete', graphic });
      this.dummyLayer.add(graphic);
    }
  }

  save() {
    if (this.cache.length) {
      this.cache.map(x => this._edit(x.graphic, x.type));
      this.dummyLayer.clear();
      this.cache.length = 0;
    }
  }
}

export default Edit;
