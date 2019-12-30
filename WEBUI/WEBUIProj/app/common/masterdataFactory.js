
var dependencies = ['main', 'common/apiFactory'];
define(dependencies, function (app) {
    app.factory("masterdataFactory", function (apiFactory) {

        var getAccount = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "account/getall")
            .then(function (response) {
                return response;
            });
        };
        //Get country list for dropdown
        var getCountry = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "country/getall")
            .then(function (response) {
                return response;
            });
        };
        //Get region list for dropdown
        var getRegion = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "orgentity/getall")
            .then(function (response) {
                return response;
            });
        };


        //Get device list for dropdown
        var getDevice = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "device/getall")
            .then(function (response) {
                return response;
            });
        };

        //Get driver list for dropdown
        var getDriver = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "driver/getall")
            .then(function (response) {
                return response;
            });
        };

        ////Get zoneLoc list for dropdown
        //var getZoneLoc = function () {
        //    return apiFactory.httpGet(apiFactory.baseURL() + "orgentity/getallzone")
        //    .then(function (response) {
        //        return response;
        //    });
        //};

        //Get zoneLoc list for dropdown
        var getZones = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "orgentity/zone")
            .then(function (response) {
                return response;
            });
        };

        var getRegions = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "orgentity/region?uniqueid=" + uniqueid)
            .then(function (response) {
                return response;
            });
        };



        //Get Sims list for dropdown
        var getSims = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "sims/getall")
            .then(function (response) {
                return response;
            });
        };
        //Get Orgentitytype list for dropdown
        var getOrgentitytype = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "orgentitytype/getall")
            .then(function (response) {
                return response;
            });
        };

        //Get driver list for dropdown
        //var getDriver = function () {
        //    return apiFactory.httpGet(apiFactory.baseURL() + "driver/getall")
        //    .then(function (response) {
        //        return response;
        //    });
        //};

        //Get Vehlicle list for dropdown
        var getVehicle = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "vehicle/getall")
            .then(function (response) {
                return response;
            });
        };

        //Get Route list for dropdown
        var getRoute = function () {
            return apiFactory.httpGet(apiFactory.baseURL() + "route/getall")
            .then(function (response) {
                return response;
            });
        };


   



        //Get states list for dropdown
        var getStates = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "states/getall?uniqueid=" + uniqueid)
            .then(function (response) {
                return response;
            });
        };
        //Get cities list for dropdown
        var getCities = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "cities/getall?uniqueid=" + uniqueid)
            .then(function (response) {
                return response;
            });
        };

        //Get vehicle models list for dropdown
        var getVehicleModel = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "vehiclemodels/getall?uniqueid=" + uniqueid)
            .then(function (response) {
                return response;
            });
        };


        // get trips by user id
        var getTrip = function (uniqueid) {
            return apiFactory.httpGet(apiFactory.baseURL() + "vehicle/Trips?uniqueid=" + uniqueid)
            .then(function (response) {
                return response;
            });
        };
    
     
        ////Get zoneLoc list for dropdown
        //var getZoneLocation = function () {
        //    return apiFactory.httpGet(apiFactory.baseURL() + "orgentity/getall")
        //    .then(function (response) {
        //        return response;
        //    });
        //};
        return {
            getCountry: getCountry,
            getSims: getSims,
            getOrgentitytype: getOrgentitytype,
            getStates: getStates,
            getCities: getCities,
            getDriver: getDriver,
            getVehicle: getVehicle,
            getRoute: getRoute,
            getDevice: getDevice,
            getRegion: getRegion,
            getVehicleModel: getVehicleModel,
            getZones: getZones,
            getRegions: getRegions,
            getTrip: getTrip
           
        };

    });
});




