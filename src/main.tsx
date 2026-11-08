import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import Admin from './Admin.tsx';
import { AutoGlassPage, ArchitecturalFilmsPage, AutomotiveFilmsPage, WrapPage, AutomotiveProtectionPage, WindowTintingPage, WindshieldReplacementPage, WindshieldRepairPage, PPFPage, ShowerFilmPage } from './ServicePages.tsx';
import './index.css';

const route = window.location.pathname.replace(/\/$/, '');
const page = route === '/admin' ? <Admin /> : route === '/avto-stakla' ? <AutoGlassPage /> : route === '/zatemnuvanje-stakla' ? <WindowTintingPage /> : route === '/zamena-avtostakla' ? <WindshieldReplacementPage /> : route === '/reparacija-avtostakla' ? <WindshieldRepairPage /> : route === '/folii-za-domovi-i-objekti' ? <ArchitecturalFilmsPage /> : route === '/avtomobilski-folii' ? <AutomotiveFilmsPage /> : route === '/wrap' ? <WrapPage /> : route === '/ppf-zastita' ? <PPFPage /> : route === '/avtomobilska-zastita' ? <AutomotiveProtectionPage /> : route === '/folija-za-tus-kabini' ? <ShowerFilmPage /> : <App />;
createRoot(document.getElementById('root')!).render(page);
