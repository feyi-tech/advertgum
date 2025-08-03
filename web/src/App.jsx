import { useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthDetails from "./components/AuthDetails";
import CreateAd from "./components/CreateAd";
import ViewAds from "./components/ViewAds";

function App() {
  useEffect(() => {
    const handleReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      const ad = urlParams.get('ad');

      if (ref && ad) {
        try {
          await fetch('/api/clicks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ref, ad }),
          });
        } catch (error) {
          console.error('Failed to record click:', error);
        } finally {
          // Clean the URL
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    handleReferral();
  }, []);

  return (
    <div className="App">
      <AuthDetails />
      <hr />
      <Login />
      <Register />
      <hr />
      <CreateAd />
      <hr />
      <ViewAds />
    </div>
  );
}

export default App;
