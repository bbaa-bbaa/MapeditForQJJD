import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.lightBlue.accent3,
        secondary: colors.grey.darken2,
        accent: colors.orange,
        error: colors.red.accent3,
        background:"#efefef"
      }
    }
  }
});
