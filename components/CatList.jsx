import React from 'react';

const CatList = ({ cats }) => {
  if (!cats || cats.length === 0) {
    return <p>No cats nearby.</p>;
  }

  return (
    <div className="cat-list">
      <h2>Nearby Cats</h2>
      <ul>
        {cats.map((cat) => (
          <li key={cat.id} className="cat-card">
            {cat.pic && (
              <img src={cat.pic} alt={cat.name || 'Cat'} className="cat-photo" />
            )}
            <div className="cat-info">
              <h3>{cat.name || 'Unnamed Cat'}</h3>
              {typeof cat.distance === 'number' && (
                <p>{cat.distance.toFixed(2)} km away</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatList;
