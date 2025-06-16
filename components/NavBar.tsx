export function NavBar(props: { url?: URL }) {
  return (
    <div class="w100 fl-row ai-center" style={{ gap: "36px" }}>
      <a
        style={{
          fontFamily: "Consolas",
          fontSize: "24px",
          color: "inherit",
          textDecoration: "none",
        }}
        href="/"
      >
        Fujimi_Log
      </a>
      <a
        style={{
          fontFamily: "Consolas",
          textDecoration: "none",
          color: props.url?.pathname === "/" ? "red" : "inherit",
        }}
        href="/"
      >
        Home
      </a>
      <a
        style={{
          fontFamily: "Consolas",
          textDecoration: "none",
          color: props.url?.pathname === "/create" ? "red" : "inherit",
        }}
        href="/create"
      >
        Create
      </a>
    </div>
  );
}
