/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const L = globalThis, G = L.ShadowRoot && (L.ShadyCSS === void 0 || L.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), se = /* @__PURE__ */ new WeakMap();
let me = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (G && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = se.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && se.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const _e = (s) => new me(typeof s == "string" ? s : s + "", void 0, Q), ge = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((r, i, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new me(t, s, Q);
}, we = (s, e) => {
  if (G) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), i = L.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, s.appendChild(r);
  }
}, ie = G ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return _e(t);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: Ae, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: Ce, getOwnPropertySymbols: Ee, getPrototypeOf: Me } = Object, _ = globalThis, ne = _.trustedTypes, Ie = ne ? ne.emptyScript : "", J = _.reactiveElementPolyfillSupport, R = (s, e) => s, D = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? Ie : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, X = (s, e) => !Se(s, e), oe = { attribute: !0, type: String, converter: D, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), _.litPropertyMetadata ?? (_.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = oe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(e, r, t);
      i !== void 0 && Ae(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: i, set: n } = Oe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const a = i == null ? void 0 : i.call(this);
      n == null || n.call(this, o), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const e = Me(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const t = this.properties, r = [...Ce(t), ...Ee(t)];
      for (const i of r) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, i] of t) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const i = this._$Eu(t, r);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const i of r) t.unshift(ie(i));
    } else e !== void 0 && t.push(ie(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return we(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostConnected) == null ? void 0 : r.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var r;
      return (r = t.hostDisconnected) == null ? void 0 : r.call(t);
    });
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    var n;
    const r = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : D).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, o;
    const r = this.constructor, i = r._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const a = r.getPropertyOptions(i), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : D;
      this._$Em = i;
      const f = l.fromAttribute(t, a.type);
      this[i] = f ?? ((o = this._$Ej) == null ? void 0 : o.get(i)) ?? f, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, i = !1, n) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (i === !1 && (n = this[e]), r ?? (r = a.getPropertyOptions(e)), !((r.hasChanged ?? X)(n, t) || r.useDefault && r.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: i, wrapped: n }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: a } = o, l = this[n];
        a !== !0 || this._$AL.has(n) || l === void 0 || this.C(n, void 0, o, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (r = this._$EO) == null || r.forEach((i) => {
        var n;
        return (n = i.hostUpdate) == null ? void 0 : n.call(i);
      }), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[R("elementProperties")] = /* @__PURE__ */ new Map(), C[R("finalized")] = /* @__PURE__ */ new Map(), J == null || J({ ReactiveElement: C }), (_.reactiveElementVersions ?? (_.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, ae = (s) => s, B = z.trustedTypes, le = B ? B.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ve = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + x, ke = `<${je}>`, O = document, q = () => O.createComment(""), F = (s) => s === null || typeof s != "object" && typeof s != "function", ee = Array.isArray, Pe = (s) => ee(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, w = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, ce = /"/g, ye = /^(?:script|style|textarea|title)$/i, Ve = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), d = Ve(1), E = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), S = O.createTreeWalker(O, 129);
function be(s, e) {
  if (!ee(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const Re = (s, e) => {
  const t = s.length - 1, r = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = V;
  for (let a = 0; a < t; a++) {
    const l = s[a];
    let f, c, u = -1, h = 0;
    for (; h < l.length && (o.lastIndex = h, c = o.exec(l), c !== null); ) h = o.lastIndex, o === V ? c[1] === "!--" ? o = de : c[1] !== void 0 ? o = fe : c[2] !== void 0 ? (ye.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = w) : c[3] !== void 0 && (o = w) : o === w ? c[0] === ">" ? (o = i ?? V, u = -1) : c[1] === void 0 ? u = -2 : (u = o.lastIndex - c[2].length, f = c[1], o = c[3] === void 0 ? w : c[3] === '"' ? ce : ue) : o === ce || o === ue ? o = w : o === de || o === fe ? o = V : (o = w, i = void 0);
    const j = o === w && s[a + 1].startsWith("/>") ? " " : "";
    n += o === V ? l + ke : u >= 0 ? (r.push(f), l.slice(0, u) + ve + l.slice(u) + x + j) : l + x + (u === -2 ? a : j);
  }
  return [be(s, n + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class U {
  constructor({ strings: e, _$litType$: t }, r) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const a = e.length - 1, l = this.parts, [f, c] = Re(e, t);
    if (this.el = U.createElement(f, r), S.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = S.nextNode()) !== null && l.length < a; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(ve)) {
          const h = c[o++], j = i.getAttribute(u).split(x), p = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: n, name: p[2], strings: j, ctor: p[1] === "." ? Te : p[1] === "?" ? qe : p[1] === "@" ? Fe : Y }), i.removeAttribute(u);
        } else u.startsWith(x) && (l.push({ type: 6, index: n }), i.removeAttribute(u));
        if (ye.test(i.tagName)) {
          const u = i.textContent.split(x), h = u.length - 1;
          if (h > 0) {
            i.textContent = B ? B.emptyScript : "";
            for (let j = 0; j < h; j++) i.append(u[j], q()), S.nextNode(), l.push({ type: 2, index: ++n });
            i.append(u[h], q());
          }
        }
      } else if (i.nodeType === 8) if (i.data === je) l.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(x, u + 1)) !== -1; ) l.push({ type: 7, index: n }), u += x.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = O.createElement("template");
    return r.innerHTML = e, r;
  }
}
function M(s, e, t = s, r) {
  var o, a;
  if (e === E) return e;
  let i = r !== void 0 ? (o = t._$Co) == null ? void 0 : o[r] : t._$Cl;
  const n = F(e) ? void 0 : e._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((a = i == null ? void 0 : i._$AO) == null || a.call(i, !1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = i : t._$Cl = i), i !== void 0 && (e = M(s, i._$AS(s, e.values), i, r)), e;
}
class ze {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: r } = this._$AD, i = ((e == null ? void 0 : e.creationScope) ?? O).importNode(t, !0);
    S.currentNode = i;
    let n = S.nextNode(), o = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let f;
        l.type === 2 ? f = new N(n, n.nextSibling, this, e) : l.type === 1 ? f = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (f = new Ue(n, this, e)), this._$AV.push(f), l = r[++a];
      }
      o !== (l == null ? void 0 : l.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = O, i;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class N {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, r, i) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = i, this._$Cv = (i == null ? void 0 : i.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = M(this, e, t), F(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Pe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && F(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: r } = e, i = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = U.createElement(be(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(t);
    else {
      const o = new ze(i, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = pe.get(e.strings);
    return t === void 0 && pe.set(e.strings, t = new U(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, i = 0;
    for (const n of e) i === t.length ? t.push(r = new N(this.O(q()), this.O(q()), this, this.options)) : r = t[i], r._$AI(n), i++;
    i < t.length && (this._$AR(r && r._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, t); e !== this._$AB; ) {
      const i = ae(e).nextSibling;
      ae(e).remove(), e = i;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, i, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = g;
  }
  _$AI(e, t = this, r, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = M(this, e, t, 0), o = !F(e) || e !== this._$AH && e !== E, o && (this._$AH = e);
    else {
      const a = e;
      let l, f;
      for (e = n[0], l = 0; l < n.length - 1; l++) f = M(this, a[r + l], t, l), f === E && (f = this._$AH[l]), o || (o = !F(f) || f !== this._$AH[l]), f === g ? e = g : e !== g && (e += (f ?? "") + n[l + 1]), this._$AH[l] = f;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Te extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class qe extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Fe extends Y {
  constructor(e, t, r, i, n) {
    super(e, t, r, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = M(this, e, t, 0) ?? g) === E) return;
    const r = this._$AH, i = e === g && r !== g || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== g && (r === g || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ue {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const W = z.litHtmlPolyfillSupport;
W == null || W(U, N), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.2");
const Ne = (s, e, t) => {
  const r = (t == null ? void 0 : t.renderBefore) ?? e;
  let i = r._$litPart$;
  if (i === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    r._$litPart$ = i = new N(e.insertBefore(q(), n), n, void 0, t ?? {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class T extends C {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return E;
  }
}
var he;
T._$litElement$ = !0, T.finalized = !0, (he = A.litElementHydrateSupport) == null || he.call(A, { LitElement: T });
const K = A.litElementPolyfillSupport;
K == null || K({ LitElement: T });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = { attribute: !0, type: String, converter: D, reflect: !1, hasChanged: X }, De = (s = Le, e, t) => {
  const { kind: r, metadata: i } = t;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(t.name, s), r === "accessor") {
    const { name: o } = t;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, s, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, s, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = t;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, s, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function I(s) {
  return (e, t) => typeof t == "object" ? De(s, e, t) : ((r, i, n) => {
    const o = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, r), o ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(s, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(s) {
  return I({ ...s, state: !0, attribute: !1 });
}
class $ {
  constructor(e, t = {}) {
    this.defsMap = /* @__PURE__ */ new Map(), this.resolutionStack = /* @__PURE__ */ new Set(), this.schema = typeof e == "string" ? JSON.parse(e) : e, this.options = t, this.buildDefsMap();
  }
  /**
   * Parse a JSON Schema string into a schema object
   */
  static parse(e) {
    try {
      const t = JSON.parse(e);
      if (typeof t == "boolean")
        return t ? {} : { not: {} };
      if (typeof t != "object" || t === null)
        throw new Error("Schema must be an object or boolean");
      return t;
    } catch (t) {
      throw t instanceof SyntaxError ? new Error(`Invalid JSON in schema: ${t.message}`) : t;
    }
  }
  /**
   * Build a map of all $defs for quick reference resolution
   */
  buildDefsMap() {
    if (this.schema.$defs)
      for (const [t, r] of Object.entries(this.schema.$defs))
        this.defsMap.set(`#/$defs/${t}`, r);
    const e = this.schema.definitions;
    if (e && typeof e == "object")
      for (const [t, r] of Object.entries(e))
        this.defsMap.set(`#/definitions/${t}`, r);
  }
  /**
   * Resolve a $ref to its target schema
   * Detects and prevents circular reference loops
   */
  resolveRef(e) {
    if (this.resolutionStack.has(e))
      return {
        _originalRef: e,
        _isResolved: !0,
        _isCircular: !0,
        title: `Circular reference: ${e}`
      };
    this.resolutionStack.add(e);
    try {
      if (e.startsWith("#")) {
        const t = this.resolveLocalRef(e);
        if (t)
          return {
            ...t,
            _originalRef: e,
            _isResolved: !0
          };
      }
      if (this.options.externalSchemas && e in this.options.externalSchemas)
        return {
          ...this.options.externalSchemas[e],
          _originalRef: e,
          _isResolved: !0
        };
      if (this.options.strictRefs)
        throw new Error(`Unable to resolve reference: ${e}`);
      return null;
    } finally {
      this.resolutionStack.delete(e);
    }
  }
  /**
   * Check if a reference would create a circular dependency
   */
  isCircularRef(e) {
    return this.resolutionStack.has(e);
  }
  /**
   * Reset the resolution stack (useful for starting a new resolution chain)
   */
  resetResolutionStack() {
    this.resolutionStack.clear();
  }
  /**
   * Resolve a local reference (JSON Pointer within the document)
   */
  resolveLocalRef(e) {
    if (this.defsMap.has(e))
      return this.defsMap.get(e) || null;
    if (e === "#")
      return this.schema;
    const t = e.slice(1);
    return this.resolveJsonPointer(this.schema, t);
  }
  /**
   * Resolve a JSON Pointer path within an object
   */
  resolveJsonPointer(e, t) {
    if (!t || t === "/")
      return e;
    const r = t.split("/").slice(1);
    let i = e;
    for (const n of r) {
      const o = n.replace(/~1/g, "/").replace(/~0/g, "~");
      if (i === null || typeof i != "object")
        return null;
      if (Array.isArray(i)) {
        const a = parseInt(o, 10);
        if (isNaN(a) || a < 0 || a >= i.length)
          return null;
        i = i[a];
      } else
        i = i[o];
      if (i === void 0)
        return null;
    }
    return i;
  }
  /**
   * Get the parsed schema
   */
  getSchema() {
    return this.schema;
  }
  /**
   * Check if a schema is a boolean schema
   */
  static isBooleanSchema(e) {
    return typeof e == "boolean";
  }
  /**
   * Normalize a schema (handle boolean schemas, apply defaults)
   */
  static normalize(e) {
    return typeof e == "boolean" ? e ? {} : { not: {} } : e;
  }
  /**
   * Get the effective type(s) from a schema
   */
  static getTypes(e) {
    return e.type ? Array.isArray(e.type) ? e.type : [e.type] : [];
  }
  /**
   * Check if a schema allows a specific type
   */
  static allowsType(e, t) {
    return e.type ? this.getTypes(e).includes(t) : !0;
  }
}
class Be {
  constructor(e) {
    this.parser = new $(e);
  }
  /**
   * Validate a value against the schema
   */
  validate(e, t) {
    const r = t || this.parser.getSchema();
    return this.validateValue(e, r, "", "#");
  }
  /**
   * Check if a value is valid against the schema
   */
  isValid(e, t) {
    return this.validate(e, t).length === 0;
  }
  /**
   * Validate a value against a schema at a specific path
   */
  validateValue(e, t, r, i) {
    const n = [];
    if (typeof t == "boolean")
      return t || n.push({
        instancePath: r,
        schemaPath: i,
        keyword: "false schema",
        message: "Schema is false, no value is valid"
      }), n;
    if (t.$ref) {
      const o = this.parser.resolveRef(t.$ref);
      o && n.push(
        ...this.validateValue(
          e,
          o,
          r,
          `${i}/$ref`
        )
      );
    }
    if (t.type) {
      const o = this.validateType(
        e,
        t,
        r,
        i
      );
      n.push(...o);
    }
    return t.enum !== void 0 && (t.enum.some((o) => this.deepEqual(o, e)) || n.push({
      instancePath: r,
      schemaPath: `${i}/enum`,
      keyword: "enum",
      message: `Value must be one of: ${JSON.stringify(t.enum)}`,
      params: { allowedValues: t.enum }
    })), t.const !== void 0 && (this.deepEqual(t.const, e) || n.push({
      instancePath: r,
      schemaPath: `${i}/const`,
      keyword: "const",
      message: `Value must be: ${JSON.stringify(t.const)}`,
      params: { allowedValue: t.const }
    })), typeof e == "string" ? n.push(
      ...this.validateString(e, t, r, i)
    ) : typeof e == "number" ? n.push(
      ...this.validateNumber(e, t, r, i)
    ) : Array.isArray(e) ? n.push(
      ...this.validateArray(e, t, r, i)
    ) : typeof e == "object" && e !== null && n.push(
      ...this.validateObject(
        e,
        t,
        r,
        i
      )
    ), n.push(
      ...this.validateComposition(e, t, r, i)
    ), n.push(
      ...this.validateConditional(e, t, r, i)
    ), n;
  }
  /**
   * Validate the type of a value
   */
  validateType(e, t, r, i) {
    const n = $.getTypes(t);
    if (n.length === 0) return [];
    const o = this.getValueType(e);
    return n.some((l) => l === "integer" ? typeof e == "number" && Number.isInteger(e) : l === o) ? [] : [
      {
        instancePath: r,
        schemaPath: `${i}/type`,
        keyword: "type",
        message: `Expected type ${n.join(" or ")}, got ${o}`,
        params: { expectedTypes: n, actualType: o }
      }
    ];
  }
  /**
   * Get the JSON Schema type of a value
   */
  getValueType(e) {
    return e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
  }
  /**
   * Validate string-specific keywords
   */
  validateString(e, t, r, i) {
    const n = [];
    if (t.minLength !== void 0 && e.length < t.minLength && n.push({
      instancePath: r,
      schemaPath: `${i}/minLength`,
      keyword: "minLength",
      message: `String must be at least ${t.minLength} characters`,
      params: { minLength: t.minLength, actualLength: e.length }
    }), t.maxLength !== void 0 && e.length > t.maxLength && n.push({
      instancePath: r,
      schemaPath: `${i}/maxLength`,
      keyword: "maxLength",
      message: `String must be at most ${t.maxLength} characters`,
      params: { maxLength: t.maxLength, actualLength: e.length }
    }), t.pattern !== void 0 && (new RegExp(t.pattern, "u").test(e) || n.push({
      instancePath: r,
      schemaPath: `${i}/pattern`,
      keyword: "pattern",
      message: `String must match pattern: ${t.pattern}`,
      params: { pattern: t.pattern }
    })), t.format !== void 0 && e !== "") {
      const o = this.validateFormat(e, t.format);
      o && n.push({
        instancePath: r,
        schemaPath: `${i}/format`,
        keyword: "format",
        message: o,
        params: { format: t.format }
      });
    }
    return n;
  }
  /**
   * Validate string format
   */
  validateFormat(e, t) {
    switch (t) {
      case "date":
        return this.validateDateFormat(e);
      case "time":
        return this.validateTimeFormat(e);
      case "date-time":
        return this.validateDateTimeFormat(e);
      case "duration":
        return this.validateDurationFormat(e);
      case "email":
        return this.validateEmailFormat(e);
      case "idn-email":
        return this.validateIdnEmailFormat(e);
      case "uri":
        return this.validateUriFormat(e, !1);
      case "uri-reference":
        return this.validateUriFormat(e, !0);
      case "iri":
        return this.validateIriFormat(e, !1);
      case "iri-reference":
        return this.validateIriFormat(e, !0);
      case "uuid":
        return this.validateUuidFormat(e);
      case "ipv4":
        return this.validateIpv4Format(e);
      case "ipv6":
        return this.validateIpv6Format(e);
      case "hostname":
        return this.validateHostnameFormat(e);
      case "idn-hostname":
        return this.validateIdnHostnameFormat(e);
      case "regex":
        return this.validateRegexFormat(e);
      case "json-pointer":
        return this.validateJsonPointerFormat(e);
      case "relative-json-pointer":
        return this.validateRelativeJsonPointerFormat(e);
      case "uri-template":
        return this.validateUriTemplateFormat(e);
      default:
        return null;
    }
  }
  /**
   * Validate RFC 3339 full-date format (YYYY-MM-DD)
   */
  validateDateFormat(e) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e))
      return "Must be a valid date (YYYY-MM-DD)";
    const [r, i, n] = e.split("-").map(Number), o = new Date(r, i - 1, n);
    return o.getFullYear() !== r || o.getMonth() !== i - 1 || o.getDate() !== n ? "Must be a valid date" : null;
  }
  /**
   * Validate RFC 3339 full-time format (HH:MM:SS or HH:MM:SS.sss with timezone)
   */
  validateTimeFormat(e) {
    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)?$/i.test(e) ? null : "Must be a valid time (HH:MM:SS)";
  }
  /**
   * Validate RFC 3339 date-time format
   */
  validateDateTimeFormat(e) {
    if (!/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/i.test(e))
      return "Must be a valid date-time (YYYY-MM-DDTHH:MM:SS)";
    const r = e.substring(0, 10), i = this.validateDateFormat(r);
    return i || null;
  }
  /**
   * Validate ISO 8601 duration format
   */
  validateDurationFormat(e) {
    return !/^P(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/.test(e) || e === "P" || e === "PT" ? "Must be a valid ISO 8601 duration (e.g., P1Y2M3DT4H5M6S)" : null;
  }
  /**
   * Validate email format (RFC 5321)
   */
  validateEmailFormat(e) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e) ? null : "Must be a valid email address";
  }
  /**
   * Validate internationalized email format (RFC 6531)
   */
  validateIdnEmailFormat(e) {
    return /^.+@.+\..+$/.test(e) ? null : "Must be a valid email address";
  }
  /**
   * Validate URI format (RFC 3986)
   */
  validateUriFormat(e, t) {
    try {
      const r = new URL(
        e,
        t ? "http://example.com" : void 0
      );
      return !t && !r.protocol ? "Must be a valid URI with scheme" : null;
    } catch {
      return t ? "Must be a valid URI or URI reference" : "Must be a valid URI";
    }
  }
  /**
   * Validate IRI format (RFC 3987)
   */
  validateIriFormat(e, t) {
    return this.validateUriFormat(e, t);
  }
  /**
   * Validate UUID format (RFC 4122)
   */
  validateUuidFormat(e) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e) ? null : "Must be a valid UUID";
  }
  /**
   * Validate IPv4 address format (RFC 2673)
   */
  validateIpv4Format(e) {
    const t = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, r = e.match(t);
    if (!r)
      return "Must be a valid IPv4 address";
    for (let i = 1; i <= 4; i++) {
      const n = parseInt(r[i], 10);
      if (n < 0 || n > 255)
        return "Must be a valid IPv4 address (each octet must be 0-255)";
    }
    return null;
  }
  /**
   * Validate IPv6 address format (RFC 4291)
   */
  validateIpv6Format(e) {
    return /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?::[0-9a-fA-F]{1,4}){1,6}|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))$/.test(e) ? null : "Must be a valid IPv6 address";
  }
  /**
   * Validate hostname format (RFC 1123)
   */
  validateHostnameFormat(e) {
    return e.length > 253 ? "Hostname must be at most 253 characters" : new RegExp("^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(?:\\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*$").test(e) ? null : "Must be a valid hostname";
  }
  /**
   * Validate internationalized hostname format (RFC 5890)
   */
  validateIdnHostnameFormat(e) {
    if (e.length > 253)
      return "Hostname must be at most 253 characters";
    const t = e.split(".");
    for (const r of t) {
      if (r.length === 0 || r.length > 63)
        return "Each label must be 1-63 characters";
      if (r.startsWith("-") || r.endsWith("-"))
        return "Labels cannot start or end with hyphen";
    }
    return null;
  }
  /**
   * Validate regex format - check if value is a valid regular expression
   */
  validateRegexFormat(e) {
    try {
      return new RegExp(e), null;
    } catch {
      return "Must be a valid regular expression";
    }
  }
  /**
   * Validate JSON Pointer format (RFC 6901)
   */
  validateJsonPointerFormat(e) {
    if (e === "")
      return null;
    if (!e.startsWith("/"))
      return "JSON Pointer must start with / or be empty";
    const t = e.split("/").slice(1);
    for (const r of t) {
      let i = 0;
      for (; i < r.length; )
        if (r[i] === "~") {
          if (i + 1 >= r.length || r[i + 1] !== "0" && r[i + 1] !== "1")
            return "Invalid escape sequence in JSON Pointer (~ must be followed by 0 or 1)";
          i += 2;
        } else
          i++;
    }
    return null;
  }
  /**
   * Validate Relative JSON Pointer format (draft)
   */
  validateRelativeJsonPointerFormat(e) {
    if (!/^\d+(#|\/.*)?$/.test(e))
      return "Must be a valid relative JSON Pointer";
    const r = e.match(/^\d+(\/.*)?$/);
    return r && r[1] ? this.validateJsonPointerFormat(r[1]) : null;
  }
  /**
   * Validate URI template format (RFC 6570)
   */
  validateUriTemplateFormat(e) {
    let t = 0, r = !1;
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      if (n === "{") {
        if (r)
          return "Nested braces are not allowed in URI templates";
        r = !0, t++;
      } else if (n === "}") {
        if (!r)
          return "Unmatched closing brace in URI template";
        r = !1, t--;
      }
    }
    return t !== 0 ? "Unmatched opening brace in URI template" : null;
  }
  /**
   * Validate number-specific keywords
   */
  validateNumber(e, t, r, i) {
    const n = [];
    return t.minimum !== void 0 && e < t.minimum && n.push({
      instancePath: r,
      schemaPath: `${i}/minimum`,
      keyword: "minimum",
      message: `Value must be >= ${t.minimum}`,
      params: { minimum: t.minimum, actual: e }
    }), t.maximum !== void 0 && e > t.maximum && n.push({
      instancePath: r,
      schemaPath: `${i}/maximum`,
      keyword: "maximum",
      message: `Value must be <= ${t.maximum}`,
      params: { maximum: t.maximum, actual: e }
    }), t.exclusiveMinimum !== void 0 && e <= t.exclusiveMinimum && n.push({
      instancePath: r,
      schemaPath: `${i}/exclusiveMinimum`,
      keyword: "exclusiveMinimum",
      message: `Value must be > ${t.exclusiveMinimum}`,
      params: { exclusiveMinimum: t.exclusiveMinimum, actual: e }
    }), t.exclusiveMaximum !== void 0 && e >= t.exclusiveMaximum && n.push({
      instancePath: r,
      schemaPath: `${i}/exclusiveMaximum`,
      keyword: "exclusiveMaximum",
      message: `Value must be < ${t.exclusiveMaximum}`,
      params: { exclusiveMaximum: t.exclusiveMaximum, actual: e }
    }), t.multipleOf !== void 0 && e % t.multipleOf !== 0 && n.push({
      instancePath: r,
      schemaPath: `${i}/multipleOf`,
      keyword: "multipleOf",
      message: `Value must be a multiple of ${t.multipleOf}`,
      params: { multipleOf: t.multipleOf, actual: e }
    }), n;
  }
  /**
   * Validate array-specific keywords
   */
  validateArray(e, t, r, i) {
    const n = [];
    if (t.minItems !== void 0 && e.length < t.minItems && n.push({
      instancePath: r,
      schemaPath: `${i}/minItems`,
      keyword: "minItems",
      message: `Array must have at least ${t.minItems} items`,
      params: { minItems: t.minItems, actualItems: e.length }
    }), t.maxItems !== void 0 && e.length > t.maxItems && n.push({
      instancePath: r,
      schemaPath: `${i}/maxItems`,
      keyword: "maxItems",
      message: `Array must have at most ${t.maxItems} items`,
      params: { maxItems: t.maxItems, actualItems: e.length }
    }), t.uniqueItems && !this.areItemsUnique(e) && n.push({
      instancePath: r,
      schemaPath: `${i}/uniqueItems`,
      keyword: "uniqueItems",
      message: "Array items must be unique"
    }), t.prefixItems)
      for (let o = 0; o < t.prefixItems.length && o < e.length; o++) {
        const a = t.prefixItems[o];
        n.push(
          ...this.validateValue(
            e[o],
            a,
            `${r}/${o}`,
            `${i}/prefixItems/${o}`
          )
        );
      }
    if (t.items !== void 0) {
      const o = t.prefixItems ? t.prefixItems.length : 0;
      for (let a = o; a < e.length; a++)
        n.push(
          ...this.validateValue(
            e[a],
            t.items,
            `${r}/${a}`,
            `${i}/items`
          )
        );
    }
    return n;
  }
  /**
   * Validate object-specific keywords
   */
  validateObject(e, t, r, i) {
    const n = [], o = Object.keys(e);
    if (t.required)
      for (const l of t.required)
        l in e || n.push({
          instancePath: r,
          schemaPath: `${i}/required`,
          keyword: "required",
          message: `Missing required property: ${l}`,
          params: { missingProperty: l }
        });
    t.minProperties !== void 0 && o.length < t.minProperties && n.push({
      instancePath: r,
      schemaPath: `${i}/minProperties`,
      keyword: "minProperties",
      message: `Object must have at least ${t.minProperties} properties`,
      params: {
        minProperties: t.minProperties,
        actualProperties: o.length
      }
    }), t.maxProperties !== void 0 && o.length > t.maxProperties && n.push({
      instancePath: r,
      schemaPath: `${i}/maxProperties`,
      keyword: "maxProperties",
      message: `Object must have at most ${t.maxProperties} properties`,
      params: {
        maxProperties: t.maxProperties,
        actualProperties: o.length
      }
    });
    const a = /* @__PURE__ */ new Set();
    if (t.properties)
      for (const [l, f] of Object.entries(t.properties))
        l in e && (a.add(l), n.push(
          ...this.validateValue(
            e[l],
            f,
            `${r}/${l}`,
            `${i}/properties/${l}`
          )
        ));
    if (t.patternProperties)
      for (const [l, f] of Object.entries(
        t.patternProperties
      )) {
        const c = new RegExp(l, "u");
        for (const u of o)
          c.test(u) && (a.add(u), n.push(
            ...this.validateValue(
              e[u],
              f,
              `${r}/${u}`,
              `${i}/patternProperties/${l}`
            )
          ));
      }
    if (t.additionalProperties !== void 0)
      for (const l of o)
        a.has(l) || (t.additionalProperties === !1 ? n.push({
          instancePath: `${r}/${l}`,
          schemaPath: `${i}/additionalProperties`,
          keyword: "additionalProperties",
          message: `Additional property not allowed: ${l}`,
          params: { additionalProperty: l }
        }) : typeof t.additionalProperties == "object" && n.push(
          ...this.validateValue(
            e[l],
            t.additionalProperties,
            `${r}/${l}`,
            `${i}/additionalProperties`
          )
        ));
    if (t.dependentRequired) {
      for (const [l, f] of Object.entries(
        t.dependentRequired
      ))
        if (l in e)
          for (const c of f)
            c in e || n.push({
              instancePath: r,
              schemaPath: `${i}/dependentRequired`,
              keyword: "dependentRequired",
              message: `Property "${c}" is required when "${l}" is present`,
              params: {
                property: l,
                missingProperty: c
              }
            });
    }
    if (t.dependentSchemas)
      for (const [l, f] of Object.entries(
        t.dependentSchemas
      ))
        l in e && f && n.push(
          ...this.validateValue(
            e,
            f,
            r,
            `${i}/dependentSchemas/${l}`
          )
        );
    return n;
  }
  /**
   * Validate composition keywords (allOf, anyOf, oneOf, not)
   */
  validateComposition(e, t, r, i) {
    const n = [];
    if (t.allOf)
      for (let o = 0; o < t.allOf.length; o++)
        n.push(
          ...this.validateValue(
            e,
            t.allOf[o],
            r,
            `${i}/allOf/${o}`
          )
        );
    if (t.anyOf && (t.anyOf.some(
      (a) => this.validateValue(e, a, r, i).length === 0
    ) || n.push({
      instancePath: r,
      schemaPath: `${i}/anyOf`,
      keyword: "anyOf",
      message: "Value must match at least one schema in anyOf"
    })), t.oneOf) {
      const o = t.oneOf.filter(
        (a) => this.validateValue(e, a, r, i).length === 0
      ).length;
      o !== 1 && n.push({
        instancePath: r,
        schemaPath: `${i}/oneOf`,
        keyword: "oneOf",
        message: `Value must match exactly one schema in oneOf (matched ${o})`,
        params: { matchedSchemas: o }
      });
    }
    return t.not && this.validateValue(
      e,
      t.not,
      r,
      `${i}/not`
    ).length === 0 && n.push({
      instancePath: r,
      schemaPath: `${i}/not`,
      keyword: "not",
      message: "Value must NOT match the schema in not"
    }), n;
  }
  /**
   * Validate conditional keywords (if/then/else)
   */
  validateConditional(e, t, r, i) {
    const n = [];
    if (t.if === void 0)
      return n;
    const a = this.validateValue(
      e,
      t.if,
      r,
      `${i}/if`
    ).length === 0;
    return a && t.then !== void 0 && n.push(
      ...this.validateValue(
        e,
        t.then,
        r,
        `${i}/then`
      )
    ), !a && t.else !== void 0 && n.push(
      ...this.validateValue(
        e,
        t.else,
        r,
        `${i}/else`
      )
    ), n;
  }
  /**
   * Check if all array items are unique
   */
  areItemsUnique(e) {
    for (let t = 0; t < e.length; t++)
      for (let r = t + 1; r < e.length; r++)
        if (this.deepEqual(e[t], e[r]))
          return !1;
    return !0;
  }
  /**
   * Deep equality check for JSON values
   */
  deepEqual(e, t) {
    if (e === t) return !0;
    if (typeof e != typeof t) return !1;
    if (e === null || t === null) return e === t;
    if (Array.isArray(e) && Array.isArray(t))
      return e.length !== t.length ? !1 : e.every((r, i) => this.deepEqual(r, t[i]));
    if (typeof e == "object" && typeof t == "object") {
      const r = Object.keys(e), i = Object.keys(t);
      return r.length !== i.length ? !1 : r.every(
        (n) => this.deepEqual(
          e[n],
          t[n]
        )
      );
    }
    return !1;
  }
}
const Ye = ge`
  :host {
    /* Colors */
    --jsf-color-primary: #6366f1;
    --jsf-color-primary-hover: #4f46e5;
    --jsf-color-error: #ef4444;
    --jsf-color-error-bg: #fef2f2;
    --jsf-color-success: #22c55e;
    --jsf-color-warning: #f59e0b;
    --jsf-color-text: #1f2937;
    --jsf-color-text-muted: #6b7280;
    --jsf-color-border: #d1d5db;
    --jsf-color-border-focus: var(--jsf-color-primary);
    --jsf-color-bg: #ffffff;
    --jsf-color-bg-secondary: #f9fafb;
    --jsf-color-bg-disabled: #f3f4f6;

    /* Typography */
    --jsf-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, sans-serif;
    --jsf-font-size-base: 0.875rem;
    --jsf-font-size-sm: 0.75rem;
    --jsf-font-size-lg: 1rem;
    --jsf-font-weight-normal: 400;
    --jsf-font-weight-medium: 500;
    --jsf-font-weight-semibold: 600;
    --jsf-line-height: 1.5;

    /* Spacing */
    --jsf-spacing-xs: 0.25rem;
    --jsf-spacing-sm: 0.5rem;
    --jsf-spacing-md: 0.75rem;
    --jsf-spacing-lg: 1rem;
    --jsf-spacing-xl: 1.5rem;

    /* Border radius */
    --jsf-radius-sm: 0.25rem;
    --jsf-radius-md: 0.375rem;
    --jsf-radius-lg: 0.5rem;

    /* Shadows */
    --jsf-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --jsf-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --jsf-shadow-focus: 0 0 0 3px rgb(99 102 241 / 0.2);

    /* Transitions */
    --jsf-transition-fast: 150ms ease;
    --jsf-transition-normal: 200ms ease;

    display: block;
    font-family: var(--jsf-font-family);
    font-size: var(--jsf-font-size-base);
    line-height: var(--jsf-line-height);
    color: var(--jsf-color-text);
  }

  /* Form container */
  .jsf-form {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-lg);
  }

  /* Field wrapper */
  .jsf-field {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-xs);
  }

  /* Labels */
  .jsf-label {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-xs);
    font-weight: var(--jsf-font-weight-medium);
    color: var(--jsf-color-text);
  }

  .jsf-label-required::after {
    content: "*";
    color: var(--jsf-color-error);
    margin-left: var(--jsf-spacing-xs);
  }

  /* Description/help text */
  .jsf-description {
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
    margin-top: var(--jsf-spacing-xs);
  }

  /* Input base styles */
  .jsf-input {
    width: 100%;
    padding: var(--jsf-spacing-sm) var(--jsf-spacing-md);
    font-family: inherit;
    font-size: var(--jsf-font-size-base);
    line-height: var(--jsf-line-height);
    color: var(--jsf-color-text);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    transition: border-color var(--jsf-transition-fast),
      box-shadow var(--jsf-transition-fast);
    box-sizing: border-box;
  }

  .jsf-input:focus {
    outline: none;
    border-color: var(--jsf-color-border-focus);
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-input:disabled {
    background-color: var(--jsf-color-bg-disabled);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .jsf-input::placeholder {
    color: var(--jsf-color-text-muted);
  }

  .jsf-input--error {
    border-color: var(--jsf-color-error);
  }

  .jsf-input--error:focus {
    box-shadow: 0 0 0 3px rgb(239 68 68 / 0.2);
  }

  /* Textarea */
  .jsf-textarea {
    min-height: 80px;
    resize: vertical;
  }

  /* Select */
  .jsf-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right var(--jsf-spacing-sm) center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  /* Checkbox & Radio */
  .jsf-checkbox-wrapper,
  .jsf-radio-wrapper {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
  }

  .jsf-checkbox,
  .jsf-radio {
    width: 1rem;
    height: 1rem;
    accent-color: var(--jsf-color-primary);
    cursor: pointer;
  }

  .jsf-checkbox-label,
  .jsf-radio-label {
    font-weight: var(--jsf-font-weight-normal);
    cursor: pointer;
  }

  /* Error message */
  .jsf-error {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-xs);
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-error);
    margin-top: var(--jsf-spacing-xs);
  }

  .jsf-error-icon {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }

  /* Buttons */
  .jsf-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-sm) var(--jsf-spacing-lg);
    font-family: inherit;
    font-size: var(--jsf-font-size-base);
    font-weight: var(--jsf-font-weight-medium);
    line-height: var(--jsf-line-height);
    border-radius: var(--jsf-radius-md);
    cursor: pointer;
    transition: background-color var(--jsf-transition-fast),
      border-color var(--jsf-transition-fast),
      box-shadow var(--jsf-transition-fast);
  }

  .jsf-button--primary {
    color: white;
    background-color: var(--jsf-color-primary);
    border: 1px solid var(--jsf-color-primary);
  }

  .jsf-button--primary:hover {
    background-color: var(--jsf-color-primary-hover);
    border-color: var(--jsf-color-primary-hover);
  }

  .jsf-button--primary:focus {
    outline: none;
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-button--secondary {
    color: var(--jsf-color-text);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
  }

  .jsf-button--secondary:hover {
    background-color: var(--jsf-color-bg-secondary);
  }

  .jsf-button--danger {
    color: white;
    background-color: var(--jsf-color-error);
    border: 1px solid var(--jsf-color-error);
  }

  .jsf-button--danger:hover {
    background-color: #dc2626;
    border-color: #dc2626;
  }

  .jsf-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Object/nested container */
  .jsf-object {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-lg);
    padding: var(--jsf-spacing-lg);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-lg);
  }

  .jsf-object--nested {
    background-color: var(--jsf-color-bg);
  }

  .jsf-object-title {
    font-size: var(--jsf-font-size-lg);
    font-weight: var(--jsf-font-weight-semibold);
    margin: 0;
    padding-bottom: var(--jsf-spacing-sm);
    border-bottom: 1px solid var(--jsf-color-border);
  }

  /* Array container */
  .jsf-array {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-md);
  }

  .jsf-array--tuple {
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
  }

  .jsf-array-item {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: flex-start;
  }

  .jsf-array-item--prefix {
    padding: var(--jsf-spacing-sm);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-sm);
  }

  .jsf-array-item-index {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-semibold);
    color: var(--jsf-color-primary);
    background-color: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-primary);
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: var(--jsf-spacing-xs);
  }

  .jsf-array-item-content {
    flex: 1;
  }

  .jsf-array-item-actions {
    display: flex;
    gap: var(--jsf-spacing-xs);
    flex-shrink: 0;
  }

  .jsf-array-add {
    margin-top: var(--jsf-spacing-sm);
  }

  /* Icon button */
  .jsf-icon-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    cursor: pointer;
    transition: background-color var(--jsf-transition-fast);
  }

  .jsf-icon-button:hover {
    background-color: var(--jsf-color-bg-secondary);
  }

  .jsf-icon-button--danger:hover {
    background-color: var(--jsf-color-error-bg);
    border-color: var(--jsf-color-error);
    color: var(--jsf-color-error);
  }

  /* Deprecated field indicator */
  .jsf-deprecated {
    opacity: 0.6;
  }

  .jsf-deprecated .jsf-label::after {
    content: "(deprecated)";
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-normal);
    color: var(--jsf-color-warning);
    margin-left: var(--jsf-spacing-sm);
  }

  /* Read-only indicator */
  .jsf-readonly .jsf-input {
    background-color: var(--jsf-color-bg-secondary);
    cursor: default;
  }

  /* Form actions */
  .jsf-actions {
    display: flex;
    gap: var(--jsf-spacing-md);
    justify-content: flex-end;
    padding-top: var(--jsf-spacing-lg);
    border-top: 1px solid var(--jsf-color-border);
    margin-top: var(--jsf-spacing-lg);
  }

  /* Composition (anyOf/oneOf) */
  .jsf-composition {
    display: flex;
    flex-direction: column;
    gap: var(--jsf-spacing-md);
  }

  .jsf-composition-selector {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: center;
  }

  .jsf-composition-selector .jsf-select {
    flex: 1;
    max-width: 300px;
  }

  .jsf-composition-content {
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
  }

  .jsf-composition-content > .jsf-field:first-child {
    margin-top: 0;
  }

  .jsf-composition-content > .jsf-field:last-child {
    margin-bottom: 0;
  }

  /* Conditional sections animation */
  .jsf-conditional {
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  /* Circular reference indicator */
  .jsf-circular-ref {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    border: 1px dashed var(--jsf-color-warning);
    border-radius: var(--jsf-radius-md);
    color: var(--jsf-color-warning);
    font-size: var(--jsf-font-size-sm);
  }

  .jsf-circular-ref-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  @keyframes jsf-fade-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Additional Properties */
  .jsf-additional-property {
    position: relative;
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg);
    border: 1px dashed var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    animation: jsf-fade-in var(--jsf-transition-normal);
  }

  .jsf-additional-property-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--jsf-spacing-sm);
    padding-bottom: var(--jsf-spacing-xs);
    border-bottom: 1px solid var(--jsf-color-border);
  }

  .jsf-additional-property-name {
    font-size: var(--jsf-font-size-sm);
    font-weight: var(--jsf-font-weight-medium);
    color: var(--jsf-color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .jsf-add-property {
    display: flex;
    gap: var(--jsf-spacing-sm);
    align-items: center;
    margin-top: var(--jsf-spacing-md);
    padding-top: var(--jsf-spacing-md);
    border-top: 1px dashed var(--jsf-color-border);
  }

  .jsf-add-property-input {
    flex: 1;
    max-width: 200px;
  }

  /* Pattern-matched properties */
  .jsf-pattern-property {
    border-color: var(--jsf-color-primary);
    border-style: solid;
  }

  .jsf-pattern-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    margin-left: var(--jsf-spacing-xs);
    cursor: help;
  }

  /* Format-specific inputs */
  .jsf-format-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  .jsf-format-icon {
    position: absolute;
    right: var(--jsf-spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--jsf-color-text-muted);
    pointer-events: none;
    z-index: 1;
  }

  .jsf-format-icon--left {
    left: var(--jsf-spacing-md);
    right: auto;
  }

  .jsf-format-icon--regex {
    position: relative;
    left: auto;
    right: auto;
    font-family: monospace;
    font-weight: var(--jsf-font-weight-semibold);
    color: var(--jsf-color-primary);
    padding: 0 var(--jsf-spacing-xs);
  }

  .jsf-input--with-icon {
    padding-left: calc(var(--jsf-spacing-md) + 1.5rem);
  }

  .jsf-input--monospace {
    font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace;
    font-size: calc(var(--jsf-font-size-base) * 0.95);
    letter-spacing: -0.02em;
  }

  .jsf-format-action {
    position: absolute;
    right: var(--jsf-spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    color: var(--jsf-color-text-muted);
    background: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-sm);
    cursor: pointer;
    transition: all var(--jsf-transition-fast);
    text-decoration: none;
  }

  .jsf-format-action:hover {
    color: var(--jsf-color-primary);
    border-color: var(--jsf-color-primary);
    background: var(--jsf-color-bg-secondary);
  }

  .jsf-format-action--button {
    position: relative;
    right: auto;
    margin-left: var(--jsf-spacing-sm);
    flex-shrink: 0;
  }

  .jsf-format-hint {
    display: block;
    width: 100%;
    margin-top: var(--jsf-spacing-xs);
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
    font-family: monospace;
  }

  /* Format-specific styling */
  .jsf-format-date .jsf-input,
  .jsf-format-time .jsf-input,
  .jsf-format-datetime .jsf-input {
    padding-right: calc(var(--jsf-spacing-md) + 1.5rem);
  }

  .jsf-format-uuid .jsf-input {
    padding-right: calc(var(--jsf-spacing-sm) + 2.5rem);
  }

  .jsf-format-uri .jsf-input {
    padding-right: calc(var(--jsf-spacing-sm) + 2.5rem);
  }

  .jsf-format-regex {
    display: flex;
    align-items: center;
    background: var(--jsf-color-bg);
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    overflow: hidden;
  }

  .jsf-format-regex:focus-within {
    border-color: var(--jsf-color-border-focus);
    box-shadow: var(--jsf-shadow-focus);
  }

  .jsf-format-regex .jsf-input {
    border: none;
    border-radius: 0;
    padding-left: var(--jsf-spacing-xs);
    padding-right: var(--jsf-spacing-xs);
  }

  .jsf-format-regex .jsf-input:focus {
    box-shadow: none;
  }

  .jsf-format-duration {
    flex-direction: column;
    align-items: stretch;
  }

  .jsf-format-duration .jsf-input {
    width: 100%;
  }

  /* Valid format indicator */
  .jsf-format-input .jsf-input:not(.jsf-input--error):not(:placeholder-shown):valid {
    border-color: var(--jsf-color-success);
  }

  .jsf-format-input .jsf-input:not(.jsf-input--error):not(:placeholder-shown):valid:focus {
    box-shadow: 0 0 0 3px rgb(34 197 94 / 0.2);
  }

  /* Collapsible sections */
  .jsf-collapsible {
    border: 1px solid var(--jsf-color-border);
    border-radius: var(--jsf-radius-md);
    overflow: hidden;
  }

  .jsf-collapsible-header {
    display: flex;
    align-items: center;
    gap: var(--jsf-spacing-sm);
    padding: var(--jsf-spacing-md);
    background-color: var(--jsf-color-bg-secondary);
    cursor: pointer;
    user-select: none;
    transition: background-color var(--jsf-transition-fast);
  }

  .jsf-collapsible-header:hover {
    background-color: var(--jsf-color-bg-disabled);
  }

  .jsf-collapsible-icon {
    width: 1rem;
    height: 1rem;
    transition: transform var(--jsf-transition-fast);
    flex-shrink: 0;
  }

  .jsf-collapsible--expanded .jsf-collapsible-icon {
    transform: rotate(90deg);
  }

  .jsf-collapsible-title {
    flex: 1;
    font-weight: var(--jsf-font-weight-medium);
  }

  .jsf-collapsible-summary {
    font-size: var(--jsf-font-size-sm);
    color: var(--jsf-color-text-muted);
  }

  .jsf-collapsible-content {
    display: none;
    padding: var(--jsf-spacing-lg);
    border-top: 1px solid var(--jsf-color-border);
  }

  .jsf-collapsible--expanded .jsf-collapsible-content {
    display: block;
    animation: jsf-fade-in var(--jsf-transition-normal);
  }
`;
var Je = Object.defineProperty, Ze = Object.getOwnPropertyDescriptor, b = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ze(e, t) : e, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = (r ? o(e, t, i) : o(i)) || i);
  return r && i && Je(e, t, i), i;
};
let v = class extends T {
  constructor() {
    super(...arguments), this.schema = "", this.value = void 0, this.validateOnChange = !1, this.showSubmit = !0, this.submitText = "Submit", this._parsedSchema = null, this._parseError = null, this._errors = [], this._submitted = !1, this._schemaSelections = /* @__PURE__ */ new Map(), this._collapsedSections = /* @__PURE__ */ new Set(), this._parser = null, this._validator = null;
  }
  /**
   * Get whether the form is currently valid
   */
  get valid() {
    return this._errors.length === 0;
  }
  /**
   * Get current validation errors
   */
  get errors() {
    return [...this._errors];
  }
  /**
   * Get the parsed schema
   */
  getSchema() {
    return this._parsedSchema;
  }
  connectedCallback() {
    super.connectedCallback(), this._parseSchema();
  }
  updated(s) {
    s.has("schema") && this._parseSchema(), s.has("value") && this.validateOnChange && this._validate();
  }
  /**
   * Parse the schema string
   */
  _parseSchema() {
    if (!this.schema) {
      this._parsedSchema = null, this._parseError = null;
      return;
    }
    try {
      this._parsedSchema = $.parse(this.schema), this._parser = new $(this._parsedSchema), this._validator = new Be(this._parsedSchema), this._parseError = null, this.value === void 0 && (this.value = this._getDefaultValue(this._parsedSchema)), this._dispatchEvent("json-schema-form-ready", {
        schema: this._parsedSchema
      });
    } catch (s) {
      this._parseError = s instanceof Error ? s.message : "Failed to parse schema", this._parsedSchema = null, this._parser = null, this._validator = null;
    }
  }
  /**
   * Get the default value for a schema
   */
  _getDefaultValue(s) {
    if (s.default !== void 0)
      return s.default;
    if (s.const !== void 0)
      return s.const;
    switch ($.getTypes(s)[0]) {
      case "object":
        return this._getDefaultObjectValue(s);
      case "array":
        return [];
      case "string":
        return "";
      case "number":
      case "integer":
        return s.minimum ?? 0;
      case "boolean":
        return !1;
      case "null":
        return null;
      default:
        return;
    }
  }
  /**
   * Get default value for an object schema
   */
  _getDefaultObjectValue(s) {
    var t;
    const e = {};
    if (s.properties)
      for (const [r, i] of Object.entries(s.properties))
        typeof i != "boolean" && ((t = s.required) != null && t.includes(r) || i.default !== void 0) && (e[r] = this._getDefaultValue(i));
    return e;
  }
  /**
   * Validate the current value
   */
  validate() {
    return this._submitted = !0, this._validate();
  }
  /**
   * Internal validation
   */
  _validate() {
    return !this._validator || !this._parsedSchema ? !0 : (this._errors = this._validator.validate(this.value), this._errors.length > 0 && this._dispatchEvent("json-schema-form-error", { errors: this._errors }), this._errors.length === 0);
  }
  /**
   * Reset the form to default values
   */
  reset() {
    this._parsedSchema ? this.value = this._getDefaultValue(this._parsedSchema) : this.value = void 0, this._errors = [], this._submitted = !1;
  }
  /**
   * Programmatically submit the form
   */
  submit() {
    this._handleSubmit(new Event("submit"));
  }
  /**
   * Handle form submission
   */
  _handleSubmit(s) {
    s.preventDefault(), this.validate() && this._dispatchEvent("json-schema-form-submit", { value: this.value });
  }
  /**
   * Handle value changes from field renderers
   */
  _handleValueChange(s, e) {
    s === "" ? this.value = e : this.value = this._setNestedValue(this.value, s, e), this._dispatchEvent("json-schema-form-change", {
      value: this.value,
      path: s,
      changedValue: e
    }), (this.validateOnChange || this._submitted) && this._validate();
  }
  /**
   * Set a nested value in an object
   */
  _setNestedValue(s, e, t) {
    const r = e.split("/").filter((a) => a !== "");
    if (r.length === 0)
      return t;
    const i = Array.isArray(s) ? [...s] : { ...s };
    let n = i;
    for (let a = 0; a < r.length - 1; a++) {
      const l = r[a], f = Array.isArray(n) ? n[parseInt(l, 10)] : n[l], c = Array.isArray(f) ? [...f] : { ...f };
      Array.isArray(n) ? n[parseInt(l, 10)] = c : n[l] = c, n = c;
    }
    const o = r[r.length - 1];
    return Array.isArray(n) ? n[parseInt(o, 10)] = t : n[o] = t, i;
  }
  /**
   * Dispatch a custom event
   */
  _dispatchEvent(s, e) {
    this.dispatchEvent(
      new CustomEvent(s, {
        detail: e,
        bubbles: !0,
        composed: !0
      })
    );
  }
  /**
   * Render the form
   */
  render() {
    return this._parseError ? d`
        <div class="jsf-error-container" role="alert">
          <strong>Schema Error:</strong> ${this._parseError}
        </div>
      ` : this._parsedSchema ? d`
      <form
        class="jsf-form"
        part="form"
        @submit=${this._handleSubmit}
        novalidate
      >
        ${this._renderSchema(this._parsedSchema, "", this.value)}
        ${this.showSubmit ? d`
              <div class="jsf-actions" part="actions">
                <button
                  type="submit"
                  class="jsf-button jsf-button--primary"
                  ?disabled=${!this.valid && this._submitted}
                >
                  ${this.submitText}
                </button>
              </div>
            ` : ""}
      </form>
    ` : d` <div class="jsf-loading">No schema provided</div> `;
  }
  /**
   * Render a schema at a given path
   */
  _renderSchema(s, e, t) {
    var a;
    if (typeof s == "boolean")
      return s ? d`` : d`<div class="jsf-error">This field is not allowed</div>`;
    if (s.$ref && this._parser) {
      const l = this._parser.resolveRef(s.$ref);
      return l ? l._isCircular ? d`
            <div class="jsf-circular-ref">
              <svg
                class="jsf-circular-ref-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Circular reference: ${s.$ref}</span>
            </div>
          ` : this._renderSchema(l, e, t) : d`<div class="jsf-error">
        Unable to resolve reference: ${s.$ref}
      </div>`;
    }
    if (s.anyOf && s.anyOf.length > 0)
      return this._renderAnyOfOneOf(s, s.anyOf, "anyOf", e, t);
    if (s.oneOf && s.oneOf.length > 0)
      return this._renderAnyOfOneOf(s, s.oneOf, "oneOf", e, t);
    if (s.if !== void 0)
      return this._renderConditional(s, e, t);
    const i = $.getTypes(s)[0] || this._inferType(s, t), n = this._errors.filter((l) => l.instancePath === e), o = this._getFieldLabel(s, e);
    return d`
      <div
        class="jsf-field ${s.deprecated ? "jsf-deprecated" : ""} ${s.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${o ? d`
              <label
                class="jsf-label ${(a = s.required) != null && a.length ? "jsf-label-required" : ""}"
                part="label"
              >
                ${o}
              </label>
            ` : ""}
        ${this._renderFieldByType(i, s, e, t)}
        ${s.description ? d` <p class="jsf-description">${s.description}</p> ` : ""}
        ${n.map(
      (l) => d`
            <div class="jsf-error" part="error" role="alert">
              <svg
                class="jsf-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              ${l.message}
            </div>
          `
    )}
      </div>
    `;
  }
  /**
   * Infer type from schema keywords or value
   */
  _inferType(s, e) {
    return s.properties || s.additionalProperties || s.required ? "object" : s.items || s.prefixItems ? "array" : s.enum ? "string" : e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
  }
  /**
   * Render a field based on its type
   */
  _renderFieldByType(s, e, t, r) {
    if (e.enum)
      return this._renderEnum(e, t, r);
    if (e.const !== void 0)
      return this._renderConst(e);
    switch (s) {
      case "string":
        return this._renderString(e, t, r);
      case "number":
      case "integer":
        return this._renderNumber(
          e,
          t,
          r,
          s === "integer"
        );
      case "boolean":
        return this._renderBoolean(e, t, r);
      case "object":
        return this._renderObject(
          e,
          t,
          r
        );
      case "array":
        return this._renderArray(e, t, r);
      case "null":
        return this._renderNull();
      default:
        return d`<div class="jsf-error">Unsupported type: ${s}</div>`;
    }
  }
  /**
   * Render a string field
   */
  _renderString(s, e, t) {
    var n, o;
    const r = this._errors.some((a) => a.instancePath === e), i = this._errors.find(
      (a) => a.instancePath === e && a.keyword === "format"
    );
    return s.maxLength && s.maxLength > 100 ? d`
        <textarea
          class="jsf-input jsf-textarea ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${((n = s.examples) == null ? void 0 : n[0]) ?? ""}
          minlength=${s.minLength ?? ""}
          maxlength=${s.maxLength ?? ""}
          @input=${(a) => this._handleValueChange(
      e,
      a.target.value
    )}
        ></textarea>
      ` : s.format ? this._renderFormatInput(
      s,
      e,
      t,
      r,
      i == null ? void 0 : i.message
    ) : d`
      <input
        type="text"
        class="jsf-input ${r ? "jsf-input--error" : ""}"
        part="input"
        .value=${t ?? ""}
        ?disabled=${s.readOnly}
        ?required=${this._isRequired(e)}
        placeholder=${((o = s.examples) == null ? void 0 : o[0]) ?? ""}
        minlength=${s.minLength ?? ""}
        maxlength=${s.maxLength ?? ""}
        pattern=${s.pattern ?? ""}
        @input=${(a) => this._handleValueChange(e, a.target.value)}
      />
    `;
  }
  /**
   * Render format-specific input components
   */
  _renderFormatInput(s, e, t, r, i) {
    var l;
    const n = s.format, o = (l = s.examples) == null ? void 0 : l[0], a = typeof o == "string" ? o : this._getFormatPlaceholder(n);
    switch (n) {
      case "date":
        return this._renderDateInput(s, e, t, r);
      case "time":
        return this._renderTimeInput(s, e, t, r);
      case "date-time":
        return this._renderDateTimeInput(s, e, t, r);
      case "email":
        return this._renderEmailInput(
          s,
          e,
          t,
          r,
          a
        );
      case "uri":
      case "uri-reference":
      case "iri":
      case "iri-reference":
        return this._renderUriInput(
          s,
          e,
          t,
          r,
          a,
          n
        );
      case "uuid":
        return this._renderUuidInput(s, e, t, r);
      case "ipv4":
        return this._renderIpv4Input(s, e, t, r);
      case "ipv6":
        return this._renderIpv6Input(s, e, t, r);
      case "hostname":
      case "idn-hostname":
        return this._renderHostnameInput(
          s,
          e,
          t,
          r,
          a
        );
      case "duration":
        return this._renderDurationInput(s, e, t, r);
      case "regex":
        return this._renderRegexInput(s, e, t, r);
      case "json-pointer":
      case "relative-json-pointer":
        return this._renderJsonPointerInput(
          s,
          e,
          t,
          r,
          n
        );
      default:
        return d`
          <input
            type="text"
            class="jsf-input ${r ? "jsf-input--error" : ""}"
            part="input"
            .value=${t ?? ""}
            ?disabled=${s.readOnly}
            ?required=${this._isRequired(e)}
            placeholder=${a}
            @input=${(f) => this._handleValueChange(
          e,
          f.target.value
        )}
          />
        `;
    }
  }
  /**
   * Get placeholder text for a format
   */
  _getFormatPlaceholder(s) {
    switch (s) {
      case "date":
        return "YYYY-MM-DD";
      case "time":
        return "HH:MM:SS";
      case "date-time":
        return "YYYY-MM-DDTHH:MM:SS";
      case "email":
        return "user@example.com";
      case "uri":
      case "iri":
        return "https://example.com";
      case "uri-reference":
      case "iri-reference":
        return "/path/to/resource";
      case "uuid":
        return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
      case "ipv4":
        return "192.168.1.1";
      case "ipv6":
        return "2001:0db8:85a3::8a2e:0370:7334";
      case "hostname":
      case "idn-hostname":
        return "example.com";
      case "duration":
        return "P1Y2M3DT4H5M6S";
      case "regex":
        return "^[a-z]+$";
      case "json-pointer":
        return "/path/to/value";
      case "relative-json-pointer":
        return "1/path";
      default:
        return "";
    }
  }
  /**
   * Render date input with picker
   */
  _renderDateInput(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-date">
        <input
          type="date"
          class="jsf-input ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          @input=${(i) => this._handleValueChange(e, i.target.value)}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }
  /**
   * Render time input with picker
   */
  _renderTimeInput(s, e, t, r) {
    const i = t ? t.substring(0, 5) : "";
    return d`
      <div class="jsf-format-input jsf-format-time">
        <input
          type="time"
          class="jsf-input ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${i}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          step="1"
          @input=${(n) => {
      const o = n.target.value, a = o ? `${o}:00` : "";
      this._handleValueChange(e, a);
    }}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }
  /**
   * Render date-time input with picker
   */
  _renderDateTimeInput(s, e, t, r) {
    const i = t ? t.replace("Z", "").replace(/[+-]\d{2}:\d{2}$/, "").substring(0, 16) : "";
    return d`
      <div class="jsf-format-input jsf-format-datetime">
        <input
          type="datetime-local"
          class="jsf-input ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${i}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          @input=${(n) => {
      const o = n.target.value, a = o ? `${o}:00` : "";
      this._handleValueChange(e, a);
    }}
        />
        <span class="jsf-format-icon">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </div>
    `;
  }
  /**
   * Render email input with icon
   */
  _renderEmailInput(s, e, t, r, i) {
    return d`
      <div class="jsf-format-input jsf-format-email">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
            />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </span>
        <input
          type="email"
          class="jsf-input jsf-input--with-icon ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${i}
          @input=${(n) => this._handleValueChange(e, n.target.value)}
        />
      </div>
    `;
  }
  /**
   * Render URI input with icon
   */
  _renderUriInput(s, e, t, r, i, n) {
    return d`
      <div class="jsf-format-input jsf-format-uri">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="url"
          class="jsf-input jsf-input--with-icon ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${i}
          @input=${(o) => this._handleValueChange(e, o.target.value)}
        />
        ${t && !r ? d`
              <a
                href=${t}
                target="_blank"
                rel="noopener noreferrer"
                class="jsf-format-action"
                title="Open link"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </a>
            ` : ""}
      </div>
    `;
  }
  /**
   * Render UUID input with generate button
   */
  _renderUuidInput(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-uuid">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
          @input=${(i) => this._handleValueChange(
      e,
      i.target.value.toLowerCase()
    )}
        />
        ${s.readOnly ? "" : d`
              <button
                type="button"
                class="jsf-format-action jsf-format-action--button"
                title="Generate UUID"
                @click=${() => this._handleValueChange(e, this._generateUuid())}
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="14"
                  height="14"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            `}
      </div>
    `;
  }
  /**
   * Generate a random UUID v4
   */
  _generateUuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (s) => {
      const e = Math.random() * 16 | 0;
      return (s === "x" ? e : e & 3 | 8).toString(16);
    });
  }
  /**
   * Render IPv4 input with segmented display
   */
  _renderIpv4Input(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-ip">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="192.168.1.1"
          pattern="^(\\d{1,3}\\.){3}\\d{1,3}$"
          @input=${(i) => this._handleValueChange(e, i.target.value)}
        />
      </div>
    `;
  }
  /**
   * Render IPv6 input
   */
  _renderIpv6Input(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-ip">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="2001:0db8:85a3::8a2e:0370:7334"
          @input=${(i) => this._handleValueChange(
      e,
      i.target.value.toLowerCase()
    )}
        />
      </div>
    `;
  }
  /**
   * Render hostname input
   */
  _renderHostnameInput(s, e, t, r, i) {
    return d`
      <div class="jsf-format-input jsf-format-hostname">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${i}
          @input=${(n) => this._handleValueChange(
      e,
      n.target.value.toLowerCase()
    )}
        />
      </div>
    `;
  }
  /**
   * Render duration input with helper
   */
  _renderDurationInput(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-duration">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="P1Y2M3DT4H5M6S"
          @input=${(i) => this._handleValueChange(
      e,
      i.target.value.toUpperCase()
    )}
        />
        <span class="jsf-format-hint">
          ISO 8601: P[years]Y[months]M[days]DT[hours]H[minutes]M[seconds]S
        </span>
      </div>
    `;
  }
  /**
   * Render regex input with test functionality
   */
  _renderRegexInput(s, e, t, r) {
    return d`
      <div class="jsf-format-input jsf-format-regex">
        <span
          class="jsf-format-icon jsf-format-icon--left jsf-format-icon--regex"
          >/</span
        >
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="^[a-z]+$"
          @input=${(i) => this._handleValueChange(e, i.target.value)}
        />
        <span class="jsf-format-icon jsf-format-icon--regex">/</span>
      </div>
    `;
  }
  /**
   * Render JSON Pointer input
   */
  _renderJsonPointerInput(s, e, t, r, i) {
    const n = i === "relative-json-pointer" ? "1/path/to/value" : "/path/to/value";
    return d`
      <div class="jsf-format-input jsf-format-json-pointer">
        <span class="jsf-format-icon jsf-format-icon--left">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <path
              fill-rule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${r ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${s.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${n}
          @input=${(o) => this._handleValueChange(e, o.target.value)}
        />
      </div>
    `;
  }
  /**
   * Render a number field
   */
  _renderNumber(s, e, t, r) {
    const i = this._errors.some((n) => n.instancePath === e);
    return d`
      <input
        type="number"
        class="jsf-input ${i ? "jsf-input--error" : ""}"
        part="input"
        .value=${(t == null ? void 0 : t.toString()) ?? ""}
        ?disabled=${s.readOnly}
        ?required=${this._isRequired(e)}
        min=${s.minimum ?? s.exclusiveMinimum ?? ""}
        max=${s.maximum ?? s.exclusiveMaximum ?? ""}
        step=${r ? "1" : s.multipleOf ?? "any"}
        @input=${(n) => {
      const o = n.target.value, a = r ? parseInt(o, 10) : parseFloat(o);
      this._handleValueChange(e, isNaN(a) ? void 0 : a);
    }}
      />
    `;
  }
  /**
   * Render a boolean field
   */
  _renderBoolean(s, e, t) {
    return d`
      <div class="jsf-checkbox-wrapper">
        <input
          type="checkbox"
          class="jsf-checkbox"
          part="input"
          .checked=${t ?? !1}
          ?disabled=${s.readOnly}
          @change=${(r) => this._handleValueChange(
      e,
      r.target.checked
    )}
        />
        ${!s.title && s.description ? d`
              <span class="jsf-checkbox-label">${s.description}</span>
            ` : ""}
      </div>
    `;
  }
  /**
   * Render an enum field
   */
  _renderEnum(s, e, t) {
    var i;
    const r = this._errors.some((n) => n.instancePath === e);
    return d`
      <select
        class="jsf-input jsf-select ${r ? "jsf-input--error" : ""}"
        part="input"
        ?disabled=${s.readOnly}
        ?required=${this._isRequired(e)}
        @change=${(n) => {
      var l;
      const o = n.target.value, a = (l = s.enum) == null ? void 0 : l.find((f) => String(f) === o);
      this._handleValueChange(e, a);
    }}
      >
        <option value="" ?selected=${t === void 0}>Select...</option>
        ${(i = s.enum) == null ? void 0 : i.map(
      (n) => d`
            <option value=${String(n)} ?selected=${t === n}>
              ${String(n)}
            </option>
          `
    )}
      </select>
    `;
  }
  /**
   * Render a const field (readonly display)
   */
  _renderConst(s) {
    return d`
      <input
        type="text"
        class="jsf-input"
        part="input"
        .value=${String(s.const)}
        disabled
        readonly
      />
    `;
  }
  /**
   * Render a null field
   */
  _renderNull() {
    return d`
      <input
        type="text"
        class="jsf-input"
        part="input"
        value="null"
        disabled
        readonly
      />
    `;
  }
  /**
   * Render an object field
   */
  _renderObject(s, e, t) {
    const r = t || {}, i = this._getEffectiveObjectSchema(
      s,
      r
    ), n = i.properties || {}, o = new Set(Object.keys(n)), a = Object.keys(r).filter(
      (p) => !o.has(p)
    ), l = this._canAddProperty(
      s,
      Object.keys(r).length
    ), f = s.propertyNames, c = e !== "", u = !!s.title;
    return d`
      <div class="jsf-object ${c && u ? "jsf-object--nested" : ""}">
        ${Object.entries(n).map(([p, m]) => {
      var re;
      if (typeof m == "boolean")
        return m ? d`` : d``;
      const y = e ? `${e}/${p}` : p, P = r[p], $e = $.getTypes(m).includes("object") && m.properties, te = {
        ...m,
        _isRequired: (re = i.required) == null ? void 0 : re.includes(p)
      };
      if ($e && m.title) {
        const xe = this._renderSchema(
          { ...te, title: void 0 },
          y,
          P
        );
        return this._renderCollapsible(
          y,
          m.title,
          xe,
          this._getObjectSummary(P)
        );
      }
      return this._renderSchema(te, y, P);
    })}
        ${a.map((p) => {
      const m = e ? `${e}/${p}` : p, y = r[p], P = this._getSchemaForProperty(
        s,
        p,
        y
      ), H = this._getMatchingPattern(s, p);
      return d`
            <div
              class="jsf-additional-property ${H ? "jsf-pattern-property" : ""}"
            >
              <div class="jsf-additional-property-header">
                <span class="jsf-additional-property-name">
                  ${p}
                  ${H ? d`<span
                        class="jsf-pattern-badge"
                        title="Matches pattern: ${H}"
                        >⚡</span
                      >` : ""}
                </span>
                <button
                  type="button"
                  class="jsf-icon-button jsf-icon-button--danger"
                  title="Remove property"
                  @click=${() => this._removeProperty(e, p)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              ${this._renderSchema(P, m, y)}
            </div>
          `;
    })}
        ${l ? d`
              <div class="jsf-add-property">
                <input
                  type="text"
                  id="${e}-add-prop-input"
                  class="jsf-input jsf-add-property-input"
                  placeholder=${this._getPropertyNamePlaceholder(
      f
    )}
                  pattern=${this._getPropertyNamePattern(f)}
                  @keydown=${(p) => {
      if (p.key === "Enter") {
        p.preventDefault();
        const m = p.target, y = this._validatePropertyName(
          s,
          m.value,
          Object.keys(r)
        );
        y ? this._showPropertyNameError(m, y) : (this._addProperty(e, s, m.value), m.value = "");
      }
    }}
                />
                <button
                  type="button"
                  class="jsf-button jsf-button--secondary"
                  @click=${(p) => {
      const m = p.target.previousElementSibling;
      if (m.value) {
        const y = this._validatePropertyName(
          s,
          m.value,
          Object.keys(r)
        );
        y ? this._showPropertyNameError(m, y) : (this._addProperty(e, s, m.value), m.value = "");
      }
    }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Add Property
                </button>
              </div>
            ` : ""}
      </div>
    `;
  }
  /**
   * Check if we can add more properties to an object
   */
  _canAddProperty(s, e) {
    return !(s.additionalProperties === !1 && !s.patternProperties || s.maxProperties !== void 0 && e >= s.maxProperties);
  }
  /**
   * Get the schema for a property (checking patternProperties)
   */
  _getSchemaForProperty(s, e, t) {
    if (s.patternProperties)
      for (const [r, i] of Object.entries(
        s.patternProperties
      ))
        try {
          if (new RegExp(r, "u").test(e))
            return typeof i == "boolean" ? i ? {} : { not: {} } : i;
        } catch {
        }
    return typeof s.additionalProperties == "object" ? s.additionalProperties : this._inferSchemaFromValue(t);
  }
  /**
   * Get the matching pattern for a property name
   */
  _getMatchingPattern(s, e) {
    if (!s.patternProperties) return null;
    for (const t of Object.keys(s.patternProperties))
      try {
        if (new RegExp(t, "u").test(e))
          return t;
      } catch {
      }
    return null;
  }
  /**
   * Get placeholder text for property name input
   */
  _getPropertyNamePlaceholder(s) {
    return !s || typeof s == "boolean" ? "New property name" : s.pattern ? `Property name (pattern: ${s.pattern})` : "New property name";
  }
  /**
   * Get pattern attribute for property name input
   */
  _getPropertyNamePattern(s) {
    return !s || typeof s == "boolean" ? "" : s.pattern || "";
  }
  /**
   * Validate a property name against propertyNames schema
   */
  _validatePropertyName(s, e, t) {
    const r = e.trim();
    if (!r)
      return "Property name cannot be empty";
    if (t.includes(r))
      return "Property already exists";
    if (s.propertyNames && typeof s.propertyNames != "boolean") {
      const i = s.propertyNames;
      if (i.pattern && !new RegExp(i.pattern, "u").test(r))
        return `Property name must match pattern: ${i.pattern}`;
      if (i.minLength && r.length < i.minLength)
        return `Property name must be at least ${i.minLength} characters`;
      if (i.maxLength && r.length > i.maxLength)
        return `Property name must be at most ${i.maxLength} characters`;
    }
    return null;
  }
  /**
   * Show an error message for property name validation
   */
  _showPropertyNameError(s, e) {
    s.classList.add("jsf-input--error"), s.setCustomValidity(e), s.reportValidity(), setTimeout(() => {
      s.classList.remove("jsf-input--error"), s.setCustomValidity("");
    }, 3e3);
  }
  /**
   * Toggle a collapsible section
   */
  _toggleCollapsible(s) {
    this._collapsedSections.has(s) ? this._collapsedSections.delete(s) : this._collapsedSections.add(s), this._collapsedSections = new Set(this._collapsedSections);
  }
  /**
   * Check if a section is expanded
   */
  _isExpanded(s) {
    return !this._collapsedSections.has(s);
  }
  /**
   * Render a collapsible wrapper for nested content
   */
  _renderCollapsible(s, e, t, r) {
    const i = this._isExpanded(s);
    return d`
      <div
        class="jsf-collapsible ${i ? "jsf-collapsible--expanded" : ""}"
      >
        <div
          class="jsf-collapsible-header"
          @click=${() => this._toggleCollapsible(s)}
          @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && (n.preventDefault(), this._toggleCollapsible(s));
    }}
          tabindex="0"
          role="button"
          aria-expanded=${i}
        >
          <svg
            class="jsf-collapsible-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="jsf-collapsible-title">${e}</span>
          ${r ? d`<span class="jsf-collapsible-summary">${r}</span>` : ""}
        </div>
        <div class="jsf-collapsible-content">${t}</div>
      </div>
    `;
  }
  /**
   * Get a summary of an object value for collapsed display
   */
  _getObjectSummary(s) {
    const e = Object.keys(s || {});
    return e.length === 0 ? "Empty" : e.length <= 3 ? e.join(", ") : `${e.slice(0, 3).join(", ")} +${e.length - 3} more`;
  }
  /**
   * Infer a schema from a value (for additional properties)
   */
  _inferSchemaFromValue(s) {
    if (s === null) return { type: "null" };
    if (Array.isArray(s)) return { type: "array" };
    const e = typeof s;
    return e === "number" && Number.isInteger(s) ? { type: "integer" } : e === "string" || e === "number" || e === "boolean" ? { type: e } : e === "object" ? { type: "object" } : { type: "string" };
  }
  /**
   * Add a new property to an object
   */
  _addProperty(s, e, t) {
    if (!t.trim()) return;
    const r = t.trim(), i = (s ? this._getNestedValue(this.value, s) : this.value) || {};
    if (r in i) return;
    const n = this._getSchemaForProperty(
      e,
      r,
      void 0
    ), o = this._getDefaultValue(n), a = { ...i, [r]: o };
    this._handleValueChange(s, a);
  }
  /**
   * Remove a property from an object
   */
  _removeProperty(s, e) {
    const t = (s ? this._getNestedValue(this.value, s) : this.value) || {}, { [e]: r, ...i } = t;
    this._handleValueChange(s, i);
  }
  /**
   * Get effective object schema after applying dependentSchemas
   */
  _getEffectiveObjectSchema(s, e) {
    let t = { ...s };
    if (s.dependentSchemas)
      for (const [r, i] of Object.entries(
        s.dependentSchemas
      ))
        r in e && e[r] !== void 0 && typeof i != "boolean" && i && (t = this._mergeSchemas(t, i));
    return t;
  }
  /**
   * Render an array field
   */
  _renderArray(s, e, t) {
    const r = t || [], i = s.prefixItems || [], n = i.length > 0, o = this._canAddArrayItem(s, r.length), a = (l) => this._canRemoveArrayItem(s, r.length, l);
    return d`
      <div class="jsf-array ${n ? "jsf-array--tuple" : ""}">
        ${r.map((l, f) => {
      const c = this._getArrayItemSchema(s, f), u = f < i.length;
      return d`
            <div
              class="jsf-array-item ${u ? "jsf-array-item--prefix" : ""}"
            >
              ${u ? d`<span class="jsf-array-item-index">${f + 1}</span>` : ""}
              <div class="jsf-array-item-content">
                ${this._renderSchema(c, `${e}/${f}`, l)}
              </div>
              <div class="jsf-array-item-actions">
                ${a(f) ? d`
                      <button
                        type="button"
                        class="jsf-icon-button jsf-icon-button--danger"
                        title="Remove item"
                        @click=${() => this._removeArrayItem(e, f)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    ` : ""}
              </div>
            </div>
          `;
    })}
        ${o ? d`
              <button
                type="button"
                class="jsf-button jsf-button--secondary jsf-array-add"
                @click=${() => this._addArrayItem(e, s)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                Add Item
              </button>
            ` : ""}
      </div>
    `;
  }
  /**
   * Get the schema for an array item at a specific index
   * Handles prefixItems (tuple validation) and items
   */
  _getArrayItemSchema(s, e) {
    const t = s.prefixItems || [];
    return e < t.length ? t[e] : s.items !== void 0 ? s.items : {};
  }
  /**
   * Check if we can add more items to an array
   */
  _canAddArrayItem(s, e) {
    var r;
    if (s.maxItems !== void 0 && e >= s.maxItems)
      return !1;
    const t = ((r = s.prefixItems) == null ? void 0 : r.length) || 0;
    return !(e >= t && s.items === !1);
  }
  /**
   * Check if we can remove an item at a specific index
   */
  _canRemoveArrayItem(s, e, t) {
    var i;
    if (s.minItems !== void 0 && e <= s.minItems)
      return !1;
    const r = ((i = s.prefixItems) == null ? void 0 : i.length) || 0;
    return !(t < r && e <= r);
  }
  /**
   * Render anyOf/oneOf with a schema selector
   */
  _renderAnyOfOneOf(s, e, t, r, i) {
    const n = e.map((u, h) => ({ schema: u, index: h })).filter((u) => typeof u.schema != "boolean" || u.schema);
    if (n.length === 0)
      return d`<div class="jsf-error">No valid schemas in ${t}</div>`;
    let o = this._schemaSelections.get(r);
    o === void 0 && (o = this._detectMatchingSchema(n, i), this._schemaSelections.set(r, o));
    const a = n[o] || n[0], l = typeof a.schema == "boolean" ? {} : a.schema, f = n.map((u, h) => {
      var j;
      return typeof u.schema == "boolean" ? `Option ${h + 1}` : u.schema.title || ((j = u.schema.description) == null ? void 0 : j.slice(0, 30)) || this._getSchemaTypeLabel(u.schema) || `Option ${h + 1}`;
    }), c = this._errors.some((u) => u.instancePath === r);
    return d`
      <div class="jsf-composition">
        ${s.title ? d`<label class="jsf-label">${s.title}</label>` : ""}
        <div class="jsf-composition-selector">
          <select
            class="jsf-input jsf-select ${c ? "jsf-input--error" : ""}"
            part="input"
            @change=${(u) => {
      const h = parseInt(
        u.target.value,
        10
      );
      this._handleSchemaSelection(r, h, n);
    }}
          >
            ${n.map(
      (u, h) => d`
                <option value=${h} ?selected=${h === o}>
                  ${f[h]}
                </option>
              `
    )}
          </select>
        </div>
        <div class="jsf-composition-content">
          ${this._renderSchema(l, r, i)}
        </div>
        ${s.description ? d`<p class="jsf-description">${s.description}</p>` : ""}
      </div>
    `;
  }
  /**
   * Try to detect which schema in an anyOf/oneOf matches the current value
   */
  _detectMatchingSchema(s, e) {
    if (e == null)
      return 0;
    for (let t = 0; t < s.length; t++) {
      const r = s[t].schema;
      if (typeof r == "boolean") continue;
      const i = $.getTypes(r), n = this._getValueType(e);
      if (i.length === 0 || i.includes(n))
        if (this._validator) {
          if (this._validator.validate(e, r).length === 0)
            return t;
        } else
          return t;
    }
    return 0;
  }
  /**
   * Get the JSON type of a value
   */
  _getValueType(s) {
    if (s === null) return "null";
    if (Array.isArray(s)) return "array";
    const e = typeof s;
    return e === "number" && Number.isInteger(s) ? "integer" : e;
  }
  /**
   * Get a label describing a schema's type
   */
  _getSchemaTypeLabel(s) {
    const e = $.getTypes(s);
    return e.length > 0 ? e.join(" | ") : s.enum ? "enum" : s.const !== void 0 ? `const: ${JSON.stringify(s.const)}` : s.properties ? "object" : s.items ? "array" : "";
  }
  /**
   * Handle schema selection change in anyOf/oneOf
   */
  _handleSchemaSelection(s, e, t) {
    var i;
    this._schemaSelections.set(s, e);
    const r = (i = t[e]) == null ? void 0 : i.schema;
    if (r && typeof r != "boolean") {
      const n = this._getDefaultValue(r);
      this._handleValueChange(s, n);
    }
    this.requestUpdate();
  }
  /**
   * Render conditional schema (if/then/else)
   */
  _renderConditional(s, e, t) {
    const r = s.if;
    let i = !0;
    r !== void 0 && this._validator && (typeof r == "boolean" ? i = r : i = this._validator.validate(t, r).length === 0);
    const n = { ...s };
    delete n.if, delete n.then, delete n.else;
    const o = i ? s.then : s.else;
    if (o === void 0)
      return this._renderSchemaContent(n, e, t);
    const a = typeof o == "boolean" ? n : this._mergeSchemas(n, o);
    return this._renderSchemaContent(a, e, t);
  }
  /**
   * Merge two schemas together (simple shallow merge)
   */
  _mergeSchemas(s, e) {
    const t = { ...s };
    e.properties && (t.properties = { ...s.properties, ...e.properties }), e.required && (t.required = [
      .../* @__PURE__ */ new Set([...s.required || [], ...e.required])
    ]);
    for (const r of Object.keys(e))
      r !== "properties" && r !== "required" && (t[r] = e[r]);
    return t;
  }
  /**
   * Render schema content (called after resolving refs, composition, conditions)
   */
  _renderSchemaContent(s, e, t) {
    var a;
    const i = $.getTypes(s)[0] || this._inferType(s, t), n = this._errors.filter((l) => l.instancePath === e), o = this._getFieldLabel(s, e);
    return d`
      <div
        class="jsf-field ${s.deprecated ? "jsf-deprecated" : ""} ${s.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${o ? d`
              <label
                class="jsf-label ${(a = s.required) != null && a.length ? "jsf-label-required" : ""}"
                part="label"
              >
                ${o}
              </label>
            ` : ""}
        ${this._renderFieldByType(i, s, e, t)}
        ${s.description ? d` <p class="jsf-description">${s.description}</p> ` : ""}
        ${n.map(
      (l) => d`
            <div class="jsf-error" part="error" role="alert">
              <svg
                class="jsf-error-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              ${l.message}
            </div>
          `
    )}
      </div>
    `;
  }
  /**
   * Add an item to an array
   */
  _addArrayItem(s, e) {
    const t = (s ? this._getNestedValue(this.value, s) : this.value) || [], r = t.length, i = this._getArrayItemSchema(e, r), n = i && typeof i != "boolean" ? this._getDefaultValue(i) : void 0;
    this._handleValueChange(s, [...t, n]);
  }
  /**
   * Remove an item from an array
   */
  _removeArrayItem(s, e) {
    const r = ((s ? this._getNestedValue(this.value, s) : this.value) || []).filter((i, n) => n !== e);
    this._handleValueChange(s, r);
  }
  /**
   * Get a nested value from an object
   */
  _getNestedValue(s, e) {
    const t = e.split("/").filter((i) => i !== "");
    let r = s;
    for (const i of t) {
      if (r == null)
        return;
      if (Array.isArray(r))
        r = r[parseInt(i, 10)];
      else if (typeof r == "object")
        r = r[i];
      else
        return;
    }
    return r;
  }
  /**
   * Check if a field at a path is required
   */
  _isRequired(s) {
    var r, i;
    const e = s.split("/").filter((n) => n !== "");
    if (e.length === 0) return !1;
    const t = e[e.length - 1];
    return !!((i = (r = this._parsedSchema) == null ? void 0 : r.required) != null && i.includes(t));
  }
  /**
   * Get the label for a field - uses title if available, otherwise derives from path
   */
  _getFieldLabel(s, e) {
    if (s.title)
      return s.title;
    const t = e.split("/").filter((i) => i !== "");
    if (t.length === 0)
      return null;
    const r = t[t.length - 1];
    return /^\d+$/.test(r) ? null : this._fieldNameToLabel(r);
  }
  /**
   * Convert a field name to a human-readable label
   * e.g., "firstName" -> "First Name", "user_email" -> "User Email"
   */
  _fieldNameToLabel(s) {
    return s.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()).trim();
  }
};
v.styles = [
  Ye,
  ge`
      :host {
        display: block;
      }

      .jsf-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--jsf-spacing-xl);
        color: var(--jsf-color-text-muted);
      }

      .jsf-error-container {
        padding: var(--jsf-spacing-lg);
        background-color: var(--jsf-color-error-bg);
        border: 1px solid var(--jsf-color-error);
        border-radius: var(--jsf-radius-md);
        color: var(--jsf-color-error);
      }
    `
];
b([
  I({ type: String })
], v.prototype, "schema", 2);
b([
  I({ type: Object, attribute: !1 })
], v.prototype, "value", 2);
b([
  I({ type: Boolean, attribute: "validate-on-change" })
], v.prototype, "validateOnChange", 2);
b([
  I({ type: Boolean, attribute: "show-submit" })
], v.prototype, "showSubmit", 2);
b([
  I({ type: String, attribute: "submit-text" })
], v.prototype, "submitText", 2);
b([
  k()
], v.prototype, "_parsedSchema", 2);
b([
  k()
], v.prototype, "_parseError", 2);
b([
  k()
], v.prototype, "_errors", 2);
b([
  k()
], v.prototype, "_submitted", 2);
b([
  k()
], v.prototype, "_schemaSelections", 2);
b([
  k()
], v.prototype, "_collapsedSections", 2);
v = b([
  He("json-schema-form")
], v);
export {
  v as JsonSchemaForm
};
//# sourceMappingURL=json-schema-form.js.map
