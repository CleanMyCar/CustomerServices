import Vue from 'vue';
import App from './App.vue';
import router from './router';
import HeaderMenu from './components/homeModule/headerComponent/headerComponent.vue';
import LeftMenu from './components/homeModule/leftMenuComponent/leftMenuComponent.vue';
import scss from './content/scssStyles.scss';
import { store } from "./store/store";
import datePickerComponent from "./components/datePicker/datePicker.vue";
import pageLoadingComponent from "./components/pageLoadingComponent/pageLoading.vue";
import googlemap from "./components/adminModule/map/map.vue"
import tagComponent from "./components/commonComponents/tagComponent/tagComponent.vue";
import Lightbox from './components/Lightbox/Lightbox.vue';
import timepicker from './components/timePickerGridView/timePickerGridView.vue';
import DateRangePicker from './components/DateRangePicker/components/DateRangePicker';
import tinymce from './components/TinymceVue.vue';

import googleMaps from './components/googleMapsComponent/googleMapsComponent.vue';
import addMarker from './components/googleMapsComponent/addMarker.vue';

import VueGoogleAutocomplete from './components/VueGoogleAutocomplete.vue';

import SalesReport from './components/Dashboard/SalesReport/SalesReport.vue'
import PaymentsReport from './components/Dashboard/PaymentsReport/PaymentsReport.vue'


Vue.component(datePickerComponent.name, datePickerComponent);
Vue.component(pageLoadingComponent.name, pageLoadingComponent);
Vue.component(googlemap.name, googlemap);
Vue.component(tagComponent.name, tagComponent);
Vue.component(Lightbox.name, Lightbox);
Vue.component(timepicker.name, timepicker);
Vue.component(DateRangePicker.name, DateRangePicker);
Vue.component(tinymce.name, tinymce);
Vue.component(googleMaps.name, googleMaps);
Vue.component(addMarker.name, addMarker);
Vue.component(SalesReport.name, SalesReport);
Vue.component(PaymentsReport.name, PaymentsReport);
Vue.component(VueGoogleAutocomplete.name, VueGoogleAutocomplete);


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

new Vue({
  el: '#leftMenuPanel',
  //render: h => h(App),
  router,
  template: '<LeftMenu/>',
  store,
  bus: "bus123",
  components: { LeftMenu }
});

