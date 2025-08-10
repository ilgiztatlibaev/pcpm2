import React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select(props: Props) {
  return (
    <select
      {...props}
      className={`h-10 rounded-md border border-gray-300 bg-white px-3 text-gray-900 ${props.className ?? ""}`}
    />
  );
}


