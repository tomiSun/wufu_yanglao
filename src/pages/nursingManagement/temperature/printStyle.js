export const printStyle = `
html,
body,
#main {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.temperature-chart {
  margin: 0 auto;
  height: 100%;

}
.show-detail {
  overflow-x: auto;
}
.show-detail::-webkit-scrollbar {
  width: 0;
  height: 8px;
}
.show-detail::-webkit-scrollbar-corner,
.show-detail::-webkit-scrollbar-track {
  background-color: #B7B7B7;
}
.show-detail::-webkit-scrollbar-thumb {
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.footBtn {
  line-height: 28px;
  text-align: left;
  margin: 15px 0;
}
.footBtn .ant-calendar-picker {
  margin-right: 10px;
}
.temperature-chart {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.temperature-chart .ant-spin-nested-loading {
  width: 100%;
  height: 100%;
}
.temperature-chart .ant-spin-nested-loading .ant-spin-container {
  width: 100%;
  height: 100%;
}
.temperature-chart table {
  border-collapse: collapse;
  table-layout: fixed;
}
.temperature-chart th,
.temperature-chart td {
  border: 1px solid #BFBFBF;
  position: relative;
}
.temperature-chart .tempCartSvg {
  position: relative;
  height: 100%;
}
.temperature-chart .fixed_div {
  position: relative;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: none;
  overflow: hidden;
}
.temperature-chart table.patInfo {
  width: 100%;
  font-size: 11px;
  border-bottom: none;
  margin-bottom: 10px;
}
.temperature-chart table.showInfo {
  width: 100%;
  font-size: 11px;
  border-bottom: none;
}
.temperature-chart table.patInfo td {
  border: none;
}
.temperature-chart table.patInfo tr:nth-of-type(3) td,
.temperature-chart table.patInfo tr:nth-of-type(4) td {
  height: 14px;
  line-height: 14px;
}
.temperature-chart table.patInfo tr:nth-of-type(4) td {
  border-bottom: 1px solid #BFBFBF;
}
.temperature-chart table.patInfo td h1 {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  margin-top: 5px;
  letter-spacing: 2px;
}
.temperature-chart table.patInfo td h3 {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 6px;
}
.temperature-chart .bline {
  float: left;
  width: 120px;
  line-height: 12px;
  height: 12px;
  text-indent: 4px;
  max-width: calc(100% - 56px);
}
.temperature-chart .btitle {
  float: left;
  text-indent: 8px;
  max-width: 56px;
}
.temperature-chart tr.percent4 td {
  width: 25%;
}
.temperature-chart .showInfo {
  width: 100%;
}
.temperature-chart .showInfo tr td {
  text-align: center;
  font-size: 11px;
  height: 14px;
  line-height: 14px;
}
.temperature-chart .showInfo tr:nth-of-type(4) td {
  font-size: 11px;
}
.temperature-chart .showInfo tr {
  height: 12px;
}
.temperature-chart .showInfo tr:nth-of-type(1) td {
  border-top: none;
}
.temperature-chart .showInfo tr td:nth-of-type(1) {
  border-left: none;
  text-align: justify;
  text-align-last: justify;
  padding: 0 8px;
}
.temperature-chart .showInfo tr td:last-of-type {
  border-right: none;
}
.temperature-chart .flow_div {
  position: relative;
  left: 0;
  width: 100%;
  // height: calc(100% - 73px);
  max-height: calc(100% - 73px);
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #000;
}
.temperature-chart .flow_div::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.temperature-chart table.tableSvg {
  width: 100%;
}
.temperature-chart table.tableSvg tr td {
  font-size: 11px;
  width: 15px;
  height: 15px;
}
.temperature-chart table.tableSvg tr td:nth-of-type(1) {
  font-size: 11px;
  text-align: center;
  border-left: none;
}
.temperature-chart table.tableSvg tr:last-of-type td {
  border-bottom: none;
}
.temperature-chart table.tableSvg tr td:last-of-type {
  border-right: none;
}
.temperature-chart table.tableSvg tr.height td:last-of-type {
  border-right: 1px solid red;
}
.temperature-chart table.tableSvg tr:nth-of-type(1) td:last-of-type {
  border-right: none;
}
.temperature-chart table.tableSvg td {
  text-align: center;
}
.temperature-chart .scale {
  width: 100%;
  display: block;
  transform: scale(0.8);
}
.temperature-chart table tr.height {
  height: 15px;
}
.temperature-chart table tr.height td.hx {
  height: 34px;
}
.temperature-chart table tr.height:nth-of-type(1) td {
  border-top: none;
}
.temperature-chart tr td.borderR,
.temperature-chart tr.height td.borderR {
  border-right: 1px solid #000;
}
.temperature-chart tr.height.borderB td,
.temperature-chart tr.borderB td,
.temperature-chart tr.height td.borderB {
  border-bottom: 1px solid #000;
}
.temperature-chart .svgCenter {
  position: absolute;
  width: 100%;
  /*height:100%;*/
  z-index: 100;
}
.temperature-chart #svgCenter {
  position: absolute;
  top: 15px;
  left: 100px;
  width: calc(100% - 100px);
  height: 100%;
}
.temperature-chart .fontSet {
  -webkit-transform: scaleX(0.99);
}
.temperature-chart #titleTr tr:nth-of-type(2) td {
  padding-bottom: 3px;
}
.temperature-chart .svgLeft,
.temperature-chart .svgRight,
.temperature-chart #svgLeft,
.temperature-chart #svgRight {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.temperature-chart #svgTitle {
  background: #FFF;
  border: 1px solid #BFBFBF;
  padding: 1px 6px;
  color: #3C3C3C;
  font-weight: 500;
  font-size: 12px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  position: absolute;
  z-index: 1000;
  display: none;
}
.temperature-chart [line] {
  cursor: pointer;
}
/* 打印样式调整 */
.temperature-chart .container.print table tr.height {
  height: 15px;
}
.temperature-chart .container.print .footBtn {
  display: none;
}
.temperature-chart .container.print .scale {
  transform: scale(1);
}
.temperature-chart .container.print .patInfo td {
  height: 17px;
  line-height: 17px;
  font-size: 11px;
}
.temperature-chart .container.print .showInfo td {
  height: 15px;
  line-height: 15px;
  font-size: 11px;
}
.temperature-chart .container.alone.print tr.every td {
  line-height: 15px;
  font-size: 11px;
}
.temperature-chart .container.alone.print .tableSvg tr.addClone {
  height: 15px;
}
.temperature-chart .container.print .flow_div {
  max-height: inherit;
}
.temperature-chart text {
  font-size: 11px;
}
.temperature-chart .container.print text {
  font-size: 11px;
}
.temperature-chart circle,
.temperature-chart rect,
.temperature-chart line {
  cursor: pointer;
}
.ant-tooltip-inner {
  background: #FFF;
  font-size: 11px;
  font-family: "microsoft yahei", "Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  line-height: 15px !important;
  min-height: 15px !important;
  padding: 5px 10px !important;
}
@page{
  margin:0;
  padding:0;
}
`;
