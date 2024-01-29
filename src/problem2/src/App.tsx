import { MainLayout } from './components/MainLayout';
import { SwapCard } from './components/SwapCard';

import './global.css';

function App() {
  return (
    <MainLayout>
      <SwapCard className='mx-auto' />
    </MainLayout>
  );
}

export default App;
