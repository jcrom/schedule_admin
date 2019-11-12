<template>
  <div id="app" :class="{hideheader: hideheader}">
    <P50x v-if="pageerror"></P50x>
    <div v-else-if="noright">
      <h3>请使用《PP体育》APP享受精彩赛事</h3>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import P50x from './components/50x.vue';
import { utils } from './vendors/utils';

export default {
  data() {
    return {
      pageerror: '',
      noright: false,
    };
  },
  computed: {
    // 对头部做处理，hideheader去掉页面的头部
    hideheader() {
      return !!this.$route.query.hideheader;
    },
  },
  components: {
    P50x,
  },
  created() {
    this.pageerror = this.$store && this.$store.state && this.$store.state.SSRSetStoreData
      && this.$store.state.SSRSetStoreData.SSRSetStoreData.errorMessage;
  },
  mounted() {

  },
};
</script>
