 # TextClamp for Vue 3.0

<p align="center">
  <a href="./README.md">English</a> | <a href="./README.zh-CN.md">中文</a>
</p>

<a href="https://kbkun024.github.io/TextClamp-for-Vue3.0/">Demo Here</a>

## Introduction

TextClamp is a lightweight Vue 3 component for elegant text truncation with "expand/collapse" functionality. It provides an intuitive way to handle large blocks of text in your Vue applications.

## Features

- ⚡️ **Lightweight** - Minimal impact on your bundle size (~5.7KB gzipped)
- 🔥 **Simple API** - Just pass your text and go!
- 📐 **Line Control** - Specify exactly how many lines to display
- 🎨 **Customizable Buttons** - Choose button position and style
- 🔄 **Reactive** - Responds to all prop changes in real-time
- 🔍 **Type-safe** - Written in TypeScript for better development experience
- 🧩 **Slot Support** - Customize expand/collapse buttons with slots
- 🎯 **Zero Dependencies** - Uses native browser capabilities

## Installation

```bash
npm install text-clamp-for-vue3
```

## Basic Usage

```vue
<template>
  <TextClamp :text="myText" />
</template>

<script setup>
import { TextClamp } from 'text-clamp-for-vue3';

const myText = "This is a long text that will be truncated...";
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | String | **Required** | Text content to display and truncate |
| `lines` | Number | `3` | Number of lines to display before truncation |
| `buttonType` | String | `'tight'` | Button position: `'tight'` (at text end) or `'one-line'` (separate line) |
| `expandText` | String | `'Expand'` | Text for the expand button |
| `collapseText` | String | `'Collapse'` | Text for the collapse button |
| `maxButtonTextLength` | Number | `15` | Maximum length of button text |
| `buttonAlign` | String | `'right'` | Button alignment: `'left'` or `'right'` (only for 'one-line' type) |
| `buttonStyle` | String | `'default'` | Button style: `'default'`, `'primary'`, `'outline'`, or `'text'` |
| `buttonIcon` | Boolean | `true` | Whether to show button icon (up/down arrow) |
| `buttonClass` | String | `''` | Custom CSS class(es) to apply to the button |

## Custom Button Styling

There are two ways to customize the button:

### 1. Using Props (Recommended)

The simplest way to customize the button is to use the provided props:

```vue
<TextClamp 
  :text="myText" 
  buttonStyle="primary"
  buttonAlign="left"
  buttonClass="my-custom-button"
  expandText="Show More"
  collapseText="Show Less"
/>
```

This approach allows you to:
- Choose from predefined button styles
- Set alignment
- Add custom CSS classes
- Customize text
- No need to write additional template code

### 2. Using Slots (Advanced)

For complete customization, you can use the `expandButton` slot:

```vue
<TextClamp :text="myText">
  <template #expandButton="{ toggle, isExpanded }">
    <button class="my-custom-button" @click="toggle">
      {{ isExpanded ? 'Show Less' : 'Show More' }}
    </button>
  </template>
</TextClamp>
```

## Examples

### Basic Example
```vue
<TextClamp :text="myText" />
```

### Custom Line Count
```vue
<TextClamp :text="myText" :lines="2" />
```

### One-line Button with Left Alignment
```vue
<TextClamp :text="myText" buttonType="one-line" buttonAlign="left" />
```

### Primary Button Style
```vue
<TextClamp :text="myText" buttonStyle="primary" />
```

### Outline Button Style without Icon
```vue
<TextClamp 
  :text="myText" 
  buttonStyle="outline"
  :buttonIcon="false"
/>
```

### Custom Button Class
```vue
<TextClamp 
  :text="myText" 
  buttonClass="my-custom-button"
/>
```

## Browser Support

TextClamp works in all modern browsers that support Vue 3:

- Chrome
- Firefox
- Safari
- Edge

## License

[MIT](LICENSE)