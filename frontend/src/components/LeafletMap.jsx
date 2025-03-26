import { useEffect } from "react";
import L from "leaflet";

const LeafletMap = () => {
  useEffect(() => {
    const map = L.map("mi_mapa").setView([37.3886, -5.9823], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // L.marker([37.3913, -5.9942])
    //   .addTo(map)
    //   .bindPopup("Castillo de Maxi");
    // L.marker([37.3913, -5.9942])
    //   .addTo(map)
    //   .bindPopup("Mongo Mangos");

    map.on("click", function (e) {
      alert("Posición: " + e.latlng);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      id="mi_mapa"
      style={{ width: "100%", height: "500px", marginTop: "30px" }}
    ></div>
  );
};

export default LeafletMap;