import { identity } from "lodash";
import ReactSelect from "react-select";
import { ACCENT_RGB, ACCENT_LIGHT_RGB } from "../constants";

type ReactSelectProps = React.ComponentProps<typeof ReactSelect>;
type SelectProps = Omit<
  ReactSelectProps,
  "styles" | "value" | "options" | "onChange" | "isSearchable"
> & {
  /** The currently selected value */
  value: string;
  /**
   * A function to get the label of the given value;
   * defaults to the identity.
   */
  getLabel?(value: string): string;
  /** Called when the selected value changes */
  onChange(newValue: string): void;
  /** The options to select from */
  options: string[];
  /** Whether the select is searchable; defaults to false */
  isSearchable?: boolean;
};

/**
 * Simplified select component based on the base `<Select/>` from
 * `react-select`.
 */
const Select = ({
  value,
  getLabel = identity,
  onChange,
  options,
  isSearchable = false,
  ...restProps
}: SelectProps) => {
  const selectStyles: ReactSelectProps["styles"] = {
    control(base, { isFocused }) {
      return {
        ...base,
        boxShadow: "none",
        borderWidth: "1px",
        borderColor: isFocused ? `rgb(${ACCENT_RGB})` : "#E3E2DE",
        borderRadius: "0.5rem",
        ":hover": {
          borderColor: `rgb(${ACCENT_RGB})`,
        },
      };
    },
    singleValue(base, { selectProps }) {
      return {
        ...base,
        color: "#37352F",
        display: selectProps.menuIsOpen ? "none" : "block",
      };
    },
    option(base, { isFocused, isSelected }) {
      return {
        ...base,
        cursor: "pointer",
        color: isSelected ? "white" : "#37352F",
        background: isSelected
          ? `rgb(${ACCENT_RGB})`
          : isFocused
            ? `rgb(${ACCENT_LIGHT_RGB})`
            : "white",
      };
    },
    menu(base) {
      return {
        ...base,
        borderRadius: "0.5rem",
        border: "1px solid #E3E2DE",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
      };
    },
    menuList(base) {
      return {
        ...base,
        padding: 0,
      };
    },
  };

  const selectOptions = options.map((option) => ({
    value: option,
    label: getLabel(option),
  }));

  const selectValue = {
    label: getLabel(value),
    value,
  };

  return (
    <ReactSelect
      isSearchable={isSearchable}
      value={selectValue}
      onChange={(newSelectValue) => {
        if (
          newSelectValue &&
          typeof newSelectValue === "object" &&
          "value" in newSelectValue
        ) {
          const newValue = newSelectValue.value;
          if (typeof newValue === "string") {
            onChange(newValue);
          }
        } else {
          onChange("");
        }
      }}
      options={selectOptions}
      styles={selectStyles}
      {...restProps}
    />
  );
};

export { Select };
