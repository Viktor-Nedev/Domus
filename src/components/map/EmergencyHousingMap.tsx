import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Property } from '@/types';

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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox
    const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;
    if (!mapboxToken) {
      console.error('Missing Mapbox token. Set VITE_MAPBOX_API_KEY in your environment.');
      return;
    }
    mapboxgl.accessToken = mapboxToken;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [23.3219, 42.6977], // Default to Sofia
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    if (properties.length === 0) return;

    // Add markers for each property
    const bounds = new mapboxgl.LngLatBounds();

    properties.forEach(property => {
      if (!property.latitude || !property.longitude) return;

      const lat = typeof property.latitude === 'string' ? parseFloat(property.latitude) : property.latitude;
      const lng = typeof property.longitude === 'string' ? parseFloat(property.longitude) : property.longitude;

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

  return <div ref={mapContainer} className={className} />;
};
