import { onMount, onCleanup, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';
import * as echarts from 'echarts';

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  title?: string;
  height?: number;
  width?: number;
  options?: any;
  color?: string;
  showGrid?: boolean;
  showAxis?: boolean;
}

function Chart(props: ChartProps): JSX.Element {
  let chartContainer: HTMLDivElement | undefined;
  let chartInstance: echarts.ECharts | undefined;

  const getDefaultOptions = () => {
    const baseOptions = {
      grid: {
        show: props.showGrid !== false,
        left: '10%',
        right: '10%',
        top: '10%',
        bottom: '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      },
      color: [props.color || '#007AFF']
    };

    switch (props.type) {
      case 'line':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            show: props.showAxis !== false,
            data: props.data.map((_, index) => index.toString())
          },
          yAxis: {
            type: 'value',
            show: props.showAxis !== false
          },
          series: [{
            type: 'line',
            data: props.data,
            smooth: true,
            symbol: 'none',
            lineStyle: {
              width: 2
            }
          }]
        };

      case 'area':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            show: props.showAxis !== false,
            data: props.data.map((_, index) => index.toString())
          },
          yAxis: {
            type: 'value',
            show: props.showAxis !== false
          },
          series: [{
            type: 'line',
            data: props.data,
            smooth: true,
            symbol: 'none',
            areaStyle: {
              opacity: 0.3
            },
            lineStyle: {
              width: 2
            }
          }]
        };

      case 'bar':
        return {
          ...baseOptions,
          xAxis: {
            type: 'category',
            show: props.showAxis !== false,
            data: props.data.map((_, index) => index.toString())
          },
          yAxis: {
            type: 'value',
            show: props.showAxis !== false
          },
          series: [{
            type: 'bar',
            data: props.data,
            barWidth: '60%',
            itemStyle: {
              borderRadius: [2, 2, 0, 0]
            }
          }]
        };

      case 'pie':
        return {
          ...baseOptions,
          series: [{
            type: 'pie',
            data: props.data,
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {c}'
            }
          }]
        };

      default:
        return baseOptions;
    }
  };

  const initChart = () => {
    if (!chartContainer) return;

    // Проверяем, что контейнер имеет размеры
    const rect = chartContainer.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      // Если размеры еще не готовы, ждем следующий кадр
      requestAnimationFrame(() => {
        initChart();
      });
      return;
    }

    chartInstance = echarts.init(chartContainer);
    
    const options = {
      ...getDefaultOptions(),
      ...props.options
    };

    chartInstance.setOption(options);
  };

  const updateChart = () => {
    if (!chartInstance) return;

    const options = {
      ...getDefaultOptions(),
      ...props.options
    };

    chartInstance.setOption(options, true);
  };

  const handleResize = () => {
    if (chartInstance) {
      chartInstance.resize();
    }
  };

  onMount(() => {
    // Добавляем небольшую задержку для модальных окон
    setTimeout(() => {
      initChart();
    }, 100);
    
    // Добавляем обработчик изменения размера
    window.addEventListener('resize', handleResize);
  });

  createEffect(() => {
    updateChart();
  });

  onCleanup(() => {
    window.removeEventListener('resize', handleResize);
    if (chartInstance) {
      chartInstance.dispose();
    }
  });

  return (
    <div 
      ref={chartContainer}
      style={{
        width: props.width ? `${props.width}px` : '100%',
        height: `${props.height || 200}px`
      }}
    />
  );
}

export default Chart;
