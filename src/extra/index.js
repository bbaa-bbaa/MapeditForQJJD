import Vue from "vue";
var MapEditer = {
  MapEditer: {
    BlockObj: function(a) {
      this.blockid = a;
    },
    init: function() {
      for (let i = 0; i < 11; i++) {
        let a = new Array();
        for (let j = 0; j < 15; j++) {
          let o = new this.BlockObj(0);
          a.push(o);
        }
        this.data.push(a);
      }
      MapEditer.Y = this.data.length;
      MapEditer.X = this.data[0].length;
      this.ToCsv();
    },
    initimage: function(i) {
      let a = new Array();
      let f = function() {
        this.initimage(i + 15);
      };
      for (var l = 0; l < 15; l++) {
        a.push("./images/blocks/" + (i + l) + ".png");
      }
      this.imagedata.push(a);
      let img = new Image();
      img.src = "./images/blocks/" + (i + 15) + ".png";
      img.onload = f.bind(this);
    },
    ToCsv: function(r) {
      let data = "";
      for (let i = 0, yitem; (yitem = this.data[i]); i++) {
        for (let j = 0, xitem; (xitem = yitem[j]); j++) {
          data += xitem.blockid + ",";
        }
        data = data.substr(0, data.length - 1) + "\r\n";
      }
      data = data.substr(0, data.length - 2);
      if (r) {
        return data;
      }
      MapEditer.SaveFile = data;
      MapEditer.PlayerEditer.ShowEditer = false;
      return false;
    },
    LoadMap: function(MapStr) {
      if (MapStr != undefined) {
        MapStr = MapStr.replace(/[\t ]*/g, "")
          .replace(/(\n)+/g, "\n")
          .replace(/\n$/g, "")
          .replace(/\r/g, "")
          .split(/\n/);
      } else {
        var MapStr = MapEditer.SaveFile.replace(/[\t ]*/g, "")
          .replace(/(\n)+/g, "\n")
          .replace(/\n$/g, "")
          .replace(/\r/g, "")
          .split(/\n/);
      }
      this.data = new Array();
      for (var i = 0, item; (item = MapStr[i]); i++) {
        item = item.split(",");
        this.data[i] = new Array();
        for (var j = 0, item2; (item2 = item[j]); j++) {
          this.data[i][j] = new this.BlockObj(item2);
        }
      }
      MapEditer.Y = this.data.length;
      MapEditer.X = this.data[0].length;
      var X = MapEditer.PlayerEditer.data[0].length;
      var Y = MapEditer.PlayerEditer.data.length;
      for (var i = 0; i < MapEditer.Y; i++) {
        if (MapEditer.PlayerEditer.data[i] == undefined) {
          MapEditer.PlayerEditer.data.push([]);
        }
        for (var j = 0; j < MapEditer.X; j++) {
          if (MapEditer.PlayerEditer.data[i][j] == undefined) {
            MapEditer.PlayerEditer.data[i].push(
              MapEditer.PlayerEditer.PlayerObj()
            );
          }
        }
      }
      this.ToCsv(MapStr != undefined);
    },
    ReSizeMap: function(a) {
      switch (a) {
        case "top":
          var a = new Array();
          for (let i = 0; i < this.data[0].length; i++) {
            let o = new this.BlockObj(0);
            a.push(o);
          }
          this.data.unshift(a);
          var a = new Array();
          for (let i = 0; i < this.data[0].length; i++) {
            let o = new MapEditer.PlayerEditer.PlayerObj();
            a.push(o);
          }
          MapEditer.PlayerEditer.data.unshift(a);
          MapEditer.Y = this.data.length;
          MapEditer.X = this.data[0].length;
          break;
        case "bottom":
          var a = new Array();
          for (let i = 0; i < this.data[0].length; i++) {
            let o = new this.BlockObj(0);
            a.push(o);
          }
          this.data.push(a);
          var a = new Array();
          for (let i = 0; i < this.data[0].length; i++) {
            let o = new MapEditer.PlayerEditer.PlayerObj();
            a.push(o);
          }
          MapEditer.PlayerEditer.data.push(a);
          MapEditer.Y = this.data.length;
          MapEditer.X = this.data[0].length;
          break;
        case "left":
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].unshift(new this.BlockObj(0));
            MapEditer.PlayerEditer.data[i].unshift(
              new MapEditer.PlayerEditer.PlayerObj()
            );
          }
          MapEditer.Y = this.data.length;
          MapEditer.X = this.data[0].length;
          break;
        case "right":
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].push(new this.BlockObj(0));
            MapEditer.PlayerEditer.data[i].push(
              new MapEditer.PlayerEditer.PlayerObj()
            );
          }
          MapEditer.Y = this.data.length;
          MapEditer.X = this.data[0].length;
          break;
      }
      if (!this.IsPlayerEdit) {
        this.ToCsv();
      }
    },
    SelectStyle: {
      position: "absolute",
      "z-index": 1,
      top: "1px",
      left: "1px",
    },
    imagedata: [],
    data: [],
    Select: 0,
  },
  PlayerEditer: {
    init: function() {
      for (let i = 0; i < 8; i++) {
        this.PlayerInfo.push(null);
      }
      for (let i = 0; i < MapEditer.Y; i++) {
        let a = new Array();
        for (let j = 0; j < MapEditer.X; j++) {
          a.push(new this.PlayerObj());
        }
        this.data.push(a);
      }
    },
    AddPlayer: function() {
      for (let [i, item] of this.PlayerInfo.entries()) {
        Vue.set(this.data[this.Y][this.X].Info, i, item);
      }
    },
    PlayerObj: function() {
      this.Info = [];
    },
    bjqd: function(Type) {
      var Img = new Image();
      Img.crossOrigin = "*";
      Img.src = "./images/players/" + Type + ".png";
      var that = this;
      Img.onload = function() {
        /*var canvas=document.createElement("canvas");
				canvas.width=64;
				canvas.height=64;
				var ctx=canvas.getContext('2d');
				ctx.drawImage(this,0,0);
				var ImageData=ctx.getImageData(0,0,64,64);
				for(var i=0;i<64;i++) {
					for(var j=0;j<64;j++) {
						if(ImageData.data[((i*(ImageData.width*4)) + (j*4)) + 0]==255&&ImageData.data[((i*(ImageData.width*4)) + (j*4)) + 1]==255&&ImageData.data[((i*(ImageData.width*4)) + (j*4)) + 2]==255) {
							ImageData.data[((i*(ImageData.width*4)) + (j*4)) + 3]=0;
						}
					}
				}
				ctx.putImageData(ImageData,0,0);*/
        Vue.set(that.imagedata, Type, "./images/players/" + Type + ".png");
      };
    },
    ToSave: function(r) {
      var Data =
        "#文件格式：x,y,名称,血量,类型,阵营,攻击距离,移动距离,伤害,防御\r\n";
      for (var i = 0, item; (item = this.data[i]); i++) {
        for (var j = 0, item2; (item2 = item[j]); j++) {
          if (item2.Info[2]) {
            Data += j + ",";
            Data += i + ",";
            for (let item3 of item2.Info) {
              Data += item3 + ",";
            }
            Data = Data.substr(0, Data.length - 1) + "\r\n";
          }
        }
      }
      Data += "#=============玩家编辑器生成=============";
      if (r) {
        return Data;
      }
      MapEditer.SaveFile = Data;
      return true;
    },
    LoadSave: function(Data) {
      if (Data == undefined) {
        var Data = MapEditer.SaveFile;
      }
      Data = Data.replace(/#[^\n]*\n/g, "")
        .replace(/^#[^\n]*$/g, "")
        .replace(/(\n)+/g, "\n")
        .replace(/\n$/g, "")
        .replace(/\r/g, "");
      Data = Data.split(/\n/);
      this.data = [];
      //console.log(Data)
      this.init();
      for (var i = 0, item; (item = Data[i]); i++) {
        var Data2 = Data[i].split(",");
        var X = Data2[0];
        var Y = Data2[1];
        if (X < MapEditer.X && Y < MapEditer.Y) {
          for (let item of Data2.slice(2)) {
            this.data[Y][X].Info.push(item);
          }
        }
      }
      this.ShowEditer = false;
    },
    X: 0,
    Y: 0,
    PlayerInfo: [],
    imagedata: {},
    data: [],
    ShowEditer: false,
    Style: {
      position: "absolute",
      "z-index": 1,
      top: "0px",
      left: "0px",
    },
    EditerStyle: {
      top: "0px",
      left: "0px",
    },
  },
  init: function() {
    this.MapEditer.BlockObj.prototype.url = function() {
      return "./images/blocks/" + this.blockid + ".png";
    };
    this.PlayerEditer.PlayerObj.prototype.url = function() {
      if (MapEditer.PlayerEditer.imagedata[this.Info[2]] == undefined) {
        MapEditer.PlayerEditer.bjqd(this.Info[2]);
        return "./images/loading.gif";
      }
      return MapEditer.PlayerEditer.imagedata[this.Info[2]];
    };
    this.MapEditer.initimage(0);
    this.MapEditer.init();
    this.PlayerEditer.init();
  },
  Offset: function(dom) {
    let BoundingClientRect = dom.getBoundingClientRect();
    let offset = {
      left: BoundingClientRect.left + document.documentElement.scrollLeft,
      top: BoundingClientRect.top + document.documentElement.scrollTop,
    };
    return offset;
  },
  IsPlayerEdit: false,
  SaveFile: null,
  X: 15,
  Y: 11,
};
MapEditer.init();
export default MapEditer;
