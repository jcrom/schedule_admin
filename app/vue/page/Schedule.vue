<template>
  <div id="live">
    <v-top-nav :type="'404'" :ssa="ssa"></v-top-nav>
    <div class="notfound">
      <div class="nf_img"><img src="/static/images/notfound@3x.png"/></div>
      <div class="nf_msg">{{message}}</div>
    </div>
    123123123
    <char-board contentId="51"></char-board>
  </div>
</template>

<script>
import Q from 'q';

export default {
  asyncData({ store }) {
    // console.info(`\n\n\n\n\n\n\nVUE路由sectionid：\n${JSON.stringify(route.params)}\n\n\n\n\n\n\n`);

  },
  components: {
  },
  name: 'P404',
  data() {
    return {
      message: '',
      ssa: {
        league: '',
        live_status: '',
        section_id: undefined,
      },
    };
  },
  created() {
  },
  mounted() {
  },
};
</script>
<style lang="less">
  body {
    background: #f6f6f6;
  }
</style>
<style lang="less" scoped>
  .notfound {
    width: 100%;
    font-size: 0.6rem;
    margin-top: 3.1rem;
    .nf_img {
      width: 100%;
      text-align: center;
      img {
        width: 4.84rem;
      }
    }
    .nf_msg {
      color: #909090;
      font-size: 0.36rem;
      text-align: center;
      line-height: 0.5rem;
      margin-top: 0.6rem;
    }
  }
</style>
