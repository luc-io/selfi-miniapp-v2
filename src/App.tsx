import { useState } from 'react';
import { Tab } from '@headlessui/react';
import TrainTab from './components/train/TrainTab';

function App() {
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <TrainTab />
    </div>
  );
}

export default App;