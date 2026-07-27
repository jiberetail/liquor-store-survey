"use client";

import { useEffect, useMemo, useState } from "react";
import catalogData from "./data/catalog.json";

const KIOSK_WIDTH = 1080;
const KIOSK_HEIGHT = 1920;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (url: string) => url.startsWith("/") ? `${basePath}${url}` : url;

type CategoryKey = "whiskey" | "tequila" | "vodka" | "gin" | "cognac" | "wine";
type Screen = "splash" | "found" | "category" | "type" | "products" | "rating" | "associate" | "associateRating" | "thanks";
type Choice = { name: string; product: string; image: string };
type Category = Choice & { key: CategoryKey; types: Choice[] };
type CatalogProduct = { id: string; name: string; handle: string; type: string; tags: string[]; image: string; url: string };
const fullCatalog = catalogData as Record<CategoryKey, CatalogProduct[]>;

const categories: Category[] = [
  {
    key: "whiskey",
    name: "Whiskey",
    product: "Colonel E.H. Taylor Small Batch",
    image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_60f26343-17e8-417f-a450-c01c554f6f12.jpg?v=1673484451",
    types: [
      { name: "Bourbon", product: "Colonel E.H. Taylor Small Batch", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_60f26343-17e8-417f-a450-c01c554f6f12.jpg?v=1673484451" },
      { name: "Scotch", product: "Macallan Aera Royal Black", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_9756218c-48ea-498c-a0ee-a39c0d432c87.jpg?v=1672101353" },
      { name: "Irish Whiskey", product: "Redbreast 12 Year", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_581c83d0-4eea-415e-a9b6-5a6eeb3fb55e.jpg?v=1640587192" },
      { name: "Japanese Whiskey", product: "Yamazaki 12 Year", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_1644c611-a25c-4b1e-bce8-61fe4bbf613d.jpg?v=1660608977" },
      { name: "Rye", product: "High West Midwinter Night’s Dram", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_64f3094d-f472-40ae-8a52-19de20a1e31c.jpg?v=1638000696" },
      { name: "Canadian Whisky", product: "Caribou Crossing Single Barrel", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_99fec0d0-abfc-4198-9b1d-50236cb64d51.jpg?v=1780249967" },
    ],
  },
  {
    key: "tequila",
    name: "Tequila",
    product: "Clase Azul Reposado",
    image: "/products/clase-azul.jpg",
    types: [
      { name: "Blanco & Silver", product: "Clase Azul Plata", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/IMG_3839.jpg?v=1623911764" },
      { name: "Reposado", product: "Clase Azul Reposado", image: "/products/clase-azul.jpg" },
      { name: "Añejo", product: "Clase Azul Añejo", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_76448043-ccd7-4d41-882d-0e75b17922d1.jpg?v=1769135970" },
      { name: "Mezcal", product: "Del Maguey Chichicapa", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/Del-Maguey-Chichicapa-Mezcal.jpg?v=1621824892" },
      { name: "Joven", product: "Casa Dragones Joven", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_98cba680-27db-4255-9e98-5a4ea339cba2.jpg?v=1657467878" },
      { name: "Flavored Tequila", product: "MangoShotta Jalapeño", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_2e39b507-acc5-4f2c-96dd-52724a6707ac.jpg?v=1759188969" },
    ],
  },
  {
    key: "vodka",
    name: "Vodka",
    product: "Tito’s Handmade Vodka",
    image: "/products/titos.jpg",
    types: [
      { name: "American Vodka", product: "Tito’s Vodka 1.75 Liter", image: "/products/titos.jpg" },
      { name: "French Vodka", product: "Grey Goose Vodka", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_a2475255-11f4-4b22-af75-4bfa48f7ddc9.jpg?v=1647327377" },
      { name: "Flavored Vodka", product: "Cîroc Passion Vodka", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_45d2fcb5-efba-4971-9ee2-4da414919e38.jpg?v=1695423872" },
      { name: "Classic Vodka", product: "Tito’s Vodka 1 Liter", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_4dff3544-1449-4390-b29b-3a748da251ae.jpg?v=1696378638" },
      { name: "Miniatures", product: "Tito’s Vodka 50ml Pack", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_23eb4d93-bd17-480b-83b4-232e9b092c1c.jpg?v=1696379224" },
      { name: "Large Format", product: "Tito’s Vodka 1.75 Liter", image: "/products/titos.jpg" },
    ],
  },
  {
    key: "gin",
    name: "Gin",
    product: "Monkey 47 Schwarzwald Dry Gin",
    image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_7976bbfc-0ae0-4895-85aa-04227056e9b3.jpg?v=1677811225",
    types: [
      { name: "Dry Gin", product: "Monkey 47 Schwarzwald Dry Gin", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_7976bbfc-0ae0-4895-85aa-04227056e9b3.jpg?v=1677811225" },
      { name: "London Dry", product: "Bombay Sapphire Gin", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_d953f2bb-64ab-4f54-be97-edde8570d787.jpg?v=1647328176" },
      { name: "Mediterranean Gin", product: "Gin Mare Mediterranean Gin", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_d6cb3465-e549-4304-9d7d-1f5f859eeb82.jpg?v=1696033460" },
      { name: "Floral Gin", product: "Hendrick’s Flora Adora", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_52e5b441-ef3c-41ba-bf70-e9aa63316cd9.jpg?v=1678491393" },
      { name: "Botanical Gin", product: "Hendrick’s Gin", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/Hendrick_E2_80_99s-Gin.png?v=1621824328" },
      { name: "Large Format", product: "Monkey 47 Dry Gin 1L", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_8e6f385c-3174-4570-8dd7-475bc6da50bd.jpg?v=1640588276" },
    ],
  },
  {
    key: "cognac",
    name: "Cognac",
    product: "Hennessy White Cognac",
    image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_7d4b370b-7f5c-431e-914c-038345b846f5.jpg?v=1704345865",
    types: [
      { name: "White Cognac", product: "Hennessy White Cognac", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_7d4b370b-7f5c-431e-914c-038345b846f5.jpg?v=1704345865" },
      { name: "V.S.", product: "Hennessy V.S. Cognac", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_0d696f56-0980-4e6f-876f-f05f2491b130.jpg?v=1676426115" },
      { name: "V.S.O.P.", product: "Hennessy V.S.O.P.", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_4cf38c2b-d309-4c40-b447-ff52c566186f.jpg?v=1779166110" },
      { name: "Accord Royal", product: "Rémy Martin 1738", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/REMY-MARTIN-1738-ACCORD-ROYAL.jpg?v=1621823747" },
      { name: "X.O.", product: "Premium X.O. Cognac", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_0d696f56-0980-4e6f-876f-f05f2491b130.jpg?v=1676426115" },
      { name: "Brandy", product: "French Brandy Selection", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/REMY-MARTIN-1738-ACCORD-ROYAL.jpg?v=1621823747" },
    ],
  },
  {
    key: "wine",
    name: "Wine",
    product: "Caymus Napa Valley Cabernet",
    image: "/products/caymus.jpg",
    types: [
      { name: "Cabernet Sauvignon", product: "Caymus Napa Valley Cabernet", image: "/products/caymus.jpg" },
      { name: "Chardonnay", product: "Meiomi Chardonnay", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/files/FullSizeRender_20fda68f-ba83-4a0f-822d-d0909ecbeae7.jpg?v=1696289904" },
      { name: "Merlot", product: "Barefoot Merlot", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/BUY-BAREFOOT-MERLOT.jpg?v=1621824207" },
      { name: "Red Blend", product: "The Prisoner Red Blend", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/image_90451ab8-1f82-4e3c-96ae-4626ff1be442.jpg?v=1665714639" },
      { name: "Malbec", product: "Dulzura Estate Malbec", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/Dulzura-Vineyard-2016-Estate-Malbec.jpg?v=1621824829" },
      { name: "Rosé", product: "Veuve Clicquot Rosé", image: "https://cdn.shopify.com/s/files/1/0564/8737/9108/products/IMG_4012.jpg?v=1624580371" },
    ],
  },
];

function Brand() {
  return (
    <div className="brand">
      <span>EST. 2026</span>
      <strong>YOUR STORE</strong>
      <i />
      <em>Fine Wines &amp; Spirits</em>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [found, setFound] = useState<boolean | null>(null);
  const [categoryKey, setCategoryKey] = useState<CategoryKey | null>(null);
  const [typeName, setTypeName] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(18);
  const [rating, setRating] = useState<number | null>(null);
  const [associateHelped, setAssociateHelped] = useState<boolean | null>(null);
  const [associateRating, setAssociateRating] = useState<number | null>(null);

  useEffect(() => {
    const resize = () => {
      const next = Math.min(window.innerWidth / KIOSK_WIDTH, window.innerHeight / KIOSK_HEIGHT);
      setScale(next);
      setOffset({ x: (window.innerWidth - KIOSK_WIDTH * next) / 2, y: (window.innerHeight - KIOSK_HEIGHT * next) / 2 });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const selectedCategory = useMemo(() => categories.find((item) => item.key === categoryKey), [categoryKey]);
  const categoryProducts = useMemo(() => {
    if (!categoryKey) return [];
    const query = search.trim().toLowerCase();
    const typeWords = (typeName ?? "").toLowerCase().split(/\s+/).filter((word) => word.length > 3);
    return fullCatalog[categoryKey]
      .filter((product) => !query || `${product.name} ${product.type} ${product.tags.join(" ")}`.toLowerCase().includes(query))
      .sort((a, b) => {
        const aText = `${a.name} ${a.type} ${a.tags.join(" ")}`.toLowerCase();
        const bText = `${b.name} ${b.type} ${b.tags.join(" ")}`.toLowerCase();
        const aMatch = typeWords.some((word) => aText.includes(word)) ? 1 : 0;
        const bMatch = typeWords.some((word) => bText.includes(word)) ? 1 : 0;
        return bMatch - aMatch;
      });
  }, [categoryKey, search, typeName]);
  const selectedProduct = useMemo(() => categoryProducts.find((product) => product.id === productId) ?? (
    categoryKey ? fullCatalog[categoryKey].find((product) => product.id === productId) : undefined
  ), [categoryKey, categoryProducts, productId]);
  const reset = () => {
    setFound(null);
    setCategoryKey(null);
    setTypeName(null);
    setProductId(null);
    setSearch("");
    setVisibleCount(18);
    setRating(null);
    setAssociateHelped(null);
    setAssociateRating(null);
    setScreen("splash");
  };

  const goBack = () => {
    const previous: Record<Exclude<Screen, "splash">, Screen> = {
      found: "splash",
      category: "found",
      type: "category",
      products: "type",
      rating: found ? "found" : "products",
      associate: "rating",
      associateRating: "associate",
      thanks: associateHelped ? "associateRating" : "associate",
    };
    if (screen !== "splash") setScreen(previous[screen]);
  };

  return (
    <main className="viewport">
      <div className="kiosk" style={{ width: KIOSK_WIDTH, height: KIOSK_HEIGHT, transform: `scale(${scale})`, transformOrigin: "top left", top: offset.y, left: offset.x }}>
        {screen === "splash" ? (
          <section className="splash">
            <video src={assetUrl("/splash.mp4")} autoPlay muted loop playsInline aria-label="Premium spirits introduction" />
            <div className="splash-shade" />
            <div className="splash-top"><Brand /><span className="age-mark">21+</span></div>
            <div className="splash-copy">
              <p>YOUR EXPERIENCE · YOUR SAY</p>
              <h1>HELP US<br />RAISE THE BAR.</h1>
              <span>Tell us about today’s visit in under a minute.</span>
              <div className="survey-offer"><strong>5% OFF</strong><span>YOUR NEXT PURCHASE</span></div>
              <button className="gold-button" onClick={() => setScreen("found")}>I’M 21+ · BEGIN SURVEY <b>→</b></button>
              <small>Complete the survey to receive your offer. Restrictions may apply. By entering, you confirm you are of legal drinking age.</small>
            </div>
          </section>
        ) : (
          <>
            <header>
              <Brand />
              <div className="header-actions" aria-label="Survey navigation">
                <button onClick={goBack}><span>←</span> Back</button>
                <button onClick={reset}><span>⌂</span> Home</button>
              </div>
            </header>

            {screen === "found" && (
              <section className="question">
                <div className="question-copy">
                  <p>LET’S START HERE</p>
                  <h1>Did you find the item you were looking for today?</h1>
                  <span>Your answer helps us understand where our selection can improve.</span>
                </div>
                <div className="answer-pair">
                  <button className={found === true ? "answer active" : "answer"} onClick={() => setFound(true)}>
                    <b>YES</b><strong>I found it</strong><span>Everything I came for was available.</span><i>→</i>
                  </button>
                  <button className={found === false ? "answer active" : "answer"} onClick={() => setFound(false)}>
                    <b>NO</b><strong>I couldn’t find it</strong><span>Something I wanted was unavailable.</span><i>→</i>
                  </button>
                </div>
                <Nav back={() => setScreen("splash")} next={() => setScreen(found ? "rating" : "category")} disabled={found === null} />
              </section>
            )}

            {screen === "category" && (
              <section className="question catalog-question">
                <div className="question-copy compact">
                  <p>HELP US NARROW IT DOWN</p>
                  <h1>What category were you looking for?</h1>
                  <span>Choose the closest match.</span>
                </div>
                <div className="catalog-grid">
                  {categories.map((category) => (
                    <button key={category.key} className={categoryKey === category.key ? "catalog-card active" : "catalog-card"} onClick={() => { setCategoryKey(category.key); setTypeName(null); setProductId(null); setSearch(""); setVisibleCount(18); }}>
                      <img src={assetUrl(category.image)} alt={category.product} />
                      <span className="card-shade" />
                      <small>FEATURED · {category.product}</small>
                      <strong>{category.name}</strong>
                      <i>{categoryKey === category.key ? "✓" : "→"}</i>
                    </button>
                  ))}
                </div>
                <Nav back={() => setScreen("found")} next={() => setScreen("type")} disabled={!categoryKey} />
              </section>
            )}

            {screen === "type" && selectedCategory && (
              <section className="question catalog-question">
                <div className="question-copy compact">
                  <p>{selectedCategory.name.toUpperCase()} · ONE MORE DETAIL</p>
                  <h1>What kind of {selectedCategory.name.toLowerCase()}?</h1>
                  <span>Select the type or example closest to what you wanted.</span>
                </div>
                <div className="catalog-grid">
                  {selectedCategory.types.map((item) => (
                    <button key={item.name} className={typeName === item.name ? "catalog-card active" : "catalog-card"} onClick={() => setTypeName(item.name)}>
                      <img src={assetUrl(item.image)} alt={item.product} />
                      <span className="card-shade" />
                      <small>EXAMPLE · {item.product}</small>
                      <strong>{item.name}</strong>
                      <i>{typeName === item.name ? "✓" : "→"}</i>
                    </button>
                  ))}
                </div>
                <Nav back={() => setScreen("category")} next={() => setScreen("products")} disabled={!typeName} label="View products" />
              </section>
            )}

            {screen === "products" && selectedCategory && (
              <section className="question product-question">
                <div className="question-copy compact product-heading">
                  <p>{selectedCategory.name.toUpperCase()} · COMPLETE CATALOG</p>
                  <h1>Which product were you looking for?</h1>
                  <span>{categoryProducts.length.toLocaleString()} products available · {typeName} matches shown first</span>
                </div>
                <label className="catalog-search">
                  <span>SEARCH CATALOG</span>
                  <input
                    value={search}
                    onChange={(event) => { setSearch(event.target.value); setVisibleCount(18); }}
                    placeholder={`Search all ${selectedCategory.name.toLowerCase()} products…`}
                  />
                </label>
                <div className="product-list">
                  <div className="product-list-grid">
                    {categoryProducts.slice(0, visibleCount).map((product) => (
                      <button key={product.id} className={productId === product.id ? "product-tile active" : "product-tile"} onClick={() => setProductId(product.id)}>
                        <span className="product-photo"><img src={assetUrl(product.image)} alt={product.name} loading="lazy" /></span>
                        <small>{product.type || selectedCategory.name}</small>
                        <strong>{product.name}</strong>
                        <i>{productId === product.id ? "✓" : "+"}</i>
                      </button>
                    ))}
                  </div>
                  {visibleCount < categoryProducts.length && (
                    <button className="load-more" onClick={() => setVisibleCount((count) => count + 18)}>
                      SHOW 18 MORE · {categoryProducts.length - visibleCount} REMAINING
                    </button>
                  )}
                </div>
                <Nav back={() => setScreen("type")} next={() => setScreen("rating")} disabled={!productId} label="Select product" />
              </section>
            )}

            {screen === "rating" && (
              <section className="question rating-question">
                <div className="question-copy">
                  <p>OVERALL EXPERIENCE</p>
                  <h1>How was your overall shopping experience?</h1>
                  <span>Tap the rating that best reflects today’s visit.</span>
                </div>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} className={rating === value ? "rating active" : "rating"} onClick={() => setRating(value)}>
                      <b>0{value}</b><span>{["Poor", "Fair", "Good", "Very good", "Excellent"][value - 1]}</span>
                    </button>
                  ))}
                </div>
                <Nav back={() => setScreen(found ? "found" : "products")} next={() => setScreen("associate")} disabled={!rating} />
              </section>
            )}

            {screen === "associate" && (
              <section className="question associate-question">
                <div className="question-copy">
                  <p>STORE SERVICE</p>
                  <h1>Did a store associate assist you today?</h1>
                  <span>This helps us understand how our team supported your visit.</span>
                </div>
                <div className="answer-pair">
                  <button className={associateHelped === true ? "answer active" : "answer"} onClick={() => { setAssociateHelped(true); setAssociateRating(null); }}>
                    <b>YES</b><strong>An associate helped me</strong><span>I received help during my visit.</span><i>→</i>
                  </button>
                  <button className={associateHelped === false ? "answer active" : "answer"} onClick={() => { setAssociateHelped(false); setAssociateRating(null); }}>
                    <b>NO</b><strong>I shopped independently</strong><span>I did not receive associate assistance.</span><i>→</i>
                  </button>
                </div>
                <Nav
                  back={() => setScreen("rating")}
                  next={() => setScreen(associateHelped ? "associateRating" : "thanks")}
                  disabled={associateHelped === null}
                  label={associateHelped ? "Rate associate" : "Submit feedback"}
                />
              </section>
            )}

            {screen === "associateRating" && (
              <section className="question rating-question associate-rating-question">
                <div className="question-copy">
                  <p>ASSOCIATE EXPERIENCE</p>
                  <h1>How would you rate the associate who helped you?</h1>
                  <span>Consider their attentiveness, knowledge, and overall helpfulness.</span>
                </div>
                <div className="rating-grid">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} className={associateRating === value ? "rating active" : "rating"} onClick={() => setAssociateRating(value)}>
                      <b>0{value}</b><span>{["Poor", "Fair", "Good", "Very good", "Excellent"][value - 1]}</span>
                    </button>
                  ))}
                </div>
                <Nav back={() => setScreen("associate")} next={() => setScreen("thanks")} disabled={!associateRating} label="Submit feedback" />
              </section>
            )}

            {screen === "thanks" && (
              <section className="thanks">
                <span className="seal">✓</span>
                <p>FEEDBACK RECEIVED</p>
                <h1>Thank you for helping us stock smarter.</h1>
                <div className={found ? "summary" : "summary summary-four"}>
                  <span>ITEM FOUND<strong>{found ? "Yes" : "No"}</strong></span>
                  {!found && <span>REQUESTED<strong>{selectedProduct?.name ?? `${typeName} · ${selectedCategory?.name}`}</strong></span>}
                  <span>EXPERIENCE<strong>{rating} / 5</strong></span>
                  <span>ASSOCIATE<strong>{associateHelped ? `${associateRating} / 5` : "No assistance"}</strong></span>
                </div>
                <button className="outline-button" onClick={reset}>START ANOTHER SURVEY</button>
              </section>
            )}

            <footer><span>YOUR STORE · LOCATION PLACEHOLDER</span><span>PLEASE ENJOY RESPONSIBLY · 21+</span></footer>
          </>
        )}
      </div>
    </main>
  );
}

function Nav({ back, next, disabled, label = "Continue" }: { back: () => void; next: () => void; disabled: boolean; label?: string }) {
  return (
    <nav>
      <button className="back-button" onClick={back}>← BACK</button>
      <button className="gold-button" disabled={disabled} onClick={next}>{label.toUpperCase()} <b>→</b></button>
    </nav>
  );
}
