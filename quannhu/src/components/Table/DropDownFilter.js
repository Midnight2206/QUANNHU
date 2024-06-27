import React, { useMemo } from 'react';

const SelectFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  const options = useMemo(() => {
    const uniqueValues = new Set();
    preFilteredRows.forEach((row) => {
      const cellValue = row.values[id];

      // Xử lý trường hợp nhiều dòng dữ liệu trùng lặp
      if (Array.isArray(cellValue)) {
        cellValue.forEach((value) => {
          uniqueValues.add(value);
        });
      } else {
        uniqueValues.add(cellValue);
      }
    });

    return ['All', ...uniqueValues];
  }, [id, preFilteredRows]);

  return (
    <select
      value={filterValue || 'All'}
      onChange={(e) => {
        setFilter(e.target.value === 'All' ? undefined : e.target.value);
      }}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;