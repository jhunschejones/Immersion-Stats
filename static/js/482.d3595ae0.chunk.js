"use strict";(self.webpackChunkimmersion_stats=self.webpackChunkimmersion_stats||[]).push([[482],{7482:function(e,s,n){n.r(s),n.d(s,{default:function(){return c}});var t=n(2791),i=n(1355),a=n(8617),r=n(828),l=n(420),o=n(184);function c(){var e=(0,t.useContext)(l.R),s=e.aggregatedImmersionData,n=e.aggregatedImmersionIsLoading,c=(0,i.Z)(n,s),d=(0,t.useMemo)((function(){return 0===c.length?"0:00":c.find((function(e){return"Active total"==e.Category}))["All Time"]}),[c]),m=(0,t.useMemo)((function(){return 0===c.length?"0:00":c.find((function(e){return"Passive Listening"==e.Category}))["All Time"]}),[c]),g=(0,t.useMemo)((function(){return 0===c.length?"0:00":c.find((function(e){return"All total"==e.Category}))["All Time"]}),[c]),h=(0,t.useMemo)((function(){return 0===c.length?"0 days":c.find((function(e){return"All total"==e.Category}))[""].replace("/ ","")}),[c]);return n?(0,o.jsx)("p",{className:"loading-messsage",children:"Fetching csv file..."}):(0,o.jsxs)("div",{className:"TotalImmersion",children:[(0,o.jsx)("h1",{style:{margin:"4px 0 2px 0",padding:"0",fontSize:"28px",fontWeight:"600"},children:"Total Immersion"}),(0,o.jsxs)("p",{className:"total-days",children:[(0,o.jsx)(a.v9e,{className:"days-fire"}),h]}),(0,o.jsx)("div",{className:"totals-container",children:(0,o.jsxs)("div",{className:"totals-row",children:[(0,o.jsxs)("div",{className:"totals-card",children:[(0,o.jsx)("h2",{children:"Active Immersion"}),(0,o.jsxs)("p",{children:[(0,o.jsx)(r.Br8,{style:{display:"none",paddingRight:"4px",marginBottom:"-2px",opacity:"0.8"}}),d]})]}),(0,o.jsxs)("div",{className:"totals-card",children:[(0,o.jsx)("h2",{children:"Passive Immersion"}),(0,o.jsxs)("p",{children:[(0,o.jsx)(r.Z$K,{style:{display:"none",paddingRight:"6px",marginBottom:"-1px",opacity:"0.8"}}),m]})]}),(0,o.jsxs)("div",{className:"totals-card",children:[(0,o.jsx)("h2",{children:"All Immersion"}),(0,o.jsxs)("p",{children:[(0,o.jsx)(r.w6W,{style:{color:"#ce82ff",paddingRight:"8px",marginBottom:"-3px",opacity:"0.8"}}),g]})]})]})})]})}}}]);
//# sourceMappingURL=482.d3595ae0.chunk.js.map