
var selected_bus;


		function createBusPins(map, livebus) {
      for (i = 0; i < bus_array.length; i++) {
        bus_array[i].setMap(null);
      }
			for (i = 0; i < livebus.length; i++) {
				var myLatLng = livebus[i].pos;
				var marker = new google.maps.Marker({
					position: {lat: Number(livebus[i].pos.lat), lng: Number(livebus[i].pos.lng)},
					map: map,
					title: livebus[i].vehicle,
					icon: 'images/BusMarker.png',
          trip_id: livebus[i].trip_id
				});

				bus_array[i] = marker;

				google.maps.event.addListener(marker, 'click', function () {
          if (typeof selected_bus != 'undefined') {
              selected_bus.setIcon('images/BusMarker.png');
          }
          selected_bus = this;
          selected_bus.setIcon('images/SelectedBusMarker.png');
          getRouteURL(this);
	        pos = this.position;
				});

			}
		}

		function readDropbox()
		{
        console.log("Running");
				var xmlhttp = new XMLHttpRequest();
        var gtfsdb = 'https://dl.dropbox.com/s/o5ajnzozjend26q/gtfs_data.json?dl=1';
        var gtfsstatic = 'gtfs/gtfs_data.json';
				xmlhttp.open('GET', gtfsstatic, true);
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

    function getRouteURL(bus) {
      console.log(bus.trip_id);

      var i = 0, k = 0;
      var trip_obj, route;

			if (true) {
				var routeslocal = 'gtfs/routes.json';
				var tripslocal = 'gtfs/trips.json';
				var shapeslocal = 'gtfs/shapes.json';
			} else {
				var routeslocal = 'https://dl.dropbox.com/s/nhu05hzsdfpkze2/routes.json?dl=1';
				var tripslocal = 'https://dl.dropbox.com/s/p5pywu0iyeojtz2/trips.json?dl=1';
				var shapeslocal = 'https://dl.dropbox.com/s/wsitajwapw4rgmh/shapes.json?dl=1';

			}



      loadJSON(function(response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);

        while(actual_JSON[i].trip_id != bus.trip_id) {
          i++;
        }

        trip_obj = actual_JSON[i];
        console.log(actual_JSON[i]);

        loadJSON(function(response) {
          var route_json = JSON.parse(response);
          while(route_json[k].route_id != trip_obj.route_id) {
            k++;
          }
          route = route_json[k];
          console.log(route_json[k]);
          var url = 'http://www.indygo.net/route/' + route.route_short_name +
                    "-" + route.route_long_name.replace(/ /g, '-').replace(/\//, '-') + '/';
          bus.url = url;
          openInfoBoxBus(bus);
          console.log(url);
        }, routeslocal);

        loadJSON(function(response) {
          var shapes_json = JSON.parse(response);
          var shapes_array = [];
					var latlng_array = [];

					var latlng;
          for (var x = 0; x < shapes_json.length; x++) {
            if (shapes_json[x].shape_id == trip_obj.shape_id) {
              shapes_array.push(shapes_json[x]);
							latlng_array.push({lat: shapes_json[x].shape_pt_lat, lng: shapes_json[x].shape_pt_lon});

						}
          }
          console.log(latlng_array);
					busPath.setMap(null);

				 	busPath.setPath(latlng_array);
				 	busPath.setMap(map);

        }, shapeslocal);
      }, tripslocal);




    }

    function loadJSON(callback, fd) {

       var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
       xobj.open('GET', fd, true);
       xobj.onreadystatechange = function () {
             if (xobj.readyState == 4 && xobj.status == "200") {
               // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
               callback(xobj.responseText);
             }
       };
       xobj.send(null);
    }

    function openInfoBoxBus(bus) {
        document.getElementById("mapContainer").style.height= '65vh';
        document.getElementById("map").style.height= '58%';

        document.getElementById("infoBx").innerHTML = "IndyGo Bus:<div class='tableTitle'>"+bus.title+"</div>"+"<br><span id='dist'>N/A</span> Miles Away<br><div class='buttons'><pre><span onclick='closeInfoBox()'>Close</span>                            <span onclick='openRouteSite()'>Directions</span></pre></div>";

        infoBoxDirections(false);

    }

    function openRouteSite() {
      console.log(selected_bus.url);
      document.getElementById("iframediv").style.display = 'inline';
      document.getElementById("routebrowser").src = selected_bus.url;

      function closeControl(controlDiv, map) {

          // Set CSS for the control border.
          var controlUI = document.createElement('div');
          //controlUI.style.backgroundColor = '#fff';
          controlUI.style.cursor = 'pointer';
  				controlUI.style.backgroundImage = 'url(images/Close.png)';
          // controlUI.style.backgroundColor = '#002E61';
  				controlUI.style.width = '61px';
  				controlUI.style.height = '55.5px';
          controlUI.style.marginTop = '65px';
          controlUI.title = 'Click to recenter the map';
          controlDiv.appendChild(controlUI);

          // Setup the click event listeners: simply set the map to Chicago.
          controlUI.addEventListener('click', function() {
  					console.log("Clicked!");
          	closeIframe();
          });

        }

        var closeControlDiv = document.createElement('div');
        var closeControl = new closeControl(closeControlDiv, map);

        closeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(closeControlDiv);
    }

    function closeIframe() {
      document.getElementById("mapContainer").style.height= '100vh';
      document.getElementById("map").style.height= '72%';

      var frame = document.getElementById("iframediv").style.display = 'none';
      map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear();
      frame.parentNode.removeChild(frame);
    }
