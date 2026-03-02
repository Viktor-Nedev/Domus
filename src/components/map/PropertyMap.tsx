import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const OPEN_STREET_MAP_STYLE: mapboxgl.Style = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title?: string;
  className?: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ 
  latitude, 
  longitude, 
  title = 'Property Location',
  className = 'w-full h-[400px] rounded-lg'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    }

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxToken ? 'mapbox://styles/mapbox/streets-v12' : OPEN_STREET_MAP_STYLE,
      center: [longitude, latitude],
      zoom: 14
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    const marker = new mapboxgl.Marker({ color: '#D4AF37' })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<div class="p-2"><strong>${title}</strong></div>`)
      )
      .addTo(map.current);

    // Show popup on load
    marker.togglePopup();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, title, mapboxToken]);

  return <div ref={mapContainer} className={className} />;
};
