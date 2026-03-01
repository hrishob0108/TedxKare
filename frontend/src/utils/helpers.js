// ==================== STORAGE UTILITIES ====================
// Helper functions for managing localStorage

export const storage = {
  // Save admin token
  setAdminToken: (token) => {
    localStorage.setItem('adminToken', token);
  },

  // Get admin token
  getAdminToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Remove admin token
  removeAdminToken: () => {
    localStorage.removeItem('adminToken');
  },

  // Check if admin is logged in
  isAdminLoggedIn: () => {
    return !!localStorage.getItem('adminToken');
  },

  // Save admin info
  setAdminInfo: (admin) => {
    localStorage.setItem('adminInfo', JSON.stringify(admin));
  },

  // Get admin info
  getAdminInfo: () => {
    const info = localStorage.getItem('adminInfo');
    return info ? JSON.parse(info) : null;
  },

  // Clear all admin data
  clearAdmin: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
  },
};

// ==================== FORMATTING UTILITIES ====================
export const format = {
  // Format date
  date: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Format date and time
  dateTime: (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Capitalize string
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  // Get initials from name
  getInitials: (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  },

  // Format phone number
  phone: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  },
};

// ==================== VALIDATION UTILITIES ====================
export const validate = {
  // Validate email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone
  phone: (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },

  // Validate URL
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate min length
  minLength: (str, min) => {
    return str.trim().length >= min;
  },

  // Validate max length
  maxLength: (str, max) => {
    return str.trim().length <= max;
  },
};

// ==================== CSV EXPORT UTILITY ====================
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += headers.join(',') + '\n';

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Handle values with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvContent += values.join(',') + '\n';
  });

  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);

  // Trigger download
  link.click();

  // Clean up
  document.body.removeChild(link);
};

export default {
  storage,
  format,
  validate,
  exportToCSV,
};
