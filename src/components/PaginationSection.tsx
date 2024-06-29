"use client";

import { useRouter, useSearchParams } from "next/navigation";

function PaginationSection({ lastPage, pageNo, pageSize }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  function handlePrev() {
    if (pageNo > 1) {
      params.set("page", (pageNo - 1).toString());
      router.push(`?${params.toString()}`);
    }
  }

  function handleNext() {
    if (pageNo < lastPage) {
      params.set("page", (pageNo + 1).toString());
      router.push(`?${params.toString()}`);
    }
  }

  function handlePageSizeChange(e) {
    const newSize = parseInt(e.target.value);
    params.set("pageSize", newSize.toString());
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mt-12 p-4 bg-gray-800 flex justify-center gap-4 items-center mb-8">
      <select
        value={pageSize}
        name="page-size"
        className="text-black"
        onChange={handlePageSizeChange}
      >
        {["10", "25", "50"].map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === 1}
        onClick={handlePrev}
      >
        &larr;Prev
      </button>
      <p>
        Page {pageNo} of {lastPage}{" "}
      </p>
      <button
        className="p-3 bg-slate-300 text-black disabled:cursor-not-allowed"
        disabled={pageNo === lastPage}
        onClick={handleNext}
      >
        Next&rarr;
      </button>
    </div>
  );
}

export default PaginationSection;
