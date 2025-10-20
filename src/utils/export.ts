import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import type { DriverWithStats } from '../types/driver';

export const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportToPDF = (data: any[], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Заголовок
  doc.setFontSize(20);
  doc.text(title, 14, 22);
  
  // Дата экспорта
  doc.setFontSize(10);
  doc.text(`Экспортировано: ${new Date().toLocaleString('ru-RU')}`, 14, 30);
  
  // Таблица
  const tableData = data.map(item => [
    item.name || '',
    item.status || '',
    item.addresses || '',
    item.distance || '',
    item.phone || '',
    item.region || ''
  ]);
  
  autoTable(doc, {
    head: [['Водитель', 'Статус', 'Адреса', 'Км', 'Телефон', 'Регион']],
    body: tableData,
    startY: 40,
    styles: {
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [0, 122, 255],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    },
    margin: { top: 40 }
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportDriversData = (drivers: DriverWithStats[], format: 'csv' | 'pdf') => {
  const data = drivers.map(driver => ({
    name: `${driver.first_name} ${driver.last_name}`,
    status: getStatusText(driver.status),
    addresses: `${driver.todayStats?.deliveredStops || 0}/${driver.todayStats?.totalStops || 0}`,
    distance: (driver.todayStats?.distanceKm || 0).toFixed(1),
    phone: driver.phone,
    region: getRegionText(driver.region || ''),
    hub: driver.hub_id,
    idleTime: `${driver.todayStats?.idleTimeMinutes || 0} мин`,
    issues: driver.todayStats?.issuesCount || 0
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  
  if (format === 'csv') {
    exportToCSV(data, `drivers_${timestamp}`);
  } else {
    exportToPDF(data, `drivers_${timestamp}`, 'Отчет по водителям');
  }
};

export const exportAnalyticsData = () => {
  const analyticsData = {
    date: new Date().toLocaleDateString('ru-RU'),
    kpi: {
      drivers_online: 8,
      completed_addresses: 45,
      avg_idle_minutes: 12,
      total_km: 234.5
    },
    charts: {
      activity_by_hour: Array.from({length: 24}, (_, i) => ({ hour: i, value: Math.random() * 100 })),
      deliveries_by_hour: Array.from({length: 24}, (_, i) => ({ hour: i, value: Math.random() * 50 })),
      distance_by_hour: Array.from({length: 24}, (_, i) => ({ hour: i, value: Math.random() * 20 }))
    }
  };

  const csv = Papa.unparse([
    { metric: 'Водителей онлайн', value: analyticsData.kpi.drivers_online },
    { metric: 'Закрыто адресов', value: analyticsData.kpi.completed_addresses },
    { metric: 'Средний простой (мин)', value: analyticsData.kpi.avg_idle_minutes },
    { metric: 'Всего км', value: analyticsData.kpi.total_km }
  ]);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getStatusText = (status: string) => {
  const statusTexts = {
    ONLINE: 'Онлайн',
    DRIVING: 'В пути',
    IDLE: 'Простой',
    OFFLINE: 'Офлайн'
  };
  return statusTexts[status as keyof typeof statusTexts] || status;
};

const getRegionText = (region: string) => {
  const regionTexts = {
    AM: 'Армения',
    US: 'США',
    CN: 'Китай'
  };
  return regionTexts[region as keyof typeof regionTexts] || region;
};

export const showExportNotification = (format: string) => {
  // Создаем уведомление
  const notification = document.createElement('div');
  notification.className = 'export-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">✅</span>
      <span class="notification-text">Данные экспортированы в ${format.toUpperCase()}</span>
    </div>
  `;
  
  // Стили для уведомления
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #34C759;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    animation: slideIn 0.3s ease;
  `;
  
  // Добавляем анимацию
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 300);
  }, 3000);
};
