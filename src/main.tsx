import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useRegisterSW } from 'virtual:pwa-register/react'

// A component to handle the service worker registration
const Main = () => {
  // This hook will register the service worker and handle updates
  useRegisterSW({
    onNeedRefresh() {
      // In a real app, you would show a toast or a modal
      if (confirm("New content available, click OK to refresh")) {
        // This will reload the page and activate the new service worker
        window.location.reload();
      }
    },
    onOfflineReady() {
      // In a real app, you might show a toast that the app is ready for offline use
      console.log("App is ready for offline use.");
    },
  })
  return <App />
}

createRoot(document.getElementById("root")!).render(<Main />);
