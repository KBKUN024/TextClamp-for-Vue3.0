<script setup lang="ts">
import Card from "./components/Card.vue";
import { ref, computed } from "vue";

// 导入ButtonType类型
type ButtonType = 'tight' | 'one-line';
type ButtonAlign = 'left' | 'right';

// 使用一个统一的文本作为示例内容
const sampleText = ref("The ETH upgrade timeline has never been clear. The end of December last year, as well as June and August this year, are all hazy dates. This time, the core developers have provided a clear date, market confidence has increased, and the voice is loud, and Ethereum has been impacted. There are two voices on Ethereum 2.0 in the market, with hundreds of billions of dollars at stake. The first is to be pessimistic, thinking that the introduction of 2.0 with cheap gas fees and large processing capacity will allow more projects to settle in Ethereum, and that the expansion of ETH's demand would raise the price of ETH. The second option is to remain solidly bearish. Following 2.0, a large number of ETHs were freed, and mass selling and homogenization rivalry became more intense.");

// 简短文本示例
const shortText = ref("The ETH upgrade timeline has never been clear. The end of December last year, as well as June and August this year, are all hazy dates. This time, the core developers have provided a clear date, market confidence has increased.");

// 示例源代码
const exampleSourceCodes = {
  basic: `<template>
  <!-- Default 3-line clamp with standard expand/collapse buttons -->
  <TextClamp :text="text" />
</template>
<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>
`,
  customLines: `<template>
  <!-- Customize the number of lines to display-->
  <TextClamp :text="text" :lines="4" />
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>`,
  oneLineButton: `<template>
  <!-- Button displayed on a separate line (default right align) -->
  <TextClamp 
    :text="text" 
    buttonType="one-line" 
  />
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>`,
  customButtonText: `<template>
  <!-- Customized expand/collapse button labels -->
  <TextClamp 
    :text="text" 
    expandText="Read More" 
    collapseText="Show Less" 
  />
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>`,
  customButton: `<template>
  <!-- Fully customized button with slot -->
  <TextClamp :text="text" buttonType="tight">
    <template #expandButton="{ toggle, isExpanded, buttonType }">
      <button 
        class="custom-button" 
        :class="{ 'custom-button--tight': buttonType === 'tight' }"
        @click="toggle"
        :title="isExpanded ? 'Collapse' : 'Expand'">
        {{ isExpanded ? '↑ Collapse' : '↓ Expand' }}
      </button>
    </template>
</TextClamp>
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>

<style scoped>
.custom-button {
  background-color: purple;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.custom-button--tight {
  margin-left: 8px;
  vertical-align: middle;
}
</style>`,
  longButtonText: `<template>
  <!-- Testing text truncation with very long button text -->
  <TextClamp 
    :text="text" 
    expandText="Click here to see more content..." 
    collapseText="Click here to hide the additional content..."
    :maxButtonTextLength="35"
  />
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>`,
  leftAlignedButton: `<template>
  <!-- One-line button aligned to the left -->
  <TextClamp 
    :text="text" 
    buttonType="one-line"
    buttonAlign="left"
  />
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>`,
  customOneLineButton: `<template>
  <!-- Custom button with one-line style and left alignment -->
  <TextClamp 
    :text="text" 
    buttonType="one-line"
    buttonAlign="left"
  >
    <template #expandButton="{ toggle, isExpanded, buttonType, buttonAlign }">
      <button 
        class="custom-button" 
        :class="{ 
          'custom-button--one-line': buttonType === 'one-line',
          'custom-button--align-left': buttonAlign === 'left'
        }"
        @click="toggle"
        :title="isExpanded ? 'Collapse' : 'Expand'">
        {{ isExpanded ? '↑ 收起' : '↓ 展开' }}
      </button>
    </template>
</TextClamp>
</template>

<script setup>
import TextClamp from 'textclamp-vue3';
import { ref } from 'vue';

const text = ref("Very long text...");
<\/script>

<style scoped>
.custom-button {
  background-color: purple;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.custom-button--one-line {
  margin-top: 8px;
  display: block;
}

.custom-button--align-left {
  margin-right: auto;
}
</style>`
};

// 卡片数据配置，便于复用和管理
const exampleCards = computed(() => [
  {
    id: 1,
    title: "1. Basic Usage",
    description: "Default 3-line clamp with standard expand/collapse buttons",
    props: { text: sampleText.value },
    sourceCode: exampleSourceCodes.basic
  },
  {
    id: 2,
    title: "2. Custom Lines (4 lines)",
    description: "Customize the number of lines to display",
    props: { text: sampleText.value, lines: 4 },
    sourceCode: exampleSourceCodes.customLines
  },
  {
    id: 3,
    title: "3. One-line Button Style",
    description: "Button displayed on a separate line (default right align)",
    props: { text: sampleText.value, buttonType: 'one-line' as ButtonType },
    sourceCode: exampleSourceCodes.oneLineButton
  },
  {
    id: 4,
    title: "4. Custom Button Text",
    description: "Customized expand/collapse button labels",
    props: { text: shortText.value, expandText: "Read More", collapseText: "Show Less" },
    sourceCode: exampleSourceCodes.customButtonText
  },
  {
    id: 5,
    title: "5. Custom Button",
    description: "Fully customized button with slot",
    props: { text: sampleText.value, buttonType: 'tight' as ButtonType },
    customButton: true,
    sourceCode: exampleSourceCodes.customButton
  },
  {
    id: 6,
    title: "6. Long Button Text",
    description: "Testing text truncation with very long button text",
    props: {
      text: sampleText.value,
      expandText: "Click here to see more content...",
      collapseText: "Click here to hide the additional content...",
      maxButtonTextLength: 35 // 自定义按钮文本最大长度
    },
    sourceCode: exampleSourceCodes.longButtonText
  },
  {
    id: 7,
    title: "7. Left-aligned Button",
    description: "One-line button aligned to the left",
    props: {
      text: sampleText.value,
      buttonType: 'one-line' as ButtonType,
      buttonAlign: 'left' as ButtonAlign
    },
    sourceCode: exampleSourceCodes.leftAlignedButton
  },
  {
    id: 8,
    title: "8. Custom One-line Button",
    description: "Custom button with one-line style and left alignment",
    props: {
      text: sampleText.value,
      buttonType: 'one-line' as ButtonType,
      buttonAlign: 'left' as ButtonAlign
    },
    customButton: true,
    sourceCode: exampleSourceCodes.customOneLineButton
  }
]);
</script>

<template>
  <div class="app-container">
    <div class="container">
      <header class="header">
        <h1 class="heading">TextClamp Component</h1>
        <p class="description">A Vue 3 component for clamping text with customizable expand/collapse functionality</p>
      </header>

      <main class="main-content">
        <h2 class="subheading">Examples</h2>

        <div class="examples">
          <!-- 使用v-for循环渲染卡片，避免重复代码 -->
          <Card v-for="card in exampleCards" :key="card.id" class="example-card" :sourceCode="card.sourceCode">
            <template #banner>
              <img src="./assets/image3.webp" :alt="`Example ${card.id}`" class="banner-image" />
            </template>
            <template #description>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-subtitle">{{ card.description }}</p>

              <div class="text-clamp-wrapper">
                <!-- 自定义按钮示例 -->
                <TextClamp v-if="card.customButton" v-bind="card.props">
                  <template
                    #expandButton="{ toggle, isExpanded, buttonType, buttonAlign, limitedExpandText, limitedCollapseText }">
                    <button class="custom-button" :class="{
                      'custom-button--tight': (buttonType as string) === 'tight',
                      'custom-button--one-line': (buttonType as string) === 'one-line',
                      'custom-button--align-right': (buttonType as string) === 'one-line' && (buttonAlign as string) === 'right',
                      'custom-button--align-left': (buttonType as string) === 'one-line' && (buttonAlign as string) === 'left'
                    }" @click="(e) => toggle(e)"
                      :title="isExpanded ? card.props.collapseText || 'Collapse' : card.props.expandText || 'Expand'">
                      {{ isExpanded ? '↑ ' + limitedCollapseText : '↓ ' + limitedExpandText }}
                    </button>
                  </template>
                </TextClamp>

                <!-- 常规TextClamp示例 -->
                <TextClamp v-else v-bind="card.props" />
              </div>
            </template>
          </Card>
        </div>
      </main>

      <footer class="footer">
        <p>TextClamp - A Vue 3 Component for Text Truncation</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: hsl(210 40% 98%);
  background-color: hsl(222.2 84% 4.9%);
  line-height: 1.5;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 1rem;
  height: 100%;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: hsl(0 0% 98%);
  letter-spacing: -0.025em;
  background: linear-gradient(to right, hsl(217.2 91.2% 59.8%), hsl(215.4 98.3% 73.9%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 1.125rem;
  color: hsl(215.4 16.3% 66.9%);
  max-width: 42rem;
  margin: 0 auto;
}

.main-content {
  margin-bottom: 3rem;
  height: 100%;
}

.subheading {
  font-size: 1.5rem;
  font-weight: 600;
  color: hsl(210 40% 98%);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid hsl(217.2 32.6% 17.5%);
}

.examples {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
  position: relative;
  width: 100%;
}

.example-card {
  width: 100%;
  position: relative;
  min-height: 500px;
  height: auto;
  transition: transform 0.3s ease;
  margin: 0;
  padding: 0;
}
.example-card .banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.example-card:hover {
  transform: translateY(-5px);
}

.card-title {
  color: hsl(0 0% 98%);
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  color: hsl(215.4 16.3% 76.9%);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.text-clamp-wrapper {
  min-height: 8rem;
  display: flex;
  flex-direction: column;
}

/* 当TextClamp展开时，允许容器自适应高度 */
.text-clamp-wrapper :deep(.text-clamp__text--expanded) {
  height: auto !important;
  overflow: visible !important;
}

.custom-button {
  background-color: hsl(262.1 83.3% 57.8%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  align-self: flex-start;
  /* 确保按钮不会占满整行 */
  max-width: 120px;
  /* 限制自定义按钮的最大宽度 */
  white-space: nowrap;
  /* 防止文本换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-button--tight {
  display: inline-flex;
  margin-left: 0.5rem;
  margin-top: 0;
  vertical-align: middle;
  /* 确保紧贴模式下按钮正确对齐 */
  position: relative;
  top: -1px;
}

.custom-button--one-line {
  margin-top: 0.75rem;
  align-self: flex-end;
  display: block;
}

.custom-button--align-right {
  margin-left: auto;
}

.custom-button--align-left {
  margin-right: auto;
  margin-left: 0;
}

.custom-button:hover {
  background-color: hsl(262.1 83.3% 63.8%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.footer {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid hsl(217.2 32.6% 17.5%);
  color: hsl(215.4 16.3% 66.9%);
  font-size: 0.875rem;
}

/* 改进响应式布局 */
@media (min-width: 640px) {
  .container {
    padding: 2rem;
  }

  .examples {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .examples {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 639px) {
  .heading {
    font-size: 1.875rem;
  }

  .description {
    font-size: 1rem;
  }

  .subheading {
    font-size: 1.25rem;
  }

  .container {
    padding: 1rem 0.5rem;
    width: 100%;
  }

  .examples {
    gap: 2rem;
    width: 100%;
    padding: 0;
  }

  .example-card {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .text-clamp-wrapper {
    min-height: 6rem;
  }
}
</style>
