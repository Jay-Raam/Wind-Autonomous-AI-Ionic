/**
 * Main App Component
 * Root component that sets up Ionic and routing
 */

import React from 'react';
import { setupIonicReact } from '@ionic/react';
import AppRouter from './router/AppRouter';

// Setup Ionic
setupIonicReact();

const App: React.FC = () => {
  return <AppRouter />;
};

export default App;
