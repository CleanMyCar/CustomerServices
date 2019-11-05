<template>
  <div>
    <!-- <h1>Map is here</h1> -->
    <div id="map" class="h-250"></div>
  </div>
</template>

<style scoped>
  #map {
    margin: 0 auto;
    background: gray;
  }

  .h-250 {
    height: 250px;
  }
</style>
<script>  
  import Vue from 'vue';

  export default {
    name: "googleMaps",
    props: {
      'latitude': {
        type: Number,
        default() {
          return 0
        }
      },
      'longitude': {
        type: Number,
        default() {
          return 0
        }
      },
      'zoom': {
        type: Number,
        default() {
          return 14
        }
      },
    },
    mounted() {
      this.$markers = [];
      this.$latlngbounds = new google.maps.LatLngBounds();
      this.$map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(this.latitude, this.longitude),
        // zoom: this.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        // disableDefaultUI: true
        mapTypeControl: false,
        fullscreenControl: false
      });
      Vue.nextTick().then(() => {
        this.clearMarkers();
      });
    },
    created() {
      let vm = this;
      vm.$store.state.bus.$on('clear-markers', () => {
        this.clearMarkers();
        this.$markers = [];
      });
      vm.$store.state.bus.$on('add-marker', (data) => {
        console.log("data in map", data);
        var infowindow = new google.maps.InfoWindow();
        
        var marker, i;

        for (i = 0; i < data.latitudeLongitude.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(data.latitudeLongitude[i].latitude, data.latitudeLongitude[i].longitude),
            label: {
              text: data.latitudeLongitude[i].Label,
              color: "white",
              fontSize: "16px",
              fontWeight: "bold"
            },
            map: this.$map,
            icon: "src/content/images/map-marker.png"
          });

          // google.maps.event.addListener(marker, 'click', (function (marker, i) {
          //   return function () {
          //     // infowindow.setContent(data.latitudeLongitude[i].PropertyLatitude);
          //     infowindow.open(this.$map, marker);
          //   }
          // })(marker, i));
          this.$latlngbounds.extend(marker.position);
          this.$markers.push(marker);
        }
        var bounds = new google.maps.LatLngBounds();

        //Center map and adjust Zoom based on the position of all markers.
        this.$map.setOptions({ minZoom: data.MinZoomValue, maxZoom: data.MaxZoomValue });
        this.$map.setCenter(this.$latlngbounds.getCenter());
        this.$map.fitBounds(this.$latlngbounds);


      });
    },
    data() {
      return {};
    },
    methods: {
      makeMarker(latitude, longitude, zoom) {
        // this.zoom = zoom;
        // var locationRio = {lat: -22.915, lng: -43.197};
        // var map = new google.maps.Map(document.getElementById('map'), {
        //   zoom: 13,
        //   center: locationRio,
        //   gestureHandling: 'cooperative'
        // });
        console.log("zoom", zoom)
        this.$map = new google.maps.Map(document.getElementById('map'), {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: zoom
        });
        return new google.maps.Marker({
          position: new google.maps.LatLng(latitude, longitude),
          icon: null,
          map: this.$map,
          title: null,
        });
      },
      clearMarkers() {
        for (let i = 0; i < this.$markers.length; i++) {
          this.$markers[i].setMap(null);
        }
      }
    }
  }
</script>


<!-- var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    } -->