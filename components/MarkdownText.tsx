import { useEffect } from "preact/hooks";

export function MarkdownText(
  props: { rawMarkdownStr: string },
) {
  let divEl: HTMLDivElement | null;
  let isFetching = false;

  const fetchRendered = async (content: string) => {
    if (isFetching) return;
    isFetching = true;

    try {
      const res = await fetch("/api/markdown/render", {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        if (divEl) divEl.setHTMLUnsafe(data.rendered);
      }
    } catch (e: any) {
      // console.log(e);
    }
    setTimeout(() => {
      isFetching = false;
    }, 1000);
  };

  const content = props.rawMarkdownStr;
  useEffect(() => {
    fetchRendered(content);
  }, []);

  return (
    <div
      ref={(ref) => {
        divEl = ref;
      }}
      data-color-mode="light"
      data-light-theme="light"
      data-dark-theme="dark"
      class="markdown-body"
    >
    </div>
  );
}
