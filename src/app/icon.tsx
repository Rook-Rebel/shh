import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// A minimalist mark inspired by the 🤏 gesture: two soft petals angled
// toward each other with a small gap left open between their tips.
export default function Icon() {
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
          borderRadius: 8,
        }}
      >
        <div style={{ position: "relative", width: 24, height: 24, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              width: 15,
              height: 5,
              borderRadius: 999,
              right: 3,
              top: 6,
              background: "linear-gradient(135deg, #F3B8C8, #C6B4FF)",
              transform: "rotate(-27deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 15,
              height: 5,
              borderRadius: 999,
              right: 3,
              top: 13,
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
