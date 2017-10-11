(function(){
    "use strict";

    angular
        .module("app.study")
        .controller("createStudyController", createStudyController);

    createStudyController.$inject = [
        "$state",
        "studyService",
        "watsonService",
        "countryService",
        "alertifyService",
        "languageService",
        "ipiModulesService",
        "influencerService",
        "developmentService",
        "angularWizardService"
    ];

    function createStudyController(
        $state,
        studyService,
        watsonService,
        countryService,
        alertifyService,
        languageService,
        ipiModulesService,
        influencerService,
        developmentService,
        angularWizardService
    ){

        console.log("Activate Create-Study Controller");

        var vm = this;
        vm.studyService = studyService.sharedStudyService
        vm.watsonService = watsonService.sharedWatsonService
        vm.countryService = countryService.sharedCountryService
        vm.languageService = languageService.sharedLanguageService

        vm.saveDraft = saveDraft
        vm.validateStudy = validateStudy
        vm.submitStudyForSubmission = submitStudyForSubmission;

        vm.cancel = studyService.cancel
        vm.isStudyNameExist = studyService.isStudyNameExist
        vm.searchCountries = countryService.searchCountries
        vm.searchLanguages = languageService.searchLanguages

        vm.isTraitExist = watsonService.isTraitExist
        vm.toggleTraitToTraitBoxes = watsonService.toggleTraitToTraitBoxes

        vm.goTo = angularWizardService.goTo
        vm.isCurrentPage = angularWizardService.isCurrentPage;
        vm.isAllowedToGoOtherSteps = angularWizardService.isAllowedToGoOtherSteps;

        vm.addInfluencer = influencerService.addInfluencer;
        vm.saveInfluencer = influencerService.saveInfluencer;
        vm.removeInfluencer = influencerService.removeInfluencer;
        vm.updateInfluenceForm = influencerService.updateInfluenceForm;
        vm.onTwitterHandleSelect = influencerService.onTwitterHandleSelect;
        vm.validateInfluencerTable = influencerService.validateInfluencerTable;
        vm.deleteNewlyAddedInfluencer = influencerService.deleteNewlyAddedInfluencer;
        vm.getInfluencersTwitterHandle = influencerService.getInfluencersTwitterHandle;
        vm.validateInfluencerTwitterHandle = influencerService.validateInfluencerTwitterHandle;

        vm.influenceTable = null;
        vm.createStudyForm = null;

        vm.state = {
            draft : true,
            name : null,
            agency : null,
            client : null,
            approver : null,
            keywords : [],
            countries : [],
            languages : [],
            period1Dates : null,
            period2Dates : null,
            watson : watsonService.sharedWatsonService,
            modules : ipiModulesService.sharedSocialModules,
            influencers : influencerService.sharedInfluencersService
        }

        activate()

        function activate(){

            countryService.getCountries()

            languageService.getLanguages()

            watsonService.newWatson()

            influencerService.newInfluencer()

            //vm.state = developmentService.seedStudyData(vm.state)

        }

        function saveDraft(){

            if(validateStudy()){

                studyService
                    .addStudy(vm.state)
                    .then(function(data){

                        alertifyService.run("Study Saved", { type : 'success' })

                        $state.go('app.study-edit-item', { id : data.id })

                    })
                    .catch(function(err){
                        console.log("error", err);
                    })
            }

        }

        function validateStudy(){

            // This is custom validation for date-range-picker ranged to be required
            if(vm.createStudyForm['createstudy-daterange-p1'].$untouched){
                vm.state.period1Dates = null
            }

            if(vm.createStudyForm['createstudy-daterange-p2'].$untouched){
                vm.state.period2Dates = null
            }

            return studyService.validateStudy(vm.state, vm.createStudyForm, vm.influenceTable)
        }

        function submitStudyForSubmission(){

            if(ipiModulesService.isIPIModuleValid()){
                studyService.submitStudyForSubmission(vm.state, submitStudyCallback)
            }

            function submitStudyCallback(){
                vm.state.draft = false;
                studyService
                    .addStudy(vm.state)
                    .then(function(res){

                        alertifyService.run("Study Submitted", { type : 'success' })

                        $state.go('success-create-study');
                        //return studyService.submitStudy(res.id)
                    })
            }
        }

    }
})();
