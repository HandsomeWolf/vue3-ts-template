<script setup lang='ts'>
// 页脚组件不需要特殊逻辑
</script>

<template>
  <el-footer>
    <div class="footer-container">
      <div class="footer-section">
        <div class="footer-logo">Global Methane Monitor</div>
        <div class="footer-description">
          A comprehensive platform for tracking methane emissions, policies, and mitigation projects worldwide.
        </div>
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-content">
        <div class="footer-column">
          <h3 class="footer-title">Disclaimer</h3>
          <p>Data subject to updates and change over time. Emission data is provided by 2022 and policy and project data is provided by 2024.</p>
          <p>How to Cite the Data: [specific text TBD]</p>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-title">Research Team</h3>
          <p>California-China Climate Institute, University of California, Berkeley: Fan Dai, Rixin Zhu, Jessica Gordon</p>
          <p>Hong Kong University: Yuyu Zhou, Fengxiang Guo</p>
        </div>
        
        <div class="footer-column">
          <h3 class="footer-title">Information</h3>
          <ul class="footer-list">
            <li><span class="footer-list-title">Updates:</span> CCCI will post notes about webpage updates periodically</li>
            <li><span class="footer-list-title">Data Sources:</span> Text TBD</li>
            <li><span class="footer-list-title">Acknowledgments:</span> We would like to thank Prof. Yuyu Zhou and Dr. Fengxiang Guo for sharing their data.</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-copyright">© 2025 Global Methane Monitor. All rights reserved.</div>
      </div>
    </div>
  </el-footer>
</template>

<style lang='scss' scoped>
.el-footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 0;
  margin-top: 40px;
}



.footer-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 20px 20px;
}

.footer-section {
  margin-bottom: 30px;
}

.footer-logo {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  color: #fff;
}

.footer-description {
  font-size: 15px;
  line-height: 1.5;
  opacity: 0.8;
  max-width: 600px;
}

.footer-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 20px 0 30px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.footer-column {
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.7;
  }
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #4fc3f7;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #4fc3f7;
  }
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.7;
  }
  
  .footer-list-title {
    font-weight: 600;
    color: #fff;
    opacity: 0.9;
    margin-right: 6px;
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.footer-copyright {
  font-size: 14px;
  opacity: 0.6;
  
  @media (max-width: 768px) {
    margin-bottom: 15px;
  }
}
</style> 