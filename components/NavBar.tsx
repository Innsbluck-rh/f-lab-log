export function NavBar(props: { url?: URL }) {
  return (
    <div
      class="w100 fl-row ai-center"
      style={{ gap: "16px", paddingRight: "16px" }}
    >
      <a
        style={{
          fontFamily: "Consolas",
          fontSize: "24px",
          // color: props.url?.pathname === "/" ? "#00BB" : "inherit",
          textDecoration: "none",
          marginRight: "auto",
        }}
        href="/"
      >
        Fujimi_Log
      </a>
      {
        /* <a
        class={props.url?.pathname === "/" ? "selected" : ""}
        style={{
          fontFamily: "Consolas",
          textDecoration: "none",
        }}
        href="/"
      >
        Home
      </a> */
      }
      {
        /* <div style={{ flexGrow: 1 }} />
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
        : null} */
      }

      {props.url?.pathname.startsWith("/create") ? null : (
        <a
          class={(props.url?.pathname === "/create" ? "selected " : "") +
            "create-button"}
          style={{
            whiteSpace: "nowrap",
            fontFamily: "Consolas",
            textDecoration: "none",
          }}
          href="/create"
        >
          + Create
        </a>
      )}

      <a href="https://github.com/Innsbluck-rh/f-lab-log" target="_blank">
        <img
          src="/github-mark.svg"
          style={{
            width: "20px",
            height: "auto",
          }}
        />
      </a>
    </div>
  );
}
