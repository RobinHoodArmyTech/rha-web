export default function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
      {error}
    </p>
  );
}
