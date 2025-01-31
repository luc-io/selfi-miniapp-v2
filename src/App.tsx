import { GenerateTab } from './components/generate/GenerateTab';
import '@/styles/globals.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-500 p-4 mb-4 text-white rounded-lg">
          Test Tailwind Style
        </div>
        <GenerateTab />
      </div>
    </div>
  );
}

export default App;