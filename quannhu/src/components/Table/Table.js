import React, { useMemo } from 'react';
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';

// Tạo một bảng component
function FilterableTable() {
  const ColumnFilter = (column) => {
    const { filterValue, setFilter } = column;
  
  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Filter ${column.Header}`}
    />
  );
  }
  // Khởi tạo table instance sử dụng useTable hook
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
    ],
    []
  );

  const data = useMemo(
    () => [
      { name: 'John Doe', age: 25, location: 'New York' },
      { name: 'Jane Smith', age: 32, location: 'Los Angeles' },
      { name: 'Tom Jones', age: 45, location: 'Chicago' },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter
  );

  // Destructuring state để sử dụng global filter
  const { globalFilter } = state;

  // Hàm debounce cho việc tìm kiếm
  const debouncedSetGlobalFilter = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);

  // Render UI
  return (
    <>
      <input
        value={globalFilter || ''}
        onChange={e => {
          debouncedSetGlobalFilter(e.target.value);
        }}
        placeholder="Search..."
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// Example Component sử dụng Table component


export default FilterableTable;