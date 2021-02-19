/*
 * FECHA: 2020/12/21
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: jualesac@yahoo.com
 * TÍTULO: math.js
 * 
 * Descripción: Funciones matemáticas útiles para geometría.
*/

"use strict";

var GEOMETRY = {
    math: {
        segment: function (a, b) {
            return b - a;
        },

        distance: function (a, b) {
            return Math.abs (this.segment (a, b));
        },

        midpoint: function (a, b, r) {
            return (a + (r * b)) / (1 + r);
        },

        translate: function (o1, a) {
            return a + o1;
        },

        convertOrgn: function (o1, a) {
            return a - o1;
        },

        point2D: function (x, y) {
            this.x = x;
            this.y = y;

            this.move = function (x, y) {
                this.x = x;
                this.y = y;

                return this;
            };
        },

        distance2D: function (p1, p2) {
            return Math.sqrt (
                Math.pow (this.segment (p1.x, p2.x), 2) + Math.pow (this.segment (p1.y, p2.y), 2)
            );
        },

        slope: function (p1, p2) {
            return (p2.y - p1.y) / (p2.x - p1.x);
        },

        midpoint2D: function (p1, p2, r) {
            return this.point2D (
                this.midpoint (p1.x, p2.x, r),
                this.midpoint (p1.y, p2.y, r)
            );
        },

        translate2D: function (o1, p) {
            return this.point2D (
                this.translate (o1.x, p.x),
                this.translate (o1.y, p.y)
            );
        },

        convertOrgn2D: function (o1, p) {
            return this.point2D (
                this.convertOrgn (o1.x, p.x),
                this.convertOrgn (o1.y, p.y)
            );
        },

        scale: function (range, mxUnits) {
            let b1, b2, b5;

            b1 = base (1);
            b2 = base (2);
            b5 = base (5);

            if (b1.diff < b2.diff) {
                if (b1.diff < b5.diff) {
                    return b1;
                } else {
                    return b5;
                }
            } else if (b2.diff < b5.diff) {
                return b2;
            } else {
                return b5;
            }

            function base (b) {
                if ((b * mxUnits) > (range.sup - range.inf)) {
                    return new GEOMETRY.math.objScale ([
                        (b * mxUnits) - range.sup, //diff
                        b, //base
                        //Math.floor ((range.sup - range.inf) / b) + 1, //units
                        (range.sup - range.inf) / b, //units
                        range.inf / b //bStart
                    ]);
                }

                return base (b * 10);
            }
        },

        objScale: function (values) {
            if (!(values instanceof Array)) { throw new ErrorType ("Se esperaba un array como argumento"); }
            
            this.diff = values[0];
            this.base = values[1];
            this.units = values[2];
            this.bStart = values[3];
        },

        objRange: function (inf, sup) {
            this.inf = inf;
            this.sup = sup;
        },

        convertion: function (long, units) {
            if (units <= 0 || long <= 0) { throw Error ("Se espera un número de largo/unidades mayor a 0"); }

            return (long / units);
        },

        fromScale: function (value, convertion) {
            if (convertion < 0) { throw new Error ("Se espera un factor de conversión mayor o igual a 0."); }
            
            return value * convertion;
        },

        toScale: function (value, convertion) {
            if (convertion < 0) { throw new Error ("Se espera un factor de conversión mayor o igual a 0."); }

            return value / convertion;
        },

        createID: function (quantity) {
            if (typeof (quantity) != "number") { throw new TypeError ("Se esperaba un number como argumento"); }

            let letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
            let chain = "";
            let i;

            for (i = 0; i < quantity; i++) {
                chain += letters[Math.floor(Math.random() * 26)];
            }

            return chain;
        }
    },

    points: function () {
        let _points = [];
        let _tmprnge = null;
        let _range = new GEOMETRY.math.objRange (null, null);

        this.range = function () {
            let set;
            let rnge = new GEOMETRY.math.objRange (null, null);

            if (_tmprnge != null) {
                set = _points.slice (_tmprnge.start, _tmprnge.end);
            }

            rnge.inf = (_tmprnge != null) ? Math.min (...set) : _range.inf;
            rnge.sup = (_tmprnge != null) ? Math.max (...set) : _range.sup;

            return rnge;
        };

        this.length = function () {
            return _points.length;
        };

        this.set = function (v) {
            if (v == null) { return; }

            v = Number (v);

            _range.inf = (_range.inf == null || _range.inf >= v) ? v : _range.inf;
            _range.sup = (_range.sup == null || _range.sup <= v) ? v : _range.sup;

            _points.push (v);
        };

        this.get = function (start = null, end = null) {
            start = (_tmprnge != null) ? _tmprnge.start : ((start == null) ? 0 : start);
            end = (_tmprnge != null) ? _tmprnge.end : (end == null) ? _points.length : end + 1;

            if (start > end) { throw new Error ("Rango inválido"); }
            
            _tmprnge = null;

            return _points.slice (start, end);
        };

        this.iterateValues = function (callback) {
            callback = callback || function (v) { return v; };

            let start = (_tmprnge != null) ? _tmprnge.start : 0;
            let end = (_tmprnge != null) ? _tmprnge.end - 1: _points.length - 1;
            let i;

            for (i = start; i <= end; i++) {
                callback (_points[i], i);
            }
        };

        this.remove = function (k) {
            _points.splice (k, 1);

            _range.inf = Math.min (..._points);
            _range.sup = Math.max (..._points);
        };

        this.reset = function () {
            _points = [];
            _range = {
                inf: null,
                sup: null
            };
            _tmprnge = null;
        };

        this.setRange = function (start, end) {
            if (start == null && end == null) {
                _tmprnge = null;
                return;
            }

            end = end || _points.length - 1;

            if (typeof (start) != "number" || typeof (end) != "number") { throw new TypeError ("Se esperaban number como argumentos"); }
            if (start < 0 || end >= _points.length) { throw new Error ("Rango inválido"); }

            _tmprnge = {
                start: start,
                end: end + 1
            };
        };

        this.filter = function (callback = null) {
            callback = (callback != null) ? callback : function () { return true; };
            
            return _points.filter (callback);
        };
    },

    SPACE: function () {
        let math = GEOMETRY.math;
        let _pointSets = {};
        let _scale = {};
        let _convert = 0;
        let _range = new math.objRange (null, null);

        this.numberOfSets = function () {
            return Object.keys (_pointSets).length;
        };

        this.length = function () {
            let lengthPerPointSet = [];

            swept (function (pointSet) {
                lengthPerPointSet.push (pointSet.length ());
            });

            return (lengthPerPointSet.length == 0) ? 0 : Math.max (...lengthPerPointSet);
        };

        this.range = function () {
            return range ();
        };

        this.getScale = function (mxUnits) {
            mxUnits = Number (mxUnits || 10);

            let range_ = range ();

            if (range_.inf == null) { return false; }

            _scale = math.scale (range_, mxUnits);

            return _scale;
        };

        this.getConvertionFactor = function (long) {
            _convert = math.convertion (long, (_scale.units));

            return _convert;
        };

        this.getPoints = function (callback) {
            callback = callback || function (v) { return v; };

            let pointSets = {};

            swept (function (ps) {
                pointSets[ps.getName ()] = ps.getTransformedValues (callback);
            });

            return pointSets;
        };

        this.PointSet = function () {
            GEOMETRY.points.call (this);

            let _name = math.createID (13);
            let _active = false;

            _pointSets[_name] = this;

            this.active = function (status) {
                status = (status != null) ? status : true;

                if (typeof (status) != "boolean") { throw new TypeError ("Se esperaba un boolean como argumento."); }

                _active = status;
            };

            this.getName = function () {
                return _name;
            };

            this.getStatus = function () {
                return _active;
            };
            /*
             * Para los siguientes métodos es importante recordar que si
             * se quieren obtener los datos sin duplicados existe el objeto
             * Set de js.
            */
            this.intersect = function (S, filter) {
                filter = filter || function () { return true; };
    
                let points = this.get ().filter (filter);
                let points_ = S.get ().filter (filter);
    
                return points.filter (function (p) {
                    return points_.includes (p);
                });
            };
    
            this.union = function (S, filter) {
                filter = filter || function () { return true; }
    
                return this.get ().concat (S.get ()).filter (filter);
            };
        };

        function range () {
            let range_ = new math.objRange (null, null);
            let r_;

            swept (function (space) {
                r_ = space.range ();

                range_.inf = (range_.inf == null || range_.inf >= r_.inf) ? r_.inf : range_.inf;
                range_.sup = (range_.sup == null || range_.sup <= r_.sup) ? r_.sup : range_.sup;
            });

            _range = range_;

            return _range;
        }

        function swept (callback) {
            let s;

            for (s in _pointSets) {
                if (_pointSets[s].getStatus ()) {
                    callback (_pointSets[s]);
                }
            }
        }
    },

    AXIS: {
        skull: function (id, config) {
            config.name = config.name || "x";
            config.horizontal = (config.horizontal == null) ? true : config.horizontal;
            config.direction = config.direction || "+";
            config.x = config.horizontal ? (config.x || 0) : (config.x || 0) + 100;
            config.y = config.y || 0;

            const _lengthScale = 8;
            
            let _class = _jsg(id).getAttribute ("class");
            let _direction = (config.direction == "+") ? true : false;
            let _metricScale = function (v) { return v; };
            let _scale;
            //Inserción de estructura general
            _jsg.createElement ("line").setAttributes ({
                x1: config.x,
                y1: config.y,
                x2: (config.horizontal ? config.length : 0) + config.x,
                y2: (!config.horizontal ? config.length : 0) + config.y
            }).appendTo (id);
            _jsg.createElement ("text").setAttributes ({
                id: `${id}_scale_name`,
                class: `${_class}_scale_name`
            }).appendTo (id);

            _jsg.createElement ("g").setAttributes ({ id: `${id}_scale`, "clip-path": `url(#${id}_cut)` }).appendTo (id);
            _jsg.createElement ("path").setAttributes ({ id: `${id}_scale_div` }).appendTo (`${id}_scale`);
            _jsg.createElement ("text").setAttributes ({
                id: `${id}_values`,
                class: `${_class}_scale_values`
            }).appendTo (`${id}_scale`);

            putAxisName (config.name);

            //Métodos
            this.setScale = function (scale) {
                _scale = scale;
            };

            this.setMetricScale = function (callback) {
                if (typeof (callback) != "function") { throw new TypeError ("Se esperaba una función como argumento"); }

                _metricScale = callback;
            };

            this.putScale = function (arrayPoints, baseStart) {
                let p = [];

                arrayPoints.forEach (function (point, key) {
                    p.push (`M ${config.horizontal ? point : config.x} ${config.horizontal ? config.y : point}, ${config.horizontal ? point : config.x - _lengthScale} ${config.horizontal ? config.y + _lengthScale : point}`);

                    putMetricScale (Number (point), baseStart);
                    baseStart++;
                });

                _jsg(`${id}_scale_div`).setAttribute ("d", p.join (" "));
            };

            this.translate = function (delta) {
                let _navigator = (/Chrome/.test (navigator.userAgent)) ? true : false;

                if (_navigator) {
                    _jsg(`${id}_scale`).style["-webkit-transform"] = config.horizontal ? `translate(${delta}px, 0)` : `translate(0, ${delta}px)`;
                    return;
                }

                _jsg(`${id}_scale`).style.translate = config.horizontal ? `${delta}px 0` : `0 ${delta}px`;
            };

            function putMetricScale (value, baseStart) {
                let tspan = _jsg.createElement ("tspan").setAttributes ({
                    x: config.horizontal ? value : config.x,
                    y: config.horizontal ? config.y + _lengthScale + 12 : value + 4
                });
                let dimensions;

                tspan.textContent = _metricScale (baseStart * _scale.base);
                tspan.appendTo (`${id}_values`);

                dimensions = tspan.getBoundingClientRect ();

                if (config.horizontal) {
                    tspan.setAttribute ("x", GEOMETRY.math.midpoint (value - dimensions.width, value, 1));
                    return;
                }

                tspan.setAttribute ("x", config.x - _lengthScale - 4 - dimensions.width);
            }

            function putAxisName (name) {
                let text = _jsg(`${id}_scale_name`);
                let dim;

                text.textContent = name;
                dim = text.getBoundingClientRect ();

                if (config.horizontal) {
                    text.setAttribute ("x", (_direction ? (config.x + config.length - dim.width) : config.x));
                    text.setAttribute ("y", config.y + 35);
                } else {
                    text.setAttribute ("x", config.x - dim.width - 35);
                    text.setAttribute ("y", (_direction ? (config.y + config.length) : (config.y + 10)));
                }
            }
        },

        main: function (id, config) {
            if (typeof (id) == "object") {
                config = id;
                id = null;
            }

            id = id || "js_axis";

            let skull = new GEOMETRY.AXIS.skull (id, config);
            let math = GEOMETRY.math;
            let _scale;
            let _convertionFactor;
            let _range;
            let _origin = 0;

            this.setScale = function (scale) {
                if (!(scale instanceof GEOMETRY.math.objScale)) { throw new ErrorType ("Se esperaba un objScale como argumento"); }

                skull.setScale (scale);

                _scale = scale;
                _convertionFactor = GEOMETRY.math.convertion (config.length, (_scale.units));
            };

            this.setMetricScale = function (callback) {
                skull.setMetricScale (callback);
            };

            this.buildMetricScale = function (range) {
                if (!(range instanceof GEOMETRY.math.objRange)) { throw new ErrorType ("Se esperaba un objRange como argumento"); }
                if (!(_scale instanceof GEOMETRY.math.objScale)) { return; }

                _range = range;
                _origin = 0;

                let points = [];
                let i;

                for (i = Math.floor (range.inf / _scale.base); i <= (range.sup / _scale.base) + 1; i++) {
                    points.push (this.locatePoint (i * _scale.base));
                }

                skull.putScale (points, Math.floor (range.inf / _scale.base));
            };

            this.locatePoint = function (value) {
                if (_range == null) { return 0; }

                value = math.fromScale ((value / _scale.base), _convertionFactor);

                let calcule;
                let pxAxis;

                pxAxis = config.horizontal ? config.x : config.y;

                if (_origin == 0) {
                    _origin = math.fromScale ((_range.inf / _scale.base), _convertionFactor);
                    let delta = math.segment (_origin, math.fromScale (_scale.bStart, _convertionFactor));

                    _origin = _origin + delta;
                }

                calcule = math.convertOrgn (_origin, value) + pxAxis;

                return (config.direction == "+") ? calcule : math.translate (pxAxis * 2, config.length) - calcule;
            };

            this.reset = function () {
                _jsg(`${id}_scale_div`).setAttribute ("d", "");
                _jsg(`${id}_values`).textContent = "";

                _scale = null;
                _convertionFactor = null;
                _range = null;
                _origin = 0;
            };

            this.translate = function (pixels) {
                pixels = Number (pixels || 0);

                if (_scale == null || _range == null) { return; }

                let visor = new math.objRange (
                    config.horizontal ? config.x : config.y,
                    (config.horizontal ? config.x : config.y) + config.length
                );
                let range = new math.objRange (
                    (config.direction == "+" ? this.locatePoint (_range.inf) : this.locatePoint (_range.sup)) - visor.inf,
                    (config.direction == "+" ? this.locatePoint (_range.sup) : this.locatePoint (_range.inf)) - visor.inf
                );
                let delta;

                visor.sup -= visor.inf;
                visor.inf -= visor.inf;

                delta = (pixels > 0 ? range.inf : range.sup) + pixels;
                delta = pixels == 0 ? 0 : delta;

                if (pixels > 0) {
                    delta = (delta >= visor.inf) ? Math.abs (range.inf) : pixels;
                }

                if (pixels < 0) {
                    delta = (delta <= visor.sup) ? visor.sup - range.sup : pixels;
                }

                skull.translate (delta);

                return delta;
            };
        }
    },

    GRAPHIC: {
        skull: function (id, config) {
            config.notationX = config.notationX || function (v) { return v; };
            config.notationY = config.notationY || function (v) { return v; };

            let _class = _jsg(id).getAttribute ("class");
            let _area = {
                x0: 100 + config.marginL,
                x1: 100 + config.marginL + (config.width - config.marginL - config.marginR - 190),
                y0: 10,
                y1: 10 + (config.height - 50)
            };

            let svg = _jsg.createElement ("svg").setAttributes ({
                width: config.width,
                height: config.height
            });
            let _axisX;
            let _axisY;
            let _gpoints;

            let _onCreateCircle = function () { return; };
            //Estructura general
            _jsg.createElement ("defs").setAttributes ({ id: `${id}_defs` }).appendTo (svg);
            _jsg.createElement ("g").setAttributes ({ id: `${id}_index` }).appendTo (svg);
            _jsg.createElement ("g").setAttributes ({ id: `${id}_scales` }).appendTo (svg);
            _jsg.createElement ("g").setAttributes ({ id: `${id}_area`, "clip-path": `url(#${id}_cut_area)` }).appendTo (svg);
            //Area
            _jsg.createElement ("path").setAttributes ({
                id: `${id}_area_background`,
                class: `${_class}_area_background`,
                d: `M ${_area.x0 + 0.4} ${_area.y0}, ${_area.x1 + 0.4} ${_area.y0}, ${_area.x1 + 0.4} ${_area.y1 - 0.4}, ${_area.x0 + 0.4} ${_area.y1 - 0.4} Z`
            }).appendTo (svg.children[3]).children[0].gtranslate = false;
            _jsg.createElement ("g").setAttributes ({ id: `${id}_gspaces`, class: `${_class}_gspaces` }).appendTo (svg.children[3]);
            //Ejes
            _jsg.createElement ("g").setAttributes ({ id: `${id}_axis_x`, class: `${_class}_axis`, "clip-path": `url(#${id}_cut_axis_x)` }).appendTo (svg.children[2]);
            _jsg.createElement ("g").setAttributes ({ id: `${id}_axis_y`, class: `${_class}_axis`, "clip-path": `url(#${id}_cut_axis_y)` }).appendTo (svg.children[2]);
            //Info
            _jsg.createElement ("g").setAttributes ({ id: `${id}_infog` }).appendTo (svg.children[3]);
            _jsg.createElement ("path").setAttributes ({ id: `${id}_info_rect`, class: `${_class}_info_rect` }).appendTo (svg.children[3].children[2]);
            _jsg.createElement ("text").setAttributes ({ id: `${id}_info_text`, class: `${_class}_info_text` }).appendTo (svg.children[3].children[2]);
            //Cortes
            _jsg.createElement ("path").setAttributes ({
                d: `M ${_area.x0 + 0.4} ${_area.y0 - 0.8}, ${_area.x1 + 0.8} ${_area.y0 - 0.8}, ${_area.x1 + 0.8} ${_area.y1 - 0.4}, ${_area.x0 + 0.4} ${_area.y1 - 0.4} Z`
            }).appendTo (_jsg.createElement ("clipPath").setAttributes ({ id: `${id}_cut_area` })).appendTo (svg.children[0]);
            _jsg.createElement ("path").setAttributes ({
                d: `M ${_area.x0 - 10} ${_area.y1 - 1}, ${_area.x1 + 5} ${_area.y1 - 1}, ${_area.x1 + 5} ${_area.y1 + 50}, ${_area.x0 - 10} ${_area.y1 + 50} Z`
            }).appendTo (_jsg.createElement ("clipPath").setAttributes ({ id: `${id}_cut_axis_x` })).appendTo (svg.children[0]);
            _jsg.createElement ("path").setAttributes ({
                d: `M 0 ${_area.y0 - 5}, ${_area.x0 + 1} ${_area.y0 - 5}, ${_area.x0 + 1} ${_area.y1 + 10}, 0 ${_area.y1 + 10} Z`
            }).appendTo (_jsg.createElement ("clipPath").setAttributes ({ id: `${id}_cut_axis_y` })).appendTo (svg.children[0]);

            svg.appendTo (id);

            _axisX = new GEOMETRY.AXIS.main (`${id}_axis_x`, {
                name: config.nameX,
                length: GEOMETRY.math.distance (_area.x0, _area.x1) - 2,
                horizontal: true,
                x: _area.x0,
                y: config.height - 40,
                direction: config.directionX
            });
            _axisY = new GEOMETRY.AXIS.main (`${id}_axis_y`, {
                name: config.nameY,
                length: GEOMETRY.math.distance (_area.y0, _area.y1) - 2,
                horizontal: false,
                x: config.marginL,
                y: _area.y0 + 2,
                direction: config.directionY
            });

            _axisX.setMetricScale (config.notationX);
            _axisY.setMetricScale (config.notationY);
            
            //Métodos
            this.getAxis = function () {
                return {
                    x: _axisX,
                    y: _axisY
                };
            };

            this.createGraphic = function (_id, gconfig) {
                let pattern = _jsg.createElement ("pattern").setAttributes ({
                    id: `${_id}_pattern`,
                    width: gconfig.fill.width,
                    height: gconfig.fill.height,
                    patternUnits: "userSpaceOnUse"
                });
                _jsg.createElement ("rect").setAttributes ({
                    width: config.width,
                    height: config.height,
                    "fill-opacity": 0.25,
                    fill: (gconfig.fill.color != null) ? gconfig.fill.color : "none"
                }).appendTo (pattern);

                if (gconfig.fill.type == "c") {
                    _jsg.createElement ("circle").setAttributes ({
                        cx: gconfig.fill.center.x,
                        cy: gconfig.fill.center.y,
                        r: 1,
                        fill: gconfig.color,
                        "fill-opacity": 0.35
                    }).appendTo (pattern);
                }

                if (gconfig.fill.type == "l") {
                    _jsg.createElement ("path").setAttributes ({
                        d: gconfig.fill.line,
                        stroke: gconfig.color,
                        "stroke-opacity": 1,
                        "stroke-width": 0.7
                    }).appendTo (pattern);
                }

                _jsg.createElement ("polyline").setAttributes ({
                    id: `${_id}_line`,
                    stroke: gconfig.color,
                    "stroke-width": 1,
                    fill: (gconfig.fill.type != null) ? `url(#${_id}_pattern)` : "none"
                }).appendTo (_jsg.createElement ("g").setAttributes ({ id: _id })).appendTo (`${id}_gspaces`);
                _jsg.createElement ("g").setAttributes ({ id: `${_id}_points`, class: `${_class}_points` }).appendTo (_id);

                createIndexOfGraphic (_id, gconfig);
                pattern.appendTo (`${id}_defs`);
            };

            this.clearGraphic = function (_id) {
                _jsg(`${_id}_line`).setAttribute ("points", "");
                _jsg(`${_id}_points`).textContent = "";
            };

            this.createLine = function (_id, points) {
                let point = [];
                let p;

                for (p in points) {
                    points[p].x = _axisX.locatePoint (points[p].x);
                    points[p].y = _axisY.locatePoint (points[p].y);

                    point.push (`${points[p].x} ${points[p].y}`);

                    createCirclePoint (_id, points[p]);
                }

                if (_jsg(`${_id}_pattern`).firstChild.getAttribute ("fill") != "none") {
                    let zero = _axisY.locatePoint (0);

                    point.unshift (`${point[0].split (" ")[0]} ${zero}`);
                    point.push (`${point[point.length - 1].split (" ")[0]} ${zero}`);
                }

                _jsg(`${_id}_line`).setAttribute ("points", point.join (", "));

                _jsg(_id).replaceChild (_gpoints, _jsg(`${_id}_points`));
                _gpoints = null;
            };

            this.onCreateCircle = function (callback) {
                if (!(callback instanceof Function)) { throw new TypeError ("Se esperaba una función como argumento"); }

                _onCreateCircle = callback;
            };

            this.hiddenInfo = function () {
                _jsg(`${id}_info_text`).textContent = "";
                _jsg(`${id}_info_rect`).setAttributes ({
                    d: ``
                });
            };
            let hiddenInfo = this.hiddenInfo;

            this.graphicToFront = function () {
                let last;
                let clon;

                last = _jsg(`#${id}_gspaces > g:last-child`);

                _jsg(`#${last.id}_pattern > rect`).setAttribute ("fill-opacity", "0.25");
                _jsg(`#${this.id}_pattern > rect`).setAttribute ("fill-opacity", "0.60");
                
                if (this == last) { return; }

                clon = last.cloneNode (true);

                this.parentElement.appendChild (clon);
                this.parentElement.replaceChild (this, clon);
            };

            this.graphicUnselect = function () {
                let last = _jsg(`#${id}_gspaces > g:last-child`);

                _jsg(`#${last.id}_pattern > rect`).setAttribute ("fill-opacity", "0.25");
            };

            this.hiddenIndex = function (event) {
                let index = event.target.tagName == "line" ? event.target.previousElementSibling : event.target;
                let line = index.nextElementSibling;
                let _id = index.id.replace ("_index", "");
                let fill = Number ((_jsg(`#${_id}_pattern > rect`).getAttribute ("fill") != "none") ? 1 : 0);

                index.fill = fill;
                index.status = (index.status == undefined) ? ((fill) ? 2 : 1) : index.status;

                switch (index.status) {
                    case 2:
                        _jsg(`${_id}_line`).setAttributes ({ fill: "none" });
                        index.setAttributes ({ "fill-opacity": 0 });
                        index.status = 1;
                    break;

                    case 1:
                        _jsg(`${_id}`).style.display = "none";
                        line.setAttributes ({ "stroke-width": 0 });
                        hiddenInfo ()
                        index.status = 0;
                    break;

                    case 0:
                        _jsg(`${_id}`).style.display = "";
                        index.setAttributes ({ "fill-opacity": 1 });
                        line.setAttributes ({ "stroke-width": 1.5 });

                        if (fill) {
                            _jsg(`${_id}_line`).setAttributes ({ fill: `url(#${_id}_pattern)` });
                            index.status = 2;
                        } else {
                            index.status = 1;
                        }
                    break;
                }
            };

            this.createInfo = function (circle, position) {
                let p = {
                    x: position.x + 8,
                    y: (position.y - 13) < _area.y0 ? _area.y0 : position.y - 13
                };
                let ptspan = {
                    x: p.x + 4,
                    y: p.y + 12,
                    w: []
                };
                let width;
                let height;
                let py;

                _jsg(`${id}_info_text`).textContent = "";

                tspanInfo (circle.graphicInfo, ptspan);

                width = Math.max (...ptspan.w) + 8;
                py = _jsg(`#${id}_info_text > tspan:last-child`).getBoundingClientRect ().y + 18;
                height = py - p.y;

                p.x = (p.x + width) > _area.x1 ? _area.x1 - width : p.x;
                p.y = (p.y + height) > _area.y1 ? _area.y1 - height : p.y;

                _jsg(`${id}_info_rect`).setAttributes ({
                    d: `M ${p.x} ${p.y}, ${p.x + width} ${p.y}, ${p.x + width} ${p.y + height}, ${p.x} ${p.y + height} Z`
                });

                _jsg(`${id}_info_text`).textContent = "";
                tspanInfo (circle.graphicInfo, {
                    x: p.x + 4,
                    y: p.y + 12,
                    w: [],
                    h: []
                });
            };

            function tspanInfo (info, position) {
                let tspan;
                let p = {
                    x: position.x,
                    y: position.y,
                    w: position.w
                };
                let n = 1;

                for (let i in info) {
                    if (typeof (info[i]) != "object") {
                        tspan = _jsg.createElement ("tspan").setAttributes ({ x: p.x, y: p.y });
                        tspan.appendTo (`${id}_info_text`);

                        p.y = p.y + (14 * n);

                        switch (i) {
                            case "x":
                                tspan.textContent = `${config.nameX}: ${config.notationX (info[i])}`;
                            break;

                            case "y":
                                tspan.textContent = `${config.nameY}: ${config.notationY (info[i])}`;
                            break;

                            default:
                                tspan.textContent = `${i}: ${info[i]}`;
                            break;
                        }

                        p.w.push (tspan.getBoundingClientRect ().width);

                        n++;
                    } else {
                        p.y = p.y - 14;
                        
                        tspanInfo (info[i], p);
                    }
                }
            }

            function createCirclePoint (_id, point) {
                if (!_gpoints) {
                    _gpoints = _jsg.createElement ("g").setAttributes ({ id: `${_id}_points`, class: `${_class}_points` });
                    _gpoints.gcolor = _jsg(_id).firstChild.getAttribute ("stroke");
                    _gpoints.gfill = _jsg(`${_id}_pattern`).firstChild.getAttribute ("fill");
                }

                let circle;

                circle = _jsg.createElement ("circle").setAttributes ({
                    cx: point.x,
                    cy: point.y,
                    r: 3.3,
                    stroke: _gpoints.gcolor,
                    fill: (_gpoints.gfill == "none") ? _gpoints.gcolor : _gpoints.gfill
                });
                circle.appendTo (_gpoints);

                _onCreateCircle (circle, point);

                _gpoints.lastChild.graphicInfo = point.info;
            }

            function createIndexOfGraphic (_id, gconfig) {
                let index = _jsg(`${id}_index`);
                let n = index.children.length / 3;
                let text;

                _jsg.createElement ("rect").setAttributes ({
                    id: `${_id}_index`,
                    x: _area.x1 + 20,
                    y: n * 30 + 10,
                    width: 18,
                    height: 18,
                    style: "cursor: pointer",
                    stroke: gconfig.color,
                    "stroke-width": "1.5",
                    fill: `url(#${_id}_pattern)`
                }).appendTo (index);
                _jsg.createElement ("line").setAttributes ({
                    x1: _area.x1 + 20,
                    y1: n * 30 + 28,
                    x2: _area.x1 + 38,
                    y2: n * 30 + 10,
                    stroke: gconfig.color,
                    "stroke-width": 1.5,
                    style: "cursor: pointer"
                }).appendTo (index);

                text = _jsg.createElement ("text").setAttributes ({
                    x: _area.x1 + 45,
                    y: n * 30 + 23,
                    style: "font-weight: bold; font-family: Verdana, Helvetica, Arial, sans-serif;",
                    fill: "rgba(0, 0, 0, 0.6)",
                    "font-size": 12
                });
                text.textContent = gconfig.name

                text.appendTo (index);
            }
        },

        main: function (id, config) {
            if (typeof (id) == "object") {
                config = id;
                id = null;
            }

            id = id || "js_graphic";

            let math = GEOMETRY.math;

            let skull = new GEOMETRY.GRAPHIC.skull (id, config);
            let _axisX = skull.getAxis ().x;
            let _axisY = skull.getAxis ().y;

            let _spaceX = new GEOMETRY.SPACE;
            let _spaceY = new GEOMETRY.SPACE;

            let _graphics = {};

            let _delta = { x: 0, y: 0 };

            translate ();

            _jsg(`${id}_area_background`).event ("click", skull.graphicUnselect);
            _jsg(`${id}_index`).event ("click", skull.hiddenIndex);
            _jsg(`${id}_area`).event ("click", showInfo);

            this.create = function (gconfig) {
                let _id = math.createID (15);
                let _space = {
                    x: new _spaceX.PointSet,
                    y: new _spaceY.PointSet,
                    i: []
                };

                _graphics[_id] = this;

                skull.createGraphic (_id, gconfig);
                //Métodos
                this.getID = function () { return _id; };

                this.length = function () { return _space.i.length; };

                this.active = function (status) {
                    _space.x.active (status);
                    _space.y.active (status);
                };

                this.getStatus = function () { return _space.x.getStatus (); };

                this.setPoint = function (x, y, info) {
                    info = info || {};

                    if (typeof (info) != "object") { throw new TypeError ("Se esperaba un objeto como argumento"); }

                    _space.x.set (x);
                    _space.y.set (y);
                    _space.i.push ({
                        x: x,
                        y: y,
                        i: info
                    });
                };

                this.getPoints = function (callback) {
                    callback = callback || function () { return; };

                    let points = [];
                    let j = 0;

                    _space.x.iterateValues (function (x, i) {
                        points.push ({
                            x: x,
                            y: _space.y.get (i, i)[0],
                            info: _space.i[i]
                        });

                        callback (points[j]);
                        j++;
                    });

                    return points;
                };

                this.setRange = function (start, end) {
                    _space.x.setRange (start, end);
                    _space.y.setRange (start, end);
                };

                this.reset = function () {
                    _space.x.reset ();
                    _space.y.reset ();
                    _space.i = [];

                    this.active (false);
                };
            };

            this.onBuild = function (callback) {
                skull.onCreateCircle (callback);
            };

            this.build = function (segment) {
                createMetricScale ();

                segment = (segment != null) ? segment : false;

                if (segment) {
                    swept (function (graphic) {
                        graphic.setRange ();
                    });
                }

                _axisX.buildMetricScale (_spaceX.range ());
                _axisY.buildMetricScale (_spaceY.range ());

                swept (function (graphic) {
                    skull.createLine (graphic.getID (), graphic.getPoints ());

                    _jsg(graphic.getID ()).event ("click", skull.graphicToFront);
                });
            };

            this.clear  = function () {
                _axisX.reset ();
                _axisY.reset ();

                swept (function (graphic) {
                    skull.clearGraphic (graphic.getID ());
                });
            };

            function showInfo (evnt) {
                if (evnt.target.tagName != "circle") { return; }

                let circle = evnt.target;
                let position = {
                    x: evnt.clientX,
                    y: evnt.clientY
                };

                skull.createInfo (circle, position);
            }

            function translate () {
                let _navigator = (/Chrome/.test (navigator.userAgent)) ? true : false;
                let localDelta = { x: 0, y: 0 };
                let initPoint = {
                    x: 0,
                    y: 0
                };

                _jsg(`${id}_area`).event ("mousedown", initTranslate);
                _jsg(`${id}_area`).event ("mousemove", move);
                _jsg(`${id}_area`).event ("mouseup", stopTranslate);
                _jsg(`${id}_area`).event ("mouseleave", stopTranslate);

                function initTranslate (evnt) {
                    if (evnt.target.tagName == "circle" || evnt.target.tagName == "tspan" || evnt.target.tagName == "text" || evnt.target.id == `${id}_info_rect`) { return; }

                    skull.hiddenInfo ();

                    this.gtranslate = true;

                    initPoint = {
                        x: evnt.clientX,
                        y: evnt.clientY
                    };
                }

                function move (evnt) {
                    if (!this.gtranslate) { return; }

                    localDelta = {
                        x: _axisX.translate (_delta.x + evnt.clientX - initPoint.x),
                        y: _axisY.translate (_delta.y + evnt.clientY - initPoint.y)
                    };

                    if (_navigator) {
                        _jsg(`${id}_gspaces`).style["-webkit-transform"] = `translate(${localDelta.x}px, ${localDelta.y}px)`;
                    } else {
                        _jsg(`${id}_gspaces`).style.translate = `${localDelta.x}px ${localDelta.y}px`;
                    }
                }

                function stopTranslate () {
                    this.gtranslate = false;
                    
                    _delta = localDelta;
                    initPoint = {
                        x: 0,
                        y: 0
                    };
                }
            };

            function createMetricScale () {
                _axisX.reset ();
                _axisY.reset ();

                _axisX.setScale (_spaceX.getScale (config.maxUnitsX));
                _axisY.setScale (_spaceY.getScale (config.maxUnitsY));
            }

            function swept (callback) {
                let g;

                for (g in _graphics) {
                    if (_graphics[g].getStatus ()) {
                        callback (_graphics[g]);
                    }
                }
            }
        }
    }
};
