"use client";

import { useState, useEffect } from "react";

interface Column<T = any> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  mobileHeader?: boolean;
}

interface ResponsiveTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  className?: string;
  mobileBreakpoint?: number;
}

export function ResponsiveTable<T>({
  columns,
  data,
  keyField,
  className = "",
  mobileBreakpoint = 768,
}: ResponsiveTableProps<T>) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [mobileBreakpoint]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (isMobile) {
    return (
      <div className={`space-y-2 ${className}`}>
        {data.map((item: any) => {
          const itemKey = String(item[keyField]);
          const firstColumn = columns[0];
          
          return (
            <div
              key={itemKey}
              className="bg-dark-secondary rounded-lg overflow-hidden border border-custom"
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleRow(itemKey)}
              >
                <div className="flex-1">
                  {firstColumn.render 
                    ? firstColumn.render(item[firstColumn.key], item)
                    : item[firstColumn.key]}
                </div>
                <div className="ml-4">
                  <i
                    className={`fas fa-chevron-${expandedRow === itemKey ? "up" : "down"} text-gray-400`}
                  ></i>
                </div>
              </div>
              
              {expandedRow === itemKey && (
                <div className="p-4 pt-0 border-t border-custom">
                  {columns.slice(1).map((column) => (
                    <div key={column.key} className="flex justify-between py-2">
                      <span className="text-gray-400">{column.header}:</span>
                      <span className="text-right">
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop view
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-custom">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-4 ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any) => (
            <tr
              key={String(item[keyField])}
              className="border-b border-custom hover:bg-dark-tertiary transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="py-3 px-4">
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
