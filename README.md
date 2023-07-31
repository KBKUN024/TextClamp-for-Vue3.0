<h1 align="center">TextClamp Component for Vue3.0</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/text-clamp-for-vue3"><img src="https://badgen.net/npm/v/text-clamp-for-vue3" alt="npm package"></a>
</p>

> *This component is based on the text expansion and collapse component developed by vue 3.0, maybe the simplest and most understandable version of the code on github now, I hope it can help people who need it, if you think the writing is good, welcome to give me a star.*
<br/>

- Customizable button types
- Customizable text lines
- Easy to understand

## **Effect demonstration**
<img src="./src/assets/expand.gif" />
<br/>
<br/>

## **Install**

```
    npm install text-clamp-for-vue3
```

## **Full import**

```javascript
    import { createApp } from "vue";
    import TextClamp from 'text-clamp-for-vue3'
    import App from "./App.vue";
    const app = createApp(App);
    app.use(TextClamp).mount("#app");
```
## **Usage**

```javascript
    <TextClamp :text="str" :buttonType="'tight'" :maxLines="4">
        <template #textExpandButton="props">
          <div v-if="props.buttonType == 'oneLine'" :style="{
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'flex-end'
          }">
            <button @click="props.toggle">
              {{ props.isExpanded ? "Collapse" : "Expand" }}
            </button>
          </div>
          <button @click="props.toggle" v-else>
            {{ props.isExpanded ? "Collapse" : "Expand" }}
          </button>
        </template>
      </TextClamp>
```

## **Properties**

| text: string                      | Component content,it's Required.                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| buttonType?: 'oneLine' \| 'tight' | The unfold collapse button is divided into: 1. oneLine:Occupies a single line 2. tight: Closely adjacent to text |
| maxLines?: number                 | Sets the number of rows displayed                                                                                |
| isExpanded?: boolean              | Expanded state, true: expanded, false: collapsed                                                                 |
