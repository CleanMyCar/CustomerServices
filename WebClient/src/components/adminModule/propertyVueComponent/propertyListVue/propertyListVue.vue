<template src="./propertyListVue.template.html"></template>
<script>
  export default {
    name: "propertyListComponent",
    props: [],
    data() {
      return {
        apiUrl : window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
        headerColumnList: [],
        propertyList: [],
        checkedProperties: [],
        toggleFilterPanel: false,
        isGreyOut: false,
        selectedFilterColumn: null,

        viewSaveObject: {
          properties: []
        },
        loading: true,
        PropertyId: null,
        headerColumnList: {
          LOGO: { Label: "LOGO", IsChecked: true, ColumnName: "LOGO", },
          PROPERTYNAME: {
            Label: "PROPERTYNAME",
            IsChecked: true,
            ColumnName: "PROPERTYNAME", class: "filterLoad", isSortLoading: false, isAscOrDesc: null
          },
          PROPERTYNICKNAME: {
            Label: "PROPERTYNICKNAME",
            IsChecked: true,
            ColumnName: "PROPERTYNICKNAME", class: "filterLoad", isSortLoading: false, isAscOrDesc: null
          },

          UNITCOUNT: { Label: "UNIT COUNT", IsChecked: true, ColumnName: "QTY_Units", class: "filterLoad", isSortLoading: false, isAscOrDesc: null },
          PUBLISHED: { Label: "PUBLISHED", IsChecked: true, ColumnName: "Published", class: "filterLoad", isSortLoading: false, isAscOrDesc: null },
          STATUS: { Label: "STATUS", IsChecked: true, ColumnName: "StatusId", class: "filterLoad", isSortLoading: false, isAscOrDesc: null }
        },

        filterObj: {

          SortBy: null,
          SortOrder: null,
          Properties: [],
          Columns: []


        },
        filterColumnList: {
          UnitCount: { Label: "Unit Count", ColumnName: "UnitCount" },
          Published: { Label: "Published", ColumnName: "Published" },

        },

      };


    },

    methods: {
      imageURLS(imgGuid) {
        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid)
        if(isBase64){
          return imgGuid;
        }
        return this.apiUrl + '/downloadImage/' + imgGuid+'/430x300';
      },
      applyFilter() {
        let vm = this;
        vm.filterObj.SearchText = null;
        vm.toggleFilterPanel = false;
        //vm.$store.state.bus.$emit('clearSearchText');        
        vm.viewSaveObject.propertyId = vm.filterObj.PropertyId;
        // vm.viewSaveObject.unitTypeId = vm.filterObj.UnitTypeId;
        // vm.viewSaveObject.resSourceId = vm.filterObj.resSourceId;

        // vm.viewSaveObject.tags.splice(0, vm.viewSaveObject.tags.length, ...vm.filterObj.TagsList);
        vm.viewSaveObject.properties.splice(0, vm.viewSaveObject.properties.length, ...vm.filterObj.Properties);
        // vm.viewSaveObject.unitTypes.splice(0, vm.viewSaveObject.unitTypes.length, ...vm.filterObj.UnitTypes);
        // vm.viewSaveObject.sources.splice(0, vm.viewSaveObject.sources.length, ...vm.filterObj.Sources);
        // vm.viewSaveObject.columns.splice(0, vm.viewSaveObject.columns.length, ...vm.filterObj.Columns);

        // vm.viewAttrsChanged = true;
        // vm.getReservationsList();
      },
      deleteSelectedPropertyFromFilter(index, propObj) {
        this.removePropertyFromFilter(propObj);
        this.viewSaveObject.properties.splice(index, 1);
      },
      addPropertyToFilter(propertyObj) {
        this.filterObj.Properties.push(propertyObj);
        this.filterSearchPropertyText = null;
      },
      removePropertyFromFilter(propertyObj) {
        if (propertyObj) {
          let index = this.filterObj.Properties.findIndex((currProperty) => {
            return currProperty.PropertyId === propertyObj.PropertyId;
          })
          if (index > -1) {
            this.filterObj.Properties.splice(index, 1);
          }
        }
      },
      showFilterByType(property) {
        if (this.selectedFilterColumn == property)
          this.selectedFilterColumn = null;
        else
          this.selectedFilterColumn = property;

      },
      closeFilter: function () {
        this.toggleFilterPanel = false
      },
      addColumnToFilters(colObj) {
        let index = this.filterObj.Columns.findIndex((currCol) => {
          return currCol.colunmName === colObj.ColumnName;
        })
        if (index === -1) {
          this.filterObj.Columns.push(JSON.parse(JSON.stringify({ colunmName: colObj.ColumnName, label: colObj.Label, text: null, arrText: [] })));
        }
      },
      addSearcTextToColumn(filterCol, event) {
        if (event.key == "Enter") {
          filterCol.arrText.push(filterCol.text);
          filterCol.text = null;
        }
      },
      removeSearchTextFromColumn(selectedText, filterCol) {
        if (filterCol.arrText.indexOf(selectedText) > -1) {
          filterCol.arrText.splice(filterCol.arrText.indexOf(selectedText), 1)
        }
      },

      ascSort(sortBy, sortOrder) {
        let vm = this;

        vm.filterObj.SortBy = sortBy;
        vm.filterObj.SortOrder = sortOrder;
        vm.isGreyOut = true;
        for (var i in vm.headerColumnList) {
          if (vm.headerColumnList[i].ColumnName !== "LOGO") {
            var obj = vm.headerColumnList[i];
            console.log("obj", obj);
            // for (var j in obj.sortLabels) {
            if (sortBy.toString() === obj.ColumnName) {
              console.log("obj.ColumnName", obj.ColumnName);
              vm.headerColumnList[i].isSortLoading = true;
              vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
              //   }
              // }
            }
          }
        }

        vm.getPropertyDetailList();
        


        //vm.getReservationsList(vm.propertyId, vm.UnitTypeId, vm.ViewListId, SortBy, SortOrder, vm.sourceID);
      },
      createNewInstance: function () {
        let uiPageName = this.$store.state.uiPageName;
        window.location.href = uiPageName + "#user/0";
      },
      switchView() {
        if (this.listType == "list") this.listType = "card";
        else this.listType = "list";
      },
      propertyDetail: function () {
        // window.location.href =
        //this.$store.state.uiPageName + "#propertyDetail/-1";
        this.$router.push("/propertyDetail/-1");
      },
      exportToExcel: function () { },
      getPropertyDetailList: function (searchText) {
        let scope = this;        

        this.$store.dispatch("dataRequestHandler", {
          key: "GetPropertyList",
          params: {
            PropertyId: scope.PropertyId,
            SearchText: searchText ? searchText : null,
            filterObj: scope.filterObj
          },
          callback: function (err, response) {
            if (response) {

              //console.log("got the propertyList", )
              // console.log("in get data" + JSON.stringify(response.recordsets[1]));
              console.log("getPropertyDetailList", response)
              scope.loading = false;
              scope.propertyList = response[1];
              // if (scope.propertyList.length > 0) {
              //   scope.$store.dispatch("toastr", {
              //     type: "success",
              //     header: "Success!",
              //     message: "Property List Rendered"
              //   });
              // }
              scope.loading = false;
              for (var i in scope.headerColumnList) {

                if (scope.headerColumnList[i].ColumnName !== "LOGO") {
                  var obj = scope.headerColumnList[i];
                  console.log("obj", obj)

                  if (scope.filterObj.SortBy === obj.ColumnName.toString()) {
                    console.log("obj.ColumnName", obj.ColumnName);
                    scope.headerColumnList[i].isSortLoading = false;
                    scope.isGreyOut = false;
                    if (scope.isGreyOut === false && scope.headerColumnList[i].isSortLoading === false) {
                      $('ul.dropdown-menu').removeClass('show').addClass('hide');
                    }

                    // vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
                  }

                }
              }

            }
            else {
              console.log(err);
            }

          }
        });
      },
      viewPropertyDetailById: function (propertyId) {
        this.$router.push("/propertyDetail/" + propertyId);
      },
      deletePropertyDetail: function () {
        let scope = this;
        this.$store.dispatch("dataRequestHandler", {
          key: "DeletePropertyDetailById",
          params: {
            ModuleAction: "DeletePropertyDetailById",
            PropertyIdList: scope.checkedProperties.toString()
          },
          callback: function (err, response) {
            if (response) {
              // Handle response



            } else {
              console.log(err);
            }
          }
        });
      }
    },

    computed: {
      selectAll: {
        get: function () {
          return this.propertyList
            ? this.checkedProperties.length == this.propertyList.length
            : false;
        },
        set: function (value) {
          var checkedProperties = [];

          if (value) {
            this.propertyList.forEach(function (propertyList) {
              checkedProperties.push(propertyList.PropertyId);
            });
          }

          this.checkedProperties = checkedProperties;
        }
      },
      fncIsPropertyList() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertyList")) {
          console.log("fncPropertyList =>", vm.$store.state.userEntitlementList);
          let fncPropertyList = vm.$store.state.userEntitlementList.fncPropertyList
          console.log("fncPropertyList", fncPropertyList)
          return fncPropertyList;
        }
        return null;
      },
      fncIsPropertyDelete() {

        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertyDelete")) {
          console.log("fncPropertyDelete =>", vm.$store.state.userEntitlementList);
          let fncPropertyDelete = vm.$store.state.userEntitlementList.fncPropertyDelete
          console.log("fncPropertyDelete", fncPropertyDelete)
          return fncPropertyDelete;
        }
        return null;
      },
      fncIsPropertyNew() {

        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertyNew")) {
          console.log("fncPropertyNew =>", vm.$store.state.userEntitlementList);
          let fncPropertyNew = vm.$store.state.userEntitlementList.fncPropertyNew
          console.log("fncPropertyNew", fncPropertyNew)
          return fncPropertyNew;
        }
        return null;
      },
      fncIsPropertyList() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertyList")
        ) {
          // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
          let fncPropertyList =
            vm.$store.state.userEntitlementList.fncPropertyList;
          // console.log("fncPropertyList", fncPropertyList)
          //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
          return fncPropertyList;
        }
        return null;
      },
      fncIsPropertySelect() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySelect")) {
          console.log("fncPropertySelect =>", vm.$store.state.userEntitlementList);
          let fncPropertySelect = vm.$store.state.userEntitlementList.fncPropertySelect
          console.log("fncPropertyNew", fncPropertySelect)
          return fncPropertySelect;
        }
        return null;
      }


    },

    mounted() {
      //console.log("property mount");
      let vm = this;
      vm.getPropertyDetailList();
      vm.$store.state.bus.$on('Search-In-Property-List', function (searchText) {
        console.log(searchText);
        vm.getPropertyDetailList(searchText);
      });
      $(vm.$el).find("ul.dropdown-menu").click(function (e) {
        e.stopPropagation();
      });
    }
  };
</script>