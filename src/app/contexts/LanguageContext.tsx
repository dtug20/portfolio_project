import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "vi";

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.shows": "Shows",
    "nav.media": "Media",
    "nav.services": "Services",
    "nav.contact": "Contact",

    // Hero
    "hero.discover": "Discover More",
    "hero.book": "Book a Session →",
    "hero.scroll": "Scroll",

    // About
    "about.title": "Biography",
    "about.readFull": "Read Full Bio",

    // Shows
    "shows.title": "Upcoming Shows",
    "shows.allDates": "View All Dates",
    "shows.allShows": "All Shows",
    "shows.soldOut": "Sold Out",
    "shows.tickets": "Tickets",

    // Media
    "media.label": "Media",
    "media.title": "Portfolio & Media",
    "media.featured": "Featured Highlights",
    "media.explore": "View All Media",
    "media.tab.works": "Works",
    "media.tab.pictures": "Pictures",
    "media.tab.blog": "Blog",
    "media.empty.works": "No featured works yet.",
    "media.empty.pictures": "No featured pictures yet.",
    "media.empty.blog": "No featured blog posts yet.",
    "media.featuredPictures": "Featured Pictures",

    // Services
    "services.label": "Services",
    "services.title": "Services & Collaborations",
    "services.offer": "What I Offer",
    "services.desc": "A carefully curated range of musical services for discerning clients, institutions, and fellow artists.",
    "services.count": "services available",
    "services.available": "Available For",

    // Contact
    "contact.title": "Let's Create",
    "contact.titleHighlight": "Together",
    "contact.desc": "For booking inquiries, commissioning projects, or press requests, reach out directly. All serious enquiries receive a personal response within 48 hours.",
    "contact.basedIn": "Based In",
    "contact.basedInValue": "Hanoi, Vietnam · Available Worldwide",
    "contact.received": "Message Received",
    "contact.receivedDesc": "Thank you for reaching out. I will be in touch within 48 hours.",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.type": "Inquiry Type",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.namePlaceholder": "Your name",
    "contact.emailPlaceholder": "your@email.com",
    "contact.messagePlaceholder": "Tell me about your project...",
    
    // Inquiry Types
    "contact.type.booking": "Booking",
    "contact.type.composition": "Composition",
    "contact.type.production": "Production",
    "contact.type.education": "Education",
    "contact.type.press": "Press",
    "contact.type.other": "Other",

    // General
    // General
    "general.seeMore": "See more",
    "general.backToTop": "Back to top",
    "general.allRightsReserved": "All rights reserved",
    "footer.press": "Press & General",
    "footer.booking": "Booking",
    "footer.touring": "Touring",
    "footer.bio": "Composer, performer, and music director based in Hanoi, Vietnam. Available for international engagements.",
    "footer.nav": "Navigation",
    "footer.follow": "Follow",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
    
    // Page Headers
    "page.about.title": "Biogra",
    "page.about.highlight": "phy",
    "page.about.milestones": "Milestones",
    "page.about.achievements": "Key",
    "page.about.achievementsHighlight": "Achievements",
    
    "page.services.title": "Services &",
    "page.services.highlight": "Expertise",
    "page.services.cta.title": "Have a project",
    "page.services.cta.titleHighlight": "in mind?",
    "page.services.cta.desc": "Whether you are commissioning a new work, seeking a headline performer, or looking for a collaborator who will elevate the ambition of your project — the conversation starts here.",
    "page.services.cta.button": "Get in Touch",
    
    "page.shows.title": "On",
    "page.shows.highlight": "Stage",
    "page.shows.cta.details": "Details",
    "page.shows.cta.rsvp": "RSVP",
    "page.shows.cta.getTickets": "Get Tickets",
    "page.shows.cta.bookingLabel": "— Booking",
    "page.shows.cta.title": "For booking inquiries",
    "page.shows.cta.titleHighlight": "scheduling",
    "page.shows.cta.desc": "Please contact management directly for all live performance bookings, festival appearances, keynote engagements, and touring enquiries.",
    "page.shows.cta.button1": "Send an Enquiry",
    "page.shows.cta.button2": "View Services",
    
    "page.media.title": "Explore",
    "page.media.highlight": "Media",
    
    "page.shows.tab.all": "All",
    "page.media.tab.projects": "Projects",
    "page.media.tab.pictures": "Pictures",
    "page.media.tab.blog": "Blog",

    // Blog
    "blog.readMore": "Read full article →",
    "blog.draft": "Draft"
  },
  vi: {
    // Navigation
    "nav.home": "Trang Chủ",
    "nav.about": "Tiểu Sử",
    "nav.shows": "Lịch Diễn",
    "nav.media": "Tác Phẩm",
    "nav.services": "Dịch Vụ",
    "nav.contact": "Liên Hệ",

    // Hero
    "hero.discover": "Khám Phá",
    "hero.book": "Đặt Lịch →",
    "hero.scroll": "Cuộn",

    // About
    "about.title": "Tiểu Sử",
    "about.readFull": "Đọc Đầy Đủ Tiểu Sử",

    // Shows
    "shows.title": "Lịch Diễn Sắp Tới",
    "shows.allDates": "Xem Tất Cả",
    "shows.allShows": "Tất Cả Lịch Diễn",
    "shows.soldOut": "Hết Vé",
    "shows.tickets": "Mua Vé",

    // Media
    "media.label": "Tác Phẩm",
    "media.title": "Tác Phẩm & Trình Diễn",
    "media.featured": "Nổi Bật",
    "media.explore": "Khám Phá Toàn Bộ",
    "media.tab.works": "Tác Phẩm",
    "media.tab.pictures": "Hình Ảnh",
    "media.tab.blog": "Bài Viết",
    "media.empty.works": "Chưa có tác phẩm nổi bật.",
    "media.empty.pictures": "Chưa có hình ảnh nổi bật.",
    "media.empty.blog": "Chưa có bài viết nổi bật.",
    "media.featuredPictures": "Hình Ảnh Nổi Bật",

    // Services
    "services.label": "Dịch Vụ",
    "services.title": "Dịch Vụ & Hợp Tác",
    "services.offer": "Tôi Có Thể Làm Gì",
    "services.desc": "Các dịch vụ âm nhạc chuyên nghiệp dành cho đối tác, tổ chức và nghệ sĩ.",
    "services.count": "dịch vụ sẵn có",
    "services.available": "Sẵn Sàng Cho",

    // Contact
    "contact.title": "Cùng Tạo Ra",
    "contact.titleHighlight": "Giá Trị",
    "contact.desc": "Đối với các yêu cầu đặt lịch biểu diễn, hợp tác dự án hoặc truyền thông, vui lòng liên hệ trực tiếp. Tôi sẽ phản hồi sớm nhất trong vòng 48 giờ.",
    "contact.basedIn": "Khu Vực",
    "contact.basedInValue": "Hà Nội, Việt Nam · Sẵn sàng toàn thế giới",
    "contact.received": "Đã Nhận Tin Nhắn",
    "contact.receivedDesc": "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi lại trong vòng 48 giờ.",
    "contact.name": "Họ và Tên",
    "contact.email": "Địa Chỉ Email",
    "contact.type": "Loại Liên Hệ",
    "contact.message": "Nội Dung",
    "contact.send": "Gửi Tin Nhắn",
    "contact.sending": "Đang gửi...",
    "contact.namePlaceholder": "Tên của bạn",
    "contact.emailPlaceholder": "email.cua.ban@example.com",
    "contact.messagePlaceholder": "Hãy kể cho tôi về dự án của bạn...",
    
    // Inquiry Types
    "contact.type.booking": "Đặt Lịch",
    "contact.type.composition": "Sáng Tác",
    "contact.type.production": "Sản Xuất",
    "contact.type.education": "Giáo Dục",
    "contact.type.press": "Báo Chí",
    "contact.type.other": "Khác",

    // General
    // General
    "general.seeMore": "Xem thêm",
    "general.backToTop": "Lên đầu trang",
    "general.allRightsReserved": "Đã đăng ký bản quyền",
    "footer.press": "Truyền Thông & Chung",
    "footer.booking": "Đặt Lịch & Hợp Tác",
    "footer.touring": "Lưu Diễn",
    "footer.bio": "Nhạc sĩ, nghệ sĩ trình diễn và giám đốc âm nhạc tại Hà Nội, Việt Nam. Sẵn sàng cho các dự án quốc tế.",
    "footer.nav": "Điều Hướng",
    "footer.follow": "Theo Dõi",
    "footer.privacy": "Chính Sách Bảo Mật",
    "footer.terms": "Điều Khoản Sử Dụng",

    // Page Headers
    "page.about.title": "Tiểu ",
    "page.about.highlight": "Sử",
    "page.about.milestones": "Cột Mốc",
    "page.about.achievements": "Thành Tựu",
    "page.about.achievementsHighlight": "Nổi Bật",
    
    "page.services.title": "Dịch Vụ &",
    "page.services.highlight": "Chuyên Môn",
    "page.services.cta.title": "Bạn có dự án",
    "page.services.cta.titleHighlight": "cần hợp tác?",
    "page.services.cta.desc": "Cho dù bạn đang muốn ủy thác một tác phẩm mới, tìm kiếm nghệ sĩ biểu diễn chính, hay tìm một người cộng tác để nâng tầm tham vọng cho dự án của bạn — cuộc trò chuyện bắt đầu từ đây.",
    "page.services.cta.button": "Liên Hệ Ngay",
    
    "page.shows.title": "Trên",
    "page.shows.highlight": "Sân Khấu",
    "page.shows.cta.details": "Chi Tiết",
    "page.shows.cta.rsvp": "Đăng Ký",
    "page.shows.cta.getTickets": "Mua Vé",
    "page.shows.cta.bookingLabel": "— Đặt Lịch",
    "page.shows.cta.title": "Cho các yêu cầu đặt lịch",
    "page.shows.cta.titleHighlight": "biểu diễn",
    "page.shows.cta.desc": "Vui lòng liên hệ trực tiếp với ban quản lý cho tất cả các đặt lịch biểu diễn trực tiếp, xuất hiện tại lễ hội, diễn thuyết và các yêu cầu lưu diễn.",
    "page.shows.cta.button1": "Gửi Yêu Cầu",
    "page.shows.cta.button2": "Xem Dịch Vụ",
    
    "page.media.title": "Khám Phá",
    "page.media.highlight": "Tác Phẩm",
    
    "page.shows.tab.all": "Tất Cả",
    "page.media.tab.projects": "Dự Án",
    "page.media.tab.pictures": "Hình Ảnh",
    "page.media.tab.blog": "Bài Viết",

    // Blog
    "blog.readMore": "Đọc toàn bộ bài viết →",
    "blog.draft": "Bản nháp"
  }
};

type Translations = typeof translations.en;
export type TranslationKey = keyof Translations;

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem("app_language");
    return (saved === "en" || saved === "vi") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("app_language", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "vi" : "en"));
  };

  const t = (key: TranslationKey) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
