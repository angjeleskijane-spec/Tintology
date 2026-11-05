import React, { useEffect, useState } from 'react';
import { DEFAULT_SITE_CONTENT, SiteContent } from './siteContent';
import { PRODUCTS } from './ProductCatalog';

const fields = [
  ['heroTitle', 'Главен наслов'],
  ['heroSubtitle', 'Опис под насловот'],
  ['phone', 'Телефон'],
  ['location', 'Локација'],
  ['hours', 'Работно време'],
] as const;
const priceNames = [
  ['all', 'Сите стакла (без предно ветробранско)'],
  ['rear', 'Заден дел'],
  ['front', 'Предни две стакла'],
  ['tif', 'TIF – заден дел'],
] as const;
const vehicleNames = ['Купе', 'Лимузина', 'Џип / Караван', 'Комби'];

type ProductPrice = { cfsRegularPrice: number; currency: 'EUR' | 'MKD'; exchangeRate: number; supplierDiscountPct: number; sellingMarkupPct: number; manualSellingPriceMKD: number | null; cfsRegularPriceRSD?: number; eurRsdRate?: number; rateDate?: string; manualSellingPriceEUR?: number | null };
const DEFAULT_PRODUCT_PRICE: ProductPrice = { cfsRegularPrice: 0, currency: 'EUR', exchangeRate: 61.5, supplierDiscountPct: 20, sellingMarkupPct: 10, manualSellingPriceMKD: null, cfsRegularPriceRSD: 0, eurRsdRate: 117.6018, rateDate: '2026-11-05', manualSellingPriceEUR: null };

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [productPrices, setProductPrices] = useState<Record<string, ProductPrice>>({});
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0]?.id || '');
  const selectedProduct = PRODUCTS.find(p => p.id === selectedProductId);
  const selectedPrice = productPrices[selectedProductId] || DEFAULT_PRODUCT_PRICE;
  const isWrapProduct = selectedProduct?.category === 'wrap';
  const baseMKD = selectedPrice.cfsRegularPrice * (selectedPrice.currency === 'EUR' ? selectedPrice.exchangeRate : 1);
  const costMKD = baseMKD * (1 - selectedPrice.supplierDiscountPct / 100);
  const suggestedSellingMKD = baseMKD * (1 + selectedPrice.sellingMarkupPct / 100);
  const actualSellingMKD = selectedPrice.manualSellingPriceMKD !== null ? selectedPrice.manualSellingPriceMKD : suggestedSellingMKD;
  const grossProfitMKD = actualSellingMKD - costMKD;
  const grossMarginPct = actualSellingMKD > 0 ? grossProfitMKD / actualSellingMKD * 100 : 0;
  const baseEUR = (selectedPrice.cfsRegularPriceRSD || 0) / (selectedPrice.eurRsdRate || 117.6018);
  const suggestedSellingEUR = baseEUR * (1 + selectedPrice.sellingMarkupPct / 100);
  const actualSellingEUR = selectedPrice.manualSellingPriceEUR !== null && selectedPrice.manualSellingPriceEUR !== undefined ? selectedPrice.manualSellingPriceEUR : suggestedSellingEUR;
  const grossProfitEUR = actualSellingEUR - baseEUR;
  const grossMarginEURPct = actualSellingEUR > 0 ? grossProfitEUR / actualSellingEUR * 100 : 0;
  const formatEUR = (value: number) => `${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  async function loadContent() {
    const session = await fetch('/api/admin/session');
    const sessionData = await session.json();
    setAuthenticated(Boolean(sessionData.authenticated));
    if (sessionData.authenticated) {
      const response = await fetch('/api/admin/content');
      if (response.ok) setContent(await response.json());
      const priceResponse = await fetch('/api/admin/product-prices');
      if (priceResponse.ok) setProductPrices(await priceResponse.json());
    }
    setLoading(false);
  }
  useEffect(() => { loadContent().catch(() => setLoading(false)); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Најавата не успеа.');
      setAuthenticated(true); setPassword('');
      const saved = await fetch('/api/admin/content');
      if (saved.ok) setContent(await saved.json());
      const priceResponse = await fetch('/api/admin/product-prices');
      if (priceResponse.ok) setProductPrices(await priceResponse.json());
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Грешка при најава.'); }
    finally { setBusy(false); }
  }

  async function save() {
    setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Зачувувањето не успеа.');
      setContent(data); setNotice('Промените се зачувани. Освежи ја главната страница за да ги видиш.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Грешка при зачувување.'); }
    finally { setBusy(false); }
  }

  function updateSelectedProductPrice<K extends keyof ProductPrice>(key: K, value: ProductPrice[K]) {
    setProductPrices(prev => ({ ...prev, [selectedProductId]: { ...(prev[selectedProductId] || DEFAULT_PRODUCT_PRICE), [key]: value } }));
  }
  async function saveProductPrices() {
    setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/admin/product-prices', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productPrices) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Цените не се зачуваа.');
      setProductPrices(data); setNotice('Каталог цените се зачувани. Јавната страна прикажува само продажни цени.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Грешка при зачувување на цените.'); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false); setContent(DEFAULT_SITE_CONTENT); setProductPrices({});
  }

  function updatePrice(area: keyof SiteContent['prices'], pack: 'standard' | 'lux', index: number, value: string) {
    const amount = Math.max(0, Math.min(1000000, Number(value) || 0));
    setContent(prev => ({ ...prev, prices: { ...prev.prices, [area]: { ...prev.prices[area], [pack]: prev.prices[area][pack].map((v, i) => i === index ? amount : v) } } }));
  }

  function updateStudioPrice(key: 'frontLights' | 'oneTailLight' | 'bothTailLights', value: string) {
    const amount = Math.max(0, Math.min(1000000, Number(value) || 0));
    setContent(prev => ({ ...prev, studioPrices: { ...prev.studioPrices, lightTint: { ...prev.studioPrices.lightTint, [key]: amount } } }));
  }
  function updateWrapPrice(index: number, value: string) {
    const amount = Math.max(0, Math.min(1000000, Number(value) || 0));
    setContent(prev => ({ ...prev, studioPrices: { ...prev.studioPrices, wrap: prev.studioPrices.wrap.map((v, i) => i === index ? amount : v) } }));
  }

  if (loading) return <div className="min-h-screen bg-[#08090d] text-white grid place-items-center">Се вчитува...</div>;
  return <main className="min-h-screen bg-[#08090d] text-white px-4 py-8 sm:px-8">
    <div className="mx-auto max-w-5xl">
      <header className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
        <div><div className="text-blue-400 text-xs font-bold tracking-[.25em]">TINTOLOGY</div><h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Администраторски панел</h1></div>
        {authenticated && <button onClick={logout} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Одјави се</button>}
      </header>
      {!authenticated ? <form onSubmit={login} className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-[#11131b] p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-2">Најава</h2><p className="text-sm text-slate-400 mb-6">Внеси ги администраторските податоци.</p>
        <label className="block text-sm mb-2">Корисничко име<input autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 outline-none focus:border-blue-400" required /></label>
        <label className="block text-sm mb-5">Лозинка<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 outline-none focus:border-blue-400" required /></label>
        <button disabled={busy} className="w-full rounded-lg bg-blue-500 py-3 font-bold text-black disabled:opacity-50">{busy ? 'Се проверува...' : 'Најави се'}</button>
        {notice && <p className="text-sm text-rose-300 mt-4">{notice}</p>}
      </form> : <>
        <section className="rounded-2xl border border-slate-800 bg-[#11131b] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-5">Содржина на веб-страницата</h2>
          <div className="grid gap-5">{fields.map(([key, label]) => <label key={key} className="block text-sm font-semibold">{label}
            {key === 'heroSubtitle' ? <textarea rows={3} value={content[key]} onChange={e => setContent(p => ({ ...p, [key]: e.target.value }))} className="mt-2 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 font-normal outline-none focus:border-blue-400" /> : <input value={content[key]} onChange={e => setContent(p => ({ ...p, [key]: e.target.value }))} className="mt-2 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 font-normal outline-none focus:border-blue-400" />}
          </label>)}</div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-[#11131b] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-1">Цени во денари (МКД)</h2><p className="text-xs text-slate-400 mb-5">Измени ги износите што ги користи калкулаторот на веб-страницата.</p>
          {priceNames.map(([area, title]) => <div key={area} className="border-t border-slate-800 py-5"><h3 className="font-bold mb-4">{title}</h3>{(['standard', 'lux'] as const).map(pack => <div key={pack} className="mb-4"><div className="text-sm text-blue-300 mb-2">{pack === 'standard' ? 'Standard' : 'Nanoceramic Lux'}</div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{vehicleNames.map((vehicle, i) => <label key={vehicle} className="text-xs text-slate-400">{vehicle}<input type="number" min="0" max="1000000" value={content.prices[area][pack][i]} onChange={e => updatePrice(area, pack, i, e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-2 text-white" /></label>)}</div></div>)}</div>)}
        </section>
        <section className="rounded-2xl border border-slate-800 bg-[#11131b] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-1">LIGHT TINT – цени во МКД</h2>
          <p className="text-xs text-slate-400 mb-5">Почетните цени за стоп-светлата се внесени според постојната услуга. За фарови може да внесеш цена кога ќе ја одредиш. Нула значи „По понуда“.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([['frontLights', 'Предни фарови'], ['oneTailLight', 'Едно стоп-светло'], ['bothTailLights', 'Двата стопа']] as const).map(([key, label]) => <label key={key} className="text-xs text-slate-400">{label}<input type="number" min="0" max="1000000" value={content.studioPrices.lightTint[key]} onChange={e => updateStudioPrice(key, e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white" /></label>)}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-[#11131b] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-1">CAR WRAP – почетни цени во МКД</h2>
          <p className="text-xs text-slate-400 mb-5">Внеси цена за целосен Wrap според категоријата на возилото. Додека вредноста е 0, симулаторот ќе прикажува „По понуда“.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vehicleNames.map((vehicle, i) => <label key={vehicle} className="text-xs text-slate-400">{vehicle}<input type="number" min="0" max="1000000" value={content.studioPrices.wrap[i]} onChange={e => updateWrapPrice(i, e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white" /></label>)}
          </div>
        </section>
        <section className="rounded-2xl border border-blue-900/50 bg-[#101a28] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-1">КАТАЛОГ – набавни и продажни цени</h2>
          <p className="text-xs text-slate-400 mb-5">За Wrap внеси проверена набавна цена во RSD/m²; системот ја претвора во EUR според средниот курс на НБС и додава 10% маржа. Другите категории го задржуваат постојниот ценовен модел во МКД.</p>
          <label className="block text-sm font-semibold mb-4">Избери производ
            <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="mt-2 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white">
              {PRODUCTS.map(product => <option key={product.id} value={product.id}>{product.brand} · {product.name} {product.code ? `(${product.code})` : ''}</option>)}
            </select>
          </label>
          {selectedProduct && <div className="mb-5 rounded-xl border border-slate-700 bg-[#080f19] p-4"><div className="font-bold text-white">{selectedProduct.name}</div><div className="mt-1 text-xs text-slate-400">{selectedProduct.brand} · {selectedProduct.series} {selectedProduct.code ? `· ${selectedProduct.code}` : ''}</div></div>}
          {isWrapProduct ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs text-slate-400">Набавна цена (RSD / m²)<input type="number" min="0" step="0.01" value={selectedPrice.cfsRegularPriceRSD || ''} onChange={e => updateSelectedProductPrice('cfsRegularPriceRSD', Math.max(0, Number(e.target.value) || 0))} placeholder="Потврдена цена во RSD" className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Среден курс НБС (RSD за 1 EUR)<input type="number" min="0.01" step="0.0001" value={selectedPrice.eurRsdRate || 117.6018} onChange={e => updateSelectedProductPrice('eurRsdRate', Math.max(0.01, Number(e.target.value) || 117.6018))} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Датум на курсот<input type="date" value={selectedPrice.rateDate || '2026-11-05'} onChange={e => updateSelectedProductPrice('rateDate', e.target.value)} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Маржа (%)<input type="number" min="0" max="500" step="0.1" value={selectedPrice.sellingMarkupPct} onChange={e => updateSelectedProductPrice('sellingMarkupPct', Math.max(0, Math.min(500, Number(e.target.value) || 0)))} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Рачна продажна цена (EUR / m², опционално)<input type="number" min="0" step="0.01" value={selectedPrice.manualSellingPriceEUR ?? ''} onChange={e => updateSelectedProductPrice('manualSellingPriceEUR', e.target.value === '' ? null : Math.max(0, Number(e.target.value) || 0))} placeholder="Автоматска цена" className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
          </div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs text-slate-400">CFS редовна цена<input type="number" min="0" step="0.01" value={selectedPrice.cfsRegularPrice || ''} onChange={e => updateSelectedProductPrice('cfsRegularPrice', Math.max(0, Number(e.target.value) || 0))} placeholder="Внеси CFS цена" className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Валута на CFS<select value={selectedPrice.currency} onChange={e => updateSelectedProductPrice('currency', e.target.value as 'EUR'|'MKD')} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"><option value="EUR">EUR (€)</option><option value="MKD">MKD (ден.)</option></select></label>
            <label className="text-xs text-slate-400">Курс EUR → MKD<input type="number" min="0.01" step="0.01" value={selectedPrice.exchangeRate} onChange={e => updateSelectedProductPrice('exchangeRate', Math.max(0.01, Number(e.target.value) || 61.5))} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Твој попуст (%)<input type="number" min="0" max="100" step="0.1" value={selectedPrice.supplierDiscountPct} onChange={e => updateSelectedProductPrice('supplierDiscountPct', Math.max(0, Math.min(100, Number(e.target.value) || 0)))} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Над редовната CFS цена (%)<input type="number" min="0" max="500" step="0.1" value={selectedPrice.sellingMarkupPct} onChange={e => updateSelectedProductPrice('sellingMarkupPct', Math.max(0, Math.min(500, Number(e.target.value) || 0)))} className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
            <label className="text-xs text-slate-400">Рачна продажна цена (МКД, опционално)<input type="number" min="0" step="1" value={selectedPrice.manualSellingPriceMKD ?? ''} onChange={e => updateSelectedProductPrice('manualSellingPriceMKD', e.target.value === '' ? null : Math.max(0, Number(e.target.value) || 0))} placeholder="Автоматска цена" className="mt-1 w-full rounded-lg bg-[#08090d] border border-slate-700 p-3 text-white"/></label>
          </div>}
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(isWrapProduct ? [['Набавна цена во EUR', formatEUR(baseEUR)],['Tintology продажна цена', formatEUR(actualSellingEUR)],['Бруто-разлика', formatEUR(grossProfitEUR)],['Бруто-маржа', grossMarginEURPct.toFixed(1) + '%']] : [['CFS редовна цена', `${baseMKD.toLocaleString('mk-MK',{maximumFractionDigits:0})} ден.`],['Твоја набавна цена', `${costMKD.toLocaleString('mk-MK',{maximumFractionDigits:0})} ден.`],['Tintology продажна цена', `${actualSellingMKD.toLocaleString('mk-MK',{maximumFractionDigits:0})} ден.`],['Бруто-разлика / маржа', `${grossProfitMKD.toLocaleString('mk-MK',{maximumFractionDigits:0})} ден. · ${grossMarginPct.toFixed(1)}%`]]).map(([label,value])=><div key={label} className="rounded-xl border border-slate-700 bg-[#0a111b] p-3"><div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-sm font-bold text-white">{value}</div></div>)}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-400">Цените се внесуваат по производ; не се преземаат автоматски од CFS и не се измислуваат.</p><button disabled={busy} onClick={saveProductPrices} className="rounded-lg bg-blue-500 px-6 py-3 text-sm font-bold text-black disabled:opacity-50">{busy ? 'Се зачувува...' : 'Зачувај цени на каталогот'}</button></div>
        </section>
        <div className="sticky bottom-4 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-700 bg-[#11131b]/95 p-3 backdrop-blur"><p className="text-xs text-slate-400">Измените ги податоците и зачувајте ги.</p><button disabled={busy} onClick={save} className="w-full sm:w-auto rounded-lg bg-blue-500 px-8 py-3 font-bold text-black disabled:opacity-50">{busy ? 'Се зачувува...' : 'Зачувај промени'}</button></div>
        {notice && <p className="mt-4 text-sm text-emerald-300">{notice}</p>}
      </>}
    </div>
  </main>;
}
