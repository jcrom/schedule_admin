<template>
  <div id="live">
    <v-top-nav v-show="shownav" :type="'50x'" :ssa="ssa"></v-top-nav>
    <div class="notfound">
      <div class="nf_img">
        <img :src="errImgSrc"/>
      </div>
      <div class="nf_msg">{{message}}</div>
    </div>
  </div>
</template>

<script>
import Q from 'q';
import { utils } from '../vendors/utils';

export default {
  asyncData({ store }) {
    return Q.all([
      store.dispatch('bannerInfo/bannerInfo'),
    ]);
  },
  components: {
    // ChatBoard,
  },
  name: 'P50x',
  data() {
    return {
      // worldcup-live
      shownav: false,
      message: '',
      errorCode: '',
      ssa: {
        league: '',
        live_status: '',
        section_id: undefined,
      },
    };
  },
  computed: {
    errImgSrc() {
      if (!this.errorCode) {
        return '';
      }
      let imgSrc = '/static/images/error/';
      if (this.errorCode >= 500) {
        imgSrc = `${imgSrc}50X@2x.png`;
      } else if (this.errorCode === 410) {
        imgSrc = `${imgSrc}410@2x.png`;
      } else if (this.errorCode >= 400) {
        imgSrc = `${imgSrc}404@2x.png`;
      } else {
        imgSrc = `${imgSrc}errorserver@3x.png`;
      }
      return imgSrc;
    },
  },
  created() {
    this.message = this.$store.state.SSRSetStoreData.SSRSetStoreData.errorMessage;
    this.errorCode = this.$store.state.SSRSetStoreData.SSRSetStoreData.errorCode;
  },
  beforeMount() {
    this.shownav = this.filterShownav();
    this.$forceUpdate();
  },
  mounted() {
  },
  methods: {
    filterShownav() {
      let show = location.hostname !== '2018.suning.com';
      show = show && !utils.isPPTVSports();
      return show;
    },
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
        width: 5.18rem;
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
