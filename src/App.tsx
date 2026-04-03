import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ChevronRight, 
  Menu, 
  X, 
  ArrowRight, 
  Activity, 
  Globe, 
  Users, 
  FileText,
  Linkedin,
  Youtube,
  Instagram,
  Microscope,
  Loader2,
  MapPin,
  Target,
  Lightbulb,
  Shield,
  Heart,
  Eye
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from "@google/genai";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- Shared Components ---

const PageHero = ({ title, subtitle, prompt, height = "h-[60vh]" }: { title: string, subtitle: string, prompt: string, height?: string }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      const cacheKey = `hero_${title.replace(/\s+/g, '_').toLowerCase()}`;
      const cachedImage = sessionStorage.getItem(cacheKey);

      if (cachedImage) {
        setImage(cachedImage);
        setIsLoading(false);
        return;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `${prompt}. Clean, bright, minimalist white and black aesthetic with vibrant red-orange accents, professional photography, 8k resolution, photorealistic.` }],
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = `data:image/png;base64,${part.inlineData.data}`;
            setImage(base64);
            sessionStorage.setItem(cacheKey, base64);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Image generation failed:", error);
        setImage("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070");
        setIsLoading(false);
      }
    };
    generateImage();
  }, [prompt, title]);

  return (
    <section className={cn("relative w-full overflow-hidden flex items-center justify-center px-8 md:px-24 mb-20", height)}>
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white flex items-center justify-center z-20"
            >
              <Loader2 className="text-champagne animate-spin" size={48} />
            </motion.div>
          ) : (
            <motion.img 
              key="hero-img"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              src={image || ""} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white z-10" />
      </div>

      <div className="relative z-20 text-center max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono uppercase tracking-[0.5em] text-champagne mb-6 block"
        >
          {subtitle}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight text-black"
        >
          {title.split(' ').map((word, i) => (
            word.toLowerCase().includes('vitanica') || word.toLowerCase().includes('inovasyon') || word.toLowerCase().includes('sağlık') ? 
            <span key={i} className="font-serif italic text-gradient-brand"> {word} </span> : 
            <span key={i}> {word} </span>
          ))}
        </motion.h1>
      </div>
    </section>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Kurumsal', href: '/kurumsal' },
    { name: 'VİTANİCA', href: '/vitanica' },
    { name: 'Ar-Ge', href: '/ar-ge' },
    { name: 'Bilim', href: '/#science' },
    { name: 'İletişim', href: '/#contact' },
  ];

  const handleLinkClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.split('#')[1];
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b border-black/5",
        isScrolled ? "bg-white/90 backdrop-blur-xl py-3 shadow-md" : "bg-white/50 backdrop-blur-md py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-extrabold text-2xl tracking-tighter text-gradient-brand">HARP</span>
          <div className="h-4 w-[1px] bg-black/20 mx-2 hidden sm:block" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40 hidden sm:block">Precision Biotech</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('/#') ? (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }
                }}
                className="text-xs font-medium uppercase tracking-widest text-black/60 hover:text-champagne transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.href}
                className="text-xs font-medium uppercase tracking-widest text-black/60 hover:text-champagne transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-gradient-brand text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-champagne/20">
            Yatırımcı Sunumu
          </button>
          <button 
            className="md:hidden text-black"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/5 p-8 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                link.href.startsWith('/#') ? (
                  <a 
                    key={link.name} 
                    href={link.href}
                    onClick={() => handleLinkClick(link.href)}
                    className="text-lg font-medium text-black/80 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium text-black/80 hover:text-champagne transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <button className="w-full bg-gradient-brand text-white py-4 rounded-2xl font-bold uppercase tracking-widest mt-4 shadow-lg shadow-champagne/20">
                Yatırımcı Sunumu İste
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHeroImage = async () => {
      const cacheKey = 'hero_home_image';
      const cachedImage = sessionStorage.getItem(cacheKey);
      
      if (cachedImage) {
        setHeroImage(cachedImage);
        setIsLoading(false);
        return;
      }

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: 'A cinematic, high-end industrial pharmaceutical factory building at dusk with the large glowing text "HARP" on the facade. Clean, bright, minimalist white and black aesthetic with vibrant red-orange accents, architectural lighting, professional photography, 8k resolution.',
              },
            ],
          },
        });

        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64 = `data:image/png;base64,${part.inlineData.data}`;
            setHeroImage(base64);
            sessionStorage.setItem(cacheKey, base64);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Image generation failed:", error);
        setHeroImage("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070");
        setIsLoading(false);
      }
    };

    generateHeroImage();

    const ctx = gsap.context(() => {
      gsap.from(".hero-stagger", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.5
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] w-full overflow-hidden flex items-end pb-24 px-8 md:px-24">
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white flex items-center justify-center z-20"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-champagne animate-spin" size={48} />
                <span className="text-xs font-mono uppercase tracking-widest text-champagne/60">Generating Brand Identity...</span>
              </div>
            </motion.div>
          ) : (
            <motion.img 
              key="hero-img"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src={heroImage || ""} 
              alt="HARP Factory"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-white/20 z-10" />
      </div>

      <div className="relative z-20 max-w-4xl">
        <div className="hero-stagger flex items-center gap-3 mb-6">
          <div className="h-[1px] w-12 bg-champagne" />
          <span className="text-xs font-mono uppercase tracking-[0.4em] text-champagne/80">Vitanica Projesi</span>
        </div>
        
        <h1 className="hero-stagger text-xl md:text-4xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-black">
          Doğa Bilimle <br />
          <span className="font-serif italic text-gradient-brand block mt-2">Buluşuyor.</span>
        </h1>
        
        <p className="hero-stagger text-black/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          Harp olarak, Türkiye'nin biyolojik çeşitliliğini yerli üretim gücüyle birleştirerek VİTANİCA ile sağlıkta yeni bir çağ başlatıyoruz.
        </p>

        <div className="hero-stagger flex flex-wrap gap-4">
          <button className="group relative overflow-hidden bg-gradient-brand text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-champagne/20">
            <span className="relative z-10 flex items-center gap-2">
              Vitanica'yı Keşfedin <ChevronRight size={18} />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          
          <button className="px-8 py-4 rounded-full border border-black/20 font-bold uppercase tracking-widest text-sm hover:bg-black/5 transition-all text-black">
            Yatırımcı Sunumu İste
          </button>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, children, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="group bg-slate/10 border border-black/5 p-8 rounded-[2.5rem] hover:border-champagne/30 transition-all duration-500 flex flex-col h-full"
    >
      <div className="w-12 h-12 bg-champagne/10 rounded-2xl flex items-center justify-center text-champagne mb-8 group-hover:scale-110 transition-transform duration-500">
        <Icon size={24} />
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight text-black">{title}</h3>
      <p className="text-black/50 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
      <div className="mt-auto pt-6 border-t border-black/5">
        {children}
      </div>
    </motion.div>
  );
};

const DiagnosticShuffler = () => {
  const [items, setItems] = useState([
    { id: 1, label: "Yerli Üretim", value: "85%", color: "bg-gradient-brand" },
    { id: 2, label: "Katma Değer", value: "12x", color: "bg-black/10" },
    { id: 3, label: "İstihdam", value: "500+", color: "bg-slate" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItems = [...prev];
        const last = newItems.pop();
        if (last) newItems.unshift(last);
        return newItems;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-32 w-full flex items-center justify-center">
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          layout
          initial={false}
          animate={{
            y: idx * 15,
            scale: 1 - idx * 0.05,
            opacity: 1 - idx * 0.3,
            zIndex: 10 - idx,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "absolute w-full p-4 rounded-2xl flex items-center justify-between border border-black/10",
            item.color
          )}
        >
          <span className={cn("text-xs font-bold uppercase tracking-wider", idx === 0 ? "text-white" : "text-black")}>
            {item.label}
          </span>
          <span className={cn("font-mono text-lg font-bold", idx === 0 ? "text-white" : "text-champagne")}>
            {item.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const TelemetryTypewriter = () => {
  const [text, setText] = useState("");
  const fullText = "VİTANİCA: Kanıta Dayalı Tıp Protokolü Aktif. Klinik Gözlem Verileri İşleniyor... [OK]";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i = (i + 1) % (fullText.length + 10);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate/40 p-4 rounded-xl border border-black/5 font-mono text-[10px] leading-relaxed">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-black/40 uppercase tracking-widest">Live Feed</span>
      </div>
      <span className="text-champagne">{text}</span>
      <span className="w-1 h-3 bg-champagne inline-block ml-1 animate-pulse" />
    </div>
  );
};

const ProtocolScheduler = () => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const [activeDay, setActiveDay] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDay(prev => (prev + 1) % 7);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono text-black/20">{day}</span>
          <motion.div 
            animate={{ 
              backgroundColor: activeDay === i ? "#FF4D00" : "rgba(0,0,0,0.05)",
              scale: activeDay === i ? 1.1 : 1
            }}
            className="w-full aspect-square rounded-lg border border-black/5"
          />
        </div>
      ))}
    </div>
  );
};

const Features = () => {
  return (
    <section id="vitanica" className="py-32 px-8 md:px-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-xs font-mono uppercase tracking-[0.5em] text-champagne mb-4 block">Değer Önerilerimiz</span>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black">
            Geleceği <span className="font-serif italic text-gradient-brand">İnşa Ediyoruz.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Globe}
            title="Yerli Üretim & Katma Değer"
            description="Global ham maddeyi Türkiye'de işleyip katma değer yaratıyoruz. Anadolu'dan fabrikaya sürdürülebilir bir ekosistem."
          >
            <DiagnosticShuffler />
          </FeatureCard>

          <FeatureCard 
            icon={Microscope}
            title="Kanıta Dayalı Tıp"
            description="Bitkisel formülleri hekim kontrolünde, bilimsel protokollerle sunuyoruz. VİTANİCA ile standardize çözümler."
            delay={0.2}
          >
            <TelemetryTypewriter />
          </FeatureCard>

          <FeatureCard 
            icon={Users}
            title="Bilimsel Konsey"
            description="DR. M. Sefa Yellice önderliğinde akademik protokoller ve klinik gözlem çalışmalarıyla güven inşa ediyoruz."
            delay={0.4}
          >
            <ProtocolScheduler />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".philosophy-text", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="corporate" ref={containerRef} className="relative py-40 px-8 md:px-24 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
          alt="Abstract Tech"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="philosophy-text text-champagne font-mono text-xs uppercase tracking-[0.4em] mb-12">Vizyonumuz</p>
        
        <h2 className="philosophy-text text-3xl md:text-5xl font-medium text-black/60 leading-relaxed mb-16">
          Çoğu fitoterapi yaklaşımı sadece <span className="text-black">paketlemeye</span> odaklanır.
        </h2>
        
        <h2 className="philosophy-text text-4xl md:text-7xl font-bold tracking-tighter leading-tight text-black">
          Biz <span className="font-serif italic text-gradient-brand">Ham Madde İşleme</span> ve <br />
          <span className="text-gradient-brand">Bilimsel Protokollere</span> odaklanıyoruz.
        </h2>
      </div>
    </section>
  );
};

const ProtocolStack = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".protocol-card");
      cards.forEach((card: any, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          pin: true,
          pinSpacing: false,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (i < cards.length - 1) {
              gsap.to(card, {
                scale: 1 - progress * 0.1,
                opacity: 1 - progress * 0.5,
                filter: `blur(${progress * 10}px)`,
                duration: 0.1,
                overwrite: 'auto'
              });
            }
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      num: "01",
      title: "Ar-Ge & Formülasyon",
      desc: "Dünyadan tedarik edilen en kaliteli tıbbi ham maddelerin, GMP standartlarında işlenerek yüksek biyoyararlanımlı formüllere dönüştürülmesi.",
      image: "https://images.unsplash.com/photo-1579154273821-ad3c1499b04a?auto=format&fit=crop&q=80&w=2070"
    },
    {
      num: "02",
      title: "Endüstriyel Üretim",
      desc: "Sadece bir paketleme fabrikası değil, bir ham madde işleme merkezi. Standardize ekstraksiyon ve sürekli denetim protokolleri.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070"
    },
    {
      num: "03",
      title: "Hekim Ağı & İhracat",
      desc: "500+ uzman hekim ile klinik gözlem çalışmaları ve global pazarlara yönelik ihracat odaklı büyüme stratejisi.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2070"
    }
  ];

  return (
    <section id="production" ref={containerRef} className="bg-white">
      {steps.map((step, i) => (
        <div key={i} className="protocol-card h-screen w-full flex items-center justify-center px-8 md:px-24 border-t border-black/5 bg-white">
          <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-mono text-gradient-brand text-4xl mb-8 block">{step.num}</span>
              <h3 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-black">{step.title}</h3>
              <p className="text-black/60 text-lg leading-relaxed mb-12">{step.desc}</p>
              <button className="flex items-center gap-3 text-champagne font-bold uppercase tracking-widest text-sm group">
                Detaylı İncele <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden group">
              <img 
                src={step.image} 
                alt={step.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors duration-700" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const ScientificData = () => {
  const stats = [
    { label: "Diyabet", value: "+%185", color: "text-red-500" },
    { label: "Kalp Hastalıkları", value: "+%112", color: "text-red-400" },
    { label: "Kanser", value: "+%148", color: "text-red-500" },
    { label: "Demans & Alzheimer", value: "+%285", color: "text-red-600" },
    { label: "Pıhtı (Tromboz)", value: "+%128", color: "text-red-400" },
  ];

  return (
    <section id="science" className="py-32 px-8 md:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-champagne mb-4 block">Bilimsel Veriler</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-black">
              Sağlık Trendleri <br />
              <span className="font-serif italic text-gradient-brand">Kritik Seviyede.</span>
            </h2>
            <p className="text-black/50 text-lg leading-relaxed mb-12">
              Türkiye Sağlık Trendleri (2000-2024) verileri, kronik hastalıklarla mücadelede modern tıbbın yanında bilimsel fitoterapinin önemini kanıtlıyor.
            </p>
            <div className="flex items-center gap-6 p-6 bg-black/5 rounded-3xl border border-black/10">
              <div className="w-16 h-16 rounded-2xl bg-champagne/10 flex items-center justify-center text-champagne">
                <FileText size={32} />
              </div>
              <div>
                <h4 className="font-bold text-xl text-black">Bilimsel Raporu İndir</h4>
                <p className="text-sm text-black/40">2024 Fitoterapi ve Sağlık Trendleri Analizi</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-6 bg-white border border-black/5 rounded-2xl hover:border-champagne/20 transition-all shadow-sm"
              >
                <span className="font-medium text-black/80">{stat.label}</span>
                <span className={cn("font-mono font-bold text-xl", stat.color)}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const contactChannels = [
    { label: "Pazarlama", email: "marketing@harp.tr" },
    { label: "Sipariş", email: "orders@harp.tr" },
    { label: "Kariyer", email: "career@harp.tr" },
    { label: "Yatırımcı", email: "investor@harp.tr" }
  ];

  return (
    <section id="contact" className="py-32 px-8 md:px-24 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="bg-slate/10 rounded-[4rem] border border-black/5 p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-champagne/10 blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 text-black">
                Bize <span className="font-serif italic text-gradient-brand text-5xl md:text-7xl">Ulaşın.</span>
              </h2>
              <p className="text-black/60 text-lg mb-12">
                Yatırım fırsatları, kariyer başvuruları veya bilimsel iş birlikleri için ekibimizle iletişime geçin.
              </p>
              
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  {contactChannels.map((channel) => (
                    <div key={channel.label}>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-black/20 mb-2">{channel.label}</p>
                      <p className="text-sm font-medium text-champagne hover:text-black transition-colors cursor-pointer">
                        {channel.email}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-black/20 mb-2">Lokasyon</p>
                  <p className="text-lg font-medium leading-relaxed max-w-xs text-black">
                    Teknokent Bahçelievler, 319. Sk. Ankara Üniversitesi Teknokent No: 35, 06830 Gölbaşı/Ankara, Türkiye
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Ad Soyad</label>
                  <input type="text" className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:border-champagne outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">E-Posta</label>
                  <input type="email" className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:border-champagne outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Konu</label>
                <select className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:border-champagne outline-none transition-all appearance-none">
                  <option>Yatırımcı İlişkileri</option>
                  <option>Kariyer</option>
                  <option>Bilimsel İş Birliği</option>
                  <option>Genel Sorular</option>
                  <option>Sipariş & Pazarlama</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Mesaj</label>
                <textarea rows={4} className="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:border-champagne outline-none transition-all resize-none" />
              </div>
              <button className="w-full bg-gradient-brand text-white py-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-champagne/20">
                Mesajı Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Integration */}
        <div className="w-full h-[450px] rounded-[3rem] overflow-hidden border border-black/5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3066.388832043685!2d32.8123456!3d39.8123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3456789abcdef%3A0x1234567890abcdef!2sAnkara%20%C3%9Cniversitesi%20Teknokent!5e0!3m2!1str!2str!4v1712150000000!5m2!1str!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-32 pb-12 px-8 md:px-24 rounded-t-[4rem] border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <span className="font-extrabold text-4xl tracking-tighter text-gradient-brand mb-6 block">HARP</span>
            <p className="text-black/40 text-lg max-w-sm leading-relaxed">
              Türkiye'nin tıbbi bitki işleme kapasitesini global standartlara yükselterek, bölgenin en büyük fitoterapi üssü oluyoruz.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-black/40">Navigasyon</h4>
            <ul className="space-y-4 text-sm text-black/60">
              <li><Link to="/" className="hover:text-champagne transition-colors">Ana Sayfa</Link></li>
              <li><Link to="/kurumsal" className="hover:text-champagne transition-colors">Kurumsal</Link></li>
              <li><Link to="/vitanica" className="hover:text-champagne transition-colors">Vitanica Projesi</Link></li>
              <li><Link to="/ar-ge" className="hover:text-champagne transition-colors">Ar-Ge</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-black/40">Sosyal Medya</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-all"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-all"><Youtube size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-gradient-brand hover:text-white transition-all"><Instagram size={18} /></a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/20">
            © 2026 HARP LABS. Tüm Hakları Saklıdır.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">System Operational</span>
          </div>

          <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest text-black/20">
            <a href="#" className="hover:text-black transition-colors">KVKK</a>
            <a href="#" className="hover:text-black transition-colors">Yasal Uyarı</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ArGePage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const standards = [
    { title: "Standardize Ekstraksiyon", desc: "Bitkisel özlerin her partide aynı etken madde oranına sahip olması sağlanır." },
    { title: "GMP Standartları", desc: "İyi Üretim Uygulamaları çerçevesinde steril ve kontrollü ortamda üretim." },
    { title: "Sürekli Denetim", desc: "Ham maddeden son ürüne kadar her aşamada sıkı kalite kontrol protokolleri." }
  ];

  const certificates = [
    "ISO 9001", "ISO 22000", "Helal", "FDA Onayı", "CE İşareti"
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <PageHero 
        title="Ar-Ge & İnovasyon."
        subtitle="Teknoloji & Üretim"
        prompt="Close-up of a glowing red-orange liquid in a glass beaker inside a bright, sterile white high-tech laboratory, scientists in the background, advanced extraction machinery"
      />
      
      <div className="max-w-6xl mx-auto px-8 md:px-24 pb-24">
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-slate/10 rounded-[3rem] border border-black/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Microscope size={120} />
            </div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-champagne mb-6">Teknik Yaklaşım</h2>
            <p className="text-3xl md:text-4xl font-bold leading-tight max-w-3xl text-black">
              "Sadece bir paketleme fabrikası değil, bir <span className="text-gradient-brand">ham madde işleme merkezi.</span>"
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {standards.map((std, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-slate/5 rounded-3xl border border-black/5 hover:border-champagne/30 transition-all"
            >
              <div className="w-12 h-12 bg-champagne/10 rounded-2xl flex items-center justify-center text-champagne mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-black">{std.title}</h3>
              <p className="text-black/40 text-sm leading-relaxed">{std.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate/10 p-12 rounded-[3rem] border border-black/5">
          <h2 className="text-3xl font-bold mb-12 text-center text-black">Hedef Sertifikalar</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {certificates.map((cert, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-8 py-4 bg-white rounded-full border border-black/10 text-champagne font-mono text-sm tracking-widest hover:bg-gradient-brand hover:text-white transition-all cursor-default shadow-sm"
              >
                {cert}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const VitanicaPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stages = [
    { title: "Ar-Ge & Formülasyon", desc: "Bilimsel veriler ışığında en etkili dozaj ve kombinasyonların belirlenmesi." },
    { title: "Endüstriyel Üretim", desc: "GMP standartlarında, el değmeden son teknoloji tesislerde üretim." },
    { title: "Hekim Ağı & Medya", desc: "Uzman hekim görüşleri ve doğru bilgilendirme kanalları ile toplumsal farkındalık." },
    { title: "İhracat Odaklı Büyüme", desc: "Yerli üretimin gücünü global pazarlara taşıyan stratejik genişleme." }
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <PageHero 
        title="VİTANİCA Projesi."
        subtitle="Proje Detayları"
        prompt="A glowing red-orange botanical plant growing inside a futuristic white glass incubator, scientific research, clean bright environment, premium health supplement concept"
      />

      <div className="max-w-6xl mx-auto px-8 md:px-24 pb-24">
        <div className="grid md:grid-cols-2 gap-16 mb-32 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 bg-slate/10 rounded-[2.5rem] border border-black/5">
              <h2 className="text-2xl font-bold mb-4 text-champagne">Tanım</h2>
              <p className="text-black/70 text-lg leading-relaxed">
                Dünyadan tedarik edilen en kaliteli tıbbi ham maddelerin, GMP standartlarında işlenerek yüksek biyoyararlanımlı formüllere dönüştürülmesi sürecidir.
              </p>
            </div>
            
            <div className="p-8 bg-champagne/5 rounded-[2.5rem] border border-champagne/20">
              <h2 className="text-2xl font-bold mb-4 text-champagne">Sorun & Çözüm</h2>
              <div className="space-y-4">
                <p className="text-black/40 text-sm italic">"Modern çağın kronik hastalıklarına karşı..."</p>
                <p className="text-black/80 text-lg leading-relaxed font-medium">
                  Yan etkisiz, standardize edilmiş ve bilimsel protokollerle desteklenmiş bitkisel çözümler sunuyoruz.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-black/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=2070" 
              alt="Vitanica Research"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-16 text-center text-black">Uygulama Aşamaları</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-black/5 rounded-3xl border border-black/5 hover:bg-slate/10 transition-all group"
              >
                <div className="text-champagne font-mono text-sm mb-6 opacity-40 group-hover:opacity-100 transition-opacity">0{i+1}</div>
                <h3 className="text-xl font-bold mb-4 text-black">{stage.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Corporate = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    { icon: Lightbulb, title: "Yenilikçilik", desc: "Sürekli Ar-Ge ile fitoterapiyi modernize ediyoruz." },
    { icon: Eye, title: "Şeffaflık", desc: "Tüm süreçlerimizde bilimsel ve etik şeffaflığı savunuyoruz." },
    { icon: Shield, title: "Yerlilik", desc: "Türkiye'nin biyolojik zenginliğini yerli üretimle taçlandırıyoruz." },
    { icon: Heart, title: "İnsan Sağlığı", desc: "En büyük önceliğimiz yaşam kalitesini bilimle artırmak." }
  ];

  const offices = [
    { city: "Ankara", country: "Türkiye", type: "Merkez Ofis" },
    { city: "Erzurum", country: "Türkiye", type: "Üretim & Ar-Ge" },
    { city: "Florida", country: "USA", type: "Global Operasyon" }
  ];

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <PageHero 
        title="Geleceğin Sağlık Üssü."
        subtitle="Kurumsal"
        prompt="A bright, modern white architectural building with a striking red-orange entrance, surrounded by lush green nature, sunny day, corporate headquarters"
      />

      <div className="max-w-6xl mx-auto px-8 md:px-24 pb-24">
        <div className="grid md:grid-cols-2 gap-16 mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate/10 p-12 rounded-[3rem] border border-black/5"
          >
            <div className="w-12 h-12 bg-champagne/10 rounded-2xl flex items-center justify-center text-champagne mb-8">
              <Eye size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-black">Vizyonumuz</h2>
            <p className="text-black/60 text-lg leading-relaxed italic">
              "Türkiye'nin tıbbi bitki işleme kapasitesini global standartlara yükselterek, bölgenin en büyük fitoterapi üssü olmak."
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate/10 p-12 rounded-[3rem] border border-black/5"
          >
            <div className="w-12 h-12 bg-champagne/10 rounded-2xl flex items-center justify-center text-champagne mb-8">
              <Target size={24} />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-black">Misyonumuz</h2>
            <p className="text-black/60 text-lg leading-relaxed italic">
              "Kronik ve tedavisi güç hastalıklarla mücadelede, modern tıp literatürüne giren bilimsel bitkisel takviyelerle yaşam kalitesini artırmak."
            </p>
          </motion.div>
        </div>

        <div className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center text-black">Değerlerimiz</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-black/5 rounded-3xl border border-black/5 hover:border-champagne/30 transition-all text-center"
              >
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center text-champagne mx-auto mb-6">
                  <val.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-black">{val.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-16 text-center text-black">Global Ofislerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white rounded-[2.5rem] border border-black/5 shadow-sm flex flex-col items-center text-center group hover:bg-slate/20 transition-all"
              >
                <MapPin className="text-champagne mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h3 className="text-2xl font-bold mb-2 text-black">{office.city}</h3>
                <p className="text-champagne font-mono text-xs uppercase tracking-widest mb-4">{office.country}</p>
                <div className="h-[1px] w-12 bg-black/10 mb-4" />
                <p className="text-black/40 text-sm">{office.type}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => (
  <>
    <Hero />
    <Features />
    <Philosophy />
    <ProtocolStack />
    <ScientificData />
    <Contact />
  </>
);

export default function App() {
  return (
    <Router>
      <main className="relative bg-white overflow-x-hidden pt-20 md:pt-24">
        <div className="noise-overlay" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kurumsal" element={<Corporate />} />
          <Route path="/vitanica" element={<VitanicaPage />} />
          <Route path="/ar-ge" element={<ArGePage />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}
