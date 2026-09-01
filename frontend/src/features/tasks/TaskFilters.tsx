import type {
  TaskPriority,
  TaskStatus,
} from "../../types/task";

import type {
  TaskFilters as TaskFiltersState,
} from "./taskFilters.types";

interface TaskFiltersProps {
  filters: TaskFiltersState;
  assignees: {
    id: string;
    name: string;
  }[];
  onChange: (
    changes: Partial<TaskFiltersState>,
  ) => void;
}

export function TaskFilters({
  filters,
  assignees,
  onChange,
}: TaskFiltersProps) {
  return (
    <section
      className="task-filters"
      aria-label="Task filters"
    >
      <div className="search-field">
        <label htmlFor="task-search">
          Search tasks
        </label>

        <input
          id="task-search"
          type="search"
          value={filters.search}
          placeholder="Search by task title"
          onChange={(event) =>
            onChange({
              search: event.target.value,
            })
          }
        />
      </div>

      <div className="task-filter-controls">
        <div className="form-field">
          <label htmlFor="task-status-filter">
            Status
          </label>

          <select
            id="task-status-filter"
            value={filters.status}
            onChange={(event) =>
              onChange({
                status:
                  event.target
                    .value as
                    | TaskStatus
                    | "ALL",
              })
            }
          >
            <option value="ALL">
              All statuses
            </option>

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
        </div>

        <div className="form-field">
          <label htmlFor="task-priority-filter">
            Priority
          </label>

          <select
            id="task-priority-filter"
            value={filters.priority}
            onChange={(event) =>
              onChange({
                priority:
                  event.target
                    .value as
                    | TaskPriority
                    | "ALL",
              })
            }
          >
            <option value="ALL">
              All priorities
            </option>

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
        </div>

        <div className="form-field">
          <label htmlFor="task-assignee-filter">
            Assignee
          </label>

          <select
            id="task-assignee-filter"
            value={filters.assigneeId}
            onChange={(event) =>
              onChange({
                assigneeId:
                  event.target.value,
              })
            }
          >
            <option value="">
              All assignees
            </option>

            {assignees.map(
              (assignee) => (
                <option
                  key={assignee.id}
                  value={assignee.id}
                >
                  {assignee.name}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-sort-filter">
            Sort by
          </label>

          <select
            id="task-sort-filter"
            value={filters.sortBy}
            onChange={(event) =>
              onChange({
                sortBy:
                  event.target
                    .value as
                    | "dueDate"
                    | "createdAt",
              })
            }
          >
            <option value="createdAt">
              Creation date
            </option>

            <option value="dueDate">
              Due date
            </option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-sort-direction">
            Order
          </label>

          <select
            id="task-sort-direction"
            value={filters.sortDirection}
            onChange={(event) =>
              onChange({
                sortDirection:
                  event.target
                    .value as
                    | "asc"
                    | "desc",
              })
            }
          >
            <option value="desc">
              Newest first
            </option>

            <option value="asc">
              Oldest first
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}