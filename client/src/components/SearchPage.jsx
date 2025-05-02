import { useState } from 'react';
import axios from 'axios';

export default function SearchPage() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [strict, setStrict] = useState(false);

	const handleSearch = async () => {
		if (!query.trim()) return;

		setLoading(true);
		try {
			const res = await axios.get(`http://localhost:5000/search`, {
				params: { q: query, strict },
			});
			setResults(res.data.results || []);
		} catch (err) {
			console.error('Search error:', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-4 border rounded shadow">
			<h1 className="text-2xl font-bold mb-4">Search Labeled Entries</h1>

			<div className="flex mb-4 gap-2">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search by keyword, tag..."
					className="flex-1 border p-2 rounded"
				/>
				<button
					onClick={handleSearch}
					className="bg-blue-600 text-white px-4 py-2 rounded"
				>
					{loading ? 'Searching...' : 'Search'}
				</button>
				<label className="flex items-center text-sm ml-2">
					<input
						type="checkbox"
						className="mr-1"
						checked={strict}
						onChange={(e) => setStrict(e.target.checked)}
					/>
					Strict match
				</label>
			</div>

			{results.length > 0 && (
				<div className="space-y-4 mt-4">
					{results.map((item, i) => (
						<div key={i} className="border p-3 rounded bg-gray-50">
							<p className="mb-2 text-sm text-gray-700 whitespace-pre-wrap">
								{item.text.slice(0, 300)}...
							</p>
							<div className="text-sm text-gray-800">
								<strong>Labels:</strong>{' '}
								{item.labels.join(', ')}
							</div>
							{item.createdAt && (
								<div className="text-xs text-gray-500 mt-1">
									Created:{' '}
									{new Date(item.createdAt).toLocaleString()}
								</div>
							)}
						</div>
					))}
				</div>
			)}

			{!loading && results.length === 0 && query.trim() && (
				<p className="text-gray-600 mt-4">No results found.</p>
			)}
		</div>
	);
}
