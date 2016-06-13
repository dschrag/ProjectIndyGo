function getBikeStations(map) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://gbfs.bcycle.com/bcycle_pacersbikeshare/station_information.json', true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                createBikePins(map, obj.data);
                return obj.data;
            }
        }
    };
    xmlhttp.send(null);
}

function createBikePins(map, stations) {
    for (i = 0; i < 27; i++) {
        var myLatLng = {lat: stations.stations[i].lat, lng: stations.stations[i].lon};
        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: stations.stations[i].name,
            icon: 'images/BikeMarker.png',
            station_id: stations.stations[i].station_id,
            bikes_avail: 0,
            docks_avail: 0,
            addr: stations.stations[i].address,
            i: i
        });
        station_array[i] = marker;


        google.maps.event.addListener(marker, 'click', function () {
          if (typeof clickedStation != 'undefined') {
            clickedStation.setIcon('images/BikeMarker.png');
          }
            getBikeStatus(this);
            // map.panTo(this.position);
            // map.setCenter(this.position);
            console.log(this.position.lat());
            console.log(this.position.lng());
            openInfoBox(this.getTitle(), this.addr, this.bikes_avail, this.docks_avail);
            pos = this.position;
            clickedStation = this;
            clickedStation.setIcon('images/SelectedBikeMarker.png');
        });

    }
}

function getBikeStatus(marker) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://gbfs.bcycle.com/bcycle_pacersbikeshare/station_status.json', false);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                var obj = JSON.parse(xmlhttp.responseText);
                for (var i = 0; i < obj.data.stations.length; i++) {
                    if (obj.data.stations[i].station_id === marker.station_id) {
                        marker.bikes_avail = obj.data.stations[i].num_bikes_available;
                        marker.docks_avail = obj.data.stations[i].num_docks_available;
                    }
                }
            }
        }
    };
    xmlhttp.send(null);
}

function getClosestBikeStation() {
  var closest = 99999;
  var closeststation = 0;

  for (var i = 0; i < station_array.length; i++) {
    var distance_lat = pos.lat - station_array[i].getPosition().lat();
    var distance_lng = pos.lng - station_array[i].getPosition().lng();
    var distance = Math.sqrt(distance_lat * distance_lat + distance_lng * distance_lng);
    if (distance < closest) {
      closest = distance;
      closeststation = i;
    }
  }

  console.log(station_array);
  console.log(closeststation);
  clickedStation = station_array[closeststation];
  getBikeStatus(station_array[closeststation]);
  openInfoBox(station_array[closeststation].getTitle(), station_array[closeststation].addr, station_array[closeststation].bikes_avail, station_array[closeststation].docks_avail);

  directionsService.route({
    origin: pos,
    destination: station_array[closeststation].getPosition(),
    travelMode: travel_mode
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  station_array[closeststation].setVisible(false);
}
