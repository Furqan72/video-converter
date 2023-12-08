<template>
  <nav class="relative z-50 flex items-center justify-between bg-[#303030ff] px-28 py-5 text-white shadow-sm">
    <div class="flex items-center gap-x-24">
      <router-link to="/" @click="closeTransition('/')" class="flex cursor-pointer items-center text-xl">
        <img src="../assets/images/nav_icon.png" alt="" class="mr-2 w-12" />
        <p class="font-bold">Video Converter</p>
      </router-link>
      <ul class="font-semibol flex justify-between gap-x-10 maxlg:hidden [&>*]:flex [&>*]:cursor-pointer [&>*]:items-center">
        <li @click="show = !show">Tools<ChevronDownIcon class="ml-2 duration-200" :class="show === true ? 'rotate-180' : ''" /></li>
        <li>Api<ChevronDownIcon class="ml-2" /></li>
        <li>Pricing</li>
      </ul>
    </div>

    <Transition class="absolute left-0 right-0 top-[71px] bg-[#303030ff] outline-none">
      <div v-if="show" class="grid grid-cols-8 gap-10 px-28 py-6">
        <template v-for="menuItem in navbarMenu" :key="menuItem.heading1">
          <div :class="'col-span-' + menuItem.columns1">
            <h4 class="broder broder-[#5a5a5a] flex items-center border-b text-lg font-semibold">
              <img :src="`../../src/assets/images/${menuItem.icon}.png`" alt="" class="mr-1 h-4 w-4" />
              {{ menuItem.heading1 }}
            </h4>
            <div class="grid" :class="menuItem.heading2 === '' ? ' grid-cols-' + menuItem.columns2 + ' gap-5' : ''">
              <div class="mt-2">
                <template v-for="(item, index) in menuItem.listitems1" :key="index">
                  <router-link :to="item.link" class="cursor-pointer" @click="closeTransition(item.link)">
                    <span class="block rounded-sm p-[10px] text-sm duration-200 hover:bg-white hover:text-black">{{ item.label }}</span>
                  </router-link>
                </template>
              </div>
              <h4 v-if="menuItem.heading2 !== ''" class="broder broder-[#5a5a5a] mt-2 flex items-center border-b text-lg font-semibold"><img src="../../src/assets/images/covnerter.png" alt="" class="mr-1 h-4 w-4" /> {{ menuItem.heading2 }}</h4>
              <div class="mt-2">
                <template v-for="(item, index) in menuItem.listitems2" :key="index">
                  <router-link :to="item.link" class="cursor-pointer" @click="closeTransition(item.link)">
                    <span class="block rounded-sm p-[10px] text-sm duration-200 hover:bg-white hover:text-black">{{ item.label }}</span>
                  </router-link>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </Transition>

    <ul class="flex gap-10 [&>*]:cursor-pointer [&>*]:font-semibold">
      <li>Sign Up</li>
      <li>Login</li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
// icons
import DownloadIcon from '../../src/assets/icons/DownloadIcon.vue';
import ChevronDownIcon from '../../src/assets/icons/ChevronDownIcon.vue';

import { useGlobalStore } from '../../src/Store/GlobalStore.js';
const GlobalData = useGlobalStore();

const show = ref(false);
const closeTransition = (listitem) => {
  GlobalData.activeConverter = listitem;
  console.log(GlobalData.activeConverter);
  show.value = false;
};

const navbarMenu = ref([
  {
    columns1: '4',
    columns2: '2',
    heading1: 'CONVERT FILES',
    heading2: '',
    icon: 'covnerter',
    listitems1: [
      { label: 'Image Converter', link: '/image-converter' },
      { label: 'Video Converter', link: '/' },
      { label: 'Archive Converter', link: '' },
      { label: 'Audio Converter', link: '' },
      { label: 'CAD Converter', link: '' },
      { label: 'Document Converter', link: '' },
    ],
    listitems2: [
      { label: 'Ebook Converter', link: '' },
      { label: 'Font Converter', link: '' },
      { label: 'Presentation Converter', link: '' },
      { label: 'Spreadsheet Converter', link: '' },
      { label: 'Vector Converter', link: '' },
    ],
  },
  {
    columns1: '2',
    columns2: '',
    heading1: 'OPTIMIZE FILES',
    heading2: 'ARCHIVES',
    icon: 'covnerter',
    listitems1: [
      { label: 'Compress PDF', link: '' },
      { label: 'Compress PNG', link: '' },
      { label: 'Compress JPG', link: '' },
    ],
    listitems2: [
      { label: 'Create Archive', link: '' },
      { label: 'Extract Archive', link: '' },
    ],
  },
  {
    columns1: '2',
    columns2: '',
    heading1: ' CAPTURE WEBSITES',
    heading2: 'MERGE FILES',
    icon: 'covnerter',
    listitems1: [
      { label: 'Save Website as PDF', link: '' },
      { label: 'Website PNG Screenshot', link: '' },
      { label: 'Website JPG Screenshot', link: '' },
    ],
    listitems2: [{ label: 'Merge PDF', link: '' }],
  },
]);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
