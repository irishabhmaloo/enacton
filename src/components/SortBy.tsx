"use client";

import { useRouter, useSearchParams } from "next/navigation";

const sortingOptions = [
  { value: "price-asc", label: "Sort by price(asc)" },
  { value: "price-desc", label: "Sort by price(desc)" },
  { value: "created_at-asc", label: "Sort by created at(asc)" },
  { value: "created_at-desc", label: "Sort by created at(desc)" },
  { value: "rating-asc", label: "Sort by rating (asc)" },
  { value: "rating-desc", label: "Sort by rating (desc)" },
];

function SortBy() {
  const router = useRouter();
  const params = useSearchParams();
  const searchParams = new URLSearchParams(params);

  return (
    <div className="text-black flex gap-2">
      <p className="text-white text-lg">Sort By</p>
      <select
        name="sorting"
        id="sorting"
        value={String(searchParams.get("sortBy"))}
        onChange={(e) => {
          // alert("Please update the code.");
          const selectedSortOption = e.target.value;
          searchParams.set("sortBy", selectedSortOption);
          const updatedUrl = `${window.location.pathname}?${searchParams.toString()}`;
          router.push(updatedUrl);

        }}
      >
        <option value="">None</option>
        {sortingOptions.map((option, i) => {
          return (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default SortBy;
