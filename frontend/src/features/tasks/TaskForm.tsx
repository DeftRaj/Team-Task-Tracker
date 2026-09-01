import {
  useState,
  type SyntheticEvent,
} from "react";

import { Button } from "../../components/ui/Button";

import type {
  TaskPriority,
  TaskStatus,
} from "../../types/task";

import {
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from "./taskForm.validation";

interface TaskFormProps {
  initialValues: TaskFormValues;
  users: {
    id: string;
    name: string;
  }[];
  isSubmitting: boolean;
  onSubmit: (
    values: TaskFormValues,
  ) => Promise<void>;
  onCancel: () => void;
}

export function TaskForm({
  initialValues,
  users,
  isSubmitting,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] =
    useState<TaskFormValues>(
      initialValues,
    );

  const [errors, setErrors] =
    useState<TaskFormErrors>({});

  function updateField<
    Key extends keyof TaskFormValues,
  >(
    field: Key,
    value: TaskFormValues[Key],
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors =
      validateTaskForm(values);

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    await onSubmit(values);
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-field">
        <label htmlFor="task-title">
          Title
        </label>

        <input
          id="task-title"
          value={values.title}
          maxLength={150}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title
              ? "task-title-error"
              : undefined
          }
          onChange={(event) =>
            updateField(
              "title",
              event.target.value,
            )
          }
        />

        {errors.title && (
          <p
            id="task-title-error"
            className="field-error"
            role="alert"
          >
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          rows={4}
          value={values.description}
          disabled={isSubmitting}
          onChange={(event) =>
            updateField(
              "description",
              event.target.value,
            )
          }
        />
      </div>

      <div className="task-form-grid">
        <div className="form-field">
          <label htmlFor="task-status">
            Status
          </label>

          <select
            id="task-status"
            value={values.status}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "status",
                event.target
                  .value as TaskStatus,
              )
            }
          >
            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="DONE">
              Done
            </option>
          </select>

          {errors.status && (
            <p
              className="field-error"
              role="alert"
            >
              {errors.status}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="task-priority">
            Priority
          </label>

          <select
            id="task-priority"
            value={values.priority}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "priority",
                event.target
                  .value as TaskPriority,
              )
            }
          >
            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>
          </select>

          {errors.priority && (
            <p
              className="field-error"
              role="alert"
            >
              {errors.priority}
            </p>
          )}
        </div>
      </div>

      <div className="task-form-grid">
        <div className="form-field">
          <label htmlFor="task-assignee">
            Assignee
          </label>

          <select
            id="task-assignee"
            value={values.assigneeId}
            disabled={isSubmitting}
            onChange={(event) =>
              updateField(
                "assigneeId",
                event.target.value,
              )
            }
          >
            <option value="">
              Select assignee
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          {errors.assigneeId && (
            <p
              className="field-error"
              role="alert"
            >
              {errors.assigneeId}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="task-due-date">
            Due date
          </label>

          <input
            id="task-due-date"
            type="date"
            value={values.dueDate}
            disabled={isSubmitting}
            aria-invalid={Boolean(
              errors.dueDate,
            )}
            aria-describedby={
              errors.dueDate
                ? "task-due-date-error"
                : undefined
            }
            onChange={(event) =>
              updateField(
                "dueDate",
                event.target.value,
              )
            }
          />

          {errors.dueDate && (
            <p
              id="task-due-date-error"
              className="field-error"
              role="alert"
            >
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      <div className="project-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : "Save task"}
        </Button>
      </div>
    </form>
  );
}