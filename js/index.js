window.onload = function () {
    let graphic = new GEOMETRY.GRAPHIC.main ({
        width: 1350,
        height: 580,
        nameX: "ops",
        nameY: "min",
        marginL: -30,
        marginR: -12,
        maxUnitsX: 13,
        maxUnitsY: 10,
        directionX: "+",
        directionY: "-",
        notationX: notationX,
        notationY: notationY
    });

    function notationX (value) {
        let months = [ "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" ];

        return months[Math.floor (value % 12)];
    }

    function notationY (value) {
        return value;
    }

    graphic.onBuild (function (circle, point) {
        if (point.info.y < 11) {
            circle.setAttribute ("style", "stroke-width: 2px;");
            circle.setAttribute ("stroke", "rgb(254, 0, 0)");
        }
    });

    let g1 = new graphic.create ({
        name: "SPEI",
        color: "rgb(67, 124, 156)",
        fill: {
            width: 5,
            height: 5,
            color: "rgb(67, 124, 156)",
            type: "c", //l
            center: { x: 2, y: 2 },
            line: "M 5 0, 0 5"
        }
    });

    let g2 = new graphic.create ({
        name: "TMB",
        color: "rgb(107, 170, 84)",
        fill: {
            width: 5,
            height: 5/*,
            color: "rgb(107, 170, 84)",
            type: "l", //l
            center: { x: 2, y: 2 },
            line: "M 5 0, 0 5"*/
        }
    });

    let g3 = new graphic.create ({
        name: "NMB",
        color: "rgb(224, 156, 66)",
        fill: {
            width: 5,
            height: 5,
            color: "rgb(224, 156, 66)",
            type: "l", //l
            center: { x: 2, y: 2 },
            line: "M 0 0, 5 0"
        }
    });

    g1.setPoint (0, 5, { numero: 0 });
    g1.setPoint (1, 6, { numero: 1 });
    g1.setPoint (2, 7, { numero: 2 });
    g1.setPoint (3, 8, { numero: 3 });
    g1.setPoint (4, 9, { numero: 4 });

    g2.setPoint (7, 2, { numero: 7 });
    g2.setPoint (10, 15, { numero: 10 });
    g2.setPoint (11, 11, { numero: 11, nombre: "Julio" });
    g2.setPoint (12, 12.5, { numero: 12, nombre: "Julio" });

    g3.setPoint (3, 10, { numero: 10 });
    g3.setPoint (4, 11, { numero: 11 });
    g3.setPoint (5, 12, { numero: 12 });
    g3.setPoint (6, 13, { numero: 13 });
    g3.setPoint (8, 14, { numero: 14 });
    g3.setPoint (9, 8, { numero: 15 });

    g1.active ();
    g2.active ();
    g3.active ();

    g1.setRange (3);

    graphic.build (true);
    graphic.clear ();

    g1.setRange (3);
    graphic.build (true);
    console.log (graphic, g1);

    /*let axis = new GEOMETRY.AXIS.main ({
        name: "min",
        length: 450,
        horizontal: true,
        x: 400,
        y: 15,
        direction: "-" //"-"
    });

    axis.setMetricScale (function (value) {
        if (value == 0) {
            return "ene";
        } else {
            return value;
        }
    });

    let points = new GEOMETRY.SPACE;
    let p1 = new points.PointSet;*/
}; 
