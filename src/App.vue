<script setup lang="ts">
import Card from "./components/Card.vue";
import TextClamp from './package/TextClamp.vue';
import { ref, computed, onMounted } from "vue";
let str =
  "The ETH upgrade upgrade timeline has never been clear. The end of December last year, as well as June and August this year, are all hazy dates. This time,the core developers have provided a clear date, market confidence has increased, and the voice is loud, and Ethereum has been impacted. There aretwo voices on Ethereum 2.0 in the market, with hundreds of billions ofdollars at stake. The first is to be pessimistic, thinking that theintroduction of 2.0 with cheap gas fees and large processing capacity willallow more projects to settle in Ethereum, and that the expansion of ETH'sdemand would raise the price of ETH.The second option is to remain solidlybearish.Following 2.0, a large number of ETHs were freed, and mass sellingand homogenization rivalry became more intense.";
</script>

<template>
  <Card>
    <template #banner>
      <img src="./assets/image3.png" />
    </template>
    <template #description>
      <TextClamp :text="str" :buttonType="'tight'" :maxLines="3">
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
    </template>
  </Card>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
