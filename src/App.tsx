import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Sun,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Car,
  ChevronRight,
  ChevronDown,
  Sliders,
  Send,
  X,
  Menu,
  ExternalLink,
  Layers,
  Wrench,
  Eye,
  Check,
  Calendar,
  User,
  Info,
  HelpCircle,
  Bot,
  RotateCcw,
  Search,
  Star,
  Quote,
  ThumbsUp,
  Instagram,
  Facebook,
  Building2,
  FolderGit2
} from 'lucide-react';

import tintologyLogo from './assets/images/tintology-owl-metallic.png';
import { DEFAULT_SITE_CONTENT, SiteContent } from './siteContent';
import CarStudio from './CarStudio';
import ProductCatalog from './ProductCatalog';

const phase25TintImage = '/tintology-window-tint-phase25.webp';
const phase25RepairImage = '/tintology-windshield-repair-phase25.png';

// Vehicle categories and published prices (all amounts are in MKD).
interface VehicleOption {
  id: string;
  name: string;
  category: string;
  priceIndex: number;
  duration: string;
}

const VEHICLE_OPTIONS: VehicleOption[] = [
  { id: 'coupe', name: 'Купе', category: 'Купе', priceIndex: 0, duration: '2 – 2.5 часа' },
  { id: 'limousine', name: 'Лимузина', category: 'Лимузина', priceIndex: 1, duration: '2 – 2.5 часа' },
  { id: 'jeep', name: 'Џип / Караван', category: 'Џип или караван', priceIndex: 2, duration: '2.5 – 3 часа' },
  { id: 'van', name: 'Комби', category: 'Комби', priceIndex: 3, duration: '2.5 – 3 часа' },
];

type PriceArea = 'all' | 'rear' | 'front' | 'tif' | 'windshield' | 'strip';
type FilmPackage = 'standard' | 'lux';

const PRICE_TABLE: Record<'all' | 'rear' | 'front' | 'tif', Record<FilmPackage, number[]>> = {
  all: { standard: [5500, 5500, 7500, 9500], lux: [8000, 8000, 11000, 14000] },
  rear: { standard: [4000, 4000, 5500, 7000], lux: [6000, 6000, 7500, 9500] },
  front: { standard: [1800, 1800, 1800, 1800], lux: [2500, 2500, 2500, 2500] },
  tif: { standard: [4500, 4500, 6000, 7500], lux: [6500, 6500, 8000, 10000] },
};

interface TintLevel {
  vlt: number; label: string; name: string; privacy: number;
  heatRejection: string; uvProtection: string; description: string; legalStatus: string;
}

const TINT_LEVELS: TintLevel[] = [
  { vlt: 5, label: '5%', name: 'Limo Black', privacy: 5, heatRejection: 'Според фолијата', uvProtection: 'Според спецификација', description: 'Максимална приватност и изразено затемнување. Пред избор, проверете ја дозволеноста за конкретното стакло.', legalStatus: 'Проверете ги важечките услови за задни стакла' },
  { vlt: 20, label: '20%', name: 'Dark Sport', privacy: 4, heatRejection: 'Според фолијата', uvProtection: 'Според спецификација', description: 'Спортски изглед со добар баланс меѓу приватност и видливост.', legalStatus: 'Изборот треба да одговара на важечките прописи' },
  { vlt: 35, label: '35%', name: 'Medium Smoke', privacy: 3, heatRejection: 'Според фолијата', uvProtection: 'Според спецификација', description: 'Умерено затемнување со суптилен фабрички изглед.', legalStatus: 'Проверете ја пропустливоста на стаклото' },
  { vlt: 50, label: '50%', name: 'Light Tint', privacy: 2, heatRejection: 'Според фолијата', uvProtection: 'Според спецификација', description: 'Дискретно тонирање со минимална промена на изгледот.', legalStatus: 'Проверете ја пропустливоста на стаклото' },
  { vlt: 70, label: '70%', name: 'Nano-Ceramic Clear', privacy: 1, heatRejection: 'Според фолијата', uvProtection: 'Според спецификација', description: 'Речиси проѕирна нијанса за дискретна заштита од сонце.', legalStatus: 'Проверете ги условите за предни стакла' },
];

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  useEffect(() => { fetch('/api/site-content').then(r => r.ok ? r.json() : null).then(data => { if (data) setSiteContent({ ...DEFAULT_SITE_CONTENT, ...data, tintPriceList: Array.isArray(data.tintPriceList) ? data.tintPriceList : DEFAULT_SITE_CONTENT.tintPriceList }); }).catch(() => {}); }, []);
  const phoneDigits = `+389${siteContent.phone.replace(/\D/g, '').replace(/^0/, '')}`;
  const whatsappDigits = phoneDigits.replace(/^\+/, '');
  // Simulator State
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[0]);
  const [selectedTint, setSelectedTint] = useState<TintLevel>(TINT_LEVELS[1]);
  const [selectedPriceArea, setSelectedPriceArea] = useState<PriceArea>('all');
  const [selectedPackage, setSelectedPackage] = useState<FilmPackage>('standard');
  const [selectedWindshieldFilm, setSelectedWindshieldFilm] = useState<'xr88' | 'chameleon'>('xr88');
  const [simulatorView, setSimulatorView] = useState<'front' | 'side' | 'rear'>('front');
  const [selectedGlassZone, setSelectedGlassZone] = useState<'all' | 'windshield' | 'frontSide' | 'rearSide' | 'rearWindshield'>('all');
  const glassTintOpacity = Math.max(0.08, Math.min(0.92, 1 - selectedTint.vlt / 100));
  const isKameleon = selectedWindshieldFilm === 'chameleon';
  const glassFill = (zone: 'windshield' | 'frontSide' | 'rearSide' | 'rearWindshield') => {
    const active = selectedGlassZone === 'all' || selectedGlassZone === zone;
    if (!active) return '#263746';
    if (zone === 'windshield' && isKameleon) return 'url(#kameleonGlass)';
    return `rgba(3, 10, 20, ${glassTintOpacity})`;
  };

  // Gemini Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Здраво! Јас сум Tintology AI асистентот. Како можам да ви помогнам денес со затемнувањето на вашите стакла во Кичево, изборот на процент на фолија или А-тест документацијата?',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<'mk' | 'sq' | 'en'>('mk');
  const tr = (mk: string, sq: string, en: string) => language === 'sq' ? sq : language === 'en' ? en : mk;
  const serviceMenuItems = [
    { title: tr('Затемнување автомобилски стакла', 'Errësim i xhamave të automjetit', 'Automotive window tinting'), href: '/zatemnuvanje-stakla', image: phase25TintImage, alt: 'Монтажа на фолија за затемнување автомобилски стакла', description: tr('Професионално затемнување со избор на нијанси и заштита од сонце.', 'Errësim profesional me nuanca të ndryshme dhe mbrojtje nga dielli.', 'Professional window tinting with shade options and solar protection.') },
    { title: tr('Замена на шофершајбна', 'Zëvendësim i xhamit të përparmë', 'Windshield replacement'), href: '/zamena-avtostakla', image: siteContent.glassReplacementImage || 'https://images.pexels.com/photos/11950154/pexels-photo-11950154.jpeg?cs=srgb&dl=pexels-uk-car-glass-222332278-11950154.jpg&fm=jpg', alt: 'Работа со лепило при монтажа на автомобилско ветробранско стакло', description: tr('Замена на оштетено ветробранско стакло со правилна монтажа.', 'Zëvendësim i xhamit të dëmtuar me montim profesional.', 'Replacement of damaged windshields with professional installation.') },
    { title: tr('Репарација на шофершајбна', 'Riparim i xhamit të përparmë', 'Windshield repair'), href: '/reparacija-avtostakla', image: phase25RepairImage, alt: 'Техничар врши поправка на автомобилско ветробранско стакло', description: tr('Репарација на оштетувања и мали пукнатини на ветробранско стакло.', 'Riparim i dëmtimeve dhe çarjeve të vogla në xhamin e përparmë.', 'Repair of chips and small cracks in windshields.') },
    { title: tr('Фолии за домови и објекти', 'Filma për shtëpi dhe objekte', 'Films for homes and buildings'), href: '/folii-za-domovi-i-objekti', image: 'https://images.pexels.com/photos/27985107/pexels-photo-27985107.jpeg?cs=srgb&dl=pexels-jan-van-der-wolf-11680885-27985107.jpg&fm=jpg', alt: 'Модерна стаклена фасада на објект', description: tr('Сончева, топлинска и декоративна заштита за домови и деловни објекти.', 'Mbrojtje nga dielli, nxehtësia dhe dekorim për shtëpi e objekte.', 'Solar, heat and decorative films for homes and commercial buildings.') },
    { title: tr('Фолија за туш кабини – Anti Limescale', 'Film për kabina dushi – Anti Limescale', 'Shower enclosure film – Anti Limescale'), href: '/folija-za-tus-kabini', image: siteContent.showerFilmImage || DEFAULT_SITE_CONTENT.showerFilmImage, alt: 'Стаклена туш кабина со заштитна фолија', description: tr('Заштита на стаклото и полесно одржување со соодветна фолија против наслаги.', 'Mbrojtje e xhamit dhe mirëmbajtje më e lehtë me film kundër depozitave.', 'Glass protection and easier maintenance with a suitable anti-limescale film.') },
    { title: 'Car Wrap · ' + tr('Промена на боја', 'Ndryshim i ngjyrës', 'Colour change'), href: '/wrap', image: 'https://images.pexels.com/photos/10162528/pexels-photo-10162528.jpeg?cs=srgb&dl=pexels-autorecords-10162528.jpg&fm=jpg', alt: 'Монтажа на винил фолија за промена на боја на автомобил', description: tr('Целосна и делумна промена на боја со винилни фолии.', 'Ndryshim i plotë ose i pjesshëm i ngjyrës me filma vinili.', 'Full or partial colour changes using premium vinyl films.') },
    { title: 'PPF · ' + tr('Заштита на бојата', 'Mbrojtje e bojës', 'Paint protection'), href: '/ppf-zastita', image: 'https://images.pexels.com/photos/36021355/pexels-photo-36021355.jpeg?cs=srgb&dl=pexels-tejas-jr-528833302-36021355.jpg&fm=jpg', alt: 'Монтажа на PPF заштитна фолија на автомобил', description: tr('Транспарентна заштита на лакот од гребнатини и секојдневно оштетување.', 'Mbrojtje transparente e bojës nga gërvishtjet dhe dëmtimet e përditshme.', 'Transparent paint protection against scratches and everyday damage.') },
  ];
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const [isPriceListOpen, setIsPriceListOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    vehicleModel: '',
    serviceType: 'Затемнување на стакла',
    tintPreference: '20% Dark Sport',
    preferredDate: '',
    note: '',
  });

  // Inline Quick Contact Form State
  const [inlineContact, setInlineContact] = useState({
    name: '',
    phone: '',
    model: '',
    message: '',
  });
  const [inlineSubmitted, setInlineSubmitted] = useState<boolean>(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isChatOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const priceAreaLabel = ({
    all: 'Сите стакла (освен предно ветробранско)',
    rear: 'Заден дел',
    front: 'Преден дел (возач / совозач)',
    tif: 'TIF – заден дел',
    windshield: 'Само предно ветробранско',
    strip: 'Трака на ветробранско',
  } as Record<PriceArea, string>)[selectedPriceArea];

  const estimatedPrice = selectedPriceArea === 'windshield'
    ? ({ xr88: 3000, chameleon: 5000 } as const)[selectedWindshieldFilm]
    : selectedPriceArea === 'strip'
      ? 1000
      : siteContent.prices[selectedPriceArea][selectedPackage][selectedVehicle.priceIndex];

  const pricePackageRequired = selectedPriceArea !== 'windshield' && selectedPriceArea !== 'strip';

  const openBookingWithConfig = () => {
    setModalSuccess(false);
    setFormData((prev) => ({
      ...prev,
      vehicleModel: selectedVehicle.name,
      tintPreference: `${selectedTint.label} ${selectedTint.name}`,
      serviceType: priceAreaLabel,
      note: `Избран пакет: ${pricePackageRequired ? (selectedPackage === 'standard' ? 'Standard' : 'Nanoceramic Lux') : selectedPriceArea === 'windshield' ? selectedWindshieldFilm : 'Standard'}. Фолија: ${selectedTint.label} ${selectedTint.name}. Цена според ценовник: ${estimatedPrice.toLocaleString('mk-MK')} ден.`,
    }));
    setIsModalOpen(true);
  };

  const handleStudioBooking = (payload: { vehicleModel: string; serviceType: string; preference: string; note: string }) => {
    setModalSuccess(false);
    setFormData((prev) => ({ ...prev, vehicleModel: payload.vehicleModel, serviceType: payload.serviceType, tintPreference: payload.preference, note: payload.note }));
    setIsModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      'Здраво, сакам да побарам термин во Tintology.',
      `Име: ${formData.fullName}`,
      `Телефон: ${formData.phone}`,
      `Возило: ${formData.vehicleModel}`,
      `Услуга: ${formData.serviceType}`,
      `Фолија: ${formData.tintPreference}`,
      `Посакуван датум: ${formData.preferredDate}`,
      `Забелешка: ${formData.note || 'Нема'}`,
    ].join('\n');
    window.open(`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setModalSuccess(true);
  };

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      'Здраво, сакам информации/термин во Tintology.',
      `Име: ${inlineContact.name}`,
      `Телефон: ${inlineContact.phone}`,
      `Возило: ${inlineContact.model}`,
      `Порака: ${inlineContact.message || 'Нема дополнителна порака'}`,
    ].join('\n');
    window.open(`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setInlineSubmitted(true);
  };

  // Handle Send Chat to Gemini Backend
  const handleSendChat = async (messageToSend?: string) => {
    const text = (messageToSend || chatInput).trim();
    if (!text || isChatLoading) return;

    const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();
      if (!response.ok && !data.reply) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setChatMessages((prev) => [...prev, { role: 'model', text: data.reply || 'Нема одговор.' }]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `Се извинуваме, имаше краток проблем со врската. Ве молиме обидете се повторно или јавете се на ${siteContent.phone}.`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const homepageShowcaseItems = [
        {
          id: 'home-automotive-tint', eyebrow: 'TINTOLOGY · АВТОМОБИЛСКИ ФОЛИИ',
          title: tr('Затемнување автомобилски стакла', 'Errësim i xhamave të automjetit', 'Automotive window tinting'),
          description: tr('Повеќе комфор зад воланот со внимателно избрана нијанса, намален отсјај и дополнителна заштита од сончевата топлина. Изборот на фолија го прилагодуваме на возилото и твоите желби.', 'Më shumë rehati pas timonit me nuancë të zgjedhur me kujdes, më pak shkëlqim dhe mbrojtje shtesë nga nxehtësia e diellit. Filmin e përshtatim me automjetin dhe dëshirat tuaja.', 'More comfort behind the wheel with a carefully selected shade, reduced glare and added protection from solar heat. We match the film to your vehicle and preferences.'),
          href: '/zatemnuvanje-stakla', image: serviceMenuItems[0].image, alt: serviceMenuItems[0].alt,
          points: [tr('Избор на нијанси и степен на затемнување','Zgjedhje e nuancave dhe nivelit të errësimit','Shade and tint-level options'), tr('Прецизна монтажа на стаклата','Montim i saktë në xhama','Precise glass installation')]
        },
        {
          id: 'home-windshield-replacement', eyebrow: 'TINTOLOGY · ЗАМЕНА НА СТАКЛА',
          title: tr('Замена на шофершајбна', 'Zëvendësim i xhamit të përparmë', 'Windshield replacement'),
          description: tr('Кога оштетувањето бара ново стакло, важни се точната спецификација и правилната монтажа. Проверуваме сензори, камери, грејачи и опрема за да се избере соодветно решение за возилото.', 'Kur dëmtimi kërkon xham të ri, rëndësi kanë specifikimi i saktë dhe montimi i duhur. Kontrollojmë sensorët, kamerat, ngrohësit dhe pajisjet për të zgjedhur zgjidhjen e përshtatshme.', 'When damage calls for new glass, correct specifications and proper installation matter. We check sensors, cameras, heating elements and equipment to select the right solution.'),
          href: '/zamena-avtostakla', image: serviceMenuItems[1].image, alt: serviceMenuItems[1].alt,
          points: [tr('Проверка според марка и модел','Kontroll sipas markës dhe modelit','Vehicle-specific compatibility check'), tr('Внимателна подготовка и монтажа','Përgatitje dhe montim i kujdesshëm','Careful preparation and installation')]
        },
        {
          id: 'home-windshield-repair', eyebrow: 'TINTOLOGY · РЕПАРАЦИЈА',
          title: tr('Репарација на шофершајбна', 'Riparim i xhamit të përparmë', 'Windshield repair'),
          description: tr('Малото оштетување не мора секогаш да значи замена на целото стакло. Ја проверуваме големината, позицијата и типот на оштетувањето и проценуваме дали може безбедно да се репарира.', 'Dëmtimi i vogël nuk do të thotë gjithmonë zëvendësim i gjithë xhamit. Kontrollojmë madhësinë, pozicionin dhe llojin e dëmtimit dhe vlerësojmë nëse mund të riparohet në mënyrë të sigurt.', 'A small chip does not always mean the whole windshield needs replacing. We assess the size, position and type of damage to determine whether a safe repair is possible.'),
          href: '/reparacija-avtostakla', image: serviceMenuItems[2].image, alt: serviceMenuItems[2].alt,
          points: [tr('Проценка пред секоја интервенција','Vlerësim para çdo ndërhyrjeje','Assessment before every repair'), tr('Поправка на соодветни мали оштетувања','Riparim i dëmtimeve të vogla të përshtatshme','Repair of suitable minor damage')]
        },
        {
          id: 'home-ppf-protection', eyebrow: 'TINTOLOGY · PPF ЗАШТИТА',
          title: tr('Заштити го оригиналниот изглед на бојата', 'Mbroni pamjen origjinale të bojës', 'Protect the original paint finish'),
          description: tr('PPF создава дополнителен транспарентен слој врз автомобилскиот лак. Помага да се намали ризикот од ситни камчиња, лесни гребнатини и секојдневно абење на најизложените делови.', 'PPF krijon një shtresë shtesë transparente mbi bojën e automjetit. Ndihmon në uljen e rrezikut nga gurëzat, gërvishtjet e lehta dhe konsumimi i përditshëm në pjesët më të ekspozuara.', 'PPF adds a transparent layer over automotive paint, helping reduce the risk of stone chips, light scratches and everyday wear on exposed areas.'),
          href: '/ppf-zastita', image: serviceMenuItems[6].image, alt: serviceMenuItems[6].alt,
          points: [tr('Заштита на избрани панели или поголеми зони','Mbrojtje e paneleve ose zonave më të mëdha','Protection for selected panels or larger areas'), tr('Транспарентен финиш','Përfundim transparent','Transparent finish')]
        },
        {
          id: 'home-car-wrap', eyebrow: 'TINTOLOGY · CAR WRAP',
          title: tr('Промени го изгледот. Зачувај го карактерот.', 'Ndrysho pamjen. Ruaj karakterin.', 'Change the look. Keep the character.'),
          description: tr('Со винилна фолија можеш да му дадеш нов изглед на автомобилот — од целосна промена на боја до внимателно избрани детали. Разгледај различни бои и финиши пред да ја донесеш одлуката.', 'Me film vinili mund t’i japësh automjetit pamje të re — nga ndryshimi i plotë i ngjyrës deri te detajet e zgjedhura. Shiko ngjyra dhe përfundime të ndryshme para vendimit.', 'Vinyl film gives your vehicle a new look, from a full colour change to carefully selected details. Explore colours and finishes before deciding.'),
          href: '/wrap', image: serviceMenuItems[5].image, alt: serviceMenuItems[5].alt,
          points: [tr('Целосна или делумна промена на боја','Ndryshim i plotë ose i pjesshëm i ngjyrës','Full or partial colour change'), tr('Избор на бои и финиши','Zgjedhje e ngjyrave dhe përfundimeve','Choice of colours and finishes')]
        }
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 selection:bg-blue-500 selection:text-black">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. TOP BAR NAVIGATION                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1e1e28] bg-[#09090b]/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={tintologyLogo}
              alt="Tintology лого – був"
              className="h-12 w-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Tintology<span className="text-blue-400">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                {tr('Професионални фолии и заштита', 'Filma dhe mbrojtje profesionale', 'Professional films & protection')}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Macedonian) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-200">
            <a href="#about" className="hover:text-blue-400 transition-colors whitespace-nowrap">За Нас</a>
            <a href="#services" className="hover:text-blue-400 transition-colors whitespace-nowrap">Услуги</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors whitespace-nowrap">Контакт</a>
            <a
              href="/git"
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/30 px-2.5 py-1 text-xs font-mono text-red-400 hover:bg-red-900/40 hover:text-red-300 transition"
              title="Отвори Git & Code Studio (Push / Fetch)"
            >
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Git Hub</span>
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <label className="sr-only" htmlFor="site-language">Language</label>
            <select id="site-language" value={language} onChange={(e) => setLanguage(e.target.value as 'mk' | 'sq' | 'en')} className="rounded-lg border border-[#30303d] bg-[#111119] px-2.5 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-blue-500">
              <option value="mk">МК</option><option value="sq">AL</option><option value="en">EN</option>
            </select>
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5 text-blue-400" />
              <span>{tr('AI советник', 'Këshilltari AI', 'AI assistant')}</span>
            </button>
            <a
              href={`tel:${phoneDigits}`}
              className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-blue-400" />
              <span>{siteContent.phone}</span>
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg shadow-lg shadow-blue-500/20 hover:from-blue-300 hover:to-blue-400 hover:shadow-blue-400/30 transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {tr('Закажи термин', 'Rezervo termin', 'Book an appointment')}
            </button>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            aria-label="Отвори мени"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#1e1e28] bg-[#0c0c11] px-6 py-6 space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{tr('Јазик', 'Gjuha', 'Language')}</span>
              <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value as 'mk' | 'sq' | 'en')} className="rounded-lg border border-[#30303d] bg-[#111119] px-3 py-2 text-sm text-white"><option value="mk">Македонски</option><option value="sq">Shqip</option><option value="en">English</option></select>
            </div>
            <div className="flex flex-col space-y-3 text-base font-medium text-slate-200">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-400 transition-colors">За Нас</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-400 transition-colors">Услуги</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-1 hover:text-blue-400 transition-colors">Контакт</a>
              <a href="/git" onClick={() => setMobileMenuOpen(false)} className="py-1 text-red-400 hover:text-red-300 flex items-center gap-2 font-mono text-sm">
                <FolderGit2 className="h-4 w-4" />
                <span>Git Studio (Push & Fetch)</span>
              </a>
            </div>
            <div className="pt-3 border-t border-[#1e1e28] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsChatOpen(true);
                }}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-blue-300 bg-blue-950/50 border border-blue-800/40 rounded-lg cursor-pointer"
              >
                <Bot className="h-4 w-4 text-blue-400" />
                <span>{tr('Отвори Tintology AI Консултант', 'Hap këshilltarin AI të Tintology', 'Open Tintology AI assistant')}</span>
              </button>
              <a
                href={`tel:${phoneDigits}`}
                className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-200 bg-[#171720] rounded-lg border border-[#272736]"
              >
                <Phone className="h-4 w-4 text-blue-400" />
                <span>Јави се: {siteContent.phone}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-blue-400 rounded-lg shadow-md cursor-pointer"
              >
                Закажи Термин Online
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero block removed per approved Tintology homepage update. */}

      <section id="about" className="scroll-mt-24 border-t border-[#1c1c28] bg-[#0a1019] py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-3 text-xs font-bold uppercase tracking-[.22em] text-blue-300">TINTOLOGY · ЗА НАС</div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Професионална грижа за секое возило.</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300">Tintology нуди професионално затемнување на автомобилски стакла, репарација и замена на автостакла, како и автомобилски Wrap и заштитни фолии. Работиме со внимание на деталите, квалитетни материјали и прецизна монтажа.</p>
          </div>
        </div>
      </section>
      <section id="services" className="border-t border-[#1c1c28] bg-[#090d14] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            <div className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-blue-400">TINTOLOGY · УСЛУГИ</div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{tr('Сè за стаклата, изгледот и заштитата на автомобилот и објектите.', 'Gjithçka për xhamat, pamjen dhe mbrojtjen e automjeteve dhe objekteve.', 'Everything for glass, appearance and protection of vehicles and buildings.')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {serviceMenuItems.map((item, index) => <a key={item.href + item.title} href={item.href} className="group overflow-hidden rounded-2xl border border-[#263548] bg-[#111a27] transition hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-xl hover:shadow-blue-950/30">
              <div className="relative h-28 overflow-hidden bg-[#101722] sm:h-32">
                <img src={item.image} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080d15]/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-[.18em] text-blue-200">{String(index + 1).padStart(2, '0')} · TINTOLOGY</span>
              </div>
              <div className="p-3"><h3 className="text-sm font-extrabold leading-snug text-white">{item.title}</h3><p className="mt-2 min-h-10 text-xs leading-relaxed text-slate-400">{item.description}</p><span className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-blue-300 sm:text-sm">{tr('Повеќе информации', 'Më shumë informacion', 'More information')} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/></span></div>
            </a>)}
          </div>
        </div>
      </section>

      <CarStudio content={siteContent} onBook={handleStudioBooking} />

      <ProductCatalog />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. BEFORE / AFTER COMPARISON SLIDER & GALLERY                */}
      {/* ──────────────────────────────────────────────────────────── */}




      {/* ──────────────────────────────────────────────────────────── */}



      {/* TINTOLOGY SERVICE SHOWCASES — MATCH ARCHITECTURAL REFERENCE */}
      {/* The architectural-films section above is intentionally untouched. */}
      {/* ──────────────────────────────────────────────────────────── */}
      {homepageShowcaseItems.slice(0, 3).map((item, index) => (
        <section key={item.id} id={item.id} className={`border-t border-[#1c1c28] ${index % 2 === 0 ? 'bg-[#080c13]' : 'bg-[#090d14]'} py-16`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className={`grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center ${index % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-400">{item.eyebrow}</div>
                <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{item.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">{item.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {item.points.map((point, pointIndex) => <div key={pointIndex} className="flex min-h-20 items-center gap-3 rounded-xl border border-[#263548] bg-[#111a27] p-4 text-sm font-semibold text-slate-200"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-800/50 bg-blue-950/60 text-xs font-extrabold text-blue-300">0{pointIndex + 1}</span>{point}</div>)}
                </div>
                <a href={item.href} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-[#07111d] transition hover:bg-blue-400">{tr('Истражи ги решенијата', 'Eksploro zgjidhjet', 'Explore solutions')} <ChevronRight className="h-4 w-4"/></a>
              </div>
              <a href={item.href} aria-label={item.title} className="group relative block min-h-[300px] overflow-hidden rounded-2xl border border-[#263548] bg-[#111a27] shadow-2xl shadow-blue-950/20 sm:min-h-[390px]">
                <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a12]/90 via-[#050a12]/10 to-transparent" />
                <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 text-sm font-bold text-white"><span>{item.title}</span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/30 text-blue-200 backdrop-blur"><ChevronRight className="h-5 w-5"/></span></span>
                <span className="absolute left-5 top-5 rounded-lg border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-blue-100 backdrop-blur">{item.eyebrow}</span>
              </a>
            </div>
          </div>
        </section>
      ))}

      <section id="home-films-for-buildings" className="border-t border-[#1c1c28] bg-[#080c13] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-400">TINTOLOGY · ЗА ДОМОВИ И ОБЈЕКТИ</div>
              <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{tr('Фолии за домови и објекти', 'Filma për shtëpi dhe objekte', 'Films for homes and buildings')}</h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">{tr('Решенија за контрола на сончевата топлина, приватност, заштита и декоративен изглед на стаклените површини.', 'Zgjidhje për kontrollin e nxehtësisë diellore, privatësi, mbrojtje dhe pamje dekorative të sipërfaqeve prej xhami.', 'Solutions for solar heat control, privacy, protection and decorative glass finishes.')}</p>
              <a href="/folii-za-domovi-i-objekti" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-[#07111d] transition hover:bg-blue-400">{tr('Истражи ги решенијата', 'Eksploro zgjidhjet', 'Explore solutions')} <ChevronRight className="h-4 w-4"/></a>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: tr('Куќи и станбени објекти','Shtëpi dhe objekte banimi','Homes and residential buildings'), image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85', alt: 'Модерна куќа со големи стаклени прозорци', href: '/folii-za-domovi-i-objekti#architectural-solar' },
                { title: tr('Стаклени фасади','Fasada xhami','Glass facades'), image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85', alt: 'Современа зграда со стаклена фасада', href: '/folii-za-domovi-i-objekti#architectural-privacy' },
                { title: tr('Кровни прозорци','Dritare çatie','Roof windows'), image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', alt: 'Светол поткровен простор со кровни прозорци', href: '/folii-za-domovi-i-objekti#architectural-safety' },
                { title: tr('Стаклени покриви','Çati xhami','Glass roofs'), image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85', alt: 'Архитектура со стаклен покрив и природна светлина', href: '/folii-za-domovi-i-objekti#architectural-decorative' },
              ].map((item) => <a key={item.title} href={item.href} className="group relative min-h-36 overflow-hidden rounded-2xl border border-[#263548] bg-[#111a27] sm:min-h-44">
                <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a12]/95 via-[#050a12]/25 to-transparent" />
                <span className="absolute bottom-0 left-0 right-0 p-3 text-sm font-bold text-white sm:p-4">{item.title}<ChevronRight className="ml-1 inline h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-1"/></span>
              </a>)}
            </div>
          </div>
        </div>
      </section>

      <section id="home-shower-film" className="border-t border-[#1c1c28] bg-[#090d14] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
          <div><div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-400">TINTOLOGY · BATHROOM GLASS</div>
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{tr('Фолија за туш кабини – заштита од бигор', 'Film për kabina dushi – mbrojtje kundër gëlqeres', 'Shower enclosure film – anti-limescale protection')}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">{tr('Специјална фолија за стакло на туш кабини, наменета да го олесни чистењето и да го намали задржувањето на капки и наслаги. Ефектот зависи од конкретниот производ и правилното одржување.', 'Film i posaçëm për xhamin e kabinave të dushit, i projektuar për të lehtësuar pastrimin dhe për të zvogëluar mbetjen e pikave dhe depozitave. Efekti varet nga produkti dhe mirëmbajtja.', 'Specialist film for shower glass, designed to make cleaning easier and reduce water spotting and deposits. Results depend on the specific product and correct care.')}</p>
            <a href="/folija-za-tus-kabini" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-[#07111d] transition hover:bg-blue-400">{tr('Повеќе информации', 'Më shumë informacion', 'More information')} <ChevronRight className="h-4 w-4"/></a>
          </div>
          <a href="/folija-za-tus-kabini" className="group relative block min-h-[280px] overflow-hidden rounded-2xl border border-[#263548] bg-[#111a27] sm:min-h-[360px]"><img src={siteContent.showerFilmImage || DEFAULT_SITE_CONTENT.showerFilmImage} alt="Стаклена туш кабина со заштитна фолија" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-[#050a12]/80 via-transparent to-transparent"/><span className="absolute bottom-5 left-5 rounded-lg border border-white/20 bg-black/35 px-3 py-2 text-sm font-bold text-white">Anti Limescale · Shower Glass</span></a>
        </div>
      </section>

      {homepageShowcaseItems.slice(3).reverse().map((item, index) => (
        <section key={item.id} id={item.id} className={`border-t border-[#1c1c28] ${index % 2 === 0 ? 'bg-[#080c13]' : 'bg-[#090d14]'} py-16`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className={`grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center ${index % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-400">{item.eyebrow}</div>
                <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">{item.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">{item.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {item.points.map((point, pointIndex) => <div key={pointIndex} className="flex min-h-20 items-center gap-3 rounded-xl border border-[#263548] bg-[#111a27] p-4 text-sm font-semibold text-slate-200"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-800/50 bg-blue-950/60 text-xs font-extrabold text-blue-300">0{pointIndex + 1}</span>{point}</div>)}
                </div>
                <a href={item.href} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-[#07111d] transition hover:bg-blue-400">{tr('Истражи ги решенијата', 'Eksploro zgjidhjet', 'Explore solutions')} <ChevronRight className="h-4 w-4"/></a>
              </div>
              <a href={item.href} aria-label={item.title} className="group relative block min-h-[300px] overflow-hidden rounded-2xl border border-[#263548] bg-[#111a27] shadow-2xl shadow-blue-950/20 sm:min-h-[390px]">
                <img src={item.image} alt={item.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050a12]/90 via-[#050a12]/10 to-transparent" />
                <span className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 text-sm font-bold text-white"><span>{item.title}</span><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/30 text-blue-200 backdrop-blur"><ChevronRight className="h-5 w-5"/></span></span>
                <span className="absolute left-5 top-5 rounded-lg border border-white/20 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-blue-100 backdrop-blur">{item.eyebrow}</span>
              </a>
            </div>
          </div>
        </section>
      ))}

      {/* 9. CONTACT, LOCATION & INQUIRY FORM                          */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 bg-[#0c0c12] border-t border-[#1c1c28]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Брзо барање за термин и процена</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Посетете нè во Кичево или испратете прашање
            </h2>
          </div>

          <div className="flex justify-center">
            {/* Contact details retained as requested */}
            <div className="w-full max-w-2xl space-y-6">
              <div className="p-6 rounded-2xl bg-[#12121c] border border-[#252538]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400 text-black">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Телефон за контакт:</div>
                    <a
                      href={`tel:${phoneDigits}`}
                      className="text-xl font-display font-bold text-white hover:text-blue-400 transition-colors"
                    >
                      {siteContent.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`tel:${phoneDigits}`}
                    className="flex-1 text-center py-2.5 px-3 rounded-lg text-xs font-bold bg-[#1a1a26] text-white hover:bg-slate-800 border border-[#2b2b3d] transition-colors"
                  >
                    Повикај веднаш
                  </a>
                  <a
                    href={`https://wa.me/${whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href="https://share.google/EltPox09uP1jm3fEp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2b2b3d] bg-[#1a1a26] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#242436] hover:text-blue-300"
                  >
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                  <a
                    href="https://share.google/jnaOpcULrSu5pJLOj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2b2b3d] bg-[#1a1a26] px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#242436] hover:text-blue-300"
                  >
                    <Facebook className="h-4 w-4" /> Facebook
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#12121c] border border-[#252538]">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950/80 border border-blue-800/40 text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Точна Локација:</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {siteContent.location}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {siteContent.location} (за насоки и точна локација контактирајте нè)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950/80 border border-blue-800/40 text-blue-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Работно време:</div>
                    <div className="text-sm font-semibold text-white mt-0.5">
                      {siteContent.hours}
                    </div>
                    <div className="text-xs text-slate-400">Отворени сме и за викенд.</div>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Osoj,Kicevo,North+Macedonia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-200 bg-[#181824] hover:bg-[#202030] border border-[#2d2d42] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                  <span>Отвори локација на Google Maps</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 10. FOOTER                                                   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#181822] bg-[#07070a] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#181822]">
            <div className="flex items-center gap-3">
              <img src={tintologyLogo} alt="Tintology лого – був" className="h-11 w-9 object-contain" />
              <span className="font-display text-xl font-bold text-white">
                Tintology<span className="text-blue-400">.</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <a href="#services" className="hover:text-blue-400 transition-colors">
                Услуги
              </a>
              <button type="button" onClick={() => setIsPriceListOpen(true)} className="hover:text-blue-400 transition-colors">
                Ценовник
              </button>
              <a href="#simulator" className="hover:text-blue-400 transition-colors">
                Симулатор
              </a>
              <a href="#product-catalog" className="hover:text-blue-400 transition-colors">
                Каталог
              </a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">
                Локација Кичево
              </a>
            </div>

            <div className="text-xs text-slate-400">
              Тел:{' '}
              <a href={`tel:${phoneDigits}`} className="text-white hover:text-blue-400 font-semibold">
                {siteContent.phone}
              </a>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Tintology Кичево. Сите права задржани.</p>
            <p>Професионално затемнување стакла и сервисирање на автостакла во Кичево.</p>
          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 11. FLOATING AI ASSISTANT TRIGGER & CHAT DRAWER              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-400 to-slate-300 text-black font-bold text-xs uppercase tracking-wider shadow-2xl shadow-blue-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          >
            <Bot className="h-5 w-5 text-black animate-pulse" />
            <span className="hidden sm:inline">Прашај го Tintology AI</span>
          </button>
        )}
      </div>

      {/* Multi-turn Chat Modal / Panel */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col rounded-2xl bg-[#0f0f17] border border-[#28283c] shadow-2xl shadow-black/80 overflow-hidden animate-fadeIn">
          {/* Chat Header */}
          <div className="p-4 bg-[#141420] border-b border-[#242436] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400 text-black">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Tintology AI Советник</span>
                </div>
                <div className="text-[11px] text-slate-400">Стручни совети за автостакла во Кичево</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setChatMessages([
                    {
                      role: 'model',
                      text: 'Разговорот е ресетиран. Како можам да ви помогнам денес?',
                    },
                  ])
                }
                title="Ресетирај разговор"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-[#11111a] border-b border-[#1f1f2e] overflow-x-auto flex gap-1.5 text-[11px] whitespace-nowrap no-scrollbar">
            <button
              onClick={() => handleSendChat('Како функционира А-тестот и дали добивам сертификат?')}
              className="px-2.5 py-1 rounded-md bg-[#191926] hover:bg-[#252538] text-slate-300 border border-[#2b2b3d] cursor-pointer"
            >
              Како се вади А-тест?
            </button>
            <button
              onClick={() => handleSendChat('Кој процент на затемнување ми го препорачувате за задни стакла?')}
              className="px-2.5 py-1 rounded-md bg-[#191926] hover:bg-[#252538] text-slate-300 border border-[#2b2b3d] cursor-pointer"
            >
              Кој процент е најдобар?
            </button>
            <button
              onClick={() => handleSendChat('Колку време по монтажата не смеам да ги отворам прозорите?')}
              className="px-2.5 py-1 rounded-md bg-[#191926] hover:bg-[#252538] text-slate-300 border border-[#2b2b3d] cursor-pointer"
            >
              Кога се спуштаат прозори?
            </button>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-400 text-black font-medium rounded-tr-xs shadow-sm'
                      : 'bg-[#181826] text-slate-200 border border-[#27273a] rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-[#181826] border border-[#27273a] flex items-center gap-1.5 text-xs text-blue-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1">Размислувам...</span>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <div className="p-3 bg-[#12121c] border-t border-[#232334]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Прашајте нешто за фолии или термини..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#09090e] border border-[#26263a] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400 text-black hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 12. BOOKING MODAL                                            */}
      {/* ──────────────────────────────────────────────────────────── */}
      {isPriceListOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Tintology ценовник"
          onClick={() => setIsPriceListOpen(false)}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-blue-500/30 bg-[#090b11] shadow-2xl shadow-blue-950/40" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
              <div>
                <h2 className="text-base font-bold text-white">Tintology ценовник</h2>
                <p className="text-[11px] text-slate-400">Сите цени се прикажани во македонски денари (МКД).</p>
              </div>
              <button type="button" onClick={() => setIsPriceListOpen(false)} className="rounded-lg border border-slate-700 p-2 text-slate-300 transition-colors hover:border-blue-400 hover:text-white" aria-label="Затвори ценовник">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-2 sm:p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {([...siteContent.tintPriceList].sort((a, b) => a.order - b.order)).map((item) => <article key={item.id} className="rounded-xl border border-[#263548] bg-[#111a27] p-5 shadow-lg shadow-black/20">
                  <div className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">{item.group}</div>
                  <h3 className="mt-2 text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-700/70 pt-3"><span className="text-xs text-slate-400">{item.warranty !== '—' ? item.warranty : 'Услуга'}</span><strong className="whitespace-nowrap text-xl font-black text-blue-300">{item.price.toLocaleString('mk-MK')} ден.</strong></div>
                </article>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#111119] border border-[#2b2b3d] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => { setIsModalOpen(false); setModalSuccess(false); }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {modalSuccess ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-blue-400 mx-auto mb-4 animate-bounce" />
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Барањето е подготвено во WhatsApp
                </h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Ви благодариме за довербата. Нашиот тим во Кичево веќе го обработува вашето барање и ќе ве
                  побара телефонски за финална потврда на саатнината.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                    Резервација на термин
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Закажи сервис во Tintology Кичево
                  </h3>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Име и Презиме:
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Вашето целосно име"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Телефонски број:
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="079 315 600"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Посакуван датум:
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                        <input
                          type="date"
                          required
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-sm text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Марка и модел на автомобил:
                    </label>
                    <div className="relative">
                      <Car className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                        placeholder="пр. Audi A6 2019 или Седан"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Услуга:
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-xs text-white focus:outline-none focus:border-blue-400"
                      >
                        <option value="Затемнување на стакла">Затемнување на стакла</option>
                        <option value="УВ и Топлинска заштита">УВ и Топлинска заштита</option>
                        <option value="Замена на автостакла">Замена на автостакла</option>
                        <option value="PPF заштита на фарови">PPF заштита на фарови</option>
                        <option value="PVC затемнување на стоп-светла">PVC затемнување на стоп-светла</option>
                        <option value="Поправка на предно ветробранско стакло">Поправка на предно ветробранско стакло (до 3 cm)</option>
                        <option value="Kameleon фолија за ветробранско стакло">Kameleon фолија за ветробранско стакло</option>
                        <option value="Вадење на стара фолија">Вадење на стара фолија</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Префериран процент:
                      </label>
                      <select
                        value={formData.tintPreference}
                        onChange={(e) => setFormData({ ...formData, tintPreference: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#262638] text-xs text-white focus:outline-none focus:border-blue-400"
                      >
                        <option value="5% Limo Black">5% Limo Black</option>
                        <option value="20% Dark Sport">20% Dark Sport (Препорачано)</option>
                        <option value="35% Medium Smoke">35% Medium Smoke</option>
                        <option value="50% Light Smoke">50% Light Smoke</option>
                        <option value="70% Nano-Ceramic Clear">70% Nano-Ceramic Clear</option>
                        <option value="Не сум сигурен (совет на лице место)">Совет на лице место</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Забелешка (по избор):
                    </label>
                    <textarea
                      rows={2}
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Дополнителни барања или специфики..."
                      className="w-full px-4 py-2 rounded-xl bg-[#0a0a0f] border border-[#262638] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-xs text-black bg-gradient-to-r from-blue-400 to-blue-300 hover:from-blue-300 hover:to-blue-400 shadow-lg shadow-blue-500/20 active:scale-98 transition-all cursor-pointer mt-2"
                  >
                    Потврди и Закажи Термин
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
