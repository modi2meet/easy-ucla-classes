import classNames from "classnames";
import { useCallback, useMemo } from "react";

type QueryResultsProps<T> = {
  /** The search query */
  query: string;
  /** The data to search through */
  data: T[];
  /**
   * A function which extracts a React key from
   * a datum. Defaults to calling `.toString()`.
   */
  keyExtractor?(datum: T): string;
  /**
   * A function which takes in a query and returns another
   * function which returns whether the given datum matches
   * the query or not and a match score. Higher score means
   * higher up in results.
   */
  matcher(query: string): (datum: T) => { matches: boolean; score: number };
  /**
   * Called when the user clicks/selects a result.
   */
  onSelectResult?(result: T): void;
  /**
   * Renders a search result.
   */
  renderResult(datum: T): JSX.Element;
  /**
   * The message to display when no results are found.
   */
  noResultsMessage?: string;
  /**
   * The index that is currently highlighted in the results list.
   */
  activeIndex: number;
};

function QueryResults<T>({
  query,
  matcher,
  data,
  onSelectResult = () => {},
  keyExtractor = (datum) => datum?.toString() ?? "",
  renderResult,
  noResultsMessage = "No results",
  activeIndex,
}: QueryResultsProps<T>) {
  const matcherForQuery = useCallback(matcher(query), [query]);

  const predicate = useCallback(
    (datum: T) => {
      return matcherForQuery(datum).matches;
    },
    [matcherForQuery],
  );

  const results = useMemo(() => {
    return data.filter(predicate).sort((a, b) => {
      const aScore = matcherForQuery(a).score;
      const bScore = matcherForQuery(b).score;

      // Higher is better
      return bScore - aScore;
    });
  }, [data, predicate, matcherForQuery]);

  return (
    <div className="border border-notion-border rounded-lg overflow-hidden">
      <ul data-query-results>
        {results.map((datum, index) => (
          <li
            key={keyExtractor(datum)}
            onClick={() => onSelectResult(datum)}
            className="bg-white border-b border-notion-border last:border-b-0"
          >
            <div
              className={classNames(
                "hover:bg-notion-bg-hover transition-colors",
                index === activeIndex && "sm:bg-notion-accent-light",
              )}
            >
              {renderResult(datum)}
            </div>
          </li>
        ))}
        {query !== "" && results.length === 0 && (
          <li className="text-notion-text bg-white p-4 border-t border-notion-border">
            <div className="flex justify-between">
              <p className="italic font-normal text-notion-text-tertiary">
                {noResultsMessage}
              </p>
              <a
                className="text-notion-accent hover:text-notion-accent-hover"
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.google.com/forms/d/e/1FAIpQLSfxHpdeTTvFzX4slKx-KGKgvqZM3GfABXIlHcuBHXiKhLhpwQ/viewform?usp=sf_link"
              >
                Report missing data
              </a>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export { QueryResults };
