import * as csv from "csv";
import fs from "fs";
import { mkdirp } from "mkdirp";
import MultiStream from "multistream";
import path from "path";

type Row = {
  enrollmentTerm: string;
  subjectArea: string;
  catalogNumber: string;
  sectionNumber: string;
  gradeOffered: string;
  gradeCount: string;
  enrollmentTotal: string;
  instructorName: string;
  courseTitle: string;
};

type InstructorIndex = {
  [instructorName: string]: Row[];
};

type SubjectIndex = {
  [subjectArea: string]: {
    [catalogNumber: string]: Row[];
  };
};

const CSV_DATA_DIR = path.resolve(__dirname);

/**
 * Parses the CSV and returns an array of objects corresponding to rows and indexes.
 */
async function parseAndIndexGrades(): Promise<
  [Row[], InstructorIndex, SubjectIndex]
> {
  const rows: Row[] = [];
  const instructorIndex: InstructorIndex = {};
  const subjectIndex: SubjectIndex = {};

  // Newer data uses different column names and is processed separately.
  const oldDataStreams = [
    "header-old.csv",
    "grades-21f-222.csv",
    "grades-22f-23s.csv",
  ].map(
    (filename) => () =>
      fs.createReadStream(path.resolve(CSV_DATA_DIR, filename)),
  );

  const oldDataParser = new MultiStream(oldDataStreams).pipe(
    csv.parse({ columns: true }),
  );
  for await (const rawRow of oldDataParser) {
    // Column names are defined in `header-old.csv`; they are the
    // same for `21f-222` and `22f-23s` data.
    const row = {
      enrollmentTerm: rawRow["ENROLLMENT TERM"].trim(),
      subjectArea: rawRow["SUBJECT AREA"].trim(),
      catalogNumber: rawRow["CATLG NBR"].trim(),
      sectionNumber: rawRow["SECT NBR"].trim(),
      gradeOffered: rawRow["GRD OFF"].trim(),
      gradeCount: rawRow["GRD COUNT"].trim(),
      enrollmentTotal: rawRow["ENRL TOT"].trim(),
      instructorName: rawRow["INSTR NAME"].trim(),
      courseTitle: rawRow["LONG CRSE TITLE"].trim(),
    };
    rows.push(row);
  }

  const newDataStreams = [
    "header-new.csv",
    "grades-231-24s.csv",
    "grades-241-25s.csv",
  ].map(
    (filename) => () =>
      fs.createReadStream(path.resolve(CSV_DATA_DIR, filename)),
  );

  const newDataParser = new MultiStream(newDataStreams).pipe(
    csv.parse({ columns: true }),
  );
  for await (const rawRow of newDataParser) {
    // The newer data uses different column names. Defined in `header-new.csv`.
    const row = {
      enrollmentTerm: rawRow["enrl_term_cd"].trim(),
      subjectArea: rawRow["subj_area_cd"].trim(),
      catalogNumber: rawRow["disp_catlg_no"].trim(),
      sectionNumber: rawRow["disp_sect_no"].trim(),
      gradeOffered: rawRow["grd_cd"].trim(),
      gradeCount: rawRow["num_grd"].trim(),
      enrollmentTotal: rawRow["enrl_tot"].trim(),
      instructorName: rawRow["instr_nm"].trim(),
      courseTitle: rawRow["crs_long_ttl"].trim(),
    };
    rows.push(row);
  }

  for (const row of rows) {
    const { instructorName, subjectArea, catalogNumber } = row;

    if (!instructorIndex[instructorName]) {
      instructorIndex[instructorName] = [];
    }
    instructorIndex[instructorName].push(row);

    if (!subjectIndex[subjectArea]) {
      subjectIndex[subjectArea] = {};
    }
    if (!subjectIndex[subjectArea][catalogNumber]) {
      subjectIndex[subjectArea][catalogNumber] = [];
    }
    subjectIndex[subjectArea][catalogNumber].push(row);
  }

  return [rows, instructorIndex, subjectIndex];
}

type CourseRanking = {
  subjectArea: string;
  catalogNumber: string;
  courseTitle: string;
  enrollmentTerm: string;
  totalStudents: number;
  aCount: number;
  percentA: number;
  instructors: string[];
  catalogNumberNumeric: number;
};

function compareTerms(a: string, b: string): number {
  const [yearAString, quarterA] = [a.slice(0, 2), a.slice(2)];
  const [yearBString, quarterB] = [b.slice(0, 2), b.slice(2)];
  const yearA = parseInt(yearAString, 10);
  const yearB = parseInt(yearBString, 10);
  if (yearA !== yearB) return yearA - yearB;
  const quarterOrdering = ["W", "S", "1", "2", "F"];
  const quarterIndexA = quarterOrdering.indexOf(quarterA);
  const quarterIndexB = quarterOrdering.indexOf(quarterB);
  if (quarterIndexA === -1) return 1;
  if (quarterIndexB === -1) return -1;
  return quarterIndexA - quarterIndexB;
}

function generateCourseRankings(rows: Row[]): {
  rankings: CourseRanking[];
  terms: string[];
} {
  // Group by (subjectArea, catalogNumber, enrollmentTerm)
  const groupMap = new Map<
    string,
    {
      subjectArea: string;
      catalogNumber: string;
      courseTitle: string;
      enrollmentTerm: string;
      aCount: number;
      letterGradeTotal: number;
      instructors: Set<string>;
    }
  >();

  const aGrades = new Set(["A+", "A", "A-"]);
  const letterGrades = new Set([
    "A+", "A", "A-",
    "B+", "B", "B-",
    "C+", "C", "C-",
    "D+", "D", "D-",
    "F",
  ]);
  const allTerms = new Set<string>();

  for (const row of rows) {
    const key = `${row.subjectArea}||${row.catalogNumber}||${row.enrollmentTerm}`;
    allTerms.add(row.enrollmentTerm);

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        subjectArea: row.subjectArea,
        catalogNumber: row.catalogNumber,
        courseTitle: row.courseTitle,
        enrollmentTerm: row.enrollmentTerm,
        aCount: 0,
        letterGradeTotal: 0,
        instructors: new Set(),
      });
    }

    const group = groupMap.get(key)!;
    const count = parseInt(row.gradeCount, 10) || 0;

    if (letterGrades.has(row.gradeOffered)) {
      group.letterGradeTotal += count;
    }
    if (aGrades.has(row.gradeOffered)) {
      group.aCount += count;
    }
    if (row.instructorName) {
      group.instructors.add(row.instructorName);
    }
    // Keep the latest course title
    if (row.courseTitle) {
      group.courseTitle = row.courseTitle;
    }
  }

  const rankings: CourseRanking[] = [];
  for (const group of Array.from(groupMap.values())) {
    if (group.letterGradeTotal === 0) continue;

    const numericMatch = group.catalogNumber.match(/\d+/);
    const catalogNumberNumeric = numericMatch ? parseInt(numericMatch[0], 10) : 0;

    rankings.push({
      subjectArea: group.subjectArea,
      catalogNumber: group.catalogNumber,
      courseTitle: group.courseTitle,
      enrollmentTerm: group.enrollmentTerm,
      totalStudents: group.letterGradeTotal,
      aCount: group.aCount,
      percentA: Math.round((group.aCount / group.letterGradeTotal) * 1000) / 10,
      instructors: Array.from(group.instructors),
      catalogNumberNumeric,
    });
  }

  // Sort terms reverse chronologically
  const terms = Array.from(allTerms).sort((a, b) => compareTerms(b, a));

  return { rankings, terms };
}

async function main() {
  console.info("Parsing and cleaning data...");

  const [rows, instructorIndex, subjectIndex] = await parseAndIndexGrades();

  console.info("Parsed and cleaned data! Generating rankings...");

  const { rankings, terms } = generateCourseRankings(rows);

  console.info(
    `Generated ${rankings.length} course rankings across ${terms.length} terms.`,
  );

  console.info("Writing files to app/generated...");

  const generatedDataDir = path.resolve(__dirname, "..", "app", "generated");

  await mkdirp(generatedDataDir);
  await Promise.all([
    fs.promises.writeFile(
      path.resolve(generatedDataDir, "rows.json"),
      JSON.stringify(rows),
      "utf-8",
    ),
    fs.promises.writeFile(
      path.resolve(generatedDataDir, "instructor-index.json"),
      JSON.stringify(instructorIndex),
      "utf-8",
    ),
    fs.promises.writeFile(
      path.resolve(generatedDataDir, "subject-index.json"),
      JSON.stringify(subjectIndex),
      "utf-8",
    ),
    fs.promises.writeFile(
      path.resolve(generatedDataDir, "course-rankings.json"),
      JSON.stringify(rankings),
      "utf-8",
    ),
    fs.promises.writeFile(
      path.resolve(generatedDataDir, "terms.json"),
      JSON.stringify(terms),
      "utf-8",
    ),
  ]);

  console.info("Wrote files to app/generated!");
}

main()
  .then(() => {
    console.log("Completed successfully!");
  })
  .catch((err) => {
    console.error("An error occurred.");
    console.error(err);
  });
