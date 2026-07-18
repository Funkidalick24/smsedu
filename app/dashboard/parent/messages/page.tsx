import DashboardLayout from "@/components/DashboardLayout";
import Table from "@/components/Table";
import { requireDashboardRole } from "@/lib/server/pageAuth";
import { getParentMessages } from "@/lib/server/moduleRepository";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-ZW", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ParentMessagesPage() {
  await requireDashboardRole("parent");
  const messages = getParentMessages();

  return (
    <DashboardLayout role="parent">
      <section className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--color-primary-strong)" }}>
            Messages
          </h1>
          <p className="mt-2 text-sm text-slate-600">School notices and urgent communications relevant to parents.</p>
        </div>
        <Table
          columns={["Notice", "Message", "Priority", "Published"]}
          rows={messages.map((message) => [message.title, message.body, message.priority, formatDate(message.publishedAt)])}
        />
        {messages.length === 0 ? <p className="text-sm text-slate-500">No parent messages are available.</p> : null}
      </section>
    </DashboardLayout>
  );
}
