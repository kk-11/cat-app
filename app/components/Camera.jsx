'use client';

import React, { useState, useCallback } from 'react';

export const Camera = () => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const clearPhoto = useCallback(() => {
    setCapturedPhoto(null);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="camera-section">
      <h2>Camera</h2>

      <div>
        <input
          type="file"
          accept="video/*;capture=camcorder"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>

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
