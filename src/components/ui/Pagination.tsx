import React from "react";
import Button from "./Button";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, pageSize, total, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pages;
  return (
    <div className="flex items-center justify-end gap-2 py-2">
      <Button variant="secondary" disabled={!canPrev} onClick={() => onChange(page - 1)}>
        Назад
      </Button>
      <span className="text-sm text-gray-600">
        Стр. {page} из {pages}
      </span>
      <Button variant="secondary" disabled={!canNext} onClick={() => onChange(page + 1)}>
        Вперёд
      </Button>
    </div>
  );
}


