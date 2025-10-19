/**
 * useTableSorting Hook Tests
 * Tests para el hook genérico de sorting de tablas
 */

import { renderHook, act } from '@testing-library/react';
import { useTableSorting } from '@/hooks/useTableSorting';

interface TestItem {
  id: number;
  name: string;
  value: number;
}

const mockData: TestItem[] = [
  { id: 1, name: 'Charlie', value: 30 },
  { id: 2, name: 'Alice', value: 10 },
  { id: 3, name: 'Bob', value: 20 },
];

describe('useTableSorting', () => {
  it('should sort by name ascending by default', () => {
    const { result } = renderHook(() =>
      useTableSorting({
        data: mockData,
        defaultSortField: 'name',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    expect(result.current.sortedData[0].name).toBe('Alice');
    expect(result.current.sortedData[1].name).toBe('Bob');
    expect(result.current.sortedData[2].name).toBe('Charlie');
  });

  it('should sort by value ascending', () => {
    const { result } = renderHook(() =>
      useTableSorting<TestItem, 'name' | 'value'>({
        data: mockData,
        defaultSortField: 'value',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    expect(result.current.sortedData[0].value).toBe(10);
    expect(result.current.sortedData[1].value).toBe(20);
    expect(result.current.sortedData[2].value).toBe(30);
  });

  it('should toggle sort direction on same field', () => {
    const { result } = renderHook(() =>
      useTableSorting({
        data: mockData,
        defaultSortField: 'name',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    // Initially ascending
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedData[0].name).toBe('Alice');

    // Toggle to descending
    act(() => {
      result.current.handleSort('name' as any);
    });

    expect(result.current.sortDirection).toBe('desc');
    expect(result.current.sortedData[0].name).toBe('Charlie');
  });

  it('should change sort field and reset to ascending', () => {
    const { result } = renderHook(() =>
      useTableSorting({
        data: mockData,
        defaultSortField: 'name',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    // Change to value field
    act(() => {
      result.current.handleSort('value' as any);
    });

    expect(result.current.sortField).toBe('value');
    expect(result.current.sortDirection).toBe('asc');
    expect(result.current.sortedData[0].value).toBe(10);
  });

  it('should handle empty data', () => {
    const { result } = renderHook(() =>
      useTableSorting<TestItem, 'name' | 'value'>({
        data: [],
        defaultSortField: 'name',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    expect(result.current.sortedData).toEqual([]);
  });

  it('should handle single item', () => {
    const singleItem = [{ id: 1, name: 'Only', value: 100 }];
    const { result } = renderHook(() =>
      useTableSorting({
        data: singleItem,
        defaultSortField: 'name',
        getSortValue: (item, field) => {
          if (field === 'name') return item.name.toLowerCase();
          return item.value;
        },
      })
    );

    expect(result.current.sortedData).toEqual(singleItem);
  });
});
