import Vue from 'vue'
import Router from 'vue-router'

//Reservations
// import Reservations from '../components/reservations/reservationListVue/reservationListVue.vue'
//Users
import UserList from '../components/userModule/userListModule/userListVue.vue'
import UserDetail from '../components/userModule/userDetailModule/userDetailVue.vue'
import UserProfile from '../components/userModule/userProfileComponentVue/userProfileComponentVue.vue'
import PropertyDetail from '../components/adminModule/propertyVueComponent/propertyDetailVue/propertyDetailVue.vue'
import PropertyList from '../components/adminModule/propertyVueComponent/propertyListVue/propertyListVue.vue'
import UnitList from '../components/unitModule/unitListVue/unitListVue.vue'
import UnitDetail from '../components/unitModule/unitDetailVue/unitDetailVue.vue'
import listManagement from '../components/listManagementModule/listManagementVue/listManagementVue.vue'
import tax from '../components/taxModule/taxVue/taxVue.vue'
import taxDetail from '../components/taxModule/taxDetailVue/taxDetailVue.vue'

import ledgerAccount from '../components/ledgerAccountModule/ledgerAccountVue/ledgerAccountVue.vue'

import ClientDetail from '../components/adminModule/clientVueComponent/clientDetailVue/clientDetailVue.vue'
import ClientList from '../components/adminModule/clientVueComponent/clientListVue/clientListVue.vue'

import IntegrationPage from '../components/IntegrationComponent/IntegrationComponent.vue'

import PaymentReports from '../components/PaymentReports/PaymentReports.vue'

import Dashboard from '../components/Dashboard/Dashboard.vue'
import SalesReport from '../components/Dashboard/SalesReport/SalesReport.vue'
import PaymentsReport from '../components/Dashboard/PaymentsReport/PaymentsReport.vue'

import RoleList from '../components/roles/roleList/roleList.vue'
import RoleDetail from '../components/roles/roleDetail/roleDetail.vue'

import ReservationDetail from "../components/reservations/reservationDetailVue/reservationDetailVue.vue"
import ReservationList from "../components/reservations/reservationListVue/reservationListVue.vue"
import tapeChartGrid from "../components/tapeChartModule/tapeChart/tapeChart.vue";

import UserPasswordValidate from "../components/userModule/userChangePassword/userChangePasswordVue.vue"

import guestProfileList from "../components/guestProfile/guestProfileListVue/guestProfileListVue.vue"
import guestProfileDetail from "../components/guestProfile/guestProfileDetailVue/guestProfileDetailVue.vue"
import map from '../components/adminModule/map/map.vue'
import Lightbox from '../components/Lightbox/Lightbox.vue'
import timePicker from '../components/timePicker/timepicker.vue'
import homePageComponent from '../components/homeModule/homePageComponent/homePageComponent.vue'

import DateRangePicker from '../components/DateRangePicker/components/DateRangePicker.vue'


import rateOverrideModule from "../components/ratesModule/rateOverrideModule/rateOverride.vue"
import rateOverrideList from "../components/ratesModule/rateOverrideList/rateOverrideList.vue"
// import rateOverrideList from "../components/ratesModule/rateOverrideList/rateOverrideList.vue"
import listview from "../components/ratesModule/ItemsInList/itemsinlist.vue"

import restrictionList from "../components/restrictionsModule/restrictionsList/restrictionsList.vue"
import restrictionDetail from "../components/restrictionsModule/restrictionsDetail/restrictionsDetail.vue"
import houseKeepingStatus from "../components/houseKeepingStatus/houseKeepingDetail.vue"

import roomInventoryDetail from "../components/roomInventory/roomInventoryDetail/roomInventoryDetail.vue"

import tapeChart from "../components/commonComponents/reactComponent/reactGrid.vue"
import rs from "../components/reservations/RecycleScroller/RecycleScroller.vue"
//import trailComponent from "../components/trailComponent/trailComponent.vue"


import bookingEngineList from "../components/BookingEngineSetups/BookingEngine/BookingEngineList/BookingEngineList.vue"
import bookingEnginedetail from "../components/BookingEngineSetups/BookingEngine/BookingEngineDetail/BookingEngineDetail.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/clientList',
      name: 'ClientList',
      component: ClientList
    },
    {
      path: '/newReservation/:ReservationId',
      name: 'ReservationDetail',
      component: ReservationDetail,
      props: {}
    },
    {
      path: '/ReservationList',
      name: 'ReservationList',
      component: ReservationList,
      props: {}
    },
    {
      path: '/',
      name: 'homePage',
      component: homePageComponent,
      props: {}
    },
    {
      path: '/userprofile',
      name: 'UserProfile',
      component: UserProfile,
      props: {}
    },
    {
      path: '/users',
      name: 'Users',
      component: UserList,
      props: {}
    },
    {
      path: '/userDetail/:userId',
      name: 'UserDetail',
      component: UserDetail,
      props: {}
    },
    {
      path: '/roles',
      name: 'RoleList',
      component: RoleList,
      props: {}
    },
    {
      path: '/integrationPage',
      name: 'IntegrationPage',
      component: IntegrationPage,
      props: {}
    },
    {
      path: '/PaymentReports',
      name: 'PaymentReports',
      component: PaymentReports,
      props: {}
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: Dashboard,
      props: {}
    },
    {
      path: '/SalesReport',
      name: 'SalesReport',
      component: SalesReport,
      props: {}
    },
    {
      path: '/PaymentsReport',
      name: 'PaymentsReport',
      component: PaymentsReport,
      props: {}
    },
    {
      path: '/roleDetail/:roleId',
      name: 'RoleDetail',
      component: RoleDetail,
      props: {}
    },
    {
      path: '/propertyList',
      name: 'PropertyList',
      component: PropertyList,
      props: {}
    },
    {
      path: '/propertyDetail/:propertyId',
      name: 'PropertyDetail',
      component: PropertyDetail,
      props: {}
    },
    {
      path: '/unitList',
      name: 'UnitList',
      component: UnitList,
      props: {}
    },

    {
      path: '/ledgerAccount',
      name: 'ledgerAccount',
      component: ledgerAccount,
      props: {}
    },

    {
      path: '/listManagement',
      name: 'listManagement',
      component: listManagement,
      props: {}
    },

    {
      path: '/tax',
      name: 'tax',
      component: tax,
      props: {}
    },

    {
      path: '/taxDetail/:taxId/:propertyId/:statusId',
      name: 'taxDetail',
      component: taxDetail,
      props: {}
    },

    // {
    //   path: '/unitDetail/:propertyId',
    //   name: 'UnitDetail',
    //   component: UnitDetail,
    //   props: {}
    // },
    {
      path: '/unitDetail/:unitId/:propertyId',
      name: 'UnitDetail',
      component: UnitDetail,
    },
    {
      path: '/clientList',
      name: 'ClientList',
      component: ClientList,
      props: {}
    },
    {
      path: '/clientDetail/:clientId',
      name: 'ClientDetail',
      component: ClientDetail,
      props: {}
    },
    {
      path: '/rs',
      name: 'rs',
      component: rs,
      props: {}
    },



    {
      path: '/userValidate',
      name: "UserValidate",
      component: UserPasswordValidate,
    },
    {
      path: '/guestProfileList',
      name: 'GuestProfileList',
      component: guestProfileList,
      props: {}
    },
    {
      path: '/guestProfileDetail/:GuestProfileId/:PartyAddressId',
      name: 'GuestProfileListDetail',
      component: guestProfileDetail,
      props: {}
    },
    {
      path: '/map',
      name: 'googlemap',
      component: map,
      props: {}
    },
    {
      path: '/Lightbox',
      name: 'vue-easy-lightbox',
      component: Lightbox,
      props: {}
    },
    {
      path: '/DateRangePicker',
      name: 'date-range-picker',
      component: DateRangePicker,
      props: {}
    },
    {
      path: '/rateOverride/:RateId',
      name: 'RatesOverride',
      component: rateOverrideModule,
      props: {}
    },
    {
      path: '/timePicker',
      name: 'VueTimepicker',
      component: timePicker,
      props: {}
    },
    {
      path: '/rateOverrideList',
      name: 'RateOverrideList',
      component: rateOverrideList,
      props: {}
    },
    {
      path: '/listview',
      name: 'listview',
      component: listview,
      props: {}
    },
    {
      path: "/restrictionList",
      name: 'RestrictionList',
      component: restrictionList,
      props: {}
    },
    {
      path: "/restrictionDetail/:restrictionId",
      name: 'RestrictionDetail',
      component: restrictionDetail,
      props: {}
    },
    {
      path: "/houseKeepingStatus",
      name: 'HouseKeepingStatus',
      component: houseKeepingStatus,
      props: {}
    },
    {
      path: "/roomInventoryDetail",
      name: 'RoomInventoryDetail',
      component: roomInventoryDetail,
      props: {}
    },
    {
      path: "/tapechartGrid",
      name: "TapeChart",
      component: tapeChartGrid,
      props: {}
    },
    {
      path: "/calendarView",
      name: "CalendarView",
      component: tapeChart,
      props: {}
    },
    {
      path: "/bookingEngineList",
      name: "bookingEngineList",
      component: bookingEngineList,
      props: {}
    },

    {
      path: "/bookingEnginedetail/:beId",
      name: "bookingEnginedetail",
      component: bookingEnginedetail,
      props: {}
    },
    // 
    // {
    //   path: "/trial",
    //   name: "trial",
    //   component: trailComponent,
    //   props: {}      
    // }  
  ]
})
