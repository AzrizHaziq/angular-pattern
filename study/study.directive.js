(function(){
    'use strict';

    angular
        .module('app')
        .directive('weightPercentage', weightPercentage)
        .directive('traitsItem', traitsItem);

    function weightPercentage(){

        var slice =
            '<div class="slice">' +
            '   <div class="bar"></div>' +
            '   <div class="fill"></div>' +
            '</div>'

        return {
            restrict : 'E',
            scope : {
                socialWeight : '=',
                hexagonWeight : '='
            },
            template :
            '<div class="inblock-mid bkg-white margin-v-15 padding-v-10 padding-h-10 border-radius-25">' +
            '<div class="inblock-mid width-full width-sm-auto">' +
            '    <span class="margin-h-5 fg-cathamsblue font-weight-medium">Social Weight</span>' +
            '    <span class="margin-h-5 fg-umred font-weight-medium">Hexagon Weight</span>' +
            '</div>' +
            '<div class="inblock-mid position-relative width-75 height-90 height-sm-auto margin-h-5">' +
            '     <div class="abs-centre-middle fg-white circulargraph circulargraph-cathamsblue -js-circulargraph-listen -js-observe-mutate" ' +
            '          data-graph-pct="25">' +
            '     <div class="centrefill border-round bkg-img abs-centre-middle" style="background-image:url(\'../img/photo/bkg-weight_social.png\');">' +
            '          <span class="abs-centre-middle font-size-medium fg-white-70 label-value">25%</span>' +
            '     </div>' + slice +
            '</div></div>' +
            '<div class="inblock-mid position-relative width-75 height-90 height-sm-auto margin-h-5">' +
            '    <div class="abs-centre-middle fg-white circulargraph circulargraph-umred -js-circulargraph-listen -js-observe-mutate"' +
            '         data-graph-pct="75">' +
            '        <div class="centrefill border-round bkg-img abs-centre-middle" style="background-image:url(\'../img/photo/bkg-weight_crimson.png\');">' +
            '            <span class="abs-centre-middle font-size-medium fg-white-70 label-value">75%</span>' +
            '        </div>' + slice +
            '    </div>' +
            '</div></div>'
        }

    }

    traitsItem.$inject = ['watsonService']

    function traitsItem(watsonService){
        return {
            restrict : 'E',
            scope : {
                items : '&items'
            },
            template :
            "<div class='overflow-auto height-140 -js-um-scrollbar'>" +
            "    <div ng-repeat='id in items()'>" +
            "        <div class='row-trait padding-v-5 padding-h-10 overflow-ellipsis'>" +
            "            <span class='font-size-small' title='{{ watsonService.getPersonalityInsightTraitName(id) }}'>" +
            "                {{ watsonService.getPersonalityInsightTraitName(id) }}" +
            "            </span>" +
            "        </div>" +
            "    </div>" +

            "    <div ng-repeat='empty in emptyItems() track by $index'>" +
            "        <div class='row-trait padding-v-5 padding-h-10 overflow-ellipsis'>" +
            "            <span class='font-size-small' title=''></span>" +
            "        </div>" +
            "    </div>" +
            "</div>",
            link : function($scope){
                $scope.watsonService = watsonService

                $scope.emptyItems = function(){

                    var isMoreTraitsItem = ($scope.items().length - 4) < 0

                    if(isMoreTraitsItem){

                        var temp = [];
                        temp.length = 4 - $scope.items().length

                        return temp
                    }
                }
            },
        }
    }
})();

