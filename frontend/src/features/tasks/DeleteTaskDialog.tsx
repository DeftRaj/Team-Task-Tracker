import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

import type { Task } from "../../types/task";

interface DeleteTaskDialogProps {
  task: Task | null;
  isDeleting: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTaskDialog({
  task,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <Modal
      isOpen={Boolean(task)}
      title="Delete task"
      onClose={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
    >
      {task && (
        <>
          <p>
            Are you sure you want to delete{" "}
            <strong>{task.title}</strong>?
          </p>

          <p className="modal-warning">
            This action cannot be undone.
          </p>

          {error && (
            <div
              className="form-error-summary"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="project-form-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={isDeleting}
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="danger"
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting
                ? "Deleting..."
                : "Delete task"}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}