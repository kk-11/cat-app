
import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import "./styles/main.css";
import catService from "./services/catService";
import Map from "./components/Map";

export const App = () => {
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [catCounter, setCatCounter] = useState(1);

    const cameraVideoRef = useRef(null);
    const cameraStreamRef = useRef(null);
    const mapInstance = useRef(null);

    // Get user's geolocation and load nearby cats
    useEffect(() => {
        const loadCats = async (position) => {
            try {
                setLoading(true);
                const { latitude, longitude } = position.coords;
                const data = await catService.getAllCats({
                    lat: latitude,
                    lng: longitude
                });
                setCats(data);
                setCurrentLocation({ latitude, longitude });
                
                // Center map on user's location if map is already loaded
                if (mapInstance.current) {
                    mapInstance.current.setView([latitude, longitude], 13, {
                        animate: true,
                        duration: 1
                    });
                }
            } catch (err) {
                console.error("Failed to load cats:", err);
                // Fallback to loading all cats if geolocation fails
                try {
                    const data = await catService.getAllCats();
                    setCats(data);
                } catch (fallbackErr) {
                    console.error("Failed to load all cats:", fallbackErr);
                    setError("Failed to load cats. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        // Request geolocation permission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                loadCats,
                async (error) => {
                    console.warn("Geolocation error:", error);
                    // Fallback to loading all cats if geolocation is denied
                    try {
                        setLoading(true);
                        const data = await catService.getAllCats();
                        setCats(data);
                    } catch (err) {
                        console.error("Failed to load all cats:", err);
                        setError("Failed to load cats. Please try again later.");
                    } finally {
                        setLoading(false);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            // Browser doesn't support geolocation, load all cats
            const loadAllCats = async () => {
                try {
                    setLoading(true);
                    const data = await catService.getAllCats();
                    setCats(data);
                } catch (err) {
                    console.error("Failed to load all cats:", err);
                    setError("Failed to load cats. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };
            loadAllCats();
        }
    }, []);

    useEffect(() => {
        if (cameraActive) {
            openCamera();
        } else {
            closeCamera();
        }

        return () => {
            closeCamera();
        };
    }, [cameraActive]);

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "environment",
                },
            });

            if (cameraVideoRef.current) {
                cameraVideoRef.current.srcObject = stream;
                cameraStreamRef.current = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert(
                "Could not access the camera. Please ensure you have granted camera permissions."
            );
            setCameraActive(false);
        }
    };

    const closeCamera = () => {
        if (cameraStreamRef.current) {
            cameraStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
            cameraStreamRef.current = null;
        }
        setCapturedPhoto(null);
    };

    const capturePhoto = () => {
        if (!cameraVideoRef.current) return;

        const video = cameraVideoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const photoUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(photoUrl);
    };

    const addCat = () => {
        if (!currentLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const location = { lat: latitude, lng: longitude };
                    setCurrentLocation(location);
                    addCatToMap(capturedPhoto, location);
                    setCameraActive(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert(
                        "Could not get your location. Please enable location services and try again."
                    );
                }
            );
        } else {
            addCatToMap(capturedPhoto, currentLocation);
            setCameraActive(false);
        }
    };

    const addCatToMap = (photoUrl, location) => {
        if (!mapInstance.current || !photoUrl) return;

        // Add the cat marker to the map
        addCatMarker(
            mapInstance.current,
            location,
            photoUrl,
            "Cat",
            catCounter
        );

        // Increment the cat counter
        setCatCounter((prev) => prev + 1);

        // Reset states
        setCapturedPhoto(null);
        setCurrentLocation(null);
    };

    const retakePhoto = () => {
        setCapturedPhoto(null);
    };

    const cancelCamera = () => {
        setCameraActive(false);
        setCapturedPhoto(null);
    };

    // Handle location updates from the Map component
    const handleLocationUpdate = useCallback(({ latitude, longitude }) => {
        setCurrentLocation({ latitude, longitude });
    }, []);
    
    // Handle map instance reference for flyTo functionality
    const handleMapInit = useCallback((map) => {
        mapInstance.current = map;
    }, []);

    // Render loading state
    if (loading) {
        return (
            <div className="app">
                <h1>CAT APP 🐈‍⬛🐈</h1>
                <div className="loading">Loading cats...</div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="app">
                <h1>CAT APP 🐈‍⬛🐈</h1>
                <div className="error">{error}</div>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="app">
            <h1>CAT APP 🐈‍⬛🐈</h1>

            <div
                className="map-container"
                style={{
                    marginBottom: "2rem",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    Cats Near You
                </h2>
                <Map
                    style={{ height: "400px" }}
                    className="map-container"
                    cats={cats}
                    currentLocation={currentLocation}
                    onLocationUpdate={handleLocationUpdate}
                />
            </div>

            <div className="cats-grid">
                {cats.map((cat, index) => (
                    <div
                        key={cat.id}
                        className="cat-card"
                        onClick={() => {
                            if (cat.location && mapInstance.current) {
                                mapInstance.current.flyTo(
                                    [cat.location.lat, cat.location.lng],
                                    15,
                                    {
                                        duration: 1,
                                        easeLinearity: 0.25,
                                    }
                                );
                            }
                        }}
                    >
                        <img
                            src={cat.pic}
                            alt={cat.name}
                            className="cat-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://cataas.com/cat?type=medium&rand=${Math.floor(Math.random() * 1000)}`;
                            }}
                        />
                        <div className="cat-info">
                            <h3>
                                {cat.name}{" "}
                                {cat.distance && (
                                    <span className="distance">
                                        ({cat.distance.toFixed(1)} km away)
                                    </span>
                                )}
                            </h3>
                            <p>
                                <strong>Breed:</strong> {cat.breed}
                            </p>
                            <p>
                                <strong>Age:</strong> {cat.age} year
                                {cat.age !== 1 ? "s" : ""}
                            </p>
                            <p>{cat.description}</p>
                            <button
                                className="cat-location-btn"
                                onClick={() => setCameraActive(true)}
                            >
                                📍 Add Location
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="add-cat-btn"
                onClick={() => setCameraActive(true)}
            >
                🐾 Add New Cat
            </button>

            {cameraActive && (
                <div id="camera-container">
                    <h3>📸 Cat Camera</h3>
                    {!capturedPhoto ? (
                        <video
                            ref={cameraVideoRef}
                            id="camera-preview"
                            autoPlay
                            playsInline
                        />
                    ) : (
                        <img
                            id="captured-photo"
                            src={capturedPhoto}
                            alt="Captured cat"
                            style={{ display: "block" }}
                        />
                    )}

                    <div className="camera-controls">
                        {!capturedPhoto ? (
                            <>
                                <button
                                    className="camera-btn"
                                    onClick={capturePhoto}
                                >
                                    📷 Capture
                                </button>
                                <button
                                    className="camera-btn secondary-btn"
                                    onClick={cancelCamera}
                                >
                                    ❌ Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="camera-btn" onClick={addCat}>
                                    ✅ Add This Cat
                                </button>
                                <button
                                    className="camera-btn secondary-btn"
                                    onClick={retakePhoto}
                                >
                                    🔄 Retake
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* <Map onMapInit={handleMapInit} className="map-container" /> */}
        </div>
    );
};

// Default export for client-side rendering
export default App;
