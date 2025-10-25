let googleMapsPromise;

export function loadGoogleMaps(apiKey) {
  if (!googleMapsPromise) {
    googleMapsPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.google && window.google.maps) resolve(window.google.maps);
        else reject(new Error("Google Maps API failed to load"));
      };

      script.onerror = (err) => reject(err);

      document.head.appendChild(script);
    });
  }

  return googleMapsPromise;
}
