import { onMount, onCleanup, createSignal, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Card, Badge, Chart, Table, Input, Select, Button, QuickFilters } from '../components/UI';
import { MapView } from '../components/Map';
import { PeriodComparison } from '../components/Analytics';
import DriverDetailModal from '../components/Driver/DriverDetailModal';
import { metricsStore, driversStore, alertsStore } from '../stores';
import { exportDriversData, exportAnalyticsData, showExportNotification } from '../utils/export';
import type { DriverWithStats } from '../types/driver';
import styles from './DashboardPage.module.css';

function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = createSignal('');
  const [filterStatus, setFilterStatus] = createSignal<string | null>(null);
  const [filterRegion, setFilterRegion] = createSignal<string | null>(null);
  
  // Dark theme state
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  
  // Map states
  const [showTracks, setShowTracks] = createSignal(false);
  const [showClusters, setShowClusters] = createSignal(false);
  
  // Driver modal state
  const [selectedDriver, setSelectedDriver] = createSignal<DriverWithStats | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  // Debug modal state
  createEffect(() => {
    console.log('🔍 Modal state:', {
      isModalOpen: isModalOpen(),
      selectedDriver: selectedDriver()?.firstName
    });
  });


  // Filtered drivers
  const filteredDrivers = () => {
    let result = driversStore.drivers();
    
    // Search by name/phone
    if (searchQuery()) {
      const query = searchQuery().toLowerCase();
      result = result.filter(driver => 
        driver.firstName.toLowerCase().includes(query) ||
        driver.lastName.toLowerCase().includes(query) ||
        driver.phone.includes(query)
      );
    }
    
    // Filter by status
    if (filterStatus()) {
      result = result.filter(driver => driver.status === filterStatus());
    }
    
    // Filter by region
    if (filterRegion()) {
      result = result.filter(driver => driver.regionCode === filterRegion());
    }
    
    return result;
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode();
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleExportDrivers = (format: 'csv' | 'pdf') => {
    exportDriversData(filteredDrivers(), format);
    showExportNotification(format);
  };

  const handleExportAnalytics = () => {
    exportAnalyticsData();
    showExportNotification('csv');
  };

  const quickFilters = () => [
    {
      key: 'ONLINE',
      label: 'Онлайн',
      icon: '🟢',
      count: driversStore.drivers().filter(d => d.status === 'ONLINE').length,
      active: filterStatus() === 'ONLINE'
    },
    {
      key: 'IDLE',
      label: 'Простой',
      icon: '🟡',
      count: driversStore.drivers().filter(d => d.status === 'IDLE').length,
      active: filterStatus() === 'IDLE'
    },
    {
      key: 'DRIVING',
      label: 'В пути',
      icon: '🔵',
      count: driversStore.drivers().filter(d => d.status === 'DRIVING').length,
      active: filterStatus() === 'DRIVING'
    },
    {
      key: 'AM',
      label: 'Армения',
      icon: '🇦🇲',
      count: driversStore.drivers().filter(d => d.regionCode === 'AM').length,
      active: filterRegion() === 'AM'
    },
    {
      key: 'US',
      label: 'США',
      icon: '🇺🇸',
      count: driversStore.drivers().filter(d => d.regionCode === 'US').length,
      active: filterRegion() === 'US'
    },
    {
      key: 'CN',
      label: 'Китай',
      icon: '🇨🇳',
      count: driversStore.drivers().filter(d => d.regionCode === 'CN').length,
      active: filterRegion() === 'CN'
    }
  ];

  const handleQuickFilterClick = (key: string) => {
    if (['ONLINE', 'IDLE', 'OFFLINE', 'DRIVING'].includes(key)) {
      setFilterStatus(key);
    } else {
      setFilterRegion(key);
    }
  };

  const handleClearAllFilters = () => {
    setFilterStatus(null);
    setFilterRegion(null);
    setSearchQuery('');
  };

  const handleDriverClick = (driver: DriverWithStats) => {
    console.log('🔍 Opening modal for driver:', driver.firstName);
    console.log('🔍 Setting modal state:', {
      driverId: driver.id,
      driverName: driver.firstName,
      willSetModalOpen: true
    });
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleDriverDetail = (driver: DriverWithStats) => {
    navigate(`/driver/${driver.id}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  onMount(() => {
    // Загружаем данные
    metricsStore.fetchKPIMetrics();
    metricsStore.fetchOperationsStats();
    driversStore.fetchDrivers();
    alertsStore.fetchAlerts();

    // Включаем автообновление
    metricsStore.startMetricsUpdate();
    driversStore.subscribeToDriverUpdates();
    alertsStore.subscribeToAlertUpdates();
    
    // Загружаем тему из localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  });

  onCleanup(() => {
    // Останавливаем обновления
    metricsStore.stopMetricsUpdate();
    driversStore.unsubscribeFromDriverUpdates();
    alertsStore.unsubscribeFromAlertUpdates();
  });

  return (
    <div class={styles.container}>
      <div class={styles.header}>
        <div class={styles.headerContent}>
          <div>
            <h1>Dashboard</h1>
            <p>Обзор операций</p>
          </div>
                 <Button 
                   onClick={toggleDarkMode}
                   variant="ghost"
                   size="small"
                   class={styles.themeToggle}
                 >
                   {isDarkMode() ? '☀️' : '🌙'}
                 </Button>
        </div>
      </div>

      <div class={styles.kpiGrid}>
        <Card title="👥 Водителей онлайн" padding="large" shadow="small">
          <div class={styles.kpiValue}>
            {driversStore.driversOnline()}
          </div>
          <div class={styles.kpiLabel}>
            Всего: {driversStore.drivers().length}
          </div>
          <div class={styles.kpiChart}>
            <Chart 
              type="area"
              data={metricsStore.kpiMetrics().drivers_online_trend} 
              color="#34C759"
              height={40}
              showGrid={false}
              showAxis={false}
            />
          </div>
        </Card>

        <Card title="📦 Закрыто адресов" padding="large" shadow="small">
          <div class={styles.kpiValue}>
            {metricsStore.kpiMetrics().completed_addresses}
          </div>
          <div class={styles.kpiLabel}>
            Сегодня
          </div>
          <div class={styles.kpiChart}>
            <Chart 
              type="area"
              data={metricsStore.kpiMetrics().completed_addresses_trend} 
              color="#007AFF"
              height={40}
              showGrid={false}
              showAxis={false}
            />
          </div>
        </Card>

        <Card title="⏱️ Средний простой" padding="large" shadow="small">
          <div class={styles.kpiValue}>
            {metricsStore.kpiMetrics().avg_idle_minutes} мин
          </div>
          <div class={styles.kpiLabel}>
            Статус: {metricsStore.kpiMetrics().idle_status}
          </div>
          <div class={styles.kpiChart}>
            <Chart 
              type="area"
              data={[10, 12, 8, 15, 20, 18, 16]} 
              color={metricsStore.kpiMetrics().idle_status === 'normal' ? '#34C759' : '#FF9500'}
              height={40}
              showGrid={false}
              showAxis={false}
            />
          </div>
        </Card>

        <Card title="🛣️ Всего км" padding="large" shadow="small">
          <div class={styles.kpiValue}>
            {metricsStore.kpiMetrics().total_km.toFixed(1)}
          </div>
          <div class={styles.kpiLabel}>
            За сегодня
          </div>
          <div class={styles.kpiChart}>
            <Chart 
              type="area"
              data={metricsStore.kpiMetrics().total_km_by_hour} 
              color="#FF9500"
              height={40}
              showGrid={false}
              showAxis={false}
            />
          </div>
        </Card>
      </div>


      <div class={styles.quickFiltersSection}>
        <QuickFilters 
          filters={quickFilters()}
          onFilterClick={handleQuickFilterClick}
          onClearAll={handleClearAllFilters}
        />
      </div>

      <div class={styles.comparisonSection}>
        <PeriodComparison />
      </div>

      <div class={styles.mainContent}>
        <Card title="👥 Водители" class={styles.driversCard}>
          <div class={styles.searchPanel}>
            <div class={styles.searchBar}>
              <Input
                type="text"
                placeholder="Поиск водителей..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>
            <div class={styles.filters}>
              <Select
                placeholder="Все статусы"
                value={filterStatus()}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: null, label: 'Все статусы' },
                  { value: 'ONLINE', label: 'Онлайн' },
                  { value: 'OFFLINE', label: 'Офлайн' },
                  { value: 'IDLE', label: 'Простой' },
                  { value: 'DRIVING', label: 'В пути' }
                ]}
              />
              <Select
                placeholder="Все регионы"
                value={filterRegion()}
                onChange={(value) => setFilterRegion(value)}
                options={[
                  { value: null, label: 'Все регионы' },
                  { value: 'AM', label: 'Армения' },
                  { value: 'US', label: 'США' },
                  { value: 'CN', label: 'Китай' }
                ]}
              />
            </div>
            <div class={styles.exportButtons}>
              <Button 
                onClick={() => handleExportDrivers('csv')}
                variant="ghost"
                size="small"
              >
                📊 CSV
              </Button>
              <Button 
                onClick={() => handleExportDrivers('pdf')}
                variant="ghost"
                size="small"
              >
                📄 PDF
              </Button>
              <Button 
                onClick={handleExportAnalytics}
                variant="ghost"
                size="small"
              >
                📈 Аналитика
              </Button>
            </div>
          </div>
          
          {driversStore.drivers().length === 0 ? (
            <div class={styles.empty}>
              <p>Нет данных о водителях</p>
            </div>
          ) : (
            <>
              <div class={styles.resultsInfo}>
                Показано {filteredDrivers().length} из {driversStore.drivers().length} водителей
              </div>
                     <Table
                       columns={[
                         { key: 'name', title: 'Водитель', width: '25%' },
                         { key: 'status', title: 'Статус', width: '15%' },
                         { key: 'addresses', title: 'Адреса', width: '15%' },
                         { key: 'distance', title: 'Км', width: '10%' },
                         { key: 'phone', title: 'Телефон', width: '15%' },
                         { key: 'actions', title: 'Действия', width: '20%' }
                       ]}
                       data={filteredDrivers().map(driver => ({
                         name: () => (
                           <button 
                             class={styles.driverNameBtn}
                             onClick={() => handleDriverClick(driver)}
                             title="Открыть детали"
                           >
                             {driver.firstName} {driver.lastName}
                           </button>
                         ),
                         status: () => <Badge status={driver.status} size="small" />,
                         addresses: `${driver.todayStats?.deliveredStops || 0}/${driver.todayStats?.totalStops || 0}`,
                         distance: (driver.todayStats?.distanceKm || 0).toFixed(1),
                         phone: driver.phone,
                         actions: () => (
                           <div class={styles.actionButtons}>
                             <button 
                               class={styles.actionBtn} 
                               title="Позвонить"
                               onClick={() => window.open(`tel:${driver.phone}`, '_self')}
                             >
                               📞
                             </button>
                             <button 
                               class={styles.actionBtn} 
                               title="Написать"
                               onClick={() => alert(`Отправка сообщения ${driver.firstName}`)}
                             >
                               💬
                             </button>
                             <button 
                               class={styles.actionBtn} 
                               title="Детальная страница"
                               onClick={() => handleDriverDetail(driver)}
                             >
                               👁️
                             </button>
                             <button 
                               class={styles.actionBtn} 
                               title="На карте"
                               onClick={() => alert(`Показать ${driver.firstName} на карте`)}
                             >
                               🗺️
                             </button>
                           </div>
                         )
                       }))}
                     />
            </>
          )}
        </Card>

        <Card title="🚨 Активные алёрты" class={styles.alertsCard}>
          <div class={styles.alertsList}>
            {alertsStore.unacknowledgedAlerts().length === 0 ? (
              <div class={styles.empty}>
                <p>✅ Нет активных алёртов</p>
                <p class={styles.hint}>Все системы работают нормально</p>
              </div>
            ) : (
              alertsStore.unacknowledgedAlerts().map((alert) => (
                <div class={styles.alertItem}>
                  <div class={styles.alertIcon}>
                    <Badge status={alert.severity} size="small" />
                  </div>
                  <div class={styles.alertContent}>
                    <h4 class={styles.alertTitle}>{alert.title}</h4>
                    <p class={styles.alertMessage}>{alert.message}</p>
                    <p class={styles.alertTime}>
                      {new Date(alert.created_at).toLocaleTimeString('ru-RU')}
                    </p>
                  </div>
                  <div class={styles.alertActions}>
                    <button class={styles.alertBtn} title="Закрыть алёрт">
                      ✅
                    </button>
                    <button class={styles.alertBtn} title="Позвонить">
                      📞
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div class={styles.mapSection}>
        <Card title="🗺️ Карта водителей" padding="large">
          <div class={styles.mapControls}>
            <Button 
              onClick={() => setShowTracks(!showTracks())}
              variant="ghost"
              size="small"
            >
              {showTracks() ? 'Скрыть треки' : 'Показать треки'}
            </Button>
            <Button 
              onClick={() => setShowClusters(!showClusters())}
              variant="ghost"
              size="small"
            >
              {showClusters() ? 'Разгруппировать' : 'Группировать'}
            </Button>
          </div>
          <MapView 
            drivers={filteredDrivers()}
            showTracks={showTracks()}
            showClusters={showClusters()}
          />
        </Card>
      </div>

      <div class={styles.analyticsSection}>
        <Card title="📈 Аналитика за сегодня" padding="large">
          <div class={styles.chartsGrid}>
            <div class={styles.chartCard}>
              <h4>Активность по часам</h4>
              <Chart 
                type="line"
                data={[2, 3, 5, 8, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60]}
                height={200}
                color="#007AFF"
                options={{
                  xAxis: {
                    data: Array.from({length: 24}, (_, i) => `${i}:00`)
                  }
                }}
              />
            </div>
            
            <div class={styles.chartCard}>
              <h4>Доставки по часам</h4>
              <Chart 
                type="bar"
                data={[5, 8, 12, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115]}
                height={200}
                color="#34C759"
                options={{
                  xAxis: {
                    data: Array.from({length: 24}, (_, i) => `${i}:00`)
                  }
                }}
              />
            </div>
            
            <div class={styles.chartCard}>
              <h4>Статусы водителей</h4>
              <Chart 
                type="pie"
                data={[
                  { name: 'Онлайн', value: driversStore.driversOnline() },
                  { name: 'Простой', value: driversStore.driversIdle() },
                  { name: 'Офлайн', value: driversStore.drivers().length - driversStore.driversOnline() - driversStore.driversIdle() }
                ]}
                height={200}
                color="#FF9500"
              />
            </div>
            
            <div class={styles.chartCard}>
              <h4>Пробег по часам</h4>
              <Chart 
                type="area"
                data={[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125]}
                height={200}
                color="#FF9500"
                options={{
                  xAxis: {
                    data: Array.from({length: 24}, (_, i) => `${i}:00`)
                  }
                }}
              />
            </div>
          </div>
        </Card>
             </div>

             {/* Driver Detail Modal */}
             {isModalOpen() && selectedDriver() && (
               <DriverDetailModal 
                 driver={selectedDriver()}
                 isOpen={isModalOpen()}
                 onClose={handleCloseModal}
               />
             )}

           </div>
         );
       }

       export default DashboardPage;

