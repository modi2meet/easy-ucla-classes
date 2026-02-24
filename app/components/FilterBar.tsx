"use client";

import { Select } from "./Select";
import { getTermLongName, getSubjectAreaLongName } from "../utils";

type FilterBarProps = {
  terms: string[];
  departments: string[];
  selectedTerm: string;
  selectedDepartment: string;
  selectedLevel: string;
  onTermChange: (term: string) => void;
  onDepartmentChange: (dept: string) => void;
  onLevelChange: (level: string) => void;
};

const LEVEL_OPTIONS = ["all", "lower", "upper", "graduate"];

function getLevelLabel(level: string) {
  return (
    {
      all: "All Levels",
      lower: "Lower Division (1-99)",
      upper: "Upper Division (100-199)",
      graduate: "Graduate (200+)",
    }[level] ?? level
  );
}

function getDepartmentLabel(dept: string) {
  if (dept === "all") return "All Departments";
  const longName = getSubjectAreaLongName(dept);
  return longName ? `${dept} - ${longName}` : dept;
}

export function FilterBar({
  terms,
  departments,
  selectedTerm,
  selectedDepartment,
  selectedLevel,
  onTermChange,
  onDepartmentChange,
  onLevelChange,
}: FilterBarProps) {
  const termOptions = terms;
  const departmentOptions = ["all", ...departments];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Quarter
        </label>
        <Select
          value={selectedTerm}
          options={termOptions}
          getLabel={getTermLongName}
          onChange={onTermChange}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Department
        </label>
        <Select
          value={selectedDepartment}
          options={departmentOptions}
          getLabel={getDepartmentLabel}
          onChange={onDepartmentChange}
          isSearchable={true}
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
          Course Level
        </label>
        <Select
          value={selectedLevel}
          options={LEVEL_OPTIONS}
          getLabel={getLevelLabel}
          onChange={onLevelChange}
        />
      </div>
    </div>
  );
}
