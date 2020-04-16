<template>
  <div id="Main" style="margin: auto;">
    <div>
      <div
        id="SelectBlock"
        v-if="!Main.MapEditer.IsPlayerEdit"
        style="left: 180px;"
      >
        <div id="Select" :style="Main.MapEditer.SelectStyle">
          <img src="../../public/images/select.png" draggable="false" />
        </div>
        <ul v-for="(item, y) in Main.MapEditer.imagedata" :key="'y' + y">
          <li draggable="false" v-for="(item2, x) in item" :key="x">
            <img
              draggable="false"
              :src="item2"
              onerror="this.src='./images/error.png'"
              @load="initSelect"
              @click="SelectBlock(x, y, $event)"
            />
          </li>
        </ul>
      </div>
      <br />
      <div id="MapEditer" :style="{ 'padding-top': HeightToTop }">
        <ul v-for="(item, y) in Main.MapEditer.data" :key="'y' + y">
          <li
            draggable="false"
            v-for="(item2, x) in item"
            @click="ChangeBlock(x, y)"
            :key="x"
          >
            <img
              draggable="false"
              :src="item2.url()"
              onerror="this.src='./images/error.png'"
              @load="initPlayerEditer"
            />
          </li>
        </ul>
      </div>
      <div
        id="PlayerEditer"
        v-if="Main.MapEditer.IsPlayerEdit"
        :style="
          Object.assign(Main.PlayerEditer.Style, { 'padding-top': HeightToTop })
        "
      >
        <ul v-for="(item, y) in Main.PlayerEditer.data" :key="'y' + y">
          <li
            draggable="false"
            v-for="(item2, x) in item"
            @click="PlayerEdit(x, y, $event)"
            :key="x"
          >
            <img
              draggable="false"
              :src="item2.url()"
              onerror="this.src='./images/error.png'"
              v-if="typeof item2.Info[2] != 'undefined'"
            />
          </li>
        </ul>
      </div>
      <div
        id="PlayerInfoEdit"
        :style="Main.PlayerEditer.EditerStyle"
        v-if="Main.PlayerEditer.ShowEditer"
      >
        <span>名称:</span>
        <input type="input" v-model="Main.PlayerEditer.PlayerInfo[0]" />
        <br />
        <span>血量:</span>
        <input type="input" v-model.number="Main.PlayerEditer.PlayerInfo[1]" />
        <br />
        <span>类型:</span>
        <select
          style="width: 50%;"
          v-model="Main.PlayerEditer.PlayerInfo[2]"
          @change="tryDetectComp($event)"
        >
          <option value="dfsb">敌方士兵</option>
          <option value="wfsb">我方士兵</option>
          <option value="dftk">敌方坦克</option>
          <option value="wftk">我方坦克</option>
          <option value="dfhp">敌方火炮</option>
          <option value="wfhp">我方火炮</option>
          <option value="dftower">敌方我也不知道是啥塔</option>
          <option value="zombie">僵尸</option>
        </select>
        <br />
        <span>阵营:</span>
        <select style="width: 50%;" v-model="Main.PlayerEditer.PlayerInfo[3]">
          <option value="e">敌方</option>
          <option value="f">我方</option>
        </select>
        <br />
        <span>攻距:</span>
        <input type="input" v-model.number="Main.PlayerEditer.PlayerInfo[4]" />
        <br />
        <span>移距:</span>
        <input type="input" v-model.number="Main.PlayerEditer.PlayerInfo[5]" />
        <br />
        <span>伤害:</span>
        <input type="input" v-model.number="Main.PlayerEditer.PlayerInfo[6]" />
        <br />
        <span>防御:</span>
        <input type="input" v-model.number="Main.PlayerEditer.PlayerInfo[7]" />
        <br />
        <button
          id="LeftButton"
          type="submit"
          :class="[
            'btn',
            this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
              Main.PlayerEditer.X
            ].Info[2]
              ? 'btn-primary'
              : 'btn-success',
            'btn-sm'
          ]"
          style="float: left; width: 45%;"
          @click="AddPlayer"
        >
          {{
            this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
              Main.PlayerEditer.X
            ].Info[2]
              ? "修改"
              : "确定"
          }}
        </button>
        <button
          id="RightButton"
          type="button"
          class="btn btn-danger btn-sm"
          style="float: right; width: 45%;"
          @click="DeletePlayer"
        >
          {{
            this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
              Main.PlayerEditer.X
            ].Info[2]
              ? "删除"
              : "取消"
          }}
        </button>
      </div>
      <div id="footer">
        <textarea
          v-model="Main.SaveFile"
          style="width: 500px; height: 100px;"
        ></textarea>
        <br />
        <div class="btn-group" style="padding-bottom: 6px;" @click="AutoSaveF">
          <button
            type="button"
            class="btn btn-primary"
            @click="Main.MapEditer.ReSizeMap('left')"
          >
            在左边添加一列
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="Main.MapEditer.ReSizeMap('right')"
          >
            在右边添加一列
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="Main.MapEditer.ReSizeMap('top')"
          >
            在顶部添加一行
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="Main.MapEditer.ReSizeMap('bottom')"
          >
            在底部添加一行
          </button>
        </div>
        <br />
        <button
          class="btn btn-primary"
          type="button"
          style="width: 24%;margin:0 5px;"
          @click="LoadSave"
        >
          {{ Main.MapEditer.IsPlayerEdit ? "加载玩家文件" : "加载地图" }}
        </button>
        <button
          class="btn btn-primary"
          type="button"
          style="width: 24%;margin:0 5px;"
          @click="toggleMP"
        >
          {{
            Main.MapEditer.IsPlayerEdit
              ? "切换到地图编辑器"
              : "切换到玩家编辑器"
          }}
        </button>
        <br />
        <button
          class="btn btn-primary"
          type="button"
          style="width: 48.5%; margin-top: 4px;"
          @click="LoadSavea"
          :disabled="!getAutoSave()"
        >
          加载自动保存
        </button>
        <br />
        <button
          class="btn btn-primary"
          type="button"
          style="width: 48.5%; margin-top: 4px;"
          @click="genImage"
        >
          下载地图图片
        </button>
        <br />
        <div id="PyLink" style="margin: auto 0;">
          本站由
          <svg
            height="32"
            viewBox="0 0 16 16"
            version="1.1"
            width="32"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
          <a href="https:/github.io/">Github Pages</a>
          强力驱动
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import MapEditer from "@/extra/index";
export default {
  name: "Main",
  data() {
    return {
      Main: MapEditer,
      Selects: [],
      Selected: null
    };
  },
  computed: {
    HeightToTop() {
      return this.Main.MapEditer.imagedata.length * 66 + 20 + "px";
    }
  },
  mounted() {
    var that = this;
    window.onresize = function() {
      document.getElementById("SelectBlock").style.left =
        (document.documentElement.clientWidth -
          document.getElementById("SelectBlock").clientWidth) /
          2 +
        "px";
    };
  },
  methods: {
    AutoSaveF() {
      var Save = {};
      Save.Map = this.Main.MapEditer.ToCsv(true);
      Save.Players = this.Main.PlayerEditer.ToSave(true);
      window.localStorage.AutoSave = window.JSON.stringify(Save);
    },
    tryDetectComp(event) {
      if (event.target.value.substring(0, 2) == "wf") {
        this.Main.PlayerEditer.PlayerInfo[3] = "f";
      } else {
        this.Main.PlayerEditer.PlayerInfo[3] = "e";
      }
    },
    initSelect() {
      document.getElementById("SelectBlock").style.left =
        (document.documentElement.clientWidth -
          document.getElementById("SelectBlock").clientWidth) /
          2 +
        "px";
      this.Main.MapEditer.SelectStyle.left =
        document.querySelector("#SelectBlock > ul > li > img").offsetLeft +
        "px";
    },
    SelectBlock(x, y, e) {
      this.Main.MapEditer.Select = y * 15 + x;
      this.Main.MapEditer.SelectStyle.left = e.target.offsetLeft + "px";
      this.Main.MapEditer.SelectStyle.top = e.target.offsetTop + "px";
      if (e.ctrlKey) {
        for (let y=0;y<this.Main.MapEditer.data.length;y++) {
          for (let x=0;x<this.Main.MapEditer.data.length;x++) {
            this.Main.MapEditer.data[y][x].blockid = this.Main.MapEditer.Select;
          }
        }
      }
    },
    ChangeBlock(x, y) {
      this.Main.MapEditer.data[y][x].blockid = this.Main.MapEditer.Select;
      this.AutoSaveF();
      this.Main.MapEditer.ToCsv();
    },
    initPlayerEditer() {
      this.Main.PlayerEditer.Style.left =
        document.querySelector("#MapEditer").offsetLeft + "px";
      this.Main.PlayerEditer.Style.top =
        document.querySelector("#MapEditer").offsetTop + "px";
    },
    toggleMP() {
      Vue.set(
        this.Main.MapEditer,
        "IsPlayerEdit",
        this.Main.MapEditer.IsPlayerEdit
          ? this.Main.MapEditer.ToCsv()
          : this.Main.PlayerEditer.ToSave()
      );
    },
    PlayerEdit(x, y, el) {
      this.Main.PlayerEditer.LoadSave();
      if (!el.ctrlKey) {
        this.Main.PlayerEditer.PlayerInfo = new Array();
        if (typeof this.Main.PlayerEditer.data[y][x].Info[2] != "undefined") {
          this.Main.PlayerEditer.PlayerInfo = this.Main.PlayerEditer.data[y][
            x
          ].Info;
        }
      } else {
        if (typeof this.Main.PlayerEditer.data[y][x].Info[2] != "undefined") {
          this.Main.PlayerEditer.PlayerInfo = this.Main.PlayerEditer.data[y][
            x
          ].Info;
        }
        this.Main.PlayerEditer.PlayerInfo = new Array();
        if (
          typeof this.Main.PlayerEditer.data[this.Main.PlayerEditer.Y][
            this.Main.PlayerEditer.X
          ].Info[2] != "undefined"
        ) {
          for (let [i, item] of this.Main.PlayerEditer.data[
            this.Main.PlayerEditer.Y
          ][this.Main.PlayerEditer.X].Info.entries()) {
            this.Main.PlayerEditer.PlayerInfo[i] = item;
          }
        }
      }
      this.Main.PlayerEditer.X = x;
      this.Main.PlayerEditer.Y = y;
      var Offset = this.Main.Offset(el.target);
      this.Main.PlayerEditer.EditerStyle.left = Offset.left + 64 + "px";
      this.Main.PlayerEditer.EditerStyle.top = Offset.top + 32 + "px";
      this.Main.PlayerEditer.ShowEditer = true;
    },
    LoadSave() {
      if (!this.Main.MapEditer.IsPlayerEdit) {
        this.Main.MapEditer.LoadMap();
      } else {
        this.Main.PlayerEditer.LoadSave();
      }
    },
    AddPlayer(e) {
      this.Main.PlayerEditer.AddPlayer();
      this.Main.PlayerEditer.ToSave();
      this.AutoSaveF();
    },
    DeletePlayer(e) {
      if (e.target.textContent == "取消") {
        this.Main.PlayerEditer.ShowEditer = false;
      } else {
        this.Main.PlayerEditer.data[this.Main.PlayerEditer.Y][
          this.Main.PlayerEditer.X
        ] = new this.Main.PlayerEditer.PlayerObj();
        this.Main.PlayerEditer.ShowEditer = false;
        this.Main.PlayerEditer.ToSave();
      }
      this.AutoSaveF();
    },
    getAutoSave() {
      if (window.localStorage.AutoSave == undefined) {
        return false;
      }
      return true;
    },
    LoadSavea() {
      var Save = window.JSON.parse(window.localStorage.AutoSave);
      this.Main.MapEditer.LoadMap(Save.Map);
      this.Main.PlayerEditer.LoadSave(Save.Players);
      if (this.Main.MapEditer.IsPlayerEdit) {
        this.Main.PlayerEditer.ToSave();
      } else {
        this.Main.MapEditer.ToCsv();
      }
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
      }
      return "";
    },
    genImage() {
      let canvas = document.createElement("canvas");
      canvas.width = this.Main.MapEditer.data[0].length * 64;
      canvas.height = this.Main.MapEditer.data.length * 64;
      let ctx = canvas.getContext("2d");
      let WillLoad = 0;
      let Loaded = 0;
      for (let [y, data1] of Object.entries(this.Main.MapEditer.data)) {
        for (let [x, block] of Object.entries(data1)) {
          WillLoad++;
          let imgBlock = new Image();
          imgBlock.src = this.Main.MapEditer.imagedata[Math.floor(block.blockid/15)][block.blockid % 15];
          imgBlock.onload = function() {
            ctx.drawImage(imgBlock, x * 64, y * 64);
            if (this.Main.PlayerEditer.data[y][x].Info[2]) {
              WillLoad++;
              let imgUnit = new Image();
              imgUnit.src = "./images/players/" + this.Main.PlayerEditer.data[y][x].Info[2] + ".png";
              imgUnit.onload = function() {
                ctx.drawImage(imgUnit, x * 64, y * 64);
                if (++Loaded == WillLoad) {
                  let DownloadLink = document.createElement("a");
                  DownloadLink.download = "地图图片";
                  DownloadLink.href = canvas.toDataURL("image/png");
                  DownloadLink.click();
                }
              };
            }
            if (++Loaded == WillLoad) {
              let DownloadLink = document.createElement("a");
              DownloadLink.download = "地图图片";
              DownloadLink.href = canvas.toDataURL("image/png");
              DownloadLink.click();
            }
          }.bind(this);
        }
      }
    },
    BFS(){
      
    }
  }
};
</script>

<style>
body {
  font-family: "微软雅黑", "Microsoft YaHei";
  background-color: #eee !important;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
* {
  margin: 0;
  padding: 0;
}
li {
  list-style-type: none;
  border: 1px solid #000;
  height: 64px;
  width: 64px;
  box-sizing: unset;
}
ul {
  display: inline-flex;
  margin-bottom: 0px !important;
}
#MapEditer {
  float: left;
  line-height: 0;
  padding-top: 50px;
}
#PlayerEditer {
  float: left;
  line-height: 0;
  padding-top: 50px;
}
#PlayerInfoEdit {
  position: absolute;
  z-index: 2;
  top: 0px;
  left: 0px;
  width: 190px;
  height: 220px;
  color: #fff;
  background-color: #343a41 !important;
  border-radius: 8px;
  padding: 4px;
  line-height: 1.2;
}
#PlayerInfoEdit input {
  width: 50%;
}
#SelectBlock {
  position: fixed;
  top: 0;
}
select {
  width: 50%;
}
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
