
		function createBusPins(map, livebus) {
			for (i = 0; i < livebus.length; i++) {
				var myLatLng = livebus[i].pos;
				var marker = new google.maps.Marker({
					position: {lat: Number(livebus[i].pos.lat), lng: Number(livebus[i].pos.lng)},
					map: map,
					title: livebus[i].vehicle,
					icon: 'images/BusMarker.png'
                //    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
				});
				bus_array[i] = marker;

				google.maps.event.addListener(marker, 'click', function () {
					getBikeStatus(this);
	                openInfoBox(this.title, this.addr, this.title, null, null);
	                pos = this.position;
				});

			}
		}

		function readDropbox(sURL)
		{
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open('GET', sURL, true);
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4) {
						if(xmlhttp.status == 200) {
		          console.log(xmlhttp.responseText);
							createBusPins(map, parseGTFS(xmlhttp.responseText));
							return;
						}
					}
				};
				xmlhttp.send(null);
		}

		function Trip(trip_id, lat, lng, time, vehicle) {
		    this.trip_id = trip_id;
		    this.pos = {lat: lat, lng: lng}
		    this.timestamp = time;
		    this.vehicle = vehicle;
		}

		function parseGTFS(response) {
		    var strarr = response.split("\n"); // remove spaces
		    //console.log(strarr);
		    var i = 0, k = 0;

		    // console.log(strarr[i+1].split("\"")[1]); // gets trip_id
		    // console.log(strarr[i+4].replace('\"', '').split(':')[1].replace(' ', '')); // gets latitude
		    // console.log(strarr[i+5].replace('\"', '').split(':')[1].replace(' ', '')); // gets longitude
		    // console.log(strarr[i+7].split(':')[1].replace(' ', '')); // gets timestamp
		    // console.log(strarr[i+9].split(' ')[3].replace("\"", '').replace("\"", '')); // gets vehicle label

		    var trip_array = [];

		    while (i+10 < strarr.length) {
		          var trip_id = strarr[i+1].split("\"")[1];
		          var lat = strarr[i+4].replace('\"', '').split(':')[1].replace(' ', '');
		          var lng = strarr[i+5].replace('\"', '').split(':')[1].replace(' ', '');
		          var time = strarr[i+7].split(':')[1].replace(' ', '');
		          var vehicle = strarr[i+9].split(' ')[3].replace("\"", '').replace("\"", '');

		         trip_array[k++] = new Trip(trip_id, lat, lng, time, vehicle);

		         i+=11;
		     }

		      console.log(trip_array);
		      return(trip_array);
		}
