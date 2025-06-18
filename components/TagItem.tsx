export function TagItem(props: { text: string }) {
  if (props.text === "") return null;
  return (
    <div
      class="fl-row ai-center jc-center"
      style={{
        width: "auto",
        height: "16px",
        borderRadius: "16px",
        backgroundColor: "#444",
        color: "white",
        fontSize: "0.75em",
        boxSizing: "border-box",
        padding: "10px 8px",
        cursor: "pointer",
        pointerEvents: "all",
      }}
      onClick={() => {
        location.href = `/?tag=${props.text}`;
      }}
    >
      <p>
        #{props.text}
      </p>
    </div>
  );
}
