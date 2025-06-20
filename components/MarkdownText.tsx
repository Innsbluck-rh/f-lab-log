import { useEffect } from "preact/hooks";

// deno-lint-ignore no-explicit-any
const debounce = <T extends (...args: any[]) => unknown>(
  callback: T,
  delay = 250,
): (...args: Parameters<T>) => void => {
  let timeoutId: number; // Node.jsの場合はNodeJS.Timeout型にする
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};

export function MarkdownText(
  props: { rawMarkdownStr: string },
) {
  let divEl: HTMLDivElement | null;

  const fetchRendered = debounce(async (content: string) => {
    try {
      const res = await fetch("/api/markdown/render", {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        if (divEl) divEl.setHTMLUnsafe(data.rendered);
      }
      // deno-lint-ignore no-explicit-any
    } catch (_e: any) {
      // console.log(e);
    }
  }, 70);

  useEffect(() => {
    if (divEl) fetchRendered(props.rawMarkdownStr);
  }, [props.rawMarkdownStr]);

  return (
    <div
      ref={(ref) => {
        divEl = ref;
        if (divEl) fetchRendered(props.rawMarkdownStr);
      }}
      data-color-mode="light"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
    >
    </div>
  );
}
