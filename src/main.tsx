import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import Admin from './Admin.tsx';
import GitStudio from './GitStudio.tsx';
import GitHandle from './GitHandle.tsx';
import { AutoGlassPage, ArchitecturalFilmsPage, AutomotiveFilmsPage, WrapPage, AutomotiveProtectionPage, WindowTintingPage, WindshieldReplacementPage, WindshieldRepairPage, PPFPage, ShowerFilmPage } from './ServicePages.tsx';
import './index.css';

const route = window.location.pathname.replace(/\/$/, '');
const getPage = () => {
  if (route === '/git' || route === '/developer' || route === '/git-studio') return <GitStudio />;
  if (route === '/admin') return <Admin />;
  if (route === '/avto-stakla') return <AutoGlassPage />;
  if (route === '/zatemnuvanje-stakla') return <WindowTintingPage />;
  if (route === '/zamena-avtostakla') return <WindshieldReplacementPage />;
  if (route === '/reparacija-avtostakla') return <WindshieldRepairPage />;
  if (route === '/folii-za-domovi-i-objekti') return <ArchitecturalFilmsPage />;
  if (route === '/avtomobilski-folii') return <AutomotiveFilmsPage />;
  if (route === '/wrap') return <WrapPage />;
  if (route === '/ppf-zastita') return <PPFPage />;
  if (route === '/avtomobilska-zastita') return <AutomotiveProtectionPage />;
  if (route === '/folija-za-tus-kabini') return <ShowerFilmPage />;
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <>
    {getPage()}
    {route !== '/git' && route !== '/developer' && route !== '/git-studio' && <GitHandle />}
  </>
);
