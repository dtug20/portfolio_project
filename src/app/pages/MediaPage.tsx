import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Play, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";



type MainTab = "Projects" | "Pictures" | "Blog";

export function MediaPage() {
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const gridInView = useInView(gridRef, { once: true, margin: "-40px" });

  const [activeTab, setActiveTab] = useState<MainTab>("Projects");
  const [lightbox, setLightbox] = useState<{ images: string[], index: number } | null>(null);

  const dbMedia = useQuery(api.media.listPublished);
  const mediaItems = dbMedia ? dbMedia : [];

  const dbGallery = useQuery(api.gallery.list);
  const galleryItems = dbGallery || [];

  const dbBlogs = useQuery(api.blog.listPublished);
  const blogItems = dbBlogs ? dbBlogs : [];

  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mediaItems.map((item: any, i: number) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, y: 20 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
          className="group relative overflow-hidden cursor-pointer bg-[#171513]"
        >
          <div className="relative overflow-hidden aspect-[4/5]">
            <ImageWithFallback
              src={item.coverUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ filter: "brightness(0.6) grayscale(15%)" }}
            />
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                background: "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.1) 60%)",
              }}
            />

            {/* Play button */}
            {item.hasPlay && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Play size={18} color="#FFFDF8" fill="#FFFDF8" style={{ marginLeft: 3 }} />
                </div>
              </div>
            )}

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#CDC1B3",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {item.category}
              </span>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  color: "#FFFDF8",
                  lineHeight: 1.2,
                  marginBottom: 4,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  color: "#B0A496",
                  letterSpacing: "0.05em",
                }}
              >
                {item.venue || item.tag} {item.year ? `· ${item.year}` : ''}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderShows = () => {
    const CATEGORIES = ["Personal", "Open Project", "S.E Project", "Bluemato"];
    let hasAnyImages = false;

    return (
      <div className="flex flex-col gap-24">
        {CATEGORIES.map((category, i) => {
          const categoryImages = galleryItems
            .filter((item: any) => item.type === category)
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any) => item.url)
            .filter(Boolean);

          if (categoryImages.length === 0) return null;
          hasAnyImages = true;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="flex flex-col gap-8"
            >
              {/* Category Header */}
              <div className="text-center md:text-left border-b border-[#2A2621] pb-6">
                <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-[#FFFDF8] leading-tight mb-2">
                  {category}
                </h3>
              </div>

              {/* Show Gallery Scroll */}
              <ShowGalleryRow title={category} allImages={categoryImages} setLightbox={setLightbox} />
            </motion.div>
          );
        })}
        
        {!hasAnyImages && galleryItems !== undefined && (
          <div className="py-16 text-center text-[#8A7F72] font-['Inter'] text-sm tracking-widest uppercase">
            No gallery images yet.
          </div>
        )}
      </div>
    );
  };

  const navigate = useNavigate();

  const renderBlog = () => (
    <div className="max-w-4xl mx-auto flex flex-col gap-12">
      {blogItems.map((post: any, i: number) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
          onClick={() => navigate(`/blog/${post._id}`)}
          className="group flex flex-col md:flex-row gap-8 md:gap-12 cursor-pointer border-b border-white/10 pb-12 last:border-0"
        >
          {post.coverUrl && (
            <div className="w-full md:w-2/5 aspect-[4/3] overflow-hidden">
              <ImageWithFallback
                src={post.coverUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.8) contrast(1.1)" }}
              />
            </div>
          )}
          <div className="w-full md:w-3/5 flex flex-col justify-center">
            <span className="font-['Inter'] text-[0.65rem] tracking-[0.2em] uppercase text-[#8A7F72] mb-4">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Draft'}
            </span>
            <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-[#FFFDF8] mb-4 group-hover:text-[#DED4C8] transition-colors">
              {post.title}
            </h3>
            <p className="font-['Inter'] text-sm text-[#B0A496] leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <span className="font-['Inter'] text-[0.7rem] tracking-widest uppercase text-[#CDC1B3] flex items-center gap-2">
              Read More <ArrowLeft size={12} className="rotate-180" />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#11100F", minHeight: "100vh" }}>
      {/* ── HERO HEADER ── */}
      <section
        ref={headerRef}
        className="relative w-full h-[65vh] min-h-[500px] flex flex-col justify-end overflow-hidden mb-0"
      >
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="/images/on_stage.jpeg"
            alt="Selected Works"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(17,16,15,0.95) 0%, rgba(17,16,15,0.6) 50%, rgba(17,16,15,0.15) 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(17,16,15,1) 0%, rgba(17,16,15,0.5) 30%, rgba(17,16,15,0) 60%)" }}
          />
        </div>

        {/* Bottom: Title */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-16 pb-12 md:pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.1 }} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 300, lineHeight: 0.93, color: "#FFFDF8", letterSpacing: "-0.025em" }}>
                Explore <em style={{ fontStyle: "italic", color: "#CDC1B3" }}>Media</em>
              </motion.h1>
            </div>
          </div>
        </div>
      </section>

      {/* ── MEDIA CONTENT ── */}
      <section ref={gridRef} style={{ padding: "0 0 120px" }}>
        <div className="max-w-[1400px] mx-auto px-8 md:px-16">

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={gridInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45 }} className="flex justify-center md:justify-start items-center gap-0 mb-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {(["Projects", "Pictures", "Blog"] as MainTab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", letterSpacing: "0.16em", textTransform: "uppercase", color: activeTab === tab ? "#FFFDF8" : "#8A7F72", background: "none", border: "none", borderBottom: activeTab === tab ? "2px solid #FFFDF8" : "2px solid transparent", padding: "18px 32px 17px", cursor: "pointer", marginBottom: -1, transition: "color 0.2s", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#DED4C8"; }}
                onMouseLeave={(e) => { if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = "#8A7F72"; }}>
                {tab}
              </button>
            ))}
          </motion.div>

          {/* Render Active Tab */}
          <div className="min-h-[500px]">
            {activeTab === "Projects" && renderProjects()}
            {activeTab === "Pictures" && renderShows()}
            {activeTab === "Blog" && renderBlog()}
          </div>

        </div>
      </section>

      {/* Lightbox Popup */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button 
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2 cursor-pointer"
          >
            <X size={32} strokeWidth={1} />
          </button>
          
          {lightbox.images.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
              }}
              className="absolute left-2 md:left-8 text-white/50 hover:text-white transition-colors z-50 p-4 cursor-pointer"
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>
          )}

          <div className="relative w-full max-w-7xl h-[75vh] flex justify-center items-center px-16 md:px-24 pointer-events-none pb-20">
            <img 
              src={lightbox.images[lightbox.index]} 
              alt="Gallery Preview" 
              className="max-w-full max-h-[75vh] object-contain shadow-2xl pointer-events-auto rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {lightbox.images.length > 1 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
              }}
              className="absolute right-2 md:right-8 text-white/50 hover:text-white transition-colors z-50 p-4 cursor-pointer"
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>
          )}
          
          {/* Thumbnails */}
          {lightbox.images.length > 1 && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4 overflow-x-auto hide-scrollbar pointer-events-auto pb-4" onClick={(e) => e.stopPropagation()}>
              {lightbox.images.map((imgUrl, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setLightbox({ ...lightbox, index: i }); }}
                  className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 cursor-pointer ${i === lightbox.index ? 'ring-2 ring-white scale-110 opacity-100 shadow-lg' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                >
                  <img src={imgUrl} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ShowGalleryRow({ title, allImages, setLightbox }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const exactScrollLeft = useRef(0);
  const isLoopable = allImages.length > 4;
  
  // Nhân đôi mảng ảnh để tạo vòng lặp vô tận chỉ khi có nhiều ảnh
  const loopedImages = isLoopable ? [...allImages, ...allImages] : allImages;

  useEffect(() => {
    if (!isLoopable) return;
    
    let animationFrameId: number;
    
    if (scrollRef.current) {
      exactScrollLeft.current = scrollRef.current.scrollLeft;
    }
    
    const scrollLoop = () => {
      if (scrollRef.current) {
        // Tổng chiều rộng có thể cuộn là 1 nửa (do đã nhân đôi ảnh)
        const halfScrollWidth = scrollRef.current.scrollWidth / 2;
        
        if (halfScrollWidth > 0) {
          if (!isHovered) {
            exactScrollLeft.current += 0.5; // Tốc độ mượt mà, chậm rãi
            
            // Nếu đã cuộn quá nửa (tức là đã duyệt hết mảng ảnh đầu tiên), reset về 0
            if (exactScrollLeft.current >= halfScrollWidth) {
              exactScrollLeft.current -= halfScrollWidth;
            }
            
            scrollRef.current.scrollLeft = exactScrollLeft.current;
          } else {
            // Cập nhật lại vị trí nếu người dùng cuộn thủ công
            exactScrollLeft.current = scrollRef.current.scrollLeft;
            
            // Xử lý khi người dùng cuộn thủ công quá tay
            if (exactScrollLeft.current >= halfScrollWidth) {
              scrollRef.current.scrollLeft = exactScrollLeft.current = exactScrollLeft.current - halfScrollWidth;
            } else if (exactScrollLeft.current <= 0) {
              scrollRef.current.scrollLeft = exactScrollLeft.current = exactScrollLeft.current + halfScrollWidth;
            }
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(scrollLoop);
    };
    
    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isLoopable]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative group/gallery py-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
      `}</style>

      {/* Left gradient & button (Only show button if loopable or has scroll) */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none flex items-center justify-start">
        {isLoopable && (
          <button onClick={(e) => { e.stopPropagation(); scroll('left'); }} className="pointer-events-auto opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 p-2 ml-2 bg-black/60 text-white rounded-full hover:bg-black shadow-xl">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Cuộn thủ công bằng thanh cuộn ở dưới cùng */}
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 custom-scrollbar pb-3 px-2 md:px-0">
        {loopedImages.map((imgUrl: string, idx: number) => {
          // Vì mảng đã nhân đôi, index thật của ảnh nằm trong khoảng 0 đến allImages.length - 1
          const realIdx = idx % allImages.length;
          
          return (
            <div 
              key={idx} 
              onClick={() => setLightbox({ images: allImages, index: realIdx })}
              className="relative shrink-0 w-[75vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] max-w-[350px] aspect-[4/5] sm:aspect-square overflow-hidden bg-[#171513] group cursor-pointer rounded-sm"
            >
              <ImageWithFallback
                src={imgUrl}
                alt={`${title} - Image ${realIdx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
            </div>
          );
        })}
      </div>

      {/* Right gradient & button */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none flex items-center justify-end">
        {isLoopable && (
          <button onClick={(e) => { e.stopPropagation(); scroll('right'); }} className="pointer-events-auto opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300 p-2 mr-2 bg-black/60 text-white rounded-full hover:bg-black shadow-xl">
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
