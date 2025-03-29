/**
 * Excel 导出相关工具函数
 */
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'

/**
 * 将数据导出为Excel文件
 * @param data 要导出的数据
 * @param filename 文件名（不包含扩展名）
 * @param sheetName 工作表名称
 * @returns void
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string = 'exported-data',
  sheetName: string = 'Sheet1'
): void {
  try {
    if (!data || data.length === 0) {
      ElMessage.warning('没有可导出的数据')
      return
    }

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    
    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data)
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(wb, ws, sheetName)
    
    // 生成Excel文件并下载
    XLSX.writeFile(wb, `${filename}-${new Date().getTime()}.xlsx`)
    
    ElMessage({
      type: 'success',
      message: '数据导出成功',
    })
  } catch (error: any) {
    console.error('导出失败:', error)
    ElMessage.error(`导出失败: ${error.message}`)
  }
}

/**
 * 将对象数组转换为可导出的格式
 * @param data 原始数据数组
 * @param fieldMapping 字段映射 { 原字段名: 目标字段名 }
 * @returns 转换后的数据数组
 */
export function transformExportData<T extends Record<string, any>>(
  data: T[],
  fieldMapping: Record<string, string>
): Record<string, any>[] {
  return data.map(item => {
    const exportItem: Record<string, any> = {}
    
    // 按照映射关系转换字段
    Object.entries(fieldMapping).forEach(([sourceKey, targetKey]) => {
      if (item[sourceKey] !== undefined) {
        exportItem[targetKey] = item[sourceKey]
      }
    })
    
    return exportItem
  })
}