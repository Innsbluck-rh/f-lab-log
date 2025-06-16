import { CSS, render } from "@deno/gfm";

export function MarkdownText(props: { rawMarkdownStr: string }) {
  return (
    <div
      data-color-mode="light"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
      dangerouslySetInnerHTML={{
        __html: render(`${props.rawMarkdownStr}`),
      }}
      style={CSS + "; white-space: pre;"}
    >
    </div>
  );
}
