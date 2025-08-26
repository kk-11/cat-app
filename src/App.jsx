import React, { useRef } from "react";
import "./styles/main.css";
import Map from "./components/Map";
import { CatProvider } from "./contexts/CatContext";
import { LocationProvider } from "./contexts/LocationContext";
import { CameraProvider, useCamera } from "./contexts/CameraContext";
import { useCats } from "./contexts/CatContext";

// Main App component that wraps everything with context providers
const AppContent = () => {
    const {
        cameraActive,
        capturedPhoto,
        cameraVideoRef,
        startCamera,
        stopCamera,
        capturePhoto,
        clearPhoto,
    } = useCamera();
    const { cats, loading, error, fetchCats } = useCats();

    const mapInstance = useRef(null);

    // Handle map initialization
    const handleMapInit = (map) => {
        mapInstance.current = map;
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Cat Tracker</h1>
            </header>

            <main>
                <div className="map-container">
                    <Map
                        onMapInit={handleMapInit}
                        fetchCats={fetchCats}
                        cats={cats}
                    />
                </div>

                <div className="camera-section">
                    <h2>Camera</h2>
                    {!cameraActive ? (
                        <button onClick={startCamera} className="btn">
                            Open Camera
                        </button>
                    ) : (
                        <div className="camera-preview">
                            <video
                                ref={cameraVideoRef}
                                autoPlay
                                playsInline
                                className="camera-feed"
                            />
                            <div className="camera-controls">
                                <button onClick={capturePhoto} className="btn">
                                    Take Photo
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className="btn btn-secondary"
                                >
                                    Close Camera
                                </button>
                            </div>
                        </div>
                    )}

                    {capturedPhoto && (
                        <div className="preview-container">
                            <h3>Captured Photo</h3>
                            <img
                                src={capturedPhoto}
                                alt="Captured"
                                className="photo-preview"
                            />
                            <button
                                onClick={clearPhoto}
                                className="btn btn-secondary"
                            >
                                Clear Photo
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Main App component with all providers
const App = () => (
    <LocationProvider>
        <CatProvider>
            <CameraProvider>
                <AppContent />
            </CameraProvider>
        </CatProvider>
    </LocationProvider>
);

export default App;
