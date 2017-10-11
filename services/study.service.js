(function(){
    'use strict';

    angular
        .module('app')
        .factory('studyService', studyService);

    studyService.$inject = [
        '$state',
        '$http',
        '$q',
        'CONFIG',
        'influencerService',
        'ipiModulesService'
    ];

    function studyService(
        $state,
        $http,
        $q,
        CONFIG,
        influencerService,
        ipiModulesService
    ){

        var costsServiceProxy = CONFIG.ProxyAPIHost + "/costs"
        var analysisStudiesServiceProxy = CONFIG.ProxyAPIHost + "/studies"
        var analysisStudiesSubmissionServiceProxy = CONFIG.ProxyAPIHost + "/ipi-services-core/analysisstudiessubmission"

        var study = {
            items : null,
            item : null,
            isStudyNameExist : false,
            meta : {
                totalItems : 0,
                responseItems : 0,
                isLoadingStudyItems : false,
                isErrorStudyItems : false,

                isStudyExistLoading : false,
                isStudyExistError : false
            },
        }

        return {
            sharedStudyService : study,
            cancel : cancel,
            getStudy : getStudy,
            addStudy : addStudy,
            getStudies : getStudies,
            deleteStudy : deleteStudy,
            updateStudy : updateStudy,
            submitStudy : submitStudy,
            validateStudy : validateStudy,
            isStudyNameExist : isStudyNameExist,
            submitStudyForSubmission : submitStudyForSubmission,
            //submitStudy: submitStudy,
            //getStudySubmission: getStudySubmission,
            //getInfluencers: getInfluencers,
        };

        function isStudyNameExist(query){
            study.meta.isStudyExistLoading = true;

            var http = {
                cache : true,
                method : 'GET',
                url :   'http://localhost:3000/api/v1/studies/StudyAlreadyExists/' + query
                //url : analysisStudiesServiceProxy + '/StudyAlreadyExists/' + query,
            }

            return $http(http)
                .then(success, error)
                .finally(end)

            function success(res){
                study.isStudyNameExist = JSON.parse(res.data)
                study.meta.isStudyExistError = false;
            }

            function error(err){
                study.meta.isStudyExistError = true;
                study.isStudyNameExist = false
                return $q.reject(err);
            }

            function end(){
                study.meta.isStudyExistLoading = false
            }
        }

        function getStudies(params, resetCache){

            study.meta.isLoadingStudyItems = true;

            var cache = resetCache !== true //by default cache is true

            var parameters = {
                searchKeyword : params._q,
                page : params._page,
                sortBy : params._sort,
                sortOrder : params._order,
            }

            var http = {
                cache : cache,
                method : 'GET',
                params : parameters,
                //url : analysisStudiesServiceProxy,
                url : 'http://localhost:3000/api/studies',
            }

            return $http(http)
                .then(success)
                .catch(error)
                .finally(end)

            function success(response) {

                var result = response.data

                study.items = result.data;
                study.meta.isErrorStudyItems = false;
                study.meta.totalItems = result.count;
                study.meta.responseItems = result.data.length;
            }

            function error(err){
                study.meta.isErrorStudyItems = true;
                return $q.reject(err);
            }

            function end(){
                study.meta.isLoadingStudyItems = false;
            }

        }

        function getStudy(studyId){

            var http = {
                method : 'GET',
                url : analysisStudiesServiceProxy + "/" + studyId,
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data
            }

            function error(err){
                return $q.reject(err);
            }
        }

        function addStudy(data){

            var http = {
                method : 'POST',
                url : analysisStudiesServiceProxy,
                data : transformRequest(data),
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data;
            }

            function error(err){
                return $q.reject(err);
            }
        }

        function updateStudy(study){

            var http = {
                method : 'PUT',
                url : analysisStudiesServiceProxy + "/" + study.id,
                data : transformRequest(study),
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data;
            }

            function error(err){
                return $q.reject(err);
            }
        }

        function submitStudyForSubmission(data, submitStudyCallback){
            //getStudyCost(data)
                //.then(function(studyCost){
                    swal({
                        title : "<h5 class='fg-umred text-left'>Estimated Costs</h5><hr>",
                        text : ipiModulesService.getModulesEstimateCost(studyCost),
                        closeOnConfirm : true,
                        closeOnCancel : true,
                        confirmButtonColor : "",
                        showConfirmButton : false,
                        html : true
                    }, function(isConfirm){
                        isConfirm && submitStudyCallback()
                    });
                //});
        }

        function submitStudy(id){

            console.warn("i don't know the result of previous ajax for study submission")

            var http = {
                method : 'POST',
                url : analysisStudiesServiceProxy + "/" + id,
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data;
            }

            function error(err){
                return $q.reject(err);
            }
        }

        function cancel(){

            swal({
                title : "Are you sure?",
                text : "Any changes will not be saved.",
                type : "warning",
                showCancelButton : true,
                confirmButtonColor : "",
            }, function(isConfirm){
                isConfirm && $state.go('app.study')
            })

        }

        function validateStudy(studyState, createStudyForm, influenceTable){

            var isValid = true,
                isInfluenceTableVisible = influenceTable.$visible,
                errMsg = "<b>Please review the Create Study Page to ensure all " +
                    "mandatory fields have been entered. </b><br><br>";

            if(!studyState.name || study.isStudyNameExist){
                createStudyForm['createstudy-name'].$setTouched()
                isValid = false
            }

            if(!studyState.agency){
                createStudyForm['createstudy-agency'].$setTouched()
                isValid = false
            }

            if(!studyState.client){
                createStudyForm['createstudy-client'].$setTouched()
                isValid = false
            }

            if(!studyState.approver){
                createStudyForm['createstudy-approver'].$setTouched()
                isValid = false
            }

            if(!studyState.period1Dates){
                createStudyForm['createstudy-daterange-p1'].$setDirty()
                createStudyForm['createstudy-daterange-p1'].$setTouched()
                isValid = false
            }

            if(!studyState.period2Dates){
                createStudyForm['createstudy-daterange-p2'].$setDirty()
                createStudyForm['createstudy-daterange-p2'].$setTouched()
                isValid = false
            }

            if(influencerService.isInfluencerHasAnyEmptyData()){
                influenceTable.$setDirty('true')
                isValid = false
            }

            if(isInfluenceTableVisible){
                influenceTable.$setPristine('true')
                isValid = false
            }

            if(isValid){
                return true
            }
            else{

                swal({
                    title : "Error",
                    text : errMsg,
                    type : "error",
                    html : true,
                    allowOutsideClick : true,
                    confirmButtonColor : "",
                });

                return false

            }

        }

        function transformRequest(data){

            var influencers = data.influencers.items;
            var period1Date = data.period1Dates.split(" - ")
            var period2Date = data.period2Dates.split(" - ")

            return angular.extend({}, data, {
                keywords : data.keywords,
                influencers : influencers,
                watson : data.watson.traits,
                modules : data.modules ? transformModules() : undefined,
                countries : data.countries ? transformCountries() : undefined,
                languages : data.languages ? transformLanguages() : undefined,
                period1StartDate : new Date(period1Date[0] + "Z"),
                period1EndDate : new Date(period1Date[1] + "Z"),
                period2StartDate : new Date(period2Date[0] + "Z"),
                period2EndDate : new Date(period2Date[1] + "Z"),
                period1Dates : undefined,
                period2Dates : undefined,
                createdBy : "system",
                createdDate : new Date()
            });

            function transformCountries(){
                return data.countries.map(function(country){
                    return country.id
                })
            }

            function transformLanguages(){
                return data.languages.map(function(language){
                    return language.id
                })
            }

            function transformModules(){
                return Object.keys(data.modules).filter(function(key){
                    return data.modules[key] === true;
                });
            }
        }

        function getStudyCost(data){
            var influencers = data.influencers.items.length;
            var numberOfDays = getStudyNumberOfDays(data.period1Dates, data.period2Dates);
            var keywordsIncluded = isKeywordsIncluded(data.keywords);
            var http = {
                method : 'GET',
                url : costsServiceProxy + "/" + numberOfDays + "/" + influencers + "/" + keywordsIncluded,
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data;
            }

            function error(err){
                return $q.reject(err);
            }
        }

        function getStudyNumberOfDays(period1Dates, period2Dates){

            var endDay = 1;
            var parseFormat = "MM-DD-YYYY";
            var _period1Date = period1Dates.split(" - ");
            var _period2Date = period2Dates.split(" - ");

            var period1Start = moment.utc(_period1Date[0] + "Z", parseFormat);
            var period1End = moment.utc(_period1Date[1] + "Z", parseFormat);

            var period2Start = moment.utc(_period2Date[0] + "Z", parseFormat);
            var period2End = moment.utc(_period2Date[1] + "Z", parseFormat);

            var period1Days = period1End.diff(period1Start, "days") + endDay;
            var period2Days = period2End.diff(period2Start, "days") + endDay;

            var totalNumberOfDays = period1Days + period2Days;
            return totalNumberOfDays;

        }

        function isKeywordsIncluded(keywords){
            if(keywords.length >= 1)
                return true;
            return false;
        }

        function deleteStudy(id){

            console.warn("i don't know the result of previous ajax for delete study submission, id: " + id)

            var http = {
                method : 'DELETE',
                url : analysisStudiesServiceProxy + "/" + id,
            }

            return $http(http)
                .then(success)
                .catch(error)

            function success(response){
                return response.data;
            }

            function error(err){
                return $q.reject(err);
            }
        }

        //function getStudySubmission(studyId) {
        //
        //    var defer = $q.defer();
        //    $http({
        //        method: 'GET',
        //        url: analysisStudiesSubmissionServiceProxy + "study/" + studyId
        //    })
        //        .then(
        //            function success(response){
        //                defer.resolve(response.data);
        //            },
        //            function error(response){
        //                defer.reject(response);
        //            });
        //
        //    return defer.promise;
        //}
        //
        //function getInfluencers() {
        //
        //    var defer = $q.defer();
        //    $http({
        //        method: 'GET',
        //        url: influencersProxy
        //    })
        //        .then(
        //            function success(response){
        //                defer.resolve(response.data);
        //            },
        //            function error(response){
        //                defer.reject(response);
        //            });
        //
        //    return defer.promise;
        //}
        //
        //function getMonitors(accountId) {
        //    var defer = $q.defer();
        //    $http({
        //        method: 'GET',
        //        url: crimsonServiceProxy + accountId + "/monitors"
        //    })
        //        .then(
        //            function success(response){
        //                defer.resolve(response.data);
        //            },
        //            function error(response){
        //                defer.reject(response);
        //            });
        //
        //    return defer.promise;
        //}

    }
})();
