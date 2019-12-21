import Vue from 'vue';
import App from './App.vue';
import router from './router';
import HeaderMenu from './components/homeModule/headerComponent/headerComponent.vue';
// import LeftMenu from './components/homeModule/leftMenuComponent/leftMenuComponent.vue';
import scss from './content/scssStyles.scss';
import { store } from "./store/store";
import datePickerComponent from "./components/datePicker/datePicker.vue";
import pageLoadingComponent from "./components/pageLoadingComponent/pageLoading.vue";
import googlemap from "./components/adminModule/map/map.vue"
import tagComponent from "./components/commonComponents/tagComponent/tagComponent.vue";
import Lightbox from './components/Lightbox/Lightbox.vue';
import timepicker from './components/timePickerGridView/timePickerGridView.vue';
import DateRangePicker from './components/DateRangePicker/components/DateRangePicker';

import googleMaps from './components/googleMapsComponent/googleMapsComponent.vue';
import addMarker from './components/googleMapsComponent/addMarker.vue';

import VueGoogleAutocomplete from './components/VueGoogleAutocomplete.vue';

import userProfilePanel from './components/userProfilePanel/userProfilePanel.vue'
import orderItemComponent from './components/myaccount/orderItemComponent/orderItemComponent.vue'
import vehicleAddComponent from './components/myaccount/vehicleAddComponent/vehicleAddComponent.vue'
import adminHomePage from './components/homeModule/adminHomePageComponent/adminHomePageComponent.vue'
import servicePersonHomePage from "./components/servicePersonComponents/servicePersonHomePageComponent/servicePersonHomePageComponent.vue"
import assignPersonComponent from "./components/homeModule/adminHomePageComponent/assignPersonComponent/assignPersonComponent.vue"
import quantityComponent from "./components/commonComponents/quantityComponent/quantityComponent.vue"
import addToCartComponent from "./components/commonComponents/addToCartComponent/addToCartComponent.vue"
import userCartPanel from "./components/myaccount/userCartPanel/userCartPanel.vue"
import deleteConfirmationPopup from "./components/commonComponents/deleteConfirmationPopup/deleteConfirmationPopup.vue"

Vue.component(datePickerComponent.name, datePickerComponent);
Vue.component(pageLoadingComponent.name, pageLoadingComponent);
Vue.component(googlemap.name, googlemap);
Vue.component(tagComponent.name, tagComponent);
Vue.component(Lightbox.name, Lightbox);
Vue.component(timepicker.name, timepicker);
Vue.component(DateRangePicker.name, DateRangePicker);
Vue.component(googleMaps.name, googleMaps);
Vue.component(addMarker.name, addMarker);
Vue.component(VueGoogleAutocomplete.name, VueGoogleAutocomplete);
Vue.component(userProfilePanel.name, userProfilePanel);
Vue.component(orderItemComponent.name, orderItemComponent);
Vue.component(vehicleAddComponent.name, vehicleAddComponent)
Vue.component(adminHomePage.name, adminHomePage)
Vue.component(servicePersonHomePage.name, servicePersonHomePage)
Vue.component(assignPersonComponent.name, assignPersonComponent)
Vue.component(quantityComponent.name, quantityComponent);
Vue.component(addToCartComponent.name, addToCartComponent);
Vue.component(userCartPanel.name, userCartPanel);
Vue.component(deleteConfirmationPopup.name, deleteConfirmationPopup)

new Vue({
  el: '#app',
  //render: h => h(App),
  router,
  template: '<App/>',
  store,
  components: { App }
});

new Vue({
  el: '#headerMenu',
  //render: h => h(App),
  router,
  template: '<HeaderMenu/>',
  store,
  bus: "bus",
  components: { HeaderMenu }
});

// new Vue({
//   el: '#leftMenuPanel',
//   //render: h => h(App),
//   router,
//   template: '<LeftMenu/>',
//   store,
//   bus: "bus123",
//   components: { LeftMenu }
// });

