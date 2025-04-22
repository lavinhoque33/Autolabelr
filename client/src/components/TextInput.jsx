import { useState } from 'react';
import axios from 'axios';

export default function TextInput() {
	const [text, setText] = useState('');
	const [file, setFile] = useState(null);
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!text.trim() && !file) return;
		setLoading(true);
		const formData = new FormData();
		if (file) {
			formData.append('file', file);
		} else {
			formData.append('text', text);
		}
		try {
			const res = await axios.post(
				'http://localhost:5000/generate-labels',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			setLabels(res.data.labels || []);
			console.log('Uploaded file info:', res.data.fileInfo);
		} catch (err) {
			console.error('Error generating labels:', err);
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
			<label className="inline-block bg-gray-200 px-4 py-2 rounded cursor-pointer mb-4">
				📁 Upload File
				<input
					type="file"
					accept=".txt,.md,.png,.jpg,.jpeg"
					onChange={(e) => setFile(e.target.files[0])}
					className="hidden"
				/>
			</label>

			{file && (
				<p className="text-sm text-gray-600 mb-4">
					Selected: <strong>{file.name}</strong>
				</p>
			)}
			<button
				onClick={handleSubmit}
				className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
				disabled={loading}
			>
				{loading ? 'Generating...' : 'Generate Labels'}
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
