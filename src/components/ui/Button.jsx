export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) {
  const styles = {
    primary: "bg-brand text-white hover:opacity-90",
    outline: "border border-brand text-brand hover:bg-gray-50",
  };

  return (
    <button
      disabled={loading || props.disabled}
      className={`px-5 py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}