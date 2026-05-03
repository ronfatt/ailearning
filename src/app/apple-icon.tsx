import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #3B6CFF 0%, #4F7CFF 42%, #7C5CFF 78%, #12CFF3 100%)",
          borderRadius: 42,
          color: "white",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: "-0.08em",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        AI
      </div>
    ),
    size,
  );
}
