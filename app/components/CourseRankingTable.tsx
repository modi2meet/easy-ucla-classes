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
            <tr className="border-b-2 border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
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
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                  {i + 1}
                </td>
                <td className="py-3 px-2">
                  <Link
                    href={`/${encodeURIComponent(r.subjectArea)}/${encodeURIComponent(r.catalogNumber)}`}
                    className="hover:underline"
                  >
                    <span className="font-semibold text-uclaDarkerBlue">
                      {r.subjectArea} {r.catalogNumber}
                    </span>
                    <span className="block text-xs text-gray-500 mt-0.5">
                      {r.courseTitle}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-uclaBlue"
                        style={{ width: `${r.percentA}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold w-14 text-right">
                      {r.percentA}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-2 text-gray-500 text-xs hidden md:table-cell">
                  {r.aCount} / {r.totalStudents}
                </td>
                <td className="py-3 px-2 text-gray-500 text-xs hidden lg:table-cell truncate max-w-[200px]">
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
            className="px-6 py-2 rounded-lg border-2 border-uclaBlue text-uclaBlue font-semibold hover:bg-uclaBlue hover:text-white transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
