import React from "react";

export default function NeighborhoodExperience({ home }) {
  if (!home) return <p>No home data found.</p>;

  const mapSrc = `https://www.google.com/maps/embed/v1/search?q=school+near+${home.latitude},${home.longitude}&zoom=14`;

  return (
    <div>
      <h2>Nearby Places for {home.homeName}</h2>

      {/* Schools */}
      <h3>Schools</h3>
      <iframe
        title="Nearby Schools"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/search?q=school+near+${home.latitude},${home.longitude}&zoom=14`}
      />

      {/* Colleges */}
      <h3>Colleges</h3>
      <iframe
        title="Nearby Colleges"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/search?q=college+near+${home.latitude},${home.longitude}&zoom=14`}
      />

      {/* Airports */}
      <h3>Airports</h3>
      <iframe
        title="Nearby Airports"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/search?q=airport+near+${home.latitude},${home.longitude}&zoom=14`}
      />

      {/* Hotels */}
      <h3>Hotels</h3>
      <iframe
        title="Nearby Hotels"
        width="100%"
        height="400"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/search?q=hotel+near+${home.latitude},${home.longitude}&zoom=14`}
      />
    </div>
  );
}
