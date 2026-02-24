"use client";

import { useMemo, useState } from "react";
import type { CourseRanking } from "../types";
import { CourseRankingTable } from "./CourseRankingTable";
import { FilterBar } from "./FilterBar";

type EasyClassesFinderProps = {
  rankings: CourseRanking[];
  terms: string[];
};

export function EasyClassesFinder({ rankings, terms }: EasyClassesFinderProps) {
  const [selectedTerm, setSelectedTerm] = useState(terms[0] ?? "");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Extract sorted unique departments from the full dataset
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    for (const r of rankings) {
      deptSet.add(r.subjectArea);
    }
    return Array.from(deptSet).sort();
  }, [rankings]);

  const filtered = useMemo(() => {
    let result = rankings;

    // Filter by term
    result = result.filter((r) => r.enrollmentTerm === selectedTerm);

    // Filter by department
    if (selectedDepartment !== "all") {
      result = result.filter((r) => r.subjectArea === selectedDepartment);
    }

    // Filter by course level
    if (selectedLevel === "lower") {
      result = result.filter(
        (r) => r.catalogNumberNumeric >= 1 && r.catalogNumberNumeric <= 99,
      );
    } else if (selectedLevel === "upper") {
      result = result.filter(
        (r) =>
          r.catalogNumberNumeric >= 100 && r.catalogNumberNumeric <= 199,
      );
    } else if (selectedLevel === "graduate") {
      result = result.filter((r) => r.catalogNumberNumeric >= 200);
    }

    // Sort by percentA descending
    result.sort((a, b) => b.percentA - a.percentA);

    return result;
  }, [rankings, selectedTerm, selectedDepartment, selectedLevel]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        terms={terms}
        departments={departments}
        selectedTerm={selectedTerm}
        selectedDepartment={selectedDepartment}
        selectedLevel={selectedLevel}
        onTermChange={(t) => {
          setSelectedTerm(t);
        }}
        onDepartmentChange={(d) => {
          setSelectedDepartment(d);
        }}
        onLevelChange={(l) => {
          setSelectedLevel(l);
        }}
      />

      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {filtered.length}
        </span>{" "}
        {filtered.length === 1 ? "course" : "courses"}
      </p>

      <CourseRankingTable rankings={filtered} />
    </div>
  );
}
