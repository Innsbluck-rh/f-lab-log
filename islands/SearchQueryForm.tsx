export function SearchQueryForm(props: { query: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        location.href = `/?query=${formData.get("query")}`;
      }}
    >
      <input
        type="text"
        name="query"
        placeholder="記事を検索..."
        defaultValue={props.query ?? ""}
      />
    </form>
  );
}
