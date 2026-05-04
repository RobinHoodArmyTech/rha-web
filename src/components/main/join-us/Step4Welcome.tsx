interface Props {
  name: string;
}

export default function Step4Welcome({ name }: Props) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 pb-16 pt-8 sm:px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 text-5xl">🎉</div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome to the family, {firstName}!
        </h1>

        <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          We&apos;re thrilled to have you join the Robin Hood Army. We&apos;ll connect you with
          your local chapter and get you started on your first drive.
        </p>

        <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
          Someone from the team will be in touch on WhatsApp.
        </p>
      </div>
    </div>
  );
}
