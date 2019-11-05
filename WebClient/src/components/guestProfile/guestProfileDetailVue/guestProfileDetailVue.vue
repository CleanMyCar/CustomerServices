<template src="./guestProfileDetailVue.template.html"></template>
<script>
    export default {
        // options
        name: "guestProfileDetailComponent",
        props: [],
        data() {
            return {
                searchCity: "",
                cityList:[],
                selectedCityObj: {},
                selectedStateAndCountry: {},
                guestInfo:{}

            };
        },
        methods: {
            onChangeCity: function(CityId){
            let vm = this;
            $('.searchResultsCities').hide();
            console.log("in change method", CityId)
            vm.$store.dispatch("dataRequestHandler", {
            key: "GetCityStateCountryById",
            params:{
            ModuleAction: "GetCityStateCountryById",
            CityId : CityId
          },
          callback: function(err, response){
            if(err){
              return;
            }
            if(response){
              console.log("response in GetCityStateCountryById", response);
              let selectedoptions = null;
              selectedoptions = response;
              // selectedoptions.CountryId = response.CountryId;
              // selectedoptions.StateId = response.StatusId;
              // selectedoptions.StateName = response.StateName;
              vm.selectedStateAndCountry = selectedoptions;
              vm.searchCity = selectedoptions.CityName
              console.log("vm.selectedCountryObj.CountryName", vm.selectedStateAndCountry.CountryName)
              console.log("vm.selectedStateObj.StateName", vm.selectedStateAndCountry.StateName)
            }
          }
        })
      },
      saveGuestProfile(){
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
            key: "SaveGuestProfile",
            params:{
            ModuleAction: "SaveGuestProfile",
            GuestProfileId: vm.$route.params.GuestProfileId,
            // PropertyId
            // ClientId
            GuestFirstName: vm.guestInfo.GuestFirstName,
            GuestLastName: vm.guestInfo.GuestLastName,
            PhoneNumber: vm.guestInfo.PhoneNumber,
            Email: vm.guestInfo.Email,
            CityId: vm.selectedStateAndCountry.CityId,
            StateId: vm.selectedStateAndCountry.StateId,
            CountryId: vm.selectedStateAndCountry.CountryId,
            AddressTypeId : 1,
            PhoneCountryCode: null,
            PhoneAreaCode : null,
            PhoneExtension: null,
            FaxCountryCode: null,
            FaxAreaCode:null,
            FaxNumber: null,
            FaxExtension: null,
            Address1: vm.selectedStateAndCountry.CountryName,
            Address2: null,
            Address3: null,
            // TerritoryId: null,
            PostalCode: null,
            // UpdatedBy
            PartyAddressId: vm.$route.params.PartyAddressId,
           
          },
          callback: function(err, response){
            if(err){
              return;
            }
            if(response){
              
            }
          }
        })
      },
 
        },
        computed: {
            
        },
        watch: {
            searchCity(newValue, oldValue) {
            let vm = this;
            console.log("Firing search", newValue.length);
            if(newValue.length > 0){
                vm.$store.dispatch("dataRequestHandler", 
                { key: "GetCitySearch",
                params: {
                ModuleAction: "GetCitySearch",
                CityName: newValue
                },
            callback: function(err, response){
            if(err){
                return;
            }
            if(response){
                console.log("response in search city", response);
                vm.cityList = response
            }
        }
      });
      }    
    },
        },
        mounted(){
            
        }
    }

</script>