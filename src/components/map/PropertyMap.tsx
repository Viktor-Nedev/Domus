import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize Mapbox
    mapboxgl.accessToken = mapboxToken;

    // Create map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
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

  if (!mapboxToken) {
    return (
      <div className={`${className} flex items-center justify-center border border-dashed border-muted-foreground/40 bg-muted/30 p-6 text-center`}>
        <p className="text-sm text-muted-foreground">
          Map preview is unavailable because `VITE_MAPBOX_API_KEY` is not configured.
        </p>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
};
