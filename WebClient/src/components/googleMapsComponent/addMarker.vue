<template>  
    <div>
        <h1>Sidebar</h1>
        <input type="number" step="0.0001" class="form-control" v-model="latitude">
        <input type="number" step="0.0001" class="form-control" v-model="longitude">
        <input type="number" class="form-control" v-model="zoom">
        <button @click="addMarker" class="btn btn-danger">Add marker</button>
        <button @click="clearMarkers" class="btn btn-default">Clear markers</button>
    </div>
 </template>  
 <script>
 
  export default {
    name: "addMarker",
    data(){
      return {
        latitude: 0,
        longitude: 0,
        zoom: 100
      };
    },
    methods: {
      addMarker(){
        let vm = this;
        vm.$store.state.bus.$emit('add-marker', {
          latitude: this.latitude,
          longitude: this.longitude,
          zoom: this.zoom
        });
      },
      clearMarkers(){
        let vm = this;
        vm.$store.state.bus.$emit('clear-markers');
      }
    }
  }
 </script>  