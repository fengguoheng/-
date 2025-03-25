<template>
    <div class="image-container">
        <img src="personality.jpg" alt="背景图" class="bg-image" />
        <img src="life.jpg" alt="背景图" class="bg-image" />
        <img src="poem.jpg" alt="背景图" class="bg-image" />
        <img src="me.jpg" alt="背景图" class="bg-image" />
        <img src="me1.jpg" alt="背景图" class="bg-image" />
    </div>
    <a href="https://b23.tv/oE1D76R">红豆</a>
    <a href="https://b23.tv/NyLL62G">船长</a>
     
</template>

<script setup>
// 这里可以没有额外逻辑
</script>

<style scoped>
.image-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 定义四列，每列等宽 */
    grid-gap: 10px;
    /* 图片之间的间距 */
}

.bg-image {
    width: 100%;
    height: auto;
}
</style>