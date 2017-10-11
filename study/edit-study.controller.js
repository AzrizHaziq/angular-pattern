(function(){
    "use strict";

    angular
        .module("app.study")
        .controller("editStudyController", editStudyController);

    editStudyController.$inject = [
        '$state',
        'getStudy',
        '$stateParams',
        'studyService',
        'resultService',
        'watsonService',
        'countryService',
        'alertifyService',
        'languageService',
        'ipiModulesService',
        'influencerService',
        'angularWizardService'
    ];

    function editStudyController(
        $state,
        getStudy,
        $stateParams,
        studyService,
        resultService,
        watsonService,
        countryService,
        alertifyService,
        languageService,
        ipiModulesService,
        influencerService,
        angularWizardService
    ){

        console.log("Activate Edit-Study Controller");

        var vm = this;
        vm.studyService = studyService.sharedStudyService
        vm.watsonService = watsonService.sharedWatsonService
        vm.countryService = countryService.sharedCountryService
        vm.languageService = languageService.sharedLanguageService

        vm.saveDraft = saveDraft
        vm.validateStudy = validateStudy
        vm.submitStudyForSubmission = submitStudyForSubmission

        vm.cancel = studyService.cancel
        vm.exportResult = resultService.exportResult
        vm.searchCountries = countryService.searchCountries
        vm.searchLanguages = languageService.searchLanguages

        vm.isTraitExist = watsonService.isTraitExist
        vm.toggleTraitToTraitBoxes = watsonService.toggleTraitToTraitBoxes

        vm.goTo = angularWizardService.goTo
        vm.isCurrentPage = angularWizardService.isCurrentPage
        vm.isAllowedToGoOtherSteps = angularWizardService.isAllowedToGoOtherSteps

        vm.addInfluencer = influencerService.addInfluencer
        vm.saveInfluencer = influencerService.saveInfluencer
        vm.removeInfluencer = influencerService.removeInfluencer
        vm.updateInfluenceForm = influencerService.updateInfluenceForm
        vm.onTwitterHandleSelect = influencerService.onTwitterHandleSelect
        vm.validateInfluencerTable = influencerService.validateInfluencerTable
        vm.deleteNewlyAddedInfluencer = influencerService.deleteNewlyAddedInfluencer
        vm.getInfluencersTwitterHandle = influencerService.getInfluencersTwitterHandle
        vm.validateInfluencerTwitterHandle = influencerService.validateInfluencerTwitterHandle

        vm.state = null;
        vm.influenceTable = null;
        vm.createStudyForm = null;

        activate()

        function activate(){

            var editStudy = getStudy[0];

            watsonService.setTraits(editStudy.watson)
            ipiModulesService.setSocialModules(editStudy.modules)
            influencerService.setInfluencer(editStudy.influencers)

            var lang = languageService.getAssociatedKeyAndLanguage(editStudy.languages)
            var country = countryService.getAssociatedKeyAndCountry(editStudy.countries)

            vm.state = angular.extend({}, editStudy, {
                languages : lang,
                countries : country,
                watson : watsonService.sharedWatsonService,
                modules : ipiModulesService.sharedSocialModules,
                influencers : influencerService.sharedInfluencersService,
                period1Dates : stringifyDate (editStudy.period1StartDate) + " - " + stringifyDate (editStudy.period1EndDate),
                period2Dates : stringifyDate (editStudy.period2StartDate) + " - " + stringifyDate (editStudy.period2EndDate)
            });

            $stateParams.isSuccessStudy && navigateToResultPage()
        }

        function navigateToResultPage(){
            setTimeout(function(){ angularWizardService.goTo('3-results') }, 1000)
        }

        function saveDraft(){

            if(validateStudy()){

                studyService
                    .updateStudy(vm.state)
                    .then(function(data){

                        alertifyService.run("Study Saved", { type : 'success' })

                        console.log("success save study draft", data);
                    })
                    .catch(function(err){
                        console.log("error", err);
                    })
            }

        }

        function validateStudy(){

            if($state.current.name === 'app.study-create'){

                if(vm.createStudyForm['createstudy-daterange-p1'].$untouched){
                    vm.state.period1Dates = null
                }

                if(vm.createStudyForm['createstudy-daterange-p2'].$untouched){
                    vm.state.period2Dates = null
                }
            }

            return studyService.validateStudy(vm.state, vm.createStudyForm, vm.influenceTable)
        }

        function submitStudyForSubmission(){

            if(ipiModulesService.isIPIModuleValid()){
                studyService.submitStudyForSubmission(vm.state, submitStudyCallback)
            }

            function submitStudyCallback(){
                studyService
                    .submitStudy(vm.id)
                    .then(function(){

                        alertifyService.run("Study Submitted", { type : 'success' })

                        $state.go('success-create-study')
                    })
            }
        }

        /* convert date object string back to MM/DD/YYYY */
        function stringifyDate(inDate){
            var patt_yyyymmdd = /(\d{4}\-\d{2}\-\d{2})/g;
            if(typeof inDate === "string" && typeof moment === "function"){
                var matches = patt_yyyymmdd.exec(inDate);
                if(matches.length > 1){
                    return moment(matches[1], "YYYY-MM-DD").format("MM/DD/YYYY");
                }
            }
            else{
                return inDate;
            }
        }
    }
})();

