import { Handlers, PageProps } from "$fresh/server.ts";
import EditForm from "../../islands/EditForm.tsx";
import { getLog } from "../../lib/db.ts";
import { Article } from "../../models/Article.ts";

export const handler: Handlers<Article> = {
  async GET(_req, ctx) {
    const { id } = ctx.params;
    const article = await getLog(id);
    if (!article) {
      return ctx.renderNotFound(undefined);
    }
    return ctx.render(article);
  },
};

export default function Edit(props: PageProps<Article>) {
  const { id } = props.params;

  return (
    <div class="fl-col">
      <EditForm id={id} defaultValue={props.data} />
    </div>
  );
}
