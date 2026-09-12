import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import { Provider } from 'react-redux';
import { store } from "./app/app.store.js";
import ThemeProvider from './features/shared/context/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
)
