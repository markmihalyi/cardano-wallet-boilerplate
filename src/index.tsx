import 'styles/index.css';

import App from './App';
import { CardanoContextProvider } from 'common/providers/CardanoProvider';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <CardanoContextProvider>
    <App />
  </CardanoContextProvider>,
);
