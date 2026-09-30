import * as XLSX from 'xlsx';

/**
 * Auto-fit column widths based on cell content
 */
const calculateColWidths = (data) => {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    let maxLen = String(key).length;
    data.forEach((row) => {
      const val = row[key] != null ? String(row[key]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    });
    // Add padding and set min/max boundaries
    return { wch: Math.min(Math.max(maxLen + 4, 14), 45) };
  });
};

/**
 * Exports one or more sheets to an Excel (.xlsx) workbook and triggers browser download
 * @param {Array<{ name: string, data: Array<Object> }>} sheets
 * @param {string} filename
 */
export const exportToExcel = (sheets, filename = 'Hospital_Report') => {
  try {
    const wb = XLSX.utils.book_new();

    sheets.forEach(({ name, data }) => {
      if (!data || data.length === 0) return;

      // Clean sheet name (SheetJS limit is 31 chars, no special characters: \ / ? * : [ ])
      const cleanName = (name || 'Sheet')
        .replace(/[\\/*?:[\]]/g, '_')
        .substring(0, 31);

      const ws = XLSX.utils.json_to_sheet(data);
      ws['!cols'] = calculateColWidths(data);

      XLSX.utils.book_append_sheet(wb, ws, cleanName);
    });

    const safeFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

    // Attempt browser writeFile first
    try {
      XLSX.writeFile(wb, safeFilename);
      return true;
    } catch (writeErr) {
      console.warn('XLSX.writeFile failed, attempting Blob download fallback:', writeErr);
      // Fallback using Blob and anchor click
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    }
  } catch (error) {
    console.error('Error in exportToExcel:', error);
    throw error;
  }
};

/**
 * Exports data to a CSV file and triggers browser download
 * @param {Array<Object>} data
 * @param {string} filename
 */
export const exportToCSV = (data, filename = 'Hospital_Report') => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data provided to export.');
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Error in exportToCSV:', error);
    throw error;
  }
};
