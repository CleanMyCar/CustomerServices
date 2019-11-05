<template src="./clientListVue.template.html"></template>
<script>
  export default {
    name: "clientListComponent",
    props: [],
    data() {

      return {
        apiUrl : window.location.protocol + '//' + window.location.hostname + (window.location.port ? ":1339" : ''),
        clientList: [],
        headerColumnList: [],
        toggleFilterPanel: false,
        headerColumnList: {
          LOGO: { Label: "LOGO", IsChecked: true, ColumnName: "LOGO" },
          NAME: {
            Label: "NAME",
            IsChecked: true,
            ColumnName: "ClientName",
           
          },
          CLIENTCODE: { Label: "CLIENT CODE", IsChecked: true, ColumnName: "ClientCode", class: "filterLoad", isSortLoading: false,isAscOrDesc: null },

          PROPERTIES: { Label: "PROPERTIES", IsChecked: true, ColumnName: "PropertyCount",class: "filterLoad",isSortLoading: false,isAscOrDesc: null },


          STATUS: { Label: "STATUS", IsChecked: true, ColumnName: "StatusId",class: "filterLoad",isSortLoading: false,isAscOrDesc: null },


        },
       
        filterObj: {
        
          SortBy: null,
          SortOrder: null,
       
        },

      };
    },
    methods: {

      imageURLS(imgGuid) {
        let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid)
        if(isBase64){
          return imgGuid;
        }
        return  this.apiUrl + '/downloadImage/' + imgGuid+'/430x300';
      },
     
      ascSort(sortBy, sortOrder) {
        let vm = this;
        // for (let index = 0; index < vm.headerColumnList.length; index++) {
        //          console.log("headerColumnList[0]", headerColumnList[index])                       
        //  }
        // vm.viewSaveObject.sortColumn = sortBy;
        // vm.viewSaveObject.sortOrder = sortOrder;

        vm.filterObj.SortBy = sortBy;
        vm.filterObj.SortOrder = sortOrder;

        vm.getClientDetailList();
        for (var i in vm.headerColumnList) {

          var obj = vm.headerColumnList[i];
          console.log("obj", obj)
          if (sortBy.toString() === obj.ColumnName) {
            console.log("obj.ColumnName", obj.ColumnName);
            vm.headerColumnList[i].isSortLoading = true;
            vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
          }
        }

        //vm.getReservationsList(vm.propertyId, vm.UnitTypeId, vm.ViewListId, SortBy, SortOrder, vm.sourceID);
      },
      clientDetail() {
        //   window.location.href = this.$store.state.uiPageName + "#clientDetails/-1";
        this.$router.push("clientDetail/-1");
      },
      exportToExcel: function () { },

      getClientDetailList() {
        let scope = this;
        console.log("In get client detail list");
        this.$store.dispatch("dataRequestHandler", {
          key: "GetClientList",
          params: {
            ModuleAction: "GetClientList",
            // params: scope.filterObj,
            
          },
          callback(err, response) {
            if (response) {
              
              scope.clientList = response.recordsets[1];
              // scope.clientList = response;
              console.log("getClientDetailList", response.recordsets[1]);
              console.log("getClientDetailList", scope.clientList);

            } else {
              console.log(err);
            }
          }
        });
      },
      viewClientDetailById(ClientId) {
        console.log("client id " + ClientId);
        //    window.location.href = this.$store.state.uiPageName + "#clientDetails/" + ClientId;
        this.$router.push("/clientDetail/" + ClientId);
      },
      switchView() {
        if (this.listType === "list") {
          this.listType = "card";
        }
        else {
          this.listType = "list";
        }
      }
    },
    computed: {
      fncIsClientList(){
        let vm = this;
        if(vm.$store.state.userEntitlementList.hasOwnProperty("fncClientList")){
          console.log("clientNew =>",vm.$store.state.userEntitlementList);
          let fncClientList =  vm.$store.state.userEntitlementList.fncClientList
          console.log("fncClientNew", fncClientList)
          return fncClientList;            
        }
        return null;        
      },
      fncIsClientDelete(){
        let vm = this;
        if(vm.$store.state.userEntitlementList.hasOwnProperty("fncClientDelete")){
          
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncClientDelete") ? vm.$store.state.userEntitlementList.fncClientDelete : null;
         
                     
        }
      },

      fncIsClientList() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncClientList")
        ) {
          // console.log("fncPropertyList =>",vm.$store.state.userEntitlementList);
          let fncClientList =
            vm.$store.state.userEntitlementList.fncClientList;
          // console.log("fncPropertyList", fncPropertyList)
          //return vm.$store.state.userEntitlementList.hasOwnProperty("fncPropertySave") ? vm.$store.state.userEntitlementList.fncPropertySave : null;
          return fncClientList;
        }
        return null;
      },
      fncIsClientNew(){
        let vm = this;
        if(vm.$store.state.userEntitlementList.hasOwnProperty("fncClientNew")){
          
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncClientNew") ? vm.$store.state.userEntitlementList.fncClientNew : null;
         
                     
        }
              
      },
      fncIsClientDetail(){
        let vm = this;
        if(vm.$store.state.userEntitlementList.hasOwnProperty("fncClientDetail")){
          
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncClientDetail") ? vm.$store.state.userEntitlementList.fncClientDetail : null;
         
                     
        }
      },
   
    fncIsClientSelect(){
      let vm = this;
        if(vm.$store.state.userEntitlementList.hasOwnProperty("fncClientSelect")){
          console.log("fncClientSelect =>",vm.$store.state.userEntitlementList);
          let fncClientSelect =  vm.$store.state.userEntitlementList.fncClientSelect
          console.log("fncClientSelect", fncClientSelect)
          return fncClientSelect;            
        }
        return null; 
    }
    },
    watch: {
      // clientId: function (value) {
      //     this.getData();
      // }
    },
    mounted() {
      //this.getData();
      console.log("clientlist mount");
      this.getClientDetailList();
    }
  };
</script>
