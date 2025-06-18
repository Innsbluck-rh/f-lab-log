export function TagItem(props: { text: string; highlighted: boolean }) {
  if (props.text === "") return null;
  return (
    <div
      class={`fl-row ai-center jc-center tag-item${
        props.highlighted ? " highlighted" : ""
      }`}
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
