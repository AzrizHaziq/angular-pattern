(function(){
    'use strict';

    angular
        .module('app.study')
        .config(studyNav);

    studyNav.$inject = ['$stateProvider'];

    function studyNav($stateProvider){

        $stateProvider
            .state('app.study', {
                url : 'studies',
                controller : 'studyController as study',
                templateUrl : '/app/components/study/html/study.html',
            })

            .state('app.study-create', {
                url : 'studies/create',
                controller : 'createStudyController as study',
                templateUrl : '/app/components/study/html/create-study.html',
            })

            .state('app.study-view', {
                url : 'studies/:id/view',
                resolve : { getStudy : getStudy },
                controller : 'viewStudyController as study',
                templateUrl : '/app/components/study/html/view-study.html',
            })

            .state('app.study-edit-item', {
                url : 'studies/:id/edit',
                params : { isSuccessStudy : false },
                resolve : { getStudy : getStudy },
                controller : 'editStudyController as study',
                templateUrl : '/app/components/study/html/edit-study.html',
            })

            .state('success-create-study', {
                url : '/success-create-study',
                templateUrl : '/app/components/study/html/success-create-study.html',
            })

        getStudy.$inject = ['$q', '$stateParams', 'studyService', 'countryService', 'languageService']

        function getStudy($q, $stateParams, studyService, countryService, languageService){

            return $q.all([
                studyService.getStudy($stateParams.id),
                countryService.getCountries(),
                languageService.getLanguages()
            ])
        }

    }

})();

