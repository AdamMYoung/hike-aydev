"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/quickselect/index.js
function quickselect(arr, k, left, right, compare) {
  quickselectStep(arr, k, left || 0, right || arr.length - 1, compare || defaultCompare);
}
function quickselectStep(arr, k, left, right, compare) {
  while (right > left) {
    if (right - left > 600) {
      var n = right - left + 1;
      var m = k - left + 1;
      var z = Math.log(n);
      var s = 0.5 * Math.exp(2 * z / 3);
      var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselectStep(arr, k, newLeft, newRight, compare);
    }
    var t = arr[k];
    var i = left;
    var j = right;
    swap(arr, left, k);
    if (compare(arr[right], t) > 0)
      swap(arr, left, right);
    while (i < j) {
      swap(arr, i, j);
      i++;
      j--;
      while (compare(arr[i], t) < 0)
        i++;
      while (compare(arr[j], t) > 0)
        j--;
    }
    if (compare(arr[left], t) === 0)
      swap(arr, left, j);
    else {
      j++;
      swap(arr, j, right);
    }
    if (j <= k)
      left = j + 1;
    if (k <= j)
      right = j - 1;
  }
}
function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function defaultCompare(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
var init_quickselect = __esm({
  "../../node_modules/quickselect/index.js"() {
  }
});

// ../../node_modules/rbush/index.js
var rbush_exports = {};
__export(rbush_exports, {
  default: () => RBush
});
function findItem(item, items, equalsFn) {
  if (!equalsFn)
    return items.indexOf(item);
  for (let i = 0; i < items.length; i++) {
    if (equalsFn(item, items[i]))
      return i;
  }
  return -1;
}
function calcBBox(node, toBBox) {
  distBBox(node, 0, node.children.length, toBBox, node);
}
function distBBox(node, k, p, toBBox, destNode) {
  if (!destNode)
    destNode = createNode(null);
  destNode.minX = Infinity;
  destNode.minY = Infinity;
  destNode.maxX = -Infinity;
  destNode.maxY = -Infinity;
  for (let i = k; i < p; i++) {
    const child = node.children[i];
    extend(destNode, node.leaf ? toBBox(child) : child);
  }
  return destNode;
}
function extend(a, b) {
  a.minX = Math.min(a.minX, b.minX);
  a.minY = Math.min(a.minY, b.minY);
  a.maxX = Math.max(a.maxX, b.maxX);
  a.maxY = Math.max(a.maxY, b.maxY);
  return a;
}
function compareNodeMinX(a, b) {
  return a.minX - b.minX;
}
function compareNodeMinY(a, b) {
  return a.minY - b.minY;
}
function bboxArea(a) {
  return (a.maxX - a.minX) * (a.maxY - a.minY);
}
function bboxMargin(a) {
  return a.maxX - a.minX + (a.maxY - a.minY);
}
function enlargedArea(a, b) {
  return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) * (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}
function intersectionArea(a, b) {
  const minX = Math.max(a.minX, b.minX);
  const minY = Math.max(a.minY, b.minY);
  const maxX = Math.min(a.maxX, b.maxX);
  const maxY = Math.min(a.maxY, b.maxY);
  return Math.max(0, maxX - minX) * Math.max(0, maxY - minY);
}
function contains(a, b) {
  return a.minX <= b.minX && a.minY <= b.minY && b.maxX <= a.maxX && b.maxY <= a.maxY;
}
function intersects(a, b) {
  return b.minX <= a.maxX && b.minY <= a.maxY && b.maxX >= a.minX && b.maxY >= a.minY;
}
function createNode(children) {
  return {
    children,
    height: 1,
    leaf: true,
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  };
}
function multiSelect(arr, left, right, n, compare) {
  const stack = [left, right];
  while (stack.length) {
    right = stack.pop();
    left = stack.pop();
    if (right - left <= n)
      continue;
    const mid = left + Math.ceil((right - left) / n / 2) * n;
    quickselect(arr, mid, left, right, compare);
    stack.push(left, mid, mid, right);
  }
}
var RBush;
var init_rbush = __esm({
  "../../node_modules/rbush/index.js"() {
    init_quickselect();
    RBush = class {
      constructor(maxEntries = 9) {
        this._maxEntries = Math.max(4, maxEntries);
        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));
        this.clear();
      }
      all() {
        return this._all(this.data, []);
      }
      search(bbox2) {
        let node = this.data;
        const result = [];
        if (!intersects(bbox2, node))
          return result;
        const toBBox = this.toBBox;
        const nodesToSearch = [];
        while (node) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const childBBox = node.leaf ? toBBox(child) : child;
            if (intersects(bbox2, childBBox)) {
              if (node.leaf)
                result.push(child);
              else if (contains(bbox2, childBBox))
                this._all(child, result);
              else
                nodesToSearch.push(child);
            }
          }
          node = nodesToSearch.pop();
        }
        return result;
      }
      collides(bbox2) {
        let node = this.data;
        if (!intersects(bbox2, node))
          return false;
        const nodesToSearch = [];
        while (node) {
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const childBBox = node.leaf ? this.toBBox(child) : child;
            if (intersects(bbox2, childBBox)) {
              if (node.leaf || contains(bbox2, childBBox))
                return true;
              nodesToSearch.push(child);
            }
          }
          node = nodesToSearch.pop();
        }
        return false;
      }
      load(data) {
        if (!(data && data.length))
          return this;
        if (data.length < this._minEntries) {
          for (let i = 0; i < data.length; i++) {
            this.insert(data[i]);
          }
          return this;
        }
        let node = this._build(data.slice(), 0, data.length - 1, 0);
        if (!this.data.children.length) {
          this.data = node;
        } else if (this.data.height === node.height) {
          this._splitRoot(this.data, node);
        } else {
          if (this.data.height < node.height) {
            const tmpNode = this.data;
            this.data = node;
            node = tmpNode;
          }
          this._insert(node, this.data.height - node.height - 1, true);
        }
        return this;
      }
      insert(item) {
        if (item)
          this._insert(item, this.data.height - 1);
        return this;
      }
      clear() {
        this.data = createNode([]);
        return this;
      }
      remove(item, equalsFn) {
        if (!item)
          return this;
        let node = this.data;
        const bbox2 = this.toBBox(item);
        const path = [];
        const indexes = [];
        let i, parent, goingUp;
        while (node || path.length) {
          if (!node) {
            node = path.pop();
            parent = path[path.length - 1];
            i = indexes.pop();
            goingUp = true;
          }
          if (node.leaf) {
            const index = findItem(item, node.children, equalsFn);
            if (index !== -1) {
              node.children.splice(index, 1);
              path.push(node);
              this._condense(path);
              return this;
            }
          }
          if (!goingUp && !node.leaf && contains(node, bbox2)) {
            path.push(node);
            indexes.push(i);
            i = 0;
            parent = node;
            node = node.children[0];
          } else if (parent) {
            i++;
            node = parent.children[i];
            goingUp = false;
          } else
            node = null;
        }
        return this;
      }
      toBBox(item) {
        return item;
      }
      compareMinX(a, b) {
        return a.minX - b.minX;
      }
      compareMinY(a, b) {
        return a.minY - b.minY;
      }
      toJSON() {
        return this.data;
      }
      fromJSON(data) {
        this.data = data;
        return this;
      }
      _all(node, result) {
        const nodesToSearch = [];
        while (node) {
          if (node.leaf)
            result.push(...node.children);
          else
            nodesToSearch.push(...node.children);
          node = nodesToSearch.pop();
        }
        return result;
      }
      _build(items, left, right, height) {
        const N = right - left + 1;
        let M = this._maxEntries;
        let node;
        if (N <= M) {
          node = createNode(items.slice(left, right + 1));
          calcBBox(node, this.toBBox);
          return node;
        }
        if (!height) {
          height = Math.ceil(Math.log(N) / Math.log(M));
          M = Math.ceil(N / Math.pow(M, height - 1));
        }
        node = createNode([]);
        node.leaf = false;
        node.height = height;
        const N2 = Math.ceil(N / M);
        const N1 = N2 * Math.ceil(Math.sqrt(M));
        multiSelect(items, left, right, N1, this.compareMinX);
        for (let i = left; i <= right; i += N1) {
          const right2 = Math.min(i + N1 - 1, right);
          multiSelect(items, i, right2, N2, this.compareMinY);
          for (let j = i; j <= right2; j += N2) {
            const right3 = Math.min(j + N2 - 1, right2);
            node.children.push(this._build(items, j, right3, height - 1));
          }
        }
        calcBBox(node, this.toBBox);
        return node;
      }
      _chooseSubtree(bbox2, node, level, path) {
        while (true) {
          path.push(node);
          if (node.leaf || path.length - 1 === level)
            break;
          let minArea = Infinity;
          let minEnlargement = Infinity;
          let targetNode;
          for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];
            const area = bboxArea(child);
            const enlargement = enlargedArea(bbox2, child) - area;
            if (enlargement < minEnlargement) {
              minEnlargement = enlargement;
              minArea = area < minArea ? area : minArea;
              targetNode = child;
            } else if (enlargement === minEnlargement) {
              if (area < minArea) {
                minArea = area;
                targetNode = child;
              }
            }
          }
          node = targetNode || node.children[0];
        }
        return node;
      }
      _insert(item, level, isNode) {
        const bbox2 = isNode ? item : this.toBBox(item);
        const insertPath = [];
        const node = this._chooseSubtree(bbox2, this.data, level, insertPath);
        node.children.push(item);
        extend(node, bbox2);
        while (level >= 0) {
          if (insertPath[level].children.length > this._maxEntries) {
            this._split(insertPath, level);
            level--;
          } else
            break;
        }
        this._adjustParentBBoxes(bbox2, insertPath, level);
      }
      // split overflowed node into two
      _split(insertPath, level) {
        const node = insertPath[level];
        const M = node.children.length;
        const m = this._minEntries;
        this._chooseSplitAxis(node, m, M);
        const splitIndex = this._chooseSplitIndex(node, m, M);
        const newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;
        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);
        if (level)
          insertPath[level - 1].children.push(newNode);
        else
          this._splitRoot(node, newNode);
      }
      _splitRoot(node, newNode) {
        this.data = createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        calcBBox(this.data, this.toBBox);
      }
      _chooseSplitIndex(node, m, M) {
        let index;
        let minOverlap = Infinity;
        let minArea = Infinity;
        for (let i = m; i <= M - m; i++) {
          const bbox1 = distBBox(node, 0, i, this.toBBox);
          const bbox2 = distBBox(node, i, M, this.toBBox);
          const overlap = intersectionArea(bbox1, bbox2);
          const area = bboxArea(bbox1) + bboxArea(bbox2);
          if (overlap < minOverlap) {
            minOverlap = overlap;
            index = i;
            minArea = area < minArea ? area : minArea;
          } else if (overlap === minOverlap) {
            if (area < minArea) {
              minArea = area;
              index = i;
            }
          }
        }
        return index || M - m;
      }
      // sorts node children by the best axis for split
      _chooseSplitAxis(node, m, M) {
        const compareMinX = node.leaf ? this.compareMinX : compareNodeMinX;
        const compareMinY = node.leaf ? this.compareMinY : compareNodeMinY;
        const xMargin = this._allDistMargin(node, m, M, compareMinX);
        const yMargin = this._allDistMargin(node, m, M, compareMinY);
        if (xMargin < yMargin)
          node.children.sort(compareMinX);
      }
      // total margin of all possible split distributions where each node is at least m full
      _allDistMargin(node, m, M, compare) {
        node.children.sort(compare);
        const toBBox = this.toBBox;
        const leftBBox = distBBox(node, 0, m, toBBox);
        const rightBBox = distBBox(node, M - m, M, toBBox);
        let margin = bboxMargin(leftBBox) + bboxMargin(rightBBox);
        for (let i = m; i < M - m; i++) {
          const child = node.children[i];
          extend(leftBBox, node.leaf ? toBBox(child) : child);
          margin += bboxMargin(leftBBox);
        }
        for (let i = M - m - 1; i >= m; i--) {
          const child = node.children[i];
          extend(rightBBox, node.leaf ? toBBox(child) : child);
          margin += bboxMargin(rightBBox);
        }
        return margin;
      }
      _adjustParentBBoxes(bbox2, path, level) {
        for (let i = level; i >= 0; i--) {
          extend(path[i], bbox2);
        }
      }
      _condense(path) {
        for (let i = path.length - 1, siblings; i >= 0; i--) {
          if (path[i].children.length === 0) {
            if (i > 0) {
              siblings = path[i - 1].children;
              siblings.splice(siblings.indexOf(path[i]), 1);
            } else
              this.clear();
          } else
            calcBBox(path[i], this.toBBox);
        }
      }
    };
  }
});

// ../../node_modules/@turf/helpers/dist/js/index.js
var require_js = __commonJS({
  "../../node_modules/@turf/helpers/dist/js/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.earthRadius = 63710088e-1;
    exports.factors = {
      centimeters: exports.earthRadius * 100,
      centimetres: exports.earthRadius * 100,
      degrees: exports.earthRadius / 111325,
      feet: exports.earthRadius * 3.28084,
      inches: exports.earthRadius * 39.37,
      kilometers: exports.earthRadius / 1e3,
      kilometres: exports.earthRadius / 1e3,
      meters: exports.earthRadius,
      metres: exports.earthRadius,
      miles: exports.earthRadius / 1609.344,
      millimeters: exports.earthRadius * 1e3,
      millimetres: exports.earthRadius * 1e3,
      nauticalmiles: exports.earthRadius / 1852,
      radians: 1,
      yards: exports.earthRadius * 1.0936
    };
    exports.unitsFactors = {
      centimeters: 100,
      centimetres: 100,
      degrees: 1 / 111325,
      feet: 3.28084,
      inches: 39.37,
      kilometers: 1 / 1e3,
      kilometres: 1 / 1e3,
      meters: 1,
      metres: 1,
      miles: 1 / 1609.344,
      millimeters: 1e3,
      millimetres: 1e3,
      nauticalmiles: 1 / 1852,
      radians: 1 / exports.earthRadius,
      yards: 1.0936133
    };
    exports.areaFactors = {
      acres: 247105e-9,
      centimeters: 1e4,
      centimetres: 1e4,
      feet: 10.763910417,
      hectares: 1e-4,
      inches: 1550.003100006,
      kilometers: 1e-6,
      kilometres: 1e-6,
      meters: 1,
      metres: 1,
      miles: 386e-9,
      millimeters: 1e6,
      millimetres: 1e6,
      yards: 1.195990046
    };
    function feature2(geom, properties, options) {
      if (options === void 0) {
        options = {};
      }
      var feat = { type: "Feature" };
      if (options.id === 0 || options.id) {
        feat.id = options.id;
      }
      if (options.bbox) {
        feat.bbox = options.bbox;
      }
      feat.properties = properties || {};
      feat.geometry = geom;
      return feat;
    }
    exports.feature = feature2;
    function geometry(type, coordinates, _options) {
      if (_options === void 0) {
        _options = {};
      }
      switch (type) {
        case "Point":
          return point2(coordinates).geometry;
        case "LineString":
          return lineString2(coordinates).geometry;
        case "Polygon":
          return polygon2(coordinates).geometry;
        case "MultiPoint":
          return multiPoint(coordinates).geometry;
        case "MultiLineString":
          return multiLineString(coordinates).geometry;
        case "MultiPolygon":
          return multiPolygon(coordinates).geometry;
        default:
          throw new Error(type + " is invalid");
      }
    }
    exports.geometry = geometry;
    function point2(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      if (!coordinates) {
        throw new Error("coordinates is required");
      }
      if (!Array.isArray(coordinates)) {
        throw new Error("coordinates must be an Array");
      }
      if (coordinates.length < 2) {
        throw new Error("coordinates must be at least 2 numbers long");
      }
      if (!isNumber2(coordinates[0]) || !isNumber2(coordinates[1])) {
        throw new Error("coordinates must contain numbers");
      }
      var geom = {
        type: "Point",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.point = point2;
    function points(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      return featureCollection2(coordinates.map(function(coords) {
        return point2(coords, properties);
      }), options);
    }
    exports.points = points;
    function polygon2(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
        var ring = coordinates_1[_i];
        if (ring.length < 4) {
          throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
        }
        for (var j = 0; j < ring[ring.length - 1].length; j++) {
          if (ring[ring.length - 1][j] !== ring[0][j]) {
            throw new Error("First and last Position are not equivalent.");
          }
        }
      }
      var geom = {
        type: "Polygon",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.polygon = polygon2;
    function polygons(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      return featureCollection2(coordinates.map(function(coords) {
        return polygon2(coords, properties);
      }), options);
    }
    exports.polygons = polygons;
    function lineString2(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      if (coordinates.length < 2) {
        throw new Error("coordinates must be an array of two or more positions");
      }
      var geom = {
        type: "LineString",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.lineString = lineString2;
    function lineStrings(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      return featureCollection2(coordinates.map(function(coords) {
        return lineString2(coords, properties);
      }), options);
    }
    exports.lineStrings = lineStrings;
    function featureCollection2(features, options) {
      if (options === void 0) {
        options = {};
      }
      var fc = { type: "FeatureCollection" };
      if (options.id) {
        fc.id = options.id;
      }
      if (options.bbox) {
        fc.bbox = options.bbox;
      }
      fc.features = features;
      return fc;
    }
    exports.featureCollection = featureCollection2;
    function multiLineString(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      var geom = {
        type: "MultiLineString",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.multiLineString = multiLineString;
    function multiPoint(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      var geom = {
        type: "MultiPoint",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.multiPoint = multiPoint;
    function multiPolygon(coordinates, properties, options) {
      if (options === void 0) {
        options = {};
      }
      var geom = {
        type: "MultiPolygon",
        coordinates
      };
      return feature2(geom, properties, options);
    }
    exports.multiPolygon = multiPolygon;
    function geometryCollection(geometries, properties, options) {
      if (options === void 0) {
        options = {};
      }
      var geom = {
        type: "GeometryCollection",
        geometries
      };
      return feature2(geom, properties, options);
    }
    exports.geometryCollection = geometryCollection;
    function round(num, precision) {
      if (precision === void 0) {
        precision = 0;
      }
      if (precision && !(precision >= 0)) {
        throw new Error("precision must be a positive number");
      }
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(num * multiplier) / multiplier;
    }
    exports.round = round;
    function radiansToLength(radians, units) {
      if (units === void 0) {
        units = "kilometers";
      }
      var factor = exports.factors[units];
      if (!factor) {
        throw new Error(units + " units is invalid");
      }
      return radians * factor;
    }
    exports.radiansToLength = radiansToLength;
    function lengthToRadians2(distance, units) {
      if (units === void 0) {
        units = "kilometers";
      }
      var factor = exports.factors[units];
      if (!factor) {
        throw new Error(units + " units is invalid");
      }
      return distance / factor;
    }
    exports.lengthToRadians = lengthToRadians2;
    function lengthToDegrees(distance, units) {
      return radiansToDegrees2(lengthToRadians2(distance, units));
    }
    exports.lengthToDegrees = lengthToDegrees;
    function bearingToAzimuth(bearing) {
      var angle = bearing % 360;
      if (angle < 0) {
        angle += 360;
      }
      return angle;
    }
    exports.bearingToAzimuth = bearingToAzimuth;
    function radiansToDegrees2(radians) {
      var degrees = radians % (2 * Math.PI);
      return degrees * 180 / Math.PI;
    }
    exports.radiansToDegrees = radiansToDegrees2;
    function degreesToRadians2(degrees) {
      var radians = degrees % 360;
      return radians * Math.PI / 180;
    }
    exports.degreesToRadians = degreesToRadians2;
    function convertLength(length, originalUnit, finalUnit) {
      if (originalUnit === void 0) {
        originalUnit = "kilometers";
      }
      if (finalUnit === void 0) {
        finalUnit = "kilometers";
      }
      if (!(length >= 0)) {
        throw new Error("length must be a positive number");
      }
      return radiansToLength(lengthToRadians2(length, originalUnit), finalUnit);
    }
    exports.convertLength = convertLength;
    function convertArea(area, originalUnit, finalUnit) {
      if (originalUnit === void 0) {
        originalUnit = "meters";
      }
      if (finalUnit === void 0) {
        finalUnit = "kilometers";
      }
      if (!(area >= 0)) {
        throw new Error("area must be a positive number");
      }
      var startFactor = exports.areaFactors[originalUnit];
      if (!startFactor) {
        throw new Error("invalid original units");
      }
      var finalFactor = exports.areaFactors[finalUnit];
      if (!finalFactor) {
        throw new Error("invalid final units");
      }
      return area / startFactor * finalFactor;
    }
    exports.convertArea = convertArea;
    function isNumber2(num) {
      return !isNaN(num) && num !== null && !Array.isArray(num);
    }
    exports.isNumber = isNumber2;
    function isObject2(input) {
      return !!input && input.constructor === Object;
    }
    exports.isObject = isObject2;
    function validateBBox(bbox2) {
      if (!bbox2) {
        throw new Error("bbox is required");
      }
      if (!Array.isArray(bbox2)) {
        throw new Error("bbox must be an Array");
      }
      if (bbox2.length !== 4 && bbox2.length !== 6) {
        throw new Error("bbox must be an Array of 4 or 6 numbers");
      }
      bbox2.forEach(function(num) {
        if (!isNumber2(num)) {
          throw new Error("bbox must only contain numbers");
        }
      });
    }
    exports.validateBBox = validateBBox;
    function validateId(id) {
      if (!id) {
        throw new Error("id is required");
      }
      if (["string", "number"].indexOf(typeof id) === -1) {
        throw new Error("id must be a number or a string");
      }
    }
    exports.validateId = validateId;
  }
});

// ../../node_modules/@turf/meta/dist/js/index.js
var require_js2 = __commonJS({
  "../../node_modules/@turf/meta/dist/js/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var helpers = require_js();
    function coordEach(geojson, callback, excludeWrapCoord) {
      if (geojson === null)
        return;
      var j, k, l, geometry, stopG, coords, geometryMaybeCollection, wrapShrink = 0, coordIndex = 0, isGeometryCollection, type = geojson.type, isFeatureCollection = type === "FeatureCollection", isFeature = type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
      for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
        geometryMaybeCollection = isFeatureCollection ? geojson.features[featureIndex].geometry : isFeature ? geojson.geometry : geojson;
        isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
          var multiFeatureIndex = 0;
          var geometryIndex = 0;
          geometry = isGeometryCollection ? geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;
          if (geometry === null)
            continue;
          coords = geometry.coordinates;
          var geomType = geometry.type;
          wrapShrink = excludeWrapCoord && (geomType === "Polygon" || geomType === "MultiPolygon") ? 1 : 0;
          switch (geomType) {
            case null:
              break;
            case "Point":
              if (callback(
                coords,
                coordIndex,
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false)
                return false;
              coordIndex++;
              multiFeatureIndex++;
              break;
            case "LineString":
            case "MultiPoint":
              for (j = 0; j < coords.length; j++) {
                if (callback(
                  coords[j],
                  coordIndex,
                  featureIndex,
                  multiFeatureIndex,
                  geometryIndex
                ) === false)
                  return false;
                coordIndex++;
                if (geomType === "MultiPoint")
                  multiFeatureIndex++;
              }
              if (geomType === "LineString")
                multiFeatureIndex++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (j = 0; j < coords.length; j++) {
                for (k = 0; k < coords[j].length - wrapShrink; k++) {
                  if (callback(
                    coords[j][k],
                    coordIndex,
                    featureIndex,
                    multiFeatureIndex,
                    geometryIndex
                  ) === false)
                    return false;
                  coordIndex++;
                }
                if (geomType === "MultiLineString")
                  multiFeatureIndex++;
                if (geomType === "Polygon")
                  geometryIndex++;
              }
              if (geomType === "Polygon")
                multiFeatureIndex++;
              break;
            case "MultiPolygon":
              for (j = 0; j < coords.length; j++) {
                geometryIndex = 0;
                for (k = 0; k < coords[j].length; k++) {
                  for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
                    if (callback(
                      coords[j][k][l],
                      coordIndex,
                      featureIndex,
                      multiFeatureIndex,
                      geometryIndex
                    ) === false)
                      return false;
                    coordIndex++;
                  }
                  geometryIndex++;
                }
                multiFeatureIndex++;
              }
              break;
            case "GeometryCollection":
              for (j = 0; j < geometry.geometries.length; j++)
                if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false)
                  return false;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
    function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
      var previousValue = initialValue;
      coordEach(
        geojson,
        function(currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
          if (coordIndex === 0 && initialValue === void 0)
            previousValue = currentCoord;
          else
            previousValue = callback(
              previousValue,
              currentCoord,
              coordIndex,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            );
        },
        excludeWrapCoord
      );
      return previousValue;
    }
    function propEach(geojson, callback) {
      var i;
      switch (geojson.type) {
        case "FeatureCollection":
          for (i = 0; i < geojson.features.length; i++) {
            if (callback(geojson.features[i].properties, i) === false)
              break;
          }
          break;
        case "Feature":
          callback(geojson.properties, 0);
          break;
      }
    }
    function propReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      propEach(geojson, function(currentProperties, featureIndex) {
        if (featureIndex === 0 && initialValue === void 0)
          previousValue = currentProperties;
        else
          previousValue = callback(previousValue, currentProperties, featureIndex);
      });
      return previousValue;
    }
    function featureEach2(geojson, callback) {
      if (geojson.type === "Feature") {
        callback(geojson, 0);
      } else if (geojson.type === "FeatureCollection") {
        for (var i = 0; i < geojson.features.length; i++) {
          if (callback(geojson.features[i], i) === false)
            break;
        }
      }
    }
    function featureReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      featureEach2(geojson, function(currentFeature, featureIndex) {
        if (featureIndex === 0 && initialValue === void 0)
          previousValue = currentFeature;
        else
          previousValue = callback(previousValue, currentFeature, featureIndex);
      });
      return previousValue;
    }
    function coordAll(geojson) {
      var coords = [];
      coordEach(geojson, function(coord) {
        coords.push(coord);
      });
      return coords;
    }
    function geomEach2(geojson, callback) {
      var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === "FeatureCollection", isFeature = geojson.type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
      for (i = 0; i < stop; i++) {
        geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
        featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
        featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
        featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
        isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
        for (g = 0; g < stopG; g++) {
          geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
          if (geometry === null) {
            if (callback(
              null,
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            ) === false)
              return false;
            continue;
          }
          switch (geometry.type) {
            case "Point":
            case "LineString":
            case "MultiPoint":
            case "Polygon":
            case "MultiLineString":
            case "MultiPolygon": {
              if (callback(
                geometry,
                featureIndex,
                featureProperties,
                featureBBox,
                featureId
              ) === false)
                return false;
              break;
            }
            case "GeometryCollection": {
              for (j = 0; j < geometry.geometries.length; j++) {
                if (callback(
                  geometry.geometries[j],
                  featureIndex,
                  featureProperties,
                  featureBBox,
                  featureId
                ) === false)
                  return false;
              }
              break;
            }
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
        featureIndex++;
      }
    }
    function geomReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      geomEach2(
        geojson,
        function(currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
          if (featureIndex === 0 && initialValue === void 0)
            previousValue = currentGeometry;
          else
            previousValue = callback(
              previousValue,
              currentGeometry,
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            );
        }
      );
      return previousValue;
    }
    function flattenEach2(geojson, callback) {
      geomEach2(geojson, function(geometry, featureIndex, properties, bbox2, id) {
        var type = geometry === null ? null : geometry.type;
        switch (type) {
          case null:
          case "Point":
          case "LineString":
          case "Polygon":
            if (callback(
              helpers.feature(geometry, properties, { bbox: bbox2, id }),
              featureIndex,
              0
            ) === false)
              return false;
            return;
        }
        var geomType;
        switch (type) {
          case "MultiPoint":
            geomType = "Point";
            break;
          case "MultiLineString":
            geomType = "LineString";
            break;
          case "MultiPolygon":
            geomType = "Polygon";
            break;
        }
        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
          var coordinate = geometry.coordinates[multiFeatureIndex];
          var geom = {
            type: geomType,
            coordinates: coordinate
          };
          if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false)
            return false;
        }
      });
    }
    function flattenReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      flattenEach2(
        geojson,
        function(currentFeature, featureIndex, multiFeatureIndex) {
          if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === void 0)
            previousValue = currentFeature;
          else
            previousValue = callback(
              previousValue,
              currentFeature,
              featureIndex,
              multiFeatureIndex
            );
        }
      );
      return previousValue;
    }
    function segmentEach(geojson, callback) {
      flattenEach2(geojson, function(feature2, featureIndex, multiFeatureIndex) {
        var segmentIndex = 0;
        if (!feature2.geometry)
          return;
        var type = feature2.geometry.type;
        if (type === "Point" || type === "MultiPoint")
          return;
        var previousCoords;
        var previousFeatureIndex = 0;
        var previousMultiIndex = 0;
        var prevGeomIndex = 0;
        if (coordEach(
          feature2,
          function(currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
            if (previousCoords === void 0 || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
              previousCoords = currentCoord;
              previousFeatureIndex = featureIndex;
              previousMultiIndex = multiPartIndexCoord;
              prevGeomIndex = geometryIndex;
              segmentIndex = 0;
              return;
            }
            var currentSegment = helpers.lineString(
              [previousCoords, currentCoord],
              feature2.properties
            );
            if (callback(
              currentSegment,
              featureIndex,
              multiFeatureIndex,
              geometryIndex,
              segmentIndex
            ) === false)
              return false;
            segmentIndex++;
            previousCoords = currentCoord;
          }
        ) === false)
          return false;
      });
    }
    function segmentReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      var started = false;
      segmentEach(
        geojson,
        function(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
          if (started === false && initialValue === void 0)
            previousValue = currentSegment;
          else
            previousValue = callback(
              previousValue,
              currentSegment,
              featureIndex,
              multiFeatureIndex,
              geometryIndex,
              segmentIndex
            );
          started = true;
        }
      );
      return previousValue;
    }
    function lineEach(geojson, callback) {
      if (!geojson)
        throw new Error("geojson is required");
      flattenEach2(geojson, function(feature2, featureIndex, multiFeatureIndex) {
        if (feature2.geometry === null)
          return;
        var type = feature2.geometry.type;
        var coords = feature2.geometry.coordinates;
        switch (type) {
          case "LineString":
            if (callback(feature2, featureIndex, multiFeatureIndex, 0, 0) === false)
              return false;
            break;
          case "Polygon":
            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
              if (callback(
                helpers.lineString(coords[geometryIndex], feature2.properties),
                featureIndex,
                multiFeatureIndex,
                geometryIndex
              ) === false)
                return false;
            }
            break;
        }
      });
    }
    function lineReduce(geojson, callback, initialValue) {
      var previousValue = initialValue;
      lineEach(
        geojson,
        function(currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
          if (featureIndex === 0 && initialValue === void 0)
            previousValue = currentLine;
          else
            previousValue = callback(
              previousValue,
              currentLine,
              featureIndex,
              multiFeatureIndex,
              geometryIndex
            );
        }
      );
      return previousValue;
    }
    function findSegment(geojson, options) {
      options = options || {};
      if (!helpers.isObject(options))
        throw new Error("options is invalid");
      var featureIndex = options.featureIndex || 0;
      var multiFeatureIndex = options.multiFeatureIndex || 0;
      var geometryIndex = options.geometryIndex || 0;
      var segmentIndex = options.segmentIndex || 0;
      var properties = options.properties;
      var geometry;
      switch (geojson.type) {
        case "FeatureCollection":
          if (featureIndex < 0)
            featureIndex = geojson.features.length + featureIndex;
          properties = properties || geojson.features[featureIndex].properties;
          geometry = geojson.features[featureIndex].geometry;
          break;
        case "Feature":
          properties = properties || geojson.properties;
          geometry = geojson.geometry;
          break;
        case "Point":
        case "MultiPoint":
          return null;
        case "LineString":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon":
          geometry = geojson;
          break;
        default:
          throw new Error("geojson is invalid");
      }
      if (geometry === null)
        return null;
      var coords = geometry.coordinates;
      switch (geometry.type) {
        case "Point":
        case "MultiPoint":
          return null;
        case "LineString":
          if (segmentIndex < 0)
            segmentIndex = coords.length + segmentIndex - 1;
          return helpers.lineString(
            [coords[segmentIndex], coords[segmentIndex + 1]],
            properties,
            options
          );
        case "Polygon":
          if (geometryIndex < 0)
            geometryIndex = coords.length + geometryIndex;
          if (segmentIndex < 0)
            segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
          return helpers.lineString(
            [
              coords[geometryIndex][segmentIndex],
              coords[geometryIndex][segmentIndex + 1]
            ],
            properties,
            options
          );
        case "MultiLineString":
          if (multiFeatureIndex < 0)
            multiFeatureIndex = coords.length + multiFeatureIndex;
          if (segmentIndex < 0)
            segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
          return helpers.lineString(
            [
              coords[multiFeatureIndex][segmentIndex],
              coords[multiFeatureIndex][segmentIndex + 1]
            ],
            properties,
            options
          );
        case "MultiPolygon":
          if (multiFeatureIndex < 0)
            multiFeatureIndex = coords.length + multiFeatureIndex;
          if (geometryIndex < 0)
            geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
          if (segmentIndex < 0)
            segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
          return helpers.lineString(
            [
              coords[multiFeatureIndex][geometryIndex][segmentIndex],
              coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]
            ],
            properties,
            options
          );
      }
      throw new Error("geojson is invalid");
    }
    function findPoint(geojson, options) {
      options = options || {};
      if (!helpers.isObject(options))
        throw new Error("options is invalid");
      var featureIndex = options.featureIndex || 0;
      var multiFeatureIndex = options.multiFeatureIndex || 0;
      var geometryIndex = options.geometryIndex || 0;
      var coordIndex = options.coordIndex || 0;
      var properties = options.properties;
      var geometry;
      switch (geojson.type) {
        case "FeatureCollection":
          if (featureIndex < 0)
            featureIndex = geojson.features.length + featureIndex;
          properties = properties || geojson.features[featureIndex].properties;
          geometry = geojson.features[featureIndex].geometry;
          break;
        case "Feature":
          properties = properties || geojson.properties;
          geometry = geojson.geometry;
          break;
        case "Point":
        case "MultiPoint":
          return null;
        case "LineString":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon":
          geometry = geojson;
          break;
        default:
          throw new Error("geojson is invalid");
      }
      if (geometry === null)
        return null;
      var coords = geometry.coordinates;
      switch (geometry.type) {
        case "Point":
          return helpers.point(coords, properties, options);
        case "MultiPoint":
          if (multiFeatureIndex < 0)
            multiFeatureIndex = coords.length + multiFeatureIndex;
          return helpers.point(coords[multiFeatureIndex], properties, options);
        case "LineString":
          if (coordIndex < 0)
            coordIndex = coords.length + coordIndex;
          return helpers.point(coords[coordIndex], properties, options);
        case "Polygon":
          if (geometryIndex < 0)
            geometryIndex = coords.length + geometryIndex;
          if (coordIndex < 0)
            coordIndex = coords[geometryIndex].length + coordIndex;
          return helpers.point(coords[geometryIndex][coordIndex], properties, options);
        case "MultiLineString":
          if (multiFeatureIndex < 0)
            multiFeatureIndex = coords.length + multiFeatureIndex;
          if (coordIndex < 0)
            coordIndex = coords[multiFeatureIndex].length + coordIndex;
          return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
        case "MultiPolygon":
          if (multiFeatureIndex < 0)
            multiFeatureIndex = coords.length + multiFeatureIndex;
          if (geometryIndex < 0)
            geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
          if (coordIndex < 0)
            coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
          return helpers.point(
            coords[multiFeatureIndex][geometryIndex][coordIndex],
            properties,
            options
          );
      }
      throw new Error("geojson is invalid");
    }
    exports.coordAll = coordAll;
    exports.coordEach = coordEach;
    exports.coordReduce = coordReduce;
    exports.featureEach = featureEach2;
    exports.featureReduce = featureReduce;
    exports.findPoint = findPoint;
    exports.findSegment = findSegment;
    exports.flattenEach = flattenEach2;
    exports.flattenReduce = flattenReduce;
    exports.geomEach = geomEach2;
    exports.geomReduce = geomReduce;
    exports.lineEach = lineEach;
    exports.lineReduce = lineReduce;
    exports.propEach = propEach;
    exports.propReduce = propReduce;
    exports.segmentEach = segmentEach;
    exports.segmentReduce = segmentReduce;
  }
});

// ../../node_modules/@turf/bbox/dist/js/index.js
var require_js3 = __commonJS({
  "../../node_modules/@turf/bbox/dist/js/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var meta_1 = require_js2();
    function bbox2(geojson) {
      var result = [Infinity, Infinity, -Infinity, -Infinity];
      meta_1.coordEach(geojson, function(coord) {
        if (result[0] > coord[0]) {
          result[0] = coord[0];
        }
        if (result[1] > coord[1]) {
          result[1] = coord[1];
        }
        if (result[2] < coord[0]) {
          result[2] = coord[0];
        }
        if (result[3] < coord[1]) {
          result[3] = coord[1];
        }
      });
      return result;
    }
    bbox2["default"] = bbox2;
    exports.default = bbox2;
  }
});

// ../../node_modules/geojson-rbush/index.js
var require_geojson_rbush = __commonJS({
  "../../node_modules/geojson-rbush/index.js"(exports, module2) {
    var rbush2 = (init_rbush(), __toCommonJS(rbush_exports));
    var helpers = require_js();
    var meta = require_js2();
    var turfBBox = require_js3().default;
    var featureEach2 = meta.featureEach;
    var coordEach = meta.coordEach;
    var polygon2 = helpers.polygon;
    var featureCollection2 = helpers.featureCollection;
    function geojsonRbush(maxEntries) {
      var tree = new rbush2(maxEntries);
      tree.insert = function(feature2) {
        if (feature2.type !== "Feature")
          throw new Error("invalid feature");
        feature2.bbox = feature2.bbox ? feature2.bbox : turfBBox(feature2);
        return rbush2.prototype.insert.call(this, feature2);
      };
      tree.load = function(features) {
        var load = [];
        if (Array.isArray(features)) {
          features.forEach(function(feature2) {
            if (feature2.type !== "Feature")
              throw new Error("invalid features");
            feature2.bbox = feature2.bbox ? feature2.bbox : turfBBox(feature2);
            load.push(feature2);
          });
        } else {
          featureEach2(features, function(feature2) {
            if (feature2.type !== "Feature")
              throw new Error("invalid features");
            feature2.bbox = feature2.bbox ? feature2.bbox : turfBBox(feature2);
            load.push(feature2);
          });
        }
        return rbush2.prototype.load.call(this, load);
      };
      tree.remove = function(feature2, equals) {
        if (feature2.type !== "Feature")
          throw new Error("invalid feature");
        feature2.bbox = feature2.bbox ? feature2.bbox : turfBBox(feature2);
        return rbush2.prototype.remove.call(this, feature2, equals);
      };
      tree.clear = function() {
        return rbush2.prototype.clear.call(this);
      };
      tree.search = function(geojson) {
        var features = rbush2.prototype.search.call(this, this.toBBox(geojson));
        return featureCollection2(features);
      };
      tree.collides = function(geojson) {
        return rbush2.prototype.collides.call(this, this.toBBox(geojson));
      };
      tree.all = function() {
        var features = rbush2.prototype.all.call(this);
        return featureCollection2(features);
      };
      tree.toJSON = function() {
        return rbush2.prototype.toJSON.call(this);
      };
      tree.fromJSON = function(json) {
        return rbush2.prototype.fromJSON.call(this, json);
      };
      tree.toBBox = function(geojson) {
        var bbox2;
        if (geojson.bbox)
          bbox2 = geojson.bbox;
        else if (Array.isArray(geojson) && geojson.length === 4)
          bbox2 = geojson;
        else if (Array.isArray(geojson) && geojson.length === 6)
          bbox2 = [geojson[0], geojson[1], geojson[3], geojson[4]];
        else if (geojson.type === "Feature")
          bbox2 = turfBBox(geojson);
        else if (geojson.type === "FeatureCollection")
          bbox2 = turfBBox(geojson);
        else
          throw new Error("invalid geojson");
        return {
          minX: bbox2[0],
          minY: bbox2[1],
          maxX: bbox2[2],
          maxY: bbox2[3]
        };
      };
      return tree;
    }
    module2.exports = geojsonRbush;
    module2.exports.default = geojsonRbush;
  }
});

// index.ts
var dotenv = __toESM(require("dotenv"), 1);
var import_fastify = __toESM(require("fastify"), 1);

// libs/prisma.ts
var import_database = require("database");
var prisma = new import_database.PrismaClient();

// libs/kv.ts
var import_kv = __toESM(require("@vercel/kv"), 1);
var getCachedEntry = async (key, req) => {
  if (process.env.VERCEL_ENV !== "production") {
    return req();
  }
  const stored = await import_kv.default.get(key);
  if (stored) {
    return stored;
  }
  const request = await req();
  await import_kv.default.set(key, request, { ex: 3600 });
  return request;
};

// libs/requests.ts
var getFellPoints = () => {
  return getCachedEntry(
    "get-fell-points",
    () => prisma.fell.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        name: true
      }
    })
  );
};

// activities/activities.ts
var import_polyline_codec = require("@googlemaps/polyline-codec");

// ../../node_modules/@turf/helpers/dist/es/index.js
var earthRadius = 63710088e-1;
var factors = {
  centimeters: earthRadius * 100,
  centimetres: earthRadius * 100,
  degrees: earthRadius / 111325,
  feet: earthRadius * 3.28084,
  inches: earthRadius * 39.37,
  kilometers: earthRadius / 1e3,
  kilometres: earthRadius / 1e3,
  meters: earthRadius,
  metres: earthRadius,
  miles: earthRadius / 1609.344,
  millimeters: earthRadius * 1e3,
  millimetres: earthRadius * 1e3,
  nauticalmiles: earthRadius / 1852,
  radians: 1,
  yards: earthRadius * 1.0936
};
var unitsFactors = {
  centimeters: 100,
  centimetres: 100,
  degrees: 1 / 111325,
  feet: 3.28084,
  inches: 39.37,
  kilometers: 1 / 1e3,
  kilometres: 1 / 1e3,
  meters: 1,
  metres: 1,
  miles: 1 / 1609.344,
  millimeters: 1e3,
  millimetres: 1e3,
  nauticalmiles: 1 / 1852,
  radians: 1 / earthRadius,
  yards: 1.0936133
};
function feature(geom, properties, options) {
  if (options === void 0) {
    options = {};
  }
  var feat = { type: "Feature" };
  if (options.id === 0 || options.id) {
    feat.id = options.id;
  }
  if (options.bbox) {
    feat.bbox = options.bbox;
  }
  feat.properties = properties || {};
  feat.geometry = geom;
  return feat;
}
function point(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }
  if (!coordinates) {
    throw new Error("coordinates is required");
  }
  if (!Array.isArray(coordinates)) {
    throw new Error("coordinates must be an Array");
  }
  if (coordinates.length < 2) {
    throw new Error("coordinates must be at least 2 numbers long");
  }
  if (!isNumber(coordinates[0]) || !isNumber(coordinates[1])) {
    throw new Error("coordinates must contain numbers");
  }
  var geom = {
    type: "Point",
    coordinates
  };
  return feature(geom, properties, options);
}
function polygon(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }
  for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
    var ring = coordinates_1[_i];
    if (ring.length < 4) {
      throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
    }
    for (var j = 0; j < ring[ring.length - 1].length; j++) {
      if (ring[ring.length - 1][j] !== ring[0][j]) {
        throw new Error("First and last Position are not equivalent.");
      }
    }
  }
  var geom = {
    type: "Polygon",
    coordinates
  };
  return feature(geom, properties, options);
}
function lineString(coordinates, properties, options) {
  if (options === void 0) {
    options = {};
  }
  if (coordinates.length < 2) {
    throw new Error("coordinates must be an array of two or more positions");
  }
  var geom = {
    type: "LineString",
    coordinates
  };
  return feature(geom, properties, options);
}
function featureCollection(features, options) {
  if (options === void 0) {
    options = {};
  }
  var fc = { type: "FeatureCollection" };
  if (options.id) {
    fc.id = options.id;
  }
  if (options.bbox) {
    fc.bbox = options.bbox;
  }
  fc.features = features;
  return fc;
}
function lengthToRadians(distance, units) {
  if (units === void 0) {
    units = "kilometers";
  }
  var factor = factors[units];
  if (!factor) {
    throw new Error(units + " units is invalid");
  }
  return distance / factor;
}
function radiansToDegrees(radians) {
  var degrees = radians % (2 * Math.PI);
  return degrees * 180 / Math.PI;
}
function degreesToRadians(degrees) {
  var radians = degrees % 360;
  return radians * Math.PI / 180;
}
function isNumber(num) {
  return !isNaN(num) && num !== null && !Array.isArray(num);
}

// ../../node_modules/@turf/invariant/dist/es/index.js
function getCoord(coord) {
  if (!coord) {
    throw new Error("coord is required");
  }
  if (!Array.isArray(coord)) {
    if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
      return coord.geometry.coordinates;
    }
    if (coord.type === "Point") {
      return coord.coordinates;
    }
  }
  if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
    return coord;
  }
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function getCoords(coords) {
  if (Array.isArray(coords)) {
    return coords;
  }
  if (coords.type === "Feature") {
    if (coords.geometry !== null) {
      return coords.geometry.coordinates;
    }
  } else {
    if (coords.coordinates) {
      return coords.coordinates;
    }
  }
  throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
}

// ../../node_modules/@turf/destination/dist/es/index.js
function destination(origin, distance, bearing, options) {
  if (options === void 0) {
    options = {};
  }
  var coordinates1 = getCoord(origin);
  var longitude1 = degreesToRadians(coordinates1[0]);
  var latitude1 = degreesToRadians(coordinates1[1]);
  var bearingRad = degreesToRadians(bearing);
  var radians = lengthToRadians(distance, options.units);
  var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) + Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearingRad));
  var longitude2 = longitude1 + Math.atan2(Math.sin(bearingRad) * Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
  var lng = radiansToDegrees(longitude2);
  var lat = radiansToDegrees(latitude2);
  return point([lng, lat], options.properties);
}

// ../../node_modules/@turf/circle/dist/es/index.js
function circle(center, radius, options) {
  if (options === void 0) {
    options = {};
  }
  var steps = options.steps || 64;
  var properties = options.properties ? options.properties : !Array.isArray(center) && center.type === "Feature" && center.properties ? center.properties : {};
  var coordinates = [];
  for (var i = 0; i < steps; i++) {
    coordinates.push(destination(center, radius, i * -360 / steps, options).geometry.coordinates);
  }
  coordinates.push(coordinates[0]);
  return polygon([coordinates], properties);
}
var es_default = circle;

// ../../node_modules/@turf/meta/dist/es/index.js
function featureEach(geojson, callback) {
  if (geojson.type === "Feature") {
    callback(geojson, 0);
  } else if (geojson.type === "FeatureCollection") {
    for (var i = 0; i < geojson.features.length; i++) {
      if (callback(geojson.features[i], i) === false)
        break;
    }
  }
}
function geomEach(geojson, callback) {
  var i, j, g, geometry, stopG, geometryMaybeCollection, isGeometryCollection, featureProperties, featureBBox, featureId, featureIndex = 0, isFeatureCollection = geojson.type === "FeatureCollection", isFeature = geojson.type === "Feature", stop = isFeatureCollection ? geojson.features.length : 1;
  for (i = 0; i < stop; i++) {
    geometryMaybeCollection = isFeatureCollection ? geojson.features[i].geometry : isFeature ? geojson.geometry : geojson;
    featureProperties = isFeatureCollection ? geojson.features[i].properties : isFeature ? geojson.properties : {};
    featureBBox = isFeatureCollection ? geojson.features[i].bbox : isFeature ? geojson.bbox : void 0;
    featureId = isFeatureCollection ? geojson.features[i].id : isFeature ? geojson.id : void 0;
    isGeometryCollection = geometryMaybeCollection ? geometryMaybeCollection.type === "GeometryCollection" : false;
    stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;
    for (g = 0; g < stopG; g++) {
      geometry = isGeometryCollection ? geometryMaybeCollection.geometries[g] : geometryMaybeCollection;
      if (geometry === null) {
        if (callback(
          null,
          featureIndex,
          featureProperties,
          featureBBox,
          featureId
        ) === false)
          return false;
        continue;
      }
      switch (geometry.type) {
        case "Point":
        case "LineString":
        case "MultiPoint":
        case "Polygon":
        case "MultiLineString":
        case "MultiPolygon": {
          if (callback(
            geometry,
            featureIndex,
            featureProperties,
            featureBBox,
            featureId
          ) === false)
            return false;
          break;
        }
        case "GeometryCollection": {
          for (j = 0; j < geometry.geometries.length; j++) {
            if (callback(
              geometry.geometries[j],
              featureIndex,
              featureProperties,
              featureBBox,
              featureId
            ) === false)
              return false;
          }
          break;
        }
        default:
          throw new Error("Unknown Geometry Type");
      }
    }
    featureIndex++;
  }
}
function flattenEach(geojson, callback) {
  geomEach(geojson, function(geometry, featureIndex, properties, bbox2, id) {
    var type = geometry === null ? null : geometry.type;
    switch (type) {
      case null:
      case "Point":
      case "LineString":
      case "Polygon":
        if (callback(
          feature(geometry, properties, { bbox: bbox2, id }),
          featureIndex,
          0
        ) === false)
          return false;
        return;
    }
    var geomType;
    switch (type) {
      case "MultiPoint":
        geomType = "Point";
        break;
      case "MultiLineString":
        geomType = "LineString";
        break;
      case "MultiPolygon":
        geomType = "Polygon";
        break;
    }
    for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
      var coordinate = geometry.coordinates[multiFeatureIndex];
      var geom = {
        type: geomType,
        coordinates: coordinate
      };
      if (callback(feature(geom, properties), featureIndex, multiFeatureIndex) === false)
        return false;
    }
  });
}

// ../../node_modules/@turf/line-segment/dist/es/index.js
function lineSegment(geojson) {
  if (!geojson) {
    throw new Error("geojson is required");
  }
  var results = [];
  flattenEach(geojson, function(feature2) {
    lineSegmentFeature(feature2, results);
  });
  return featureCollection(results);
}
function lineSegmentFeature(geojson, results) {
  var coords = [];
  var geometry = geojson.geometry;
  if (geometry !== null) {
    switch (geometry.type) {
      case "Polygon":
        coords = getCoords(geometry);
        break;
      case "LineString":
        coords = [getCoords(geometry)];
    }
    coords.forEach(function(coord) {
      var segments = createSegments(coord, geojson.properties);
      segments.forEach(function(segment) {
        segment.id = results.length;
        results.push(segment);
      });
    });
  }
}
function createSegments(coords, properties) {
  var segments = [];
  coords.reduce(function(previousCoords, currentCoords) {
    var segment = lineString([previousCoords, currentCoords], properties);
    segment.bbox = bbox(previousCoords, currentCoords);
    segments.push(segment);
    return currentCoords;
  });
  return segments;
}
function bbox(coords1, coords2) {
  var x1 = coords1[0];
  var y1 = coords1[1];
  var x2 = coords2[0];
  var y2 = coords2[1];
  var west = x1 < x2 ? x1 : x2;
  var south = y1 < y2 ? y1 : y2;
  var east = x1 > x2 ? x1 : x2;
  var north = y1 > y2 ? y1 : y2;
  return [west, south, east, north];
}
var es_default2 = lineSegment;

// ../../node_modules/@turf/line-intersect/dist/es/index.js
var import_geojson_rbush = __toESM(require_geojson_rbush(), 1);
function lineIntersect(line1, line2) {
  var unique = {};
  var results = [];
  if (line1.type === "LineString") {
    line1 = feature(line1);
  }
  if (line2.type === "LineString") {
    line2 = feature(line2);
  }
  if (line1.type === "Feature" && line2.type === "Feature" && line1.geometry !== null && line2.geometry !== null && line1.geometry.type === "LineString" && line2.geometry.type === "LineString" && line1.geometry.coordinates.length === 2 && line2.geometry.coordinates.length === 2) {
    var intersect = intersects2(line1, line2);
    if (intersect) {
      results.push(intersect);
    }
    return featureCollection(results);
  }
  var tree = (0, import_geojson_rbush.default)();
  tree.load(es_default2(line2));
  featureEach(es_default2(line1), function(segment) {
    featureEach(tree.search(segment), function(match) {
      var intersect2 = intersects2(segment, match);
      if (intersect2) {
        var key = getCoords(intersect2).join(",");
        if (!unique[key]) {
          unique[key] = true;
          results.push(intersect2);
        }
      }
    });
  });
  return featureCollection(results);
}
function intersects2(line1, line2) {
  var coords1 = getCoords(line1);
  var coords2 = getCoords(line2);
  if (coords1.length !== 2) {
    throw new Error("<intersects> line1 must only contain 2 coordinates");
  }
  if (coords2.length !== 2) {
    throw new Error("<intersects> line2 must only contain 2 coordinates");
  }
  var x1 = coords1[0][0];
  var y1 = coords1[0][1];
  var x2 = coords1[1][0];
  var y2 = coords1[1][1];
  var x3 = coords2[0][0];
  var y3 = coords2[0][1];
  var x4 = coords2[1][0];
  var y4 = coords2[1][1];
  var denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  var numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  var numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
  if (denom === 0) {
    if (numeA === 0 && numeB === 0) {
      return null;
    }
    return null;
  }
  var uA = numeA / denom;
  var uB = numeB / denom;
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    var x = x1 + uA * (x2 - x1);
    var y = y1 + uA * (y2 - y1);
    return point([x, y]);
  }
  return null;
}
var es_default3 = lineIntersect;

// activities/activities.ts
var stravaOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        polyline: { type: "string" },
        owner_id: { type: "number" }
      }
    }
  }
};
async function routes(fastify2, options) {
  fastify2.post("/activities/manual", async (request, reply) => {
    return { hello: "world" };
  });
  fastify2.post("/activities/strava", stravaOpts, async (request, reply) => {
    const { polyline, owner_id } = request.body;
    const stravaAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          providerAccountId: owner_id.toString(),
          provider: "strava"
        }
      },
      select: {
        access_token: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    if (!stravaAccount) {
      reply.statusCode = 401;
      reply.send();
      return;
    }
    const decodedPolyline = (0, import_polyline_codec.decode)(polyline);
    const points = await getFellPoints();
    const line = lineString(decodedPolyline);
    const circles = points.map((c) => es_default([c.lat, c.lng], 0.1, { properties: { id: c.id, name: c.name } }));
    const intersectingCircles = circles.filter((c) => es_default3(c, line).features.length > 0);
    const intersectingIds = intersectingCircles.map((c) => c.properties.id);
    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: intersectingIds.map((id) => ({
        fellId: id,
        authorId: stravaAccount.user.id,
        climbed: true
      }))
    });
    reply.send();
  });
}

// index.ts
dotenv.config();
var fastify = (0, import_fastify.default)({
  logger: true
});
fastify.register(routes);
var start = async () => {
  try {
    await fastify.listen({ port: 3e3 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
//# sourceMappingURL=index.cjs.map