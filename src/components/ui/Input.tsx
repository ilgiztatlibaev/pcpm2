import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
};

export default function Input({ className, prefix, suffix, ...props }: InputProps) {
  return (
    <div className={clsx("flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3", props.disabled && "bg-gray-50", className)}>
      {prefix}
      <input className="h-10 w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400" {...props} />
      {suffix}
    </div>
  );
}


