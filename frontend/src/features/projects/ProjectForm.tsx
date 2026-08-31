import {
  useState,
  type SyntheticEvent,
} from "react";

import { Button } from "../../components/ui/Button";

interface ProjectFormProps {
  currentUserId: string;
  isSubmitting: boolean;
  onSubmit: (values: {
    name: string;
    description: string;
    memberIds: string[];
  }) => Promise<void>;
  onCancel: () => void;
}

interface ProjectFormErrors {
  name?: string;
  description?: string;
}

export function ProjectForm({
  currentUserId,
  isSubmitting,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [errors, setErrors] =
    useState<ProjectFormErrors>({});

  function validate(): ProjectFormErrors {
    const nextErrors: ProjectFormErrors = {};

    if (!name.trim()) {
      nextErrors.name =
        "Project name is required.";
    }

    if (name.trim().length > 100) {
      nextErrors.name =
        "Project name must be 100 characters or fewer.";
    }

    if (description.trim().length > 500) {
      nextErrors.description =
        "Description must be 500 characters or fewer.";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const validationErrors = validate();

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      memberIds: [currentUserId],
    });
  }

  return (
    <form
      className="project-form"
      onSubmit={handleSubmit}
      noValidate>
        
      <div className="form-field">
        <label htmlFor="project-name">
          Project name
        </label>

        <input
          id="project-name"
          name="name"
          type="text"
          value={name}
          maxLength={100}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name
              ? "project-name-error"
              : undefined
          }
          onChange={(event) =>
            setName(event.target.value)
          }
          disabled={isSubmitting}
        />

        {errors.name && (
          <p
            id="project-name-error"
            className="field-error"
            role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="project-description">
          Description
        </label>

        <textarea
          id="project-description"
          name="description"
          rows={4}
          value={description}
          maxLength={500}
          aria-invalid={Boolean(
            errors.description,
          )}
          aria-describedby={
            errors.description
              ? "project-description-error"
              : undefined
          }
          onChange={(event) =>
            setDescription(event.target.value)
          }
          disabled={isSubmitting}
        />

        {errors.description && (
          <p
            id="project-description-error"
            className="field-error"
            role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <div className="project-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}>
          {isSubmitting
            ? "Creating..."
            : "Create project"}
        </Button>
      </div>
    </form>
  );
}