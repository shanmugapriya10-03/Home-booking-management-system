import React, { useState } from "react";

export default function HomeDesigner() {
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [style, setStyle] = useState("Modern");
  const [colors, setColors] = useState("Light grey and wood accents");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateDesign() {
    setLoading(true);
    setImageUrl(null);

    const prompt = `Generate a concept image of a ${style} house with ${bedrooms} bedrooms and ${bathrooms} bathrooms. Colors: ${colors}.`;

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png"); // png/jpg/webp

    try {
      const resp = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer sk-XhqmnbPMZCCeN72HmAuE5cdh3eEy8yfaLnixh3LJCJrGg3KP", // get it from Stability
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (!resp.ok) {
        throw new Error("Failed to generate image");
      }

      // response is base64 encoded image
      const data = await resp.json();
      const base64 = data.image; // property from API
      setImageUrl(`data:image/png;base64,${base64}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image. Check API key & endpoint.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Home Designer AI</h2>

      <label className="block mb-2">
        Bedrooms:
        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="border p-1 ml-2"
        />
      </label>

      <label className="block mb-2">
        Bathrooms:
        <input
          type="number"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          className="border p-1 ml-2"
        />
      </label>

      <label className="block mb-2">
        Style:
        <input
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border p-1 ml-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Colors / Palette:
        <input
          type="text"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          className="border p-1 ml-2 w-full"
        />
      </label>

      <button
        onClick={generateDesign}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        {loading ? "Generating..." : "Generate Design"}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">AI-Generated Design:</h3>
          <img src={imageUrl} alt="AI generated design" className="rounded shadow" />
        </div>
      )}
    </div>
  );
}
