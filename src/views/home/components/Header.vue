<script setup lang='ts'>
import { InfoFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'

// 展开/收起部门信息
const showSectorInfo = ref(false)
const sectorList = [
  { name: 'Biomass/biofuels burning' },
  { name: 'Coal exploitation' },
  { name: 'Fossil Energy Combustion' },
  { name: 'Landfills' },
  { name: 'Livestock' },
  { name: 'Oil and gas exploitation' },
  { name: 'Rice cultivation' },
  { name: 'Wastewater' },
]
const sectorColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399', '#8B5CF6', '#06b6d4', '#d946ef']

function toggleSectorInfo() {
  showSectorInfo.value = !showSectorInfo.value
}
</script>

<template>
  <el-header>
    <h1 class="title">
      Global Methane Monitor
    </h1>
    <div class="description">
      Use the Global Methane Monitor to explore methane policy landscape, pilot mitigation projects, and emission trends in subnational jurisdiction worldwide.
    </div>

    <div class="sector-info-container">
      <div class="sector-header" @click="toggleSectorInfo">
        <span class="sector-title">Emission Sectors</span>
        <el-icon class="sector-icon" :class="{ rotate: showSectorInfo }">
          <InfoFilled />
        </el-icon>
      </div>
      <div class="sector-content" :class="{ expanded: showSectorInfo }">
        <div class="sector-inner">
          <div class="sector-grid">
            <div v-for="(sector, index) in sectorList" :key="index" class="sector-card">
              <div class="sector-color-indicator" :style="{ backgroundColor: sectorColors[index % sectorColors.length] }" />
              <span>{{ sector.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-header>
</template>

<style lang='scss' scoped>
.el-header {
  padding: 30px 20px;
  background: linear-gradient(to right, #3a8ee6, #5ca9f5);
  color: white;

  .title {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;
  }

  .description {
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.5;
    max-width: 800px;
    opacity: 0.9;
  }
}

:deep(.el-header){
  height: auto;
}

.sector-info-container {
  margin-top: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
}

.sector-header {
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;

  &::after {
    content: 'Click to explore';
    position: absolute;
    right: 50px;
    font-size: 12px;
    opacity: 0.8;
    font-weight: normal;
    letter-spacing: 0.5px;
  }

  .sector-title {
    font-weight: 600;
    font-size: 16px;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background-color: #fff;
      margin-right: 10px;
      border-radius: 2px;
    }
  }

  .sector-icon {
    font-size: 18px;
    transition: transform 0.3s ease;

    &.rotate {
      transform: rotate(180deg);
    }
  }
}

.sector-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease;
  padding: 0 15px;

  // 使用内部容器来处理内边距的过渡
  .sector-inner {
    opacity: 0;
    transform: translateY(-10px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    transition-delay: 0.05s;
    padding: 5px 0 15px;
  }

  &.expanded {
    max-height: 600px;

    .sector-inner {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.sector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.sector-card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  letter-spacing: 0.3px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @for $i from 1 through 8 {
    &:nth-child(#{$i}) {
      animation: fadeIn 0.3s ease forwards;
      animation-delay: #{$i * 0.05}s;
      opacity: 0;
    }
  }

  .sector-color-indicator {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    margin-right: 14px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.2);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
