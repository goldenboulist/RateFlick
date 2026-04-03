import { Modal } from "../ui/Modal";

interface DeleteModalProps {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteModal({
  open,
  title,
  onCancel,
  onConfirm,
  loading,
}: DeleteModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirmer la suppression">
      <p className="mb-2 text-[var(--fg)]">
        Supprimer <span className="font-semibold">&quot;{title}&quot;</span> ?
      </p>
      <p className="mb-6 text-sm text-[var(--muted)]">Cette action est irréversible.</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="interactive rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--fg)] hover:-translate-y-0.5 hover:bg-[var(--accent-soft)] hover:shadow-sm active:translate-y-0"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="interactive rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-none"
        >
          {loading ? "…" : "Supprimer"}
        </button>
      </div>
    </Modal>
  );
}
