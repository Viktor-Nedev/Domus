import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { EmergencyShelter } from '@/types/emergency';

interface EmergencyShelterMapProps {
  shelters: EmergencyShelter[];
  onShelterSelect?: (shelter: EmergencyShelter) => void;
}

export const EmergencyShelterMap: React.FC<EmergencyShelterMapProps> = ({
  shelters,
  onShelterSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const token = import.meta.env.VITE_MAPBOX_API_KEY;
    if (!token) {
      console.error('Missing Mapbox token. Set VITE_MAPBOX_API_KEY in your environment.');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 20],
      zoom: 2,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.once('load', () => {
      map.current?.resize();
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update markers when shelters change
  useEffect(() => {
    if (!map.current || shelters.length === 0) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each shelter
    shelters.forEach((shelter) => {
      const lng = Number(shelter.longitude);
      const lat = Number(shelter.latitude);

      if (isNaN(lng) || isNaN(lat)) {
        console.error('Invalid coordinates for shelter:', shelter.name);
        return;
      }

      // Create custom marker element with professional styling
      const el = document.createElement('div');
      el.className = 'emergency-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      el.style.display = 'block';
      el.style.transformOrigin = 'center bottom';
      el.style.pointerEvents = 'auto';
      
      // Professional pin-style marker design with yellow accent
      el.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" style="display: block;">
          <!-- Outer glow -->
          <circle cx="22" cy="22" r="21" fill="#D4AF37" opacity="0.15" />
          
          <!-- Main marker circle -->
          <circle cx="22" cy="22" r="18" fill="#FFFFFF" stroke="#D4AF37" stroke-width="3" 
                  filter="drop-shadow(0 3px 5px rgba(0,0,0,0.25))" />
          
          <!-- Inner accent circle -->
          <circle cx="22" cy="22" r="14" fill="#800020" opacity="0.08" />
          
          <!-- Emergency house icon -->
          <g transform="translate(11, 11)">
            <!-- Roof -->
            <path d="M11 4 L2 11 L3 11 L3 19 L19 19 L19 11 L20 11 Z" 
                  fill="#800020" stroke="#800020" stroke-width="0.5" />
            <!-- House body -->
            <rect x="5" y="11" width="12" height="8" fill="#800020" opacity="0.85" />
            <!-- Door -->
            <rect x="9" y="13" width="4" height="6" fill="#FFFFFF" />
            <!-- Windows -->
            <rect x="6" y="13" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
            <rect x="14" y="13" width="2" height="2" fill="#FFFFFF" opacity="0.7" />
            <!-- Emergency cross -->
            <circle cx="11" cy="7" r="3" fill="#DC2626" />
            <rect x="10" y="5.5" width="2" height="3" fill="#FFFFFF" />
            <rect x="9.5" y="6" width="3" height="2" fill="#FFFFFF" />
          </g>
        </svg>
      `;

      // Create styled popup content
      const popupContent = `
        <div style="
          padding: 16px;
          min-width: 280px;
          max-width: 350px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <!-- Header -->
          <div style="
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 2px solid #D4AF37;
          ">
            <h3 style="
              margin: 0 0 6px 0;
              font-size: 18px;
              font-weight: 700;
              color: #800020;
              line-height: 1.3;
            ">${shelter.name}</h3>
            <span style="
              display: inline-block;
              padding: 4px 10px;
              background: #D4AF37;
              color: #FFFFFF;
              font-size: 12px;
              font-weight: 600;
              border-radius: 4px;
              text-transform: uppercase;
            ">${shelter.shelter_type.replace(/_/g, ' ')}</span>
          </div>
          
          <!-- Description -->
          ${shelter.description ? `
            <p style="
              margin: 0 0 12px 0;
              font-size: 14px;
              color: #666;
              line-height: 1.5;
            ">${shelter.description}</p>
          ` : ''}
          
          <!-- Location -->
          <div style="margin-bottom: 10px;">
            <div style="
              display: flex;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 6px;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800020" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span style="font-size: 14px; color: #333; font-weight: 500;">
                ${shelter.address}
              </span>
            </div>
            <div style="
              padding-left: 24px;
              font-size: 13px;
              color: #666;
            ">
              ${shelter.city}, ${shelter.country}
            </div>
          </div>
          
          <!-- Capacity & Availability -->
          <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin: 12px 0;
          ">
            ${shelter.capacity ? `
              <div style="
                padding: 8px;
                background: #F5F5F5;
                border-radius: 6px;
                text-align: center;
              ">
                <div style="font-size: 11px; color: #666; margin-bottom: 2px;">CAPACITY</div>
                <div style="font-size: 16px; font-weight: 700; color: #800020;">
                  ${shelter.capacity}
                </div>
              </div>
            ` : ''}
            ${shelter.available_beds ? `
              <div style="
                padding: 8px;
                background: #DCFCE7;
                border-radius: 6px;
                text-align: center;
              ">
                <div style="font-size: 11px; color: #166534; margin-bottom: 2px;">AVAILABLE</div>
                <div style="font-size: 16px; font-weight: 700; color: #16A34A;">
                  ${shelter.available_beds} beds
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Contact -->
          ${shelter.contact_phone ? `
            <div style="
              margin-top: 12px;
              padding: 10px;
              background: #FEF3C7;
              border-left: 3px solid #D4AF37;
              border-radius: 4px;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#800020" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="tel:${shelter.contact_phone}" style="
                  font-size: 15px;
                  font-weight: 600;
                  color: #800020;
                  text-decoration: none;
                ">${shelter.contact_phone}</a>
              </div>
            </div>
          ` : ''}
          
          <!-- Amenities -->
          <div style="
            margin-top: 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          ">
            ${shelter.accepts_families ? `
              <span style="
                padding: 4px 8px;
                background: #E0E7FF;
                color: #3730A3;
                font-size: 11px;
                font-weight: 600;
                border-radius: 4px;
              ">Families Welcome</span>
            ` : ''}
            ${shelter.wheelchair_accessible ? `
              <span style="
                padding: 4px 8px;
                background: #DBEAFE;
                color: #1E40AF;
                font-size: 11px;
                font-weight: 600;
                border-radius: 4px;
              ">Accessible</span>
            ` : ''}
            ${shelter.accepts_pets ? `
              <span style="
                padding: 4px 8px;
                background: #FEE2E2;
                color: #991B1B;
                font-size: 11px;
                font-weight: 600;
                border-radius: 4px;
              ">Pets Allowed</span>
            ` : ''}
          </div>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '400px',
        className: 'emergency-shelter-popup',
      }).setHTML(popupContent);

      // Create marker with BOTTOM anchor for precise positioning
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom', // Bottom-center anchor for pin-style markers
        offset: [0, -12],
        draggable: false,
        pitchAlignment: 'map',
        rotationAlignment: 'map',
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Click handler
      el.addEventListener('click', () => {
        if (onShelterSelect) {
          onShelterSelect(shelter);
        }
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
    if (shelters.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      shelters.forEach(shelter => {
        const lng = Number(shelter.longitude);
        const lat = Number(shelter.latitude);
        if (!isNaN(lng) && !isNaN(lat)) {
          bounds.extend([lng, lat]);
        }
      });
      
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          maxZoom: 10,
          duration: 1500,
        });
      }
    }
  }, [shelters, onShelterSelect]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg border-2 border-border shadow-xl"
      style={{ minHeight: '680px' }}
    />
  );
};
