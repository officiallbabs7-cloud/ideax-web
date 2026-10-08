const styles = {
  pending_payment: ["Awaiting payment", "bg-yellow-100 text-yellow-800"],
  paid: ["Paid", "bg-green-100 text-green-700"],
  in_progress: ["In progress", "bg-blue-100 text-blue-700"],
  completed: ["Completed", "bg-emerald-100 text-emerald-700"],
  cancelled: ["Cancelled", "bg-red-100 text-red-700"],
};

export default function StatusBadge({ status }) {
  const [label, style] = styles[status] || [status, "bg-gray-100 text-gray-700"];
  return (
    <span
      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${style}`}
    >
      {label}
    </span>
  );
}