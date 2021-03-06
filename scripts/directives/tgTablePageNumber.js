(function(){
 'use strict';


//@directive:tgtablePageNumber(tg-table-page-number)
// @module:tableGrid
// @used:'E'(element)
// @description:page numbers in pagintaion

   angular.module('tableGrid')
          .directive('tgTablePageNumber',tgTablePageNumber);


    //inject dependencies

    tgTablePageNumber.$inject = ["tgTableGridHelpers","tgTablePageNumberHelpers","$timeout"];

    //constructor:tgtablePageNumber

    function tgTablePageNumber(tgTableGridHelpers,tgTablePageNumberHelpers,$timeout){

      //controller:tgTablePageNumberController

      var tgTablePageNumberController = function($scope,$timeout,$rootScope){


            var tgTablePageNumberControllerSelf = this;
            var timer = null;
            var tgTablePainationPageChangeEventunBind = null;
            tgTablePageNumberControllerSelf.tgTableMaxPageSize = null;
            tgTablePageNumberControllerSelf.gridDataCount = null;
            tgTablePageNumberControllerSelf.refreshOnPageSizeChange=true;


            tgTablePageNumberControllerSelf.pageNumberConfig = {'pageSize':false,'pageLimitDefault':9,'currentPage':1};

            var emitEvent = function(emitEventName,emitArgs){
                $rootScope.$emit(emitEventName,emitArgs);
            };

            var prevNextActionConfig = {

               commonActivate : function(pageActivatedNumber){
                 tgTablePageNumberHelpers.activatePageButton(pageActivatedNumber);
                 emitEvent('dataUpdateOnPageNumberAction',pageActivatedNumber);
                 tgTablePageNumberControllerSelf.pageNumberConfig.currentPage = pageActivatedNumber;

               },

                go2FirstPage : function(){
                  var pageActionNumber = tgTablePageNumberControllerSelf.pageNumberConfig.currentPage = 1;
                  prevNextActionConfig.commonActivate(pageActionNumber);
                },

                go2LastPage : function(){
                  var pageActionNumber = tgTablePageNumberControllerSelf.pageNumberConfig.currentPage=tgTablePageNumberControllerSelf.tgTableMaxPageSize;
                  prevNextActionConfig.commonActivate(pageActionNumber);
                },

                nextPrevAction:function(){
                  var pageActionNumber = (this.action === 'prev')? tgTablePageNumberControllerSelf.pageNumberConfig.currentPage-1 :tgTablePageNumberControllerSelf.pageNumberConfig.currentPage+1;
                  // tgTablePageNumberHelpers.activatePageButton(pageActionNumber);
                  // emitEvent('dataUpdateOnPageNumberAction',pageActionNumber);
                  // tgTablePageNumberControllerSelf.pageNumberConfig.currentPage = pageActionNumber;
                  prevNextActionConfig.commonActivate(pageActionNumber);
                },
                disabledAction:function(options){
                  var direction = options;
                  if(direction.left){
                      return tgTablePageNumberHelpers.checkForFirstValue(direction.value);
                  }
                  else{
                    return (direction.value === tgTablePageNumberControllerSelf.tgTableMaxPageSize);
                  }

                }

            };




            //kickoff actions for page numbers
            tgTablePageNumberControllerSelf.initPageNumberActions = function(gridDataCount,defaultPageSize,isEventHappened){




              tgTablePageNumberControllerSelf.gridDataCount = gridDataCount;
              tgTablePageNumberControllerSelf.tgTableMaxPageSize = Math.round(gridDataCount/defaultPageSize);

              tgTablePageNumberControllerSelf.tgTablePageNumbers = tgTableGridHelpers.getAscendingNumberArray(tgTablePageNumberControllerSelf.pageNumberConfig.pageLimitDefault);
              tgTablePageNumberControllerSelf.tgTablePageNumbers.push(tgTablePageNumberControllerSelf.tgTablePageNumbers.length+1);

              if(tgTableGridHelpers.checkIfNumberHasDecimals(gridDataCount/defaultPageSize)){
                tgTablePageNumberControllerSelf.tgTableMaxPageSize+=1;
              }
              tgTablePageNumberControllerSelf.isLeftIndicatorDisabled();
              tgTablePageNumberControllerSelf.pageNumberConfig.currentPage = 1;
              tgTablePageNumberControllerSelf.pageNumberConfig.pageSize = !tgTablePageNumberControllerSelf.pageNumberConfig.pageSize;


              if(isEventHappened){
                    tgTablePageNumberControllerSelf.refreshOnPageSizeChange = false;
                timer = $timeout(function(){
                  tgTablePageNumberControllerSelf.refreshOnPageSizeChange = true;
                  tgTablePageNumberControllerSelf.pageNumberConfig.pageSize = !tgTablePageNumberControllerSelf.pageNumberConfig.pageSize;

                },0);
              }


            };

            tgTablePageNumberControllerSelf.changePageAction = function(element){
              var pageNumber = element.$parent.$index+1;

              tgTablePageNumberControllerSelf.pageNumberConfig.currentPage = pageNumber;

                if(tgTablePageNumberControllerSelf.tgTablePageNumbers>tgTablePageNumberControllerSelf.pageNumberConfig.pageLimitDefault){
                    tgTablePageNumberHelpers.handlePageNumbers(pageNumber);
                }

                tgTablePageNumberHelpers.activatePageButton(pageNumber);
                emitEvent('dataUpdateOnPageNumberAction',pageNumber);

            };




            //check fo icon disabled

            tgTablePageNumberControllerSelf.isLeftIndicatorDisabled = function(){
                var disabeldConfig = {
                  left:true,
                  value:tgTablePageNumberControllerSelf.pageNumberConfig.currentPage
                };
                return prevNextActionConfig.disabledAction.call(null,disabeldConfig);
            };

            tgTablePageNumberControllerSelf.isRightIndicatorDisabled = function(){
              var disabeldConfig = {
                right:true,
                value:tgTablePageNumberControllerSelf.pageNumberConfig.currentPage
              };

              return prevNextActionConfig.disabledAction.call(null,disabeldConfig);
            };

            tgTablePageNumberControllerSelf.previousAction = function(){

                var pagePrev = {'action':'prev'};
                if(tgTablePageNumberControllerSelf.pageNumberConfig.currentPage >= 1){
                     if(tgTablePageNumberControllerSelf.pageNumberConfig.currentPage === 1)
                              return;
                    prevNextActionConfig.nextPrevAction.call(pagePrev);
                }
            };

            tgTablePageNumberControllerSelf.nextAction = function(){
              var pagePrev = {'action':'next'};
              var pageMiddleNumber = tgTablePageNumberControllerSelf.tgTablePageNumbers.length/2;
              prevNextActionConfig.nextPrevAction.call(pagePrev);


              if(tgTablePageNumberControllerSelf.pageNumberConfig.currentPage < tgTablePageNumberControllerSelf.tgTableMaxPageSize && tgTablePageNumberControllerSelf.pageNumberConfig.currentPage > pageMiddleNumber){
                tgTablePageNumberControllerSelf.tgTablePageNumbers.shift();
                tgTablePageNumberControllerSelf.tgTablePageNumbers.push(tgTablePageNumberControllerSelf.tgTablePageNumbers[tgTablePageNumberControllerSelf.tgTablePageNumbers.length-1]+1);
                timer = $timeout(function(){
                  tgTablePageNumberHelpers.removeActivatedClass(0);
                },0,false);
              }

            };

            //go to first page on click on exteme previous button

            tgTablePageNumberControllerSelf.go2FirstPage = function(){
                prevNextActionConfig.go2FirstPage.call();
            };

            //go to last page on click on exteme next button
            tgTablePageNumberControllerSelf.go2LastPage = function(){
                prevNextActionConfig.go2LastPage();
            };



            $scope.$on('destroy',function(){
                if(timer){
                  $timeout.cancel(timer);
                }

            });
      };

      //link:@pre-lnking:tgTablePageNumberLink
      var tgTablePageNumberLink = {

        pre:function(scope,element,attrs,controllers){
          var tgTablePaginationController = controllers[0],
              tgTablePageNumberController = controllers[1],
              tgTablePainationPageChangeEventunBind = null;



          tgTablePageNumberController.initPageNumberActions(tgTablePaginationController.getGridDataCount(),tgTablePaginationController.getDefaultPageSize());

          tgTablePainationPageChangeEventunBind = scope.$on('tgPaginationPageChange',function(){
              $timeout(function(){
                  tgTablePageNumberController.initPageNumberActions(tgTablePaginationController.getGridDataCount(),tgTablePaginationController.getDefaultPageSize(),true);
              },0);
            });

            scope.$on('$destroy',function(){
              tgTablePainationPageChangeEventunBind();
            });
        }

      };




        return{
          restrict:'E',
          replace: true,
          priority:999,
          require:['^tgTablePagination','tgTablePageNumber'],
          link:tgTablePageNumberLink,
          controller:['$scope','$timeout','$rootScope',tgTablePageNumberController],
          controllerAs:'tgTablePageNumber',
          templateUrl:'/views/templates/tgtablePageNumber.html'
        };
    }

})();
