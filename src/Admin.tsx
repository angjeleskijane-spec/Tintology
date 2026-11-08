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
  async function uploadImage(key: 'tintingSectionImage' | 'glassReplacementImage' | 'glassRepairImage' | 'showerFilmImage', file: File) {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { setNotice('Избери PNG, JPG или WEBP слика.'); return; }
    if (file.size > 8 * 1024 * 1024) { setNotice('Сликата мора да биде помала од 8 MB.'); return; }
    setBusy(true); setNotice('');
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Не успеав да ја прочитам сликата.'));
        reader.onerror = () => reject(new Error('Не успеав да ја прочитам сликата.'));
        reader.readAsDataURL(file);
      });
      const response = await fetch('/api/admin/upload-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dataUrl, fileName: file.name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Поставувањето на сликата не успеа.');
      setContent(prev => ({ ...prev, [key]: data.url }));
      setNotice('Сликата е поставена. Зачувај ги промените за да се прикаже на веб-страницата.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Грешка при поставување на сликата.'); }
    finally { setBusy(false); }
  }

  function updateTintPrice(index: number, key: 'title' | 'description' | 'price' | 'warranty' | 'group', value: string) {
    setContent(prev => ({ ...prev, tintPriceList: prev.tintPriceList.map((item, i) => i === index ? { ...item, [key]: key === 'price' ? Math.max(0, Math.min(1000000, Number(value) || 0)) : value } : item) }));
  }
  function addTintPrice() {
    const nextOrder = Math.max(0, ...content.tintPriceList.map(item => item.order)) + 1;
    setContent(prev => ({ ...prev, tintPriceList: [...prev.tintPriceList, { id: `custom-${Date.now()}`, title: 'Нова услуга', description: '', price: 0, warranty: '—', group: 'Друго', order: nextOrder }] }));
  }
  function removeTintPrice(index: number) {
    setContent(prev => ({ ...prev, tintPriceList: prev.tintPriceList.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i + 1 })) }));
  }
  function moveTintPrice(index: number, direction: -1 | 1) {
    setContent(prev => { const items = [...prev.tintPriceList].sort((a,b) => a.order-b.order); const target = index + direction; if (target < 0 || target >= items.length) return prev; [items[index], items[target]] = [items[target], items[index]]; return { ...prev, tintPriceList: items.map((item, i) => ({ ...item, order: i + 1 })) }; });
  }


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
        <div className="flex items-center gap-3">
          <a href="/git" className="rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 px-3.5 py-2 text-xs font-semibold hover:bg-red-600/30 transition flex items-center gap-1.5">
            <span>Git Студио (Push / Fetch)</span>
          </a>
          {authenticated && <button onClick={logout} className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">Одјави се</button>}
        </div>
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

        <section className="rounded-2xl border border-blue-900/50 bg-[#101a28] p-5 sm:p-7 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h2 className="text-lg font-bold">ЦЕНОВНИК – XPEL и услуги</h2><p className="mt-1 text-xs text-slate-400">Додавај, менувај, бриши и менувај го редоследот на јавните ставки.</p></div><button type="button" onClick={addTintPrice} className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-black">+ Додај ставка</button></div>
          <div className="space-y-4">{[...content.tintPriceList].sort((a,b)=>a.order-b.order).map((item, sortedIndex) => {
            const actualIndex = content.tintPriceList.findIndex(entry => entry.id === item.id);
            return <div key={item.id} className="rounded-xl border border-slate-700 bg-[#0a111b] p-4">
              <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-bold text-blue-300">Ставка {sortedIndex+1}</span><div className="flex gap-2"><button type="button" onClick={()=>moveTintPrice(sortedIndex,-1)} disabled={sortedIndex===0} className="rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-30">↑</button><button type="button" onClick={()=>moveTintPrice(sortedIndex,1)} disabled={sortedIndex===content.tintPriceList.length-1} className="rounded border border-slate-600 px-3 py-1 text-xs disabled:opacity-30">↓</button><button type="button" onClick={()=>removeTintPrice(actualIndex)} className="rounded border border-rose-900 px-3 py-1 text-xs text-rose-300">Избриши</button></div></div>
              <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-400">Наслов<input value={item.title} onChange={e=>updateTintPrice(actualIndex,'title',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-2.5 text-white"/></label><label className="text-xs text-slate-400">Група<input value={item.group} onChange={e=>updateTintPrice(actualIndex,'group',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-2.5 text-white"/></label><label className="text-xs text-slate-400">Цена (МКД)<input type="number" min="0" value={item.price} onChange={e=>updateTintPrice(actualIndex,'price',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-2.5 text-white"/></label><label className="text-xs text-slate-400">Гаранција<input value={item.warranty} onChange={e=>updateTintPrice(actualIndex,'warranty',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-2.5 text-white"/></label><label className="text-xs text-slate-400 sm:col-span-2">Опис<textarea rows={2} value={item.description} onChange={e=>updateTintPrice(actualIndex,'description',e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-2.5 text-white"/></label></div>
            </div>;
          })}</div>
        </section>
        <section className="rounded-2xl border border-slate-800 bg-[#11131b] p-5 sm:p-7 mb-6">
          <h2 className="text-lg font-bold mb-2">Слики на почетната страна</h2><p className="mb-4 text-xs text-slate-400">Внеси директен HTTPS линк до сликата. Измените се зачувуваат со копчето „Зачувај промени“.</p>
          <div className="grid gap-4 sm:grid-cols-2">{([
            ['tintingSectionImage','Затемнување стакла'],
            ['glassReplacementImage','Промена на стакло'],
            ['glassRepairImage','Репарација – слика со пукнатина'],
            ['showerFilmImage','Фолија за туш кабини'],
          ] as const).map(([key,label])=><div key={key} className="rounded-xl border border-slate-700 bg-[#0a111b] p-3"><label className="block text-xs text-slate-300">{label}<input value={content[key]} onChange={e=>setContent(prev=>({...prev,[key]:e.target.value}))} placeholder="https://..." className="mt-1 w-full rounded-lg border border-slate-700 bg-[#08090d] p-3 text-white"/></label><label className="mt-3 block text-xs text-slate-400">Или избери слика од компјутер (PNG/JPG/WEBP, до 8 MB)<input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(file) uploadImage(key,file);e.currentTarget.value='';}} className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500 file:px-3 file:py-2 file:font-bold file:text-black"/></label>{content[key] && <img src={content[key]} alt={label} className="mt-3 h-28 w-full rounded-lg border border-slate-700 object-cover"/>}</div>)}</div>
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
