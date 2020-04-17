<template>
  <div id="Main">
    <div
      id="SelectBlock"
      v-if="!Main.MapEditer.IsPlayerEdit"
      v-show="ShowSelectBlock"
      style="left: 0px;width:100%;z-index:10;"
    >
      <div id="Select">
        <v-tooltip bottom v-if="blocks[Main.MapEditer.Select]">
          <template v-slot:activator="{ on }">
            <div :style="Main.MapEditer.SelectStyle">
              <img
                v-on="on"
                src="../../public/images/select.png"
                draggable="false"
                data-a="A"
              />
            </div>
          </template>
          <div style="width:100%">{{ blocks[Main.MapEditer.Select].name }}</div>
          <div style="width:100%">
            {{ blocks[Main.MapEditer.Select].comment }}
          </div>
        </v-tooltip>
        <div v-else :style="Main.MapEditer.SelectStyle">
          <img src="../../public/images/select.png" draggable="false" />
        </div>
      </div>
      <div>
        <v-row
          no-gutters
          v-for="(item, y) of Main.MapEditer.imagedata"
          :key="'y' + y"
          justify="center"
        >
          <v-col
            style="height:66px;max-width:66px;margin:0px 0px -1px -1px;border:1px solid #000;"
            v-for="(item2, x) of item"
            :key="x"
          >
            <img
              v-if="!blocks[y * 15 + x]"
              draggable="false"
              :src="item2"
              @load="initSelect()"
              onerror="this.src='./images/error.png'"
              @click="SelectBlock(x, y, $event)"
            />
            <v-tooltip v-else bottom>
              <template v-slot:activator="{ on }">
                <img
                  v-on="on"
                  draggable="false"
                  :src="item2"
                  @load="initSelect()"
                  onerror="this.src='./images/error.png'"
                  @click="SelectBlock(x, y, $event)"
                />
              </template>
              <div style="width:100%">{{ blocks[y * 15 + x].name }}</div>
              <div style="width:100%">{{ blocks[y * 15 + x].comment }}</div>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
    </div>
    <div
      id="MapEditer"
      style="width:100%"
      :style="{ 'padding-top': HeightToTop }"
    >
      <v-row
        no-gutters
        v-for="(item, y) of Main.MapEditer.data"
        :key="'y' + y"
        justify="center"
      >
        <v-col
          style="height:66px;max-width:66px;margin:0px 0px -1px -1px;border:1px solid #000;"
          v-for="(item2, x) of item"
          @click="ChangeBlock(x, y)"
          :key="x"
        >
          <img
            draggable="false"
            :src="item2.url()"
            onerror="this.src='./images/error.png'"
            @load="initPlayerEditer"
          />
        </v-col>
      </v-row>
    </div>
    <div
      id="PlayerEditer"
      v-if="Main.MapEditer.IsPlayerEdit"
      style="width:100%"
      :style="
        Object.assign(Main.PlayerEditer.Style, { 'padding-top': HeightToTop })
      "
    >
      <v-row
        no-gutters
        v-for="(item, y) of Main.PlayerEditer.data"
        :key="'y' + y"
        justify="center"
      >
        <v-col
          style="height:66px;min-width:66px;max-width:66px;margin:0px 0px -1px -1px;border:1px solid #000;"
          v-for="(item2, x) of item"
          @click="PlayerEdit(x, y, $event)"
          :key="x"
        >
          <img
            draggable="false"
            :src="item2.url()"
            onerror="this.src='./images/error.png'"
            v-if="typeof item2.Info[2] != 'undefined'"
          />
        </v-col>
      </v-row>
    </div>
    <v-container>
      <div
        id="PlayerInfoEdit"
        :style="Main.PlayerEditer.EditerStyle"
        v-if="Main.PlayerEditer.ShowEditer"
      >
        <v-text-field
          label="名称"
          dense
          v-model="Main.PlayerEditer.PlayerInfo[0]"
          style="margin-top:15px"
        ></v-text-field>
        <v-text-field
          :rules="[isNum]"
          label="血量"
          dense
          v-model.number="Main.PlayerEditer.PlayerInfo[1]"
        ></v-text-field>
        <v-select
          dense
          label="类型"
          :items="entities"
          item-value="type"
          item-text="name"
          v-model="Main.PlayerEditer.PlayerInfo[2]"
          @change="tryDetectComp($event)"
        >
        </v-select>
        <v-select
          dense
          label="阵营"
          :items="[
            { text: '我方', value: 'f' },
            { text: '敌方', value: 'e' },
          ]"
          v-model="Main.PlayerEditer.PlayerInfo[3]"
        >
        </v-select>
        <v-text-field
          :rules="[isNum]"
          label="攻击距离"
          dense
          v-model.number="Main.PlayerEditer.PlayerInfo[4]"
        ></v-text-field>
        <v-text-field
          :rules="[isNum]"
          label="可移动步数"
          dense
          v-model.number="Main.PlayerEditer.PlayerInfo[5]"
        ></v-text-field>
        <v-text-field
          :rules="[isNum]"
          label="伤害"
          dense
          v-model.number="Main.PlayerEditer.PlayerInfo[6]"
        ></v-text-field>
        <v-text-field
          :rules="[isNum]"
          label="防御"
          dense
          v-model.number="Main.PlayerEditer.PlayerInfo[7]"
        ></v-text-field>
        <v-row>
          <v-col cols="6">
            <v-btn
              :color="
                this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
                  Main.PlayerEditer.X
                ].Info[2]
                  ? 'primary'
                  : 'success'
              "
              dense
              :block="true"
              @click="AddPlayer"
            >
              {{
                this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
                  Main.PlayerEditer.X
                ].Info[2]
                  ? "修改"
                  : "确定"
              }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="error" dense @click="DeletePlayer" :block="true">
              {{
                this.Main.PlayerEditer.data[Main.PlayerEditer.Y][
                  Main.PlayerEditer.X
                ].Info[2]
                  ? "删除"
                  : "取消"
              }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <div id="footer">
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="Main.SaveFile"
              :auto-grow="true"
              :filled="true"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row justify="center">
              <v-btn-toggle :max="0" :multiple="true" @click="AutoSaveF">
                <v-btn
                  color="primary"
                  @click="Main.MapEditer.ReSizeMap('left')"
                >
                  在左边添加一列
                </v-btn>
                <v-btn
                  color="primary"
                  @click="Main.MapEditer.ReSizeMap('right')"
                >
                  在右边添加一列
                </v-btn>
                <v-btn color="primary" @click="Main.MapEditer.ReSizeMap('top')">
                  在顶部添加一行
                </v-btn>
                <v-btn
                  color="primary"
                  @click="Main.MapEditer.ReSizeMap('bottom')"
                >
                  在底部添加一行
                </v-btn>
              </v-btn-toggle>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn color="primary" :block="true" @click="LoadSave">
              {{ Main.MapEditer.IsPlayerEdit ? "加载玩家文件" : "加载地图" }}
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" :block="true" @click="toggleMP">
              {{
                Main.MapEditer.IsPlayerEdit
                  ? "切换到地图编辑器"
                  : "切换到玩家编辑器"
              }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              :block="true"
              @click="LoadSavea"
              :disabled="!getAutoSave()"
            >
              加载自动保存
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="!Main.MapEditer.IsPlayerEdit">
          <v-col>
            <v-btn
              color="primary"
              :block="true"
              @click="EnableSelectBlock = !EnableSelectBlock"
            >
              {{ ShowSelectBlock ? "隐藏" : "显示" }}方块选择框
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn color="primary" :block="true" @click="genImage">
              下载地图图片
            </v-btn>
          </v-col>
        </v-row>
        <div id="PyLink" style="text-align:center">
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
    </v-container>
  </div>
</template>
<script>
import Vue from "vue";
import MapEditer from "@/extra/index";
import entities from "../../public/data/entities.json";
import blocks from "../../public/data/blocks.json";
export default {
  name: "Main",
  data() {
    return {
      Main: MapEditer,
      Selects: [],
      Selected: null,
      EnableSelectBlock: true,
      entities,
      blocks,
    };
  },
  computed: {
    HeightToTop() {
      return (
        (this.ShowSelectBlock ? this.Main.MapEditer.imagedata.length * 66 : 0) +
        20 +
        "px"
      );
    },
    ShowSelectBlock() {
      return this.EnableSelectBlock && !this.Main.MapEditer.IsPlayerEdit;
    },
  },
  mounted() {},
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
    SelectBlock(x, y, e) {
      this.Main.MapEditer.Select = y * 15 + x;
      this.Main.MapEditer.SelectStyle.left = e.target.offsetLeft + "px";
      this.Main.MapEditer.SelectStyle.top = e.target.offsetTop + "px";
      if (e.ctrlKey) {
        for (let y = 0; y < this.Main.MapEditer.data.length; y++) {
          for (let x = 0; x < this.Main.MapEditer.data[0].length; x++) {
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
    initSelect() {
      this.Main.MapEditer.SelectStyle.left =
        document
          .querySelector(
            "#SelectBlock > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > img"
          )
          .getBoundingClientRect().left + "px";
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
      if (
        this.Main.PlayerEditer.ShowEditer &&
        y == this.Main.PlayerEditer.Y &&
        x == this.Main.PlayerEditer.X
      ) {
        this.Main.PlayerEditer.ShowEditer = false;
        return;
      }
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
    isNum(v) {
      return /^\d+$/.test(v) ? true : "请输入数字";
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
          imgBlock.src = this.Main.MapEditer.imagedata[
            Math.floor(block.blockid / 15)
          ][block.blockid % 15];
          imgBlock.onload = function() {
            ctx.drawImage(imgBlock, x * 64, y * 64);
            if (this.Main.PlayerEditer.data[y][x].Info[2]) {
              WillLoad++;
              let imgUnit = new Image();
              imgUnit.src =
                "./images/players/" +
                this.Main.PlayerEditer.data[y][x].Info[2] +
                ".png";
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
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
li {
  list-style-type: none;
  border: 1px solid #000;
  height: 64px;
  width: 64px;
  display: inline-block;
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
  width: 230px;
  color: #fff;
  background-color: #dedede !important;
  border-radius: 8px;
  padding: 4px;
  line-height: 1.2;
}
#SelectBlock {
  position: fixed;
  top: 0;
}
</style>
