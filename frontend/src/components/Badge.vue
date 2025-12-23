<script setup lang="ts">
import { computed } from 'vue';
import _ from 'lodash';
import { badgeProps } from '@/types/components/Badge';

const props = withDefaults(defineProps<badgeProps>(), {
    data: 0,
    type: 'default',
});

const badgeStyle = computed(() => {
    const data = _.get(props, 'data', 0);
    let style: { [key: string]: string } = {};

    if (props.type === 'special') {
        if (data >= 99) {
            style.background = 'linear-gradient(rgba(75,168,255,.1),rgba(0,0,0,.7)),linear-gradient(to bottom left,#000,#400000,#562683)';
        } else if (data >= 97) {
            style.background = 'linear-gradient(rgba(75, 168, 255, .1), rgba(0, 0, 0, .7)), linear-gradient(to bottom left, #188fff, #e1a6e7, #f9a205)';
            style.boxShadow = '0 0 10px #f9a205';
        } else if (data >= 95) {
            style.background = 'linear-gradient(#ff96df, #ad388a)';
            style.boxShadow = '0 0 10px #ff96df';
        } else if (data >= 92) {
            style.background = 'linear-gradient(#00aace, #005668)';
        } else if (data >= 90) {
            style.background = 'linear-gradient(#a51fff, #5b1c86)';
        } else if (data >= 87) {
            style.background = 'linear-gradient(#e70000, #810000)';
        } else if (data >= 84) {
            style.background = 'linear-gradient(#0020ce, #001068)';
        } else if (data >= 80) {
            style.background = 'linear-gradient(#05c715, #03630b)';
        } else if (data >= 75) {
            style.background = 'linear-gradient(#d6bb5c, #a38829)';
        } else if (data >= 70) {
            style.background = 'linear-gradient(#a2a2a2, #6f6f6f)';
        } else {
            style.background = 'linear-gradient(#cc5b00, #662d00)';
        }
        if (!style.boxShadow) {
            style.boxShadow = 'none'; 
        }
    } else {
        if (data >= 90) {
            style.backgroundColor = '#00AA00';
        } else if (data >= 80) {
            style.backgroundColor = '#007700';
        } else if (data >= 70) {
            style.backgroundColor = '#CC9900';
        } else if (data >= 60) {
            style.backgroundColor = '#DD4400';
        } else {
            style.backgroundColor = '#990000';
        }
    }
    return style;
});
</script>

<template>
  <div class="badge" :style="badgeStyle">
    {{ _.get(props, 'data') }}
  </div>
</template>

<style lang="scss" scoped>
.badge{
    width: 30px;
    height: 28px;
    border-radius: 5px;
    color: #fff; 
    font-size: 16px;
    font-weight: 900;
    
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>