require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/Camera",
  "esri/layers/FeatureLayer",

  "esri/Graphic",
  "esri/geometry/Point",
  "dojo/on",

  "tools/Edit",

  "dojo/domReady!"
],
function (
  Map, SceneView, Camera, FeatureLayer,
  Graphic, Point, on, Edit
) {

  var map = new Map({
    basemap: "hybrid"
  });

  var view = new SceneView({
    container: "viewDiv",
    map: map,
    camera: {
      position: [-4.436, 48.384, 600],
      tilt: 50
    }
  });

  var fLayer = new FeatureLayer({
    url: "http://services3.arcgis.com/HXGxQblVlBV5VC9q/arcgis/rest/services/DumbData/FeatureServer/0"
  });
  map.add(fLayer);
  view.then(function() {
    var editor = new Edit({
      map: map,
      layer: fLayer
    });
    on(view, "click", function (e) {
      var attr = { isdumb: 1, description: "Added in 3D"  };
      var graphic = new Graphic({
        geometry: new Point({ x: e.mapPoint.x, y: e.mapPoint.y, spatialReference: e.mapPoint.spatialReference  }),
        attributes: attr
      });
      editor.add(graphic);
    });
  });

});
