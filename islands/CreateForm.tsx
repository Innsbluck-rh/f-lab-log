import { useSignal } from "@preact/signals";

export default function CreateForm() {
  const status = useSignal("idle");

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      date: formData.get("date"),
      title: formData.get("title"),
      content: formData.get("content"),
    };
    const res = await fetch("/api/logs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    status.value = res.ok ? "submitted" : "error";
    form.reset();
  }

  return (
    <form class="fl-col form-root" onSubmit={handleSubmit}>
      <label>DATE</label>
      <input name="date" required />
      <label>TITLE</label>
      <input name="title" required />
      <label>CONTENT</label>
      <input name="content" required />
      <button type="submit">SUBMIT</button>
      <p>{status}</p>
    </form>
  );
}
