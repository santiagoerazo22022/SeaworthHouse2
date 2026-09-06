const TICKER_ITEMS = [
  { label: "Ropa Anime", highlight: true },
  { label: "Figuras de Colección", highlight: false },
  { label: "Posters Exclusivos", highlight: true },
  { label: "Envíos a Todo el País", highlight: false },
  { label: "Nuevos Drops Semanales", highlight: true },
  { label: "シーワースハウス", highlight: false },
];

export default function HeroSection() {
  const tickerLoop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="hero-block">
      <div className="hero-glow hero-glow--cyan" aria-hidden="true" />
      <div className="hero-glow hero-glow--magenta" aria-hidden="true" />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner container">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow-dot" aria-hidden="true" />
            シーワースハウス · Anime · Collection
          </p>

          <h1 id="hero-title" className="hero-title">
            <span className="visually-hidden">SEAWORTHOUSE</span>
            <svg
              className="hero-title-svg"
              viewBox="0 0 920 96"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="titleNeonGrad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="920"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="45%" stopColor="#00f0ff" />
                  <stop offset="55%" stopColor="#ff007f" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
                <linearGradient
                  id="titleNeonGradAlt"
                  gradientUnits="userSpaceOnUse"
                  x1="920"
                  y1="0"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#ff007f" />
                  <stop offset="50%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#ff007f" />
                </linearGradient>
                <filter id="titleNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                  <feColorMatrix
                    in="blur"
                    type="matrix"
                    values="0 0 0 0 0  0 1 1 0 0  0 1 1 0 0  0 0 0 1.2 0"
                    result="glow"
                  />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <text x="460" y="66" textAnchor="middle" className="hero-title-svg-base" pathLength="1000">
                SEAWORTHOUSE
              </text>
              <text x="460" y="66" textAnchor="middle" className="hero-title-svg-ring" pathLength="1000">
                SEAWORTHOUSE
              </text>
              <text x="460" y="66" textAnchor="middle" className="hero-title-svg-trace" pathLength="1000">
                SEAWORTHOUSE
              </text>
              <text
                x="460"
                y="66"
                textAnchor="middle"
                className="hero-title-svg-trace hero-title-svg-trace--magenta"
                pathLength="1000"
              >
                SEAWORTHOUSE
              </text>
            </svg>
          </h1>

          <span className="hero-title-jp">SEAWORTH · HOUSE — シーワースハウス</span>
        </div>
      </section>

      <aside className="ticker" aria-label="Destacados">
        <div className="ticker-track">
          {tickerLoop.map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot" aria-hidden="true" />
              <span className={item.highlight ? "ticker-highlight" : undefined}>
                {item.label}
              </span>
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
}
