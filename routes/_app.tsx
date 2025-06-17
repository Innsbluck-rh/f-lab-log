import { type PageProps } from "$fresh/server.ts";
import { NavBar } from "../components/NavBar.tsx";

export default function App({ url, Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fujimi-lab-log</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/gfm.css" />
      </head>
      <body>
        <NavBar url={url} />
        <main>
          <Component />
        </main>
      </body>
    </html>
  );
}
