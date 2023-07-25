<template>
    <div class="card">
        <div class="banner">
            <slot name="banner"></slot>
        </div>
        <div class="description">
            <slot name="description"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

</script>

<style>
.card {
    width: 500px;
    border-radius: 10px;
    background-color: #262335;
    box-sizing: border-box;

    @media screen and (max-width:700px) {
        width: 100%;
    }
}

.banner {
    width: 100%;
    height: 200px;
    display: block;
}

.banner img {
    width: inherit;
    height: inherit;
    object-fit: cover;
    border-radius: 10px;
}

.banner p {
    color: red;
}

.description {
    width: 100%;
    height: auto;
    display: block;
}
</style>