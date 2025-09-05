import React, { useState, useRef, useEffect } from 'react';

const Cats = ({ cats, loading = false }) => {
  const [selectedCat, setSelectedCat] = useState(null);
  const dialogRef = useRef(null);

  const openDialog = (cat) => {
    setSelectedCat(cat);
  };

  const closeDialog = () => {
    setSelectedCat(null);
  };

  useEffect(() => {
    if (selectedCat && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [selectedCat]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <div
          style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        ></div>
        <p style={{ marginTop: '16px', color: '#666' }}>Loading cats...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!cats || cats.length === 0) {
    return <p>No cats nearby.</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Nearby Cats</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {cats.map((cat) => (
          <li
            key={cat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px',
              marginBottom: '12px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => openDialog(cat)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {cat.pic && (
              <img
                src={cat.pic}
                alt={cat.name || 'Cat'}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '16px',
                  border: '3px solid #fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
            )}
            <div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                {cat.name || 'Unnamed Cat'}
              </h3>
              {typeof cat.distance === 'number' && (
                <p
                  style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  {cat.distance.toFixed(2)} km away
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Native HTML Dialog */}
      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        style={{
          padding: 0,
          border: 'none',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '90vw',
          maxHeight: '80vh',
          overflow: 'hidden',
        }}
      >
        {selectedCat && (
          <div style={{ padding: '24px', backgroundColor: '#fff' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                {selectedCat.name || 'Unnamed Cat'}
              </h2>
              <button
                onClick={closeDialog}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.color = '#333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#666';
                }}
              >
                ×
              </button>
            </div>

            {selectedCat.pic && (
              <img
                src={selectedCat.pic}
                alt={selectedCat.name || 'Cat'}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              />
            )}

            <div style={{ lineHeight: '1.6' }}>
              {typeof selectedCat.distance === 'number' && (
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Distance:
                  </span>{' '}
                  {selectedCat.distance.toFixed(2)} km away
                </p>
              )}

              {selectedCat.breed && (
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Breed:
                  </span>{' '}
                  {selectedCat.breed}
                </p>
              )}

              {selectedCat.age && (
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>Age:</span>{' '}
                  {selectedCat.age}
                </p>
              )}

              {selectedCat.description && (
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Description:
                  </span>{' '}
                  {selectedCat.description}
                </p>
              )}

              {selectedCat.owner && (
                <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                  <span style={{ fontWeight: '600', color: '#333' }}>
                    Owner:
                  </span>{' '}
                  {selectedCat.owner}
                </p>
              )}
            </div>

            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={closeDialog}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2980b9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498db';
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>

      {/* Backdrop styling */}
      <style>
        {`
          dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
          }
        `}
      </style>
    </div>
  );
};

export default Cats;
