import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Property } from '@/types';

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

interface EmergencyHousingMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  className?: string;
}

export const EmergencyHousingMap: React.FC<EmergencyHousingMapProps> = ({ 
  properties, 
  selectedProperty,
  onPropertySelect,
  className = 'w-full h-[600px] rounded-lg'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [23.3219, 42.6977], // Default to Sofia
      zoom: 10
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (properties.length === 0) return;

    // Add markers for each property
    const bounds = new mapboxgl.LngLatBounds();

    const parseCoord = (value: any) => {
      if (value === null || value === undefined) return NaN;
      const normalized = String(value).replace(',', '.');
      return Number.parseFloat(normalized);
    };

    properties.forEach(property => {
      const lat = parseCoord(property.latitude);
      const lng = parseCoord(property.longitude);

      if (Number.isNaN(lat) || Number.isNaN(lng)) return;

      // Create marker
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = property.id === selectedProperty?.id ? '#D4AF37' : '#800020';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <strong>${property.title}</strong><br/>
                <span class="text-sm">${property.city}, ${property.country}</span>
              </div>
            `)
        )
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onPropertySelect(property);
      });

      markers.current.push(marker);
      bounds.extend([lng, lat]);
    });

    // Fit map to show all markers
    if (properties.length > 0) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [properties, selectedProperty, onPropertySelect]);

  if (!mapboxToken) {
    return (
      <div className={`${className} flex items-center justify-center border border-dashed border-muted-foreground/40 bg-muted/30 p-6 text-center`}>
        <p className="text-sm text-muted-foreground">
          Map disabled: set <code>VITE_MAPBOX_API_KEY</code> to view shelters on the map.
        </p>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
};
