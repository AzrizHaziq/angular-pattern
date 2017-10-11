(function(){
    'use strict';

    angular
        .module('app')
        .factory('countryService', countryService);

    countryService.$inject = [ '$http', '$q', 'CONFIG' ];

    function countryService($http, $q, CONFIG){
        var countriesProxy = CONFIG.ProxyAPIHost + "/countries";

        var country = {
            items : null,
            meta : {
                countryRetry : 0,
                isCountryLoading : false,
                isCountryError : false,
            }
        }

        return {
            sharedCountryService : country,
            getCountries : getCountries,
            getCountryName : getCountryName,
            searchCountries : searchCountries,
            getAssociatedKeyAndCountry : getAssociatedKeyAndCountry
        };

        function searchCountries($query){

            var deferred = $q.defer();

            var reg = new RegExp($query, 'i')

            var resolvedCountries = country.items.filter(function(item){
                return item.name.match(reg)
            })

            deferred.resolve(resolvedCountries);

            return deferred.promise;
        }

        function getCountries(){

            country.meta.isCountryLoading = true;

            var http = {
                method : 'GET',
                cache : true,
                url : countriesProxy
            }

            return $http(http)
                .then(successCallback)
                .catch(errorCallback)
                .finally(end)

            function successCallback(response){
                country.items = response.data
                country.meta.isCountryError = false
                return country.items
            }

            function errorCallback(err){
                country.meta.isCountryError = true

                country.meta.countryRetry++

                country.meta.countryRetry <= CONFIG.RETRY_MAX_TIME &&
                setTimeout(getCountries, CONFIG.RETRY_FAILED_TIMEOUT)

                return $q.reject(err);
            }

            function end(){
                country.meta.isCountryLoading = false
            }
        }

        function getCountryName(key){
            return country.items.find(function(item){
                return item.id.toUpperCase() === key.toUpperCase()
            }).name
        }

        function getAssociatedKeyAndCountry(keys){
            return keys.map(function(key){
                return {
                    id : key,
                    name : getCountryName(key)
                }
            })
        }
    }
})();
