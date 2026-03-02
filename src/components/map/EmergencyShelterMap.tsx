import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { EmergencyShelter } from '@/types/emergency';

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

interface EmergencyShelterMapProps {
  shelters: EmergencyShelter[];
  onShelterSelect?: (shelter: EmergencyShelter) => void;
}

let leafletLoader: Promise<any> | null = null;

const loadLeaflet = async () => {
  if (typeof window === 'undefined') return null;
  const existing = (window as any).L;
  if (existing) return existing;
  if (leafletLoader) return leafletLoader;

  leafletLoader = new Promise((resolve, reject) => {
    const doc = window.document;
    if (!doc.querySelector('link[data-domus-leaflet="true"]')) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.setAttribute('data-domus-leaflet', 'true');
      doc.head.appendChild(link);
    }

    const script = doc.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = reject;
    doc.body.appendChild(script);
  });

  return leafletLoader;
};

export const EmergencyShelterMap: React.FC<EmergencyShelterMapProps> = ({
  shelters,
  onShelterSelect,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const fallbackMap = useRef<any>(null);
  const fallbackMarkers = useRef<any[]>([]);
  const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;
  const parseCoord = (value: any) => {
    if (value === null || value === undefined) return NaN;
    const normalized = String(value).replace(',', '.');
    return Number.parseFloat(normalized);
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapboxToken ? 'mapbox://styles/mapbox/streets-v12' : OPEN_STREET_MAP_STYLE,
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
  }, [mapboxToken]);

  // OSM fallback (Leaflet) when Mapbox token is not configured on hosting
  useEffect(() => {
    if (!mapContainer.current || mapboxToken) return;
    let cancelled = false;

    const initFallback = async () => {
      try {
        const L = await loadLeaflet();
        if (!L || cancelled || !mapContainer.current) return;

        if (fallbackMap.current) {
          fallbackMap.current.remove();
        }

        fallbackMap.current = L.map(mapContainer.current).setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(fallbackMap.current);
      } catch (error) {
        console.error('Leaflet fallback init failed:', error);
      }
    };

    initFallback();

    return () => {
      cancelled = true;
      fallbackMarkers.current.forEach((marker) => marker.remove());
      fallbackMarkers.current = [];
      if (fallbackMap.current) {
        fallbackMap.current.remove();
        fallbackMap.current = null;
      }
    };
  }, [mapboxToken]);

  // Update markers when shelters change
  useEffect(() => {
    if (!map.current || shelters.length === 0) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each shelter
    shelters.forEach((shelter) => {
      const lng = parseCoord(shelter.longitude);
      const lat = parseCoord(shelter.latitude);

      if (Number.isNaN(lng) || Number.isNaN(lat)) {
        console.error('Invalid coordinates for shelter:', shelter.name, shelter.latitude, shelter.longitude);
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

      // Create styled popup content (compact English)
      const popupContent = `
        <div style="
          padding: 12px;
          min-width: 220px;
          max-width: 280px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <!-- Header -->
          <div style="
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E5E7EB;
          ">
            <h3 style="
              margin: 0 0 4px 0;
              font-size: 16px;
              font-weight: 700;
              color: #800020;
              line-height: 1.3;
            ">${shelter.name}</h3>
            <span style="
              display: inline-block; padding: 3px 8px; background: #D4AF37; color: #FFFFFF;
              font-size: 11px; font-weight: 600; border-radius: 4px; text-transform: uppercase;
            ">${shelter.shelter_type.replace(/_/g, ' ')}</span>
          </div>
          
          <!-- Location -->
          <div style="margin: 0 0 8px 0; font-size: 13px; color: #374151;">
            <strong>Address:</strong><br/>
            ${shelter.address || '—'}<br/>
            ${shelter.city || ''}${shelter.city && shelter.country ? ', ' : ''}${shelter.country || ''}
          </div>

          ${(shelter.capacity ?? shelter.available_beds) !== null ? `
            <div style="display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; margin-bottom: 8px;">
              ${shelter.capacity !== null && shelter.capacity !== undefined ? `
                <div style="padding: 8px; background:#F3F4F6; border-radius:6px; text-align:center;">
                  <div style="font-size:11px; color:#6B7280;">Capacity</div>
                  <div style="font-size:15px; font-weight:700; color:#111827;">${shelter.capacity}</div>
                </div>
              ` : ''}
              ${shelter.available_beds !== null && shelter.available_beds !== undefined ? `
                <div style="padding: 8px; background:#ECFDF3; border-radius:6px; text-align:center;">
                  <div style="font-size:11px; color:#166534;">Available</div>
                  <div style="font-size:15px; font-weight:700; color:#166534;">${shelter.available_beds}</div>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Contact -->
          ${shelter.contact_phone ? `
            <div style="
              margin-bottom: 8px; padding: 8px; background:#FEF3C7; border-left:3px solid #D97706;
              border-radius:4px; font-size:13px; color:#92400E;
            ">
              <strong>Contact:</strong> <a href="tel:${shelter.contact_phone}" style="color:#92400E; text-decoration:none;">${shelter.contact_phone}</a>
            </div>
          ` : ''}

          <!-- Notes -->
          ${shelter.description ? `
            <div style="font-size:12px; color:#4B5563; line-height:1.4;">
              ${shelter.description}
            </div>
          ` : ''}
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

  // Update fallback markers
  useEffect(() => {
    if (mapboxToken || !fallbackMap.current) return;
    const L = (window as any).L;
    if (!L) return;

    fallbackMarkers.current.forEach((marker) => marker.remove());
    fallbackMarkers.current = [];

    const points: [number, number][] = [];
    shelters.forEach((shelter) => {
      const lng = parseCoord(shelter.longitude);
      const lat = parseCoord(shelter.latitude);
      if (Number.isNaN(lng) || Number.isNaN(lat)) return;

      const marker = L.marker([lat, lng]).addTo(fallbackMap.current);
      marker.bindPopup(`
        <div style="font-size:13px; line-height:1.4;">
          <strong>${shelter.name}</strong><br/>
          ${shelter.address || ''}<br/>
          ${shelter.city || ''}${shelter.city && shelter.country ? ', ' : ''}${shelter.country || ''}
        </div>
      `);
      marker.on('click', () => onShelterSelect?.(shelter));
      fallbackMarkers.current.push(marker);
      points.push([lat, lng]);
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      fallbackMap.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [shelters, onShelterSelect, mapboxToken]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-lg border-2 border-border shadow-xl"
      style={{ minHeight: '680px' }}
    />
  );
};
