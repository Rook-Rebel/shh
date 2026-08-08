// Pure CSS: three atmospheric lights built from soft radial gradients (no
// hard-edged circles to blur away), a faint vignette, and a low-opacity
// grain texture. No canvas, no JS — drift keyframes are gated behind
// prefers-reduced-motion in globals.css.
export default function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#08080b]">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 120% 70% at 50% -10%, #1a1422 0%, #0d0b10 45%, #08080b 100%)",
        }}
      />
      <div
        className="blob-drift-a absolute -top-40 left-[6%] h-[46rem] w-[46rem] blur-[120px]"
        style={{ background: "radial-gradient(closest-side, rgba(243,184,200,0.11), transparent)" }}
      />
      <div
        className="blob-drift-b absolute top-[20%] -right-32 h-[42rem] w-[42rem] blur-[130px]"
        style={{ background: "radial-gradient(closest-side, rgba(198,180,255,0.12), transparent)" }}
      />
      <div
        className="blob-drift-c absolute -bottom-32 left-[28%] h-[36rem] w-[36rem] blur-[130px]"
        style={{ background: "radial-gradient(closest-side, rgba(217,140,165,0.08), transparent)" }}
      />
      <div className="vignette-overlay absolute inset-0" />
      <div className="grain-overlay absolute inset-0" />
    </div>
  );
}
