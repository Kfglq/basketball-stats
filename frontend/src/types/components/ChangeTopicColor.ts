// src/types/components/ChangeTopicColor.vue

export interface changeTopicColorProps {
  // NFlex 的 align 屬性
  flexAlign?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  // NFlex 的 justify 屬性
  flexJustify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  // NButton 的 size 屬性
  buttonSize?: 'tiny' | 'small' | 'medium' | 'large';
}