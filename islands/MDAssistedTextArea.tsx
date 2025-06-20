import { JSX } from "preact/jsx-runtime/src/index.d.ts";

export function MDAssistedTextArea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement>,
) {
  const preservedSequences = [
    // "  ", // インデント
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
          const lastSelectionStart = textarea.selectionStart;

          // 改行前の行番号
          const lineNumber =
            textarea.value.substring(0, textarea.selectionStart).split("\n")
              .length - 1;

          const lines = textarea.value.split("\n");
          if (lineNumber <= lines.length) {
            if (e.shiftKey) { // shiftで削除
              if (lines[lineNumber].startsWith("\t")) {
                lines[lineNumber] = lines[lineNumber].substring(
                  1,
                  lines[lineNumber].length,
                );
              }
              textarea.value = lines.join("\n");
              textarea.selectionEnd = lastSelectionStart - 1; // \t削除分
            } else {
              lines[lineNumber] = "\t" + lines[lineNumber];
              textarea.value = lines.join("\n");
              textarea.selectionEnd = lastSelectionStart + 1; // \t追加分
            }
          }
        }

        if (e.key === "Enter") {
          // 改行前の行番号
          const lineNumber =
            textarea.value.substring(0, textarea.selectionStart).split("\n")
              .length - 1;

          const lines = textarea.value.split("\n");
          if (lineNumber <= lines.length) {
            // const prevLineStr = lines[lineNumber];

            const strBeforePrevLineStart = lines.slice(0, lineNumber)
              .join("\n"); // 0文字目～該当行の直前までの文字列
            const strBeforeLineEnd = lines.slice(0, lineNumber + 1)
              .join("\n"); // 0文字目～該当行の最後までの文字列

            const strBeforeCursor = textarea.value.substring(
              0,
              textarea.selectionStart,
            ); // 0文字目～該当行のカーソル位置までの文字列

            // カーソル以前の行内容
            const lineStrBeforeCursor = textarea.value.substring(
              strBeforePrevLineStart.length + (lineNumber !== 0 ? 1 : 0), // cut new line
              strBeforeCursor.length,
            );
            // カーソル以降の行内容
            const lineStrAfterCursor = textarea.value.substring(
              strBeforeCursor.length,
              strBeforeLineEnd.length,
            );

            // console.log(lineStrBeforeCursor + " / " + lineStrAfterCursor);

            const prefixRegex = new RegExp(
              `((?:${preservedSequences.toReversed().join("|")})+).*`,
            );
            const res = prefixRegex.exec(lineStrBeforeCursor);

            if (res) {
              e.preventDefault();
              let copyStr = res[1];
              if (e.shiftKey) copyStr = copyStr.replace(/./g, " ");

              lines[lineNumber] = lineStrBeforeCursor;

              lines.splice(lineNumber + 1, 0, copyStr + lineStrAfterCursor);
              textarea.value = lines.join("\n");
              const strUntilInserted = textarea.value.substring(
                0,
                lines.slice(0, lineNumber + 2).join("\n").length,
              );
              textarea.selectionEnd = strUntilInserted.length;
            }
          }
        }
      }}
    />
  );
}
