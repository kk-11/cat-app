import { useEffect, useRef, useCallback } from "preact/hooks";

const Map = ({ 
    onMapInit, 
    className = "", 
    style = {}, 
    cats = [], 
    currentLocation = null,
    onLocationUpdate = null
}) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const customTiles = useRef(null);
    const buildingOverlay = useRef(null);
    console.log('rendering')

    // Function to add all markers
    const addMarkers = useCallback(() => {
        if (!mapInstance.current || !window.L) return;
        
        // Clear existing markers (if any)
        if (mapInstance.current._markers) {
            mapInstance.current._markers.forEach(marker => mapInstance.current.removeLayer(marker));
        }
        
        mapInstance.current._markers = [];
        
        // Add user location marker if available
        if (currentLocation) {
            const { latitude, longitude } = currentLocation;
            
            // Center and zoom to user's location
            mapInstance.current.setView([latitude, longitude], 13, {
                animate: true,
                duration: 1
            });
            
            // Add user location marker
            const userMarker = window.L.marker([latitude, longitude], {
                icon: window.L.divIcon({
                    html: '<div class="user-location-marker">📍</div>',
                    className: 'user-location-icon',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                })
            }).addTo(mapInstance.current)
            .bindPopup('Your Location');
            
            mapInstance.current._markers.push(userMarker);
        } else if (navigator.geolocation) {
            // If we don't have location yet, try to get it
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    if (onLocationUpdate) {
                        onLocationUpdate({ latitude, longitude });
                    }
                    
                    mapInstance.current.setView([latitude, longitude], 13, {
                        animate: true,
                        duration: 1
                    });
                    
                    // Add user location marker
                    const userMarker = window.L.marker([latitude, longitude], {
                        icon: window.L.divIcon({
                            html: '<div class="user-location-marker">📍</div>',
                            className: 'user-location-icon',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32]
                        })
                    }).addTo(mapInstance.current)
                    .bindPopup('Your Location');
                    
                    if (!mapInstance.current._markers) {
                        mapInstance.current._markers = [];
                    }
                    mapInstance.current._markers.push(userMarker);
                },
                (error) => {
                    console.warn("Could not get location for map:", error);
                    // Default to Paris if location access is denied
                    mapInstance.current.setView([48.8566, 2.3522], 13);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }
        
        // Add cat markers
        cats.forEach((cat, index) => {
            if (cat && cat.location) {
                const marker = window.L.marker(
                    [cat.location.latitude, cat.location.longitude],
                    {
                        icon: window.L.divIcon({
                            html: `<div class="cat-marker">
                                <img src="${cat.pic}" alt="${cat.name || 'Cat'}" class="cat-marker-img" />
                                <span class="cat-marker-number">${index + 1}</span>
                            </div>`,
                            className: 'cat-marker-container',
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -20]
                        })
                    }
                )
                .addTo(mapInstance.current)
                .bindPopup(`<strong>${cat.name || 'Unnamed Cat'}</strong><br><img src="${cat.pic}" style="max-width: 200px; margin-top: 8px;" />`);
                
                if (!mapInstance.current._markers) {
                    mapInstance.current._markers = [];
                }
                mapInstance.current._markers.push(marker);
            }
        });
    }, [cats, currentLocation, onLocationUpdate]);

    useEffect(() => {
        if (!mapRef.current || !window.L) return;

        // Initialize map
        mapInstance.current = window.L.map(mapRef.current, {
            zoomControl: true,
            center: [0, 0],
            zoom: 20,
            tap: false, // Disable buggy mobile tap behavior
            touchZoom: "center", // allow pinch-to-zoom
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: false,
            dragging: true,
            keyboard: true,
            zoomDelta: 0.5,
            trackResize: true,
            touchExtend: false,
            // @ts-ignore - Leaflet internal property
            tapTolerance: 15,
        });

        // Prevent page scrolling while interacting with map
        const handleTouchMove = (e) => {
            if (!mapRef.current.contains(e.target)) {
                e.preventDefault();
            }
        };
        document.addEventListener("touchmove", handleTouchMove, { passive: false });

        // Clean white base map
        customTiles.current = window.L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
            {
                attribution:
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 20,
                detectRetina: true,
                updateWhenIdle: false,
                updateWhenZooming: false,
                reuseTiles: true,
                bounds: [
                    [-90, -180],
                    [90, 180],
                ],
                minNativeZoom: 0,
                maxNativeZoom: 20,
                noWrap: true,
            }
        ).addTo(mapInstance.current);

        // Buildings overlay (using a different tile provider)
        buildingOverlay.current = window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors',
                opacity: 0.8,
            }
        ).addTo(mapInstance.current);

        // Initial markers add
        addMarkers();
        
        // Update markers when map moves
        const updateMarkers = () => addMarkers();
        mapInstance.current.on('moveend', updateMarkers);
        
        // Notify parent that map is ready if needed
        if (onMapInit && typeof onMapInit === "function") {
            onMapInit(mapInstance.current);
        }
        
        // Cleanup
        return () => {
            document.removeEventListener("touchmove", handleTouchMove);
            if (mapInstance.current) {
                mapInstance.current.off('moveend', updateMarkers);
                mapInstance.current.off();
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [addMarkers, onMapInit]);

    const mapStyles = {
        height: "400px",
        width: "100%",
        borderRadius: "12px",
        margin: "20px 0",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        filter: "contrast(1.1) brightness(0.98)",
        ...style,
    };

    return <div ref={mapRef} className={className} style={mapStyles}></div>;
};

export default Map;
