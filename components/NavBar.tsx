export function NavBar(props: { url?: URL }) {
  return (
    <div
      class="w100 fl-row ai-center"
      style={{ gap: "36px", paddingRight: "16px" }}
    >
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
        class={props.url?.pathname === "/" ? "selected" : ""}
        style={{
          fontFamily: "Consolas",
          textDecoration: "none",
        }}
        href="/"
      >
        Home
      </a>
      <div style={{ flexGrow: 1 }} />
      {props.url?.pathname.startsWith("/edit")
        ? (
          <a
            class="selected"
            style={{
              fontFamily: "Consolas",
              textDecoration: "none",
            }}
          >
            Edit
          </a>
        )
        : null}
      <a
        class={(props.url?.pathname === "/create" ? "selected " : "") +
          "create-button"}
        style={{
          fontFamily: "Consolas",
          textDecoration: "none",
        }}
        href="/create"
      >
        + Create
      </a>
    </div>
  );
}
