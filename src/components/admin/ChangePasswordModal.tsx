"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { api } from "@/lib/http";

export default function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setError(null);
    setSaving(false);
    setDone(false);
  };

  const close = () => {
    if (saving || done) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from your current password.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setDone(true);
      // Session was invalidated server-side — send the user to login to re-auth.
      setTimeout(() => {
        router.push("/sites/admin/login");
        router.refresh();
      }, 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={(o) => !o && close()} title="Change Password">
      {done ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Password changed</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Signing you out — please log in with your new password…
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          <FormInput
            icon={Lock}
            type="password"
            placeholder="Current password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormInput
            icon={Lock}
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormInput
            icon={Lock}
            type="password"
            placeholder="Confirm new password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Update Password"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
