/**
 * CreatorOS - Main JavaScript
 * 自媒体操盘手操作系统
 */

(function() {
  'use strict';

  // ==========================================================================
  // Mobile Navigation
  // ==========================================================================
  
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  function toggleMobileMenu() {
    if (!mobileMenuBtn || !mobileNav) return;
    
    const isActive = mobileNav.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (!mobileNav) return;
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // Scroll Animations
  // ==========================================================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (!animatedElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.classList.add(`animate-${entry.target.dataset.animate}`);
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // ==========================================================================
  // Form Checkbox/Radio Selection
  // ==========================================================================

  function initFormChecks() {
    document.querySelectorAll('.form-check').forEach(check => {
      check.addEventListener('click', function() {
        const input = this.querySelector('input');
        if (!input) return;

        if (input.type === 'radio') {
          // For radio, deselect siblings
          const name = input.name;
          document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.form-check')?.classList.remove('selected');
          });
        }

        input.checked = !input.checked;
        this.classList.toggle('selected', input.checked);
      });
    });
  }

  // ==========================================================================
  // Local Storage for Data Persistence
  // ==========================================================================

  const Storage = {
    prefix: 'creatorOS_',

    set(key, value) {
      try {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(this.prefix + key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Storage error:', e);
        return defaultValue;
      }
    },

    remove(key) {
      localStorage.removeItem(this.prefix + key);
    },

    clear() {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
    }
  };

  // ==========================================================================
  // Module 1: Positioning & Monetization
  // ==========================================================================

  const Positioning = {
    data: {
      hasProduct: null,
      productType: null,
      monetization: null,
      advantages: [],
      economyModel: null
    },

    init() {
      this.loadData();
      this.bindEvents();
    },

    loadData() {
      this.data = Storage.get('positioning', this.data);
    },

    saveData() {
      Storage.set('positioning', this.data);
    },

    bindEvents() {
      // Product selection
      document.querySelectorAll('[data-product]').forEach(el => {
        el.addEventListener('click', () => {
          this.data.hasProduct = el.dataset.product === 'yes';
          this.updateUI();
          this.saveData();
        });
      });

      // Advantages checkboxes
      document.querySelectorAll('[data-advantage]').forEach(el => {
        el.addEventListener('click', () => {
          const advantage = el.dataset.advantage;
          const index = this.data.advantages.indexOf(advantage);
          if (index > -1) {
            this.data.advantages.splice(index, 1);
          } else {
            this.data.advantages.push(advantage);
          }
          this.saveData();
        });
      });
    },

    updateUI() {
      // Update recommendation based on selections
      const recommendationEl = document.getElementById('monetization-recommendation');
      if (!recommendationEl) return;

      if (this.data.hasProduct === true) {
        recommendationEl.textContent = '推荐：引流到店 或 带货销售';
      } else if (this.data.hasProduct === false) {
        recommendationEl.textContent = '推荐：单品类带货切入';
      }
    }
  };

  // ==========================================================================
  // Module 2: Topic & Script Engine
  // ==========================================================================

  const ScriptEngine = {
    elements: [
      { id: 'cost', name: '成本', desc: '极限预算挑战', template: '花___块钱做___' },
      { id: 'crowd', name: '人群', desc: '精准人群定位', template: '___必备/专属___' },
      { id: 'weird', name: '奇葩', desc: '反常理现象', template: '___上合理但有病的___' },
      { id: 'worst', name: '最差', desc: '极端负面案例', template: '挑战吃/用/买评分最低的___' },
      { id: 'contrast', name: '反差', desc: '身份年龄错位', template: '带___做___' },
      { id: 'nostalgia', name: '怀旧', desc: '集体记忆触发', template: '___年前的___' },
      { id: 'hormone', name: '荷尔蒙', desc: '两性吸引力', template: '让___沦陷的___' },
      { id: 'celebrity', name: '头牌', desc: '名人权威背书', template: '___同款/推荐的___' }
    ],

    scriptTypes: [
      { id: 'process', name: '晒过程', desc: '产品展示、服务可视化', distance: '最近' },
      { id: 'knowledge', name: '教知识', desc: '专业展示、干货输出', distance: '中' },
      { id: 'story', name: '讲故事', desc: '品牌塑造、情感连接', distance: '远' },
      { id: 'opinion', name: '聊观点', desc: '引发争议、展现态度', distance: '中' }
    ],

    generateTopic(baseTopic, selectedElements) {
      // Simple topic enhancement
      let enhanced = baseTopic;
      selectedElements.forEach(el => {
        const element = this.elements.find(e => e.id === el);
        if (element) {
          // Add element hint
          enhanced = `【${element.name}】${enhanced}`;
        }
      });
      return enhanced;
    }
  };

  // ==========================================================================
  // Module 3: Material Library
  // ==========================================================================

  const MaterialLibrary = {
    categories: ['选题', '开篇金句', '文案结构', '呈现形式'],
    
    materials: Storage.get('materials', []),

    add(material) {
      material.id = Date.now();
      material.createdAt = new Date().toISOString();
      this.materials.push(material);
      this.save();
      return material;
    },

    remove(id) {
      this.materials = this.materials.filter(m => m.id !== id);
      this.save();
    },

    getByCategory(category) {
      return this.materials.filter(m => m.category === category);
    },

    save() {
      Storage.set('materials', this.materials);
    },

    search(query) {
      const q = query.toLowerCase();
      return this.materials.filter(m => 
        m.title?.toLowerCase().includes(q) || 
        m.content?.toLowerCase().includes(q)
      );
    }
  };

  // ==========================================================================
  // Module 4: Publish & Review
  // ==========================================================================

  const PublishReview = {
    checklistItems: [
      { id: 'hook', label: '前3秒体现三有原则', category: '内容' },
      { id: 'reason', label: '包含成交理由', category: '内容' },
      { id: 'cta', label: '有明确行动号召', category: '内容' },
      { id: 'cover', label: '封面标题有吸引力', category: '内容' },
      { id: 'original', label: '无抄袭搬运', category: '合规' },
      { id: 'authentic', label: '无虚假人设', category: '合规' },
      { id: 'neutral', label: '无群体对立言论', category: '合规' },
      { id: 'safe', label: '无敏感违规词', category: '合规' }
    ],

    metrics: {
      completion: { label: '完播率', pass: 30, good: 50 },
      like: { label: '点赞率', pass: 3, good: 8 },
      comment: { label: '评论率', pass: 0.5, good: 2 },
      share: { label: '转发率', pass: 0.3, good: 1 }
    },

    calculateScore(values) {
      let score = 0;
      Object.keys(values).forEach(key => {
        const metric = this.metrics[key];
        if (values[key] >= metric.good) {
          score += 25;
        } else if (values[key] >= metric.pass) {
          score += 15;
        }
      });
      return score;
    }
  };

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  function formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================================================
  // Initialize
  // ==========================================================================

  document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initFormChecks();
    
    // Initialize modules based on current page
    if (document.querySelector('.positioning-page')) {
      Positioning.init();
    }
  });

  // Export to global scope
  window.CreatorOS = {
    Storage,
    Positioning,
    ScriptEngine,
    MaterialLibrary,
    PublishReview,
    formatDate,
    debounce
  };

})();
