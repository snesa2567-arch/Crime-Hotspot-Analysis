import { useState } from "react";

const FILTER_OPTIONS = [
  { label: "Time Slot",     field: "time_slot"        },
  { label: "Weapon Used",   field: "weapon_used"      },
  { label: "Age Group",     field: "age_group"        },
  { label: "Crime Domain",  field: "crime_domain"     },
  { label: "Crime Type",    field: "crime_description"},
];

function FilterBuilder({ filters, setFilters }) {
  const [selectedField, setSelectedField] = useState("");

  const addFilter = () => {
    if (!selectedField) return;

    // Prevent duplicate filters
    const exists = filters.find((f) => f.field === selectedField);
    if (exists) return;

    // Push the new filter at the END — preserves user-chosen order
    setFilters([
      ...filters,
      { field: selectedField, value: null, count: null },
    ]);

    setSelectedField("");
  };

  const removeFilter = (field) => {
    setFilters(filters.filter((f) => f.field !== field));
  };

  // Only show options not already added
  const availableOptions = FILTER_OPTIONS.filter(
    (option) => !filters.some((f) => f.field === option.field)
  );

  return (
    <div>
      <h2>Dynamic Filters</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
        >
          <option value="">Select Filter</option>
          {availableOptions.map((option) => (
            <option key={option.field} value={option.field}>
              {option.label}
            </option>
          ))}
        </select>

        <button onClick={addFilter}>+ Add Filter</button>
      </div>

      <br />

      {/* Render active filters in the order user added them */}
      {filters.map((filter) => {
        const label =
          FILTER_OPTIONS.find((o) => o.field === filter.field)?.label ||
          filter.field;

        return (
          <div
            key={filter.field}
            style={{
              background: "#334155",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <b>{label}</b>

            {filter.value && (
              <>
                <br />
                Result: {filter.value} ({filter.count})
              </>
            )}

            <button
              style={{ marginLeft: "20px" }}
              onClick={() => removeFilter(filter.field)}
            >
              Remove
            </button>
          </div>
        );
      })}

      {filters.length === 0 && (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          No filters added yet. Select one above and click + Add Filter.
        </p>
      )}
    </div>
  );
}

export default FilterBuilder;