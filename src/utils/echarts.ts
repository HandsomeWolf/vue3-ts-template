import { ElMessage } from "element-plus"

/**
 * 下载图表为图片
 * @param chartInstance ECharts实例
 * @param filename 文件名（不包含扩展名）
 * @param backgroundColor 背景颜色
 */
export function downloadChartAsImage(
    chartInstance: any,
    filename: string = 'chart',
    backgroundColor: string = '#ffffff'
  ): void {
    try {
      if (!chartInstance) {
        ElMessage.warning('无法获取图表实例')
        return
      }
      
      const url = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: backgroundColor,
      })
  
      // 创建一个临时链接元素来下载图片
      const link = document.createElement('a')
      link.download = `${filename}-${new Date().getTime()}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理DOM
      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)
    } catch (error: any) {
      console.error('下载图表失败:', error)
      ElMessage.error(`下载图表失败: ${error.message}`)
    }
  } 