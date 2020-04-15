(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('UrlPath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  var found=[];

  list.displayResults = function (searchTerm) {
    console.log(searchTerm)
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
    var origTitle = "Match for term:"+ searchTerm;

    promise.then(function (response) {
      list.items=response;
      console.log(list.items);
      list.title=origTitle;
      list.description=list.items.description;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  list.removeItem = function (itemIndex) {
    var items = MenuSearchService.getItems();

    items.splice(itemIndex, 1);
    
  };
};

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'shoppingList.html',
    scope: {
      items: '<',
      onRemove: '&',
      myTitle: '@title'
    },
    controller: NarrowItDownController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

MenuSearchService.$inject = ['$http', 'UrlPath'];
function MenuSearchService($http, UrlPath) {
  var service = this;
  var foundItems=[]

  service.getMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (UrlPath + "/menu_items.json")
    });

    return response;
  };
 
  service.getItems = function () {
      return foundItems;
  };
    service.removeItem = function (itemIndex) {
    foundItems.splice(itemIndex, 1);
  };
  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: (UrlPath + "/menu_items.json"),
    }).then(function (result) {

    var items=result.data;
    console.log("found data:", items)
     for (var i = 0; i < items.menu_items.length; i++) {
      var description = items.menu_items[i].description;
      if (description.toLowerCase().indexOf(searchTerm) !== -1) {
        var k={
          name: items.menu_items[i].name,
          short_name: items.menu_items[i].short_name,
          description: items.menu_items[i].description,
          index: description.toLowerCase().indexOf(searchTerm)
        };
        foundItems.push(k)
        // return description.toLowerCase().indexOf(searchTerm);
      }
    }
    console.log("FOUND ITEMS:", foundItems, foundItems.length)
    return foundItems;
})};

}

})();