/*
 * FECHA: 2020/11/17
 * AUTOR: Julio Alejandro Santos Corona
 * CORREO: julisantos@santander.com.mx | jualesac@yahoo.com
 * TÍTULO: _jsg.js
 * 
 * Descripción: Ampliaciones a los objetos SVGElement
*/

"use strict";

(function (clase) {
    if (!window._jsg) {
        clase ();
    }
}) (function () {
    const sn = "http://www.w3.org/2000/svg";
    
    let __proto = SVGElement.prototype;

    let jsg = function (selector) {
        let objSVG;
        let qs;

        if (arguments.length === 0) {
            throw new Error ("Se esperaba un argumento");
        }

        if (selector instanceof Element) { return selector; }

        qs = document.querySelectorAll (selector);

        objSVG = (qs.length > 1) ? qs : (document.querySelector (selector)) ? document.querySelector (selector) : document.getElementById (selector);

        return objSVG;
    }

    NodeList.prototype.gmap = function (callback, retur) {
        callback = callback || function () { return; };

        checkType (callback, "function");

        this.forEach (function (item) {
            callback.call (item);
        });

        if (retur) { return this; }
    };

    jsg.createElement = function (element) {
        checkType (element, "string");

        return (document.createElementNS (sn, element));
    };

    __proto.event = function (evnt, callback) {
        this.addEventListener (evnt, callback);
    };
    
    __proto.rmEvent = function (evnt, callback) {
        this.removeEventListener (evnt, callback);
    };

    __proto.addStyle = function (style) {
        checkType (style, "string");

        let regExp = new RegExp (`(?:^| )${style}(?: |$)`);
        let c = this.getAttribute ("class") || "";

        if (!regExp.test (c)) {
            this.setAttribute ("class", `${c} ${style}`.trim ());
        }

        return this;
    };

    __proto.rmStyle = function (style) {
        checkType (style, "string");

        let regExp = new RegExp (`(?:^| )${style}(?: |$)`);

        this.setAttribute ("class", (this.getAttribute ("class") || "").replace (regExp, ""). trim ());
    };

    __proto.setAttributes = function (obj) {
        checkType (obj, "object");

        let attribute;

        for (attribute in obj) {
            this.setAttribute (attribute, obj[attribute]);
        }

        return this;
    };

    __proto.appendTo = function (parent) {
        parent = (parent instanceof SVGElement) ? parent : jsg(parent);

        parent.appendChild (this);

        return parent;
    };

    function checkInstance (obj, instance, alias) {
        if (!(obj instanceof instance)) {
            throw new TypeError (`Se esperaba un objeto ${alias} como argumento.`);
        }
    }

    function checkType (argument, type) {
        if (typeof (argument) !== type) {
            throw new TypeError (`Se esperaba un ${type} como argumento.`);
        }
    }

    window._jsg = jsg;
});
