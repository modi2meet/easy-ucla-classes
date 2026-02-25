import classNames from "classnames";
import { forwardRef, JSX } from "react";

type InputProps = JSX.IntrinsicElements["input"];

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...restProps },
  ref,
) {
  return (
    <input
      ref={ref}
      className={classNames(
        "p-4 outline-none text-center text-2xl text-notion-text",
        "font-bold disabled:bg-white rounded-lg transition-all border border-notion-border focus:border-notion-accent hover:border-notion-accent",
        className,
      )}
      {...restProps}
    />
  );
});

export { Input };
