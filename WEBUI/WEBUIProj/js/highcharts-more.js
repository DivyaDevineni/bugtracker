/*
 Highcharts JS v6.0.3 (2017-11-14)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (x) { "object" === typeof module && module.exports ? module.exports = x : x(Highcharts) })(function (x) {
    (function (a) {
        var t = a.deg2rad, v = a.isNumber, w = a.pick, n = a.relativeLength; a.CenteredSeriesMixin = {
            getCenter: function () {
                var a = this.options, e = this.chart, k = 2 * (a.slicedOffset || 0), b = e.plotWidth - 2 * k, e = e.plotHeight - 2 * k, c = a.center, c = [w(c[0], "50%"), w(c[1], "50%"), a.size || "100%", a.innerSize || 0], l = Math.min(b, e), g, d; for (g = 0; 4 > g; ++g) d = c[g], a = 2 > g || 2 === g && /%$/.test(d), c[g] = n(d, [b, e, l, c[2]][g]) + (a ? k : 0); c[3] > c[2] && (c[3] = c[2]);
                return c
            }, getStartAndEndRadians: function (a, e) { a = v(a) ? a : 0; e = v(e) && e > a && 360 > e - a ? e : a + 360; return { start: t * (a + -90), end: t * (e + -90) } }
        }
    })(x); (function (a) {
        function t(a, b) { this.init(a, b) } var v = a.CenteredSeriesMixin, w = a.each, n = a.extend, m = a.merge, e = a.splat; n(t.prototype, {
            coll: "pane", init: function (a, b) { this.chart = b; this.background = []; b.pane.push(this); this.setOptions(a) }, setOptions: function (a) { this.options = m(this.defaultOptions, this.chart.angular ? { background: {} } : void 0, a) }, render: function () {
                var a = this.options, b =
                this.options.background, c = this.chart.renderer; this.group || (this.group = c.g("pane-group").attr({ zIndex: a.zIndex || 0 }).add()); this.updateCenter(); if (b) for (b = e(b), a = Math.max(b.length, this.background.length || 0), c = 0; c < a; c++) b[c] && this.axis ? this.renderBackground(m(this.defaultBackgroundOptions, b[c]), c) : this.background[c] && (this.background[c] = this.background[c].destroy(), this.background.splice(c, 1))
            }, renderBackground: function (a, b) {
                var c = "animate"; this.background[b] || (this.background[b] = this.chart.renderer.path().add(this.group),
                c = "attr"); this.background[b][c]({ d: this.axis.getPlotBandPath(a.from, a.to, a) }).attr({ fill: a.backgroundColor, stroke: a.borderColor, "stroke-width": a.borderWidth, "class": "highcharts-pane " + (a.className || "") })
            }, defaultOptions: { center: ["50%", "50%"], size: "85%", startAngle: 0 }, defaultBackgroundOptions: { shape: "circle", borderWidth: 1, borderColor: "#cccccc", backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, "#ffffff"], [1, "#e6e6e6"]] }, from: -Number.MAX_VALUE, innerRadius: 0, to: Number.MAX_VALUE, outerRadius: "105%" },
            updateCenter: function (a) { this.center = (a || this.axis || {}).center = v.getCenter.call(this) }, update: function (a, b) { m(!0, this.options, a); this.setOptions(this.options); this.render(); w(this.chart.axes, function (c) { c.pane === this && (c.pane = null, c.update({}, b)) }, this) }
        }); a.Pane = t
    })(x); (function (a) {
        var t = a.each, v = a.extend, w = a.map, n = a.merge, m = a.noop, e = a.pick, k = a.pInt, b = a.wrap, c, l, g = a.Axis.prototype; a = a.Tick.prototype; c = {
            getOffset: m, redraw: function () { this.isDirty = !1 }, render: function () { this.isDirty = !1 }, setScale: m, setCategories: m,
            setTitle: m
        }; l = {
            defaultRadialGaugeOptions: { labels: { align: "center", x: 0, y: null }, minorGridLineWidth: 0, minorTickInterval: "auto", minorTickLength: 10, minorTickPosition: "inside", minorTickWidth: 1, tickLength: 10, tickPosition: "inside", tickWidth: 2, title: { rotation: 0 }, zIndex: 2 }, defaultRadialXOptions: { gridLineWidth: 1, labels: { align: null, distance: 15, x: 0, y: null }, maxPadding: 0, minPadding: 0, showLastLabel: !1, tickLength: 0 }, defaultRadialYOptions: {
                gridLineInterpolation: "circle", labels: { align: "right", x: -3, y: -2 }, showLastLabel: !1,
                title: { x: 4, text: null, rotation: 90 }
            }, setOptions: function (b) { b = this.options = n(this.defaultOptions, this.defaultRadialOptions, b); b.plotBands || (b.plotBands = []) }, getOffset: function () { g.getOffset.call(this); this.chart.axisOffset[this.side] = 0 }, getLinePath: function (b, c) {
                b = this.center; var d = this.chart, f = e(c, b[2] / 2 - this.offset); this.isCircular || void 0 !== c ? (c = this.chart.renderer.symbols.arc(this.left + b[0], this.top + b[1], f, f, { start: this.startAngleRad, end: this.endAngleRad, open: !0, innerR: 0 }), c.xBounds = [this.left +
                b[0]], c.yBounds = [this.top + b[1] - f]) : (c = this.postTranslate(this.angleRad, f), c = ["M", b[0] + d.plotLeft, b[1] + d.plotTop, "L", c.x, c.y]); return c
            }, setAxisTranslation: function () { g.setAxisTranslation.call(this); this.center && (this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min || 1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0) }, beforeSetTickPositions: function () {
                if (this.autoConnect = this.isCircular && void 0 === e(this.userMax,
                this.options.max) && this.endAngleRad - this.startAngleRad === 2 * Math.PI) this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0
            }, setAxisSize: function () { g.setAxisSize.call(this); this.isRadial && (this.pane.updateCenter(this), this.isCircular && (this.sector = this.endAngleRad - this.startAngleRad), this.len = this.width = this.height = this.center[2] * e(this.sector, 1) / 2) }, getPosition: function (b, c) {
                return this.postTranslate(this.isCircular ? this.translate(b) : this.angleRad, e(this.isCircular ? c : this.translate(b),
                this.center[2] / 2) - this.offset)
            }, postTranslate: function (b, c) { var d = this.chart, f = this.center; b = this.startAngleRad + b; return { x: d.plotLeft + f[0] + Math.cos(b) * c, y: d.plotTop + f[1] + Math.sin(b) * c } }, getPlotBandPath: function (b, c, a) {
                var d = this.center, f = this.startAngleRad, l = d[2] / 2, h = [e(a.outerRadius, "100%"), a.innerRadius, e(a.thickness, 10)], g = Math.min(this.offset, 0), u = /%$/, m, n = this.isCircular; "polygon" === this.options.gridLineInterpolation ? d = this.getPlotLinePath(b).concat(this.getPlotLinePath(c, !0)) : (b = Math.max(b,
                this.min), c = Math.min(c, this.max), n || (h[0] = this.translate(b), h[1] = this.translate(c)), h = w(h, function (b) { u.test(b) && (b = k(b, 10) * l / 100); return b }), "circle" !== a.shape && n ? (b = f + this.translate(b), c = f + this.translate(c)) : (b = -Math.PI / 2, c = 1.5 * Math.PI, m = !0), h[0] -= g, h[2] -= g, d = this.chart.renderer.symbols.arc(this.left + d[0], this.top + d[1], h[0], h[0], { start: Math.min(b, c), end: Math.max(b, c), innerR: e(h[1], h[0] - h[2]), open: m })); return d
            }, getPlotLinePath: function (b, c) {
                var d = this, f = d.center, a = d.chart, l = d.getPosition(b), g, e,
                u; d.isCircular ? u = ["M", f[0] + a.plotLeft, f[1] + a.plotTop, "L", l.x, l.y] : "circle" === d.options.gridLineInterpolation ? (b = d.translate(b)) && (u = d.getLinePath(0, b)) : (t(a.xAxis, function (b) { b.pane === d.pane && (g = b) }), u = [], b = d.translate(b), f = g.tickPositions, g.autoConnect && (f = f.concat([f[0]])), c && (f = [].concat(f).reverse()), t(f, function (c, d) { e = g.getPosition(c, b); u.push(d ? "L" : "M", e.x, e.y) })); return u
            }, getTitlePosition: function () {
                var b = this.center, c = this.chart, a = this.options.title; return {
                    x: c.plotLeft + b[0] + (a.x || 0), y: c.plotTop +
                    b[1] - { high: .5, middle: .25, low: 0 }[a.align] * b[2] + (a.y || 0)
                }
            }
        }; b(g, "init", function (b, f, a) {
            var d = f.angular, h = f.polar, g = a.isX, y = d && g, m, u = f.options, k = a.pane || 0, t = this.pane = f.pane && f.pane[k], k = t && t.options; if (d) { if (v(this, y ? c : l), m = !g) this.defaultRadialOptions = this.defaultRadialGaugeOptions } else h && (v(this, l), this.defaultRadialOptions = (m = g) ? this.defaultRadialXOptions : n(this.defaultYAxisOptions, this.defaultRadialYOptions)); d || h ? (this.isRadial = !0, f.inverted = !1, u.chart.zoomType = null) : this.isRadial = !1; t && m && (t.axis =
            this); b.call(this, f, a); !y && t && (d || h) && (b = this.options, this.angleRad = (b.angle || 0) * Math.PI / 180, this.startAngleRad = (k.startAngle - 90) * Math.PI / 180, this.endAngleRad = (e(k.endAngle, k.startAngle + 360) - 90) * Math.PI / 180, this.offset = b.offset || 0, this.isCircular = m)
        }); b(g, "autoLabelAlign", function (b) { if (!this.isRadial) return b.apply(this, [].slice.call(arguments, 1)) }); b(a, "getPosition", function (b, c, a, l, g) { var d = this.axis; return d.getPosition ? d.getPosition(a) : b.call(this, c, a, l, g) }); b(a, "getLabelPosition", function (b,
        c, a, l, g, r, y, m, u) {
            var d = this.axis, f = r.y, h = 20, p = r.align, q = (d.translate(this.pos) + d.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360; d.isRadial ? (b = d.getPosition(this.pos, d.center[2] / 2 + e(r.distance, -25)), "auto" === r.rotation ? l.attr({ rotation: q }) : null === f && (f = d.chart.renderer.fontMetrics(l.styles.fontSize).b - l.getBBox().height / 2), null === p && (d.isCircular ? (this.label.getBBox().width > d.len * d.tickInterval / (d.max - d.min) && (h = 0), p = q > h && q < 180 - h ? "left" : q > 180 + h && q < 360 - h ? "right" : "center") : p = "center", l.attr({ align: p })), b.x +=
            r.x, b.y += f) : b = b.call(this, c, a, l, g, r, y, m, u); return b
        }); b(a, "getMarkPath", function (b, c, a, l, g, r, e) { var d = this.axis; d.isRadial ? (b = d.getPosition(this.pos, d.center[2] / 2 + l), c = ["M", c, a, "L", b.x, b.y]) : c = b.call(this, c, a, l, g, r, e); return c })
    })(x); (function (a) {
        var t = a.each, v = a.pick, w = a.defined, n = a.seriesType, m = a.seriesTypes, e = a.Series.prototype, k = a.Point.prototype; n("arearange", "area", {
            lineWidth: 1, threshold: null, tooltip: { pointFormat: '\x3cspan style\x3d"color:{series.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' },
            trackByArea: !0, dataLabels: { align: null, verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0 }
        }, {
            pointArrayMap: ["low", "high"], dataLabelCollections: ["dataLabel", "dataLabelUpper"], toYData: function (b) { return [b.low, b.high] }, pointValKey: "low", deferTranslatePolar: !0, highToXY: function (b) { var c = this.chart, a = this.xAxis.postTranslate(b.rectPlotX, this.yAxis.len - b.plotHigh); b.plotHighX = a.x - c.plotLeft; b.plotHigh = a.y - c.plotTop; b.plotLowX = b.plotX }, translate: function () {
                var b = this, c = b.yAxis, a = !!b.modifyValue; m.area.prototype.translate.apply(b);
                t(b.points, function (l) { var d = l.low, f = l.high, h = l.plotY; null === f || null === d ? (l.isNull = !0, l.plotY = null) : (l.plotLow = h, l.plotHigh = c.translate(a ? b.modifyValue(f, l) : f, 0, 1, 0, 1), a && (l.yBottom = l.plotHigh)) }); this.chart.polar && t(this.points, function (c) { b.highToXY(c); c.tooltipPos = [(c.plotHighX + c.plotLowX) / 2, (c.plotHigh + c.plotLow) / 2] })
            }, getGraphPath: function (b) {
                var c = [], a = [], g, d = m.area.prototype.getGraphPath, f, h, q; q = this.options; var p = this.chart.polar && !1 !== q.connectEnds, r = q.connectNulls, e = q.step; b = b || this.points;
                for (g = b.length; g--;) f = b[g], f.isNull || p || r || b[g + 1] && !b[g + 1].isNull || a.push({ plotX: f.plotX, plotY: f.plotY, doCurve: !1 }), h = { polarPlotY: f.polarPlotY, rectPlotX: f.rectPlotX, yBottom: f.yBottom, plotX: v(f.plotHighX, f.plotX), plotY: f.plotHigh, isNull: f.isNull }, a.push(h), c.push(h), f.isNull || p || r || b[g - 1] && !b[g - 1].isNull || a.push({ plotX: f.plotX, plotY: f.plotY, doCurve: !1 }); b = d.call(this, b); e && (!0 === e && (e = "left"), q.step = { left: "right", center: "center", right: "left" }[e]); c = d.call(this, c); a = d.call(this, a); q.step = e; q = [].concat(b,
                c); this.chart.polar || "M" !== a[0] || (a[0] = "L"); this.graphPath = q; this.areaPath = b.concat(a); q.isArea = !0; q.xMap = b.xMap; this.areaPath.xMap = b.xMap; return q
            }, drawDataLabels: function () {
                var b = this.data, c = b.length, a, g = [], d = this.options.dataLabels, f = d.align, h = d.verticalAlign, q = d.inside, p, r, y = this.chart.inverted; if (d.enabled || this._hasPointLabels) {
                    for (a = c; a--;) if (p = b[a]) r = q ? p.plotHigh < p.plotLow : p.plotHigh > p.plotLow, p.y = p.high, p._plotY = p.plotY, p.plotY = p.plotHigh, g[a] = p.dataLabel, p.dataLabel = p.dataLabelUpper, p.below =
                    r, y ? f || (d.align = r ? "right" : "left") : h || (d.verticalAlign = r ? "top" : "bottom"), d.x = d.xHigh, d.y = d.yHigh; e.drawDataLabels && e.drawDataLabels.apply(this, arguments); for (a = c; a--;) if (p = b[a]) r = q ? p.plotHigh < p.plotLow : p.plotHigh > p.plotLow, p.dataLabelUpper = p.dataLabel, p.dataLabel = g[a], p.y = p.low, p.plotY = p._plotY, p.below = !r, y ? f || (d.align = r ? "left" : "right") : h || (d.verticalAlign = r ? "bottom" : "top"), d.x = d.xLow, d.y = d.yLow; e.drawDataLabels && e.drawDataLabels.apply(this, arguments)
                } d.align = f; d.verticalAlign = h
            }, alignDataLabel: function () {
                m.column.prototype.alignDataLabel.apply(this,
                arguments)
            }, drawPoints: function () { var b = this.points.length, c, a; e.drawPoints.apply(this, arguments); for (a = 0; a < b;) c = this.points[a], c.lowerGraphic = c.graphic, c.graphic = c.upperGraphic, c._plotY = c.plotY, c._plotX = c.plotX, c.plotY = c.plotHigh, w(c.plotHighX) && (c.plotX = c.plotHighX), a++; e.drawPoints.apply(this, arguments); for (a = 0; a < b;) c = this.points[a], c.upperGraphic = c.graphic, c.graphic = c.lowerGraphic, c.plotY = c._plotY, c.plotX = c._plotX, a++ }, setStackedPoints: a.noop
        }, {
            setState: function () {
                var b = this.state, c = this.series,
                a = c.chart.polar; w(this.plotHigh) || (this.plotHigh = c.yAxis.toPixels(this.high, !0)); w(this.plotLow) || (this.plotLow = this.plotY = c.yAxis.toPixels(this.low, !0)); k.setState.apply(this, arguments); this.graphic = this.upperGraphic; this.plotY = this.plotHigh; a && (this.plotX = this.plotHighX); this.state = b; c.stateMarkerGraphic && (c.lowerStateMarkerGraphic = c.stateMarkerGraphic, c.stateMarkerGraphic = c.upperStateMarkerGraphic); k.setState.apply(this, arguments); this.plotY = this.plotLow; this.graphic = this.lowerGraphic; a && (this.plotX =
                this.plotLowX); c.stateMarkerGraphic && (c.upperStateMarkerGraphic = c.stateMarkerGraphic, c.stateMarkerGraphic = c.lowerStateMarkerGraphic, c.lowerStateMarkerGraphic = void 0)
            }, haloPath: function () { var b = this.series.chart.polar, c; this.plotY = this.plotLow; b && (this.plotX = this.plotLowX); c = k.haloPath.apply(this, arguments); this.plotY = this.plotHigh; b && (this.plotX = this.plotHighX); return c = c.concat(k.haloPath.apply(this, arguments)) }, destroy: function () {
                this.upperGraphic && (this.upperGraphic = this.upperGraphic.destroy());
                return k.destroy.apply(this, arguments)
            }
        })
    })(x); (function (a) { var t = a.seriesType; t("areasplinerange", "arearange", null, { getPointSpline: a.seriesTypes.spline.prototype.getPointSpline }) })(x); (function (a) {
        var t = a.defaultPlotOptions, v = a.each, w = a.merge, n = a.noop, m = a.pick, e = a.seriesType, k = a.seriesTypes.column.prototype; e("columnrange", "arearange", w(t.column, t.arearange, { pointRange: null, marker: null, states: { hover: { halo: !1 } } }), {
            translate: function () {
                var b = this, c = b.yAxis, a = b.xAxis, g = a.startAngleRad, d, f = b.chart, h =
                b.xAxis.isRadial, q = Math.max(f.chartWidth, f.chartHeight) + 999, p; k.translate.apply(b); v(b.points, function (l) {
                    var r = l.shapeArgs, e = b.options.minPointLength, u, k; l.plotHigh = p = Math.min(Math.max(-q, c.translate(l.high, 0, 1, 0, 1)), q); l.plotLow = Math.min(Math.max(-q, l.plotY), q); k = p; u = m(l.rectPlotY, l.plotY) - p; Math.abs(u) < e ? (e -= u, u += e, k -= e / 2) : 0 > u && (u *= -1, k -= u); h ? (d = l.barX + g, l.shapeType = "path", l.shapeArgs = { d: b.polarArc(k + u, k, d, d + l.pointWidth) }) : (r.height = u, r.y = k, l.tooltipPos = f.inverted ? [c.len + c.pos - f.plotLeft - k - u /
                    2, a.len + a.pos - f.plotTop - r.x - r.width / 2, u] : [a.left - f.plotLeft + r.x + r.width / 2, c.pos - f.plotTop + k + u / 2, u])
                })
            }, directTouch: !0, trackerGroups: ["group", "dataLabelsGroup"], drawGraph: n, getSymbol: n, crispCol: k.crispCol, drawPoints: k.drawPoints, drawTracker: k.drawTracker, getColumnMetrics: k.getColumnMetrics, pointAttribs: k.pointAttribs, animate: function () { return k.animate.apply(this, arguments) }, polarArc: function () { return k.polarArc.apply(this, arguments) }, translate3dPoints: function () {
                return k.translate3dPoints.apply(this,
                arguments)
            }, translate3dShapes: function () { return k.translate3dShapes.apply(this, arguments) }
        }, { setState: k.pointClass.prototype.setState })
    })(x); (function (a) {
        var t = a.each, v = a.isNumber, w = a.merge, n = a.pick, m = a.pInt, e = a.Series, k = a.seriesType, b = a.TrackerMixin; k("gauge", "line", { dataLabels: { enabled: !0, defer: !1, y: 15, borderRadius: 3, crop: !1, verticalAlign: "top", zIndex: 2, borderWidth: 1, borderColor: "#cccccc" }, dial: {}, pivot: {}, tooltip: { headerFormat: "" }, showInLegend: !1 }, {
            angular: !0, directTouch: !0, drawGraph: a.noop, fixedBox: !0,
            forceDL: !0, noSharedTooltip: !0, trackerGroups: ["group", "dataLabelsGroup"], translate: function () {
                var b = this.yAxis, a = this.options, g = b.center; this.generatePoints(); t(this.points, function (c) {
                    var d = w(a.dial, c.dial), l = m(n(d.radius, 80)) * g[2] / 200, q = m(n(d.baseLength, 70)) * l / 100, p = m(n(d.rearLength, 10)) * l / 100, r = d.baseWidth || 3, e = d.topWidth || 1, k = a.overshoot, u = b.startAngleRad + b.translate(c.y, null, null, null, !0); v(k) ? (k = k / 180 * Math.PI, u = Math.max(b.startAngleRad - k, Math.min(b.endAngleRad + k, u))) : !1 === a.wrap && (u = Math.max(b.startAngleRad,
                    Math.min(b.endAngleRad, u))); u = 180 * u / Math.PI; c.shapeType = "path"; c.shapeArgs = { d: d.path || ["M", -p, -r / 2, "L", q, -r / 2, l, -e / 2, l, e / 2, q, r / 2, -p, r / 2, "z"], translateX: g[0], translateY: g[1], rotation: u }; c.plotX = g[0]; c.plotY = g[1]
                })
            }, drawPoints: function () {
                var b = this, a = b.yAxis.center, g = b.pivot, d = b.options, f = d.pivot, h = b.chart.renderer; t(b.points, function (c) {
                    var a = c.graphic, f = c.shapeArgs, l = f.d, g = w(d.dial, c.dial); a ? (a.animate(f), f.d = l) : (c.graphic = h[c.shapeType](f).attr({ rotation: f.rotation, zIndex: 1 }).addClass("highcharts-dial").add(b.group),
                    c.graphic.attr({ stroke: g.borderColor || "none", "stroke-width": g.borderWidth || 0, fill: g.backgroundColor || "#000000" }))
                }); g ? g.animate({ translateX: a[0], translateY: a[1] }) : (b.pivot = h.circle(0, 0, n(f.radius, 5)).attr({ zIndex: 2 }).addClass("highcharts-pivot").translate(a[0], a[1]).add(b.group), b.pivot.attr({ "stroke-width": f.borderWidth || 0, stroke: f.borderColor || "#cccccc", fill: f.backgroundColor || "#000000" }))
            }, animate: function (b) {
                var c = this; b || (t(c.points, function (b) {
                    var a = b.graphic; a && (a.attr({
                        rotation: 180 * c.yAxis.startAngleRad /
                        Math.PI
                    }), a.animate({ rotation: b.shapeArgs.rotation }, c.options.animation))
                }), c.animate = null)
            }, render: function () { this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup); e.prototype.render.call(this); this.group.clip(this.chart.clipRect) }, setData: function (b, a) { e.prototype.setData.call(this, b, !1); this.processData(); this.generatePoints(); n(a, !0) && this.chart.redraw() }, drawTracker: b && b.drawTrackerPoint
        }, { setState: function (b) { this.state = b } })
    })(x);
    (function (a) {
        var t = a.each, v = a.noop, w = a.pick, n = a.seriesType, m = a.seriesTypes; n("boxplot", "column", {
            threshold: null, tooltip: { pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e' }, whiskerLength: "50%", fillColor: "#ffffff", lineWidth: 1, medianWidth: 2, states: { hover: { brightness: -.3 } },
            whiskerWidth: 2
        }, {
            pointArrayMap: ["low", "q1", "median", "q3", "high"], toYData: function (a) { return [a.low, a.q1, a.median, a.q3, a.high] }, pointValKey: "high", pointAttribs: function (a) { var e = this.options, b = a && a.color || this.color; return { fill: a.fillColor || e.fillColor || b, stroke: e.lineColor || b, "stroke-width": e.lineWidth || 0 } }, drawDataLabels: v, translate: function () {
                var a = this.yAxis, k = this.pointArrayMap; m.column.prototype.translate.apply(this); t(this.points, function (b) {
                    t(k, function (c) {
                        null !== b[c] && (b[c + "Plot"] = a.translate(b[c],
                        0, 1, 0, 1))
                    })
                })
            }, drawPoints: function () {
                var a = this, k = a.options, b = a.chart.renderer, c, l, g, d, f, h, q = 0, p, r, m, n, u = !1 !== a.doQuartiles, v, A = a.options.whiskerLength; t(a.points, function (e) {
                    var y = e.graphic, t = y ? "animate" : "attr", J = e.shapeArgs, x = {}, C = {}, H = {}, I = e.color || a.color; void 0 !== e.plotY && (p = J.width, r = Math.floor(J.x), m = r + p, n = Math.round(p / 2), c = Math.floor(u ? e.q1Plot : e.lowPlot), l = Math.floor(u ? e.q3Plot : e.lowPlot), g = Math.floor(e.highPlot), d = Math.floor(e.lowPlot), y || (e.graphic = y = b.g("point").add(a.group), e.stem = b.path().addClass("highcharts-boxplot-stem").add(y),
                    A && (e.whiskers = b.path().addClass("highcharts-boxplot-whisker").add(y)), u && (e.box = b.path(void 0).addClass("highcharts-boxplot-box").add(y)), e.medianShape = b.path(void 0).addClass("highcharts-boxplot-median").add(y)), x.stroke = e.stemColor || k.stemColor || I, x["stroke-width"] = w(e.stemWidth, k.stemWidth, k.lineWidth), x.dashstyle = e.stemDashStyle || k.stemDashStyle, e.stem.attr(x), A && (C.stroke = e.whiskerColor || k.whiskerColor || I, C["stroke-width"] = w(e.whiskerWidth, k.whiskerWidth, k.lineWidth), e.whiskers.attr(C)), u &&
                    (y = a.pointAttribs(e), e.box.attr(y)), H.stroke = e.medianColor || k.medianColor || I, H["stroke-width"] = w(e.medianWidth, k.medianWidth, k.lineWidth), e.medianShape.attr(H), h = e.stem.strokeWidth() % 2 / 2, q = r + n + h, e.stem[t]({ d: ["M", q, l, "L", q, g, "M", q, c, "L", q, d] }), u && (h = e.box.strokeWidth() % 2 / 2, c = Math.floor(c) + h, l = Math.floor(l) + h, r += h, m += h, e.box[t]({ d: ["M", r, l, "L", r, c, "L", m, c, "L", m, l, "L", r, l, "z"] })), A && (h = e.whiskers.strokeWidth() % 2 / 2, g += h, d += h, v = /%$/.test(A) ? n * parseFloat(A) / 100 : A / 2, e.whiskers[t]({
                        d: ["M", q - v, g, "L", q + v,
                        g, "M", q - v, d, "L", q + v, d]
                    })), f = Math.round(e.medianPlot), h = e.medianShape.strokeWidth() % 2 / 2, f += h, e.medianShape[t]({ d: ["M", r, f, "L", m, f] }))
                })
            }, setStackedPoints: v
        })
    })(x); (function (a) {
        var t = a.each, v = a.noop, w = a.seriesType, n = a.seriesTypes; w("errorbar", "boxplot", { color: "#000000", grouping: !1, linkedTo: ":previous", tooltip: { pointFormat: '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e' }, whiskerWidth: null }, {
            type: "errorbar",
            pointArrayMap: ["low", "high"], toYData: function (a) { return [a.low, a.high] }, pointValKey: "high", doQuartiles: !1, drawDataLabels: n.arearange ? function () { var a = this.pointValKey; n.arearange.prototype.drawDataLabels.call(this); t(this.data, function (e) { e.y = e[a] }) } : v, getColumnMetrics: function () { return this.linkedParent && this.linkedParent.columnMetrics || n.column.prototype.getColumnMetrics.call(this) }
        })
    })(x); (function (a) {
        var t = a.correctFloat, v = a.isNumber, w = a.pick, n = a.Point, m = a.Series, e = a.seriesType, k = a.seriesTypes;
        e("waterfall", "column", { dataLabels: { inside: !0 }, lineWidth: 1, lineColor: "#333333", dashStyle: "dot", borderColor: "#333333", states: { hover: { lineWidthPlus: 0 } } }, {
            pointValKey: "y", translate: function () {
                var b = this.options, c = this.yAxis, a, g, d, f, h, e, p, r, m, n, u = w(b.minPointLength, 5), v = u / 2, x = b.threshold, D = b.stacking, z; k.column.prototype.translate.apply(this); r = m = x; g = this.points; a = 0; for (b = g.length; a < b; a++) d = g[a], p = this.processedYData[a], f = d.shapeArgs, h = D && c.stacks[(this.negStacks && p < x ? "-" : "") + this.stackKey], z = this.getStackIndicator(z,
                d.x, this.index), n = h ? h[d.x].points[z.key] : [0, p], d.isSum ? d.y = t(p) : d.isIntermediateSum && (d.y = t(p - m)), e = Math.max(r, r + d.y) + n[0], f.y = c.translate(e, 0, 1, 0, 1), d.isSum ? (f.y = c.translate(n[1], 0, 1, 0, 1), f.height = Math.min(c.translate(n[0], 0, 1, 0, 1), c.len) - f.y) : d.isIntermediateSum ? (f.y = c.translate(n[1], 0, 1, 0, 1), f.height = Math.min(c.translate(m, 0, 1, 0, 1), c.len) - f.y, m = n[1]) : (f.height = 0 < p ? c.translate(r, 0, 1, 0, 1) - f.y : c.translate(r, 0, 1, 0, 1) - c.translate(r - p, 0, 1, 0, 1), r += h && h[d.x] ? h[d.x].total : p), 0 > f.height && (f.y += f.height,
                f.height *= -1), d.plotY = f.y = Math.round(f.y) - this.borderWidth % 2 / 2, f.height = Math.max(Math.round(f.height), .001), d.yBottom = f.y + f.height, f.height <= u && !d.isNull ? (f.height = u, f.y -= v, d.plotY = f.y, d.minPointLengthOffset = 0 > d.y ? -v : v) : d.minPointLengthOffset = 0, f = d.plotY + (d.negative ? f.height : 0), this.chart.inverted ? d.tooltipPos[0] = c.len - f : d.tooltipPos[1] = f
            }, processData: function (b) {
                var c = this.yData, a = this.options.data, e, d = c.length, f, h, q, p, r, k; h = f = q = p = this.options.threshold || 0; for (k = 0; k < d; k++) r = c[k], e = a && a[k] ? a[k] : {},
                "sum" === r || e.isSum ? c[k] = t(h) : "intermediateSum" === r || e.isIntermediateSum ? c[k] = t(f) : (h += r, f += r), q = Math.min(h, q), p = Math.max(h, p); m.prototype.processData.call(this, b); this.options.stacking || (this.dataMin = q, this.dataMax = p)
            }, toYData: function (b) { return b.isSum ? 0 === b.x ? null : "sum" : b.isIntermediateSum ? 0 === b.x ? null : "intermediateSum" : b.y }, pointAttribs: function (b, a) { var c = this.options.upColor; c && !b.options.color && (b.color = 0 < b.y ? c : null); b = k.column.prototype.pointAttribs.call(this, b, a); delete b.dashstyle; return b },
            getGraphPath: function () { return ["M", 0, 0] }, getCrispPath: function () { var b = this.data, a = b.length, e = this.graph.strokeWidth() + this.borderWidth, e = Math.round(e) % 2 / 2, g = this.yAxis.reversed, d = [], f, h, q; for (q = 1; q < a; q++) { h = b[q].shapeArgs; f = b[q - 1].shapeArgs; h = ["M", f.x + f.width, f.y + b[q - 1].minPointLengthOffset + e, "L", h.x, f.y + b[q - 1].minPointLengthOffset + e]; if (0 > b[q - 1].y && !g || 0 < b[q - 1].y && g) h[2] += f.height, h[5] += f.height; d = d.concat(h) } return d }, drawGraph: function () { m.prototype.drawGraph.call(this); this.graph.attr({ d: this.getCrispPath() }) },
            setStackedPoints: function () { var b = this.options, a, e; m.prototype.setStackedPoints.apply(this, arguments); a = this.stackedYData ? this.stackedYData.length : 0; for (e = 1; e < a; e++) b.data[e].isSum || b.data[e].isIntermediateSum || (this.stackedYData[e] += this.stackedYData[e - 1]) }, getExtremes: function () { if (this.options.stacking) return m.prototype.getExtremes.apply(this, arguments) }
        }, {
            getClassName: function () {
                var b = n.prototype.getClassName.call(this); this.isSum ? b += " highcharts-sum" : this.isIntermediateSum && (b += " highcharts-intermediate-sum");
                return b
            }, isValid: function () { return v(this.y, !0) || this.isSum || this.isIntermediateSum }
        })
    })(x); (function (a) {
        var t = a.Series, v = a.seriesType, w = a.seriesTypes; v("polygon", "scatter", { marker: { enabled: !1, states: { hover: { enabled: !1 } } }, stickyTracking: !1, tooltip: { followPointer: !0, pointFormat: "" }, trackByArea: !0 }, {
            type: "polygon", getGraphPath: function () { for (var a = t.prototype.getGraphPath.call(this), m = a.length + 1; m--;) (m === a.length || "M" === a[m]) && 0 < m && a.splice(m, 0, "z"); return this.areaPath = a }, drawGraph: function () {
                this.options.fillColor =
                this.color; w.area.prototype.drawGraph.call(this)
            }, drawLegendSymbol: a.LegendSymbolMixin.drawRectangle, drawTracker: t.prototype.drawTracker, setStackedPoints: a.noop
        })
    })(x); (function (a) {
        var t = a.arrayMax, v = a.arrayMin, w = a.Axis, n = a.color, m = a.each, e = a.isNumber, k = a.noop, b = a.pick, c = a.pInt, l = a.Point, g = a.Series, d = a.seriesType, f = a.seriesTypes; d("bubble", "scatter", {
            dataLabels: { formatter: function () { return this.point.z }, inside: !0, verticalAlign: "middle" }, marker: {
                lineColor: null, lineWidth: 1, radius: null, states: { hover: { radiusPlus: 0 } },
                symbol: "circle"
            }, minSize: 8, maxSize: "20%", softThreshold: !1, states: { hover: { halo: { size: 5 } } }, tooltip: { pointFormat: "({point.x}, {point.y}), Size: {point.z}" }, turboThreshold: 0, zThreshold: 0, zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"], parallelArrays: ["x", "y", "z"], trackerGroups: ["group", "dataLabelsGroup"], specialGroup: "group", bubblePadding: !0, zoneAxis: "z", directTouch: !0, pointAttribs: function (a, c) {
                var d = b(this.options.marker.fillOpacity, .5); a = g.prototype.pointAttribs.call(this, a, c); 1 !== d && (a.fill = n(a.fill).setOpacity(d).get("rgba"));
                return a
            }, getRadii: function (b, a, c, d) { var f, e, h, g = this.zData, l = [], p = this.options, r = "width" !== p.sizeBy, q = p.zThreshold, k = a - b; e = 0; for (f = g.length; e < f; e++) h = g[e], p.sizeByAbsoluteValue && null !== h && (h = Math.abs(h - q), a = Math.max(a - q, Math.abs(b - q)), b = 0), null === h ? h = null : h < b ? h = c / 2 - 1 : (h = 0 < k ? (h - b) / k : .5, r && 0 <= h && (h = Math.sqrt(h)), h = Math.ceil(c + h * (d - c)) / 2), l.push(h); this.radii = l }, animate: function (b) {
                var a = this.options.animation; b || (m(this.points, function (b) {
                    var c = b.graphic, d; c && c.width && (d = {
                        x: c.x, y: c.y, width: c.width,
                        height: c.height
                    }, c.attr({ x: b.plotX, y: b.plotY, width: 1, height: 1 }), c.animate(d, a))
                }), this.animate = null)
            }, translate: function () { var b, c = this.data, d, g, l = this.radii; f.scatter.prototype.translate.call(this); for (b = c.length; b--;) d = c[b], g = l ? l[b] : 0, e(g) && g >= this.minPxSize / 2 ? (d.marker = a.extend(d.marker, { radius: g, width: 2 * g, height: 2 * g }), d.dlBox = { x: d.plotX - g, y: d.plotY - g, width: 2 * g, height: 2 * g }) : d.shapeArgs = d.plotY = d.dlBox = void 0 }, alignDataLabel: f.column.prototype.alignDataLabel, buildKDTree: k, applyZones: k
        }, {
            haloPath: function (b) {
                return l.prototype.haloPath.call(this,
                0 === b ? 0 : (this.marker ? this.marker.radius || 0 : 0) + b)
            }, ttBelow: !1
        }); w.prototype.beforePadding = function () {
            var a = this, d = this.len, f = this.chart, g = 0, l = d, k = this.isXAxis, n = k ? "xData" : "yData", w = this.min, x = {}, D = Math.min(f.plotWidth, f.plotHeight), z = Number.MAX_VALUE, E = -Number.MAX_VALUE, F = this.max - w, B = d / F, G = []; m(this.series, function (d) {
                var e = d.options; !d.bubblePadding || !d.visible && f.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, G.push(d), k && (m(["minSize", "maxSize"], function (b) {
                    var a = e[b], d = /%$/.test(a),
                    a = c(a); x[b] = d ? D * a / 100 : a
                }), d.minPxSize = x.minSize, d.maxPxSize = Math.max(x.maxSize, x.minSize), d = d.zData, d.length && (z = b(e.zMin, Math.min(z, Math.max(v(d), !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), E = b(e.zMax, Math.max(E, t(d))))))
            }); m(G, function (b) { var c = b[n], d = c.length, f; k && b.getRadii(z, E, b.minPxSize, b.maxPxSize); if (0 < F) for (; d--;) e(c[d]) && a.dataMin <= c[d] && c[d] <= a.dataMax && (f = b.radii[d], g = Math.min((c[d] - w) * B - f, g), l = Math.max((c[d] - w) * B + f, l)) }); G.length && 0 < F && !this.isLog && (l -= d, B *= (d + g - l) / d, m([["min",
            "userMin", g], ["max", "userMax", l]], function (c) { void 0 === b(a.options[c[0]], a[c[1]]) && (a[c[0]] += c[2] / B) }))
        }
    })(x); (function (a) {
        function t(b, a) {
            var c = this.chart, e = this.options.animation, d = this.group, f = this.markerGroup, h = this.xAxis.center, k = c.plotLeft, p = c.plotTop; c.polar ? c.renderer.isSVG && (!0 === e && (e = {}), a ? (b = { translateX: h[0] + k, translateY: h[1] + p, scaleX: .001, scaleY: .001 }, d.attr(b), f && f.attr(b)) : (b = { translateX: k, translateY: p, scaleX: 1, scaleY: 1 }, d.animate(b, e), f && f.animate(b, e), this.animate = null)) : b.call(this,
            a)
        } var v = a.each, w = a.pick, n = a.seriesTypes, m = a.wrap, e = a.Series.prototype, k = a.Pointer.prototype; e.searchPointByAngle = function (b) { var a = this.chart, e = this.xAxis.pane.center; return this.searchKDTree({ clientX: 180 + -180 / Math.PI * Math.atan2(b.chartX - e[0] - a.plotLeft, b.chartY - e[1] - a.plotTop) }) }; e.getConnectors = function (b, a, e, g) {
            var c, f, h, l, k, m, n, t; f = g ? 1 : 0; c = 0 <= a && a <= b.length - 1 ? a : 0 > a ? b.length - 1 + a : 0; a = 0 > c - 1 ? b.length - (1 + f) : c - 1; f = c + 1 > b.length - 1 ? f : c + 1; h = b[a]; f = b[f]; l = h.plotX; h = h.plotY; k = f.plotX; m = f.plotY; f = b[c].plotX;
            c = b[c].plotY; l = (1.5 * f + l) / 2.5; h = (1.5 * c + h) / 2.5; k = (1.5 * f + k) / 2.5; n = (1.5 * c + m) / 2.5; m = Math.sqrt(Math.pow(l - f, 2) + Math.pow(h - c, 2)); t = Math.sqrt(Math.pow(k - f, 2) + Math.pow(n - c, 2)); l = Math.atan2(h - c, l - f); n = Math.PI / 2 + (l + Math.atan2(n - c, k - f)) / 2; Math.abs(l - n) > Math.PI / 2 && (n -= Math.PI); l = f + Math.cos(n) * m; h = c + Math.sin(n) * m; k = f + Math.cos(Math.PI + n) * t; n = c + Math.sin(Math.PI + n) * t; f = { rightContX: k, rightContY: n, leftContX: l, leftContY: h, plotX: f, plotY: c }; e && (f.prevPointCont = this.getConnectors(b, a, !1, g)); return f
        }; m(e, "buildKDTree",
        function (b) { this.chart.polar && (this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.options.findNearestPointBy = "xy"); b.apply(this) }); e.toXY = function (b) { var a, e = this.chart, g = b.plotX; a = b.plotY; b.rectPlotX = g; b.rectPlotY = a; a = this.xAxis.postTranslate(b.plotX, this.yAxis.len - a); b.plotX = b.polarPlotX = a.x - e.plotLeft; b.plotY = b.polarPlotY = a.y - e.plotTop; this.kdByAngle ? (e = (g / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, 0 > e && (e += 360), b.clientX = e) : b.clientX = b.plotX }; n.spline && (m(n.spline.prototype,
        "getPointSpline", function (b, a, e, g) { this.chart.polar ? g ? (b = this.getConnectors(a, g, !0, this.connectEnds), b = ["C", b.prevPointCont.rightContX, b.prevPointCont.rightContY, b.leftContX, b.leftContY, b.plotX, b.plotY]) : b = ["M", e.plotX, e.plotY] : b = b.call(this, a, e, g); return b }), n.areasplinerange && (n.areasplinerange.prototype.getPointSpline = n.spline.prototype.getPointSpline)); m(e, "translate", function (b) {
            var a = this.chart; b.call(this); if (a.polar && (this.kdByAngle = a.tooltip && a.tooltip.shared, !this.preventPostTranslate)) for (b =
            this.points, a = b.length; a--;) this.toXY(b[a])
        }); m(e, "getGraphPath", function (b, a) { var c = this, e, d, f; if (this.chart.polar) { a = a || this.points; for (e = 0; e < a.length; e++) if (!a[e].isNull) { d = e; break } !1 !== this.options.connectEnds && void 0 !== d && (this.connectEnds = !0, a.splice(a.length, 0, a[d]), f = !0); v(a, function (b) { void 0 === b.polarPlotY && c.toXY(b) }) } e = b.apply(this, [].slice.call(arguments, 1)); f && a.pop(); return e }); m(e, "animate", t); n.column && (n = n.column.prototype, n.polarArc = function (b, a, e, g) {
            var c = this.xAxis.center, f = this.yAxis.len;
            return this.chart.renderer.symbols.arc(c[0], c[1], f - a, null, { start: e, end: g, innerR: f - w(b, f) })
        }, m(n, "animate", t), m(n, "translate", function (b) { var a = this.xAxis, e = a.startAngleRad, g, d, f; this.preventPostTranslate = !0; b.call(this); if (a.isRadial) for (g = this.points, f = g.length; f--;) d = g[f], b = d.barX + e, d.shapeType = "path", d.shapeArgs = { d: this.polarArc(d.yBottom, d.plotY, b, b + d.pointWidth) }, this.toXY(d), d.tooltipPos = [d.plotX, d.plotY], d.ttBelow = d.plotY > a.center[1] }), m(n, "alignDataLabel", function (a, c, l, g, d, f) {
            this.chart.polar ?
            (a = c.rectPlotX / Math.PI * 180, null === g.align && (g.align = 20 < a && 160 > a ? "left" : 200 < a && 340 > a ? "right" : "center"), null === g.verticalAlign && (g.verticalAlign = 45 > a || 315 < a ? "bottom" : 135 < a && 225 > a ? "top" : "middle"), e.alignDataLabel.call(this, c, l, g, d, f)) : a.call(this, c, l, g, d, f)
        })); m(k, "getCoordinates", function (a, c) {
            var b = this.chart, e = { xAxis: [], yAxis: [] }; b.polar ? v(b.axes, function (a) {
                var d = a.isXAxis, g = a.center, k = c.chartX - g[0] - b.plotLeft, g = c.chartY - g[1] - b.plotTop; e[d ? "xAxis" : "yAxis"].push({
                    axis: a, value: a.translate(d ? Math.PI -
                    Math.atan2(k, g) : Math.sqrt(Math.pow(k, 2) + Math.pow(g, 2)), !0)
                })
            }) : e = a.call(this, c); return e
        }); m(a.Chart.prototype, "getAxes", function (b) { this.pane || (this.pane = []); v(a.splat(this.options.pane), function (b) { new a.Pane(b, this) }, this); b.call(this) }); m(a.Chart.prototype, "drawChartBox", function (a) { a.call(this); v(this.pane, function (a) { a.render() }) }); m(a.Chart.prototype, "get", function (b, c) { return a.find(this.pane, function (a) { return a.options.id === c }) || b.call(this, c) })
    })(x)
});