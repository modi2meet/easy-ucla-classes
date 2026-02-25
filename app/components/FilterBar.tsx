"use client";

import { Select } from "./Select";
import { getTermLongName, getSubjectAreaLongName } from "../utils";

type FilterBarProps = {
  terms: string[];
  departments: string[];
  selectedTerm: string;
  selectedDepartment: string;
  selectedLevel: string;
  professors: string[];
  selectedProfessor: string;
  onTermChange: (term: string) => void;
  onDepartmentChange: (dept: string) => void;
  onLevelChange: (level: string) => void;
  onProfessorChange: (prof: string) => void;
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

function getProfessorLabel(name: string) {
  if (name === "all") return "All Professors";
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getTermLabel(term: string) {
  if (term === "all") return "All Quarters";
  return getTermLongName(term);
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
  professors,
  selectedProfessor,
  onTermChange,
  onDepartmentChange,
  onLevelChange,
  onProfessorChange,
}: FilterBarProps) {
  const termOptions = ["all", ...terms];
  const departmentOptions = ["all", ...departments];
  const professorOptions = ["all", ...professors];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium text-notion-text-secondary uppercase mb-1">
          Quarter
        </label>
        <Select
          value={selectedTerm}
          options={termOptions}
          getLabel={getTermLabel}
          onChange={onTermChange}
          isSearchable={true}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-notion-text-secondary uppercase mb-1">
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
        <label className="block text-xs font-medium text-notion-text-secondary uppercase mb-1">
          Course Level
        </label>
        <Select
          value={selectedLevel}
          options={LEVEL_OPTIONS}
          getLabel={getLevelLabel}
          onChange={onLevelChange}
          isSearchable={true}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-notion-text-secondary uppercase mb-1">
          Professor
        </label>
        <Select
          value={selectedProfessor}
          options={professorOptions}
          getLabel={getProfessorLabel}
          onChange={onProfessorChange}
          isSearchable={true}
        />
      </div>
    </div>
  );
}
