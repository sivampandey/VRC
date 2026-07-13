import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import store from './store'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'font-jost text-sm rounded-none',
              style: {
                background: '#FAF5F0',
                color: '#160400',
                border: '1px solid #E0D5C8',
                borderRadius: '0px',
              },
            }}
          />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </StrictMode>,
)
