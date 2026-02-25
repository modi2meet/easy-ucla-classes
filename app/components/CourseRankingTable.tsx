"use client";

import Link from "next/link";
import { useState } from "react";
import type { CourseRanking } from "../types";

const PAGE_SIZE = 50;

export function CourseRankingTable({
  rankings,
}: {
  rankings: CourseRanking[];
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = rankings.slice(0, visibleCount);
  const hasMore = visibleCount < rankings.length;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-notion-border text-notion-text-tertiary text-xs uppercase tracking-wider">
              <th className="py-3 px-2 w-12">#</th>
              <th className="py-3 px-2">Course</th>
              <th className="py-3 px-2 w-48">% A Grades</th>
              <th className="py-3 px-2 w-24 hidden md:table-cell">A / Total</th>
              <th className="py-3 px-2 hidden lg:table-cell">Instructor(s)</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr
                key={`${r.subjectArea}-${r.catalogNumber}-${r.enrollmentTerm}-${i}`}
                className="border-b border-notion-border hover:bg-notion-bg-hover transition-colors"
              >
                <td className="py-3 px-2 text-notion-text-tertiary font-mono text-xs">
                  {i + 1}
                </td>
                <td className="py-3 px-2">
                  <Link
                    href={`/${encodeURIComponent(r.subjectArea)}/${encodeURIComponent(r.catalogNumber)}`}
                    className="hover:underline"
                  >
                    <span className="font-semibold text-notion-text">
                      {r.subjectArea} {r.catalogNumber}
                    </span>
                    <span className="block text-xs text-notion-text-secondary mt-0.5">
                      {r.courseTitle}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-notion-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-notion-accent"
                        style={{ width: `${r.percentA}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-14 text-right">
                      {r.percentA}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-notion-text-secondary text-xs hidden md:table-cell">
                  {r.aCount} / {r.totalStudents}
                </td>
                <td className="py-3 px-2 text-notion-text-secondary text-xs hidden lg:table-cell truncate max-w-[200px]">
                  {r.instructors.join("; ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="px-6 py-2 rounded-lg border border-notion-border text-notion-text-secondary font-medium hover:bg-notion-bg-hover transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
