export function SortOrderToggle(
  props: {
    sortOrder?: string;
    basePath: string;
    baseSP?: [string, string][];
  },
) {
  return (
    <button
      type="button"
      onClick={(e) => {
        const sp = new URLSearchParams(props.baseSP ?? []);
        sp.set("order", props.sortOrder === "dsc" ? "asc" : "dsc");
        location.href = `${props.basePath}?${sp}`;
      }}
      style={{
        background: "none",
        border: "none",
        color: "#888",
        fontSize: "0.8em",
      }}
    >
      {props.sortOrder === "asc" ? "古⇀新" : "新⇀古"}
    </button>
  );
}
