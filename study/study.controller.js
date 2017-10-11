(function(){
    "use strict";

    angular
        .module("app.study")
        .controller("studyController", studyController);

    studyController.$inject = [
        '$state',
        'CONFIG',
        'studyService',
        'alertifyService'
    ];

    function studyController(
        $state,
        CONFIG,
        studyService,
        alertifyService
    ){

        console.log("Activate StudyController");

        var vm = this,
            ASC = 'asc',
            DESC = 'desc'

        vm.reset = reset
        vm.setPage = setPage
        vm.reorder = reorder
        vm.getStudies = getStudies
        vm.deleteStudy = deleteStudy
        vm.navigateStudyTo = navigateStudyTo
        vm.getResultNumbering = getResultNumbering

        vm.state = {
            studies : studyService.sharedStudyService,
            column : {
                name : 'asc',
                period1StartDate : 'asc',
                period2StartDate : 'asc',
                influencers : 'asc',
                keywords : 'asc',
                createdBy : 'asc',
                createdDate : 'asc',
                status : 'asc',
            },
            meta : {
                _q : null,
                _page : 1,
                _sort : null,
                _order : null,
                _limit : CONFIG.LIMIT_PAGINATION_ITEM,
            }
        }

        activate()

        function activate(){ getStudies() }

        function getStudies(resetCache){ studyService.getStudies(vm.state.meta, resetCache) }

        function setPage(){ getStudies() }

        function reorder(columnName){
            vm.state.column[columnName] = vm.state.column[columnName] === ASC ? DESC : ASC

            vm.state.meta._sort = columnName
            vm.state.meta._order = vm.state.column[columnName]

            getStudies()
        }

        function reset(){
            vm.state.meta = {
                _q : null,
                _page : 1,
                _sort : null,
                _order : null,
                _limit : CONFIG.LIMIT_PAGINATION_ITEM,
            }

            getStudies(true)
        }

        function getResultNumbering(){

            var startNumber,
                endNumber,
                totalNumber = vm.state.studies.meta.totalItems

            endNumber = vm.state.meta._page * vm.state.studies.meta.responseItems
            startNumber = endNumber - vm.state.meta._limit + 1

            var isLastPage = totalNumber === (vm.state.meta._page - 1) * vm.state.meta._limit + vm.state.studies.meta.responseItems

            if(isLastPage){
                endNumber = totalNumber
                startNumber = endNumber - vm.state.studies.meta.responseItems + 1
            }

            if(vm.state.studies.meta.responseItems === 0)
                return endNumber + " of " + totalNumber

            else
                return startNumber + " - " + endNumber + " of " + totalNumber
        }

        function deleteStudy(study){

            swal({
                type : "warning",
                title : study.name,
                text : "Are you sure to delete permanently?",
                showCancelButton : true,
                confirmButtonColor : "",
            }, function(isConfirm){
                isConfirm && runDeleteStudy()
            })

            function runDeleteStudy(){

                $("#study-" + study.id).fadeOut('slow')

                studyService
                    .deleteStudy(study.id)
                    .then(function(){
                        alertifyService.run("Study deleted", { type : 'success' })
                    })
                    .catch(function(){
                        alertifyService.run("Failed to delete study", { type : 'error' })
                        $("#study-" + studyId).fadeIn('medium')
                    })
            }
        }

        function navigateStudyTo(study){

            var status = study.status || 'Failed'

            if(status === 'Draft'){
                $state.go('app.study-edit-item', { id : study.id })
            }

            else if(status === 'Processing'){
            }

            else if(status === 'Submitted'){
            }

            else if(status === 'Succeed'){
                $state.go('app.study-edit-item', {
                    id : study.id,
                    isSuccessStudy : true
                })
            }

            else{

                swal({
                    title : "Error",
                    text : "<p>You have an error</p>",
                    type : "error",
                    html : true,
                    allowOutsideClick : true,
                    confirmButtonColor : "",
                }, function(res){
                    res && $state.go('app.study-create')
                });

            }

        }
    }
})();
