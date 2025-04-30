 # TextClamp for Vue 3.0

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a>
</p>

<a href="https://kbkun024.github.io/TextClamp-for-Vue3.0/">查看演示</a>


## 简介

TextClamp 是一个轻量级的 Vue 3 文本截断组件，提供优雅的"展开/收起"功能。它为您的 Vue 应用提供了一种直观处理大段文本的方式。

## 特性

- ⚡️ **轻量级** - 对您的bundle大小影响最小（gzip压缩后仅约5.7KB）
- 🔥 **简洁API** - 只需传入文本即可使用！
- 📐 **精确控制行数** - 精确指定显示的文本行数
- 🎨 **按钮自定义** - 自由选择按钮位置和样式
- 🔄 **响应式设计** - 实时响应所有属性变化
- 🔍 **类型安全** - 使用 TypeScript 编写，提供更好的开发体验
- 🧩 **插槽支持** - 通过插槽自定义展开/收起按钮
- 🎯 **零依赖** - 使用原生浏览器功能

## 安装

```bash
npm install text-clamp-for-vue3
```

## 基本用法

```vue
<template>
  <TextClamp :text="myText" />
</template>

<script setup>
import { TextClamp } from 'text-clamp-for-vue3';

const myText = "这是一段很长的文本，将会被截断...";
</script>
```

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | String | **必填** | 要显示和截断的文本内容 |
| `lines` | Number | `3` | 截断前显示的行数 |
| `buttonType` | String | `'tight'` | 按钮位置类型：`'tight'`（紧贴文本末尾）或 `'one-line'`（单独一行） |
| `expandText` | String | `'展开'` | 展开按钮的文本 |
| `collapseText` | String | `'收起'` | 收起按钮的文本 |
| `maxButtonTextLength` | Number | `15` | 按钮文本的最大长度 |
| `buttonAlign` | String | `'right'` | 按钮对齐方式：`'left'` 或 `'right'`（仅适用于 'one-line' 类型） |
| `buttonStyle` | String | `'default'` | 按钮样式：`'default'`（默认）, `'primary'`（主要）, `'outline'`（轮廓）, 或 `'text'`（文本） |
| `buttonIcon` | Boolean | `true` | 是否显示按钮图标（上/下箭头） |
| `buttonClass` | String | `''` | 应用于按钮的自定义CSS类 |

## 自定义按钮样式

有两种方式可以自定义按钮：

### 1. 使用属性（推荐）

最简单的自定义按钮方式是使用提供的属性：

```vue
<TextClamp 
  :text="myText" 
  buttonStyle="primary"
  buttonAlign="left"
  buttonClass="my-custom-button"
  expandText="查看更多"
  collapseText="收起"
/>
```

这种方法允许您：
- 从预定义的按钮样式中选择
- 设置对齐方式
- 添加自定义CSS类
- 自定义文本
- 无需编写额外的模板代码

### 2. 使用插槽（高级）

对于完全自定义，您可以使用 `expandButton` 插槽：

```vue
<TextClamp :text="myText">
  <template #expandButton="{ toggle, isExpanded }">
    <button class="my-custom-button" @click="toggle">
      {{ isExpanded ? '收起' : '查看更多' }}
    </button>
  </template>
</TextClamp>
```

## 示例

### 基础示例
```vue
<TextClamp :text="myText" />
```

### 自定义行数
```vue
<TextClamp :text="myText" :lines="2" />
```

### 左对齐的单行按钮
```vue
<TextClamp :text="myText" buttonType="one-line" buttonAlign="left" />
```

### 主要样式按钮
```vue
<TextClamp :text="myText" buttonStyle="primary" />
```

### 无图标的轮廓按钮
```vue
<TextClamp 
  :text="myText" 
  buttonStyle="outline"
  :buttonIcon="false"
/>
```

### 自定义按钮类
```vue
<TextClamp 
  :text="myText" 
  buttonClass="my-custom-button"
/>
```

## 浏览器支持

TextClamp 适用于所有支持 Vue 3 的现代浏览器：

- Chrome
- Firefox
- Safari
- Edge

## 许可证

[MIT](LICENSE)