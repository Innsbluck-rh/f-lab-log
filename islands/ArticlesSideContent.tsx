import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { SearchQueryForm } from "./SearchQueryForm.tsx";

export function ArticlesSideContent(props: {
  tag?: string;
  query?: string;
}) {
  const monthlyCounts = useSignal<{ [ym: string]: number }>({});

  const fetchMonthlyCount = async () => {
    const res = await fetch("/api/log/monthly_counts", {
      method: "GET",
    });

    if (res.ok) {
      const data = await res.json();
      monthlyCounts.value = data;
    }
  };

  useEffect(() => {
    fetchMonthlyCount();
  }, []);

  return (
    <div
      class="articles-side fl-col"
      style={{
        gap: "32px",
        // backgroundColor: "#00000040",
      }}
    >
      <SearchQueryForm query={props.query ?? ""} />

      <div class="fl-col">
        {Object.entries(monthlyCounts.value).map(([ym, count]) => {
          return (
            <a
              style={{
                fontSize: "0.75em",
                fontFamily: "Consolas",
                color: "gray",
              }}
              href={`/?ym=${ym}`}
            >
              {ym} ({count})
            </a>
          );
        })}
      </div>
    </div>
  );
}
