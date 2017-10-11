(function(){
    'use strict';

    angular
        .module('app')
        .factory('languageService', languageService);

    languageService.$inject = [ '$timeout', '$q' ];

    function languageService($timeout, $q){

        var languages = {
            items : [],
            meta : {
                languagesRetry : 0,
                isLanguagesLoading : false,
                isLanguagesError : false
            }
        }

        var lang = [
            { name : "Arabic", id : "AR" },
            { name : "Chinese", id : "ZH" },
            { name : "Dutch", id : "NL" },
            { name : "English", id : "EN" },
            { name : "French", id : "FR" },
            { name : "German", id : "DE" },
            { name : "Italian", id : "IT" },
            { name : "Japanese", id : "JA" },
            { name : "Russian", id : "RU" },
            { name : "Spanish", id : "ES" },
            { name : "Portuguese", id : "PT" },
            { name : "Turkish", id : "TR" }
        ]

        return {
            sharedLanguageService : languages,
            getLanguages : getLanguages,
            getLanguageName : getLanguageName,
            searchLanguages : searchLanguages,
            getAssociatedKeyAndLanguage : getAssociatedKeyAndLanguage,
        };

        function searchLanguages($query){

            var deferred = $q.defer();

            var reg = new RegExp($query, 'i')

            var resolveLanguages = languages.items.filter(function(item){
                return item.name.match(reg)
            })

            deferred.resolve(resolveLanguages);

            return deferred.promise;
        }

        function getLanguages(){

            var deferred = $q.defer();

            $timeout(function(){
                languages.items = lang;
                deferred.resolve(lang);
            }, 500);

            return deferred.promise;
        }

        function getLanguageName(key){
            return languages.items.find(function(item){
                return item.id.toUpperCase() === key.toUpperCase()
            }).name
        }

        function getAssociatedKeyAndLanguage(keys){
            return keys.map(function(key){
                return {
                    id : key,
                    name : getLanguageName(key)
                }
            })
        }

    }
})();
