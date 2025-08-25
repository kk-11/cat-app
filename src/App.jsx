import { useRef, useState, useEffect } from "preact/hooks";
import "./styles/main.css";
import Map from "./components/Map";
import {
    CatProvider,
    LocationProvider,
    CameraProvider,
    useCats,
    useLocation,
    useCamera,
} from "./contexts";

// Main App component that wraps everything with context providers
const App = () => {
    const { cats, loading, error, fetchCats } = useCats();
    const { currentLocation, getCurrentLocation, locationError } =
        useLocation();
    const {
        cameraActive,
        capturedPhoto,
        cameraVideoRef,
        startCamera,
        stopCamera,
        capturePhoto,
        clearPhoto,
    } = useCamera();

    const mapInstance = useRef(null);
    const [catCounter, setCatCounter] = useState(1);

    // Handle map initialization
    const handleMapInit = (map) => {
        mapInstance.current = map;

        // If we have location, center the map
        if (currentLocation) {
            map.setView(
                [currentLocation.latitude, currentLocation.longitude],
                13,
                { animate: true, duration: 1 }
            );
        }
    };

    // Load cats when location changes
    useEffect(() => {
        if (currentLocation) {
            fetchCats({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
            });
        }
    }, [currentLocation, fetchCats]);

    // Handle location refresh
    const handleRefreshLocation = async () => {
        try {
            await getCurrentLocation();
        } catch (err) {
            console.error("Failed to refresh location:", err);
        }
    };

    // Toggle camera
    const toggleCamera = async () => {
        try {
            if (cameraActive) {
                stopCamera();
            } else {
                await startCamera();
            }
        } catch (err) {
            console.error("Error toggling camera:", err);
        }
    };

    // Handle photo capture
    const handleCapturePhoto = () => {
        capturePhoto();
        stopCamera();
    };
    return (
        <LocationProvider>
            <CatProvider>
                <CameraProvider>
                    <div className="app">
                        <header className="app-header">
                            <h1>Cat Tracker 🐈</h1>
                            <button
                                onClick={handleRefreshLocation}
                                disabled={loading}
                                className="refresh-btn"
                            >
                                {loading ? "Loading..." : "Refresh Location"}
                            </button>
                        </header>

                        <main className="app-main">
                            <div className="map-container">
                                <Map
                                    onMapInit={handleMapInit}
                                    cats={cats}
                                    currentLocation={currentLocation}
                                />
                                {loading && (
                                    <div className="loading-overlay">
                                        <div className="spinner"></div>
                                        <p>Loading cats in your area...</p>
                                    </div>
                                )}
                                {error && (
                                    <div className="error-message">
                                        <p>{error}</p>
                                        <button onClick={handleRefreshLocation}>
                                            Try Again
                                        </button>
                                    </div>
                                )}
                                {locationError && (
                                    <div className="warning-message">
                                        <p>{locationError}</p>
                                    </div>
                                )}
                            </div>

                            <div className="camera-section">
                                <div className="camera-container">
                                    {cameraActive ? (
                                        <div className="camera-preview">
                                            <video
                                                ref={cameraVideoRef}
                                                autoPlay
                                                playsInline
                                                className="camera-feed"
                                            />
                                            <div className="camera-controls">
                                                <button
                                                    onClick={handleCapturePhoto}
                                                    className="capture-btn"
                                                >
                                                    📸
                                                </button>
                                                <button
                                                    onClick={toggleCamera}
                                                    className="close-camera-btn"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ) : capturedPhoto ? (
                                        <div className="photo-preview">
                                            <img
                                                src={capturedPhoto}
                                                alt="Captured cat"
                                                className="captured-photo"
                                            />
                                            <div className="photo-actions">
                                                <button
                                                    onClick={() =>
                                                        setCatCounter(
                                                            (prev) => prev + 1
                                                        )
                                                    }
                                                    className="cat-counter"
                                                >
                                                    Add Cat #{catCounter}
                                                </button>
                                                <button
                                                    onClick={clearPhoto}
                                                    className="retake-btn"
                                                >
                                                    Retake
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={toggleCamera}
                                            className="open-camera-btn"
                                        >
                                            Open Camera
                                        </button>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </CameraProvider>
            </CatProvider>
        </LocationProvider>
    );
};

export default App;
