import { useEffect } from "react";
import L from "leaflet";
import PropTypes from 'prop-types';

const LeafletMap = ({ venues }) => {
  useEffect(() => {
    console.log("LeafletMap received venues:", venues);
    
    const map = L.map("mi_mapa").setView([37.3886, -5.9823], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    if (venues && venues.length > 0) {
      venues.forEach(venue => {
        if (venue.latitude && venue.longitude) {
          L.marker([venue.latitude, venue.longitude])
            .addTo(map)
            .bindPopup(`<b>${venue.name}</b><br>${venue.address}`);
        }
      });
      
      if (venues.some(venue => venue.latitude && venue.longitude)) {
        const bounds = venues
          .filter(venue => venue.latitude && venue.longitude)
          .map(venue => [venue.latitude, venue.longitude]);
        
        if (bounds.length > 0) {
          map.fitBounds(bounds);
        }
      }
    }

    map.on("click", function (e) {
      console.log("Map clicked at:", e.latlng);
    });

    return () => {
      map.remove();
    };
  }, [venues]);

  return (
    <div
      id="mi_mapa"
      style={{ width: "100%", height: "500px", marginTop: "30px" }}
    ></div>
  );
};

LeafletMap.propTypes = {
  venues: PropTypes.array
};

LeafletMap.defaultProps = {
  venues: []
};

export default LeafletMap;