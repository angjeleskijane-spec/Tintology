export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  location: string;
  hours: string;
  tintPriceList: { id: string; title: string; description: string; price: number; warranty: string; group: string; order: number }[];
  tintingSectionImage: string;
  glassReplacementImage: string;
  glassRepairImage: string;
  showerFilmImage: string;
  prices: {
    all: { standard: number[]; lux: number[] };
    rear: { standard: number[]; lux: number[] };
    front: { standard: number[]; lux: number[] };
    tif: { standard: number[]; lux: number[] };
  };
  studioPrices: {
    lightTint: { frontLights: number; oneTailLight: number; bothTailLights: number };
    wrap: number[];
  };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: 'Заштити го ентериерот. Намали ја топлината. Уживај во комфорот.',
  heroSubtitle: 'Заштита од сонце, повеќе приватност и елегантен изглед со професионални автомобилски фолии и заштитни услуги. Гаранциските услови се потврдуваат според избраната фолија.',
  phone: '079 315 600',
  location: 'Осој, Кичево, Северна Македонија',
  hours: 'Секој ден: 09:00 – 21:00',
  tintPriceList: [
    { id: 'xpel-xr-rear', title: 'XPEL XR – заден дел', description: 'Премиум керамичка фолија за задниот дел на автомобилот.', price: 6000, warranty: '15 години писмена гаранција', group: 'Затемнување стакла', order: 1 },
    { id: 'xpel-cs-rear', title: 'XPEL CS – заден дел', description: 'Квалитетна фолија за затемнување и секојдневна заштита.', price: 4000, warranty: '10 години писмена гаранција', group: 'Затемнување стакла', order: 2 },
    { id: 'windshield-xr88', title: 'Предно ветробранско – XR88', description: 'Транспарентна фолија за предно ветробранско стакло.', price: 3000, warranty: 'Според условите на производителот', group: 'Предно ветробранско', order: 3 },
    { id: 'windshield-chameleon', title: 'Предно ветробранско – Chameleon', description: 'Chameleon фолија за предно ветробранско стакло.', price: 5000, warranty: 'Според условите на производителот', group: 'Предно ветробранско', order: 4 },
    { id: 'remove-front', title: 'Отстранување – предни две стакла', description: 'Отстранување на стара фолија од возачко и совозачко стакло.', price: 400, warranty: '—', group: 'Отстранување фолија', order: 5 },
    { id: 'remove-windshield', title: 'Отстранување – предно ветробранско', description: 'Отстранување на стара фолија од ветробранското стакло.', price: 500, warranty: '—', group: 'Отстранување фолија', order: 6 },
    { id: 'remove-rear', title: 'Отстранување – заден дел', description: 'Отстранување на стара фолија од задниот дел на автомобилот.', price: 800, warranty: '—', group: 'Отстранување фолија', order: 7 },
    { id: 'remove-all', title: 'Отстранување – сите стакла', description: 'Отстранување на стара фолија од сите стакла на автомобилот.', price: 1200, warranty: '—', group: 'Отстранување фолија', order: 8 },
  ],
  tintingSectionImage: '/images/tintology_gallery_suv_1793053360268.jpg',
  glassReplacementImage: 'https://images.pexels.com/photos/11950154/pexels-photo-11950154.jpeg?cs=srgb&dl=pexels-uk-car-glass-222332278-11950154.jpg&fm=jpg',
  glassRepairImage: 'https://images.pexels.com/photos/11950156/pexels-photo-11950156.jpeg?cs=srgb&dl=pexels-uk-car-glass-222332278-11950156.jpg&fm=jpg',
  showerFilmImage: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
  prices: {
    all: { standard: [5500, 5500, 7500, 9500], lux: [8000, 8000, 11000, 14000] },
    rear: { standard: [4000, 4000, 5500, 7000], lux: [6000, 6000, 7500, 9500] },
    front: { standard: [1800, 1800, 1800, 1800], lux: [2500, 2500, 2500, 2500] },
    tif: { standard: [4500, 4500, 6000, 7500], lux: [6500, 6500, 8000, 10000] },
  },
  studioPrices: {
    lightTint: { frontLights: 0, oneTailLight: 615, bothTailLights: 1230 },
    wrap: [0, 0, 0, 0],
  },
};
