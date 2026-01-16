/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, G = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = Symbol(), ie = /* @__PURE__ */ new WeakMap();
let me = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (G && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const xe = (r) => new me(typeof r == "string" ? r : r + "", void 0, Q), ge = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, s, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[n + 1], r[0]);
  return new me(t, r, Q);
}, we = (r, e) => {
  if (G) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = H.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, r.appendChild(i);
  }
}, se = G ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return xe(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Se, defineProperty: Ae, getOwnPropertyDescriptor: Oe, getOwnPropertyNames: Ie, getOwnPropertySymbols: Ee, getPrototypeOf: Ce } = Object, x = globalThis, ne = x.trustedTypes, Me = ne ? ne.emptyScript : "", Y = x.reactiveElementPolyfillSupport, R = (r, e) => r, L = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Me : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, X = (r, e) => !Se(r, e), oe = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let C = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = oe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && Ae(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: n } = Oe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const l = s == null ? void 0 : s.call(this);
      n == null || n.call(this, o), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const e = Ce(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const t = this.properties, i = [...Ie(t), ...Ee(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(se(s));
    } else e !== void 0 && t.push(se(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return we(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var n;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : L).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var n, o;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = i.getPropertyOptions(s), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : L;
      this._$Em = s;
      const f = a.fromAttribute(t, l.type);
      this[s] = f ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? f, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, n) {
    var o;
    if (e !== void 0) {
      const l = this.constructor;
      if (s === !1 && (n = this[e]), i ?? (i = l.getPropertyOptions(e)), !((i.hasChanged ?? X)(n, t) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(l._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, o] of s) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
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
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[R("elementProperties")] = /* @__PURE__ */ new Map(), C[R("finalized")] = /* @__PURE__ */ new Map(), Y == null || Y({ ReactiveElement: C }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, ae = (r) => r, B = z.trustedTypes, le = B ? B.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ve = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, ye = "?" + _, Ve = `<${ye}>`, O = document, D = () => O.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", ee = Array.isArray, ke = (r) => ee(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == "function", Z = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, fe = />/g, w = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, ce = /"/g, je = /^(?:script|style|textarea|title)$/i, Pe = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), d = Pe(1), M = Symbol.for("lit-noChange"), v = Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), S = O.createTreeWalker(O, 129);
function be(r, e) {
  if (!ee(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const Re = (r, e) => {
  const t = r.length - 1, i = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = P;
  for (let l = 0; l < t; l++) {
    const a = r[l];
    let f, c, u = -1, p = 0;
    for (; p < a.length && (o.lastIndex = p, c = o.exec(a), c !== null); ) p = o.lastIndex, o === P ? c[1] === "!--" ? o = de : c[1] !== void 0 ? o = fe : c[2] !== void 0 ? (je.test(c[2]) && (s = RegExp("</" + c[2], "g")), o = w) : c[3] !== void 0 && (o = w) : o === w ? c[0] === ">" ? (o = s ?? P, u = -1) : c[1] === void 0 ? u = -2 : (u = o.lastIndex - c[2].length, f = c[1], o = c[3] === void 0 ? w : c[3] === '"' ? ce : ue) : o === ce || o === ue ? o = w : o === de || o === fe ? o = P : (o = w, s = void 0);
    const m = o === w && r[l + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + Ve : u >= 0 ? (i.push(f), a.slice(0, u) + ve + a.slice(u) + _ + m) : a + _ + (u === -2 ? l : m);
  }
  return [be(r, n + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class F {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, a = this.parts, [f, c] = Re(e, t);
    if (this.el = F.createElement(f, i), S.currentNode = this.el.content, t === 2 || t === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = S.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(ve)) {
          const p = c[o++], m = s.getAttribute(u).split(_), h = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: n, name: h[2], strings: m, ctor: h[1] === "." ? Te : h[1] === "?" ? De : h[1] === "@" ? Ne : J }), s.removeAttribute(u);
        } else u.startsWith(_) && (a.push({ type: 6, index: n }), s.removeAttribute(u));
        if (je.test(s.tagName)) {
          const u = s.textContent.split(_), p = u.length - 1;
          if (p > 0) {
            s.textContent = B ? B.emptyScript : "";
            for (let m = 0; m < p; m++) s.append(u[m], D()), S.nextNode(), a.push({ type: 2, index: ++n });
            s.append(u[p], D());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ye) a.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = s.data.indexOf(_, u + 1)) !== -1; ) a.push({ type: 7, index: n }), u += _.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const i = O.createElement("template");
    return i.innerHTML = e, i;
  }
}
function V(r, e, t = r, i) {
  var o, l;
  if (e === M) return e;
  let s = i !== void 0 ? (o = t._$Co) == null ? void 0 : o[i] : t._$Cl;
  const n = N(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), n === void 0 ? s = void 0 : (s = new n(r), s._$AT(r, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = V(r, s._$AS(r, e.values), s, i)), e;
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
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? O).importNode(t, !0);
    S.currentNode = s;
    let n = S.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let f;
        a.type === 2 ? f = new q(n, n.nextSibling, this, e) : a.type === 1 ? f = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (f = new Fe(n, this, e)), this._$AV.push(f), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = O, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class q {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    e = V(this, e, t), N(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== M && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ke(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = F.createElement(be(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(t);
    else {
      const o = new ze(s, this), l = o.u(this.options);
      o.p(t), this.T(l), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = pe.get(e.strings);
    return t === void 0 && pe.set(e.strings, t = new F(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const n of e) s === t.length ? t.push(i = new q(this.O(D()), this.O(D()), this, this.options)) : i = t[s], i._$AI(n), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = ae(e).nextSibling;
      ae(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, n) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = v;
  }
  _$AI(e, t = this, i, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = V(this, e, t, 0), o = !N(e) || e !== this._$AH && e !== M, o && (this._$AH = e);
    else {
      const l = e;
      let a, f;
      for (e = n[0], a = 0; a < n.length - 1; a++) f = V(this, l[i + a], t, a), f === M && (f = this._$AH[a]), o || (o = !N(f) || f !== this._$AH[a]), f === v ? e = v : e !== v && (e += (f ?? "") + n[a + 1]), this._$AH[a] = f;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Te extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class De extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
class Ne extends J {
  constructor(e, t, i, s, n) {
    super(e, t, i, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = V(this, e, t, 0) ?? v) === M) return;
    const i = this._$AH, s = e === v && i !== v || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== v && (i === v || s);
    s && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Fe {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    V(this, e);
  }
}
const W = z.litHtmlPolyfillSupport;
W == null || W(F, q), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.2");
const qe = (r, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const n = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new q(e.insertBefore(D(), n), n, void 0, t ?? {});
  }
  return s._$AI(r), s;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qe(t, this.renderRoot, this.renderOptions);
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
    return M;
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
const Ue = (r) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(r, e);
  }) : customElements.define(r, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const He = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: X }, Le = (r = He, e, t) => {
  const { kind: i, metadata: s } = t;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), n.set(t.name, r), i === "accessor") {
    const { name: o } = t;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(o, a, r, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, r, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = t;
    return function(l) {
      const a = this[o];
      e.call(this, l), this.requestUpdate(o, a, r, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function I(r) {
  return (e, t) => typeof t == "object" ? Le(r, e, t) : ((i, s, n) => {
    const o = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function E(r) {
  return I({ ...r, state: !0, attribute: !1 });
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
      for (const [t, i] of Object.entries(this.schema.$defs))
        this.defsMap.set(`#/$defs/${t}`, i);
    const e = this.schema.definitions;
    if (e && typeof e == "object")
      for (const [t, i] of Object.entries(e))
        this.defsMap.set(`#/definitions/${t}`, i);
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
    const i = t.split("/").slice(1);
    let s = e;
    for (const n of i) {
      const o = n.replace(/~1/g, "/").replace(/~0/g, "~");
      if (s === null || typeof s != "object")
        return null;
      if (Array.isArray(s)) {
        const l = parseInt(o, 10);
        if (isNaN(l) || l < 0 || l >= s.length)
          return null;
        s = s[l];
      } else
        s = s[o];
      if (s === void 0)
        return null;
    }
    return s;
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
    const i = t || this.parser.getSchema();
    return this.validateValue(e, i, "", "#");
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
  validateValue(e, t, i, s) {
    const n = [];
    if (typeof t == "boolean")
      return t || n.push({
        instancePath: i,
        schemaPath: s,
        keyword: "false schema",
        message: "Schema is false, no value is valid"
      }), n;
    if (t.$ref) {
      const o = this.parser.resolveRef(t.$ref);
      o && n.push(
        ...this.validateValue(
          e,
          o,
          i,
          `${s}/$ref`
        )
      );
    }
    if (t.type) {
      const o = this.validateType(
        e,
        t,
        i,
        s
      );
      n.push(...o);
    }
    return t.enum !== void 0 && (t.enum.some((o) => this.deepEqual(o, e)) || n.push({
      instancePath: i,
      schemaPath: `${s}/enum`,
      keyword: "enum",
      message: `Value must be one of: ${JSON.stringify(t.enum)}`,
      params: { allowedValues: t.enum }
    })), t.const !== void 0 && (this.deepEqual(t.const, e) || n.push({
      instancePath: i,
      schemaPath: `${s}/const`,
      keyword: "const",
      message: `Value must be: ${JSON.stringify(t.const)}`,
      params: { allowedValue: t.const }
    })), typeof e == "string" ? n.push(
      ...this.validateString(e, t, i, s)
    ) : typeof e == "number" ? n.push(
      ...this.validateNumber(e, t, i, s)
    ) : Array.isArray(e) ? n.push(
      ...this.validateArray(e, t, i, s)
    ) : typeof e == "object" && e !== null && n.push(
      ...this.validateObject(
        e,
        t,
        i,
        s
      )
    ), n.push(
      ...this.validateComposition(e, t, i, s)
    ), n.push(
      ...this.validateConditional(e, t, i, s)
    ), n;
  }
  /**
   * Validate the type of a value
   */
  validateType(e, t, i, s) {
    const n = $.getTypes(t);
    if (n.length === 0) return [];
    const o = this.getValueType(e);
    return n.some((a) => a === "integer" ? typeof e == "number" && Number.isInteger(e) : a === o) ? [] : [
      {
        instancePath: i,
        schemaPath: `${s}/type`,
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
  validateString(e, t, i, s) {
    const n = [];
    if (t.minLength !== void 0 && e.length < t.minLength && n.push({
      instancePath: i,
      schemaPath: `${s}/minLength`,
      keyword: "minLength",
      message: `String must be at least ${t.minLength} characters`,
      params: { minLength: t.minLength, actualLength: e.length }
    }), t.maxLength !== void 0 && e.length > t.maxLength && n.push({
      instancePath: i,
      schemaPath: `${s}/maxLength`,
      keyword: "maxLength",
      message: `String must be at most ${t.maxLength} characters`,
      params: { maxLength: t.maxLength, actualLength: e.length }
    }), t.pattern !== void 0 && (new RegExp(t.pattern, "u").test(e) || n.push({
      instancePath: i,
      schemaPath: `${s}/pattern`,
      keyword: "pattern",
      message: `String must match pattern: ${t.pattern}`,
      params: { pattern: t.pattern }
    })), t.format !== void 0 && e !== "") {
      const o = this.validateFormat(e, t.format);
      o && n.push({
        instancePath: i,
        schemaPath: `${s}/format`,
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
    const [i, s, n] = e.split("-").map(Number), o = new Date(i, s - 1, n);
    return o.getFullYear() !== i || o.getMonth() !== s - 1 || o.getDate() !== n ? "Must be a valid date" : null;
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
    const i = e.substring(0, 10), s = this.validateDateFormat(i);
    return s || null;
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
      const i = new URL(
        e,
        t ? "http://example.com" : void 0
      );
      return !t && !i.protocol ? "Must be a valid URI with scheme" : null;
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
    const t = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/, i = e.match(t);
    if (!i)
      return "Must be a valid IPv4 address";
    for (let s = 1; s <= 4; s++) {
      const n = parseInt(i[s], 10);
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
    for (const i of t) {
      if (i.length === 0 || i.length > 63)
        return "Each label must be 1-63 characters";
      if (i.startsWith("-") || i.endsWith("-"))
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
    for (const i of t) {
      let s = 0;
      for (; s < i.length; )
        if (i[s] === "~") {
          if (s + 1 >= i.length || i[s + 1] !== "0" && i[s + 1] !== "1")
            return "Invalid escape sequence in JSON Pointer (~ must be followed by 0 or 1)";
          s += 2;
        } else
          s++;
    }
    return null;
  }
  /**
   * Validate Relative JSON Pointer format (draft)
   */
  validateRelativeJsonPointerFormat(e) {
    if (!/^\d+(#|\/.*)?$/.test(e))
      return "Must be a valid relative JSON Pointer";
    const i = e.match(/^\d+(\/.*)?$/);
    return i && i[1] ? this.validateJsonPointerFormat(i[1]) : null;
  }
  /**
   * Validate URI template format (RFC 6570)
   */
  validateUriTemplateFormat(e) {
    let t = 0, i = !1;
    for (let s = 0; s < e.length; s++) {
      const n = e[s];
      if (n === "{") {
        if (i)
          return "Nested braces are not allowed in URI templates";
        i = !0, t++;
      } else if (n === "}") {
        if (!i)
          return "Unmatched closing brace in URI template";
        i = !1, t--;
      }
    }
    return t !== 0 ? "Unmatched opening brace in URI template" : null;
  }
  /**
   * Validate number-specific keywords
   */
  validateNumber(e, t, i, s) {
    const n = [];
    return t.minimum !== void 0 && e < t.minimum && n.push({
      instancePath: i,
      schemaPath: `${s}/minimum`,
      keyword: "minimum",
      message: `Value must be >= ${t.minimum}`,
      params: { minimum: t.minimum, actual: e }
    }), t.maximum !== void 0 && e > t.maximum && n.push({
      instancePath: i,
      schemaPath: `${s}/maximum`,
      keyword: "maximum",
      message: `Value must be <= ${t.maximum}`,
      params: { maximum: t.maximum, actual: e }
    }), t.exclusiveMinimum !== void 0 && e <= t.exclusiveMinimum && n.push({
      instancePath: i,
      schemaPath: `${s}/exclusiveMinimum`,
      keyword: "exclusiveMinimum",
      message: `Value must be > ${t.exclusiveMinimum}`,
      params: { exclusiveMinimum: t.exclusiveMinimum, actual: e }
    }), t.exclusiveMaximum !== void 0 && e >= t.exclusiveMaximum && n.push({
      instancePath: i,
      schemaPath: `${s}/exclusiveMaximum`,
      keyword: "exclusiveMaximum",
      message: `Value must be < ${t.exclusiveMaximum}`,
      params: { exclusiveMaximum: t.exclusiveMaximum, actual: e }
    }), t.multipleOf !== void 0 && e % t.multipleOf !== 0 && n.push({
      instancePath: i,
      schemaPath: `${s}/multipleOf`,
      keyword: "multipleOf",
      message: `Value must be a multiple of ${t.multipleOf}`,
      params: { multipleOf: t.multipleOf, actual: e }
    }), n;
  }
  /**
   * Validate array-specific keywords
   */
  validateArray(e, t, i, s) {
    const n = [];
    if (t.minItems !== void 0 && e.length < t.minItems && n.push({
      instancePath: i,
      schemaPath: `${s}/minItems`,
      keyword: "minItems",
      message: `Array must have at least ${t.minItems} items`,
      params: { minItems: t.minItems, actualItems: e.length }
    }), t.maxItems !== void 0 && e.length > t.maxItems && n.push({
      instancePath: i,
      schemaPath: `${s}/maxItems`,
      keyword: "maxItems",
      message: `Array must have at most ${t.maxItems} items`,
      params: { maxItems: t.maxItems, actualItems: e.length }
    }), t.uniqueItems && !this.areItemsUnique(e) && n.push({
      instancePath: i,
      schemaPath: `${s}/uniqueItems`,
      keyword: "uniqueItems",
      message: "Array items must be unique"
    }), t.prefixItems)
      for (let o = 0; o < t.prefixItems.length && o < e.length; o++) {
        const l = t.prefixItems[o];
        n.push(
          ...this.validateValue(
            e[o],
            l,
            `${i}/${o}`,
            `${s}/prefixItems/${o}`
          )
        );
      }
    if (t.items !== void 0) {
      const o = t.prefixItems ? t.prefixItems.length : 0;
      for (let l = o; l < e.length; l++)
        n.push(
          ...this.validateValue(
            e[l],
            t.items,
            `${i}/${l}`,
            `${s}/items`
          )
        );
    }
    return n;
  }
  /**
   * Validate object-specific keywords
   */
  validateObject(e, t, i, s) {
    const n = [], o = Object.keys(e);
    if (t.required)
      for (const a of t.required)
        a in e || n.push({
          instancePath: i,
          schemaPath: `${s}/required`,
          keyword: "required",
          message: `Missing required property: ${a}`,
          params: { missingProperty: a }
        });
    t.minProperties !== void 0 && o.length < t.minProperties && n.push({
      instancePath: i,
      schemaPath: `${s}/minProperties`,
      keyword: "minProperties",
      message: `Object must have at least ${t.minProperties} properties`,
      params: {
        minProperties: t.minProperties,
        actualProperties: o.length
      }
    }), t.maxProperties !== void 0 && o.length > t.maxProperties && n.push({
      instancePath: i,
      schemaPath: `${s}/maxProperties`,
      keyword: "maxProperties",
      message: `Object must have at most ${t.maxProperties} properties`,
      params: {
        maxProperties: t.maxProperties,
        actualProperties: o.length
      }
    });
    const l = /* @__PURE__ */ new Set();
    if (t.properties)
      for (const [a, f] of Object.entries(t.properties))
        a in e && (l.add(a), n.push(
          ...this.validateValue(
            e[a],
            f,
            `${i}/${a}`,
            `${s}/properties/${a}`
          )
        ));
    if (t.patternProperties)
      for (const [a, f] of Object.entries(
        t.patternProperties
      )) {
        const c = new RegExp(a, "u");
        for (const u of o)
          c.test(u) && (l.add(u), n.push(
            ...this.validateValue(
              e[u],
              f,
              `${i}/${u}`,
              `${s}/patternProperties/${a}`
            )
          ));
      }
    if (t.additionalProperties !== void 0)
      for (const a of o)
        l.has(a) || (t.additionalProperties === !1 ? n.push({
          instancePath: `${i}/${a}`,
          schemaPath: `${s}/additionalProperties`,
          keyword: "additionalProperties",
          message: `Additional property not allowed: ${a}`,
          params: { additionalProperty: a }
        }) : typeof t.additionalProperties == "object" && n.push(
          ...this.validateValue(
            e[a],
            t.additionalProperties,
            `${i}/${a}`,
            `${s}/additionalProperties`
          )
        ));
    if (t.dependentRequired) {
      for (const [a, f] of Object.entries(
        t.dependentRequired
      ))
        if (a in e)
          for (const c of f)
            c in e || n.push({
              instancePath: i,
              schemaPath: `${s}/dependentRequired`,
              keyword: "dependentRequired",
              message: `Property "${c}" is required when "${a}" is present`,
              params: {
                property: a,
                missingProperty: c
              }
            });
    }
    if (t.dependentSchemas)
      for (const [a, f] of Object.entries(
        t.dependentSchemas
      ))
        a in e && f && n.push(
          ...this.validateValue(
            e,
            f,
            i,
            `${s}/dependentSchemas/${a}`
          )
        );
    return n;
  }
  /**
   * Validate composition keywords (allOf, anyOf, oneOf, not)
   */
  validateComposition(e, t, i, s) {
    const n = [];
    if (t.allOf)
      for (let o = 0; o < t.allOf.length; o++)
        n.push(
          ...this.validateValue(
            e,
            t.allOf[o],
            i,
            `${s}/allOf/${o}`
          )
        );
    if (t.anyOf && (t.anyOf.some(
      (l) => this.validateValue(e, l, i, s).length === 0
    ) || n.push({
      instancePath: i,
      schemaPath: `${s}/anyOf`,
      keyword: "anyOf",
      message: "Value must match at least one schema in anyOf"
    })), t.oneOf) {
      const o = t.oneOf.filter(
        (l) => this.validateValue(e, l, i, s).length === 0
      ).length;
      o !== 1 && n.push({
        instancePath: i,
        schemaPath: `${s}/oneOf`,
        keyword: "oneOf",
        message: `Value must match exactly one schema in oneOf (matched ${o})`,
        params: { matchedSchemas: o }
      });
    }
    return t.not && this.validateValue(
      e,
      t.not,
      i,
      `${s}/not`
    ).length === 0 && n.push({
      instancePath: i,
      schemaPath: `${s}/not`,
      keyword: "not",
      message: "Value must NOT match the schema in not"
    }), n;
  }
  /**
   * Validate conditional keywords (if/then/else)
   */
  validateConditional(e, t, i, s) {
    const n = [];
    if (t.if === void 0)
      return n;
    const l = this.validateValue(
      e,
      t.if,
      i,
      `${s}/if`
    ).length === 0;
    return l && t.then !== void 0 && n.push(
      ...this.validateValue(
        e,
        t.then,
        i,
        `${s}/then`
      )
    ), !l && t.else !== void 0 && n.push(
      ...this.validateValue(
        e,
        t.else,
        i,
        `${s}/else`
      )
    ), n;
  }
  /**
   * Check if all array items are unique
   */
  areItemsUnique(e) {
    for (let t = 0; t < e.length; t++)
      for (let i = t + 1; i < e.length; i++)
        if (this.deepEqual(e[t], e[i]))
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
      return e.length !== t.length ? !1 : e.every((i, s) => this.deepEqual(i, t[s]));
    if (typeof e == "object" && typeof t == "object") {
      const i = Object.keys(e), s = Object.keys(t);
      return i.length !== s.length ? !1 : i.every(
        (n) => this.deepEqual(
          e[n],
          t[n]
        )
      );
    }
    return !1;
  }
}
const Je = ge`
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
var Ye = Object.defineProperty, Ze = Object.getOwnPropertyDescriptor, j = (r, e, t, i) => {
  for (var s = i > 1 ? void 0 : i ? Ze(e, t) : e, n = r.length - 1, o; n >= 0; n--)
    (o = r[n]) && (s = (i ? o(e, t, s) : o(s)) || s);
  return i && s && Ye(e, t, s), s;
};
let y = class extends T {
  constructor() {
    super(...arguments), this.schema = "", this.value = void 0, this.validateOnChange = !1, this.showSubmit = !0, this.submitText = "Submit", this.initialData = "", this._parsedSchema = null, this._parseError = null, this._errors = [], this._submitted = !1, this._schemaSelections = /* @__PURE__ */ new Map(), this._collapsedSections = /* @__PURE__ */ new Set(), this._parsedInitialData = void 0, this._initialDataError = null, this._parser = null, this._validator = null;
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
  /**
   * Get the parsed initial data
   */
  getInitialData() {
    return this._parsedInitialData;
  }
  connectedCallback() {
    super.connectedCallback(), this._parseSchema();
  }
  updated(r) {
    r.has("schema") ? this._parseSchema() : r.has("initialData") && (this._parseInitialData(), this._parsedInitialData !== void 0 && (this.value = JSON.parse(JSON.stringify(this._parsedInitialData)))), r.has("value") && this.validateOnChange && this._validate();
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
      this._parsedSchema = $.parse(this.schema), this._parser = new $(this._parsedSchema), this._validator = new Be(this._parsedSchema), this._parseError = null, this._parseInitialData(), this.value === void 0 && (this._parsedInitialData !== void 0 ? this.value = JSON.parse(JSON.stringify(this._parsedInitialData)) : this.value = this._getDefaultValue(this._parsedSchema)), this._dispatchEvent("json-schema-form-ready", {
        schema: this._parsedSchema
      });
    } catch (r) {
      this._parseError = r instanceof Error ? r.message : "Failed to parse schema", this._parsedSchema = null, this._parser = null, this._validator = null;
    }
  }
  /**
   * Parse the initial data string
   */
  _parseInitialData() {
    if (!this.initialData) {
      this._parsedInitialData = void 0, this._initialDataError = null;
      return;
    }
    try {
      this._parsedInitialData = JSON.parse(this.initialData), this._initialDataError = null;
    } catch (r) {
      this._initialDataError = r instanceof Error ? r.message : "Failed to parse initial data", this._parsedInitialData = void 0;
    }
  }
  /**
   * Get the default value for a schema
   */
  _getDefaultValue(r) {
    if (r.default !== void 0)
      return r.default;
    if (r.const !== void 0)
      return r.const;
    if (r.oneOf && r.oneOf.length > 0) {
      const i = r.oneOf[0];
      if (typeof i != "boolean")
        return this._getDefaultValue(i);
    }
    if (r.anyOf && r.anyOf.length > 0) {
      const i = r.anyOf[0];
      if (typeof i != "boolean")
        return this._getDefaultValue(i);
    }
    switch ($.getTypes(r)[0] || this._inferTypeFromSchema(r)) {
      case "object":
        return this._getDefaultObjectValue(r);
      case "array":
        return [];
      case "string":
        return "";
      case "number":
      case "integer":
        return r.minimum ?? 0;
      case "boolean":
        return !1;
      case "null":
        return null;
      default:
        return;
    }
  }
  /**
   * Infer type from schema keywords (without looking at value)
   */
  _inferTypeFromSchema(r) {
    if (r.properties || r.additionalProperties || r.required)
      return "object";
    if (r.items || r.prefixItems)
      return "array";
    if (r.enum && r.enum.length > 0) {
      const e = r.enum[0];
      return e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
    }
  }
  /**
   * Get default value for an object schema
   */
  _getDefaultObjectValue(r) {
    var t;
    const e = {};
    if (r.properties)
      for (const [i, s] of Object.entries(r.properties))
        typeof s != "boolean" && ((t = r.required) != null && t.includes(i) || s.default !== void 0) && (e[i] = this._getDefaultValue(s));
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
   * Reset the form to initial data or default values
   */
  reset() {
    this._parsedInitialData !== void 0 ? this.value = JSON.parse(JSON.stringify(this._parsedInitialData)) : this._parsedSchema ? this.value = this._getDefaultValue(this._parsedSchema) : this.value = void 0, this._errors = [], this._submitted = !1;
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
  _handleSubmit(r) {
    r.preventDefault(), this.validate() && this._dispatchEvent("json-schema-form-submit", { value: this.value });
  }
  /**
   * Handle value changes from field renderers
   */
  _handleValueChange(r, e) {
    r === "" ? this.value = e : this.value = this._setNestedValue(this.value, r, e), this._dispatchEvent("json-schema-form-change", {
      value: this.value,
      path: r,
      changedValue: e
    }), (this.validateOnChange || this._submitted) && this._validate();
  }
  /**
   * Set a nested value in an object
   */
  _setNestedValue(r, e, t) {
    const i = e.split("/").filter((l) => l !== "");
    if (i.length === 0)
      return t;
    const s = Array.isArray(r) ? [...r] : { ...r };
    let n = s;
    for (let l = 0; l < i.length - 1; l++) {
      const a = i[l], f = Array.isArray(n) ? n[parseInt(a, 10)] : n[a], c = Array.isArray(f) ? [...f] : { ...f };
      Array.isArray(n) ? n[parseInt(a, 10)] = c : n[a] = c, n = c;
    }
    const o = i[i.length - 1];
    return Array.isArray(n) ? n[parseInt(o, 10)] = t : n[o] = t, s;
  }
  /**
   * Dispatch a custom event
   */
  _dispatchEvent(r, e) {
    this.dispatchEvent(
      new CustomEvent(r, {
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
      ` : this._initialDataError ? d`
        <div class="jsf-error-container" role="alert">
          <strong>Initial Data Error:</strong> ${this._initialDataError}
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
  _renderSchema(r, e, t) {
    var l;
    if (typeof r == "boolean")
      return r ? d`` : d`<div class="jsf-error">This field is not allowed</div>`;
    if (r.$ref && this._parser) {
      const a = this._parser.resolveRef(r.$ref);
      return a ? a._isCircular ? d`
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
              <span>Circular reference: ${r.$ref}</span>
            </div>
          ` : this._renderSchema(a, e, t) : d`<div class="jsf-error">
        Unable to resolve reference: ${r.$ref}
      </div>`;
    }
    if (r.anyOf && r.anyOf.length > 0)
      return this._renderAnyOfOneOf(r, r.anyOf, "anyOf", e, t);
    if (r.oneOf && r.oneOf.length > 0)
      return this._renderAnyOfOneOf(r, r.oneOf, "oneOf", e, t);
    if (r.if !== void 0)
      return this._renderConditional(r, e, t);
    const s = $.getTypes(r)[0] || this._inferType(r, t), n = this._errors.filter((a) => a.instancePath === e), o = this._getFieldLabel(r, e);
    return d`
      <div
        class="jsf-field ${r.deprecated ? "jsf-deprecated" : ""} ${r.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${o ? d`
              <label
                class="jsf-label ${(l = r.required) != null && l.length ? "jsf-label-required" : ""}"
                part="label"
              >
                ${o}
              </label>
            ` : ""}
        ${this._renderFieldByType(s, r, e, t)}
        ${r.description ? d` <p class="jsf-description">${r.description}</p> ` : ""}
        ${n.map(
      (a) => d`
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
              ${a.message}
            </div>
          `
    )}
      </div>
    `;
  }
  /**
   * Infer type from schema keywords or value
   */
  _inferType(r, e) {
    return r.properties || r.additionalProperties || r.required ? "object" : r.items || r.prefixItems ? "array" : r.enum ? "string" : e === null ? "null" : Array.isArray(e) ? "array" : typeof e;
  }
  /**
   * Render a field based on its type
   */
  _renderFieldByType(r, e, t, i) {
    if (e.enum)
      return this._renderEnum(e, t, i);
    if (e.const !== void 0)
      return this._renderConst(e);
    switch (r) {
      case "string":
        return this._renderString(e, t, i);
      case "number":
      case "integer":
        return this._renderNumber(
          e,
          t,
          i,
          r === "integer"
        );
      case "boolean":
        return this._renderBoolean(e, t, i);
      case "object":
        return this._renderObject(
          e,
          t,
          i
        );
      case "array":
        return this._renderArray(e, t, i);
      case "null":
        return this._renderNull();
      default:
        return d`<div class="jsf-error">Unsupported type: ${r}</div>`;
    }
  }
  /**
   * Render a string field
   */
  _renderString(r, e, t) {
    var n, o;
    const i = this._errors.some((l) => l.instancePath === e), s = this._errors.find(
      (l) => l.instancePath === e && l.keyword === "format"
    );
    return r.maxLength && r.maxLength > 100 ? d`
        <textarea
          class="jsf-input jsf-textarea ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${((n = r.examples) == null ? void 0 : n[0]) ?? ""}
          minlength=${r.minLength ?? ""}
          maxlength=${r.maxLength ?? ""}
          @input=${(l) => this._handleValueChange(
      e,
      l.target.value
    )}
        ></textarea>
      ` : r.format ? this._renderFormatInput(
      r,
      e,
      t,
      i,
      s == null ? void 0 : s.message
    ) : d`
      <input
        type="text"
        class="jsf-input ${i ? "jsf-input--error" : ""}"
        part="input"
        .value=${t ?? ""}
        ?disabled=${r.readOnly}
        ?required=${this._isRequired(e)}
        placeholder=${((o = r.examples) == null ? void 0 : o[0]) ?? ""}
        minlength=${r.minLength ?? ""}
        maxlength=${r.maxLength ?? ""}
        pattern=${r.pattern ?? ""}
        @input=${(l) => this._handleValueChange(e, l.target.value)}
      />
    `;
  }
  /**
   * Render format-specific input components
   */
  _renderFormatInput(r, e, t, i, s) {
    var a;
    const n = r.format, o = (a = r.examples) == null ? void 0 : a[0], l = typeof o == "string" ? o : this._getFormatPlaceholder(n);
    switch (n) {
      case "date":
        return this._renderDateInput(r, e, t, i);
      case "time":
        return this._renderTimeInput(r, e, t, i);
      case "date-time":
        return this._renderDateTimeInput(r, e, t, i);
      case "email":
        return this._renderEmailInput(
          r,
          e,
          t,
          i,
          l
        );
      case "uri":
      case "uri-reference":
      case "iri":
      case "iri-reference":
        return this._renderUriInput(
          r,
          e,
          t,
          i,
          l,
          n
        );
      case "uuid":
        return this._renderUuidInput(r, e, t, i);
      case "ipv4":
        return this._renderIpv4Input(r, e, t, i);
      case "ipv6":
        return this._renderIpv6Input(r, e, t, i);
      case "hostname":
      case "idn-hostname":
        return this._renderHostnameInput(
          r,
          e,
          t,
          i,
          l
        );
      case "duration":
        return this._renderDurationInput(r, e, t, i);
      case "regex":
        return this._renderRegexInput(r, e, t, i);
      case "json-pointer":
      case "relative-json-pointer":
        return this._renderJsonPointerInput(
          r,
          e,
          t,
          i,
          n
        );
      default:
        return d`
          <input
            type="text"
            class="jsf-input ${i ? "jsf-input--error" : ""}"
            part="input"
            .value=${t ?? ""}
            ?disabled=${r.readOnly}
            ?required=${this._isRequired(e)}
            placeholder=${l}
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
  _getFormatPlaceholder(r) {
    switch (r) {
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
  _renderDateInput(r, e, t, i) {
    return d`
      <div class="jsf-format-input jsf-format-date">
        <input
          type="date"
          class="jsf-input ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          @input=${(s) => this._handleValueChange(e, s.target.value)}
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
  _renderTimeInput(r, e, t, i) {
    const s = t ? t.substring(0, 5) : "";
    return d`
      <div class="jsf-format-input jsf-format-time">
        <input
          type="time"
          class="jsf-input ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${s}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          step="1"
          @input=${(n) => {
      const o = n.target.value, l = o ? `${o}:00` : "";
      this._handleValueChange(e, l);
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
  _renderDateTimeInput(r, e, t, i) {
    const s = t ? t.replace("Z", "").replace(/[+-]\d{2}:\d{2}$/, "").substring(0, 16) : "";
    return d`
      <div class="jsf-format-input jsf-format-datetime">
        <input
          type="datetime-local"
          class="jsf-input ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${s}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          @input=${(n) => {
      const o = n.target.value, l = o ? `${o}:00` : "";
      this._handleValueChange(e, l);
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
  _renderEmailInput(r, e, t, i, s) {
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
          class="jsf-input jsf-input--with-icon ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${s}
          @input=${(n) => this._handleValueChange(e, n.target.value)}
        />
      </div>
    `;
  }
  /**
   * Render URI input with icon
   */
  _renderUriInput(r, e, t, i, s, n) {
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
          class="jsf-input jsf-input--with-icon ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${s}
          @input=${(o) => this._handleValueChange(e, o.target.value)}
        />
        ${t && !i ? d`
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
  _renderUuidInput(r, e, t, i) {
    return d`
      <div class="jsf-format-input jsf-format-uuid">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
          @input=${(s) => this._handleValueChange(
      e,
      s.target.value.toLowerCase()
    )}
        />
        ${r.readOnly ? "" : d`
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
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (r) => {
      const e = Math.random() * 16 | 0;
      return (r === "x" ? e : e & 3 | 8).toString(16);
    });
  }
  /**
   * Render IPv4 input with segmented display
   */
  _renderIpv4Input(r, e, t, i) {
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
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="192.168.1.1"
          pattern="^(\\d{1,3}\\.){3}\\d{1,3}$"
          @input=${(s) => this._handleValueChange(e, s.target.value)}
        />
      </div>
    `;
  }
  /**
   * Render IPv6 input
   */
  _renderIpv6Input(r, e, t, i) {
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
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="2001:0db8:85a3::8a2e:0370:7334"
          @input=${(s) => this._handleValueChange(
      e,
      s.target.value.toLowerCase()
    )}
        />
      </div>
    `;
  }
  /**
   * Render hostname input
   */
  _renderHostnameInput(r, e, t, i, s) {
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
          class="jsf-input jsf-input--with-icon ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder=${s}
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
  _renderDurationInput(r, e, t, i) {
    return d`
      <div class="jsf-format-input jsf-format-duration">
        <input
          type="text"
          class="jsf-input jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="P1Y2M3DT4H5M6S"
          @input=${(s) => this._handleValueChange(
      e,
      s.target.value.toUpperCase()
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
  _renderRegexInput(r, e, t, i) {
    return d`
      <div class="jsf-format-input jsf-format-regex">
        <span
          class="jsf-format-icon jsf-format-icon--left jsf-format-icon--regex"
          >/</span
        >
        <input
          type="text"
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
          ?required=${this._isRequired(e)}
          placeholder="^[a-z]+$"
          @input=${(s) => this._handleValueChange(e, s.target.value)}
        />
        <span class="jsf-format-icon jsf-format-icon--regex">/</span>
      </div>
    `;
  }
  /**
   * Render JSON Pointer input
   */
  _renderJsonPointerInput(r, e, t, i, s) {
    const n = s === "relative-json-pointer" ? "1/path/to/value" : "/path/to/value";
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
          class="jsf-input jsf-input--with-icon jsf-input--monospace ${i ? "jsf-input--error" : ""}"
          part="input"
          .value=${t ?? ""}
          ?disabled=${r.readOnly}
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
  _renderNumber(r, e, t, i) {
    const s = this._errors.some((n) => n.instancePath === e);
    return d`
      <input
        type="number"
        class="jsf-input ${s ? "jsf-input--error" : ""}"
        part="input"
        .value=${(t == null ? void 0 : t.toString()) ?? ""}
        ?disabled=${r.readOnly}
        ?required=${this._isRequired(e)}
        min=${r.minimum ?? r.exclusiveMinimum ?? ""}
        max=${r.maximum ?? r.exclusiveMaximum ?? ""}
        step=${i ? "1" : r.multipleOf ?? "any"}
        @input=${(n) => {
      const o = n.target.value, l = i ? parseInt(o, 10) : parseFloat(o);
      this._handleValueChange(e, isNaN(l) ? void 0 : l);
    }}
      />
    `;
  }
  /**
   * Render a boolean field
   */
  _renderBoolean(r, e, t) {
    return d`
      <div class="jsf-checkbox-wrapper">
        <input
          type="checkbox"
          class="jsf-checkbox"
          part="input"
          .checked=${t ?? !1}
          ?disabled=${r.readOnly}
          @change=${(i) => this._handleValueChange(
      e,
      i.target.checked
    )}
        />
        ${!r.title && r.description ? d`
              <span class="jsf-checkbox-label">${r.description}</span>
            ` : ""}
      </div>
    `;
  }
  /**
   * Render an enum field
   */
  _renderEnum(r, e, t) {
    var s;
    const i = this._errors.some((n) => n.instancePath === e);
    return d`
      <select
        class="jsf-input jsf-select ${i ? "jsf-input--error" : ""}"
        part="input"
        ?disabled=${r.readOnly}
        ?required=${this._isRequired(e)}
        @change=${(n) => {
      var a;
      const o = n.target.value, l = (a = r.enum) == null ? void 0 : a.find((f) => String(f) === o);
      this._handleValueChange(e, l);
    }}
      >
        <option value="" ?selected=${t === void 0}>Select...</option>
        ${(s = r.enum) == null ? void 0 : s.map(
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
  _renderConst(r) {
    return d`
      <input
        type="text"
        class="jsf-input"
        part="input"
        .value=${String(r.const)}
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
  _renderObject(r, e, t) {
    const i = t || {}, s = this._getEffectiveObjectSchema(
      r,
      i
    ), n = s.properties || {}, o = new Set(Object.keys(n)), l = Object.keys(i).filter(
      (h) => !o.has(h)
    ), a = this._canAddProperty(
      r,
      Object.keys(i).length
    ), f = r.propertyNames, c = e !== "", u = !!r.title;
    return d`
      <div class="jsf-object ${c && u ? "jsf-object--nested" : ""}">
        ${Object.entries(n).map(([h, g]) => {
      var re;
      if (typeof g == "boolean")
        return g ? d`` : d``;
      const b = e ? `${e}/${h}` : h, k = i[h], $e = $.getTypes(g).includes("object") && g.properties, te = {
        ...g,
        _isRequired: (re = s.required) == null ? void 0 : re.includes(h)
      };
      if ($e && g.title) {
        const _e = this._renderSchema(
          { ...te, title: void 0 },
          b,
          k
        );
        return this._renderCollapsible(
          b,
          g.title,
          _e,
          this._getObjectSummary(k)
        );
      }
      return this._renderSchema(te, b, k);
    })}
        ${l.map((h) => {
      const g = e ? `${e}/${h}` : h, b = i[h], k = this._getSchemaForProperty(
        r,
        h,
        b
      ), U = this._getMatchingPattern(r, h);
      return d`
            <div
              class="jsf-additional-property ${U ? "jsf-pattern-property" : ""}"
            >
              <div class="jsf-additional-property-header">
                <span class="jsf-additional-property-name">
                  ${h}
                  ${U ? d`<span
                        class="jsf-pattern-badge"
                        title="Matches pattern: ${U}"
                        >⚡</span
                      >` : ""}
                </span>
                <button
                  type="button"
                  class="jsf-icon-button jsf-icon-button--danger"
                  title="Remove property"
                  @click=${() => this._removeProperty(e, h)}
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
              ${this._renderSchema(k, g, b)}
            </div>
          `;
    })}
        ${a ? d`
              <div class="jsf-add-property">
                <input
                  type="text"
                  id="${e}-add-prop-input"
                  class="jsf-input jsf-add-property-input"
                  placeholder=${this._getPropertyNamePlaceholder(
      f
    )}
                  pattern=${this._getPropertyNamePattern(f)}
                  @keydown=${(h) => {
      if (h.key === "Enter") {
        h.preventDefault();
        const g = h.target, b = this._validatePropertyName(
          r,
          g.value,
          Object.keys(i)
        );
        b ? this._showPropertyNameError(g, b) : (this._addProperty(e, r, g.value), g.value = "");
      }
    }}
                />
                <button
                  type="button"
                  class="jsf-button jsf-button--secondary"
                  @click=${(h) => {
      const g = h.target.previousElementSibling;
      if (g.value) {
        const b = this._validatePropertyName(
          r,
          g.value,
          Object.keys(i)
        );
        b ? this._showPropertyNameError(g, b) : (this._addProperty(e, r, g.value), g.value = "");
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
  _canAddProperty(r, e) {
    return !(r.additionalProperties === !1 && !r.patternProperties || r.maxProperties !== void 0 && e >= r.maxProperties);
  }
  /**
   * Get the schema for a property (checking patternProperties)
   */
  _getSchemaForProperty(r, e, t) {
    if (r.patternProperties)
      for (const [i, s] of Object.entries(
        r.patternProperties
      ))
        try {
          if (new RegExp(i, "u").test(e))
            return typeof s == "boolean" ? s ? {} : { not: {} } : s;
        } catch {
        }
    return typeof r.additionalProperties == "object" ? r.additionalProperties : this._inferSchemaFromValue(t);
  }
  /**
   * Get the matching pattern for a property name
   */
  _getMatchingPattern(r, e) {
    if (!r.patternProperties) return null;
    for (const t of Object.keys(r.patternProperties))
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
  _getPropertyNamePlaceholder(r) {
    return !r || typeof r == "boolean" ? "New property name" : r.pattern ? `Property name (pattern: ${r.pattern})` : "New property name";
  }
  /**
   * Get pattern attribute for property name input
   */
  _getPropertyNamePattern(r) {
    return !r || typeof r == "boolean" ? "" : r.pattern || "";
  }
  /**
   * Validate a property name against propertyNames schema
   */
  _validatePropertyName(r, e, t) {
    const i = e.trim();
    if (!i)
      return "Property name cannot be empty";
    if (t.includes(i))
      return "Property already exists";
    if (r.propertyNames && typeof r.propertyNames != "boolean") {
      const s = r.propertyNames;
      if (s.pattern && !new RegExp(s.pattern, "u").test(i))
        return `Property name must match pattern: ${s.pattern}`;
      if (s.minLength && i.length < s.minLength)
        return `Property name must be at least ${s.minLength} characters`;
      if (s.maxLength && i.length > s.maxLength)
        return `Property name must be at most ${s.maxLength} characters`;
    }
    return null;
  }
  /**
   * Show an error message for property name validation
   */
  _showPropertyNameError(r, e) {
    r.classList.add("jsf-input--error"), r.setCustomValidity(e), r.reportValidity(), setTimeout(() => {
      r.classList.remove("jsf-input--error"), r.setCustomValidity("");
    }, 3e3);
  }
  /**
   * Toggle a collapsible section
   */
  _toggleCollapsible(r) {
    this._collapsedSections.has(r) ? this._collapsedSections.delete(r) : this._collapsedSections.add(r), this._collapsedSections = new Set(this._collapsedSections);
  }
  /**
   * Check if a section is expanded
   */
  _isExpanded(r) {
    return !this._collapsedSections.has(r);
  }
  /**
   * Render a collapsible wrapper for nested content
   */
  _renderCollapsible(r, e, t, i) {
    const s = this._isExpanded(r);
    return d`
      <div
        class="jsf-collapsible ${s ? "jsf-collapsible--expanded" : ""}"
      >
        <div
          class="jsf-collapsible-header"
          @click=${() => this._toggleCollapsible(r)}
          @keydown=${(n) => {
      (n.key === "Enter" || n.key === " ") && (n.preventDefault(), this._toggleCollapsible(r));
    }}
          tabindex="0"
          role="button"
          aria-expanded=${s}
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
          ${i ? d`<span class="jsf-collapsible-summary">${i}</span>` : ""}
        </div>
        <div class="jsf-collapsible-content">${t}</div>
      </div>
    `;
  }
  /**
   * Get a summary of an object value for collapsed display
   */
  _getObjectSummary(r) {
    const e = Object.keys(r || {});
    return e.length === 0 ? "Empty" : e.length <= 3 ? e.join(", ") : `${e.slice(0, 3).join(", ")} +${e.length - 3} more`;
  }
  /**
   * Infer a schema from a value (for additional properties)
   */
  _inferSchemaFromValue(r) {
    if (r === null) return { type: "null" };
    if (Array.isArray(r)) return { type: "array" };
    const e = typeof r;
    return e === "number" && Number.isInteger(r) ? { type: "integer" } : e === "string" || e === "number" || e === "boolean" ? { type: e } : e === "object" ? { type: "object" } : { type: "string" };
  }
  /**
   * Add a new property to an object
   */
  _addProperty(r, e, t) {
    if (!t.trim()) return;
    const i = t.trim(), s = (r ? this._getNestedValue(this.value, r) : this.value) || {};
    if (i in s) return;
    const n = this._getSchemaForProperty(
      e,
      i,
      void 0
    ), o = this._getDefaultValue(n), l = { ...s, [i]: o };
    this._handleValueChange(r, l);
  }
  /**
   * Remove a property from an object
   */
  _removeProperty(r, e) {
    const t = (r ? this._getNestedValue(this.value, r) : this.value) || {}, { [e]: i, ...s } = t;
    this._handleValueChange(r, s);
  }
  /**
   * Get effective object schema after applying dependentSchemas
   */
  _getEffectiveObjectSchema(r, e) {
    let t = { ...r };
    if (r.dependentSchemas)
      for (const [i, s] of Object.entries(
        r.dependentSchemas
      ))
        i in e && e[i] !== void 0 && typeof s != "boolean" && s && (t = this._mergeSchemas(t, s));
    return t;
  }
  /**
   * Render an array field
   */
  _renderArray(r, e, t) {
    const i = t || [], s = r.prefixItems || [], n = s.length > 0, o = this._canAddArrayItem(r, i.length), l = (a) => this._canRemoveArrayItem(r, i.length, a);
    return d`
      <div class="jsf-array ${n ? "jsf-array--tuple" : ""}">
        ${i.map((a, f) => {
      const c = this._getArrayItemSchema(r, f), u = f < s.length;
      return d`
            <div
              class="jsf-array-item ${u ? "jsf-array-item--prefix" : ""}"
            >
              ${u ? d`<span class="jsf-array-item-index">${f + 1}</span>` : ""}
              <div class="jsf-array-item-content">
                ${this._renderSchema(c, `${e}/${f}`, a)}
              </div>
              <div class="jsf-array-item-actions">
                ${l(f) ? d`
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
                @click=${() => this._addArrayItem(e, r)}
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
  _getArrayItemSchema(r, e) {
    const t = r.prefixItems || [];
    return e < t.length ? t[e] : r.items !== void 0 ? r.items : {};
  }
  /**
   * Check if we can add more items to an array
   */
  _canAddArrayItem(r, e) {
    var i;
    if (r.maxItems !== void 0 && e >= r.maxItems)
      return !1;
    const t = ((i = r.prefixItems) == null ? void 0 : i.length) || 0;
    return !(e >= t && r.items === !1);
  }
  /**
   * Check if we can remove an item at a specific index
   */
  _canRemoveArrayItem(r, e, t) {
    var s;
    if (r.minItems !== void 0 && e <= r.minItems)
      return !1;
    const i = ((s = r.prefixItems) == null ? void 0 : s.length) || 0;
    return !(t < i && e <= i);
  }
  /**
   * Render anyOf/oneOf with a schema selector
   */
  _renderAnyOfOneOf(r, e, t, i, s) {
    const n = e.map((p, m) => ({ schema: p, index: m })).filter((p) => typeof p.schema != "boolean" || p.schema);
    if (n.length === 0)
      return d`<div class="jsf-error">No valid schemas in ${t}</div>`;
    let o = this._schemaSelections.get(i), l = !1;
    o === void 0 && (o = this._detectMatchingSchema(n, s), this._schemaSelections.set(i, o), l = s == null || typeof s == "object" && !Array.isArray(s) && Object.keys(s).length === 0);
    const a = n[o] || n[0], f = typeof a.schema == "boolean" ? {} : a.schema;
    if (l && typeof a.schema != "boolean") {
      const p = this._getDefaultValue(a.schema);
      setTimeout(() => this._handleValueChange(i, p), 0), s = p;
    }
    const c = n.map((p, m) => {
      var h;
      return typeof p.schema == "boolean" ? `Option ${m + 1}` : p.schema.title || ((h = p.schema.description) == null ? void 0 : h.slice(0, 30)) || this._getSchemaTypeLabel(p.schema) || `Option ${m + 1}`;
    }), u = this._errors.some((p) => p.instancePath === i);
    return d`
      <div class="jsf-composition">
        ${r.title ? d`<label class="jsf-label">${r.title}</label>` : ""}
        <div class="jsf-composition-selector">
          <select
            class="jsf-input jsf-select ${u ? "jsf-input--error" : ""}"
            part="input"
            @change=${(p) => {
      const m = parseInt(
        p.target.value,
        10
      );
      this._handleSchemaSelection(i, m, n);
    }}
          >
            ${n.map(
      (p, m) => d`
                <option value=${m} ?selected=${m === o}>
                  ${c[m]}
                </option>
              `
    )}
          </select>
        </div>
        <div class="jsf-composition-content">
          ${this._renderSchema(f, i, s)}
        </div>
        ${r.description ? d`<p class="jsf-description">${r.description}</p>` : ""}
      </div>
    `;
  }
  /**
   * Try to detect which schema in an anyOf/oneOf matches the current value
   */
  _detectMatchingSchema(r, e) {
    if (e == null)
      return 0;
    for (let t = 0; t < r.length; t++) {
      const i = r[t].schema;
      if (typeof i == "boolean") continue;
      const s = $.getTypes(i), n = this._getValueType(e);
      if (s.length === 0 || s.includes(n))
        if (this._validator) {
          if (this._validator.validate(e, i).length === 0)
            return t;
        } else
          return t;
    }
    return 0;
  }
  /**
   * Get the JSON type of a value
   */
  _getValueType(r) {
    if (r === null) return "null";
    if (Array.isArray(r)) return "array";
    const e = typeof r;
    return e === "number" && Number.isInteger(r) ? "integer" : e;
  }
  /**
   * Get a label describing a schema's type
   */
  _getSchemaTypeLabel(r) {
    const e = $.getTypes(r);
    return e.length > 0 ? e.join(" | ") : r.enum ? "enum" : r.const !== void 0 ? `const: ${JSON.stringify(r.const)}` : r.properties ? "object" : r.items ? "array" : "";
  }
  /**
   * Handle schema selection change in anyOf/oneOf
   */
  _handleSchemaSelection(r, e, t) {
    var s;
    this._schemaSelections.set(r, e);
    const i = (s = t[e]) == null ? void 0 : s.schema;
    if (i && typeof i != "boolean") {
      const n = this._getDefaultValue(i);
      this._handleValueChange(r, n);
    }
    this.requestUpdate();
  }
  /**
   * Render conditional schema (if/then/else)
   */
  _renderConditional(r, e, t) {
    const i = r.if;
    let s = !0;
    i !== void 0 && this._validator && (typeof i == "boolean" ? s = i : s = this._validator.validate(t, i).length === 0);
    const n = { ...r };
    delete n.if, delete n.then, delete n.else;
    const o = s ? r.then : r.else;
    if (o === void 0)
      return this._renderSchemaContent(n, e, t);
    const l = typeof o == "boolean" ? n : this._mergeSchemas(n, o);
    return this._renderSchemaContent(l, e, t);
  }
  /**
   * Merge two schemas together (simple shallow merge)
   */
  _mergeSchemas(r, e) {
    const t = { ...r };
    e.properties && (t.properties = { ...r.properties, ...e.properties }), e.required && (t.required = [
      .../* @__PURE__ */ new Set([...r.required || [], ...e.required])
    ]);
    for (const i of Object.keys(e))
      i !== "properties" && i !== "required" && (t[i] = e[i]);
    return t;
  }
  /**
   * Render schema content (called after resolving refs, composition, conditions)
   */
  _renderSchemaContent(r, e, t) {
    var l;
    const s = $.getTypes(r)[0] || this._inferType(r, t), n = this._errors.filter((a) => a.instancePath === e), o = this._getFieldLabel(r, e);
    return d`
      <div
        class="jsf-field ${r.deprecated ? "jsf-deprecated" : ""} ${r.readOnly ? "jsf-readonly" : ""}"
        part="field"
      >
        ${o ? d`
              <label
                class="jsf-label ${(l = r.required) != null && l.length ? "jsf-label-required" : ""}"
                part="label"
              >
                ${o}
              </label>
            ` : ""}
        ${this._renderFieldByType(s, r, e, t)}
        ${r.description ? d` <p class="jsf-description">${r.description}</p> ` : ""}
        ${n.map(
      (a) => d`
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
              ${a.message}
            </div>
          `
    )}
      </div>
    `;
  }
  /**
   * Add an item to an array
   */
  _addArrayItem(r, e) {
    const t = (r ? this._getNestedValue(this.value, r) : this.value) || [], i = t.length, s = this._getArrayItemSchema(e, i), n = s && typeof s != "boolean" ? this._getDefaultValue(s) : void 0;
    this._handleValueChange(r, [...t, n]);
  }
  /**
   * Remove an item from an array
   */
  _removeArrayItem(r, e) {
    const i = ((r ? this._getNestedValue(this.value, r) : this.value) || []).filter((s, n) => n !== e);
    this._handleValueChange(r, i);
  }
  /**
   * Get a nested value from an object
   */
  _getNestedValue(r, e) {
    const t = e.split("/").filter((s) => s !== "");
    let i = r;
    for (const s of t) {
      if (i == null)
        return;
      if (Array.isArray(i))
        i = i[parseInt(s, 10)];
      else if (typeof i == "object")
        i = i[s];
      else
        return;
    }
    return i;
  }
  /**
   * Check if a field at a path is required
   */
  _isRequired(r) {
    var i, s;
    const e = r.split("/").filter((n) => n !== "");
    if (e.length === 0) return !1;
    const t = e[e.length - 1];
    return !!((s = (i = this._parsedSchema) == null ? void 0 : i.required) != null && s.includes(t));
  }
  /**
   * Get the label for a field - uses title if available, otherwise derives from path
   */
  _getFieldLabel(r, e) {
    if (r.title)
      return r.title;
    const t = e.split("/").filter((s) => s !== "");
    if (t.length === 0)
      return null;
    const i = t[t.length - 1];
    return /^\d+$/.test(i) ? null : this._fieldNameToLabel(i);
  }
  /**
   * Convert a field name to a human-readable label
   * e.g., "firstName" -> "First Name", "user_email" -> "User Email"
   */
  _fieldNameToLabel(r) {
    return r.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/\b\w/g, (e) => e.toUpperCase()).trim();
  }
};
y.styles = [
  Je,
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
j([
  I({ type: String })
], y.prototype, "schema", 2);
j([
  I({ type: Object, attribute: !1 })
], y.prototype, "value", 2);
j([
  I({ type: Boolean, attribute: "validate-on-change" })
], y.prototype, "validateOnChange", 2);
j([
  I({ type: Boolean, attribute: "show-submit" })
], y.prototype, "showSubmit", 2);
j([
  I({ type: String, attribute: "submit-text" })
], y.prototype, "submitText", 2);
j([
  I({ type: String, attribute: "initial-data" })
], y.prototype, "initialData", 2);
j([
  E()
], y.prototype, "_parsedSchema", 2);
j([
  E()
], y.prototype, "_parseError", 2);
j([
  E()
], y.prototype, "_errors", 2);
j([
  E()
], y.prototype, "_submitted", 2);
j([
  E()
], y.prototype, "_schemaSelections", 2);
j([
  E()
], y.prototype, "_collapsedSections", 2);
j([
  E()
], y.prototype, "_initialDataError", 2);
y = j([
  Ue("json-schema-form")
], y);
export {
  y as JsonSchemaForm
};
//# sourceMappingURL=json-schema-form.js.map
