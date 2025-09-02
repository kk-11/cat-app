"use client";

import React from "react";
import { useCamera } from "../contexts/CameraContext.jsx";

export const CameraStuff = () => {
  const {
    cameraActive,
    capturedPhoto,
    cameraVideoRef,
    startCamera,
    stopCamera,
    capturePhoto,
    clearPhoto,
  } = useCamera();

  return (
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
            <button onClick={stopCamera} className="btn btn-secondary">
              Close Camera
            </button>
          </div>
        </div>
      )}

      {capturedPhoto && (
        <div className="preview-container">
          <h3>Captured Photo</h3>
          <img src={capturedPhoto} alt="Captured" className="photo-preview" />
          <button onClick={clearPhoto} className="btn btn-secondary">
            Clear Photo
          </button>
        </div>
      )}
    </div>
  );
};
