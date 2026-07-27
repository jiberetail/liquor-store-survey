"use client";

import { useEffect, useMemo, useState } from "react";

const KIOSK_WIDTH = 1080;
const KIOSK_HEIGHT = 1920;

const products = [
  { id: "whiskey", category: "Whiskey", name: "Blanton’s Single Barrel", image: "/products/blantons.jpg" },
  { id: "tequila", category: "Tequila", name: "Clase Azul Reposado", image: "/products/clase-azul.jpg" },
  { id: "vodka", category: "Vodka", name: "Tito’s Handmade Vodka", image: "/products/titos.jpg" },
  { id: "rum", category: "Rum", name: "Mount Gay XO", image: "/products/mount-gay.jpg" },
  { id: "wine", category: "Wine", name: "Caymus Cabernet", image: "/products/caymus.jpg" },
  { id: "champagne", category: "Champagne", name: "Veuve Clicquot Brut", image: "/products/veuve.jpg" },
];

type Screen = "age" | "welcome" | "found" | "missing" | "rating" | "thanks";

function Mark() {
  return (
    <div className="mark" aria-label="Store name placeholder">
      <span className="mark-kicker">EST. 2026</span>
      <strong>YOUR STORE</strong>
      <span className="mark-rule"><i /></span>
      <em>Fine Wines &amp; Spirits</em>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="progress" aria-label={`Question ${step} of 3`}>
      {[1, 2, 3].map((item) => <span key={item} className={item <= step ? "active" : ""} />)}
      <small>{String(step).padStart(2, "0")} / 03</small>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("age");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [foundEverything, setFoundEverything] = useState<boolean | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const resize = () => {
      const nextScale = Math.min(window.innerWidth / KIOSK_WIDTH, window.innerHeight / KIOSK_HEIGHT);
      setScale(nextScale);
      setOffset({
        x: (window.innerWidth - KIOSK_WIDTH * nextScale) / 2,
        y: (window.innerHeight - KIOSK_HEIGHT * nextScale) / 2,
      });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const currentStep = useMemo(() => (
    screen === "found" ? 1 : screen === "missing" ? 2 : screen === "rating" ? 3 : 0
  ), [screen]);

  const reset = () => {
    setFoundEverything(null);
    setMissing([]);
    setOther("");
    setRating(null);
    setScreen("welcome");
  };

  const toggleMissing = (id: string) => {
    setMissing((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <main className="viewport">
      <div
        className="kiosk"
        style={{
          width: KIOSK_WIDTH,
          height: KIOSK_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          top: offset.y,
          left: offset.x,
        }}
      >
        <div className="grain" />
        <header className="topbar">
          <Mark />
          {currentStep > 0 && <Progress step={currentStep} />}
        </header>

        {screen === "age" && (
          <section className="screen age-screen">
            <div className="age-bottle">
              <img src="/products/blantons.jpg" alt="" />
            </div>
            <div className="age-content">
              <p className="eyebrow">Before we begin</p>
              <h1>Are you of legal drinking age?</h1>
              <p className="lede">You must be 21 or older to enter this experience.</p>
              <div className="age-actions">
                <button className="primary" onClick={() => setScreen("welcome")}>Yes, I’m 21+</button>
                <button className="secondary" onClick={() => setScreen("age")}>No, exit</button>
              </div>
              <p className="fine-print">Please enjoy responsibly. This prototype does not sell alcohol or collect personal information.</p>
            </div>
          </section>
        )}

        {screen === "welcome" && (
          <section className="screen welcome-screen">
            <div className="hero-copy">
              <p className="eyebrow">A better pour starts with you</p>
              <h1>Help us refine your store experience.</h1>
              <p className="lede">Three quick questions. Less than one minute.</p>
              <button className="primary start" onClick={() => setScreen("found")}>Begin survey <span>→</span></button>
            </div>
            <div className="bottle-stage" aria-hidden="true">
              <span className="halo" />
              <img className="hero-bottle bottle-one" src="/products/clase-azul.jpg" alt="" />
              <img className="hero-bottle bottle-two" src="/products/blantons.jpg" alt="" />
              <img className="hero-bottle bottle-three" src="/products/veuve.jpg" alt="" />
              <p>CURATED FOR<br />THE CURIOUS</p>
            </div>
          </section>
        )}

        {screen === "found" && (
          <section className="screen question-screen">
            <div className="question-heading">
              <p className="eyebrow">Question one</p>
              <h1>Did you find everything you were looking for today?</h1>
            </div>
            <div className="binary-grid">
              <button
                className={foundEverything === true ? "choice selected" : "choice"}
                onClick={() => setFoundEverything(true)}
              >
                <span className="choice-number">01</span>
                <strong>Yes, I found it</strong>
                <small>Everything I needed was available.</small>
              </button>
              <button
                className={foundEverything === false ? "choice selected" : "choice"}
                onClick={() => setFoundEverything(false)}
              >
                <span className="choice-number">02</span>
                <strong>Not quite</strong>
                <small>I couldn’t find one or more items.</small>
              </button>
            </div>
            <nav className="survey-nav">
              <button className="text-button" onClick={() => setScreen("welcome")}>← Back</button>
              <button className="primary" disabled={foundEverything === null} onClick={() => setScreen("missing")}>Continue →</button>
            </nav>
          </section>
        )}

        {screen === "missing" && (
          <section className="screen product-screen">
            <div className="question-heading compact">
              <p className="eyebrow">Question two</p>
              <h1>{foundEverything ? "What brought you in today?" : "What were you unable to find?"}</h1>
              <p className="lede">Select all that apply.</p>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <button
                  key={product.id}
                  className={missing.includes(product.id) ? "product-card selected" : "product-card"}
                  onClick={() => toggleMissing(product.id)}
                  aria-pressed={missing.includes(product.id)}
                >
                  <span className="check">{missing.includes(product.id) ? "✓" : "+"}</span>
                  <span className="product-image"><img src={product.image} alt={product.name} /></span>
                  <small>{product.category}</small>
                  <strong>{product.name}</strong>
                </button>
              ))}
            </div>
            <label className="other-field">
              <span>Something else?</span>
              <input value={other} onChange={(event) => setOther(event.target.value)} placeholder="Tell us what you were looking for…" maxLength={80} />
            </label>
            <nav className="survey-nav">
              <button className="text-button" onClick={() => setScreen("found")}>← Back</button>
              <button className="primary" disabled={missing.length === 0 && other.trim() === ""} onClick={() => setScreen("rating")}>Continue →</button>
            </nav>
          </section>
        )}

        {screen === "rating" && (
          <section className="screen question-screen rating-screen">
            <div className="question-heading">
              <p className="eyebrow">Question three</p>
              <h1>How would you rate your overall shopping experience?</h1>
              <p className="lede">Tap the number that best reflects today’s visit.</p>
            </div>
            <div className="rating-grid">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={rating === value ? "rating selected" : "rating"}
                  onClick={() => setRating(value)}
                  aria-label={`${value} out of 5`}
                >
                  <span>{value}</span>
                  <small>{value === 1 ? "Poor" : value === 5 ? "Excellent" : ""}</small>
                </button>
              ))}
            </div>
            <div className="rating-caption"><span>Needs attention</span><i /><span>Exceptional</span></div>
            <nav className="survey-nav">
              <button className="text-button" onClick={() => setScreen("missing")}>← Back</button>
              <button className="primary" disabled={rating === null} onClick={() => setScreen("thanks")}>Submit feedback →</button>
            </nav>
          </section>
        )}

        {screen === "thanks" && (
          <section className="screen thanks-screen">
            <div className="seal"><span>✓</span></div>
            <p className="eyebrow">Feedback received</p>
            <h1>Thank you for helping us raise the bar.</h1>
            <p className="lede">Your input helps us stock smarter and create a better experience for every guest.</p>
            <div className="thanks-rule"><i /></div>
            <p className="signoff">Here’s to your next great find.</p>
            <button className="secondary reset" onClick={reset}>Start another survey</button>
          </section>
        )}

        <footer>
          <span>YOUR STORE · LOCATION PLACEHOLDER</span>
          <span>PLEASE ENJOY RESPONSIBLY · 21+</span>
        </footer>
      </div>
    </main>
  );
}
