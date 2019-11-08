import Vue from 'vue'
import Router from 'vue-router'

//Reservations
// import Reservations from '../components/reservations/reservationListVue/reservationListVue.vue'
//Users
import UserList from '../components/userModule/userListModule/userListVue.vue'
import UserDetail from '../components/userModule/userDetailModule/userDetailVue.vue'
import UserProfile from '../components/userModule/userProfileComponentVue/userProfileComponentVue.vue'

import ClientDetail from '../components/adminModule/clientVueComponent/clientDetailVue/clientDetailVue.vue'
import ClientList from '../components/adminModule/clientVueComponent/clientListVue/clientListVue.vue'


import Dashboard from '../components/Dashboard/Dashboard.vue'

import UserPasswordValidate from "../components/userModule/userChangePassword/userChangePasswordVue.vue"

import guestProfileList from "../components/guestProfile/guestProfileListVue/guestProfileListVue.vue"
import guestProfileDetail from "../components/guestProfile/guestProfileDetailVue/guestProfileDetailVue.vue"
import map from '../components/adminModule/map/map.vue'
import Lightbox from '../components/Lightbox/Lightbox.vue'
import timePicker from '../components/timePicker/timepicker.vue'
import homePageComponent from '../components/homeModule/homePageComponent/homePageComponent.vue'

import DateRangePicker from '../components/DateRangePicker/components/DateRangePicker.vue'





Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/clientList',
      name: 'ClientList',
      component: ClientList
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
      path: '/Dashboard',
      name: 'Dashboard',
      component: Dashboard,
      props: {}
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
  ]
})
