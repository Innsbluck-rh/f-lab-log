import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { SearchQueryForm } from "./SearchQueryForm.tsx";
import { PageProps } from "$fresh/server.ts";

export interface MonthlyCount {
  ym: string;
  count: number;
}

export function ArticlesSideContent(props: {
  tag?: string;
  query?: string;
}) {
  const monthlyCounts = useSignal<MonthlyCount[]>([]);

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
      {!props.tag ? <SearchQueryForm query={props.query ?? ""} /> : null}

      <div class="fl-col">
        {monthlyCounts.value.map((count) => {
          return (
            <a
              style={{
                fontSize: "0.75em",
                fontFamily: "Consolas",
                color: "gray",
              }}
              href={`/?ym=${count.ym}`}
            >
              {count.ym} ({count.count})
            </a>
          );
        })}
      </div>
    </div>
  );
}
