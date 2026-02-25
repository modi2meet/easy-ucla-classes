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
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedProfessor, setSelectedProfessor] = useState("all");

  // Extract sorted unique departments from the full dataset
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    for (const r of rankings) {
      deptSet.add(r.subjectArea);
    }
    return Array.from(deptSet).sort();
  }, [rankings]);

  // Extract sorted unique professors from the full dataset
  const professors = useMemo(() => {
    const profSet = new Set<string>();
    for (const r of rankings) {
      for (const instructor of r.instructors) {
        profSet.add(instructor);
      }
    }
    return Array.from(profSet).sort();
  }, [rankings]);

  const filtered = useMemo(() => {
    let result = rankings;

    // Filter by term
    if (selectedTerm !== "all") {
      result = result.filter((r) => r.enrollmentTerm === selectedTerm);
    }

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

    // Filter by professor
    if (selectedProfessor !== "all") {
      result = result.filter((r) => r.instructors.includes(selectedProfessor));
    }

    // Sort by percentA descending
    result.sort((a, b) => b.percentA - a.percentA);

    return result;
  }, [rankings, selectedTerm, selectedDepartment, selectedLevel, selectedProfessor]);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        terms={terms}
        departments={departments}
        selectedTerm={selectedTerm}
        selectedDepartment={selectedDepartment}
        selectedLevel={selectedLevel}
        professors={professors}
        selectedProfessor={selectedProfessor}
        onTermChange={(t) => {
          setSelectedTerm(t);
        }}
        onDepartmentChange={(d) => {
          setSelectedDepartment(d);
        }}
        onLevelChange={(l) => {
          setSelectedLevel(l);
        }}
        onProfessorChange={(p) => {
          setSelectedProfessor(p);
        }}
      />

      <p className="text-sm text-notion-text-secondary">
        Showing{" "}
        <span className="font-semibold text-notion-text">
          {filtered.length}
        </span>{" "}
        {filtered.length === 1 ? "course" : "courses"}
      </p>

      <CourseRankingTable rankings={filtered} />
    </div>
  );
}
