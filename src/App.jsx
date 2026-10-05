import { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";
import "./premium-filters.css";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import OrderCheckout from "./OrderCheckout";
import TableReservation from "./TableReservation";

const phone = "9876543210";
const hotelName = "Hotel Rajwada";
const hotelImage =
  "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202208162301399271-87e0b67c1ebb11eda5780a58a9feac02.jpg";

const phoneUrl = `tel:+91${phone}`;

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Hotel+Rajwada+Pune";

// Food images
const chickenBiryaniImage =
  "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_600%2Ch_468/v1709123852/c8d20638b36526ebc5261f543605e660.jpg";

const vegBiryaniImage =
  "https://cdn.uengage.io/uploads/10295/image-1688-1770195335.jpg";

const paneerTikkaImage =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Ce_grayscale%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/6/11/dd6a99bb-f5c8-4f4c-89d2-cf13213fe9f6_c5fd8bfa-3f8d-4a90-9f3e-e3f01d73720a.jpg";

const chickenTikkaImage =
  "https://d1w7312wesee68.cloudfront.net/6JjuGXEieGnuRREZt14rY8PWzG9eaLaVNS54FhSKGDc/resize%3Afit%3A720%3A720/plain/s3%3A/toasttab/restaurants/restaurant-77381000000000000/menu/items/5/item-300000047407818415_1752864551.jpg";

const maharashtrianThaliImage =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/14/fc513c93-66d6-4092-98da-449bbc3181e1_83dc4a11-a2dd-496b-b611-8fb7e964b22d.jpg";

const royalThaliImage =
  "https://i0.wp.com/kottaramrestaurant.com/wp-content/uploads/2023/06/Kottaram4.jpg?fit=571%2C571&ssl=1";

const butterChickenImage =
  "https://static-content.owner.com/funnel/images/2d085597-b5e7-404b-8fd7-34d96fd2ab9a?auto=format&q=80&v=5962340054&w=3840";

const dalTadkaImage =
  "https://static.wixstatic.com/media/34fc00_87b7b02d885f468482309cd26fbd0fc0~mv2.png/v1/fill/w_980%2Ch_980%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/34fc00_87b7b02d885f468482309cd26fbd0fc0~mv2.png";

const gulabJamunImage =
  "https://thenirvana-in.ucj.omu.mybluehostin.me/uploads/2020/06/31889689_1593199646_gulab-jamun-recipe-2-1.jpg";

const categories = [
  "All",
  "Biryani",
  "Starters",
  "Thali",
  "Main Course",
  "Desserts",
];

const gallery = [
  {
    title: "Signature Biryani",
    image: chickenBiryaniImage,
  },
  {
    title: "Royal Thali",
    image: royalThaliImage,
  },
  {
    title: "Dal Tadka",
    image: dalTadkaImage,
  },
  {
    title: "Gulab Jamun",
    image: gulabJamunImage,
  },
];

const reviews = [
  {
    name: "Rahul Patil",
    text: "Amazing food and beautiful ambience. The biryani was absolutely delicious.",
  },
  {
    name: "Sneha Kulkarni",
    text: "Loved the thali and the service. Very warm and welcoming experience.",
  },
  {
    name: "Amit Joshi",
    text: "Good portions, authentic flavours and friendly staff.",
  },
];

function WhatsAppIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="16"
        fill="#25D366"
      />

      <path
        d="M22.2 18.1c-.3-.15-1.8-.9-2.08-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.95 1.2-.17.2-.35.23-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [adminAuthLoading, setAdminAuthLoading] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [checkoutOpen, setCheckoutOpen] =
    useState(false);

  const [reservationOpen, setReservationOpen] =
    useState(false);

  const [menuItems, setMenuItems] =
    useState([]);

  const [menuLoading, setMenuLoading] =
    useState(true);

  const [menuError, setMenuError] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [foodType, setFoodType] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [cart, setCart] = useState([]);

  const [selectedFood, setSelectedFood] =
    useState(null);

  const [lightboxImage, setLightboxImage] =
    useState(null);

  const heroRef = useRef(null);

  // ================================
  // ADMIN AUTH CHECK
  // ================================
  useEffect(() => {
    const checkAdminSession = async () => {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) {
        console.error(
          "Admin session error:",
          error
        );

        setAdminUser(null);
        setAdminAuthLoading(false);
        return;
      }

      const user =
        data?.session?.user;

      if (!user) {
        setAdminUser(null);
        setAdminAuthLoading(false);
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (
        !profileError &&
        profile?.role === "admin"
      ) {
        setAdminUser(user);
      } else {
        await supabase.auth.signOut();
        setAdminUser(null);
      }

      setAdminAuthLoading(false);
    };

    checkAdminSession();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (_event, session) => {
          const user =
            session?.user;

          if (!user) {
            setAdminUser(null);
            return;
          }

          const {
            data: profile,
          } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (
            profile?.role === "admin"
          ) {
            setAdminUser(user);
          } else {
            setAdminUser(null);
          }
        }
      );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ================================
  // ADMIN ROUTE
  // ================================
  const isAdminRoute =
    window.location.pathname.toLowerCase() ===
    "/admin";

  if (isAdminRoute) {
    if (adminAuthLoading) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#071522",
            color: "#e5cc82",
            fontFamily: "inherit",
            fontSize: "14px",
          }}
        >
          Loading Admin Panel...
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLogin
          onLogin={(user) => {
            setAdminUser(user);
          }}
        />
      );
    }

    return (
      <AdminDashboard
        user={adminUser}
        onLogout={() => {
          setAdminUser(null);

          window.history.replaceState(
            {},
            "",
            "/admin"
          );
        }}
      />
    );
  }

  // ================================
  // LOAD MENU FROM SUPABASE
  // ================================
  useEffect(() => {
    const loadMenu = async () => {
      setMenuLoading(true);
      setMenuError("");

      const { data, error } =
        await supabase
          .from("menu_items")
          .select(
            "id,name,marathi,category,type,price,description,image,is_available,is_special"
          )
          .eq("is_available", true)
          .order("id", {
            ascending: true,
          });

      if (error) {
        console.error(
          "Supabase menu error:",
          error
        );

        setMenuError(
          "Menu could not be loaded. Please check your Supabase connection."
        );

        setMenuItems([]);
      } else {
        setMenuItems(data || []);
      }

      setMenuLoading(false);
    };

    loadMenu();
  }, []);

  // ================================
  // HERO PARALLAX
  // ================================
  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const handlePointerMove = (
      event
    ) => {
      const rect =
        hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      hero.style.setProperty(
        "--mx",
        `${x * 18}px`
      );

      hero.style.setProperty(
        "--my",
        `${y * 14}px`
      );
    };

    const resetPointer = () => {
      hero.style.setProperty(
        "--mx",
        "0px"
      );

      hero.style.setProperty(
        "--my",
        "0px"
      );
    };

    hero.addEventListener(
      "pointermove",
      handlePointerMove
    );

    hero.addEventListener(
      "pointerleave",
      resetPointer
    );

    return () => {
      hero.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      hero.removeEventListener(
        "pointerleave",
        resetPointer
      );
    };
  }, []);

  // ================================
  // FILTER MENU
  // ================================
  const filteredItems =
    menuItems.filter((item) => {
      const categoryMatch =
        activeCategory === "All" ||
        item.category ===
          activeCategory;

      const typeMatch =
        foodType === "All" ||
        item.type === foodType;

      const q = searchTerm
        .trim()
        .toLowerCase();

      const searchMatch =
        !q ||
        item.name
          ?.toLowerCase()
          .includes(q) ||
        item.marathi
          ?.toLowerCase()
          .includes(q) ||
        item.description
          ?.toLowerCase()
          .includes(q);

      return (
        categoryMatch &&
        typeMatch &&
        searchMatch
      );
    });

  // ================================
  // TODAY'S SPECIAL
  // ================================
  const todaySpecial =
    menuItems.find(
      (item) => item.is_special
    ) ||
    menuItems.find(
      (item) =>
        item.name === "Butter Chicken"
    ) ||
    null;

  // ================================
  // OPEN / CLOSED
  // ================================
  const isOpenNow = (() => {
    const hour =
      new Date().getHours();

    return hour >= 11 && hour < 23;
  })();

  // ================================
  // CART
  // ================================
  const addToCart = (item) => {
    setCart((current) => {
      const existing =
        current.find(
          (cartItem) =>
            cartItem.id === item.id
        );

      if (existing) {
        return current.map(
          (cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                }
              : cartItem
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  };

  const increaseQuantity = (id) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  };

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        item.quantity,
    0
  );

  // ================================
  // OPEN CHECKOUT
  // ================================
  const openCheckout = () => {
    if (!cart.length) {
      return;
    }

    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // ================================
  // ORDER SUCCESS
  // ================================
  const handleOrderSuccess = () => {
    setCart([]);
  };

  // ================================
  // WHATSAPP ORDER
  // ================================
  const sendWhatsAppOrder = () => {
    if (!cart.length) return;

    const orderText = cart
      .map(
        (item) =>
          `${item.name} x ${
            item.quantity
          } = ₹${
            Number(item.price || 0) *
            item.quantity
          }`
      )
      .join("\n");

    const message =
      encodeURIComponent(
        `Hello Hotel Rajwada 👋

I would like to place an order:

${orderText}

Total: ₹${cartTotal}

Please confirm my order.
Thank you!`
      );

    window.open(
      `https://wa.me/91${phone}?text=${message}`,
      "_blank"
    );
  };

  // ================================
  // OPEN TABLE RESERVATION
  // ================================
  const openReservation = () => {
    setReservationOpen(true);
  };

  // ================================
  // RESERVATION SUCCESS
  // ================================
  const handleReservationSuccess = () => {
    setReservationOpen(false);
  };

  return (
    <div className="site">
      {/* ================================
          NAVBAR
      ================================= */}

      <header className="navbar">
        <div className="nav-inner">
          <a
            href="#home"
            className="brand"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <span className="brand-mark">
              RR
            </span>

            <span className="brand-text">
              <strong>
                Hotel Rajwada
              </strong>

              <small>
                Authentic Indian Cuisine
              </small>
            </span>
          </a>

          <button
            className="menu-toggle"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav
            className={
              menuOpen
                ? "nav-links active"
                : "nav-links"
            }
          >
            <a
              href="#home"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Home
            </a>

            <a
              href="#about"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              About
            </a>

            <a
              href="#menu"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Menu
            </a>

            <a
              href="#gallery"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Gallery
            </a>

            <a
              href="#reviews"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Reviews
            </a>

            <a
              href="#contact"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Contact
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className="cart-button"
              onClick={() =>
                setCartOpen(true)
              }
            >
              🛒
              <span>Cart</span>

              {cartCount > 0 && (
                <b className="cart-count">
                  {cartCount}
                </b>
              )}
            </button>

            <a
              href={phoneUrl}
              className="nav-cta"
            >
              Call Now
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}

        <section
          className="hero hero-3d"
          id="home"
          ref={heroRef}
        >
          <div className="hero-3d-glow hero-3d-glow-one"></div>

          <div className="hero-3d-glow hero-3d-glow-two"></div>

          <div className="hero-3d-grid"></div>

          <div className="hero-overlay"></div>

          <div
            className="hero-3d-scene"
            aria-hidden="true"
          >
            <div className="hero-orb hero-orb-one"></div>

            <div className="hero-orb hero-orb-two"></div>

            <div className="hero-plate">
              <div className="hero-plate-inner">
                <img
                  className="hero-hotel-photo"
                  src={hotelImage}
                  alt={`${hotelName} exterior`}
                />

                <div className="hero-food">
                  <span className="food-steam steam-one"></span>

                  <span className="food-steam steam-two"></span>

                  <span className="food-steam steam-three"></span>

                  <div className="food-bowl">
                    <span className="food-rice"></span>

                    <span className="food-curry curry-one"></span>

                    <span className="food-curry curry-two"></span>

                    <span className="food-herb herb-one">
                      ✦
                    </span>

                    <span className="food-herb herb-two">
                      ✦
                    </span>
                  </div>

                  <div className="food-garnish garnish-one"></div>

                  <div className="food-garnish garnish-two"></div>

                  <div className="food-garnish garnish-three"></div>
                </div>
              </div>
            </div>

            <div className="hero-floating-card hero-card-top">
              <span>✦</span>

              <strong>
                Royal Flavours
              </strong>
            </div>

            <div className="hero-floating-card hero-card-bottom">
              <strong>4.8</strong>

              <span>★★★★★</span>
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-badge">
              <span>★</span>

              <strong>4.8</strong>

              <small>
                Customer Rated
              </small>
            </div>

            <div
              className={`open-status ${
                isOpenNow
                  ? "is-open"
                  : "is-closed"
              }`}
            >
              <span></span>

              {isOpenNow
                ? "Open Now"
                : "Closed Now"}{" "}
              · 11 AM–11 PM
            </div>

            <p className="eyebrow">
              RASOI ROYALE • PUNE
            </p>

            <h1>
              Royal taste.
              <br />
              <em>Indian soul.</em>
            </h1>

            <p className="hero-text">
              Authentic Indian flavours,
              beautifully prepared and
              served with warmth, passion
              and a touch of royalty.
            </p>

            <div className="hero-buttons">
              <a
                href="#menu"
                className="primary-button"
              >
                Explore Menu{" "}
                <span>→</span>
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                Find Our Table
              </a>
            </div>

            <div className="hero-info">
              <span>
                ✦ Fresh Ingredients
              </span>

              <span>
                ✦ Family Dining
              </span>

              <span>
                ✦ Takeaway
              </span>
            </div>
          </div>

          <div className="scroll-indicator">
            <span>SCROLL</span>

            <i></i>
          </div>
        </section>

        {/* WELCOME */}

        <section className="welcome section-space">
          <div className="section-number">
            01
          </div>

          <div className="welcome-grid">
            <div>
              <p className="section-label">
                WELCOME TO RASOI ROYALE
              </p>

              <h2>
                Every dish has
                <br />
                <span>a story.</span>
              </h2>
            </div>

            <div className="welcome-text">
              <p>
                We bring together
                traditional Indian recipes,
                premium ingredients and
                modern hospitality.
              </p>

              <p>
                From aromatic biryanis to
                generous thalis and indulgent
                desserts, every plate is made
                to feel special.
              </p>

              <a
                href="#menu"
                className="text-link"
              >
                Discover our menu →
              </a>
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <section className="feature-strip">
          <article>
            <span className="feature-icon">
              ✦
            </span>

            <div>
              <strong>
                Freshly Prepared
              </strong>

              <p>
                Made fresh for every order.
              </p>
            </div>
          </article>

          <article>
            <span className="feature-icon">
              ♨
            </span>

            <div>
              <strong>
                Authentic Flavours
              </strong>

              <p>
                Traditional Indian recipes.
              </p>
            </div>
          </article>

          <article>
            <span className="feature-icon">
              ♡
            </span>

            <div>
              <strong>
                Warm Hospitality
              </strong>

              <p>
                Service with a personal
                touch.
              </p>
            </div>
          </article>

          <article>
            <span className="feature-icon">
              ★
            </span>

            <div>
              <strong>
                Happy Guests
              </strong>

              <p>
                Made for memorable meals.
              </p>
            </div>
          </article>
        </section>

        {/* ABOUT */}

        <section
          className="about section-space"
          id="about"
        >
          <div className="section-number">
            02
          </div>

          <div className="about-grid">
            <div className="about-image">
              <img
                src="https://www.restroworks.com/blog/wp-content/uploads/2025/07/Cost-of-Opening-a-Restaurant-in-India.webp"
                alt="Premium Indian restaurant"
              />

              <div className="image-label">
                <span>THE</span>

                <strong>ROYAL</strong>

                <small>
                  Indian Dining
                </small>
              </div>
            </div>

            <div className="about-content">
              <p className="section-label">
                OUR STORY
              </p>

              <h2>
                Tradition,
                <br />
                <span>
                  reimagined.
                </span>
              </h2>

              <p>
                At Hotel Rajwada,
                traditional Indian cooking
                meets an elegant dining
                experience.
              </p>

              <p>
                We believe food should look
                beautiful, smell incredible
                and leave you wanting one
                more bite.
              </p>

              <div className="about-stats">
                <div>
                  <strong>25+</strong>

                  <span>Dishes</span>
                </div>

                <div>
                  <strong>4.8</strong>

                  <span>Rating</span>
                </div>

                <div>
                  <strong>100%</strong>

                  <span>Fresh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MENU */}

        <section
          className="menu-section section-space"
          id="menu"
        >
          <div className="section-number">
            03
          </div>

          <div className="menu-heading">
            <div>
              <p className="section-label">
                THE ROYAL MENU
              </p>

              <h2>
                Made to
                <br />
                <span>impress.</span>
              </h2>
            </div>

            <p>
              Explore our signature dishes
              and add your favourites to the
              order. Your complete order can
              be sent directly to WhatsApp.
            </p>
          </div>

          <div className="menu-search">
            <input
              type="search"
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />
          </div>

          <div className="category-tabs">
            {categories.map(
              (category) => (
                <button
                  key={category}
                  className={
                    activeCategory ===
                    category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveCategory(
                      category
                    )
                  }
                >
                  {category}
                </button>
              )
            )}
          </div>

          <div className="food-type-tabs premium-food-filters">
            <button
              type="button"
              className={`food-filter-button ${
                foodType === "All"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFoodType("All")
              }
            >
              <span className="filter-icon">
                ✦
              </span>

              <span>
                All Dishes
              </span>
            </button>

            <button
              type="button"
              className={`food-filter-button veg-filter ${
                foodType === "veg"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFoodType("veg")
              }
            >
              <span className="veg-dot"></span>

              <span>
                Vegetarian
              </span>
            </button>

            <button
              type="button"
              className={`food-filter-button nonveg-filter ${
                foodType === "nonveg"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setFoodType("nonveg")
              }
            >
              <span className="nonveg-dot"></span>

              <span>
                Non-Vegetarian
              </span>
            </button>
          </div>

          {menuLoading && (
            <div className="menu-status">
              <div className="menu-loader"></div>

              <p>
                Loading Royal Menu...
              </p>
            </div>
          )}

          {!menuLoading &&
            menuError && (
              <div className="menu-status menu-error">
                <strong>
                  Unable to load menu
                </strong>

                <p>{menuError}</p>

                <button
                  className="primary-button"
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try Again
                </button>
              </div>
            )}

          {!menuLoading &&
            !menuError &&
            filteredItems.length ===
              0 && (
              <div className="menu-status">
                <strong>
                  No dishes found
                </strong>

                <p>
                  Try another search or
                  category.
                </p>
              </div>
            )}

          {!menuLoading &&
            !menuError &&
            filteredItems.length >
              0 && (
              <div className="menu-grid">
                {filteredItems.map(
                  (item) => (
                    <article
                      className="food-card"
                      key={item.id}
                    >
                      <div
                        className="food-image"
                        onClick={() =>
                          setSelectedFood(
                            item
                          )
                        }
                        style={{
                          cursor:
                            "pointer",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                        />

                        <span className="food-category">
                          {item.category}
                        </span>

                        <button
                          className="quick-add"
                          onClick={(
                            event
                          ) => {
                            event.stopPropagation();

                            addToCart(
                              item
                            );
                          }}
                          aria-label={`Add ${item.name} to cart`}
                        >
                          +
                        </button>
                      </div>

                      <div className="food-card-content">
                        <div className="food-title-row">
                          <div>
                            <h3>
                              {item.name}
                            </h3>

                            <span>
                              {
                                item.marathi
                              }
                            </span>
                          </div>

                          <strong>
                            ₹
                            {Number(
                              item.price
                            )}
                          </strong>
                        </div>

                        <p>
                          {
                            item.description
                          }
                        </p>

                        <div className="food-card-actions">
                          <button
                            className="add-button"
                            onClick={() =>
                              addToCart(
                                item
                              )
                            }
                          >
                            Add to Order

                            <span>
                              +
                            </span>
                          </button>

                          <button
                            className="view-food-button premium-view-button"
                            onClick={() =>
                              setSelectedFood(
                                item
                              )
                            }
                          >
                            <span>
                              View Details
                            </span>

                            <b>↗</b>
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}

          <div className="menu-bottom-note">
            <span>✦</span>

            <p>
              Menu items, prices,
              availability and specials
              are managed from the Hotel
              Rajwada database.
            </p>
          </div>
        </section>

        {/* TODAY'S SPECIAL */}

        <section
          className="today-section section-space"
          id="special"
        >
          <div className="section-heading centered">
            <p className="section-label">
              CHEF'S CHOICE
            </p>

            <h2>
              Today's{" "}
              <em>Special</em>
            </h2>

            <p>
              Handpicked favourites for a
              memorable Rajwada dining
              experience.
            </p>
          </div>

          {todaySpecial ? (
            <div className="today-card">
              <img
                src={todaySpecial.image}
                alt={
                  todaySpecial.name
                }
              />

              <div className="today-card-content">
                <span className="offer-pill">
                  TODAY'S SPECIAL
                </span>

                <h3>
                  {todaySpecial.name}
                </h3>

                <p>
                  {
                    todaySpecial.description
                  }
                </p>

                <div className="today-meta">
                  <strong>
                    ₹
                    {Number(
                      todaySpecial.price
                    )}
                  </strong>

                  <span>
                    Chef recommended
                  </span>
                </div>

                <button
                  className="primary-button"
                  onClick={() =>
                    addToCart(
                      todaySpecial
                    )
                  }
                >
                  Add to Cart →
                </button>
              </div>
            </div>
          ) : (
            <div className="menu-status">
              <p>
                Today's special will
                appear here when marked
                as special in the database.
              </p>
            </div>
          )}
        </section>

        {/* OFFERS */}

        <section
          className="offers-section section-space"
          id="offers"
        >
          <div className="section-heading centered">
            <p className="section-label">
              ROYAL OFFERS
            </p>

            <h2>
              Make it{" "}
              <em>special.</em>
            </h2>

            <p>
              Offers can be customised
              for the real hotel later.
            </p>
          </div>

          <div className="offer-grid">
            <article className="offer-card">
              <span>01</span>

              <h3>
                Family Feast
              </h3>

              <p>
                Combine favourite
                starters, mains and
                desserts for the table.
              </p>

              <button
                onClick={() =>
                  document
                    .getElementById(
                      "menu"
                    )
                    ?.scrollIntoView({
                      behavior:
                        "smooth",
                    })
                }
              >
                Explore Menu →
              </button>
            </article>

            <article className="offer-card featured-offer">
              <span>02</span>

              <h3>
                Royal Dining
              </h3>

              <p>
                Celebrate birthdays,
                dinners and special
                moments with a premium
                table experience.
              </p>

              <button
                onClick={openReservation}
              >
                Reserve Table →
              </button>
            </article>

            <article className="offer-card">
              <span>03</span>

              <h3>
                Takeaway Favourites
              </h3>

              <p>
                Order your favourite
                dishes on WhatsApp and
                confirm directly with the
                hotel.
              </p>

              <button
                onClick={() =>
                  setCartOpen(true)
                }
              >
                Order Now →
              </button>
            </article>
          </div>
        </section>

        {/* RESERVATION */}

        <section
          className="reservation-section section-space"
          id="reservation"
        >
          <div className="reservation-copy">
            <p className="section-label">
              TABLE RESERVATION
            </p>

            <h2>
              Your table,
              <br />
              <em>
                your moment.
              </em>
            </h2>

            <p>
              Choose your date, time and
              guests. Your reservation
              request will be securely
              saved for the hotel team.
            </p>

            <div className="reservation-points">
              <span>
                ✓ Quick confirmation
              </span>

              <span>
                ✓ Family & group dining
              </span>

              <span>
                ✓ Special requests
                welcome
              </span>
            </div>
          </div>

          <button
            className="primary-button reservation-main-btn"
            onClick={openReservation}
          >
            Reserve a Table →
          </button>
        </section>

        {/* QR MENU */}

        <section
          className="qr-section section-space"
          id="qr-menu"
        >
          <div>
            <p className="section-label">
              DIGITAL MENU
            </p>

            <h2>
              Scan the{" "}
              <em>Royal Menu.</em>
            </h2>

            <p>
              Create a QR code for this
              website and place it on
              hotel tables, the counter or
              takeaway packaging.
            </p>
          </div>

          <div className="qr-card">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                window.location.origin
              )}`}
              alt="Hotel Rajwada QR menu"
            />

            <strong>
              Scan to visit
            </strong>

            <span>
              Hotel Rajwada digital menu
            </span>
          </div>
        </section>

        {/* SPECIAL BANNER */}

        <section className="special-banner">
          <div className="special-overlay"></div>

          <div className="special-content">
            <p className="section-label">
              THE RASOI ROYALE EXPERIENCE
            </p>

            <h2>
              Come for the food.
              <br />
              <em>
                Stay for the feeling.
              </em>
            </h2>

            <a
              href="#contact"
              className="primary-button"
            >
              Visit Hotel Rajwada →
            </a>
          </div>
        </section>

        {/* GALLERY */}

        <section
          className="gallery section-space"
          id="gallery"
        >
          <div className="section-number">
            04
          </div>

          <div className="gallery-heading">
            <p className="section-label">
              FOOD STORIES
            </p>

            <h2>
              A taste of
              <br />
              <span>
                what awaits.
              </span>
            </h2>
          </div>

          <div className="gallery-grid">
            {gallery.map(
              (item, index) => (
                <div
                  className={`gallery-card gallery-card-${
                    index + 1
                  }`}
                  key={item.title}
                  onClick={() =>
                    setLightboxImage(
                      item
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />

                  <div className="gallery-caption">
                    <span>
                      {item.title}
                    </span>

                    <b>↗</b>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* REVIEWS */}

        <section
          className="reviews section-space"
          id="reviews"
        >
          <div className="section-number">
            05
          </div>

          <div className="reviews-layout">
            <div className="review-summary">
              <p className="section-label">
                CUSTOMER LOVE
              </p>

              <strong>4.8</strong>

              <div className="big-stars">
                ★★★★★
              </div>

              <p>
                Customer rating
              </p>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                View on Google →
              </a>
            </div>

            <div className="reviews-content">
              <h2>
                Loved by our
                <br />
                <span>
                  guests.
                </span>
              </h2>

              <div className="review-grid">
                {reviews.map(
                  (review) => (
                    <article
                      className="review-card"
                      key={review.name}
                    >
                      <div className="review-stars">
                        ★★★★★
                      </div>

                      <p>
                        “{review.text}”
                      </p>

                      <div className="review-user">
                        <div>
                          {review.name.charAt(
                            0
                          )}
                        </div>

                        <span>
                          <strong>
                            {
                              review.name
                            }
                          </strong>

                          <small>
                            Happy Guest
                          </small>
                        </span>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ORDER */}

        <section className="order-section">
          <div>
            <p className="section-label">
              READY TO ORDER?
            </p>

            <h2>
              Your table is
              <br />
              waiting.
            </h2>

            <p>
              Call us, visit us or send
              your favourite dishes
              directly on WhatsApp.
            </p>
          </div>

          <div className="order-actions">
            <a
              href={phoneUrl}
              className="order-action"
            >
              <span>☎</span>

              <strong>
                Call Us
              </strong>
            </a>

            <button
              className="order-action whatsapp-action"
              onClick={() =>
                setCartOpen(true)
              }
            >
              <WhatsAppIcon />

              <strong>
                WhatsApp Order
              </strong>
            </button>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="order-action"
            >
              <span>⌖</span>

              <strong>
                Directions
              </strong>
            </a>
          </div>
        </section>

        {/* CONTACT */}

        <section
          className="contact section-space"
          id="contact"
        >
          <div className="section-number">
            06
          </div>

          <div className="contact-grid">
            <div className="contact-content">
              <p className="section-label">
                VISIT US
              </p>

              <h2>
                Good food.
                <br />
                <span>
                  Good memories.
                </span>
              </h2>

              <div className="contact-details">
                <div>
                  <small>
                    ADDRESS
                  </small>

                  <p>
                    Pune, Maharashtra
                    <br />
                    India — 4110XX
                  </p>
                </div>

                <div>
                  <small>
                    PHONE
                  </small>

                  <a href={phoneUrl}>
                    +91 98765 43210
                  </a>
                </div>

                <div>
                  <small>
                    OPENING HOURS
                  </small>

                  <p>
                    Monday – Sunday •
                    11:00 AM – 10:30 PM
                  </p>
                </div>
              </div>

              <div className="contact-buttons">
                <a
                  href={phoneUrl}
                  className="primary-button"
                >
                  Call Now →
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="outline-button"
                >
                  Get Directions
                </a>
              </div>
            </div>

            <div className="map-card">
              <iframe
                title="Hotel Rajwada Location"
                src="https://www.google.com/maps?q=Pune%2C%20Maharashtra&output=embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <div className="map-label">
                <span>⌖</span>

                <div>
                  <strong>
                    Hotel Rajwada
                  </strong>

                  <small>
                    Pune, Maharashtra
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">
            RR
          </span>

          <div>
            <strong>
              Hotel Rajwada
            </strong>

            <small>
              Authentic Indian Cuisine
            </small>
          </div>
        </div>

        <div className="footer-links">
          <a href="#home">
            Home
          </a>

          <a href="#menu">
            Menu
          </a>

          <a href="#gallery">
            Gallery
          </a>

          <a href="#offers">
            Offers
          </a>

          <a href="#reservation">
            Reservation
          </a>

          <a href="#qr-menu">
            QR Menu
          </a>

          <a href="#contact">
            Contact
          </a>
        </div>

        <p>
          © 2026 Hotel Rajwada
        </p>
      </footer>

      {/* FLOATING WHATSAPP */}

      <a
        className="whatsapp-float"
        href={`https://wa.me/91${phone}`}
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppIcon />

        <span>
          Chat on WhatsApp
        </span>
      </a>

      {/* MOBILE BOTTOM BAR */}

      <div className="mobile-bottom-bar">
        <a href={phoneUrl}>
          ☎ Call
        </a>

        <button
          onClick={() =>
            setCartOpen(true)
          }
        >
          🛒 Cart{" "}
          {cartCount > 0 &&
            `(${cartCount})`}
        </button>

        <a
          href={`https://wa.me/91${phone}`}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon />

          WhatsApp
        </a>
      </div>

      {/* FOOD DETAILS MODAL */}

      {selectedFood && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedFood(null)
          }
        >
          <div
            className="food-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setSelectedFood(null)
              }
            >
              ×
            </button>

            <img
              src={selectedFood.image}
              alt={
                selectedFood.name
              }
            />

            <div className="food-modal-body">
              <span className="section-label">
                {selectedFood.type ===
                "veg"
                  ? "VEGETARIAN"
                  : "NON-VEGETARIAN"}
              </span>

              <h2>
                {selectedFood.name}
              </h2>

              <p className="food-marathi">
                {
                  selectedFood.marathi
                }
              </p>

              <p>
                {
                  selectedFood.description
                }
              </p>

              <div className="food-modal-bottom">
                <strong>
                  ₹
                  {Number(
                    selectedFood.price
                  )}
                </strong>

                <button
                  className="primary-button"
                  onClick={() => {
                    addToCart(
                      selectedFood
                    );

                    setSelectedFood(
                      null
                    );
                  }}
                >
                  Add to Cart →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY LIGHTBOX */}

      {lightboxImage && (
        <div
          className="lightbox"
          onClick={() =>
            setLightboxImage(null)
          }
        >
          <button
            onClick={() =>
              setLightboxImage(null)
            }
          >
            ×
          </button>

          <img
            src={lightboxImage.image}
            alt={
              lightboxImage.title
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <strong>
            {lightboxImage.title}
          </strong>
        </div>
      )}

      {/* TABLE RESERVATION */}

        {reservationOpen && (
        <TableReservation
         onClose={() => {
      setReservationOpen(false);
        }}
          onReservationSuccess={(reservation) => {
        console.log("Reservation successful:", reservation);
    }}
  />
)}
      {/* CART DRAWER */}

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() =>
            setCartOpen(false)
          }
        >
          <aside
            className="cart-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="cart-header">
              <div>
                <span className="section-label">
                  YOUR ORDER
                </span>

                <h2>
                  Your Cart
                </h2>
              </div>

              <button
                className="cart-close"
                onClick={() =>
                  setCartOpen(false)
                }
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>

                <h3>
                  Your cart is empty
                </h3>

                <p>
                  Add something
                  delicious from our
                  menu.
                </p>

                <button
                  onClick={() => {
                    setCartOpen(
                      false
                    );

                    document
                      .getElementById(
                        "menu"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                      });
                  }}
                >
                  Explore Menu →
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(
                    (item) => (
                      <div
                        className="cart-item"
                        key={
                          item.id
                        }
                      >
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                        />

                        <div className="cart-item-info">
                          <strong>
                            {
                              item.name
                            }
                          </strong>

                          <span>
                            ₹
                            {Number(
                              item.price
                            )}
                          </span>

                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.id
                                )
                              }
                            >
                              −
                            </button>

                            <strong>
                              {
                                item.quantity
                              }
                            </strong>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.id
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="cart-item-right">
                          <strong>
                            ₹
                            {Number(
                              item.price
                            ) *
                              item.quantity}
                          </strong>

                          <button
                            className="remove-item"
                            onClick={() =>
                              removeFromCart(
                                item.id
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>
                      Total Items
                    </span>

                    <strong>
                      {cartCount}
                    </strong>
                  </div>

                  <div className="cart-total">
                    <span>
                      Estimated Total
                    </span>

                    <strong>
                      ₹{cartTotal}
                    </strong>
                  </div>

                  <p>
                    Prices are loaded
                    directly from the
                    Hotel Rajwada menu
                    database.
                  </p>

                  <button
                    className="primary-button full-button"
                    type="button"
                    onClick={
                      openCheckout
                    }
                  >
                    Place Order →
                  </button>

                  <button
                    className="whatsapp-order-button"
                    onClick={
                      sendWhatsAppOrder
                    }
                  >
                    <WhatsAppIcon />

                    Send Order on WhatsApp →
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* DATABASE ORDER CHECKOUT */}

      {checkoutOpen && (
        <OrderCheckout
          cartItems={cart}
          totalAmount={cartTotal}
          onClose={() =>
            setCheckoutOpen(false)
          }
          onOrderSuccess={
            handleOrderSuccess
          }
        />
      )}
    </div>
  );
}

export default App;

