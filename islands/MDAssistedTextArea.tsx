import { JSX } from "preact/jsx-runtime/src/index.d.ts";

export function MDAssistedTextArea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement>,
) {
  const preservedSequences = [
    "  ", // インデント
    "\\t", // タブ
    "- ", // リスト
    "\\+ ",
    "\\* ",
    "> ", //引用
    "\\- \\[ \\] ", //チェックボックス
    "\\- \\[x\\] ",
  ];

  return (
    <textarea
      type="text"
      autoComplete="off"
      {...props}
      onKeyDown={(e) => {
        const textarea = e.currentTarget;

        props.onKeyDown?.(e);

        if (e.key == "Tab") {
          e.preventDefault();
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;

          // set textarea value to: text before caret + tab + text after caret
          textarea.value = textarea.value.substring(0, start) +
            "  " + textarea.value.substring(end);

          // put caret at right position again
          textarea.selectionStart =
            textarea.selectionEnd =
              start + 1;
        }

        if (e.key === "Enter") {
          // 改行前の行
          const lineNumber =
            textarea.value.substring(0, textarea.selectionStart).split("\n")
              .length - 1;

          const lines = textarea.value.split("\n");
          if (lineNumber <= lines.length) {
            const prevLineStr = lines[lineNumber];
            const prefixRegex = new RegExp(
              `((?:${preservedSequences.toReversed().join("|")})+).*`,
            );
            const res = prefixRegex.exec(prevLineStr);
            if (res) {
              e.preventDefault();
              const copyStr = res[1];
              lines.splice(lineNumber + 1, 0, copyStr);
              textarea.value = lines.join("\n");
              const lengthUntil =
                lines.slice(0, lineNumber + 2).join(" ").length;
              textarea.selectionEnd = lengthUntil;
            }
          }
        }
      }}
    />
  );
}
