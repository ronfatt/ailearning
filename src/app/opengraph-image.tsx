import { ImageResponse } from "next/og";

export const alt = "AI Learning OS tuition platform preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at 20% 10%, rgba(18,207,243,0.18), transparent 32%), radial-gradient(circle at 85% 20%, rgba(124,92,255,0.14), transparent 30%), linear-gradient(180deg, #F6FAFF 0%, #FFFFFF 100%)",
          color: "#111827",
          fontFamily: "Inter, Arial, sans-serif",
          padding: "48px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "48%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              border: "1px solid #DBE7FF",
              background: "#FFFFFF",
              color: "#3B6CFF",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              borderRadius: 9999,
              padding: "12px 20px",
            }}
          >
            AI-powered tuition platform
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 76,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Smarter Tuition.</span>
              <span>Real Teachers.</span>
              <span>AI That Follows Up.</span>
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.55,
                color: "#5B6472",
                maxWidth: 500,
              }}
            >
              Live classes, AI revision, homework tracking, and parent reports in one bright learning platform.
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Live classes", "AI revision", "Parent reports", "Homework tracker"].map(
              (item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    border: "1px solid #E6ECF5",
                    borderRadius: 9999,
                    background: "#FFFFFF",
                    padding: "10px 16px",
                    fontSize: 20,
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>
        <div
          style={{
            width: "52%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 500,
              height: 420,
              borderRadius: 40,
              border: "1px solid #E6ECF5",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,251,255,0.96) 100%)",
              boxShadow: "0 34px 90px rgba(59,108,255,0.16)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 28,
                top: 28,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.94)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 18px 42px rgba(59,108,255,0.14)",
              }}
            >
              <span style={{ fontSize: 15, color: "#3B6CFF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>AI Study Buddy</span>
              <span style={{ fontSize: 22, color: "#111827", fontWeight: 700, marginTop: 8 }}>Let&apos;s revise algebra in 10 minutes.</span>
            </div>
            <div
              style={{
                position: "absolute",
                right: 28,
                top: 70,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.94)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 18px 42px rgba(59,108,255,0.14)",
              }}
            >
              <span style={{ fontSize: 15, color: "#20C997", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>Parent Report</span>
              <span style={{ fontSize: 22, color: "#111827", fontWeight: 700, marginTop: 8 }}>Homework: Done</span>
              <span style={{ fontSize: 20, color: "#111827", fontWeight: 700, marginTop: 4 }}>Progress: +18%</span>
            </div>
            <div
              style={{
                position: "absolute",
                left: 42,
                bottom: 84,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.94)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 18px 42px rgba(59,108,255,0.14)",
              }}
            >
              <span style={{ fontSize: 15, color: "#12CFF3", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>Teacher Insight</span>
              <span style={{ fontSize: 22, color: "#111827", fontWeight: 700, marginTop: 8 }}>Weak topic detected: Fractions</span>
            </div>
            <div
              style={{
                position: "absolute",
                right: 42,
                bottom: 48,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.85)",
                background: "rgba(255,255,255,0.94)",
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 18px 42px rgba(59,108,255,0.14)",
              }}
            >
              <span style={{ fontSize: 15, color: "#FF6B6B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em" }}>Reward</span>
              <span style={{ fontSize: 22, color: "#111827", fontWeight: 700, marginTop: 8 }}>7-day streak</span>
              <span style={{ fontSize: 20, color: "#111827", fontWeight: 700, marginTop: 4 }}>120 XP earned</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
