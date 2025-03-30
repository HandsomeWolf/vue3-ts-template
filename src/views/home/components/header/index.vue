<script setup lang='ts'>
import { InfoFilled, Menu as MenuIcon } from '@element-plus/icons-vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 获取路由实例和当前路由
const router = useRouter()
const route = useRoute()

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

// 导航选项
const navLinks = [
  { name: 'Interactive Maps', path: '/' },
  { name: 'Monthly Emission Monitoring', path: '/emission-monitoring' },
]

// 当前活动的导航项，根据当前路由路径初始化
const activeNavItem = ref('')

// 移动菜单状态
const isMobileMenuOpen = ref(false)
const isMobileView = ref(false)

// 检测窗口宽度变化
function checkMobileView() {
  isMobileView.value = window.innerWidth < 768
  if (!isMobileView.value) {
    isMobileMenuOpen.value = false
  }
}

// 在组件挂载时设置当前活动项
onMounted(() => {
  // 根据当前路径设置活动项
  const currentPath = route.path
  const activeLink = navLinks.find(link => link.path === currentPath)
  if (activeLink) {
    activeNavItem.value = activeLink.name
  }
  else {
    // 默认选中第一项
    activeNavItem.value = navLinks[0].name
  }

  // 检测初始窗口大小
  checkMobileView()

  // 监听窗口大小变化
  window.addEventListener('resize', checkMobileView)
})

onBeforeUnmount(() => {
  // 清除事件监听
  window.removeEventListener('resize', checkMobileView)
})

function toggleSectorInfo() {
  showSectorInfo.value = !showSectorInfo.value
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 导航切换函数
function handleNavigation(path: string, name: string) {
  // 如果点击当前活动项，添加弹跳效果
  if (activeNavItem.value === name) {
    const navItems = document.querySelectorAll('.nav-item')
    navItems.forEach((item) => {
      if (item.textContent?.trim() === name) {
        item.classList.add('pulse-effect')
        setTimeout(() => {
          item.classList.remove('pulse-effect')
        }, 800)
      }
    })
    return
  }

  activeNavItem.value = name
  router.push(path)

  // 如果是移动视图，点击后关闭菜单
  if (isMobileView.value) {
    isMobileMenuOpen.value = false
  }
}
</script>

<template>
  <el-header>
    <div class="header-container">
      <div class="header-top">
        <div class="header-content">
          <h1 class="title">
            Global Methane Monitor
          </h1>
          <div class="description">
            Use the Global Methane Monitor to explore methane policy landscape, pilot mitigation projects, and emission trends in subnational jurisdiction worldwide.
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <div v-if="isMobileView" class="mobile-menu-toggle" @click="toggleMobileMenu">
          <el-icon :size="24">
            <MenuIcon />
          </el-icon>
        </div>
      </div>

      <!-- 导航栏 - 桌面版 -->
      <nav v-if="!isMobileView" class="main-nav">
        <div
          v-for="link in navLinks"
          :key="link.name"
          class="nav-item"
          :class="{ active: activeNavItem === link.name }"
          @click="handleNavigation(link.path, link.name)"
        >
          {{ link.name }}
          <div class="nav-indicator" />
        </div>
      </nav>

      <!-- 导航栏 - 移动版 -->
      <nav v-if="isMobileView" class="mobile-nav" :class="{ 'mobile-nav-open': isMobileMenuOpen }">
        <div
          v-for="link in navLinks"
          :key="link.name"
          class="mobile-nav-item"
          :class="{ 'mobile-nav-active': activeNavItem === link.name }"
          @click="handleNavigation(link.path, link.name)"
        >
          {{ link.name }}
        </div>
      </nav>

      <!-- 部门信息展示 -->
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
    </div>
  </el-header>
</template>

<style lang='scss' scoped>
.el-header {
  padding: 30px 20px;
  background: linear-gradient(to right, #3a8ee6, #5ca9f5);
  color: white;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }

  .header-container {
    display: flex;
    flex-direction: column;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 20px;

    @media (max-width: 768px) {
      padding: 0 5px;
    }
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 25px;
    width: 100%;
  }

  .header-content {
    margin-bottom: 25px;
    max-width: calc(100% - 50px);

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
  }

  .title {
    font-size: 32px;
    margin-bottom: 16px;
    font-weight: bold;
    letter-spacing: 0.5px;

    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 10px;
    }

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }

  .description {
    font-size: 16px;
    margin-bottom: 5px;
    line-height: 1.5;
    max-width: 800px;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 14px;
      line-height: 1.4;
    }
  }
}

/* 导航样式 */
.main-nav {
  display: flex;
  gap: 8px;
  padding: 4px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  align-self: flex-start;
  position: relative;
  margin-bottom: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transform-style: preserve-3d;
  perspective: 800px;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow-x: auto;
  max-width: 100%;

  /* 隐藏滚动条但保留功能 */
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }

  &:hover {
    box-shadow:
      0 6px 28px rgba(0, 0, 0, 0.2),
      inset 0 1px 1px rgba(255, 255, 255, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      140deg,
      rgba(255, 255, 255, 0.5) 10%,
      rgba(255, 255, 255, 0.1) 40%,
      transparent 60%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
}

.nav-item {
  padding: 12px 22px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  letter-spacing: 0.3px;
  overflow: hidden;
  backface-visibility: hidden;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    opacity: 0;
    transform: scale(1.5);
    transition: opacity 0.5s ease, transform 0.5s ease;
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: transform 0.8s ease;
    z-index: 1;
    pointer-events: none;
  }

  &:hover {
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
      transform: scale(1);
    }

    &::after {
      transform: translateX(200%);
    }

    .nav-indicator {
      opacity: 0.8;
      transform: scaleX(0.9);
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.18);
    color: white;
    font-weight: 700;
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 2px 3px rgba(255, 255, 255, 0.2);
    letter-spacing: 0.4px;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
      background: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.1) 70%
      );
    }

    .nav-indicator {
      opacity: 1;
      transform: scaleX(1);
      box-shadow: 0 1px 8px rgba(255, 255, 255, 0.5);
    }
  }

  .nav-indicator {
    position: absolute;
    bottom: 6px;
    left: 18%;
    right: 18%;
    height: 3px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 0.7)
    );
    border-radius: 3px;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    opacity: 0;
    transform: scaleX(0.6);
  }
}

/* 移动端菜单样式 */
.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

.mobile-nav {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);

  &.mobile-nav-open {
    max-height: 300px;
  }
}

.mobile-nav-item {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.mobile-nav-active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;

    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 16px;
      background: white;
      margin-right: 10px;
      border-radius: 2px;
      vertical-align: middle;
    }
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

    @media (max-width: 768px) {
      display: none;
    }
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

/* 增加脉冲动画效果 */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.pulse-effect {
  animation: pulse 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
