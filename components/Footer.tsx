export function Footer(props: {}) {
  return (
    <div class="w100 fl-col ai-center footer-root">
      <p style={{ color: "#777", fontSize: "1.2em", marginBottom: "4px" }}>
        ・
      </p>
      <p style={{ color: "#777", fontSize: "1em" }}>© 2025</p>
      <div class="fl-row ai-center" style={{ gap: "8px" }}>
        <a href="https://fresh.deno.dev">
          <img
            width="197"
            height="37"
            src="https://fresh.deno.dev/fresh-badge.svg"
            alt="Made with Fresh"
          />
        </a>
      </div>
    </div>
  );
}
