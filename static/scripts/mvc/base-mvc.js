define(["exports","libs/underscore","libs/backbone","utils/add-logging","utils/localization"],function(e,t,i,r,n){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}function a(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}Object.defineProperty(e,"__esModule",{value:!0});var o=a(t),l=a(i),h=s(r),d=s(n),c={logger:null,_logNamespace:"."};(0,h.default)(c);var u=l.Model.extend({initialize:function(e){if(this._checkEnabledSessionStorage(),!e.id)throw new Error("SessionStorageModel requires an id in the initial attributes");this.id=e.id;var t=this.isNew()?{}:this._read(this);this.clear({silent:!0}),this.save(o.extend({},this.defaults,t,e),{silent:!0}),this.on("change",function(){this.save()})},_checkEnabledSessionStorage:function(){try{return window.sessionStorage.length>=0}catch(e){return alert("Please enable cookies in your browser for this Galaxy site"),!1}},sync:function(e,t,i){i.silent||t.trigger("request",t,{},i);var r={};switch(e){case"create":r=this._create(t);break;case"read":r=this._read(t);break;case"update":r=this._update(t);break;case"delete":r=this._delete(t)}return void 0!==r||null!==r?i.success&&i.success():i.error&&i.error(),r},_create:function(e){try{var t=e.toJSON(),i=sessionStorage.setItem(e.id,JSON.stringify(t));return null===i?i:t}catch(e){if(!(e instanceof DOMException&&navigator.userAgent.indexOf("Safari")>-1))throw e}return null},_read:function(e){return JSON.parse(sessionStorage.getItem(e.id))},_update:function(e){return e._create(e)},_delete:function(e){return sessionStorage.removeItem(e.id)},isNew:function(){return!sessionStorage.hasOwnProperty(this.id)},_log:function(){return JSON.stringify(this.toJSON(),null,"  ")},toString:function(){return"SessionStorageModel("+this.id+")"}});u.prototype=o.omit(u.prototype,"url","urlRoot");var g={searchAttributes:[],searchAliases:{},searchAttribute:function(e,t){var i=this.get(e);return!(!t||void 0===i||null===i)&&(o.isArray(i)?this._searchArrayAttribute(i,t):-1!==i.toString().toLowerCase().indexOf(t.toLowerCase()))},_searchArrayAttribute:function(e,t){return t=t.toLowerCase(),o.any(e,function(e){return-1!==e.toString().toLowerCase().indexOf(t.toLowerCase())})},search:function(e){var t=this;return o.filter(this.searchAttributes,function(i){return t.searchAttribute(i,e)})},matches:function(e){var t=e.split("=");if(t.length>=2){var i=t[0];return i=this.searchAliases[i]||i,this.searchAttribute(i,t[1])}return!!this.search(e).length},matchesAll:function(e){var t=this;return e=e.match(/(".*"|\w*=".*"|\S*)/g).filter(function(e){return!!e}),o.all(e,function(e){return e=e.replace(/"/g,""),t.matches(e)})}},f={hiddenUntilActivated:function(e,t){if(t=t||{},this.HUAVOptions={$elementShown:this.$el,showFn:jQuery.prototype.toggle,showSpeed:"fast"},o.extend(this.HUAVOptions,t||{}),this.HUAVOptions.hasBeenShown=this.HUAVOptions.$elementShown.is(":visible"),this.hidden=this.isHidden(),e){var i=this;e.on("click",function(e){i.toggle(i.HUAVOptions.showSpeed)})}},isHidden:function(){return this.HUAVOptions.$elementShown.is(":hidden")},toggle:function(){return this.hidden?(this.HUAVOptions.hasBeenShown||o.isFunction(this.HUAVOptions.onshowFirstTime)&&(this.HUAVOptions.hasBeenShown=!0,this.HUAVOptions.onshowFirstTime.call(this)),o.isFunction(this.HUAVOptions.onshow)&&(this.HUAVOptions.onshow.call(this),this.trigger("hiddenUntilActivated:shown",this)),this.hidden=!1):(o.isFunction(this.HUAVOptions.onhide)&&(this.HUAVOptions.onhide.call(this),this.trigger("hiddenUntilActivated:hidden",this)),this.hidden=!0),this.HUAVOptions.showFn.apply(this.HUAVOptions.$elementShown,arguments)}},S={initialize:function(e){this.draggable=e.draggable||!1},$dragHandle:function(){return this.$(".title-bar")},toggleDraggable:function(){this.draggable?this.draggableOff():this.draggableOn()},draggableOn:function(){this.draggable=!0,this.dragStartHandler=o.bind(this._dragStartHandler,this),this.dragEndHandler=o.bind(this._dragEndHandler,this);var e=this.$dragHandle().attr("draggable",!0).get(0);e.addEventListener("dragstart",this.dragStartHandler,!1),e.addEventListener("dragend",this.dragEndHandler,!1)},draggableOff:function(){this.draggable=!1;var e=this.$dragHandle().attr("draggable",!1).get(0);e.removeEventListener("dragstart",this.dragStartHandler,!1),e.removeEventListener("dragend",this.dragEndHandler,!1)},_dragStartHandler:function(e){return e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text",JSON.stringify(this.model.toJSON())),this.trigger("draggable:dragstart",e,this),!1},_dragEndHandler:function(e){return this.trigger("draggable:dragend",e,this),!1}},p={initialize:function(e){this.selectable=e.selectable||!1,this.selected=e.selected||!1},$selector:function(){return this.$(".selector")},_renderSelected:function(){this.$selector().find("span").toggleClass("fa-check-square-o",this.selected).toggleClass("fa-square-o",!this.selected)},toggleSelector:function(){this.$selector().is(":visible")?this.hideSelector():this.showSelector()},showSelector:function(e){e=void 0!==e?e:this.fxSpeed,this.selectable=!0,this.trigger("selectable",!0,this),this._renderSelected(),e?this.$selector().show(e):this.$selector().show()},hideSelector:function(e){e=void 0!==e?e:this.fxSpeed,this.selectable=!1,this.trigger("selectable",!1,this),e?this.$selector().hide(e):this.$selector().hide()},toggleSelect:function(e){this.selected?this.deselect(e):this.select(e)},select:function(e){return this.selected||(this.trigger("selected",this,e),this.selected=!0,this._renderSelected()),!1},deselect:function(e){return this.selected&&(this.trigger("de-selected",this,e),this.selected=!1,this._renderSelected()),!1}};e.default={LoggableMixin:c,SessionStorageModel:u,mixin:function(e,t){var i=Array.prototype.slice.call(arguments,0),r=i.pop();return i.unshift(r),o.defaults.apply(o,i)},SearchableModelMixin:g,HiddenUntilActivatedViewMixin:f,DraggableViewMixin:S,SelectableViewMixin:p,wrapTemplate:function(e,t){t=t||"model";var i=o.template(e.join(""));return function(e,r){var n={view:r||{},_l:d.default};return n[t]=e||{},i(n)}},buildComparator:function(e,t){var i=(t=t||{}).ascending?1:-1;return function(t,r){return t=t.get(e),r=r.get(e),(t<r?-1:t>r?1:0)*i}}}});
//# sourceMappingURL=../../maps/mvc/base-mvc.js.map
