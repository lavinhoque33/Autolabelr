import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SearchPage() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [strict, setStrict] = useState(false);
	const [page, setPage] = useState(1);
	const [total, setTotal] = useState(0);
	const size = 10;

	const handleSearch = async () => {
		if (!query.trim()) return;

		setLoading(true);
		try {
			const res = await axios.get(`http://localhost:5000/search`, {
				params: { q: query, strict, page, size },
			});
			setResults(res.data.results || []);
			setTotal(res.data.total || 0);
		} catch (err) {
			console.error('Search error:', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setPage(1);
	}, [query]);

	useEffect(() => {
		if (query.trim()) {
			handleSearch();
		}
		// eslint-disable-next-line
	}, [page]);

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
				<>
					<div className="space-y-4 mt-4">
						{results.map((item, i) => (
							<div
								key={i}
								className="border p-3 rounded bg-gray-50"
							>
								<div
									className="mb-2 text-sm text-gray-700 whitespace-pre-wrap"
									dangerouslySetInnerHTML={{
										__html:
											item.highlights?.text?.[0] ||
											item.text.slice(0, 300) + '...',
									}}
								/>
								<div className="text-sm text-gray-800">
									<strong>Labels:</strong>{' '}
									{(
										item.highlights?.labels || item.labels
									).join(', ')}
								</div>
							</div>
						))}
					</div>

					{/* Pagination controls */}
					<div className="flex justify-between items-center mt-6">
						<button
							disabled={page === 1}
							onClick={() => setPage((p) => Math.max(p - 1, 1))}
							className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						>
							◀ Prev
						</button>
						<span className="text-sm text-gray-600">
							Page {page} of {Math.ceil(total / size)}
						</span>
						<button
							disabled={page * size >= total}
							onClick={() => setPage((p) => p + 1)}
							className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
						>
							Next ▶
						</button>
					</div>
				</>
			)}

			{!loading && results.length === 0 && query.trim() && (
				<p className="text-gray-600 mt-4">No results found.</p>
			)}
		</div>
	);
}
