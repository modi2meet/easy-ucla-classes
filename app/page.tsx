import { EasyClassesFinder } from "./components/EasyClassesFinder";
import rankings from "./generated/course-rankings.json";
import terms from "./generated/terms.json";
import type { CourseRanking } from "./types";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <div className="flex flex-col text-center justify-center p-6 sm:p-12 md:p-16 md:w-[75%] lg:w-[55%] md:mx-auto">
        <h1 className="text-4xl mb-2 text-uclaDarkerBlue font-bold">
          Find Easy UCLA Classes
        </h1>
        <p className="text-lg text-gray-400">
          Courses ranked by % of A grades, from Fall 2021 through Spring 2025
        </p>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 pb-12 max-w-6xl mx-auto">
        <EasyClassesFinder
          rankings={rankings as CourseRanking[]}
          terms={terms}
        />
      </div>
    </main>
  );
}
