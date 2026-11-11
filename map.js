// Inicializace mapy – střed ČR
const map = L.map('map').setView([49.8, 15.5], 7);

// Podkladová mapa
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom: 16
}).addTo(map);

// Načtení bodů z GeoJSONu
fetch('body.geojson')
  .then(response => {
    if (!response.ok) {
      throw new Error('Nepodařilo se načíst body.geojson (HTTP ' + response.status + ')');
    }
    return response.json();
  })
  .then(data => {
    const vrstva = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindPopup(
          '<h3>' + p.nazev + '</h3>' +
          '<p>' + p.popisek + '</p>'
        );
        layer.bindTooltip(p.nazev);
      }
    }).addTo(map);

    // Přizpůsobení výřezu všem bodům
    map.fitBounds(vrstva.getBounds(), { padding: [50, 50] });
  })
  .catch(err => console.error(err));
