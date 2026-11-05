export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  phone: string;
  location: string;
  hours: string;
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
