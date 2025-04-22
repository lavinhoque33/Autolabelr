import { useState } from "react";
import axios from "axios";

export default function TextInput() {
  const [text, setText] = useState("");
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
	if (!text.trim()) return;
	setLoading(true);
	try {
	  const res = await axios.post("http://localhost:5000/generate-labels", { text });
	  setLabels(res.data.labels || []);
	} catch (err) {
	  console.error("Error generating labels:", err);
	} finally {
	  setLoading(false);
	}
  };

  return (
	<div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow">
	  <h1 className="text-xl font-bold mb-4">AutoLabelr</h1>
	  <textarea
		value={text}
		onChange={(e) => setText(e.target.value)}
		placeholder="Paste some text here..."
		className="w-full h-40 p-2 border rounded mb-4"
	  />
	  <button
		onClick={handleSubmit}
		className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
		disabled={loading}
	  >
		{loading ? "Generating..." : "Generate Labels"}
	  </button>

	  {labels.length > 0 && (
		<div className="mt-6">
		  <h2 className="font-semibold">Generated Labels:</h2>
		  <ul className="list-disc ml-6">
			{labels.map((label, idx) => (
			  <li key={idx}>{label}</li>
			))}
		  </ul>
		</div>
	  )}
	</div>
  );
}

