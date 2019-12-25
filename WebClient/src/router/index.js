import Vue from 'vue'
import Router from 'vue-router'

//Reservations
// import Reservations from '../components/reservations/reservationListVue/reservationListVue.vue'
//Users
import UserList from '../components/userModule/userListModule/userListVue.vue'
import UserDetail from '../components/userModule/userDetailModule/userDetailVue.vue'
import UserProfile from '../components/userModule/userProfileComponentVue/userProfileComponentVue.vue'

import UserPasswordValidate from "../components/userModule/userChangePassword/userChangePasswordVue.vue"

import map from '../components/adminModule/map/map.vue'
import Lightbox from '../components/Lightbox/Lightbox.vue'
import timePicker from '../components/timePicker/timepicker.vue'
import homePageComponent from '../components/homeModule/homePageComponent/homePageComponent.vue'

import DateRangePicker from '../components/DateRangePicker/components/DateRangePicker.vue'
import myAccountHome from '../components/myaccount/myaccountHome/myAccountHome.vue'
import purchaseService from '../components/services/purchaseService/purchaseService.vue'
import mysubscriptions from "../components/myaccount/mysubscriptions/mysubscriptions.vue"
import myOrders from "../components/myaccount/myOrders/myOrders.vue"
import myProducts from "../components/myaccount/myProducts/myProducts.vue"
import assignServiceComponent from "../components/adminModule/assignServiceComponent/assignServiceComponent.vue"
import manageServices from "../components/adminModule/manageServicesComponent/manageServicesComponent.vue"
import serviceDetailComponent from "../components/adminModule/serviceDetailComponent/serviceDetailComponent.vue"
import addAmountToWallet from "../components/adminModule/addAmountToWallet/addAmountToWallet.vue"
Vue.use(Router);

export default new Router({
  routes: [    
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
      path: '/userValidate',
      name: "UserValidate",
      component: UserPasswordValidate,
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
      path: '/myAccount',
      name: 'myAccountHome',
      component: myAccountHome,
      props: {}
    },
    {
      path: '/purchaseService/:serviceId/:serviceType',
      name: 'purchaseService',
      component: purchaseService,
      props: {}
    },
    {
      path: '/mysubscriptions',
      name: 'mysubscriptions',
      component: mysubscriptions,
      props: {}
    },
    {
      path: '/myOrders',
      name: 'myOrders',
      component: myOrders,
      props: {}
    },
    {
      path: '/myProducts',
      name: 'myProducts',
      component: myProducts,
      props: {}
    },
    {
      path: '/assignService/:serviceType',
      name: 'assignServiceComponent',
      component: assignServiceComponent
    },
    {
      path: '/manageServices',
      name: 'manageServicesComponent',
      component: manageServices
    },{
      path: '/serviceDetail/:serviceId',
      name: 'serviceDetailComponent',
      component:serviceDetailComponent
    },
    {
      path: '/addAmountToWallet',
      name: 'addAmountToWallet',
      component: addAmountToWallet
    }
  ]
})
