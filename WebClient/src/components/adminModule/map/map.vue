<template src="./map.template.html"></template>

<script>
    //     export default {
    //         name: 'googlemap',
    //         props: ['name'],
    //         data: function () {
    //             return {
    //                 mapName: this.name + "-map",
    //             }
    //         },
    //         mounted: function () {
    //             const element = document.getElementById(this.mapName)
    //             const options = {
    //                 zoom: 14,
    //                 center: new google.maps.LatLng( 40.7128,  74.0060)
    //             }
    //             const map = new google.maps.Map(element, options);
    //         }

    //     };


    export default {
        name: 'googlemap',
        props: ['name'],
        data: function () {
            return {
                mapName: this.name + "-map",
                markerCoordinates: [{
                    latitude: 40.7128,
                    longitude: -74.0060
                }],
                map: null,
                bounds: null,
                markers: []
            }
        },
        mounted: function () {
            this.bounds = new google.maps.LatLngBounds();
            const element = document.getElementById(this.mapName)
            const mapCentre = this.markerCoordinates[0]
            const options = {
                center: new google.maps.LatLng(mapCentre.latitude, mapCentre.longitude)
            }
            this.map = new google.maps.Map(element, options);
            this.markerCoordinates.forEach((coord) => {
                const position = new google.maps.LatLng(coord.latitude, coord.longitude);
                const marker = new google.maps.Marker({
                    position,
                    map: this.map
                });
                this.markers.push(marker)
                this.map.fitBounds(this.bounds.extend(position))
            });
        }
    };
</script>
<style scoped>
    .google-map {
        /* width: 400px; */
        height: 400px;
        margin: 0 auto;
        border:1px solid grey;
        background: gray;
    }
</style>