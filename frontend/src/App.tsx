import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Room } from './pages/Room';
import { ThemeProvider } from './components/theme-provider';
import { CookieConsentProvider, CookieConsentBanner } from './components/cookie-consent';

function App() {
  return (
    <CookieConsentProvider>
      <ThemeProvider defaultTheme="dark">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </BrowserRouter>
        <CookieConsentBanner />
      </ThemeProvider>
    </CookieConsentProvider>
  );
}

export default App;
