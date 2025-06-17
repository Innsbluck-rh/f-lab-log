export function TagItem(props: { text: string }) {
  return (
    <div
      class="fl-row ai-center jc-center"
      style={{
        width: "auto",
        height: "16px",
        borderRadius: "8px",
        backgroundColor: "gray",
        color: "white",
        fontSize: "0.5em",
        padding: "8px",
      }}
    >
      <p>
        {props.text}
      </p>
    </div>
  );
}
