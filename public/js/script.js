"use strict";

mapboxgl.accessToken = 'pk.eyJ1Ijoic3p0cnlrZXJ6IiwiYSI6ImNrMDhsemd1bTA1ajQzbm51dm90bHVoMDQifQ.E492sBpjVcJx072hp0OOyg';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11'
});

const marker = new mapboxgl.Marker({
    draggable: true
}).setLngLat([0, 0]).addTo(map);

map.addControl(new mapboxgl.NavigationControl());
const long = window.document.querySelector('#longitudeinput');
const lat = window.document.querySelector('#latitudeinput');

const onDragEnd = () =>{
    const LngLat = marker.getLngLat();
    long.value = `${LngLat.lng}`;
    lat.value = `${LngLat.lat}`;
}

marker.on('dragend', onDragEnd);

