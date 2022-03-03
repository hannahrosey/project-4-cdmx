// Get data and load to map
mapboxgl.accessToken = "pk.eyJ1IjoiaGFubmFocm9zZXkiLCJhIjoiY2t6aG5ocmh0NDNvdzJvbmZxMG44czVyayJ9.GfvFPfGH_vdPxHOIGVGEPg"

// lngLat for the fountain in Washington Square Park
var cdmxCenter = [-99.173191,19.404092]

$.getJSON('./data/airbnb_data.geojson', function(abnbData) {
  var map = new mapboxgl.Map({
    container: 'mapContainer', // HTML container id
    style: 'mapbox://styles/mapbox/dark-v9', // style URL
    center: cdmxCenter, // starting position as [lng, lat]
    zoom: 9,

    });

  // add airbnb data source
  map.on('load', function() {
    map.addSource('cdmx-neighborhoods', {
        type: 'geojson',
        data: abnbData
      });
    // add 2018 layer
    map.addLayer({
        id: 'cdmx-neighborhoods-2018',
        type: 'fill',
        source: 'cdmx-neighborhoods',
        layout: {
          visibility: 'visible',
        },
        paint: {
          'fill-outline-color':'#ccc',
          'fill-opacity':.05,
          'fill-color':[
          'interpolate',
            ['linear'],
            ['get', 'total_reviews_2018'],
            0,
            '#feebe2',
            50,
            '#fbb4b9',
            100,
            '#f768a1',
            500,
            '#c51b8a',
            1000,
            '#7a0177'
            ],
        }
      });
    // add 2019 layer
    map.addLayer({
        id: 'cdmx-neighborhoods-2019',
        type: 'fill',
        source: 'cdmx-neighborhoods',
        layout: {
          visibility: 'none',
        },
        paint: {
          'fill-outline-color':'#ccc',
          'fill-opacity':.05,
          'fill-color':[
          'interpolate',
            ['linear'],
            ['get', 'total_reviews_2019'],
            0,
            '#feebe2',
            50,
            '#fbb4b9',
            100,
            '#f768a1',
            500,
            '#c51b8a',
            1000,
            '#7a0177'
            ],
        }
      });
    // add 2020 layer
    map.addLayer({
        id: 'cdmx-neighborhoods-2020',
        type: 'fill',
        source: 'cdmx-neighborhoods',
        layout: {
          visibility: 'none',
        },
        paint: {
          'fill-outline-color':'#ccc',
          'fill-opacity':.05,
          'fill-color':[
          'interpolate',
            ['linear'],
            ['get', 'total_reviews_2020'],
            0,
            '#feebe2',
            50,
            '#fbb4b9',
            100,
            '#f768a1',
            500,
            '#c51b8a',
            1000,
            '#7a0177'
            ],
        }
      });
    // add 2021 layer
    map.addLayer({
        id: 'cdmx-neighborhoods-2021',
        type: 'fill',
        source: 'cdmx-neighborhoods',
        layout: {
          visibility: 'none',
        },
        paint: {
          'fill-outline-color':'#ccc',
          'fill-opacity':.05,
          'fill-color':[
          'interpolate',
            ['linear'],
            ['get', 'total_reviews_2021'],
            0,
            '#feebe2',
            50,
            '#fbb4b9',
            100,
            '#f768a1',
            500,
            '#c51b8a',
            1000,
            '#7a0177'
            ],
        }
      });

    // add year selector interactivity
    // initialize variable that holds the year currently being displayed
    var visible_year = 2018
    // update map layer when slider changes and set new value of visible_year
    $('#slider').change(function() {
      // if layer is already visible, no change;
      // if it is not visible, turn it on and turn off all the other layers
      if ($(this)[0].value != visible_year){
        map.setLayoutProperty('cdmx-neighborhoods-' + visible_year,'visibility','none');
        map.setLayoutProperty('cdmx-neighborhoods-' + $(this)[0].value,'visibility','visible');
      }
      visible_year = $(this)[0].value;
    });

    // Create a popup with neighborhood name
    const popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
    });

    // when neighborhood is clicked, display information on the sidebar
    // query the features around the click to handle changing visible layers
    // source: https://docs.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures-around-point/
    map.on('click', function(e) {
      const bbox = [
        [e.point.x - 1, e.point.y - 1],
        [e.point.x + 1, e.point.y + 1]
      ];
      // find features intersecting the bounding box.
      var visible_layer = 'cdmx-neighborhoods-'+visible_year;
      var selectedFeatures = map.queryRenderedFeatures(bbox, {
        layers: [visible_layer]
      });
      // get neighborhood and review information for each feature
      popup_coords = [selectedFeatures[0].properties.longitude,selectedFeatures[0].properties.latitude]
      var name = selectedFeatures[0].properties.neighbourhood;
      var _2018 = numeral(selectedFeatures[0].properties.total_reviews_2018).format('0,0');
      var _2019 = numeral(selectedFeatures[0].properties.total_reviews_2019).format('0,0');
      var _2020 = numeral(selectedFeatures[0].properties.total_reviews_2020).format('0,0');
      var _2021 = numeral(selectedFeatures[0].properties.total_reviews_2021).format('0,0');

      // display neighborhood name in popup
      var popupContent = `
      <p><strong>Neighborhood:</strong> ${name}</p>
      `

      // add popup to map
      popup.setLngLat(popup_coords).setHTML(popupContent).addTo(map);

      // add table of reviews data to sidebar
      $('.neighborhood-info').html(`
          <h5>Neighborhood: <i>${name}</i><h5>
          <table>
            <tr>
              <th>Year</th>
              <th>Total AirBnB Reviews</th>
            </tr>
            <tr>
              <td>2018</td>
              <td>${_2018}</td>
            </tr>
            <tr>
              <td>2019</td>
              <td>${_2019}</td>
            </tr>
            <tr>
              <td>2020</td>
              <td>${_2020}</td>
            </tr>
            <tr>
              <td>2021</td>
              <td>${_2021}</td>
            </tr>
          </table>
            `);
          });
  });
});
