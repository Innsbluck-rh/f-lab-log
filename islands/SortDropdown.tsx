export function SortDropdown(
  props: {
    defaultValue?: string;
    basePath: string;
    baseSP?: [string, string][];
  },
) {
  return (
    <select
      onChange={(e) => {
        const sp = new URLSearchParams(props.baseSP ?? []);
        sp.set("sort", e.currentTarget.value);
        location.href = `${props.basePath}?${sp}`;
      }}
      style={{ width: "100px" }}
      value={props.defaultValue}
    >
      <option value="createdAt">作成順</option>
      <option value="updatedAt">最終更新順</option>
      <option value="date">日時順</option>
    </select>
  );
}
