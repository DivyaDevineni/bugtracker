define([
  // 'ionic',
   //'angular-socket-io'

//'async!http://maps.google.com/maps/api/js?sensor=false!callback'

], function () {
    'use strict';

    angular.module('googleMap', [])
           .directive("mapBox", function () {
               return {
                   restrict: 'EA',
                   template: '<div id="map"></div>',
                   controllerAs: 'vm',
                   scope: {
                       id: "=?",
                       type: "=",
                       options: "=?",
                       update: "=?",
                       play: "=?",
                       pause: "=?",
                       stop: "=?",
                       sliderstep: "=?"
                   },
                   controller: function ($scope, $rootScope, $element) {
                       var vm = this;

                       $scope.update = $scope.update || false
                       $scope.map = ("map" + ($scope.id || Math.floor(Math.random() * 11))).trim();
                       $element.children().attr('id', $scope.map);

                       //helper functions

                       // === A method which returns a GLatLng of a point a given distance along the path ===
                       // === Returns null if the path is shorter than the specified distance ===
                       google.maps.Polyline.prototype.GetPointAtDistance = function (metres) {
                           // some awkward special cases
                           if (metres == 0) return this.getPath().getAt(0);
                           if (metres < 0) return null;
                           if (this.getPath().getLength() < 2) return null;
                           var dist = 0;
                           var olddist = 0;
                           for (var i = 1;
                             (i < this.getPath().getLength() && dist < metres) ; i++) {
                               olddist = dist;
                               dist += google.maps.geometry.spherical.computeDistanceBetween(this.getPath().getAt(i), this.getPath().getAt(i - 1));
                           }
                           if (dist < metres) {
                               return null;
                           }
                           var p1 = this.getPath().getAt(i - 2);
                           var p2 = this.getPath().getAt(i - 1);
                           var m = (metres - olddist) / (dist - olddist);
                           return new google.maps.LatLng(p1.lat() + (p2.lat() - p1.lat()) * m, p1.lng() + (p2.lng() - p1.lng()) * m);
                       }

                       // === A method which returns the Vertex number at a given distance along the path ===
                       // === Returns null if the path is shorter than the specified distance ===
                       google.maps.Polyline.prototype.GetIndexAtDistance = function (metres) {
                           // some awkward special cases
                           if (metres == 0) return this.getPath().getAt(0);
                           if (metres < 0) return null;
                           var dist = 0;
                           var olddist = 0;
                           for (var i = 1;
                             (i < this.getPath().getLength() && dist < metres) ; i++) {
                               olddist = dist;
                               dist += google.maps.geometry.spherical.computeDistanceBetween(this.getPath().getAt(i), this.getPath().getAt(i - 1));
                           }
                           if (dist < metres) {
                               return null;
                           }
                           return i;
                       }
                       // Multi Object Pointer 
                       function mapPlotter() {
                           this.mapEle = {}
                           this.map = null;
                           this.mapTypeId = "";
                           this.wayPoints = [];
                           this.zoomLevel = 0;
                           this.centerLatLong = {};
                           this.markerImage = {};
                           this.bounds = {};
                           this.strokeColor = '#0000FF';
                           this.strokeWeight = 2;
                           this.strokeOpacity = 1.0;
                           this.bounds = {};
                           this.panPath = [];
                           this.STEPS = 40;
                           this.markersList = [];
                           this.dupWayPoints = [];
                           this.start = [];
                           this.pause = [];
                           this.stop = [];
                           this.polyPath = null;
                           this.count = 0;
                           this.interval = null;
                           this.polyPathMarker = null;
                           this.voilationpoints = [];
                           this.routepoints = [];
                           this.knownstopslist = []; // newly added for known points
                           //this.addMarkers = [];// newly added for known points
                           //this.actualMarkers = [];// newly added for known points

                       }

                       // Multi object pointer initialization

                       mapPlotter.prototype.init = function () {
                           // alert("inside google and " + this.zoomLevel);
                           this.map = new google.maps.Map(this.mapEle, {
                               zoom: this.zoomLevel,
                               center: this.centerLatLong,
                               mapTypeId: this.mapTypeId
                           });

                           this.bounds = new google.maps.LatLngBounds();

                       }


                       // creating marker images ratation

                       mapPlotter.prototype.createAndRotateMarkers = function (url, deg, marker) {

                           var canvas = document.createElement("canvas");
                           canvas.width = 32;
                           canvas.height = 32;
                           var ctx = canvas.getContext("2d");
                           deg = (deg > 90) ? deg - 90 : 360 - deg;
                           //if radians can pass directly
                           var angle = deg && (deg > 0 || deg < 0) ? (deg * Math.PI / 180) :
                               deg;

                           //var angle = deg ? (deg * Math.PI / 180)-30 :  // icon tilt should be minus if tilt is greater than 0
                           //      180,
                           var centerX = canvas.width / 2;
                           var centerY = canvas.height / 2;

                           ctx.clearRect(0, 0, canvas.width, canvas.height);
                           ctx.save();
                           ctx.translate(centerX, centerY);
                           ctx.rotate(angle);
                           ctx.translate(-centerX, -centerY);
                           var img = new Image();
                           img.src = url;
                           img.onload = function () {
                               ctx.drawImage(img, 0, 0);
                               ctx.restore();
                               marker.setOptions({
                                   icon: canvas.toDataURL('image/png')
                               })
                           }

                       }

                       mapPlotter.prototype.updateMarkerPosition = function (url, deg, marker, speed, _latLong) {

                           var canvas = document.createElement("canvas");
                           canvas.width = 32;
                           canvas.height = 32;
                           var ctx = canvas.getContext("2d");


                           //**************************************************//
                           var lat2 = _latLong.lat();
                           var lon2 = _latLong.lng();

                           var lat1 = marker.position.lat();
                           var lon1 = marker.position.lng();

                           //var angle3 = this.calBearing(lat1, lon1, lat2, lon2);

                           var dLat1 = this.toRad(lat2 - lat1);
                           var dLon1 = this.toRad(lon2 - lon1);

                           lat1 = this.toRad(lat1);
                           lat2 = this.toRad(lat2);

                           var y = Math.sin(dLon1) * Math.cos(lat2);
                           var x = Math.cos(lat1) * Math.sin(lat2) -
                                   Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon1);
                           var brng = this.toDeg(Math.atan2(y, x));

                           //// fix negative degrees
                           if (brng < 0) {
                               brng = 360 - Math.abs(brng);
                           }

                           brng = this.toRad(brng - 90);

                           //tilt is greater than 0
                           //      180,
                           var centerX = canvas.width / 2;
                           var centerY = canvas.height / 2;

                           // brng = (brng > 90) ? brng - 90 : 360 - brng;
                           //if radians can pass directly
                           var angle1 = brng && (brng > 0 || brng < 0) ? (brng * Math.PI / 180) :
                               brng;


                           ctx.clearRect(0, 0, canvas.width, canvas.height);
                           ctx.save();
                           ctx.translate(centerX, centerY);
                           ctx.rotate(brng);
                           ctx.translate(-centerX, -centerY);

                           var img = new Image();
                           img.src = url;
                           img.onload = function () {
                               ctx.drawImage(img, 0, 0);
                               ctx.restore();
                               marker.setOptions({
                                   icon: canvas.toDataURL('image/png')
                               })
                           }

                           if (typeof (_latLong) == 'undefined')
                               return;
                           var numDeltas = 100;
                           var delay = 10; //milliseconds
                           var i = 0;
                           var deltaLat;
                           var deltaLng;

                           i = 0;
                           deltaLat = (_latLong.lat() - marker.position.lat()) / numDeltas;
                           deltaLng = (_latLong.lng() - marker.position.lng()) / numDeltas;

                           var lat = marker.position.lat();
                           var lng = marker.position.lng();

                           function moveMarker() {
                               lat += deltaLat;
                               lng += deltaLng;
                               var latlng = new google.maps.LatLng(lat, lng);
                               marker.setPosition(latlng);
                               if (i != numDeltas) {
                                   i++;
                                   setTimeout(moveMarker, delay);
                               }
                           }

                           moveMarker();

                       }



                       //get marker images 
                       mapPlotter.prototype.getMarkerImage = function (type) {
                           //0-no violation-green, 1-overspeed-red ,2-unknownstop-blue, 3-fueleconomy-black, 4-routeviolation-orange
                           var _image = "";
                           //path : '../www/images/green_32x32.png';
                           //debugger;
                           _image = '../../css/img/green.png';
                           //debugger;
                           switch (type) {
                               case 0:
                                   _image = '../../css/img/green.png';
                                   break;
                               case 1:
                                   _image = '../../css/img/red.png';
                                   break;
                               case 2:
                                   _image = '../../css/img/grey.png';
                                   break;
                               case 3:
                                   _image = '../../css/img/black.png';
                                   break;
                               case 4:
                                   _image = '../../css/img/orange.png';
                                   break;
                               case -1:
                                   _image = '../../css/img/grey.png';
                                   break;

                           }

                           return _image;

                       }

                       // marker bouncing animation

                       mapPlotter.prototype._animateBounce = function toggleBounce() {
                           var _this = this;
                           var _infoWindow = new google.maps.InfoWindow();
                           if (_this.getAnimation() !== null) {
                               _this.setAnimation(null);
                           } else {
                               _this.setAnimation(google.maps.Animation.BOUNCE);
                           }



                           if (this._title && this._title != "" && typeof _this._title != "undefined") {
                               //debugger;
                               _infoWindow.setContent(_this._title);
                               _infoWindow.open(_this.map, this);
                           }

                           setTimeout(function () {

                               _this.setAnimation(null);

                           }, 500)

                           setTimeout(function () {
                               if (_infoWindow) { _infoWindow.close(); }

                           }, 2400)

                       }

                       // Ploting markers

                       mapPlotter.prototype.plotObjects = function () {
                           var _this = this;
                           var shape = {
                               coords: [1, 1, 1, 20, 18, 20, 18, 1],
                               type: 'poly'
                           };

                           _this.wayPoints.forEach(function (objectPoint, index, arr) {
                               _this.bounds.extend(objectPoint);
                               var _marker = new google.maps.Marker({
                                   map: _this.map,
                                   // draggable: true,
                                   animation: google.maps.Animation.DROP,
                                   position: objectPoint,
                                   title: objectPoint.markerTitle || "",
                                   // shape:shape,
                                   //icon: _this.markerImage
                               });
                               _marker._title = objectPoint.infoWindowText;
                               _marker.markerId = objectPoint.vehicle;
                               _marker.violationtype = objectPoint.violationtype;
                               _marker.degrees = objectPoint.degrees;
                               _this.createAndRotateMarkers(_this.getMarkerImage(objectPoint.violationtype || 0), _marker.degrees || 0, _marker);
                               _marker.addListener('click', _this._animateBounce);
                               _this.markersList.push(_marker);
                           });


                           // make sure to load once after marker creation
                           var boundsListener = google.maps.event.addListener((_this.map), 'bounds_changed', function (event) {
                               this.setZoom(this.zoom);
                               google.maps.event.removeListener(boundsListener);
                           });

                           this.map.fitBounds(this.bounds);
                       }


                       // drawing trip path

                       mapPlotter.prototype.drawTrip = function () {
                           if (this.wayPoints.length > 0) {
                               this.createStartStopMarkers();
                               this.polyPath = new google.maps.Polyline({
                                   path: this.wayPoints,
                                   geodesic: true,
                                   strokeColor: this.strokeColor,
                                   strokeOpacity: this.strokeOpacity,
                                   strokeWeight: this.strokeWeight
                               });
                               this.polyPath.setMap(this.map);
                           }
                           else if (this.wayPoints.length == 0 && this.polyPath != null) {
                               this.polyPath.setMap(null);
                               for (var markerIndex in this.markersList) {
                                   this.markersList[markerIndex].setMap(null);
                               }

                           }



                       }


                       // drawing trip path

                       mapPlotter.prototype.drawRoutePath = function () {
                           var _this = this;
                           if (this.routepoints.length > 0) {
                               var shape = {
                                   coords: [1, 1, 1, 20, 18, 20, 18, 1],
                                   type: 'poly'
                               };

                               var _latLong = new google.maps.LatLng(this.routepoints[0].lat, this.routepoints[0].lng);
                               var _startMarker = new google.maps.Marker({
                                   map: this.map,
                                   // draggable: true,
                                   animation: google.maps.Animation.DROP,
                                   position: _latLong,
                                   title: this.routepoints[0]["markerTitle"] ? this.routepoints[0].markerTitle : "",
                                   //shape: shape
                                   //icon: this.markerImage
                               });


                               addAllMarkers(this.knownstopslist, this.map); // Calling known stops markers
                               this.bounds.extend(_latLong);




                               // addAllMarkers(this.knownstopslist); // Calling known stops markers


                               _startMarker._title = this.routepoints[0].infoWindowText;
                               _startMarker.addListener('click', this._animateBounce);

                               var _latLong2 = new google.maps.LatLng(this.routepoints[this.routepoints.length - 1].lat, this.routepoints[this.routepoints.length - 1].lng);

                               var _stopMarker = new google.maps.Marker({
                                   map: this.map,
                                   // draggable: true,
                                   animation: google.maps.Animation.DROP,
                                   position: _latLong2,
                                   title: this.routepoints[this.routepoints.length - 1].markerTitle,
                                   //shape: shape,
                                   //icon: this.markerImage
                               });

                               this.bounds.extend(_latLong2);

                               _stopMarker._title = this.routepoints[this.routepoints.length - 1].infoWindowText;
                               _stopMarker.addListener('click', this._animateBounce);

                               this.map.fitBounds(this.bounds);
                           }

                           //addAllMarkers(this.knownstopslist); // Calling known stops markers
                           // adding knownstop markers to map -----------------------
                           //var addMarkers = [];
                           //var actualMarkers = [];

                           function addAllMarkers(arr, pmap) {
                               var _this = this;
                               for (var i = 0; i < arr.length; i++) {
                                   var location = new google.maps.LatLng(arr[i].lat, arr[i].lng);
                                   var mm = new google.maps.Marker({
                                       map: pmap,
                                       position: location,
                                       label: { text: arr[i].name, color: "#00ff00", fontWeight: "bold" },// newly added
                                       title: arr[i].name,
                                       draggable: true
                                   });
                                   //this.bounds.extend(location);
                                   var addMarkers = [];
                                   var actualMarkers = [];

                                   mm.metadata = { type: "marker", id: addMarkers.length + 1 };
                                   var m = {
                                   };

                                   m.lat = location.lat();
                                   m.lng = location.lng();
                                   mm.id = m.id = addMarkers.length + 1;
                                   actualMarkers.push(mm);
                                   addMarkers.push(m);
                                   google.maps.event.addListener(mm, 'dragend', function (marker, b, c) {
                                       var _this = this;
                                       changeDesc(_this.metadata.id, marker.latLng.lat(), marker.latLng.lng());
                                   })
                                   console.log(addMarkers);


                               }
                           }




                           //---------------------------------------------------------

                           //for route path color-----
                           this.polyPath = new google.maps.Polyline({
                               path: this.routepoints,
                               geodesic: true,
                               strokeColor: '#FFFF00',
                               strokeOpacity: 0.5,
                               strokeWeight: 8
                           });
                           this.polyPath.setMap(this.map);


                           if (_this.wayPoints.length > 0) {
                               var _devicePoly = new google.maps.Polyline({
                                   path: _this.wayPoints,
                                   map: _this.map
                               });
                               _devicePoly.setMap(this.map);
                               // var bounds = new google.maps.LatLngBounds();
                               for (var i = 0; i < _devicePoly.getPath().getLength() ; i++) {
                                   var _position = _devicePoly.getPath().getAt(i);
                                   _this.bounds.extend(_position);
                               }
                               _this.map.fitBounds(_this.bounds);

                           }

                       }


                       // cteating start and end markers

                       mapPlotter.prototype.createStartStopMarkers = function () {
                           var shape = {
                               coords: [1, 1, 1, 20, 18, 20, 18, 1],
                               type: 'poly'
                           };

                           var _latLong = new google.maps.LatLng(this.wayPoints[0].lat, this.wayPoints[0].lng);
                           var _startMarker = new google.maps.Marker({
                               map: this.map,
                               // draggable: true,
                               animation: google.maps.Animation.DROP,
                               position: _latLong,
                               title: this.wayPoints[0]["markerTitle"] ? this.wayPoints[0].markerTitle : "",
                               //shape: shape
                               //icon: this.markerImage
                           });

                           this.bounds.extend(_latLong);
                           this.markersList.push(_startMarker);

                           _startMarker._title = this.wayPoints[0].infoWindowText;
                           _startMarker.addListener('click', this._animateBounce);

                           var _latLong2 = new google.maps.LatLng(this.wayPoints[this.wayPoints.length - 1].lat, this.wayPoints[this.wayPoints.length - 1].lng);

                           var _stopMarker = new google.maps.Marker({
                               map: this.map,
                               // draggable: true,
                               animation: google.maps.Animation.DROP,
                               position: _latLong2,
                               title: this.wayPoints[this.wayPoints.length - 1].markerTitle,
                               //shape: shape,
                               //icon: this.markerImage
                           });

                           this.bounds.extend(_latLong2);
                           this.markersList.push(_stopMarker);
                           _stopMarker._title = this.wayPoints[this.wayPoints.length - 1].infoWindowText;
                           _stopMarker.addListener('click', this._animateBounce);

                           this.map.fitBounds(this.bounds);


                       }

                       // calculate distance between two points

                       mapPlotter.prototype.calDistance = function (lat1, lon1, lat2, lon2) {
                           var R = 6371; // km
                           var dLat = this.toRad(lat2 - lat1);
                           var dLon = this.toRad(lon2 - lon1);
                           var lat1 = this.toRad(lat1);
                           var lat2 = this.toRad(lat2);

                           var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                             Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
                           var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                           var d = R * c;
                           return d;
                       }
                       // Converts numeric degrees to radians
                       mapPlotter.prototype.toRad = function (Value) {
                           return Value * Math.PI / 180;
                       }


                       // Converts radians  to degrees 
                       mapPlotter.prototype.toDeg = function (Value) {
                           return Value * (180 / Math.PI);
                       }

                       // calculate bearing (azimuth angle)

                       mapPlotter.prototype.calBearing = function (startLat, startLong, endLat, endLong) {
                           startLat = this.toRad(startLat);
                           startLong = this.toRad(startLong);
                           endLat = this.toRad(endLat);
                           endLong = this.toRad(endLong);

                           var dLong = endLong - startLong;

                           var dPhi = Math.log(Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0));
                           if (Math.abs(dLong) > Math.PI) {
                               if (dLong > 0.0)
                                   dLong = -(2.0 * Math.PI - dLong);
                               else
                                   dLong = (2.0 * Math.PI + dLong);
                           }

                           return (this.toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
                       }



                       // getting destination latlong

                       mapPlotter.prototype.getDestLatLong = function (lat, lng, azimuth, distance) {

                           var lat1 = this.toRad(lat),
                             lon1 = this.toRad(lng),
                             R = 6378.1, //Radius of the Earth in km
                             brng = this.toRad(azimuth), // Bearing is degrees converted to radians.
                           d = distance, // Distance m converted to km
                             lat2 = Math.asin(Math.sin(lat1) * Math.cos(d / R) + Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)),
                         lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1), Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2));


                           lat2 = this.toDeg(lat2);
                           lon2 = this.toDeg(lon2);
                           return [lat2, lon2];

                       }

                       // do Pan To

                       mapPlotter.prototype.panTo = function () {
                           // debugger;
                           var _this = this,
                          _newPoint = _this.wayPoints.shift(),
                          panPath = [];

                           panPath.push([_newPoint.lat, _newPoint.lng]);
                           if (_this.wayPoints.length == 0) {

                               setTimeout(function () {
                                   _this._smoothPanTo(panPath);
                               }, 20);
                               return;
                           }

                           var _latLong,
                            lat = _newPoint.lat,
                            lng = _newPoint.lng,
                            curLat = _this.wayPoints[0].lat,
                            curLng = _this.wayPoints[0].lng,
                            distance = _this.calDistance(lat, lng, curLat, curLng),
                            azimuth = this.calBearing(lat, lng, curLat, curLng),
                           _dis = distance / _this.STEPS;

                           for (var i = 0; i < _this.STEPS; i++) {
                               var _idis = _dis + _dis * i;
                               var desPoints = _this.getDestLatLong(lat, lng, azimuth, _idis);
                               var _lat = desPoints[0], _lang = desPoints[1];
                               panPath.push([_lat, _lang]);
                           }

                           setTimeout(function () {
                               _this._smoothPanTo(panPath);
                           }, 20);
                       }

                       // smoothing pan
                       mapPlotter.prototype._smoothPanTo = function (panPath) {
                           var _this = this;
                           // debugger;

                           var next = panPath.shift();

                           if (!_this.play && _this.pause && !_this.stop && next != null) {
                               var _latLong = new google.maps.LatLng(next[0], next[1]);
                               _this.marker.setPosition(_latLong);
                               _this.map.panTo(_latLong);
                               return;
                           }
                           else if (!_this.play && _this.pause && !_this.stop && next == null) {
                               next = _this.wayPoints.shift();
                               var _latLong = new google.maps.LatLng(next.lat, next.lng);
                               _this.marker.setPosition(_latLong);
                               _this.map.panTo(_latLong);
                               return;
                           }
                           else if (_this.stop) {
                               _this.waypoints = _this.dupWayPoints;
                               next = _this.wayPoints[0];
                               var _latLong = new google.maps.LatLng(next.lat, next.lng);
                               _this.marker.setPosition(_latLong);
                               _this.map.panTo(_latLong);
                               return;
                           }

                           if (next != null) {
                               // Continue our current pan action
                               var _latLong = new google.maps.LatLng(next[0], next[1]);
                               _this.marker.setPosition(_latLong);
                               _this.map.panTo(_latLong);

                               //_this.map.fitBounds(_this.bounds);
                               //_this.map.setZoom(_this.zoomLevel);
                               setTimeout(function () {
                                   _this._smoothPanTo(panPath);
                               }, 500);
                           } else {
                               // We are finished with this pan - check if there are any queue'd up locations to pan to 

                               if (_this.wayPoints.length > 0) {
                                   _this.panTo();
                               } else {
                                   _this.map.setZoom(_this.zoomLevel);
                               }
                           }
                       }






                       // update markers with out refreshiing map

                       mapPlotter.prototype.updateMarkers = function () {
                           var _this = this;
                           _this.markersList.forEach(function (marker, index, arr) {
                               var _matchedMarkers = _this.wayPoints.filter(function (waypoint, index, arr) {

                                   return marker.markerId == waypoint.vehicle
                               });
                               // debugger;
                               if (_matchedMarkers.length == 0) {
                                   marker.setVisible(false);
                               }

                           });

                           _this.wayPoints.forEach(function (waypoint, index, arr) {
                               var _latLong = new google.maps.LatLng(waypoint.lat, waypoint.lng);
                               var _matchedMarkers = _this.markersList.filter(function (marker, index, arr) {
                                   return marker.markerId == waypoint.vehicle;
                               });
                               if (_matchedMarkers.length > 0 && !isNaN(_latLong.lat()) && !isNaN(_latLong.lng())) {
                                   //  debugger;
                                   if (!_matchedMarkers[0].getPosition().equals(_latLong)) {
                                       _this.bounds.extend(_latLong);
                                       //_matchedMarkers[0].setPosition(_latLong);

                                       var directionsService = new google.maps.DirectionsService();

                                       var request = {
                                           origin: new google.maps.LatLng(_latLong.lat(), _latLong.lng()),
                                           destination: new google.maps.LatLng(_latLong.lat(), _latLong.lng()),
                                           travelMode: google.maps.DirectionsTravelMode.DRIVING,
                                       };
                                       //notusing
                                       directionsService.route(request, function (response, status) {
                                           if (status == google.maps.DirectionsStatus.OK) {
                                               _this.updateMarkerPosition(_this.getMarkerImage(waypoint.violationtype || 0), waypoint.degrees || 0, _matchedMarkers[0], 0, response.routes[0].overview_path[0]);

                                           }
                                           else {
                                               _this.updateMarkerPosition(_this.getMarkerImage(waypoint.violationtype || 0), waypoint.degrees || 0, _matchedMarkers[0], 0, _latLong);
                                           }

                                           _this.map.panTo(_latLong);
                                       });




                                   }
                                   _matchedMarkers[0].setVisible(true);
                                   _matchedMarkers[0].violationtype = waypoint.violationtype;
                                   _matchedMarkers[0].degrees = waypoint.degrees;


                                   _matchedMarkers[0]._title = waypoint.infoWindowText;

                                   if (_this.wayPoints.length == 1) {
                                       // _this.map.setCenter(_latLong);
                                   }

                               }
                               else if (!isNaN(_latLong.lat()) && !isNaN(_latLong.lng())) {

                                   _this.bounds.extend(_latLong);
                                   var _marker = new google.maps.Marker({
                                       map: _this.map,
                                       // draggable: true,
                                       animation: google.maps.Animation.DROP,
                                       position: _latLong,
                                       title: waypoint.markerTitle || "",
                                       // shape:shape,
                                       //icon: _this.markerImage
                                   });
                                   //_this.bounds.extend(position);
                                   _marker._title = waypoint.infoWindowText;
                                   _marker.markerId = waypoint.vehicle;
                                   _marker.violationtype = waypoint.violationtype;
                                   _marker.degrees = waypoint.degrees;

                                   _marker.addListener('click', _this._animateBounce);

                                   _this.createAndRotateMarkers(_this.getMarkerImage(waypoint.violationtype || 0), waypoint.degrees || 0, _marker);
                                   _this.markersList.push(_marker);
                                   _this.map.fitBounds(_this.bounds);
                               }

                           })
                           if (_this.wayPoints.length == 1) {

                               this.map.setZoom(17);
                           }
                           else {
                               this.map.setZoom(this.zoomLevel);
                               this.map.fitBounds(this.bounds);
                           }




                       }


                       mapPlotter.prototype.createVoilationMarkers = function () {
                           var _this = this;
                           _this.markersList.forEach(function (marker, index, arr) {

                               marker.setMap(null);
                           });

                           _this.voilationpoints.forEach(function (waypoint, index, arr) {
                               var _latLong = new google.maps.LatLng(waypoint.lat, waypoint.lng);

                               _this.bounds.extend(_latLong);
                               var _marker = new google.maps.Marker({
                                   map: _this.map,
                                   // draggable: true,
                                   animation: google.maps.Animation.DROP,
                                   position: _latLong,
                                   title: waypoint.markerTitle || "",
                                   // shape:shape,
                                   icon: '../../css/img/red_flag_32x32.png'// icon:'../../imgages'
                               });
                               //_this.bounds.extend(position);
                               _marker._title = waypoint.infoWindowText;

                               _marker.addListener('click', _this._animateBounce);
                               _this.markersList.push(_marker);
                               // _this.map.fitBounds(_this.bounds);


                           })

                           // this.map.setZoom(this.zoomLevel);
                           this.map.fitBounds(this.bounds);




                       }


                       mapPlotter.prototype.moveObjects = function () {
                           var _this = this;


                           var shape = {
                               coords: [1, 1, 1, 20, 18, 20, 18, 1],
                               type: 'poly'
                           };

                           var _latLong = new google.maps.LatLng(_this.wayPoints[0].lat, _this.wayPoints[0].lng);
                           _this.bounds.extend(_this.wayPoints[0]);
                           _this.marker = new google.maps.Marker({
                               map: _this.map,
                               draggable: true,
                               animation: google.maps.Animation.DROP,
                               position: _this.wayPoints[0],
                               title: _this.wayPoints[0].markerTitle,
                               shape: shape,
                               //icon: _this.markerImage
                           });
                           _this.marker._title = _this.wayPoints[0].infoWindowText;

                           _this.marker.addListener('click', _this._animateBounce);




                           // make sure to load once after marker creation
                           var boundsListener = google.maps.event.addListener((_this.map), 'bounds_changed', function (event) {
                               this.setZoom(_this.zoomLevel);
                               google.maps.event.removeListener(boundsListener);
                           });

                           _this.panTo();

                           _this.map.fitBounds(_this.bounds);
                       }


                       mapPlotter.prototype.playMoveAnimation = function () {
                           var _this = this;

                           var lineSymbol = {
                               //path: google.maps.SymbolPath.CIRCLE,
                               path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                               //scale: 8,
                               scale: 7,
                               strokeColor: '#393',
                               strokeWeight: 8
                           };

                           if (_this.polyPathMarker == null) {
                               _this.polyPathMarker = new google.maps.Polyline({
                                   path: _this.wayPoints,
                                   icons: [
                                     {
                                         icon: lineSymbol,
                                         offset: '0'
                                     }
                                   ],
                                   map: _this.map
                               });
                               var bounds = new google.maps.LatLngBounds();
                               for (var i = 0; i < _this.polyPathMarker.getPath().getLength() ; i++) {
                                   var _position = _this.polyPathMarker.getPath().getAt(i);
                                   bounds.extend(_position);
                               }
                               _this.map.fitBounds(bounds);

                           }

                           //Map boundaries

                           _this.interval = window.setInterval(function () {
                               _this.count = (_this.count + (1)) % 200;
                               if (typeof $scope.sliderstep != "undefined") {
                                   $scope.sliderstep = _this.count;
                                   $scope.$apply();
                               }
                               var icons = _this.polyPathMarker.get('icons');
                               icons[0].offset = (_this.count / 2) + '%';
                               _this.polyPathMarker.set('icons', icons);
                               if (_this.count >= 199) { //|| i >= _this.wayPoints.length -1
                                   $scope.play = false;
                                   $scope.pause = false;
                                   $scope.stop = true;
                                   $scope.$apply();
                                   _this.stopMoveAnimation();
                                   //  line1.setMap(null);
                               };

                           }, 200);

                       }




                       mapPlotter.prototype.pauseMoveAnimation = function () {
                           var _this = this;
                           clearTimeout(_this.interval);
                       }


                       mapPlotter.prototype.stopMoveAnimation = function () {
                           var _this = this;
                           clearTimeout(_this.interval);
                           if (_this.polyPathMarker != null) {
                               _this.polyPathMarker.setMap(null);
                               _this.polyPathMarker = null;
                               _this.count = 0;
                           }

                       }

                       // Initialization starting from here :)

                       var objectsPlotter = new mapPlotter();



                       objectsPlotter.mapEle = document.getElementById($scope.map);
                       objectsPlotter.mapTypeId = $scope.options.mapTypeId || 'roadmap';
                       objectsPlotter.wayPoints = angular.copy($scope.options.waypoints) || [];
                       objectsPlotter.zoomLevel = $scope.options.zoomLevel || 13;
                       objectsPlotter.play = $scope.play || false;
                       objectsPlotter.pause = $scope.pause || false;
                       objectsPlotter.stop = $scope.stop || false;
                       objectsPlotter.centerLatLong = {
                           lat: 0,
                           lng: -180
                       };
                       /* objectsPlotter.markerImage = {
                         url: 'https://cdn2.iconfinder.com/data/icons/app-types-in-grey/512/airplane_512pxGREY.png',
                         size: new google.maps.Size(20, 32),
                         origin: new google.maps.Point(0, 0),
                         anchor: new google.maps.Point(6, 22),
                         scaledSize: new google.maps.Size(20, 32)
                       }; */
                       objectsPlotter.init();

                       switch ($scope.type) {
                           case "path":


                               $scope.$watch("options.waypoints", function (newVal, old) {
                                   // debugger;
                                   if ($scope.options.waypoints.length > 0 && (objectsPlotter.map == null || objectsPlotter.polyPath == null)) {
                                       objectsPlotter.init();
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.drawTrip();

                                   }
                                   else if ($scope.options.waypoints.length > 0 && $scope.update) {
                                       objectsPlotter.init();
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.polyPath.setMap(null);
                                       objectsPlotter.drawTrip();
                                   }
                                   else {

                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.drawTrip();
                                   }

                               });

                               break;
                           case "multiple":

                               $scope.$watch("options.waypoints", function (newVal, old) {
                                   // debugger;
                                   if ($scope.options.waypoints.length > 0 && objectsPlotter.map == null) {
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.plotObjects();

                                   }
                                   else if ($scope.options.waypoints.length > 0 && $scope.update) {
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.updateMarkers();
                                       //$scope.update = false
                                   }

                               });

                               break;
                           case "move":
                               if ($scope.options.waypoints.length == 0) {
                                   console.error("No way Points Found.");
                                   return;

                               }
                               objectsPlotter.moveObjects();
                               break;
                           case "playPause":
                               if ($scope.options.waypoints.length == 0) {
                                   // console.error("No way Points Found.");
                                   // return;

                               }
                               $scope.$watch("options.waypoints", function (newVal, old) {
                                   // debugger;
                                   if ($scope.options.waypoints.length > 0 && (objectsPlotter.map == null || objectsPlotter.polyPath == null)) {
                                       objectsPlotter.init();
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.voilationpoints = $scope.options.voilationpoints;
                                       objectsPlotter.routepoints = $scope.options.routepoints;
                                       //alert("route points: " + $scope.options.routepoints.lat);
                                       objectsPlotter.knownstopslist = $scope.options.knownstopslist;// newly added
                                       objectsPlotter.drawRoutePath();
                                       objectsPlotter.createVoilationMarkers();

                                   }
                                   else if ($scope.options.waypoints.length > 0 && $scope.update) {
                                       objectsPlotter.init();
                                       objectsPlotter.wayPoints = $scope.options.waypoints;
                                       objectsPlotter.voilationpoints = $scope.options.voilationpoints;
                                       objectsPlotter.knownstopslist = $scope.options.knownstopslist;// newly added
                                       objectsPlotter.routepoints = $scope.options.routepoints;
                                       objectsPlotter.drawRoutePath();
                                       objectsPlotter.createVoilationMarkers();
                                   }
                                   else if ($scope.options.waypoints.length == 0 && $scope.update) {

                                       objectsPlotter.init();
                                   }

                               });
                               // objectsPlotter.moveObjects();
                               $scope.$watch("play", function (old, newVal) {

                                   if ($scope.play && !$scope.pause && !$scope.stop) {
                                       objectsPlotter.play = $scope.play;
                                       objectsPlotter.pause = $scope.pause;
                                       objectsPlotter.stop = $scope.stop;
                                       objectsPlotter.playMoveAnimation();

                                   }
                               });
                               $scope.$watch("pause", function (old, newVal) {

                                   if (!$scope.play && $scope.pause && !$scope.stop) {
                                       objectsPlotter.play = $scope.play;
                                       objectsPlotter.pause = $scope.pause;
                                       objectsPlotter.stop = $scope.stop;
                                       objectsPlotter.pauseMoveAnimation();
                                   }
                               });
                               $scope.$watch("stop", function (old, newVal) {

                                   if (!$scope.play && !$scope.pause && $scope.stop) {
                                       objectsPlotter.play = $scope.play;
                                       objectsPlotter.pause = $scope.pause;
                                       objectsPlotter.stop = $scope.stop;

                                       objectsPlotter.stopMoveAnimation();
                                   }
                               });


                               $scope.$watch('sliderstep', function () {
                                   if ($scope.sliderstep && $scope.sliderstep != objectsPlotter.count) {
                                       objectsPlotter.count = $scope.sliderstep;
                                   }

                               })
                               break;

                       }




                   }
               }


           });


}, function (err) {
    window.location = 'ErrorPage.html';
});