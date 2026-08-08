import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same pinch-inspired mark as icon.tsx, scaled up for iOS home screens.
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
          background: "linear-gradient(135deg, #171320 0%, #0a0a0c 100%)",
        }}
      >
        <div style={{ position: "relative", width: 132, height: 132, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              width: 84,
              height: 28,
              borderRadius: 999,
              right: 16,
              top: 32,
              background: "linear-gradient(135deg, #F3B8C8, #C6B4FF)",
              transform: "rotate(-27deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 84,
              height: 28,
              borderRadius: 999,
              right: 16,
              top: 72,
              background: "linear-gradient(135deg, #F3B8C8, #C6B4FF)",
              transform: "rotate(27deg)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
