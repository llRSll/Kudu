/**
 * A generic utility function to convert data to CSV format and download it.
 * 
 * @param data - Array of objects to convert to CSV
 * @param filename - Name of the file to download (without extension)
 * @param options - Additional options for CSV generation
 */
export interface ExportToCsvOptions {
  /** Headers to include in CSV. If not provided, object keys will be used */
  headers?: string[];
  /** Custom delimiter (defaults to comma) */
  delimiter?: string;
  /** Date format options for date fields */
  dateFormat?: Intl.DateTimeFormatOptions;
  /** Locale for formatting (defaults to 'en-US') */
  locale?: string;
  /** Whether to include header row (defaults to true) */
  includeHeaders?: boolean;
}

export function exportToCsv<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export',
  options: ExportToCsvOptions = {}
): void {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Default options
  const {
    headers = Object.keys(data[0]),
    delimiter = ',',
    dateFormat = { year: 'numeric', month: 'numeric', day: 'numeric' },
    locale = 'en-US',
    includeHeaders = true,
  } = options;

  try {
    // Process CSV content
    let csvContent = '';

    // Add headers row if requested
    if (includeHeaders) {
      csvContent += headers.join(delimiter) + '\n';
    }

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        if (value === null || value === undefined) {
          return '';
        }
        
        // Format date objects
        if (value instanceof Date) {
          return `"${value.toLocaleDateString(locale, dateFormat)}"`;
        }
        
        // Format numbers
        if (typeof value === 'number') {
          return value.toString();
        }

        // Handle strings and other values
        const cellValue = String(value).replace(/"/g, '""');
        return `"${cellValue}"`;
      });

      csvContent += row.join(delimiter) + '\n';
    });

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    // Append to document, trigger click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error(`Failed to export CSV: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Formats data specifically for cash flow exports, handling the expected structure.
 * 
 * @param data - Cash flow data to export
 * @param filename - Output filename
 * @param period - Time period label (e.g., "Last 6 months")
 * @param propertyType - Property type filter
 */
export function exportCashFlowToCsv<T extends Record<string, any>>(
  data: T[],
  filename: string = 'cash-flow-report',
  period: string = 'All time',
  propertyType: string = 'All Types'
): void {
  // Prepare filename with date
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const fullFilename = `${filename}-${formattedDate}`;
  
  // Define headers for the cash flow data
  const customHeaders = ['date', 'description', 'transactionType', 'type', 'amount', 'maintenanceType'];
  
  // Export with custom settings for cash flow data
  exportToCsv(data, fullFilename, {
    headers: customHeaders,
    dateFormat: { year: 'numeric', month: 'long', day: 'numeric' }
  });
}
