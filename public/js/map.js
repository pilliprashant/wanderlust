 mapboxgl.accessToken = maptoken;
    //   const map = new mapboxgl.Map({
    //       container: 'map', // container ID
    //       center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //       zoom: 9 // starting zoom
    //   });
    //   const marker1 = new mapboxgl.Marker({color:"red"})
    //   .setLngLat(coordinates) //listing.geometry.coordinates
    //   //as listing.geometry.coordinates is not acessbile in map.js we store it in coordinates in show.ejs
    //   .addTo(map);
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
    //Create an img or div element for your icon.
    //Use it in place of the default marker.
    // Create a custom Airbnb-style icon
    const airbnbIcon = document.createElement('img');
    airbnbIcon.src = 'https://i.postimg.cc/wBXQn0Xv/airbnb-4494647.png'; // Replace with your preferred Airbnb icon URL
    airbnbIcon.style.width = '40px';
    airbnbIcon.style.height = '40px';
    
    // Add the custom marker to the map
    const marker1 = new mapboxgl.Marker({ element: airbnbIcon })
        .setLngLat(listing.geometry.coordinates) // listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset: 25 })
         .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be Provided After Booking</p>`))
        .addTo(map);
    
 