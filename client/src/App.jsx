import {
	BrowserRouter as Router,
	Routes,
	Route,
	NavLink,
	Navigate,
	useLocation,
} from 'react-router-dom';
import TextInput from './components/TextInput';
import SearchPage from './components/SearchPage';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route
					path="/"
					element={
						<PageWrapper>
							<TextInput />
						</PageWrapper>
					}
				/>
				<Route
					path="/search"
					element={
						<PageWrapper>
							<SearchPage />
						</PageWrapper>
					}
				/>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</AnimatePresence>
	);
}

function PageWrapper({ children }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
		>
			{children}
		</motion.div>
	);
}

function App() {
	return (
		<Router>
			<div className="max-w-4xl mx-auto px-4 py-6">
				<nav className="flex justify-between items-center mb-6 border-b pb-2">
					<h1 className="text-2xl font-bold text-blue-700">
						AutoLabelr
					</h1>
					<div className="space-x-4">
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive
									? 'text-blue-700 font-semibold underline'
									: 'text-gray-600 hover:text-blue-600'
							}
							end
						>
							Upload
						</NavLink>
						<NavLink
							to="/search"
							className={({ isActive }) =>
								isActive
									? 'text-blue-700 font-semibold underline'
									: 'text-gray-600 hover:text-blue-600'
							}
						>
							Search
						</NavLink>
					</div>
				</nav>

				<AnimatedRoutes />
			</div>
		</Router>
	);
}

export default App;
