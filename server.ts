import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '12mb' }));

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const ADMIN_SESSION_TTL = 8 * 60 * 60 * 1000;
const adminSessions = new Map<string, number>();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const CONTENT_PATH = path.join(process.cwd(), 'data', 'site-content.json');
const PRODUCT_PRICES_PATH = path.join(process.cwd(), 'data', 'product-prices.json');
const DEFAULT_CONTENT = {
  heroTitle: 'Заштити го ентериерот. Намали ја топлината. Уживај во комфорот.',
  heroSubtitle: 'Заштита од сонце, повеќе приватност и елегантен изглед со професионални автомобилски фолии и заштитни услуги. Гаранциските услови се потврдуваат според избраната фолија.',
  phone: '079 315 600', location: 'Осој, Кичево, Северна Македонија', hours: 'Секој ден: 09:00 – 21:00',
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
  tintingSectionImage: '',
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


async function readProductPrices() {
  try { return JSON.parse(await readFile(PRODUCT_PRICES_PATH, 'utf8')); }
  catch { return {}; }
}
function validateProductPrices(input: any) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const output: Record<string, any> = {};
  for (const [id, raw] of Object.entries(input)) {
    if (!/^[a-z0-9][a-z0-9-]{1,100}$/i.test(id) || !raw || typeof raw !== 'object') return null;
    const p: any = raw;
    const sellingMarkupPct = Number(p.sellingMarkupPct);
    if (p.cfsRegularPriceRSD !== undefined) {
      const cfsRegularPriceRSD = Number(p.cfsRegularPriceRSD);
      const eurRsdRate = Number(p.eurRsdRate);
      const manualSellingPriceEUR = p.manualSellingPriceEUR === null || p.manualSellingPriceEUR === '' || p.manualSellingPriceEUR === undefined ? null : Number(p.manualSellingPriceEUR);
      const rateDate = typeof p.rateDate === 'string' ? p.rateDate.slice(0, 10) : '';
      if (![cfsRegularPriceRSD, eurRsdRate, sellingMarkupPct].every(Number.isFinite) || cfsRegularPriceRSD < 0 || cfsRegularPriceRSD > 100000000 || eurRsdRate <= 0 || eurRsdRate > 100000 || sellingMarkupPct < 0 || sellingMarkupPct > 500 || (manualSellingPriceEUR !== null && (!Number.isFinite(manualSellingPriceEUR) || manualSellingPriceEUR < 0 || manualSellingPriceEUR > 100000000)) || !/^\d{4}-\d{2}-\d{2}$/.test(rateDate)) return null;
      output[id] = { cfsRegularPriceRSD, eurRsdRate, rateDate, sellingMarkupPct, manualSellingPriceEUR };
      continue;
    }
    const cfsRegularPrice = Number(p.cfsRegularPrice);
    const exchangeRate = Number(p.exchangeRate);
    const supplierDiscountPct = Number(p.supplierDiscountPct);
    const manualSellingPriceMKD = p.manualSellingPriceMKD === null || p.manualSellingPriceMKD === '' ? null : Number(p.manualSellingPriceMKD);
    if (![cfsRegularPrice, exchangeRate, supplierDiscountPct, sellingMarkupPct].every(Number.isFinite) || cfsRegularPrice < 0 || cfsRegularPrice > 100000000 || exchangeRate <= 0 || exchangeRate > 100000 || supplierDiscountPct < 0 || supplierDiscountPct > 100 || sellingMarkupPct < 0 || sellingMarkupPct > 500 || (manualSellingPriceMKD !== null && (!Number.isFinite(manualSellingPriceMKD) || manualSellingPriceMKD < 0 || manualSellingPriceMKD > 100000000))) return null;
    if (p.currency !== 'EUR' && p.currency !== 'MKD') return null;
    output[id] = { cfsRegularPrice, currency: p.currency, exchangeRate, supplierDiscountPct, sellingMarkupPct, manualSellingPriceMKD };
  }
  return output;
}
function publicCatalogPrices(raw: Record<string, any>) {
  const result: Record<string, number> = {};
  for (const [id, p] of Object.entries(raw || {})) {
    if (!p || Number(p.cfsRegularPrice) <= 0) continue;
    const baseMKD = Number(p.cfsRegularPrice) * (p.currency === 'EUR' ? Number(p.exchangeRate) : 1);
    const suggested = baseMKD * (1 + Number(p.sellingMarkupPct ?? 10) / 100);
    const selling = p.manualSellingPriceMKD === null || p.manualSellingPriceMKD === undefined ? suggested : Number(p.manualSellingPriceMKD);
    if (Number.isFinite(selling) && selling > 0) result[id] = Math.round(selling);
  }
  return result;
}

function publicWrapCatalogPrices(raw: Record<string, any>) {
  const result: Record<string, number> = {};
  for (const [id, p] of Object.entries(raw || {})) {
    if (!p || Number(p.cfsRegularPriceRSD) <= 0 || Number(p.eurRsdRate) <= 0) continue;
    const baseEUR = Number(p.cfsRegularPriceRSD) / Number(p.eurRsdRate);
    const suggested = baseEUR * (1 + Number(p.sellingMarkupPct ?? 10) / 100);
    const selling = p.manualSellingPriceEUR === null || p.manualSellingPriceEUR === undefined ? suggested : Number(p.manualSellingPriceEUR);
    if (Number.isFinite(selling) && selling > 0) result[id] = Math.round((selling + Number.EPSILON) * 100) / 100;
  }
  return result;
}

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function getCookie(req: express.Request, name: string) {
  const raw = req.headers.cookie || '';
  const item = raw.split(';').map(v => v.trim()).find(v => v.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}
function isAdmin(req: express.Request) {
  const token = getCookie(req, 'tintology_admin');
  const expires = adminSessions.get(token);
  if (!token || !expires || expires < Date.now()) { if (token) adminSessions.delete(token); return false; }
  return true;
}
async function readContent() {
  try {
    const saved = JSON.parse(await readFile(CONTENT_PATH, 'utf8'));
    return { ...DEFAULT_CONTENT, ...saved,
      tintPriceList: Array.isArray(saved.tintPriceList) ? saved.tintPriceList : DEFAULT_CONTENT.tintPriceList,
      tintingSectionImage: saved.tintingSectionImage || DEFAULT_CONTENT.tintingSectionImage,
      glassReplacementImage: saved.glassReplacementImage || DEFAULT_CONTENT.glassReplacementImage,
      glassRepairImage: saved.glassRepairImage || DEFAULT_CONTENT.glassRepairImage,
      showerFilmImage: saved.showerFilmImage || DEFAULT_CONTENT.showerFilmImage,
    };
  } catch { return DEFAULT_CONTENT; }
}
function validateContent(input: any) {
  if (!input || typeof input !== 'object') return null;
  const str = (v: any, fallback: string) => typeof v === 'string' ? v.slice(0, 1500) : fallback;
  const prices: any = {};
  for (const area of ['all', 'rear', 'front', 'tif']) {
    prices[area] = {};
    for (const pack of ['standard', 'lux']) {
      const values = input.prices?.[area]?.[pack];
      if (!Array.isArray(values) || values.length !== 4 || values.some((v: any) => !Number.isInteger(v) || v < 0 || v > 1000000)) return null;
      prices[area][pack] = values;
    }
  }
  const studioPrices = {
    lightTint: {
      frontLights: Number.isInteger(input.studioPrices?.lightTint?.frontLights) && input.studioPrices.lightTint.frontLights >= 0 && input.studioPrices.lightTint.frontLights <= 1000000 ? input.studioPrices.lightTint.frontLights : DEFAULT_CONTENT.studioPrices.lightTint.frontLights,
      oneTailLight: Number.isInteger(input.studioPrices?.lightTint?.oneTailLight) && input.studioPrices.lightTint.oneTailLight >= 0 && input.studioPrices.lightTint.oneTailLight <= 1000000 ? input.studioPrices.lightTint.oneTailLight : DEFAULT_CONTENT.studioPrices.lightTint.oneTailLight,
      bothTailLights: Number.isInteger(input.studioPrices?.lightTint?.bothTailLights) && input.studioPrices.lightTint.bothTailLights >= 0 && input.studioPrices.lightTint.bothTailLights <= 1000000 ? input.studioPrices.lightTint.bothTailLights : DEFAULT_CONTENT.studioPrices.lightTint.bothTailLights,
    },
    wrap: Array.isArray(input.studioPrices?.wrap) && input.studioPrices.wrap.length === 4 && input.studioPrices.wrap.every((v: any) => Number.isInteger(v) && v >= 0 && v <= 1000000) ? input.studioPrices.wrap : DEFAULT_CONTENT.studioPrices.wrap,
  };
  const fallbackImages = { tintingSectionImage: DEFAULT_CONTENT.tintingSectionImage, glassReplacementImage: DEFAULT_CONTENT.glassReplacementImage, glassRepairImage: DEFAULT_CONTENT.glassRepairImage, showerFilmImage: DEFAULT_CONTENT.showerFilmImage };
  const imageFields: any = {};
  for (const key of Object.keys(fallbackImages)) imageFields[key] = typeof input[key] === 'string' && input[key].length <= 2000 ? input[key] : (fallbackImages as any)[key];
  const tintPriceList = Array.isArray(input.tintPriceList) && input.tintPriceList.length <= 80 ? input.tintPriceList.map((item: any, index: number) => ({ id: String(item.id || 'price-' + index).slice(0, 80), title: str(item.title, 'Услуга'), description: str(item.description, ''), price: Number.isInteger(item.price) && item.price >= 0 && item.price <= 1000000 ? item.price : 0, warranty: str(item.warranty, '—'), group: str(item.group, 'Друго'), order: Number.isInteger(item.order) ? item.order : index + 1 })).filter((item: any) => /^[a-z0-9-]+$/i.test(item.id)) : DEFAULT_CONTENT.tintPriceList;
  return { heroTitle: str(input.heroTitle, DEFAULT_CONTENT.heroTitle), heroSubtitle: str(input.heroSubtitle, DEFAULT_CONTENT.heroSubtitle), phone: str(input.phone, DEFAULT_CONTENT.phone), location: str(input.location, DEFAULT_CONTENT.location), hours: str(input.hours, DEFAULT_CONTENT.hours), tintPriceList, ...imageFields, prices, studioPrices };
}


app.post('/api/admin/upload-image', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Потребна е најава.' });
  const { dataUrl } = req.body || {};
  const match = typeof dataUrl === 'string' ? dataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/) : null;
  if (!match) return res.status(400).json({ error: 'Дозволени се само PNG, JPG и WEBP слики.' });
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) return res.status(413).json({ error: 'Сликата мора да биде помала од 8 MB.' });
  const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
  const filename = `tintology-${Date.now()}-${randomBytes(5).toString('hex')}.${extension}`;
  const uploadDir = process.env.NODE_ENV === 'production' ? path.join(process.cwd(), 'dist', 'uploads') : path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);
  res.json({ url: `/uploads/${filename}` });
});

app.get('/api/admin/session', (req, res) => res.json({ authenticated: isAdmin(req) }));
app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || ADMIN_PASSWORD === 'CHANGE_THIS_TO_A_LONG_RANDOM_PASSWORD') return res.status(503).json({ error: 'Администраторската најава не е конфигурирана. Постави ADMIN_USERNAME и ADMIN_PASSWORD во .env.' });
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const attempt = loginAttempts.get(ip);
  if (attempt && attempt.resetAt > Date.now() && attempt.count >= 6) return res.status(429).json({ error: 'Премногу обиди. Почекај 15 минути и обиди се повторно.' });
  const { username, password } = req.body || {};
  if (!safeEqual(String(username || ''), ADMIN_USERNAME) || !safeEqual(String(password || ''), ADMIN_PASSWORD)) {
    const next = attempt && attempt.resetAt > Date.now() ? attempt : { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };
    next.count += 1; loginAttempts.set(ip, next);
    return res.status(401).json({ error: 'Погрешно корисничко име или лозинка.' });
  }
  loginAttempts.delete(ip);
  const token = randomBytes(32).toString('hex');
  adminSessions.set(token, Date.now() + ADMIN_SESSION_TTL);
  res.setHeader('Set-Cookie', `tintology_admin=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${ADMIN_SESSION_TTL / 1000}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);
  res.json({ authenticated: true });
});
app.post('/api/admin/logout', (req, res) => {
  const token = getCookie(req, 'tintology_admin'); adminSessions.delete(token);
  res.setHeader('Set-Cookie', 'tintology_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
  res.json({ ok: true });
});
app.get('/api/admin/content', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Потребна е најава.' });
  res.json(await readContent());
});
app.put('/api/admin/content', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Потребна е најава.' });
  const content = validateContent(req.body);
  if (!content) return res.status(400).json({ error: 'Податоците или цените не се во правилен формат.' });
  await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), 'utf8');
  res.json(content);
});

app.get('/api/admin/product-prices', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Потребна е најава.' });
  res.json(await readProductPrices());
});
app.put('/api/admin/product-prices', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Потребна е најава.' });
  const prices = validateProductPrices(req.body);
  if (!prices) return res.status(400).json({ error: 'Податоците за каталог цените не се во правилен формат.' });
  await mkdir(path.dirname(PRODUCT_PRICES_PATH), { recursive: true });
  await writeFile(PRODUCT_PRICES_PATH, JSON.stringify(prices, null, 2), 'utf8');
  res.json(prices);
});
app.get('/api/catalog-prices', async (_req, res) => res.json(publicCatalogPrices(await readProductPrices())));
app.get('/api/wrap-catalog-prices', async (_req, res) => res.json(publicWrapCatalogPrices(await readProductPrices())));

app.get('/api/site-content', async (_req, res) => res.json(await readContent()));

const SYSTEM_INSTRUCTION = `Ти си Tintology AI — дигитален асистент на Tintology, сервис за затемнување стакла и автостакла во Осој, Кичево, Северна Македонија. Одговарај љубезно, прецизно и на македонски јазик.

Потврдени информации: 
- Телефон: +389 79 315 600 (повик и WhatsApp).
- Работно време: секој ден од 09:00 до 21:00.
- Instagram: https://share.google/EltPox09uP1jm3fEp
- Facebook: https://share.google/jnaOpcULrSu5pJLOj
- Локација: Осој, Кичево, Северна Македонија.
- Цените за услуги и затемнување стакла се во македонски денари (МКД). Цените во јавниот Wrap каталог се прикажуваат во евра (EUR) по m². Не откривај набавни цени или интерни добавувачи.

Ценовник (користи ги точните износи; не измислувај цени):
1. Сите стакла, освен предно ветробранско: Standard — Купе 5.500, Лимузина 5.500, Џип/Караван 7.500, Комби 9.500; Nanoceramic Lux — 8.000, 8.000, 11.000, 14.000.
2. Заден дел: Standard — 4.000, 4.000, 5.500, 7.000; Nanoceramic Lux — 6.000, 6.000, 7.500, 9.500.
3. Преден дел (возач/совозач): Standard 1.800 за сите категории; Nanoceramic Lux 2.500 за сите категории.
4. Само предно ветробранско: XR88 провидна 3.000; Sky Blue (Kameleon) 5.000; Sky Blue (Kameleon Dark) 6.000 за сите категории.
5. Трака на ветробранско: Standard 1.000 за сите категории.
6. Одлепување на фолија: предни две стакла 400; само шофершајбна 500; заден дел 800; сите стакла 1.200.
7. Предни фарови: цената се зема од администраторскиот ценовник; ако не е поставена, упати на понуда. Не нуди TIF заден дел или затемнување стоп-светла како стандардна услуга.
8. Car Wrap: цената зависи од возилото, материјалот и опфатот; користи ја само цената поставена во администраторскиот ценовник, инаку упати на понуда.
9. Поправка на мало оштетување на предно ветробранско стакло до приближно 3 cm: цената се утврдува по преглед; не измислувај износ.

За точна цена прашај за типот на возило, делот што треба да се обработи и варијантата Standard или Nanoceramic Lux кога е применливо. Во 3D симулаторот достапните проценти се 30%, 50%, 65%, 85% и 95%; кај одредени модели може да има само фиксни 30% и 95%. VLT процентот е избор на нијанса и сам по себе не ја менува цената од ценовникот.

А-тест и законски услови: не ветувај дека конкретна фолија автоматски е дозволена или дека ќе помине А-тест. Објасни дека документацијата и дозволеноста треба да се проверат за конкретната фолија, стакло и возило според важечките прописи.

Гаранција: не ветувај доживотна гаранција. Објасни дека рокот и покриените дефекти зависат од производителот и избраната фолија и се потврдуваат писмено пред монтажа.

За нега, обично се препорачува прозорците да не се спуштаат најмалку 48 часа, но клиентот треба да ги следи конкретните инструкции што ќе ги добие од монтажерот. За конкретна понуда или термин упати го клиентот да се јави на 079 315 600 или да испрати WhatsApp порака.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Потребна е низа од пораки.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ reply: 'AI советникот не е активиран на оваа инсталација. За информации или термин јавете се на 079 315 600 или испратете WhatsApp порака.' });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'tintology-website' } },
    });

    const contents = messages.map((m: { role: 'user' | 'model'; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    res.json({ reply: response.text || 'Извинете, не успеав да генерирам одговор. Ве молиме обидете се повторно.' });
  } catch (error: any) {
    console.error('Gemini chat API error:', error);
    res.status(500).json({
      error: 'Се појави проблем при комуникацијата со Gemini асистентот.',
      details: error?.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tintology server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
