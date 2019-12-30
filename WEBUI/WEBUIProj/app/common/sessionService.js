var dependencies = ['main', '../../vendor/angular/angular-cookies.min'];
define(dependencies, function (app) {
    app.factory("sessionService", function ($cookies) {
        var token = undefined;
        var email = undefined;
        var name = undefined;
        var isAdmin = false;
        var isSuperAdmin = false;
        var profile = null;
        var accountid = '';

        var getToken = function () {
            sessionStorage.getItem('token');
        };

        var getProfile = function () {
            var i = sessionStorage.getItem('profile');
            if (i)
                return JSON.parse(i);
            else
                return null;
        };

        var setToken = function (token) {
            return sessionStorage.setItem('token', token);
        };

        var setProfile = function (profile) {
            sessionStorage.setItem('profile', JSON.stringify(profile));
        };



        return {
            getToken: getToken,
            setToken: setToken,
            getProfile: getProfile,
            setProfile: setProfile
        };

    });
});
