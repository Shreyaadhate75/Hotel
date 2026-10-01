import { useState } from "react";
import "./App.css";

const phone = "9876543210";
const phoneUrl = `tel:+91${phone}`;

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Rasoi+Royale+Pune";

// Food images
const chickenBiryaniImage =
  "https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_600%2Ch_468/v1709123852/c8d20638b36526ebc5261f543605e660.jpg";

const vegBiryaniImage =
  "https://cdn.uengage.io/uploads/10295/image-1688-1770195335.jpg";

const paneerTikkaImage =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Ce_grayscale%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2025/6/11/dd6a99bb-f5c8-4f4c-89d2-cf13213fe9f6_c5fd8bfa-3f8d-4a90-9f3e-e3f01d73720a.jpg";

// Actual Chicken Tikka image
const chickenTikkaImage =
  "https://d1w7312wesee68.cloudfront.net/6JjuGXEieGnuRREZt14rY8PWzG9eaLaVNS54FhSKGDc/resize%3Afit%3A720%3A720/plain/s3%3A/toasttab/restaurants/restaurant-77381000000000000/menu/items/5/item-300000047407818415_1752864551.jpg";

// Maharashtrian Thali
const maharashtrianThaliImage =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto%2Cw_300%2Ch_300%2Cc_fit/FOOD_CATALOG/IMAGES/CMS/2026/1/14/fc513c93-66d6-4092-98da-449bbc3181e1_83dc4a11-a2dd-496b-b611-8fb7e964b22d.jpg";

// Royal Thali
const royalThaliImage =
  "https://i0.wp.com/kottaramrestaurant.com/wp-content/uploads/2023/06/Kottaram4.jpg?fit=571%2C571&ssl=1";

// Butter Chicken
const butterChickenImage =
  "https://static-content.owner.com/funnel/images/2d085597-b5e7-404b-8fd7-34d96fd2ab9a?auto=format&q=80&v=5962340054&w=3840";

// New Dal Tadka image
const dalTadkaImage =
  "https://static.wixstatic.com/media/34fc00_87b7b02d885f468482309cd26fbd0fc0~mv2.png/v1/fill/w_980%2Ch_980%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/34fc00_87b7b02d885f468482309cd26fbd0fc0~mv2.png";

// Gulab Jamun
const gulabJamunImage =
  "https://thenirvana-in.ucj.omu.mybluehostin.me/uploads/2020/06/31889689_1593199646_gulab-jamun-recipe-2-1.jpg";

const menuItems = [
  {
    id: 1,
    name: "Chicken Biryani",
    marathi: "चिकन बिर्याणी",
    category: "Biryani",
    price: 280,
    description:
      "Fragrant basmati rice with tender chicken and aromatic spices.",
    image: chickenBiryaniImage,
  },
  {
    id: 2,
    name: "Veg Biryani",
    marathi: "व्हेज बिर्याणी",
    category: "Biryani",
    price: 220,
    description:
      "Aromatic basmati rice cooked with fresh vegetables and spices.",
    image: vegBiryaniImage,
  },
  {
    id: 3,
    name: "Paneer Tikka",
    marathi: "पनीर टिक्का",
    category: "Starters",
    price: 260,
    description:
      "Smoky grilled paneer with peppers, spices and mint chutney.",
    image: paneerTikkaImage,
  },
  {
    id: 4,
    name: "Chicken Tikka",
    marathi: "चिकन टिक्का",
    category: "Starters",
    price: 320,
    description:
      "Juicy marinated chicken grilled with traditional tandoori spices.",
    image: chickenTikkaImage,
  },
  {
    id: 5,
    name: "Maharashtrian Thali",
    marathi: "महाराष्ट्रीयन थाळी",
    category: "Thali",
    price: 260,
    description:
      "Traditional Indian meal with rice, bhaji, dal, chapati and sides.",
    image: maharashtrianThaliImage,
  },
  {
    id: 6,
    name: "Royal Thali",
    marathi: "रॉयल थाळी",
    category: "Thali",
    price: 320,
    description:
      "A generous platter of rice, curries, dal, bread and accompaniments.",
    image: royalThaliImage,
  },
  {
    id: 7,
    name: "Butter Chicken",
    marathi: "बटर चिकन",
    category: "Main Course",
    price: 340,
    description:
      "Creamy tomato gravy with tender chicken, butter and fresh cream.",
    image: butterChickenImage,
  },
  {
    id: 8,
    name: "Dal Tadka",
    marathi: "डाळ तडका",
    category: "Main Course",
    price: 180,
    description:
      "Comforting yellow dal finished with cumin, garlic and chilli tadka.",
    image: dalTadkaImage,
  },
  {
    id: 9,
    name: "Gulab Jamun",
    marathi: "गुलाब जामुन",
    category: "Desserts",
    price: 120,
    description:
      "Soft golden gulab jamun soaked in fragrant sugar syrup.",
    image: gulabJamunImage,
  },
];

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
      <circle cx="16" cy="16" r="16" fill="#25D366" />

      <path
        d="M22.2 18.1c-.3-.15-1.8-.9-2.08-1-.28-.1-.48-.15-.68.15-.2.3-.78 1-.95 1.2-.17.2-.35.23-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.62-.93-2.22-.24-.58-.5-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.02-1.05 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.42.25-.69.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="#ffffff"
      />
    </svg>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });

    setCartOpen(true);
  };

  const increaseQuantity = (id) => {
    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const sendWhatsAppOrder = () => {
    if (!cart.length) return;

    const orderText = cart
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = ₹${
            item.price * item.quantity
          }`
      )
      .join("\n");

    const message = encodeURIComponent(
      `Hello Rasoi Royale 👋\n\nI would like to place an order:\n\n${orderText}\n\nTotal: ₹${cartTotal}\n\nPlease confirm my order.\nThank you!`
    );

    window.open(
      `https://wa.me/91${phone}?text=${message}`,
      "_blank"
    );
  };

  return (
    <div className="site">
      <header className="navbar">
        <div className="nav-inner">
          <a
            href="#home"
            className="brand"
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-mark">RR</span>

            <span className="brand-text">
              <strong>Rasoi Royale</strong>
              <small>Authentic Indian Cuisine</small>
            </span>
          </a>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={menuOpen ? "nav-links active" : "nav-links"}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>

            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>

            <a href="#menu" onClick={() => setMenuOpen(false)}>
              Menu
            </a>

            <a href="#gallery" onClick={() => setMenuOpen(false)}>
              Gallery
            </a>

            <a href="#reviews" onClick={() => setMenuOpen(false)}>
              Reviews
            </a>

            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
          </nav>

          <div className="nav-actions">
            <button
              className="cart-button"
              onClick={() => setCartOpen(true)}
            >
              🛒
              <span>Cart</span>

              {cartCount > 0 && (
                <b className="cart-count">{cartCount}</b>
              )}
            </button>

            <a href={phoneUrl} className="nav-cta">
              Call Now
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-badge">
              <span>★</span>
              <strong>4.8</strong>
              <small>Customer Rated</small>
            </div>

            <p className="eyebrow">RASOI ROYALE • PUNE</p>

            <h1>
              Royal taste.
              <br />
              <em>Indian soul.</em>
            </h1>

            <p className="hero-text">
              Authentic Indian flavours, beautifully prepared and served
              with warmth, passion and a touch of royalty.
            </p>

            <div className="hero-buttons">
              <a href="#menu" className="primary-button">
                Explore Menu <span>→</span>
              </a>

              <a href="#contact" className="secondary-button">
                Find Our Table
              </a>
            </div>

            <div className="hero-info">
              <span>✦ Fresh Ingredients</span>
              <span>✦ Family Dining</span>
              <span>✦ Takeaway</span>
            </div>
          </div>

          <div className="scroll-indicator">
            <span>SCROLL</span>
            <i></i>
          </div>
        </section>

        <section className="welcome section-space">
          <div className="section-number">01</div>

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
                We bring together traditional Indian recipes, premium
                ingredients and modern hospitality.
              </p>

              <p>
                From aromatic biryanis to generous thalis and indulgent
                desserts, every plate is made to feel special.
              </p>

              <a href="#menu" className="text-link">
                Discover our menu →
              </a>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <article>
            <span className="feature-icon">✦</span>

            <div>
              <strong>Freshly Prepared</strong>
              <p>Made fresh for every order.</p>
            </div>
          </article>

          <article>
            <span className="feature-icon">♨</span>

            <div>
              <strong>Authentic Flavours</strong>
              <p>Traditional Indian recipes.</p>
            </div>
          </article>

          <article>
            <span className="feature-icon">♡</span>

            <div>
              <strong>Warm Hospitality</strong>
              <p>Service with a personal touch.</p>
            </div>
          </article>

          <article>
            <span className="feature-icon">★</span>

            <div>
              <strong>Happy Guests</strong>
              <p>Made for memorable meals.</p>
            </div>
          </article>
        </section>

        <section className="about section-space" id="about">
          <div className="section-number">02</div>

          <div className="about-grid">
            <div className="about-image">
              <img
                src="https://www.restroworks.com/blog/wp-content/uploads/2025/07/Cost-of-Opening-a-Restaurant-in-India.webp"
                alt="Premium Indian restaurant"
              />

              <div className="image-label">
                <span>THE</span>
                <strong>ROYAL</strong>
                <small>Indian Dining</small>
              </div>
            </div>

            <div className="about-content">
              <p className="section-label">OUR STORY</p>

              <h2>
                Tradition,
                <br />
                <span>reimagined.</span>
              </h2>

              <p>
                At Rasoi Royale, traditional Indian cooking meets an elegant
                dining experience.
              </p>

              <p>
                We believe food should look beautiful, smell incredible and
                leave you wanting one more bite.
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

        <section className="menu-section section-space" id="menu">
          <div className="section-number">03</div>

          <div className="menu-heading">
            <div>
              <p className="section-label">THE ROYAL MENU</p>

              <h2>
                Made to
                <br />
                <span>impress.</span>
              </h2>
            </div>

            <p>
              Explore our signature dishes and add your favourites to the
              order. Your complete order can be sent directly to WhatsApp.
            </p>
          </div>

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? "active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {filteredItems.map((item) => (
              <article className="food-card" key={item.id}>
                <div className="food-image">
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
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>
                </div>

                <div className="food-card-content">
                  <div className="food-title-row">
                    <div>
                      <h3>{item.name}</h3>
                      <span>{item.marathi}</span>
                    </div>

                    <strong>₹{item.price}</strong>
                  </div>

                  <p>{item.description}</p>

                  <button
                    className="add-button"
                    onClick={() => addToCart(item)}
                  >
                    Add to Order
                    <span>+</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="menu-bottom-note">
            <span>✦</span>

            <p>
              Demo menu — prices and dishes can be customised for every
              client.
            </p>
          </div>
        </section>

        <section className="special-banner">
          <div className="special-overlay"></div>

          <div className="special-content">
            <p className="section-label">
              THE RASOI ROYALE EXPERIENCE
            </p>

            <h2>
              Come for the food.
              <br />
              <em>Stay for the feeling.</em>
            </h2>

            <a href="#contact" className="primary-button">
              Visit Rasoi Royale →
            </a>
          </div>
        </section>

        <section className="gallery section-space" id="gallery">
          <div className="section-number">04</div>

          <div className="gallery-heading">
            <p className="section-label">FOOD STORIES</p>

            <h2>
              A taste of
              <br />
              <span>what awaits.</span>
            </h2>
          </div>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <div
                className={`gallery-card gallery-card-${index + 1}`}
                key={item.title}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />

                <div className="gallery-caption">
                  <span>{item.title}</span>
                  <b>↗</b>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reviews section-space" id="reviews">
          <div className="section-number">05</div>

          <div className="reviews-layout">
            <div className="review-summary">
              <p className="section-label">CUSTOMER LOVE</p>

              <strong>4.8</strong>

              <div className="big-stars">★★★★★</div>

              <p>Customer rating</p>

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
                <span>guests.</span>
              </h2>

              <div className="review-grid">
                {reviews.map((review) => (
                  <article
                    className="review-card"
                    key={review.name}
                  >
                    <div className="review-stars">
                      ★★★★★
                    </div>

                    <p>“{review.text}”</p>

                    <div className="review-user">
                      <div>{review.name.charAt(0)}</div>

                      <span>
                        <strong>{review.name}</strong>
                        <small>Happy Guest</small>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="order-section">
          <div>
            <p className="section-label">READY TO ORDER?</p>

            <h2>
              Your table is
              <br />
              waiting.
            </h2>

            <p>
              Call us, visit us or send your favourite dishes directly on
              WhatsApp.
            </p>
          </div>

          <div className="order-actions">
            <a href={phoneUrl} className="order-action">
              <span>☎</span>
              <strong>Call Us</strong>
            </a>

            <button
              className="order-action whatsapp-action"
              onClick={() => setCartOpen(true)}
            >
              <WhatsAppIcon />
              <strong>WhatsApp Order</strong>
            </button>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="order-action"
            >
              <span>⌖</span>
              <strong>Directions</strong>
            </a>
          </div>
        </section>

        <section className="contact section-space" id="contact">
          <div className="section-number">06</div>

          <div className="contact-grid">
            <div className="contact-content">
              <p className="section-label">VISIT US</p>

              <h2>
                Good food.
                <br />
                <span>Good memories.</span>
              </h2>

              <div className="contact-details">
                <div>
                  <small>ADDRESS</small>

                  <p>
                    Pune, Maharashtra
                    <br />
                    India — 4110XX
                  </p>
                </div>

                <div>
                  <small>PHONE</small>

                  <a href={phoneUrl}>
                    +91 98765 43210
                  </a>
                </div>

                <div>
                  <small>OPENING HOURS</small>

                  <p>
                    Monday – Sunday • 11:00 AM – 10:30 PM
                  </p>
                </div>
              </div>

              <div className="contact-buttons">
                <a href={phoneUrl} className="primary-button">
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
                title="Rasoi Royale Location"
                src="https://www.google.com/maps?q=Pune%2C%20Maharashtra&output=embed"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              <div className="map-label">
                <span>⌖</span>

                <div>
                  <strong>Rasoi Royale</strong>
                  <small>Pune, Maharashtra</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-mark">RR</span>

          <div>
            <strong>Rasoi Royale</strong>
            <small>Authentic Indian Cuisine</small>
          </div>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>

        <p>© 2026 Rasoi Royale</p>
      </footer>

      <a
        className="whatsapp-float"
        href={`https://wa.me/91${phone}`}
        target="_blank"
        rel="noreferrer"
      >
        <WhatsAppIcon />
        <span>Chat on WhatsApp</span>
      </a>

      <div className="mobile-bottom-bar">
        <a href={phoneUrl}>☎ Call</a>

        <button onClick={() => setCartOpen(true)}>
          🛒 Cart {cartCount > 0 && `(${cartCount})`}
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

      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="section-label">YOUR ORDER</span>

                <h2>Your Cart</h2>
              </div>

              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <div>🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                  Add something delicious from our menu.
                </p>

                <button
                  onClick={() => {
                    setCartOpen(false);

                    document.getElementById("menu")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  Explore Menu →
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="cart-item-info">
                        <strong>{item.name}</strong>

                        <span>₹{item.price}</span>

                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                          >
                            −
                          </button>

                          <strong>{item.quantity}</strong>

                          <button
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-right">
                        <strong>
                          ₹{item.price * item.quantity}
                        </strong>

                        <button
                          className="remove-item"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Total Items</span>

                    <strong>{cartCount}</strong>
                  </div>

                  <div className="cart-total">
                    <span>Estimated Total</span>

                    <strong>₹{cartTotal}</strong>
                  </div>

                  <p>
                    Demo prices can be customised according to the restaurant
                    menu.
                  </p>

                  <button
                    className="whatsapp-order-button"
                    onClick={sendWhatsAppOrder}
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
    </div>
  );
}

export default App;