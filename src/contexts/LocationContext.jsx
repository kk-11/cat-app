import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getCurrentLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                const error = new Error(
                    "Geolocation is not supported by your browser"
                );
                setLocationError(error.message);
                reject(error);
                return;
            }

            setIsLoading(true);
            setLocationError(null);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp,
                    };
                    setCurrentLocation(location);
                    setIsLoading(false);
                    resolve(location);
                },
                (error) => {
                    const errorMessage = `Unable to retrieve your location: ${error.message}`;
                    setLocationError(errorMessage);
                    setIsLoading(false);
                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        });
    }, []);

    // Optionally fetch location on mount
    useEffect(() => {
        getCurrentLocation().catch(() => {
            // Error is already handled in getCurrentLocation
        });
    }, [getCurrentLocation]);

    const value = {
        currentLocation,
        locationError,
        isLoading,
        getCurrentLocation,
        setCurrentLocation,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocation must be used within a LocationProvider");
    }
    return context;
};
