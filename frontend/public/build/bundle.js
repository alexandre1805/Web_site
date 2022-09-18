
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    // utils is a library of generic helper functions non-specific to axios

    var toString$1 = Object.prototype.toString;

    // eslint-disable-next-line func-names
    var kindOf = (function(cache) {
      // eslint-disable-next-line func-names
      return function(thing) {
        var str = toString$1.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
      };
    })(Object.create(null));

    function kindOfTest(type) {
      type = type.toLowerCase();
      return function isKindOf(thing) {
        return kindOf(thing) === type;
      };
    }

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return Array.isArray(val);
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    var isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (kindOf(val) !== 'object') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    var isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    var isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     *
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    var isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString$1.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(thing) {
      var pattern = '[object FormData]';
      return thing && (
        (typeof FormData === 'function' && thing instanceof FormData) ||
        toString$1.call(thing) === pattern ||
        (isFunction(thing.toString) && thing.toString() === pattern)
      );
    }

    /**
     * Determine if a value is a URLSearchParams object
     * @function
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    var isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    /**
     * Inherit the prototype methods from one constructor into another
     * @param {function} constructor
     * @param {function} superConstructor
     * @param {object} [props]
     * @param {object} [descriptors]
     */

    function inherits(constructor, superConstructor, props, descriptors) {
      constructor.prototype = Object.create(superConstructor.prototype, descriptors);
      constructor.prototype.constructor = constructor;
      props && Object.assign(constructor.prototype, props);
    }

    /**
     * Resolve object with deep prototype chain to a flat object
     * @param {Object} sourceObj source object
     * @param {Object} [destObj]
     * @param {Function} [filter]
     * @returns {Object}
     */

    function toFlatObject(sourceObj, destObj, filter) {
      var props;
      var i;
      var prop;
      var merged = {};

      destObj = destObj || {};

      do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while (i-- > 0) {
          prop = props[i];
          if (!merged[prop]) {
            destObj[prop] = sourceObj[prop];
            merged[prop] = true;
          }
        }
        sourceObj = Object.getPrototypeOf(sourceObj);
      } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

      return destObj;
    }

    /*
     * determines whether a string ends with the characters of a specified string
     * @param {String} str
     * @param {String} searchString
     * @param {Number} [position= 0]
     * @returns {boolean}
     */
    function endsWith(str, searchString, position) {
      str = String(str);
      if (position === undefined || position > str.length) {
        position = str.length;
      }
      position -= searchString.length;
      var lastIndex = str.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }


    /**
     * Returns new array from array like object
     * @param {*} [thing]
     * @returns {Array}
     */
    function toArray(thing) {
      if (!thing) return null;
      var i = thing.length;
      if (isUndefined(i)) return null;
      var arr = new Array(i);
      while (i-- > 0) {
        arr[i] = thing[i];
      }
      return arr;
    }

    // eslint-disable-next-line func-names
    var isTypedArray = (function(TypedArray) {
      // eslint-disable-next-line func-names
      return function(thing) {
        return TypedArray && thing instanceof TypedArray;
      };
    })(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM,
      inherits: inherits,
      toFlatObject: toFlatObject,
      kindOf: kindOf,
      kindOfTest: kindOfTest,
      endsWith: endsWith,
      toArray: toArray,
      isTypedArray: isTypedArray,
      isFileList: isFileList
    };

    function encode$2(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode$2(key) + '=' + encode$2(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected,
        synchronous: options ? options.synchronous : false,
        runWhen: options ? options.runWhen : null
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [config] The config.
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError(message, code, config, request, response) {
      Error.call(this);
      this.message = message;
      this.name = 'AxiosError';
      code && (this.code = code);
      config && (this.config = config);
      request && (this.request = request);
      response && (this.response = response);
    }

    utils.inherits(AxiosError, Error, {
      toJSON: function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null
        };
      }
    });

    var prototype = AxiosError.prototype;
    var descriptors = {};

    [
      'ERR_BAD_OPTION_VALUE',
      'ERR_BAD_OPTION',
      'ECONNABORTED',
      'ETIMEDOUT',
      'ERR_NETWORK',
      'ERR_FR_TOO_MANY_REDIRECTS',
      'ERR_DEPRECATED',
      'ERR_BAD_RESPONSE',
      'ERR_BAD_REQUEST',
      'ERR_CANCELED'
    // eslint-disable-next-line func-names
    ].forEach(function(code) {
      descriptors[code] = {value: code};
    });

    Object.defineProperties(AxiosError, descriptors);
    Object.defineProperty(prototype, 'isAxiosError', {value: true});

    // eslint-disable-next-line func-names
    AxiosError.from = function(error, code, config, request, response, customProps) {
      var axiosError = Object.create(prototype);

      utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
      });

      AxiosError.call(axiosError, error.message, code, config, request, response);

      axiosError.name = error.name;

      customProps && Object.assign(axiosError, customProps);

      return axiosError;
    };

    var AxiosError_1 = AxiosError;

    var transitional = {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false
    };

    /**
     * Convert a data object to FormData
     * @param {Object} obj
     * @param {?Object} [formData]
     * @returns {Object}
     **/

    function toFormData(obj, formData) {
      // eslint-disable-next-line no-param-reassign
      formData = formData || new FormData();

      var stack = [];

      function convertValue(value) {
        if (value === null) return '';

        if (utils.isDate(value)) {
          return value.toISOString();
        }

        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
          return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
        }

        return value;
      }

      function build(data, parentKey) {
        if (utils.isPlainObject(data) || utils.isArray(data)) {
          if (stack.indexOf(data) !== -1) {
            throw Error('Circular reference detected in ' + parentKey);
          }

          stack.push(data);

          utils.forEach(data, function each(value, key) {
            if (utils.isUndefined(value)) return;
            var fullKey = parentKey ? parentKey + '.' + key : key;
            var arr;

            if (value && !parentKey && typeof value === 'object') {
              if (utils.endsWith(key, '{}')) {
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
              } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
                // eslint-disable-next-line func-names
                arr.forEach(function(el) {
                  !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
                });
                return;
              }
            }

            build(value, fullKey);
          });

          stack.pop();
        } else {
          formData.append(parentKey, convertValue(data));
        }
      }

      build(obj);

      return formData;
    }

    var toFormData_1 = toFormData;

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(new AxiosError_1(
          'Request failed with status code ' + response.status,
          [AxiosError_1.ERR_BAD_REQUEST, AxiosError_1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
          response.config,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function CanceledError(message) {
      // eslint-disable-next-line no-eq-null,eqeqeq
      AxiosError_1.call(this, message == null ? 'canceled' : message, AxiosError_1.ERR_CANCELED);
      this.name = 'CanceledError';
    }

    utils.inherits(CanceledError, AxiosError_1, {
      __CANCEL__: true
    });

    var CanceledError_1 = CanceledError;

    var parseProtocol = function parseProtocol(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || '';
    };

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        var responseType = config.responseType;
        var onCanceled;
        function done() {
          if (config.cancelToken) {
            config.cancelToken.unsubscribe(onCanceled);
          }

          if (config.signal) {
            config.signal.removeEventListener('abort', onCanceled);
          }
        }

        if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);

        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        function onloadend() {
          if (!request) {
            return;
          }
          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
            request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(function _resolve(value) {
            resolve(value);
            done();
          }, function _reject(err) {
            reject(err);
            done();
          }, response);

          // Clean up request
          request = null;
        }

        if ('onloadend' in request) {
          // Use onloadend if available
          request.onloadend = onloadend;
        } else {
          // Listen for ready state to emulate onloadend
          request.onreadystatechange = function handleLoad() {
            if (!request || request.readyState !== 4) {
              return;
            }

            // The request errored out and we didn't get a response, this will be
            // handled by onerror instead
            // With one exception: request that using file: protocol, most browsers
            // will return status as 0 even though it's a successful request
            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
              return;
            }
            // readystate handler is calling before onerror or ontimeout handlers,
            // so we should call onloadend on the next 'tick'
            setTimeout(onloadend);
          };
        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(new AxiosError_1('Request aborted', AxiosError_1.ECONNABORTED, config, request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(new AxiosError_1('Network Error', AxiosError_1.ERR_NETWORK, config, request, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
          var transitional$1 = config.transitional || transitional;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError_1(
            timeoutErrorMessage,
            transitional$1.clarifyTimeoutError ? AxiosError_1.ETIMEDOUT : AxiosError_1.ECONNABORTED,
            config,
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (responseType && responseType !== 'json') {
          request.responseType = config.responseType;
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken || config.signal) {
          // Handle cancellation
          // eslint-disable-next-line func-names
          onCanceled = function(cancel) {
            if (!request) {
              return;
            }
            reject(!cancel || (cancel && cancel.type) ? new CanceledError_1() : cancel);
            request.abort();
            request = null;
          };

          config.cancelToken && config.cancelToken.subscribe(onCanceled);
          if (config.signal) {
            config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
          }
        }

        if (!requestData) {
          requestData = null;
        }

        var protocol = parseProtocol(fullPath);

        if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
          reject(new AxiosError_1('Unsupported protocol ' + protocol + ':', AxiosError_1.ERR_BAD_REQUEST, config));
          return;
        }


        // Send the request
        request.send(requestData);
      });
    };

    // eslint-disable-next-line strict
    var _null = null;

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    function stringifySafely(rawValue, parser, encoder) {
      if (utils.isString(rawValue)) {
        try {
          (parser || JSON.parse)(rawValue);
          return utils.trim(rawValue);
        } catch (e) {
          if (e.name !== 'SyntaxError') {
            throw e;
          }
        }
      }

      return (encoder || JSON.stringify)(rawValue);
    }

    var defaults = {

      transitional: transitional,

      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');

        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }

        var isObjectPayload = utils.isObject(data);
        var contentType = headers && headers['Content-Type'];

        var isFileList;

        if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
          var _FormData = this.env && this.env.FormData;
          return toFormData_1(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
        } else if (isObjectPayload || contentType === 'application/json') {
          setContentTypeIfUnset(headers, 'application/json');
          return stringifySafely(data);
        }

        return data;
      }],

      transformResponse: [function transformResponse(data) {
        var transitional = this.transitional || defaults.transitional;
        var silentJSONParsing = transitional && transitional.silentJSONParsing;
        var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
        var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

        if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
          try {
            return JSON.parse(data);
          } catch (e) {
            if (strictJSONParsing) {
              if (e.name === 'SyntaxError') {
                throw AxiosError_1.from(e, AxiosError_1.ERR_BAD_RESPONSE, this, null, this.response);
              }
              throw e;
            }
          }
        }

        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      env: {
        FormData: _null
      },

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      },

      headers: {
        common: {
          'Accept': 'application/json, text/plain, */*'
        }
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      var context = this || defaults_1;
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }

      if (config.signal && config.signal.aborted) {
        throw new CanceledError_1();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData.call(
        config,
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData.call(
          config,
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData.call(
              config,
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      // eslint-disable-next-line consistent-return
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          return getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      // eslint-disable-next-line consistent-return
      function mergeDirectKeys(prop) {
        if (prop in config2) {
          return getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          return getMergedValue(undefined, config1[prop]);
        }
      }

      var mergeMap = {
        'url': valueFromConfig2,
        'method': valueFromConfig2,
        'data': valueFromConfig2,
        'baseURL': defaultToConfig2,
        'transformRequest': defaultToConfig2,
        'transformResponse': defaultToConfig2,
        'paramsSerializer': defaultToConfig2,
        'timeout': defaultToConfig2,
        'timeoutMessage': defaultToConfig2,
        'withCredentials': defaultToConfig2,
        'adapter': defaultToConfig2,
        'responseType': defaultToConfig2,
        'xsrfCookieName': defaultToConfig2,
        'xsrfHeaderName': defaultToConfig2,
        'onUploadProgress': defaultToConfig2,
        'onDownloadProgress': defaultToConfig2,
        'decompress': defaultToConfig2,
        'maxContentLength': defaultToConfig2,
        'maxBodyLength': defaultToConfig2,
        'beforeRedirect': defaultToConfig2,
        'transport': defaultToConfig2,
        'httpAgent': defaultToConfig2,
        'httpsAgent': defaultToConfig2,
        'cancelToken': defaultToConfig2,
        'socketPath': defaultToConfig2,
        'responseEncoding': defaultToConfig2,
        'validateStatus': mergeDirectKeys
      };

      utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
        var merge = mergeMap[prop] || mergeDeepProperties;
        var configValue = merge(prop);
        (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
      });

      return config;
    };

    var data = {
      "version": "0.27.2"
    };

    var VERSION = data.version;


    var validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
      validators$1[type] = function validator(thing) {
        return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
      };
    });

    var deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
      function formatMessage(opt, desc) {
        return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
      }

      // eslint-disable-next-line func-names
      return function(value, opt, opts) {
        if (validator === false) {
          throw new AxiosError_1(
            formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
            AxiosError_1.ERR_DEPRECATED
          );
        }

        if (version && !deprecatedWarnings[opt]) {
          deprecatedWarnings[opt] = true;
          // eslint-disable-next-line no-console
          console.warn(
            formatMessage(
              opt,
              ' has been deprecated since v' + version + ' and will be removed in the near future'
            )
          );
        }

        return validator ? validator(value, opt, opts) : true;
      };
    };

    /**
     * Assert object's properties type
     * @param {object} options
     * @param {object} schema
     * @param {boolean?} allowUnknown
     */

    function assertOptions(options, schema, allowUnknown) {
      if (typeof options !== 'object') {
        throw new AxiosError_1('options must be an object', AxiosError_1.ERR_BAD_OPTION_VALUE);
      }
      var keys = Object.keys(options);
      var i = keys.length;
      while (i-- > 0) {
        var opt = keys[i];
        var validator = schema[opt];
        if (validator) {
          var value = options[opt];
          var result = value === undefined || validator(value, opt, options);
          if (result !== true) {
            throw new AxiosError_1('option ' + opt + ' must be ' + result, AxiosError_1.ERR_BAD_OPTION_VALUE);
          }
          continue;
        }
        if (allowUnknown !== true) {
          throw new AxiosError_1('Unknown option ' + opt, AxiosError_1.ERR_BAD_OPTION);
        }
      }
    }

    var validator = {
      assertOptions: assertOptions,
      validators: validators$1
    };

    var validators = validator.validators;
    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(configOrUrl, config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof configOrUrl === 'string') {
        config = config || {};
        config.url = configOrUrl;
      } else {
        config = configOrUrl || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      var transitional = config.transitional;

      if (transitional !== undefined) {
        validator.assertOptions(transitional, {
          silentJSONParsing: validators.transitional(validators.boolean),
          forcedJSONParsing: validators.transitional(validators.boolean),
          clarifyTimeoutError: validators.transitional(validators.boolean)
        }, false);
      }

      // filter out skipped interceptors
      var requestInterceptorChain = [];
      var synchronousRequestInterceptors = true;
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
          return;
        }

        synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

        requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      var responseInterceptorChain = [];
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
      });

      var promise;

      if (!synchronousRequestInterceptors) {
        var chain = [dispatchRequest, undefined];

        Array.prototype.unshift.apply(chain, requestInterceptorChain);
        chain = chain.concat(responseInterceptorChain);

        promise = Promise.resolve(config);
        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      }


      var newConfig = config;
      while (requestInterceptorChain.length) {
        var onFulfilled = requestInterceptorChain.shift();
        var onRejected = requestInterceptorChain.shift();
        try {
          newConfig = onFulfilled(newConfig);
        } catch (error) {
          onRejected(error);
          break;
        }
      }

      try {
        promise = dispatchRequest(newConfig);
      } catch (error) {
        return Promise.reject(error);
      }

      while (responseInterceptorChain.length) {
        promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      var fullPath = buildFullPath(config.baseURL, config.url);
      return buildURL(fullPath, config.params, config.paramsSerializer);
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/

      function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
          return this.request(mergeConfig(config || {}, {
            method: method,
            headers: isForm ? {
              'Content-Type': 'multipart/form-data'
            } : {},
            url: url,
            data: data
          }));
        };
      }

      Axios.prototype[method] = generateHTTPMethod();

      Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    var Axios_1 = Axios;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;

      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;

      // eslint-disable-next-line func-names
      this.promise.then(function(cancel) {
        if (!token._listeners) return;

        var i;
        var l = token._listeners.length;

        for (i = 0; i < l; i++) {
          token._listeners[i](cancel);
        }
        token._listeners = null;
      });

      // eslint-disable-next-line func-names
      this.promise.then = function(onfulfilled) {
        var _resolve;
        // eslint-disable-next-line func-names
        var promise = new Promise(function(resolve) {
          token.subscribe(resolve);
          _resolve = resolve;
        }).then(onfulfilled);

        promise.cancel = function reject() {
          token.unsubscribe(_resolve);
        };

        return promise;
      };

      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new CanceledError_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Subscribe to the cancel signal
     */

    CancelToken.prototype.subscribe = function subscribe(listener) {
      if (this.reason) {
        listener(this.reason);
        return;
      }

      if (this._listeners) {
        this._listeners.push(listener);
      } else {
        this._listeners = [listener];
      }
    };

    /**
     * Unsubscribe from the cancel signal
     */

    CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
      if (!this._listeners) {
        return;
      }
      var index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return utils.isObject(payload) && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      // Factory for creating new instances
      instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
      };

      return instance;
    }

    // Create the default instance to be exported
    var axios$1 = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios$1.Axios = Axios_1;

    // Expose Cancel & CancelToken
    axios$1.CanceledError = CanceledError_1;
    axios$1.CancelToken = CancelToken_1;
    axios$1.isCancel = isCancel;
    axios$1.VERSION = data.version;
    axios$1.toFormData = toFormData_1;

    // Expose AxiosError class
    axios$1.AxiosError = AxiosError_1;

    // alias for CanceledError for backward compatibility
    axios$1.Cancel = axios$1.CanceledError;

    // Expose all/spread
    axios$1.all = function all(promises) {
      return Promise.all(promises);
    };
    axios$1.spread = spread;

    // Expose isAxiosError
    axios$1.isAxiosError = isAxiosError;

    var axios_1 = axios$1;

    // Allow use of default import syntax in TypeScript
    var _default = axios$1;
    axios_1.default = _default;

    var axios = axios_1;

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse$1(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1, Object: Object_1$2, console: console_1$2 } = globals;

    // (251:0) {:else}
    function create_else_block$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$b, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location$1 = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse$1(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location: location$1,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse: parse$1,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const socket = writable(null);
    const username = writable("");
    const currentGame = writable("");

    /* src/Components/Landing/Notifications.svelte generated by Svelte v3.49.0 */

    const { console: console_1$1 } = globals;
    const file$h = "src/Components/Landing/Notifications.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (37:4) {#if e.type === "add_friend"}
    function create_if_block$a(ctx) {
    	let div;
    	let span;
    	let t0_value = /*e*/ ctx[7].message + "";
    	let t0;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let div_key_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*e*/ ctx[7]);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*e*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "ADD";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "DELETE";
    			t5 = space();
    			add_location(span, file$h, 38, 8, 995);
    			add_location(button0, file$h, 39, 8, 1028);
    			add_location(button1, file$h, 46, 8, 1161);
    			attr_dev(div, "class", "add_friend");
    			attr_dev(div, "key", div_key_value = /*e*/ ctx[7]._id);
    			add_location(div, file$h, 37, 6, 950);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);
    			append_dev(div, button0);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			append_dev(div, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*notifications*/ 1 && t0_value !== (t0_value = /*e*/ ctx[7].message + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*notifications*/ 1 && div_key_value !== (div_key_value = /*e*/ ctx[7]._id)) {
    				attr_dev(div, "key", div_key_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(37:4) {#if e.type === \\\"add_friend\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#each notifications as e}
    function create_each_block$7(ctx) {
    	let if_block_anchor;
    	let if_block = /*e*/ ctx[7].type === "add_friend" && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*e*/ ctx[7].type === "add_friend") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(36:2) {#each notifications as e}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let each_value = /*notifications*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "Notification");
    			add_location(div, file$h, 34, 0, 854);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*notifications, deleteNotification, handleAccpetInvit*/ 7) {
    				each_value = /*notifications*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $socket;
    	let $username;
    	validate_store(socket, 'socket');
    	component_subscribe($$self, socket, $$value => $$invalidate(5, $socket = $$value));
    	validate_store(username, 'username');
    	component_subscribe($$self, username, $$value => $$invalidate(6, $username = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notifications', slots, []);
    	let notifications = [];

    	//get the notifications
    	axios.get("http://" + 'localhost' + ":" + '4000' + "/getNotifs", {
    		params: { username: $username },
    		withCredentials: true
    	}).then(res => {
    		$$invalidate(0, notifications = res.data);
    	});

    	//real-times get notifications
    	$socket.on("notification", elt => {
    		console.log(elt);
    		$$invalidate(0, notifications = [...notifications, elt]);
    	});

    	function deleteNotification(e) {
    		$socket.emit("delete notification", e.id);
    		$$invalidate(0, notifications = notifications.filter(elm => elm.id !== e.id));
    	}

    	function handleAccpetInvit(e) {
    		$socket.emit("accept invitation", e);
    		$$invalidate(0, notifications = notifications.filter(elm => elm.id !== e.id));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Notifications> was created with unknown prop '${key}'`);
    	});

    	const click_handler = e => {
    		handleAccpetInvit(e);
    	};

    	const click_handler_1 = e => {
    		deleteNotification(e);
    	};

    	$$self.$capture_state = () => ({
    		username,
    		socket,
    		axios,
    		notifications,
    		deleteNotification,
    		handleAccpetInvit,
    		$socket,
    		$username
    	});

    	$$self.$inject_state = $$props => {
    		if ('notifications' in $$props) $$invalidate(0, notifications = $$props.notifications);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		notifications,
    		deleteNotification,
    		handleAccpetInvit,
    		click_handler,
    		click_handler_1
    	];
    }

    class Notifications extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notifications",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src/Components/Landing/NavBar.svelte generated by Svelte v3.49.0 */
    const file$g = "src/Components/Landing/NavBar.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (34:2) {:else}
    function create_else_block$6(ctx) {
    	let ul;
    	let each_value = /*default_routes*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$g, 34, 4, 878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*default_routes*/ 4) {
    				each_value = /*default_routes*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(34:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#if $username !== ""}
    function create_if_block$9(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*notificationsOpen*/ ctx[0] && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text("Welcome ");
    			t2 = text(/*$username*/ ctx[1]);
    			t3 = text(" !");
    			t4 = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = "/notification.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "notif");
    			add_location(img, file$g, 21, 6, 582);
    			attr_dev(h3, "class", "hide");
    			add_location(h3, file$g, 28, 6, 741);
    			attr_dev(div, "class", "loged");
    			add_location(div, file$g, 20, 4, 556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, h3);
    			append_dev(h3, t1);
    			append_dev(h3, t2);
    			append_dev(h3, t3);
    			append_dev(div, t4);
    			if (if_block) if_block.m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(img, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$username*/ 2) set_data_dev(t2, /*$username*/ ctx[1]);

    			if (/*notificationsOpen*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*notificationsOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(20:2) {#if $username !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:6) {#each default_routes as page}
    function create_each_block$6(ctx) {
    	let li;
    	let a;
    	let t0_value = /*page*/ ctx[4].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", /*page*/ ctx[4].route);
    			add_location(a, file$g, 37, 10, 943);
    			add_location(li, file$g, 36, 8, 928);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(36:6) {#each default_routes as page}",
    		ctx
    	});

    	return block;
    }

    // (30:6) {#if notificationsOpen}
    function create_if_block_1$4(ctx) {
    	let notifications;
    	let current;
    	notifications = new Notifications({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(notifications.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notifications, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notifications.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notifications.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notifications, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(30:6) {#if notificationsOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$9, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$username*/ ctx[1] !== "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "LOGO";
    			t1 = space();
    			if_block.c();
    			add_location(h2, file$g, 18, 2, 513);
    			attr_dev(div, "class", "navigation");
    			add_location(div, file$g, 17, 0, 486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $username;
    	validate_store(username, 'username');
    	component_subscribe($$self, username, $$value => $$invalidate(1, $username = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	let notificationsOpen = false;

    	const default_routes = [
    		{ name: "Home", route: "/" },
    		{ name: "About Us", route: "/about" },
    		{ name: "Log In", route: "/dashboard" },
    		{ name: "Sign Up", route: "/register" }
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, notificationsOpen = !notificationsOpen);
    	};

    	$$self.$capture_state = () => ({
    		link,
    		username,
    		Notifications,
    		notificationsOpen,
    		default_routes,
    		$username
    	});

    	$$self.$inject_state = $$props => {
    		if ('notificationsOpen' in $$props) $$invalidate(0, notificationsOpen = $$props.notificationsOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [notificationsOpen, $username, default_routes, click_handler];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    const PACKET_TYPES = Object.create(null); // no Map = no polyfill
    PACKET_TYPES["open"] = "0";
    PACKET_TYPES["close"] = "1";
    PACKET_TYPES["ping"] = "2";
    PACKET_TYPES["pong"] = "3";
    PACKET_TYPES["message"] = "4";
    PACKET_TYPES["upgrade"] = "5";
    PACKET_TYPES["noop"] = "6";
    const PACKET_TYPES_REVERSE = Object.create(null);
    Object.keys(PACKET_TYPES).forEach(key => {
        PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
    });
    const ERROR_PACKET = { type: "error", data: "parser error" };

    const withNativeBlob$1 = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
    const withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
    // ArrayBuffer.isView method is not defined in IE10
    const isView$1 = obj => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj && obj.buffer instanceof ArrayBuffer;
    };
    const encodePacket = ({ type, data }, supportsBinary, callback) => {
        if (withNativeBlob$1 && data instanceof Blob) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(data, callback);
            }
        }
        else if (withNativeArrayBuffer$2 &&
            (data instanceof ArrayBuffer || isView$1(data))) {
            if (supportsBinary) {
                return callback(data);
            }
            else {
                return encodeBlobAsBase64(new Blob([data]), callback);
            }
        }
        // plain string
        return callback(PACKET_TYPES[type] + (data || ""));
    };
    const encodeBlobAsBase64 = (data, callback) => {
        const fileReader = new FileReader();
        fileReader.onload = function () {
            const content = fileReader.result.split(",")[1];
            callback("b" + content);
        };
        return fileReader.readAsDataURL(data);
    };

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    const lookup$1 = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (let i = 0; i < chars.length; i++) {
        lookup$1[chars.charCodeAt(i)] = i;
    }
    const decode$1 = (base64) => {
        let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup$1[base64.charCodeAt(i)];
            encoded2 = lookup$1[base64.charCodeAt(i + 1)];
            encoded3 = lookup$1[base64.charCodeAt(i + 2)];
            encoded4 = lookup$1[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return arraybuffer;
    };

    const withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
    const decodePacket = (encodedPacket, binaryType) => {
        if (typeof encodedPacket !== "string") {
            return {
                type: "message",
                data: mapBinary(encodedPacket, binaryType)
            };
        }
        const type = encodedPacket.charAt(0);
        if (type === "b") {
            return {
                type: "message",
                data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
            };
        }
        const packetType = PACKET_TYPES_REVERSE[type];
        if (!packetType) {
            return ERROR_PACKET;
        }
        return encodedPacket.length > 1
            ? {
                type: PACKET_TYPES_REVERSE[type],
                data: encodedPacket.substring(1)
            }
            : {
                type: PACKET_TYPES_REVERSE[type]
            };
    };
    const decodeBase64Packet = (data, binaryType) => {
        if (withNativeArrayBuffer$1) {
            const decoded = decode$1(data);
            return mapBinary(decoded, binaryType);
        }
        else {
            return { base64: true, data }; // fallback for old browsers
        }
    };
    const mapBinary = (data, binaryType) => {
        switch (binaryType) {
            case "blob":
                return data instanceof ArrayBuffer ? new Blob([data]) : data;
            case "arraybuffer":
            default:
                return data; // assuming the data is already an ArrayBuffer
        }
    };

    const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
    const encodePayload = (packets, callback) => {
        // some packets may be added to the array while encoding, so the initial length must be saved
        const length = packets.length;
        const encodedPackets = new Array(length);
        let count = 0;
        packets.forEach((packet, i) => {
            // force base64 encoding for binary packets
            encodePacket(packet, false, encodedPacket => {
                encodedPackets[i] = encodedPacket;
                if (++count === length) {
                    callback(encodedPackets.join(SEPARATOR));
                }
            });
        });
    };
    const decodePayload = (encodedPayload, binaryType) => {
        const encodedPackets = encodedPayload.split(SEPARATOR);
        const packets = [];
        for (let i = 0; i < encodedPackets.length; i++) {
            const decodedPacket = decodePacket(encodedPackets[i], binaryType);
            packets.push(decodedPacket);
            if (decodedPacket.type === "error") {
                break;
            }
        }
        return packets;
    };
    const protocol$1 = 4;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
      if (obj) return mixin(obj);
    }

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
      for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
      }
      return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
    Emitter.prototype.addEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};
      (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
      return this;
    };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
      function on() {
        this.off(event, on);
        fn.apply(this, arguments);
      }

      on.fn = fn;
      this.on(event, on);
      return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
    Emitter.prototype.removeListener =
    Emitter.prototype.removeAllListeners =
    Emitter.prototype.removeEventListener = function(event, fn){
      this._callbacks = this._callbacks || {};

      // all
      if (0 == arguments.length) {
        this._callbacks = {};
        return this;
      }

      // specific event
      var callbacks = this._callbacks['$' + event];
      if (!callbacks) return this;

      // remove all handlers
      if (1 == arguments.length) {
        delete this._callbacks['$' + event];
        return this;
      }

      // remove specific handler
      var cb;
      for (var i = 0; i < callbacks.length; i++) {
        cb = callbacks[i];
        if (cb === fn || cb.fn === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }

      // Remove event specific arrays for event types that no
      // one is subscribed for to avoid memory leak.
      if (callbacks.length === 0) {
        delete this._callbacks['$' + event];
      }

      return this;
    };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
      this._callbacks = this._callbacks || {};

      var args = new Array(arguments.length - 1)
        , callbacks = this._callbacks['$' + event];

      for (var i = 1; i < arguments.length; i++) {
        args[i - 1] = arguments[i];
      }

      if (callbacks) {
        callbacks = callbacks.slice(0);
        for (var i = 0, len = callbacks.length; i < len; ++i) {
          callbacks[i].apply(this, args);
        }
      }

      return this;
    };

    // alias used for reserved events (protected method)
    Emitter.prototype.emitReserved = Emitter.prototype.emit;

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
      this._callbacks = this._callbacks || {};
      return this._callbacks['$' + event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
      return !! this.listeners(event).length;
    };

    const globalThisShim = (() => {
        if (typeof self !== "undefined") {
            return self;
        }
        else if (typeof window !== "undefined") {
            return window;
        }
        else {
            return Function("return this")();
        }
    })();

    function pick(obj, ...attr) {
        return attr.reduce((acc, k) => {
            if (obj.hasOwnProperty(k)) {
                acc[k] = obj[k];
            }
            return acc;
        }, {});
    }
    // Keep a reference to the real timeout functions so they can be used when overridden
    const NATIVE_SET_TIMEOUT = setTimeout;
    const NATIVE_CLEAR_TIMEOUT = clearTimeout;
    function installTimerFunctions(obj, opts) {
        if (opts.useNativeTimers) {
            obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
            obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
        }
        else {
            obj.setTimeoutFn = setTimeout.bind(globalThisShim);
            obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
        }
    }
    // base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
    const BASE64_OVERHEAD = 1.33;
    // we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
    function byteLength(obj) {
        if (typeof obj === "string") {
            return utf8Length(obj);
        }
        // arraybuffer or blob
        return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
    }
    function utf8Length(str) {
        let c = 0, length = 0;
        for (let i = 0, l = str.length; i < l; i++) {
            c = str.charCodeAt(i);
            if (c < 0x80) {
                length += 1;
            }
            else if (c < 0x800) {
                length += 2;
            }
            else if (c < 0xd800 || c >= 0xe000) {
                length += 3;
            }
            else {
                i++;
                length += 4;
            }
        }
        return length;
    }

    class TransportError extends Error {
        constructor(reason, description, context) {
            super(reason);
            this.description = description;
            this.context = context;
            this.type = "TransportError";
        }
    }
    class Transport extends Emitter {
        /**
         * Transport abstract constructor.
         *
         * @param {Object} options.
         * @api private
         */
        constructor(opts) {
            super();
            this.writable = false;
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.query = opts.query;
            this.readyState = "";
            this.socket = opts.socket;
        }
        /**
         * Emits an error.
         *
         * @param {String} reason
         * @param description
         * @param context - the error context
         * @return {Transport} for chaining
         * @api protected
         */
        onError(reason, description, context) {
            super.emitReserved("error", new TransportError(reason, description, context));
            return this;
        }
        /**
         * Opens the transport.
         *
         * @api public
         */
        open() {
            if ("closed" === this.readyState || "" === this.readyState) {
                this.readyState = "opening";
                this.doOpen();
            }
            return this;
        }
        /**
         * Closes the transport.
         *
         * @api public
         */
        close() {
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.doClose();
                this.onClose();
            }
            return this;
        }
        /**
         * Sends multiple packets.
         *
         * @param {Array} packets
         * @api public
         */
        send(packets) {
            if ("open" === this.readyState) {
                this.write(packets);
            }
        }
        /**
         * Called upon open
         *
         * @api protected
         */
        onOpen() {
            this.readyState = "open";
            this.writable = true;
            super.emitReserved("open");
        }
        /**
         * Called with data.
         *
         * @param {String} data
         * @api protected
         */
        onData(data) {
            const packet = decodePacket(data, this.socket.binaryType);
            this.onPacket(packet);
        }
        /**
         * Called with a decoded packet.
         *
         * @api protected
         */
        onPacket(packet) {
            super.emitReserved("packet", packet);
        }
        /**
         * Called upon close.
         *
         * @api protected
         */
        onClose(details) {
            this.readyState = "closed";
            super.emitReserved("close", details);
        }
    }

    // imported from https://github.com/unshiftio/yeast
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
    let seed = 0, i = 0, prev;
    /**
     * Return a string representing the specified number.
     *
     * @param {Number} num The number to convert.
     * @returns {String} The string representation of the number.
     * @api public
     */
    function encode$1(num) {
        let encoded = '';
        do {
            encoded = alphabet[num % length] + encoded;
            num = Math.floor(num / length);
        } while (num > 0);
        return encoded;
    }
    /**
     * Yeast: A tiny growing id generator.
     *
     * @returns {String} A unique id.
     * @api public
     */
    function yeast() {
        const now = encode$1(+new Date());
        if (now !== prev)
            return seed = 0, prev = now;
        return now + '.' + encode$1(seed++);
    }
    //
    // Map each character to its index.
    //
    for (; i < length; i++)
        map[alphabet[i]] = i;

    // imported from https://github.com/galkn/querystring
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */
    function encode(obj) {
        let str = '';
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length)
                    str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }
        return str;
    }
    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */
    function decode(qs) {
        let qry = {};
        let pairs = qs.split('&');
        for (let i = 0, l = pairs.length; i < l; i++) {
            let pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    }

    // imported from https://github.com/component/has-cors
    let value = false;
    try {
        value = typeof XMLHttpRequest !== 'undefined' &&
            'withCredentials' in new XMLHttpRequest();
    }
    catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
    }
    const hasCORS = value;

    // browser shim for xmlhttprequest module
    function XHR(opts) {
        const xdomain = opts.xdomain;
        // XMLHttpRequest can be disabled on IE
        try {
            if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        }
        catch (e) { }
        if (!xdomain) {
            try {
                return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
            }
            catch (e) { }
        }
    }

    function empty() { }
    const hasXHR2 = (function () {
        const xhr = new XHR({
            xdomain: false
        });
        return null != xhr.responseType;
    })();
    class Polling extends Transport {
        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.polling = false;
            if (typeof location !== "undefined") {
                const isSSL = "https:" === location.protocol;
                let port = location.port;
                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? "443" : "80";
                }
                this.xd =
                    (typeof location !== "undefined" &&
                        opts.hostname !== location.hostname) ||
                        port !== opts.port;
                this.xs = opts.secure !== isSSL;
            }
            /**
             * XHR supports binary
             */
            const forceBase64 = opts && opts.forceBase64;
            this.supportsBinary = hasXHR2 && !forceBase64;
        }
        /**
         * Transport name.
         */
        get name() {
            return "polling";
        }
        /**
         * Opens the socket (triggers polling). We write a PING message to determine
         * when the transport is open.
         *
         * @api private
         */
        doOpen() {
            this.poll();
        }
        /**
         * Pauses polling.
         *
         * @param {Function} callback upon buffers are flushed and transport is paused
         * @api private
         */
        pause(onPause) {
            this.readyState = "pausing";
            const pause = () => {
                this.readyState = "paused";
                onPause();
            };
            if (this.polling || !this.writable) {
                let total = 0;
                if (this.polling) {
                    total++;
                    this.once("pollComplete", function () {
                        --total || pause();
                    });
                }
                if (!this.writable) {
                    total++;
                    this.once("drain", function () {
                        --total || pause();
                    });
                }
            }
            else {
                pause();
            }
        }
        /**
         * Starts polling cycle.
         *
         * @api public
         */
        poll() {
            this.polling = true;
            this.doPoll();
            this.emitReserved("poll");
        }
        /**
         * Overloads onData to detect payloads.
         *
         * @api private
         */
        onData(data) {
            const callback = packet => {
                // if its the first message we consider the transport open
                if ("opening" === this.readyState && packet.type === "open") {
                    this.onOpen();
                }
                // if its a close packet, we close the ongoing requests
                if ("close" === packet.type) {
                    this.onClose({ description: "transport closed by the server" });
                    return false;
                }
                // otherwise bypass onData and handle the message
                this.onPacket(packet);
            };
            // decode payload
            decodePayload(data, this.socket.binaryType).forEach(callback);
            // if an event did not trigger closing
            if ("closed" !== this.readyState) {
                // if we got data we're not polling
                this.polling = false;
                this.emitReserved("pollComplete");
                if ("open" === this.readyState) {
                    this.poll();
                }
            }
        }
        /**
         * For polling, send a close packet.
         *
         * @api private
         */
        doClose() {
            const close = () => {
                this.write([{ type: "close" }]);
            };
            if ("open" === this.readyState) {
                close();
            }
            else {
                // in case we're trying to close while
                // handshaking is in progress (GH-164)
                this.once("open", close);
            }
        }
        /**
         * Writes a packets payload.
         *
         * @param {Array} data packets
         * @param {Function} drain callback
         * @api private
         */
        write(packets) {
            this.writable = false;
            encodePayload(packets, data => {
                this.doWrite(data, () => {
                    this.writable = true;
                    this.emitReserved("drain");
                });
            });
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "https" : "http";
            let port = "";
            // cache busting is forced
            if (false !== this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            if (!this.supportsBinary && !query.sid) {
                query.b64 = 1;
            }
            // avoid port if default for schema
            if (this.opts.port &&
                (("https" === schema && Number(this.opts.port) !== 443) ||
                    ("http" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */
        request(opts = {}) {
            Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
            return new Request(this.uri(), opts);
        }
        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */
        doWrite(data, fn) {
            const req = this.request({
                method: "POST",
                data: data
            });
            req.on("success", fn);
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr post error", xhrStatus, context);
            });
        }
        /**
         * Starts a poll cycle.
         *
         * @api private
         */
        doPoll() {
            const req = this.request();
            req.on("data", this.onData.bind(this));
            req.on("error", (xhrStatus, context) => {
                this.onError("xhr poll error", xhrStatus, context);
            });
            this.pollXhr = req;
        }
    }
    class Request extends Emitter {
        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */
        constructor(uri, opts) {
            super();
            installTimerFunctions(this, opts);
            this.opts = opts;
            this.method = opts.method || "GET";
            this.uri = uri;
            this.async = false !== opts.async;
            this.data = undefined !== opts.data ? opts.data : null;
            this.create();
        }
        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */
        create() {
            const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
            opts.xdomain = !!this.opts.xd;
            opts.xscheme = !!this.opts.xs;
            const xhr = (this.xhr = new XHR(opts));
            try {
                xhr.open(this.method, this.uri, this.async);
                try {
                    if (this.opts.extraHeaders) {
                        xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                        for (let i in this.opts.extraHeaders) {
                            if (this.opts.extraHeaders.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                            }
                        }
                    }
                }
                catch (e) { }
                if ("POST" === this.method) {
                    try {
                        xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                    }
                    catch (e) { }
                }
                try {
                    xhr.setRequestHeader("Accept", "*/*");
                }
                catch (e) { }
                // ie6 check
                if ("withCredentials" in xhr) {
                    xhr.withCredentials = this.opts.withCredentials;
                }
                if (this.opts.requestTimeout) {
                    xhr.timeout = this.opts.requestTimeout;
                }
                xhr.onreadystatechange = () => {
                    if (4 !== xhr.readyState)
                        return;
                    if (200 === xhr.status || 1223 === xhr.status) {
                        this.onLoad();
                    }
                    else {
                        // make sure the `error` event handler that's user-set
                        // does not throw in the same tick and gets caught here
                        this.setTimeoutFn(() => {
                            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                        }, 0);
                    }
                };
                xhr.send(this.data);
            }
            catch (e) {
                // Need to defer since .create() is called directly from the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                this.setTimeoutFn(() => {
                    this.onError(e);
                }, 0);
                return;
            }
            if (typeof document !== "undefined") {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        }
        /**
         * Called upon error.
         *
         * @api private
         */
        onError(err) {
            this.emitReserved("error", err, this.xhr);
            this.cleanup(true);
        }
        /**
         * Cleans up house.
         *
         * @api private
         */
        cleanup(fromError) {
            if ("undefined" === typeof this.xhr || null === this.xhr) {
                return;
            }
            this.xhr.onreadystatechange = empty;
            if (fromError) {
                try {
                    this.xhr.abort();
                }
                catch (e) { }
            }
            if (typeof document !== "undefined") {
                delete Request.requests[this.index];
            }
            this.xhr = null;
        }
        /**
         * Called upon load.
         *
         * @api private
         */
        onLoad() {
            const data = this.xhr.responseText;
            if (data !== null) {
                this.emitReserved("data", data);
                this.emitReserved("success");
                this.cleanup();
            }
        }
        /**
         * Aborts the request.
         *
         * @api public
         */
        abort() {
            this.cleanup();
        }
    }
    Request.requestsCount = 0;
    Request.requests = {};
    /**
     * Aborts pending requests when unloading the window. This is needed to prevent
     * memory leaks (e.g. when using IE) and to ensure that no spurious error is
     * emitted.
     */
    if (typeof document !== "undefined") {
        // @ts-ignore
        if (typeof attachEvent === "function") {
            // @ts-ignore
            attachEvent("onunload", unloadHandler);
        }
        else if (typeof addEventListener === "function") {
            const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
            addEventListener(terminationEvent, unloadHandler, false);
        }
    }
    function unloadHandler() {
        for (let i in Request.requests) {
            if (Request.requests.hasOwnProperty(i)) {
                Request.requests[i].abort();
            }
        }
    }

    const nextTick = (() => {
        const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
        if (isPromiseAvailable) {
            return cb => Promise.resolve().then(cb);
        }
        else {
            return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
        }
    })();
    const WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
    const usingBrowserWebSocket = true;
    const defaultBinaryType = "arraybuffer";

    // detect ReactNative environment
    const isReactNative = typeof navigator !== "undefined" &&
        typeof navigator.product === "string" &&
        navigator.product.toLowerCase() === "reactnative";
    class WS extends Transport {
        /**
         * WebSocket transport constructor.
         *
         * @api {Object} connection options
         * @api public
         */
        constructor(opts) {
            super(opts);
            this.supportsBinary = !opts.forceBase64;
        }
        /**
         * Transport name.
         *
         * @api public
         */
        get name() {
            return "websocket";
        }
        /**
         * Opens socket.
         *
         * @api private
         */
        doOpen() {
            if (!this.check()) {
                // let probe timeout
                return;
            }
            const uri = this.uri();
            const protocols = this.opts.protocols;
            // React Native only supports the 'headers' option, and will print a warning if anything else is passed
            const opts = isReactNative
                ? {}
                : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
            if (this.opts.extraHeaders) {
                opts.headers = this.opts.extraHeaders;
            }
            try {
                this.ws =
                    usingBrowserWebSocket && !isReactNative
                        ? protocols
                            ? new WebSocket(uri, protocols)
                            : new WebSocket(uri)
                        : new WebSocket(uri, protocols, opts);
            }
            catch (err) {
                return this.emitReserved("error", err);
            }
            this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
            this.addEventListeners();
        }
        /**
         * Adds event listeners to the socket
         *
         * @api private
         */
        addEventListeners() {
            this.ws.onopen = () => {
                if (this.opts.autoUnref) {
                    this.ws._socket.unref();
                }
                this.onOpen();
            };
            this.ws.onclose = closeEvent => this.onClose({
                description: "websocket connection closed",
                context: closeEvent
            });
            this.ws.onmessage = ev => this.onData(ev.data);
            this.ws.onerror = e => this.onError("websocket error", e);
        }
        /**
         * Writes data to socket.
         *
         * @param {Array} array of packets.
         * @api private
         */
        write(packets) {
            this.writable = false;
            // encodePacket efficient as it uses WS framing
            // no need for encodePayload
            for (let i = 0; i < packets.length; i++) {
                const packet = packets[i];
                const lastPacket = i === packets.length - 1;
                encodePacket(packet, this.supportsBinary, data => {
                    // always create a new object (GH-437)
                    const opts = {};
                    // Sometimes the websocket has already been closed but the browser didn't
                    // have a chance of informing us about it yet, in that case send will
                    // throw an error
                    try {
                        if (usingBrowserWebSocket) {
                            // TypeError is thrown when passing the second argument on Safari
                            this.ws.send(data);
                        }
                    }
                    catch (e) {
                    }
                    if (lastPacket) {
                        // fake drain
                        // defer to next tick to allow Socket to clear writeBuffer
                        nextTick(() => {
                            this.writable = true;
                            this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    }
                });
            }
        }
        /**
         * Closes socket.
         *
         * @api private
         */
        doClose() {
            if (typeof this.ws !== "undefined") {
                this.ws.close();
                this.ws = null;
            }
        }
        /**
         * Generates uri for connection.
         *
         * @api private
         */
        uri() {
            let query = this.query || {};
            const schema = this.opts.secure ? "wss" : "ws";
            let port = "";
            // avoid port if default for schema
            if (this.opts.port &&
                (("wss" === schema && Number(this.opts.port) !== 443) ||
                    ("ws" === schema && Number(this.opts.port) !== 80))) {
                port = ":" + this.opts.port;
            }
            // append timestamp to URI
            if (this.opts.timestampRequests) {
                query[this.opts.timestampParam] = yeast();
            }
            // communicate binary support capabilities
            if (!this.supportsBinary) {
                query.b64 = 1;
            }
            const encodedQuery = encode(query);
            const ipv6 = this.opts.hostname.indexOf(":") !== -1;
            return (schema +
                "://" +
                (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
                port +
                this.opts.path +
                (encodedQuery.length ? "?" + encodedQuery : ""));
        }
        /**
         * Feature detection for WebSocket.
         *
         * @return {Boolean} whether this transport is available.
         * @api public
         */
        check() {
            return !!WebSocket;
        }
    }

    const transports = {
        websocket: WS,
        polling: Polling
    };

    // imported from https://github.com/galkn/parseuri
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */
    const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
    const parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];
    function parse(str) {
        const src = str, b = str.indexOf('['), e = str.indexOf(']');
        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }
        let m = re.exec(str || ''), uri = {}, i = 14;
        while (i--) {
            uri[parts[i]] = m[i] || '';
        }
        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }
        uri.pathNames = pathNames(uri, uri['path']);
        uri.queryKey = queryKey(uri, uri['query']);
        return uri;
    }
    function pathNames(obj, path) {
        const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
        if (path.substr(0, 1) == '/' || path.length === 0) {
            names.splice(0, 1);
        }
        if (path.substr(path.length - 1, 1) == '/') {
            names.splice(names.length - 1, 1);
        }
        return names;
    }
    function queryKey(uri, query) {
        const data = {};
        query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
            if ($1) {
                data[$1] = $2;
            }
        });
        return data;
    }

    class Socket$1 extends Emitter {
        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} opts - options
         * @api public
         */
        constructor(uri, opts = {}) {
            super();
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = null;
            }
            if (uri) {
                uri = parse(uri);
                opts.hostname = uri.host;
                opts.secure = uri.protocol === "https" || uri.protocol === "wss";
                opts.port = uri.port;
                if (uri.query)
                    opts.query = uri.query;
            }
            else if (opts.host) {
                opts.hostname = parse(opts.host).host;
            }
            installTimerFunctions(this, opts);
            this.secure =
                null != opts.secure
                    ? opts.secure
                    : typeof location !== "undefined" && "https:" === location.protocol;
            if (opts.hostname && !opts.port) {
                // if no port is specified manually, use the protocol default
                opts.port = this.secure ? "443" : "80";
            }
            this.hostname =
                opts.hostname ||
                    (typeof location !== "undefined" ? location.hostname : "localhost");
            this.port =
                opts.port ||
                    (typeof location !== "undefined" && location.port
                        ? location.port
                        : this.secure
                            ? "443"
                            : "80");
            this.transports = opts.transports || ["polling", "websocket"];
            this.readyState = "";
            this.writeBuffer = [];
            this.prevBufferLen = 0;
            this.opts = Object.assign({
                path: "/engine.io",
                agent: false,
                withCredentials: false,
                upgrade: true,
                timestampParam: "t",
                rememberUpgrade: false,
                rejectUnauthorized: true,
                perMessageDeflate: {
                    threshold: 1024
                },
                transportOptions: {},
                closeOnBeforeunload: true
            }, opts);
            this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
            if (typeof this.opts.query === "string") {
                this.opts.query = decode(this.opts.query);
            }
            // set on handshake
            this.id = null;
            this.upgrades = null;
            this.pingInterval = null;
            this.pingTimeout = null;
            // set on heartbeat
            this.pingTimeoutTimer = null;
            if (typeof addEventListener === "function") {
                if (this.opts.closeOnBeforeunload) {
                    // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                    // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                    // closed/reloaded)
                    addEventListener("beforeunload", () => {
                        if (this.transport) {
                            // silently close the transport
                            this.transport.removeAllListeners();
                            this.transport.close();
                        }
                    }, false);
                }
                if (this.hostname !== "localhost") {
                    this.offlineEventListener = () => {
                        this.onClose("transport close", {
                            description: "network connection lost"
                        });
                    };
                    addEventListener("offline", this.offlineEventListener, false);
                }
            }
            this.open();
        }
        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */
        createTransport(name) {
            const query = Object.assign({}, this.opts.query);
            // append engine.io protocol identifier
            query.EIO = protocol$1;
            // transport name
            query.transport = name;
            // session id if we already have one
            if (this.id)
                query.sid = this.id;
            const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
                query,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
            });
            return new transports[name](opts);
        }
        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        open() {
            let transport;
            if (this.opts.rememberUpgrade &&
                Socket$1.priorWebsocketSuccess &&
                this.transports.indexOf("websocket") !== -1) {
                transport = "websocket";
            }
            else if (0 === this.transports.length) {
                // Emit error on next tick so it can be listened to
                this.setTimeoutFn(() => {
                    this.emitReserved("error", "No transports available");
                }, 0);
                return;
            }
            else {
                transport = this.transports[0];
            }
            this.readyState = "opening";
            // Retry with the next transport if the transport is disabled (jsonp: false)
            try {
                transport = this.createTransport(transport);
            }
            catch (e) {
                this.transports.shift();
                this.open();
                return;
            }
            transport.open();
            this.setTransport(transport);
        }
        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */
        setTransport(transport) {
            if (this.transport) {
                this.transport.removeAllListeners();
            }
            // set up transport
            this.transport = transport;
            // set up transport listeners
            transport
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", reason => this.onClose("transport close", reason));
        }
        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */
        probe(name) {
            let transport = this.createTransport(name);
            let failed = false;
            Socket$1.priorWebsocketSuccess = false;
            const onTransportOpen = () => {
                if (failed)
                    return;
                transport.send([{ type: "ping", data: "probe" }]);
                transport.once("packet", msg => {
                    if (failed)
                        return;
                    if ("pong" === msg.type && "probe" === msg.data) {
                        this.upgrading = true;
                        this.emitReserved("upgrading", transport);
                        if (!transport)
                            return;
                        Socket$1.priorWebsocketSuccess = "websocket" === transport.name;
                        this.transport.pause(() => {
                            if (failed)
                                return;
                            if ("closed" === this.readyState)
                                return;
                            cleanup();
                            this.setTransport(transport);
                            transport.send([{ type: "upgrade" }]);
                            this.emitReserved("upgrade", transport);
                            transport = null;
                            this.upgrading = false;
                            this.flush();
                        });
                    }
                    else {
                        const err = new Error("probe error");
                        // @ts-ignore
                        err.transport = transport.name;
                        this.emitReserved("upgradeError", err);
                    }
                });
            };
            function freezeTransport() {
                if (failed)
                    return;
                // Any callback called by transport should be ignored since now
                failed = true;
                cleanup();
                transport.close();
                transport = null;
            }
            // Handle any error that happens while probing
            const onerror = err => {
                const error = new Error("probe error: " + err);
                // @ts-ignore
                error.transport = transport.name;
                freezeTransport();
                this.emitReserved("upgradeError", error);
            };
            function onTransportClose() {
                onerror("transport closed");
            }
            // When the socket is closed while we're probing
            function onclose() {
                onerror("socket closed");
            }
            // When the socket is upgraded while we're probing
            function onupgrade(to) {
                if (transport && to.name !== transport.name) {
                    freezeTransport();
                }
            }
            // Remove all listeners on the transport and on self
            const cleanup = () => {
                transport.removeListener("open", onTransportOpen);
                transport.removeListener("error", onerror);
                transport.removeListener("close", onTransportClose);
                this.off("close", onclose);
                this.off("upgrading", onupgrade);
            };
            transport.once("open", onTransportOpen);
            transport.once("error", onerror);
            transport.once("close", onTransportClose);
            this.once("close", onclose);
            this.once("upgrading", onupgrade);
            transport.open();
        }
        /**
         * Called when connection is deemed open.
         *
         * @api private
         */
        onOpen() {
            this.readyState = "open";
            Socket$1.priorWebsocketSuccess = "websocket" === this.transport.name;
            this.emitReserved("open");
            this.flush();
            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ("open" === this.readyState &&
                this.opts.upgrade &&
                this.transport.pause) {
                let i = 0;
                const l = this.upgrades.length;
                for (; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        }
        /**
         * Handles a packet.
         *
         * @api private
         */
        onPacket(packet) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                this.emitReserved("packet", packet);
                // Socket is live - any packet counts
                this.emitReserved("heartbeat");
                switch (packet.type) {
                    case "open":
                        this.onHandshake(JSON.parse(packet.data));
                        break;
                    case "ping":
                        this.resetPingTimeout();
                        this.sendPacket("pong");
                        this.emitReserved("ping");
                        this.emitReserved("pong");
                        break;
                    case "error":
                        const err = new Error("server error");
                        // @ts-ignore
                        err.code = packet.data;
                        this.onError(err);
                        break;
                    case "message":
                        this.emitReserved("data", packet.data);
                        this.emitReserved("message", packet.data);
                        break;
                }
            }
        }
        /**
         * Called upon handshake completion.
         *
         * @param {Object} data - handshake obj
         * @api private
         */
        onHandshake(data) {
            this.emitReserved("handshake", data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.maxPayload = data.maxPayload;
            this.onOpen();
            // In case open handler closes socket
            if ("closed" === this.readyState)
                return;
            this.resetPingTimeout();
        }
        /**
         * Sets and resets ping timeout timer based on server pings.
         *
         * @api private
         */
        resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer);
            this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
            }, this.pingInterval + this.pingTimeout);
            if (this.opts.autoUnref) {
                this.pingTimeoutTimer.unref();
            }
        }
        /**
         * Called on `drain` event
         *
         * @api private
         */
        onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen);
            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;
            if (0 === this.writeBuffer.length) {
                this.emitReserved("drain");
            }
            else {
                this.flush();
            }
        }
        /**
         * Flush write buffers.
         *
         * @api private
         */
        flush() {
            if ("closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length) {
                const packets = this.getWritablePackets();
                this.transport.send(packets);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = packets.length;
                this.emitReserved("flush");
            }
        }
        /**
         * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
         * long-polling)
         *
         * @private
         */
        getWritablePackets() {
            const shouldCheckPayloadSize = this.maxPayload &&
                this.transport.name === "polling" &&
                this.writeBuffer.length > 1;
            if (!shouldCheckPayloadSize) {
                return this.writeBuffer;
            }
            let payloadSize = 1; // first packet type
            for (let i = 0; i < this.writeBuffer.length; i++) {
                const data = this.writeBuffer[i].data;
                if (data) {
                    payloadSize += byteLength(data);
                }
                if (i > 0 && payloadSize > this.maxPayload) {
                    return this.writeBuffer.slice(0, i);
                }
                payloadSize += 2; // separator + packet type
            }
            return this.writeBuffer;
        }
        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @param {Object} options.
         * @return {Socket} for chaining.
         * @api public
         */
        write(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        send(msg, options, fn) {
            this.sendPacket("message", msg, options, fn);
            return this;
        }
        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Object} options.
         * @param {Function} callback function.
         * @api private
         */
        sendPacket(type, data, options, fn) {
            if ("function" === typeof data) {
                fn = data;
                data = undefined;
            }
            if ("function" === typeof options) {
                fn = options;
                options = null;
            }
            if ("closing" === this.readyState || "closed" === this.readyState) {
                return;
            }
            options = options || {};
            options.compress = false !== options.compress;
            const packet = {
                type: type,
                data: data,
                options: options
            };
            this.emitReserved("packetCreate", packet);
            this.writeBuffer.push(packet);
            if (fn)
                this.once("flush", fn);
            this.flush();
        }
        /**
         * Closes the connection.
         *
         * @api public
         */
        close() {
            const close = () => {
                this.onClose("forced close");
                this.transport.close();
            };
            const cleanupAndClose = () => {
                this.off("upgrade", cleanupAndClose);
                this.off("upgradeError", cleanupAndClose);
                close();
            };
            const waitForUpgrade = () => {
                // wait for upgrade to finish since we can't send packets while pausing a transport
                this.once("upgrade", cleanupAndClose);
                this.once("upgradeError", cleanupAndClose);
            };
            if ("opening" === this.readyState || "open" === this.readyState) {
                this.readyState = "closing";
                if (this.writeBuffer.length) {
                    this.once("drain", () => {
                        if (this.upgrading) {
                            waitForUpgrade();
                        }
                        else {
                            close();
                        }
                    });
                }
                else if (this.upgrading) {
                    waitForUpgrade();
                }
                else {
                    close();
                }
            }
            return this;
        }
        /**
         * Called upon transport error
         *
         * @api private
         */
        onError(err) {
            Socket$1.priorWebsocketSuccess = false;
            this.emitReserved("error", err);
            this.onClose("transport error", err);
        }
        /**
         * Called upon transport close.
         *
         * @api private
         */
        onClose(reason, description) {
            if ("opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState) {
                // clear timers
                this.clearTimeoutFn(this.pingTimeoutTimer);
                // stop event from firing again for transport
                this.transport.removeAllListeners("close");
                // ensure transport won't stay open
                this.transport.close();
                // ignore further transport communication
                this.transport.removeAllListeners();
                if (typeof removeEventListener === "function") {
                    removeEventListener("offline", this.offlineEventListener, false);
                }
                // set ready state
                this.readyState = "closed";
                // clear session id
                this.id = null;
                // emit close event
                this.emitReserved("close", reason, description);
                // clean buffers after, so users can still
                // grab the buffers on `close` event
                this.writeBuffer = [];
                this.prevBufferLen = 0;
            }
        }
        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */
        filterUpgrades(upgrades) {
            const filteredUpgrades = [];
            let i = 0;
            const j = upgrades.length;
            for (; i < j; i++) {
                if (~this.transports.indexOf(upgrades[i]))
                    filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        }
    }
    Socket$1.protocol = protocol$1;

    /**
     * URL parser.
     *
     * @param uri - url
     * @param path - the request path of the connection
     * @param loc - An object meant to mimic window.location.
     *        Defaults to window.location.
     * @public
     */
    function url(uri, path = "", loc) {
        let obj = uri;
        // default to window.location
        loc = loc || (typeof location !== "undefined" && location);
        if (null == uri)
            uri = loc.protocol + "//" + loc.host;
        // relative path support
        if (typeof uri === "string") {
            if ("/" === uri.charAt(0)) {
                if ("/" === uri.charAt(1)) {
                    uri = loc.protocol + uri;
                }
                else {
                    uri = loc.host + uri;
                }
            }
            if (!/^(https?|wss?):\/\//.test(uri)) {
                if ("undefined" !== typeof loc) {
                    uri = loc.protocol + "//" + uri;
                }
                else {
                    uri = "https://" + uri;
                }
            }
            // parse
            obj = parse(uri);
        }
        // make sure we treat `localhost:80` and `localhost` equally
        if (!obj.port) {
            if (/^(http|ws)$/.test(obj.protocol)) {
                obj.port = "80";
            }
            else if (/^(http|ws)s$/.test(obj.protocol)) {
                obj.port = "443";
            }
        }
        obj.path = obj.path || "/";
        const ipv6 = obj.host.indexOf(":") !== -1;
        const host = ipv6 ? "[" + obj.host + "]" : obj.host;
        // define unique id
        obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
        // define href
        obj.href =
            obj.protocol +
                "://" +
                host +
                (loc && loc.port === obj.port ? "" : ":" + obj.port);
        return obj;
    }

    const withNativeArrayBuffer = typeof ArrayBuffer === "function";
    const isView = (obj) => {
        return typeof ArrayBuffer.isView === "function"
            ? ArrayBuffer.isView(obj)
            : obj.buffer instanceof ArrayBuffer;
    };
    const toString = Object.prototype.toString;
    const withNativeBlob = typeof Blob === "function" ||
        (typeof Blob !== "undefined" &&
            toString.call(Blob) === "[object BlobConstructor]");
    const withNativeFile = typeof File === "function" ||
        (typeof File !== "undefined" &&
            toString.call(File) === "[object FileConstructor]");
    /**
     * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
     *
     * @private
     */
    function isBinary(obj) {
        return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
            (withNativeBlob && obj instanceof Blob) ||
            (withNativeFile && obj instanceof File));
    }
    function hasBinary(obj, toJSON) {
        if (!obj || typeof obj !== "object") {
            return false;
        }
        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                if (hasBinary(obj[i])) {
                    return true;
                }
            }
            return false;
        }
        if (isBinary(obj)) {
            return true;
        }
        if (obj.toJSON &&
            typeof obj.toJSON === "function" &&
            arguments.length === 1) {
            return hasBinary(obj.toJSON(), true);
        }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
     *
     * @param {Object} packet - socket.io event packet
     * @return {Object} with deconstructed packet and list of buffers
     * @public
     */
    function deconstructPacket(packet) {
        const buffers = [];
        const packetData = packet.data;
        const pack = packet;
        pack.data = _deconstructPacket(packetData, buffers);
        pack.attachments = buffers.length; // number of binary 'attachments'
        return { packet: pack, buffers: buffers };
    }
    function _deconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (isBinary(data)) {
            const placeholder = { _placeholder: true, num: buffers.length };
            buffers.push(data);
            return placeholder;
        }
        else if (Array.isArray(data)) {
            const newData = new Array(data.length);
            for (let i = 0; i < data.length; i++) {
                newData[i] = _deconstructPacket(data[i], buffers);
            }
            return newData;
        }
        else if (typeof data === "object" && !(data instanceof Date)) {
            const newData = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    newData[key] = _deconstructPacket(data[key], buffers);
                }
            }
            return newData;
        }
        return data;
    }
    /**
     * Reconstructs a binary packet from its placeholder packet and buffers
     *
     * @param {Object} packet - event packet with placeholders
     * @param {Array} buffers - binary buffers to put in placeholder positions
     * @return {Object} reconstructed packet
     * @public
     */
    function reconstructPacket(packet, buffers) {
        packet.data = _reconstructPacket(packet.data, buffers);
        packet.attachments = undefined; // no longer useful
        return packet;
    }
    function _reconstructPacket(data, buffers) {
        if (!data)
            return data;
        if (data && data._placeholder === true) {
            const isIndexValid = typeof data.num === "number" &&
                data.num >= 0 &&
                data.num < buffers.length;
            if (isIndexValid) {
                return buffers[data.num]; // appropriate buffer (should be natural order anyway)
            }
            else {
                throw new Error("illegal attachments");
            }
        }
        else if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                data[i] = _reconstructPacket(data[i], buffers);
            }
        }
        else if (typeof data === "object") {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    data[key] = _reconstructPacket(data[key], buffers);
                }
            }
        }
        return data;
    }

    /**
     * Protocol version.
     *
     * @public
     */
    const protocol = 5;
    var PacketType;
    (function (PacketType) {
        PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
        PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
        PacketType[PacketType["EVENT"] = 2] = "EVENT";
        PacketType[PacketType["ACK"] = 3] = "ACK";
        PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
        PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
        PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
    })(PacketType || (PacketType = {}));
    /**
     * A socket.io Encoder instance
     */
    class Encoder {
        /**
         * Encoder constructor
         *
         * @param {function} replacer - custom replacer to pass down to JSON.parse
         */
        constructor(replacer) {
            this.replacer = replacer;
        }
        /**
         * Encode a packet as a single string if non-binary, or as a
         * buffer sequence, depending on packet type.
         *
         * @param {Object} obj - packet object
         */
        encode(obj) {
            if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
                if (hasBinary(obj)) {
                    obj.type =
                        obj.type === PacketType.EVENT
                            ? PacketType.BINARY_EVENT
                            : PacketType.BINARY_ACK;
                    return this.encodeAsBinary(obj);
                }
            }
            return [this.encodeAsString(obj)];
        }
        /**
         * Encode packet as string.
         */
        encodeAsString(obj) {
            // first is type
            let str = "" + obj.type;
            // attachments if we have them
            if (obj.type === PacketType.BINARY_EVENT ||
                obj.type === PacketType.BINARY_ACK) {
                str += obj.attachments + "-";
            }
            // if we have a namespace other than `/`
            // we append it followed by a comma `,`
            if (obj.nsp && "/" !== obj.nsp) {
                str += obj.nsp + ",";
            }
            // immediately followed by the id
            if (null != obj.id) {
                str += obj.id;
            }
            // json data
            if (null != obj.data) {
                str += JSON.stringify(obj.data, this.replacer);
            }
            return str;
        }
        /**
         * Encode packet as 'buffer sequence' by removing blobs, and
         * deconstructing packet into object with placeholders and
         * a list of buffers.
         */
        encodeAsBinary(obj) {
            const deconstruction = deconstructPacket(obj);
            const pack = this.encodeAsString(deconstruction.packet);
            const buffers = deconstruction.buffers;
            buffers.unshift(pack); // add packet info to beginning of data list
            return buffers; // write all the buffers
        }
    }
    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     */
    class Decoder extends Emitter {
        /**
         * Decoder constructor
         *
         * @param {function} reviver - custom reviver to pass down to JSON.stringify
         */
        constructor(reviver) {
            super();
            this.reviver = reviver;
        }
        /**
         * Decodes an encoded packet string into packet JSON.
         *
         * @param {String} obj - encoded packet
         */
        add(obj) {
            let packet;
            if (typeof obj === "string") {
                if (this.reconstructor) {
                    throw new Error("got plaintext data when reconstructing a packet");
                }
                packet = this.decodeString(obj);
                if (packet.type === PacketType.BINARY_EVENT ||
                    packet.type === PacketType.BINARY_ACK) {
                    // binary packet's json
                    this.reconstructor = new BinaryReconstructor(packet);
                    // no attachments, labeled binary but no binary data to follow
                    if (packet.attachments === 0) {
                        super.emitReserved("decoded", packet);
                    }
                }
                else {
                    // non-binary full packet
                    super.emitReserved("decoded", packet);
                }
            }
            else if (isBinary(obj) || obj.base64) {
                // raw binary data
                if (!this.reconstructor) {
                    throw new Error("got binary data when not reconstructing a packet");
                }
                else {
                    packet = this.reconstructor.takeBinaryData(obj);
                    if (packet) {
                        // received final buffer
                        this.reconstructor = null;
                        super.emitReserved("decoded", packet);
                    }
                }
            }
            else {
                throw new Error("Unknown type: " + obj);
            }
        }
        /**
         * Decode a packet String (JSON data)
         *
         * @param {String} str
         * @return {Object} packet
         */
        decodeString(str) {
            let i = 0;
            // look up type
            const p = {
                type: Number(str.charAt(0)),
            };
            if (PacketType[p.type] === undefined) {
                throw new Error("unknown packet type " + p.type);
            }
            // look up attachments if type binary
            if (p.type === PacketType.BINARY_EVENT ||
                p.type === PacketType.BINARY_ACK) {
                const start = i + 1;
                while (str.charAt(++i) !== "-" && i != str.length) { }
                const buf = str.substring(start, i);
                if (buf != Number(buf) || str.charAt(i) !== "-") {
                    throw new Error("Illegal attachments");
                }
                p.attachments = Number(buf);
            }
            // look up namespace (if any)
            if ("/" === str.charAt(i + 1)) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if ("," === c)
                        break;
                    if (i === str.length)
                        break;
                }
                p.nsp = str.substring(start, i);
            }
            else {
                p.nsp = "/";
            }
            // look up id
            const next = str.charAt(i + 1);
            if ("" !== next && Number(next) == next) {
                const start = i + 1;
                while (++i) {
                    const c = str.charAt(i);
                    if (null == c || Number(c) != c) {
                        --i;
                        break;
                    }
                    if (i === str.length)
                        break;
                }
                p.id = Number(str.substring(start, i + 1));
            }
            // look up json data
            if (str.charAt(++i)) {
                const payload = this.tryParse(str.substr(i));
                if (Decoder.isPayloadValid(p.type, payload)) {
                    p.data = payload;
                }
                else {
                    throw new Error("invalid payload");
                }
            }
            return p;
        }
        tryParse(str) {
            try {
                return JSON.parse(str, this.reviver);
            }
            catch (e) {
                return false;
            }
        }
        static isPayloadValid(type, payload) {
            switch (type) {
                case PacketType.CONNECT:
                    return typeof payload === "object";
                case PacketType.DISCONNECT:
                    return payload === undefined;
                case PacketType.CONNECT_ERROR:
                    return typeof payload === "string" || typeof payload === "object";
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    return Array.isArray(payload) && payload.length > 0;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    return Array.isArray(payload);
            }
        }
        /**
         * Deallocates a parser's resources
         */
        destroy() {
            if (this.reconstructor) {
                this.reconstructor.finishedReconstruction();
            }
        }
    }
    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     */
    class BinaryReconstructor {
        constructor(packet) {
            this.packet = packet;
            this.buffers = [];
            this.reconPack = packet;
        }
        /**
         * Method to be called when binary data received from connection
         * after a BINARY_EVENT packet.
         *
         * @param {Buffer | ArrayBuffer} binData - the raw binary data received
         * @return {null | Object} returns null if more binary data is expected or
         *   a reconstructed packet object if all buffers have been received.
         */
        takeBinaryData(binData) {
            this.buffers.push(binData);
            if (this.buffers.length === this.reconPack.attachments) {
                // done with buffer list
                const packet = reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
            }
            return null;
        }
        /**
         * Cleans up binary packet reconstruction variables.
         */
        finishedReconstruction() {
            this.reconPack = null;
            this.buffers = [];
        }
    }

    var parser = /*#__PURE__*/Object.freeze({
        __proto__: null,
        protocol: protocol,
        get PacketType () { return PacketType; },
        Encoder: Encoder,
        Decoder: Decoder
    });

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return function subDestroy() {
            obj.off(ev, fn);
        };
    }

    /**
     * Internal events.
     * These events can't be emitted by the user.
     */
    const RESERVED_EVENTS = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
        newListener: 1,
        removeListener: 1,
    });
    class Socket extends Emitter {
        /**
         * `Socket` constructor.
         *
         * @public
         */
        constructor(io, nsp, opts) {
            super();
            this.connected = false;
            this.receiveBuffer = [];
            this.sendBuffer = [];
            this.ids = 0;
            this.acks = {};
            this.flags = {};
            this.io = io;
            this.nsp = nsp;
            if (opts && opts.auth) {
                this.auth = opts.auth;
            }
            if (this.io._autoConnect)
                this.open();
        }
        /**
         * Whether the socket is currently disconnected
         */
        get disconnected() {
            return !this.connected;
        }
        /**
         * Subscribe to open, close and packet events
         *
         * @private
         */
        subEvents() {
            if (this.subs)
                return;
            const io = this.io;
            this.subs = [
                on(io, "open", this.onopen.bind(this)),
                on(io, "packet", this.onpacket.bind(this)),
                on(io, "error", this.onerror.bind(this)),
                on(io, "close", this.onclose.bind(this)),
            ];
        }
        /**
         * Whether the Socket will try to reconnect when its Manager connects or reconnects
         */
        get active() {
            return !!this.subs;
        }
        /**
         * "Opens" the socket.
         *
         * @public
         */
        connect() {
            if (this.connected)
                return this;
            this.subEvents();
            if (!this.io["_reconnecting"])
                this.io.open(); // ensure open
            if ("open" === this.io._readyState)
                this.onopen();
            return this;
        }
        /**
         * Alias for connect()
         */
        open() {
            return this.connect();
        }
        /**
         * Sends a `message` event.
         *
         * @return self
         * @public
         */
        send(...args) {
            args.unshift("message");
            this.emit.apply(this, args);
            return this;
        }
        /**
         * Override `emit`.
         * If the event is in `events`, it's emitted normally.
         *
         * @return self
         * @public
         */
        emit(ev, ...args) {
            if (RESERVED_EVENTS.hasOwnProperty(ev)) {
                throw new Error('"' + ev + '" is a reserved event name');
            }
            args.unshift(ev);
            const packet = {
                type: PacketType.EVENT,
                data: args,
            };
            packet.options = {};
            packet.options.compress = this.flags.compress !== false;
            // event ack callback
            if ("function" === typeof args[args.length - 1]) {
                const id = this.ids++;
                const ack = args.pop();
                this._registerAckCallback(id, ack);
                packet.id = id;
            }
            const isTransportWritable = this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable;
            const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
            if (discardPacket) ;
            else if (this.connected) {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            }
            else {
                this.sendBuffer.push(packet);
            }
            this.flags = {};
            return this;
        }
        /**
         * @private
         */
        _registerAckCallback(id, ack) {
            const timeout = this.flags.timeout;
            if (timeout === undefined) {
                this.acks[id] = ack;
                return;
            }
            // @ts-ignore
            const timer = this.io.setTimeoutFn(() => {
                delete this.acks[id];
                for (let i = 0; i < this.sendBuffer.length; i++) {
                    if (this.sendBuffer[i].id === id) {
                        this.sendBuffer.splice(i, 1);
                    }
                }
                ack.call(this, new Error("operation has timed out"));
            }, timeout);
            this.acks[id] = (...args) => {
                // @ts-ignore
                this.io.clearTimeoutFn(timer);
                ack.apply(this, [null, ...args]);
            };
        }
        /**
         * Sends a packet.
         *
         * @param packet
         * @private
         */
        packet(packet) {
            packet.nsp = this.nsp;
            this.io._packet(packet);
        }
        /**
         * Called upon engine `open`.
         *
         * @private
         */
        onopen() {
            if (typeof this.auth == "function") {
                this.auth((data) => {
                    this.packet({ type: PacketType.CONNECT, data });
                });
            }
            else {
                this.packet({ type: PacketType.CONNECT, data: this.auth });
            }
        }
        /**
         * Called upon engine or manager `error`.
         *
         * @param err
         * @private
         */
        onerror(err) {
            if (!this.connected) {
                this.emitReserved("connect_error", err);
            }
        }
        /**
         * Called upon engine `close`.
         *
         * @param reason
         * @param description
         * @private
         */
        onclose(reason, description) {
            this.connected = false;
            delete this.id;
            this.emitReserved("disconnect", reason, description);
        }
        /**
         * Called with socket packet.
         *
         * @param packet
         * @private
         */
        onpacket(packet) {
            const sameNamespace = packet.nsp === this.nsp;
            if (!sameNamespace)
                return;
            switch (packet.type) {
                case PacketType.CONNECT:
                    if (packet.data && packet.data.sid) {
                        const id = packet.data.sid;
                        this.onconnect(id);
                    }
                    else {
                        this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                    }
                    break;
                case PacketType.EVENT:
                case PacketType.BINARY_EVENT:
                    this.onevent(packet);
                    break;
                case PacketType.ACK:
                case PacketType.BINARY_ACK:
                    this.onack(packet);
                    break;
                case PacketType.DISCONNECT:
                    this.ondisconnect();
                    break;
                case PacketType.CONNECT_ERROR:
                    this.destroy();
                    const err = new Error(packet.data.message);
                    // @ts-ignore
                    err.data = packet.data.data;
                    this.emitReserved("connect_error", err);
                    break;
            }
        }
        /**
         * Called upon a server event.
         *
         * @param packet
         * @private
         */
        onevent(packet) {
            const args = packet.data || [];
            if (null != packet.id) {
                args.push(this.ack(packet.id));
            }
            if (this.connected) {
                this.emitEvent(args);
            }
            else {
                this.receiveBuffer.push(Object.freeze(args));
            }
        }
        emitEvent(args) {
            if (this._anyListeners && this._anyListeners.length) {
                const listeners = this._anyListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, args);
                }
            }
            super.emit.apply(this, args);
        }
        /**
         * Produces an ack callback to emit with an event.
         *
         * @private
         */
        ack(id) {
            const self = this;
            let sent = false;
            return function (...args) {
                // prevent double callbacks
                if (sent)
                    return;
                sent = true;
                self.packet({
                    type: PacketType.ACK,
                    id: id,
                    data: args,
                });
            };
        }
        /**
         * Called upon a server acknowlegement.
         *
         * @param packet
         * @private
         */
        onack(packet) {
            const ack = this.acks[packet.id];
            if ("function" === typeof ack) {
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
            }
        }
        /**
         * Called upon server connect.
         *
         * @private
         */
        onconnect(id) {
            this.id = id;
            this.connected = true;
            this.emitBuffered();
            this.emitReserved("connect");
        }
        /**
         * Emit buffered events (received and emitted).
         *
         * @private
         */
        emitBuffered() {
            this.receiveBuffer.forEach((args) => this.emitEvent(args));
            this.receiveBuffer = [];
            this.sendBuffer.forEach((packet) => {
                this.notifyOutgoingListeners(packet);
                this.packet(packet);
            });
            this.sendBuffer = [];
        }
        /**
         * Called upon server disconnect.
         *
         * @private
         */
        ondisconnect() {
            this.destroy();
            this.onclose("io server disconnect");
        }
        /**
         * Called upon forced client/server side disconnections,
         * this method ensures the manager stops tracking us and
         * that reconnections don't get triggered for this.
         *
         * @private
         */
        destroy() {
            if (this.subs) {
                // clean subscriptions to avoid reconnections
                this.subs.forEach((subDestroy) => subDestroy());
                this.subs = undefined;
            }
            this.io["_destroy"](this);
        }
        /**
         * Disconnects the socket manually.
         *
         * @return self
         * @public
         */
        disconnect() {
            if (this.connected) {
                this.packet({ type: PacketType.DISCONNECT });
            }
            // remove socket from pool
            this.destroy();
            if (this.connected) {
                // fire events
                this.onclose("io client disconnect");
            }
            return this;
        }
        /**
         * Alias for disconnect()
         *
         * @return self
         * @public
         */
        close() {
            return this.disconnect();
        }
        /**
         * Sets the compress flag.
         *
         * @param compress - if `true`, compresses the sending data
         * @return self
         * @public
         */
        compress(compress) {
            this.flags.compress = compress;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
         * ready to send messages.
         *
         * @returns self
         * @public
         */
        get volatile() {
            this.flags.volatile = true;
            return this;
        }
        /**
         * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
         * given number of milliseconds have elapsed without an acknowledgement from the server:
         *
         * ```
         * socket.timeout(5000).emit("my-event", (err) => {
         *   if (err) {
         *     // the server did not acknowledge the event in the given delay
         *   }
         * });
         * ```
         *
         * @returns self
         * @public
         */
        timeout(timeout) {
            this.flags.timeout = timeout;
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @param listener
         * @public
         */
        onAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @param listener
         * @public
         */
        prependAny(listener) {
            this._anyListeners = this._anyListeners || [];
            this._anyListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @param listener
         * @public
         */
        offAny(listener) {
            if (!this._anyListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         *
         * @public
         */
        listenersAny() {
            return this._anyListeners || [];
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback.
         *
         * @param listener
         *
         * <pre><code>
         *
         * socket.onAnyOutgoing((event, ...args) => {
         *   console.log(event);
         * });
         *
         * </pre></code>
         *
         * @public
         */
        onAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.push(listener);
            return this;
        }
        /**
         * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
         * callback. The listener is added to the beginning of the listeners array.
         *
         * @param listener
         *
         * <pre><code>
         *
         * socket.prependAnyOutgoing((event, ...args) => {
         *   console.log(event);
         * });
         *
         * </pre></code>
         *
         * @public
         */
        prependAnyOutgoing(listener) {
            this._anyOutgoingListeners = this._anyOutgoingListeners || [];
            this._anyOutgoingListeners.unshift(listener);
            return this;
        }
        /**
         * Removes the listener that will be fired when any event is emitted.
         *
         * @param listener
         *
         * <pre><code>
         *
         * const handler = (event, ...args) => {
         *   console.log(event);
         * }
         *
         * socket.onAnyOutgoing(handler);
         *
         * // then later
         * socket.offAnyOutgoing(handler);
         *
         * </pre></code>
         *
         * @public
         */
        offAnyOutgoing(listener) {
            if (!this._anyOutgoingListeners) {
                return this;
            }
            if (listener) {
                const listeners = this._anyOutgoingListeners;
                for (let i = 0; i < listeners.length; i++) {
                    if (listener === listeners[i]) {
                        listeners.splice(i, 1);
                        return this;
                    }
                }
            }
            else {
                this._anyOutgoingListeners = [];
            }
            return this;
        }
        /**
         * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
         * e.g. to remove listeners.
         *
         * @public
         */
        listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
        }
        /**
         * Notify the listeners for each packet sent
         *
         * @param packet
         *
         * @private
         */
        notifyOutgoingListeners(packet) {
            if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
                const listeners = this._anyOutgoingListeners.slice();
                for (const listener of listeners) {
                    listener.apply(this, packet.data);
                }
            }
        }
    }

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */
    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }
    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */
    Backoff.prototype.duration = function () {
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand = Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };
    /**
     * Reset the number of attempts.
     *
     * @api public
     */
    Backoff.prototype.reset = function () {
        this.attempts = 0;
    };
    /**
     * Set the minimum duration
     *
     * @api public
     */
    Backoff.prototype.setMin = function (min) {
        this.ms = min;
    };
    /**
     * Set the maximum duration
     *
     * @api public
     */
    Backoff.prototype.setMax = function (max) {
        this.max = max;
    };
    /**
     * Set the jitter
     *
     * @api public
     */
    Backoff.prototype.setJitter = function (jitter) {
        this.jitter = jitter;
    };

    class Manager extends Emitter {
        constructor(uri, opts) {
            var _a;
            super();
            this.nsps = {};
            this.subs = [];
            if (uri && "object" === typeof uri) {
                opts = uri;
                uri = undefined;
            }
            opts = opts || {};
            opts.path = opts.path || "/socket.io";
            this.opts = opts;
            installTimerFunctions(this, opts);
            this.reconnection(opts.reconnection !== false);
            this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
            this.reconnectionDelay(opts.reconnectionDelay || 1000);
            this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
            this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
            this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
            });
            this.timeout(null == opts.timeout ? 20000 : opts.timeout);
            this._readyState = "closed";
            this.uri = uri;
            const _parser = opts.parser || parser;
            this.encoder = new _parser.Encoder();
            this.decoder = new _parser.Decoder();
            this._autoConnect = opts.autoConnect !== false;
            if (this._autoConnect)
                this.open();
        }
        reconnection(v) {
            if (!arguments.length)
                return this._reconnection;
            this._reconnection = !!v;
            return this;
        }
        reconnectionAttempts(v) {
            if (v === undefined)
                return this._reconnectionAttempts;
            this._reconnectionAttempts = v;
            return this;
        }
        reconnectionDelay(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelay;
            this._reconnectionDelay = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
            return this;
        }
        randomizationFactor(v) {
            var _a;
            if (v === undefined)
                return this._randomizationFactor;
            this._randomizationFactor = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
            return this;
        }
        reconnectionDelayMax(v) {
            var _a;
            if (v === undefined)
                return this._reconnectionDelayMax;
            this._reconnectionDelayMax = v;
            (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
            return this;
        }
        timeout(v) {
            if (!arguments.length)
                return this._timeout;
            this._timeout = v;
            return this;
        }
        /**
         * Starts trying to reconnect if reconnection is enabled and we have not
         * started reconnecting yet
         *
         * @private
         */
        maybeReconnectOnOpen() {
            // Only try to reconnect if it's the first time we're connecting
            if (!this._reconnecting &&
                this._reconnection &&
                this.backoff.attempts === 0) {
                // keeps reconnection from firing twice for the same reconnection loop
                this.reconnect();
            }
        }
        /**
         * Sets the current transport `socket`.
         *
         * @param {Function} fn - optional, callback
         * @return self
         * @public
         */
        open(fn) {
            if (~this._readyState.indexOf("open"))
                return this;
            this.engine = new Socket$1(this.uri, this.opts);
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                self.onopen();
                fn && fn();
            });
            // emit `error`
            const errorSub = on(socket, "error", (err) => {
                self.cleanup();
                self._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });
            if (false !== this._timeout) {
                const timeout = this._timeout;
                if (timeout === 0) {
                    openSubDestroy(); // prevents a race condition with the 'open' event
                }
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    socket.close();
                    // @ts-ignore
                    socket.emit("error", new Error("timeout"));
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            return this;
        }
        /**
         * Alias for open()
         *
         * @return self
         * @public
         */
        connect(fn) {
            return this.open(fn);
        }
        /**
         * Called upon transport open.
         *
         * @private
         */
        onopen() {
            // clear old subs
            this.cleanup();
            // mark as open
            this._readyState = "open";
            this.emitReserved("open");
            // add new subs
            const socket = this.engine;
            this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
        }
        /**
         * Called upon a ping.
         *
         * @private
         */
        onping() {
            this.emitReserved("ping");
        }
        /**
         * Called with data.
         *
         * @private
         */
        ondata(data) {
            this.decoder.add(data);
        }
        /**
         * Called when parser fully decodes a packet.
         *
         * @private
         */
        ondecoded(packet) {
            this.emitReserved("packet", packet);
        }
        /**
         * Called upon socket error.
         *
         * @private
         */
        onerror(err) {
            this.emitReserved("error", err);
        }
        /**
         * Creates a new socket for the given `nsp`.
         *
         * @return {Socket}
         * @public
         */
        socket(nsp, opts) {
            let socket = this.nsps[nsp];
            if (!socket) {
                socket = new Socket(this, nsp, opts);
                this.nsps[nsp] = socket;
            }
            return socket;
        }
        /**
         * Called upon a socket close.
         *
         * @param socket
         * @private
         */
        _destroy(socket) {
            const nsps = Object.keys(this.nsps);
            for (const nsp of nsps) {
                const socket = this.nsps[nsp];
                if (socket.active) {
                    return;
                }
            }
            this._close();
        }
        /**
         * Writes a packet.
         *
         * @param packet
         * @private
         */
        _packet(packet) {
            const encodedPackets = this.encoder.encode(packet);
            for (let i = 0; i < encodedPackets.length; i++) {
                this.engine.write(encodedPackets[i], packet.options);
            }
        }
        /**
         * Clean up transport subscriptions and packet buffer.
         *
         * @private
         */
        cleanup() {
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs.length = 0;
            this.decoder.destroy();
        }
        /**
         * Close the current socket.
         *
         * @private
         */
        _close() {
            this.skipReconnect = true;
            this._reconnecting = false;
            this.onclose("forced close");
            if (this.engine)
                this.engine.close();
        }
        /**
         * Alias for close()
         *
         * @private
         */
        disconnect() {
            return this._close();
        }
        /**
         * Called upon engine close.
         *
         * @private
         */
        onclose(reason, description) {
            this.cleanup();
            this.backoff.reset();
            this._readyState = "closed";
            this.emitReserved("close", reason, description);
            if (this._reconnection && !this.skipReconnect) {
                this.reconnect();
            }
        }
        /**
         * Attempt a reconnection.
         *
         * @private
         */
        reconnect() {
            if (this._reconnecting || this.skipReconnect)
                return this;
            const self = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) {
                this.backoff.reset();
                this.emitReserved("reconnect_failed");
                this._reconnecting = false;
            }
            else {
                const delay = this.backoff.duration();
                this._reconnecting = true;
                const timer = this.setTimeoutFn(() => {
                    if (self.skipReconnect)
                        return;
                    this.emitReserved("reconnect_attempt", self.backoff.attempts);
                    // check again for the case socket closed in above events
                    if (self.skipReconnect)
                        return;
                    self.open((err) => {
                        if (err) {
                            self._reconnecting = false;
                            self.reconnect();
                            this.emitReserved("reconnect_error", err);
                        }
                        else {
                            self.onreconnect();
                        }
                    });
                }, delay);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(function subDestroy() {
                    clearTimeout(timer);
                });
            }
        }
        /**
         * Called upon successful reconnect.
         *
         * @private
         */
        onreconnect() {
            const attempt = this.backoff.attempts;
            this._reconnecting = false;
            this.backoff.reset();
            this.emitReserved("reconnect", attempt);
        }
    }

    /**
     * Managers cache.
     */
    const cache = {};
    function lookup(uri, opts) {
        if (typeof uri === "object") {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        const parsed = url(uri, opts.path || "/socket.io");
        const source = parsed.source;
        const id = parsed.id;
        const path = parsed.path;
        const sameNamespace = cache[id] && path in cache[id]["nsps"];
        const newConnection = opts.forceNew ||
            opts["force new connection"] ||
            false === opts.multiplex ||
            sameNamespace;
        let io;
        if (newConnection) {
            io = new Manager(source, opts);
        }
        else {
            if (!cache[id]) {
                cache[id] = new Manager(source, opts);
            }
            io = cache[id];
        }
        if (parsed.query && !opts.query) {
            opts.query = parsed.queryKey;
        }
        return io.socket(parsed.path, opts);
    }
    // so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
    // namespace (e.g. `io.connect(...)`), for backward compatibility
    Object.assign(lookup, {
        Manager,
        Socket,
        io: lookup,
        connect: lookup,
    });

    /* src/Components/Landing/About.svelte generated by Svelte v3.49.0 */

    const file$f = "src/Components/Landing/About.svelte";

    function create_fragment$h(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "About us !";
    			attr_dev(div, "class", "About");
    			add_location(div, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src/Components/Landing/Home.svelte generated by Svelte v3.49.0 */

    const file$e = "src/Components/Landing/Home.svelte";

    function create_fragment$g(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Welcome to our website !";
    			attr_dev(div, "class", "Home");
    			add_location(div, file$e, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src/Components/Landing/Register.svelte generated by Svelte v3.49.0 */
    const file$d = "src/Components/Landing/Register.svelte";

    function create_fragment$f(ctx) {
    	let div;
    	let form;
    	let h2;
    	let t1;
    	let a;
    	let t3;
    	let input0;
    	let t4;
    	let html_tag;
    	let t5;
    	let input1;
    	let t6;
    	let html_tag_1;
    	let t7;
    	let input2;
    	let t8;
    	let html_tag_2;
    	let t9;
    	let input3;
    	let t10;
    	let html_tag_3;
    	let t11;
    	let button;
    	let t13;
    	let h3;
    	let t14;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			h2 = element("h2");
    			h2.textContent = "Sign Up";
    			t1 = text("\n    Already a member ?\n    ");
    			a = element("a");
    			a.textContent = "Sign In";
    			t3 = text("\n    Username :\n    ");
    			input0 = element("input");
    			t4 = space();
    			html_tag = new HtmlTag(false);
    			t5 = text("\n    E-mail :\n    ");
    			input1 = element("input");
    			t6 = space();
    			html_tag_1 = new HtmlTag(false);
    			t7 = text("\n    Password :\n    ");
    			input2 = element("input");
    			t8 = space();
    			html_tag_2 = new HtmlTag(false);
    			t9 = text("\n    Confirm password :\n    ");
    			input3 = element("input");
    			t10 = space();
    			html_tag_3 = new HtmlTag(false);
    			t11 = space();
    			button = element("button");
    			button.textContent = "Sign Up !";
    			t13 = space();
    			h3 = element("h3");
    			t14 = text(/*finalMsg*/ ctx[8]);
    			attr_dev(h2, "class", "title");
    			add_location(h2, file$d, 85, 4, 2135);
    			attr_dev(a, "id", "sign-up-btn");
    			attr_dev(a, "href", "/#/login");
    			add_location(a, file$d, 87, 4, 2193);
    			attr_dev(input0, "class", "input-field");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			add_location(input0, file$d, 89, 4, 2262);
    			html_tag.a = t5;
    			attr_dev(input1, "class", "input-field");
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "E-mail");
    			add_location(input1, file$d, 103, 4, 2623);
    			html_tag_1.a = t7;
    			attr_dev(input2, "class", "input-field");
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "Password");
    			add_location(input2, file$d, 114, 4, 2838);
    			html_tag_2.a = t9;
    			attr_dev(input3, "class", "input-field");
    			attr_dev(input3, "type", "password");
    			attr_dev(input3, "placeholder", "Password");
    			add_location(input3, file$d, 125, 4, 3076);
    			html_tag_3.a = t11;
    			attr_dev(button, "type", "submit");
    			add_location(button, file$d, 135, 4, 3312);
    			set_style(h3, "color", "#FF4136");
    			add_location(h3, file$d, 136, 4, 3383);
    			add_location(form, file$d, 84, 2, 2124);
    			attr_dev(div, "class", "login");
    			add_location(div, file$d, 83, 0, 2102);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, h2);
    			append_dev(form, t1);
    			append_dev(form, a);
    			append_dev(form, t3);
    			append_dev(form, input0);
    			append_dev(form, t4);
    			html_tag.m(/*usernameMsg*/ ctx[1], form);
    			append_dev(form, t5);
    			append_dev(form, input1);
    			append_dev(form, t6);
    			html_tag_1.m(/*emailMsg*/ ctx[3], form);
    			append_dev(form, t7);
    			append_dev(form, input2);
    			append_dev(form, t8);
    			html_tag_2.m(/*passwordMsg*/ ctx[5], form);
    			append_dev(form, t9);
    			append_dev(form, input3);
    			append_dev(form, t10);
    			html_tag_3.m(/*confirmPasswordMsg*/ ctx[7], form);
    			append_dev(form, t11);
    			append_dev(form, button);
    			append_dev(form, t13);
    			append_dev(form, h3);
    			append_dev(h3, t14);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[13], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[14], false, false, false),
    					listen_dev(input2, "change", /*change_handler_2*/ ctx[15], false, false, false),
    					listen_dev(input3, "change", /*change_handler_3*/ ctx[16], false, false, false),
    					listen_dev(button, "click", /*handleSubmit*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*usernameMsg*/ 2) html_tag.p(/*usernameMsg*/ ctx[1]);
    			if (dirty & /*emailMsg*/ 8) html_tag_1.p(/*emailMsg*/ ctx[3]);
    			if (dirty & /*passwordMsg*/ 32) html_tag_2.p(/*passwordMsg*/ ctx[5]);
    			if (dirty & /*confirmPasswordMsg*/ 128) html_tag_3.p(/*confirmPasswordMsg*/ ctx[7]);
    			if (dirty & /*finalMsg*/ 256) set_data_dev(t14, /*finalMsg*/ ctx[8]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const validEmail = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const validPassword = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Register', slots, []);
    	let username = "";
    	let usernameMsg = "";
    	let email = "";
    	let emailMsg = "";
    	let password = "";
    	let passwordMsg = "";
    	let confirmPassword = "";
    	let confirmPasswordMsg = "";
    	let finalMsg = "";

    	function verifyEmail() {
    		if (!email.match(validEmail)) $$invalidate(3, emailMsg = '<li style="color: #FF4136">Please put a valid email adress</li>'); else $$invalidate(3, emailMsg = "");
    	}

    	function verifyPassword() {
    		if (!password.match(validPassword)) $$invalidate(5, passwordMsg = '<div style="color: #FF4136"> \
          <li>At least 8 characters</li> \
          <li>One special character</li> \
          <li>One uppercase letter</li> \
          <li>One lowercase letter</li> \
          <li>One number</li> \
        </div>'); else $$invalidate(5, passwordMsg = "");
    	}

    	function verifyConfirmPassword() {
    		if (password !== confirmPassword) $$invalidate(7, confirmPasswordMsg = '<li style="color: #FF4136">Passwords must correspond</li>'); else $$invalidate(7, confirmPasswordMsg = "");
    	}

    	function handleSubmit(e) {
    		e.preventDefault();

    		if (username === "" || !email.match(validEmail) || !password.match(validPassword) || password !== confirmPassword) {
    			verifyEmail();
    			verifyPassword();
    			verifyConfirmPassword();
    			return;
    		}

    		axios.post("http://" + 'localhost' + ":" + '4000' + "/register", { username, email, password }).then(
    			res => {
    				const msg = res.data.message;
    				if (msg === "OK") push("/login"); else $$invalidate(8, finalMsg = msg);
    			},
    			error => {
    				$$invalidate(8, finalMsg = "API not connected");
    			}
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Register> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(0, username = e.target.value);
    		if (username === "") $$invalidate(1, usernameMsg = '<li style="color: #FF4136">Please put a non-empty username</li>'); else $$invalidate(1, usernameMsg = "");
    	};

    	const change_handler_1 = e => {
    		$$invalidate(2, email = e.target.value);
    		verifyEmail();
    	};

    	const change_handler_2 = e => {
    		$$invalidate(4, password = e.target.value);
    		verifyPassword();
    	};

    	const change_handler_3 = e => {
    		$$invalidate(6, confirmPassword = e.target.value);
    		verifyConfirmPassword();
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		push,
    		username,
    		usernameMsg,
    		email,
    		emailMsg,
    		password,
    		passwordMsg,
    		confirmPassword,
    		confirmPasswordMsg,
    		finalMsg,
    		validEmail,
    		verifyEmail,
    		validPassword,
    		verifyPassword,
    		verifyConfirmPassword,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('usernameMsg' in $$props) $$invalidate(1, usernameMsg = $$props.usernameMsg);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    		if ('emailMsg' in $$props) $$invalidate(3, emailMsg = $$props.emailMsg);
    		if ('password' in $$props) $$invalidate(4, password = $$props.password);
    		if ('passwordMsg' in $$props) $$invalidate(5, passwordMsg = $$props.passwordMsg);
    		if ('confirmPassword' in $$props) $$invalidate(6, confirmPassword = $$props.confirmPassword);
    		if ('confirmPasswordMsg' in $$props) $$invalidate(7, confirmPasswordMsg = $$props.confirmPasswordMsg);
    		if ('finalMsg' in $$props) $$invalidate(8, finalMsg = $$props.finalMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		usernameMsg,
    		email,
    		emailMsg,
    		password,
    		passwordMsg,
    		confirmPassword,
    		confirmPasswordMsg,
    		finalMsg,
    		verifyEmail,
    		verifyPassword,
    		verifyConfirmPassword,
    		handleSubmit,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		change_handler_3
    	];
    }

    class Register extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Register",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/Components/Landing/Login.svelte generated by Svelte v3.49.0 */
    const file$c = "src/Components/Landing/Login.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let form;
    	let h2;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let button;
    	let t5;
    	let h30;
    	let t6;
    	let t7;
    	let h31;
    	let t9;
    	let p;
    	let t11;
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			form = element("form");
    			h2 = element("h2");
    			h2.textContent = "Sign In";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Login";
    			t5 = space();
    			h30 = element("h3");
    			t6 = text(/*finalMsg*/ ctx[2]);
    			t7 = space();
    			h31 = element("h3");
    			h31.textContent = "New here ?";
    			t9 = space();
    			p = element("p");
    			p.textContent = "Don't hesitate to sign up to access to website !";
    			t11 = space();
    			a = element("a");
    			a.textContent = "Sign Up";
    			attr_dev(h2, "class", "title");
    			add_location(h2, file$c, 39, 4, 928);
    			attr_dev(input0, "class", "input-field");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Username");
    			add_location(input0, file$c, 40, 4, 963);
    			attr_dev(input1, "class", "input-field");
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "placeholder", "Password");
    			add_location(input1, file$c, 48, 4, 1124);
    			add_location(button, file$c, 56, 4, 1289);
    			set_style(h30, "color", "#FF4136");
    			add_location(h30, file$c, 57, 4, 1355);
    			add_location(form, file$c, 38, 2, 917);
    			add_location(h31, file$c, 59, 2, 1410);
    			add_location(p, file$c, 60, 2, 1432);
    			attr_dev(a, "id", "sign-up-btn");
    			attr_dev(a, "href", "/#/register");
    			add_location(a, file$c, 61, 2, 1490);
    			attr_dev(div, "class", "login");
    			add_location(div, file$c, 37, 0, 895);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, form);
    			append_dev(form, h2);
    			append_dev(form, t1);
    			append_dev(form, input0);
    			append_dev(form, t2);
    			append_dev(form, input1);
    			append_dev(form, t3);
    			append_dev(form, button);
    			append_dev(form, t5);
    			append_dev(form, h30);
    			append_dev(h30, t6);
    			append_dev(div, t7);
    			append_dev(div, h31);
    			append_dev(div, t9);
    			append_dev(div, p);
    			append_dev(div, t11);
    			append_dev(div, a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[5], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[6], false, false, false),
    					listen_dev(button, "click", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*finalMsg*/ 4) set_data_dev(t6, /*finalMsg*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	let { fetchLogin } = $$props;
    	let username = "";
    	let password = "";
    	let finalMsg = "";

    	function handleSubmit() {
    		if (username === "" || password === "") return;

    		axios.post("http://" + 'localhost' + ":" + '4000' + "/login", { username, password }, { withCredentials: true }).then(async res => {
    			const msg = res.data.message;

    			if (msg === "OK") {
    				await fetchLogin();
    				push("/dashboard");
    			} else $$invalidate(2, finalMsg = msg);
    		}).catch(error => {
    			if (error.response) {
    				if (error.response.data === undefined) $$invalidate(2, finalMsg = "Internal Error"); else $$invalidate(2, finalMsg = error.response.data.message);
    			}
    		});
    	}

    	const writable_props = ['fetchLogin'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(0, username = e.target.value);
    	};

    	const change_handler_1 = e => {
    		$$invalidate(1, password = e.target.value);
    	};

    	$$self.$$set = $$props => {
    		if ('fetchLogin' in $$props) $$invalidate(4, fetchLogin = $$props.fetchLogin);
    	};

    	$$self.$capture_state = () => ({
    		push,
    		axios,
    		fetchLogin,
    		username,
    		password,
    		finalMsg,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('fetchLogin' in $$props) $$invalidate(4, fetchLogin = $$props.fetchLogin);
    		if ('username' in $$props) $$invalidate(0, username = $$props.username);
    		if ('password' in $$props) $$invalidate(1, password = $$props.password);
    		if ('finalMsg' in $$props) $$invalidate(2, finalMsg = $$props.finalMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		username,
    		password,
    		finalMsg,
    		handleSubmit,
    		fetchLogin,
    		change_handler,
    		change_handler_1
    	];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { fetchLogin: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*fetchLogin*/ ctx[4] === undefined && !('fetchLogin' in props)) {
    			console.warn("<Login> was created without expected prop 'fetchLogin'");
    		}
    	}

    	get fetchLogin() {
    		throw new Error("<Login>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fetchLogin(value) {
    		throw new Error("<Login>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Rooms/New_room.svelte generated by Svelte v3.49.0 */
    const file$b = "src/Components/Dashboard/Rooms/New_room.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (85:6) {#each friendList as friend}
    function create_each_block$5(ctx) {
    	let li;
    	let input;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let span;
    	let t2_value = /*friend*/ ctx[13].username + "";
    	let t2;
    	let t3;
    	let li_key_value;
    	let li_id_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			input = element("input");
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$b, 91, 10, 2352);
    			if (!src_url_equal(img.src, img_src_value = "/room_image.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "user_image");
    			add_location(img, file$b, 92, 10, 2388);
    			add_location(span, file$b, 93, 10, 2445);
    			attr_dev(li, "class", "room");
    			attr_dev(li, "key", li_key_value = /*friend*/ ctx[13]._id);
    			attr_dev(li, "id", li_id_value = /*friend*/ ctx[13]._id);
    			add_location(li, file$b, 85, 8, 2213);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, input);
    			append_dev(li, t0);
    			append_dev(li, img);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, t2);
    			append_dev(li, t3);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*handleClickFriend*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*friendList*/ 2 && t2_value !== (t2_value = /*friend*/ ctx[13].username + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*friendList*/ 2 && li_key_value !== (li_key_value = /*friend*/ ctx[13]._id)) {
    				attr_dev(li, "key", li_key_value);
    			}

    			if (dirty & /*friendList*/ 2 && li_id_value !== (li_id_value = /*friend*/ ctx[13]._id)) {
    				attr_dev(li, "id", li_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(85:6) {#each friendList as friend}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div2;
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let input;
    	let t1;
    	let button0;
    	let t3;
    	let div0;
    	let t4;
    	let t5;
    	let ul;
    	let t6;
    	let button1;
    	let t8;
    	let t9;
    	let mounted;
    	let dispose;
    	let each_value = /*friendList*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t0 = text("\n    Add new friend :\n    ");
    			input = element("input");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "Send invitation";
    			t3 = space();
    			div0 = element("div");
    			t4 = text(/*friendMsg*/ ctx[3]);
    			t5 = text("\n    Create room by adding your friends :\n    ");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Create Room";
    			t8 = space();
    			t9 = text(/*finalMsg*/ ctx[2]);
    			attr_dev(img, "class", "close_button");
    			if (!src_url_equal(img.src, img_src_value = "/plus.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "plus");
    			add_location(img, file$b, 64, 4, 1698);
    			attr_dev(input, "placeholder", "Add friend...");
    			input.value = /*addFriend*/ ctx[4];
    			add_location(input, file$b, 73, 4, 1867);
    			add_location(button0, file$b, 80, 4, 2014);
    			attr_dev(div0, "class", "friend_msg");
    			add_location(div0, file$b, 81, 4, 2078);
    			add_location(ul, file$b, 83, 4, 2165);
    			add_location(button1, file$b, 97, 4, 2518);
    			attr_dev(div1, "class", "Container");
    			add_location(div1, file$b, 63, 2, 1670);
    			attr_dev(div2, "class", "Dialog_box");
    			add_location(div2, file$b, 62, 0, 1643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, input);
    			append_dev(div1, t1);
    			append_dev(div1, button0);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			append_dev(div1, t8);
    			append_dev(div1, t9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[9], false, false, false),
    					listen_dev(button0, "click", /*handleAddFriend*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*handleNewRoom*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*addFriend*/ 16 && input.value !== /*addFriend*/ ctx[4]) {
    				prop_dev(input, "value", /*addFriend*/ ctx[4]);
    			}

    			if (dirty & /*friendMsg*/ 8) set_data_dev(t4, /*friendMsg*/ ctx[3]);

    			if (dirty & /*friendList, handleClickFriend*/ 34) {
    				each_value = /*friendList*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*finalMsg*/ 4) set_data_dev(t9, /*finalMsg*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('New_room', slots, []);
    	let { setOpenDialogBox } = $$props;
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let usernameValue;
    	username.subscribe(val => usernameValue = val);
    	let friendList = [];
    	let listNewRoom = [usernameValue];
    	let finalMsg = "";
    	let friendMsg = "";
    	let addFriend = "";

    	axios.get("http://" + 'localhost' + ":" + '4000' + "/getFriends", { withCredentials: true }).then(res => {
    		$$invalidate(1, friendList = res.data.friends);
    	});

    	function handleClickFriend(e) {
    		if (e.target.type !== "checkbox") e.preventDefault();
    		let obj;
    		if (e.target.className !== "room") obj = e.target.parentNode; else obj = e.target;
    		let state;

    		if (e.target.type !== "checkbox") {
    			let checkbox = obj.childNodes[0];
    			if (!checkbox.checked) checkbox.checked = true; else checkbox.checked = false;
    			state = checkbox.checked;
    		} else state = e.target.checked;

    		if (state) listNewRoom = [...listNewRoom, obj.innerText]; else listNewRoom = listNewRoom.filter(elm => elm !== obj.innerText);
    	}

    	function handleNewRoom(e) {
    		if (listNewRoom.length === 1) return;
    		socketValue.emit("create Room", listNewRoom);
    	}

    	socketValue.on("create Room return", msg => {
    		$$invalidate(2, finalMsg = msg);
    	});

    	function handleAddFriend(e) {
    		e.preventDefault();
    		if (addFriend === "") return;
    		socketValue.emit("add Friend", addFriend);
    		$$invalidate(4, addFriend = "");
    	}

    	socketValue.on("add Friend return", msg => {
    		$$invalidate(3, friendMsg = msg);
    	});

    	const writable_props = ['setOpenDialogBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<New_room> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		setOpenDialogBox(false);
    	};

    	const change_handler = e => {
    		$$invalidate(4, addFriend = e.target.value);
    	};

    	$$self.$$set = $$props => {
    		if ('setOpenDialogBox' in $$props) $$invalidate(0, setOpenDialogBox = $$props.setOpenDialogBox);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		socket,
    		username,
    		setOpenDialogBox,
    		socketValue,
    		usernameValue,
    		friendList,
    		listNewRoom,
    		finalMsg,
    		friendMsg,
    		addFriend,
    		handleClickFriend,
    		handleNewRoom,
    		handleAddFriend
    	});

    	$$self.$inject_state = $$props => {
    		if ('setOpenDialogBox' in $$props) $$invalidate(0, setOpenDialogBox = $$props.setOpenDialogBox);
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('usernameValue' in $$props) usernameValue = $$props.usernameValue;
    		if ('friendList' in $$props) $$invalidate(1, friendList = $$props.friendList);
    		if ('listNewRoom' in $$props) listNewRoom = $$props.listNewRoom;
    		if ('finalMsg' in $$props) $$invalidate(2, finalMsg = $$props.finalMsg);
    		if ('friendMsg' in $$props) $$invalidate(3, friendMsg = $$props.friendMsg);
    		if ('addFriend' in $$props) $$invalidate(4, addFriend = $$props.addFriend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		setOpenDialogBox,
    		friendList,
    		finalMsg,
    		friendMsg,
    		addFriend,
    		handleClickFriend,
    		handleNewRoom,
    		handleAddFriend,
    		click_handler,
    		change_handler
    	];
    }

    class New_room extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { setOpenDialogBox: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "New_room",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*setOpenDialogBox*/ ctx[0] === undefined && !('setOpenDialogBox' in props)) {
    			console.warn("<New_room> was created without expected prop 'setOpenDialogBox'");
    		}
    	}

    	get setOpenDialogBox() {
    		throw new Error("<New_room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setOpenDialogBox(value) {
    		throw new Error("<New_room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Rooms/Room.svelte generated by Svelte v3.49.0 */
    const file$a = "src/Components/Dashboard/Rooms/Room.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (76:4) {#if openDialogBoxRoom}
    function create_if_block_3(ctx) {
    	let newroom;
    	let current;

    	newroom = new New_room({
    			props: {
    				setOpenDialogBox: /*setOpenDialogBoxRoom*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(newroom.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newroom, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newroom.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newroom.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newroom, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(76:4) {#if openDialogBoxRoom}",
    		ctx
    	});

    	return block;
    }

    // (92:10) {#if room.lastMessage !== undefined}
    function create_if_block_1$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*room*/ ctx[11].lastMessage.length > 20) return create_if_block_2;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(92:10) {#if room.lastMessage !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (95:12) {:else}
    function create_else_block$5(ctx) {
    	let t_value = /*room*/ ctx[11].lastMessage + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rooms*/ 2 && t_value !== (t_value = /*room*/ ctx[11].lastMessage + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(95:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:12) {#if room.lastMessage.length > 20}
    function create_if_block_2(ctx) {
    	let t_value = /*room*/ ctx[11].lastMessage.slice(0, 20) + "..." + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rooms*/ 2 && t_value !== (t_value = /*room*/ ctx[11].lastMessage.slice(0, 20) + "..." + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(93:12) {#if room.lastMessage.length > 20}",
    		ctx
    	});

    	return block;
    }

    // (100:8) {#if room.unread !== 0}
    function create_if_block$8(ctx) {
    	let div;
    	let t_value = /*room*/ ctx[11].unread + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "unread");
    			add_location(div, file$a, 100, 10, 2485);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rooms*/ 2 && t_value !== (t_value = /*room*/ ctx[11].unread + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(100:8) {#if room.unread !== 0}",
    		ctx
    	});

    	return block;
    }

    // (81:4) {#each rooms as room}
    function create_each_block$4(ctx) {
    	let li;
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let span;
    	let t1_value = /*room*/ ctx[11].name + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let li_id_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*room*/ ctx[11].lastMessage !== undefined && create_if_block_1$3(ctx);
    	let if_block1 = /*room*/ ctx[11].unread !== 0 && create_if_block$8(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[9](/*room*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			if (!src_url_equal(img.src, img_src_value = "/room_image.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "user_image");
    			add_location(img, file$a, 88, 8, 2079);
    			add_location(span, file$a, 90, 10, 2168);
    			attr_dev(div, "class", "Room_Info");
    			add_location(div, file$a, 89, 8, 2134);
    			attr_dev(li, "class", "room");
    			attr_dev(li, "id", li_id_value = /*room*/ ctx[11].id);
    			add_location(li, file$a, 81, 6, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, img);
    			append_dev(li, t0);
    			append_dev(li, div);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(li, t3);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t4);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*rooms*/ 2 && t1_value !== (t1_value = /*room*/ ctx[11].name + "")) set_data_dev(t1, t1_value);

    			if (/*room*/ ctx[11].lastMessage !== undefined) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(div, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*room*/ ctx[11].unread !== 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(li, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*rooms*/ 2 && li_id_value !== (li_id_value = /*room*/ ctx[11].id)) {
    				attr_dev(li, "id", li_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(81:4) {#each rooms as room}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let input;
    	let t0;
    	let img;
    	let img_src_value;
    	let t1;
    	let t2;
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*openDialogBoxRoom*/ ctx[2] && create_if_block_3(ctx);
    	let each_value = /*rooms*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			img = element("img");
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			input.value = /*search*/ ctx[0];
    			attr_dev(input, "class", "SearchBar");
    			attr_dev(input, "placeholder", "Search...");
    			add_location(input, file$a, 60, 4, 1515);
    			if (!src_url_equal(img.src, img_src_value = "/New_Room.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "new_room");
    			add_location(img, file$a, 68, 4, 1676);
    			attr_dev(div0, "class", "Search");
    			add_location(div0, file$a, 59, 2, 1490);
    			add_location(ul, file$a, 79, 2, 1909);
    			attr_dev(div1, "class", "Room");
    			add_location(div1, file$a, 58, 0, 1469);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			append_dev(div0, t0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div1, t2);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[7], false, false, false),
    					listen_dev(img, "click", /*click_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*search*/ 1 && input.value !== /*search*/ ctx[0]) {
    				prop_dev(input, "value", /*search*/ ctx[0]);
    			}

    			if (/*openDialogBoxRoom*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*openDialogBoxRoom*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*rooms, handleChangeRoom, undefined*/ 10) {
    				each_value = /*rooms*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Room', slots, []);
    	let { setCurrentRoom } = $$props;
    	let { current_room } = $$props;
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let search = "";
    	let rooms = [];
    	let openDialogBoxRoom = false;

    	onMount(async () => {
    		await axios.get("http://" + 'localhost' + ":" + '4000' + "/getRooms", { withCredentials: true }).then(res => {
    			$$invalidate(1, rooms = res.data.rooms);
    		});
    	});

    	if (socketValue !== null) {
    		socketValue.on("new room", elt => {
    			$$invalidate(1, rooms = [...rooms, elt]);
    		});

    		socketValue.on("new message", elt => {
    			$$invalidate(1, rooms = rooms.map(room => {
    				if (room.id === elt.room) {
    					room.lastMessage = elt.message;
    					if (current_room.id !== elt.room) room.unread++;
    				}

    				return room;
    			}));
    		});
    	}

    	function handleChangeRoom(room) {
    		document.querySelectorAll(".Room li").forEach(element => {
    			element.classList.remove("selected");
    		});

    		setCurrentRoom(room);

    		$$invalidate(1, rooms = rooms.map(elm => {
    			if (room.id === elm.id) elm.unread = 0;
    			return elm;
    		}));

    		document.getElementById(room.id).classList.add("selected");
    	}

    	function setOpenDialogBoxRoom(val) {
    		$$invalidate(2, openDialogBoxRoom = val);
    	}

    	const writable_props = ['setCurrentRoom', 'current_room'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Room> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		$$invalidate(0, search = e.target.value);
    	};

    	const click_handler = () => {
    		$$invalidate(2, openDialogBoxRoom = true);
    	};

    	const click_handler_1 = room => {
    		handleChangeRoom(room);
    	};

    	$$self.$$set = $$props => {
    		if ('setCurrentRoom' in $$props) $$invalidate(5, setCurrentRoom = $$props.setCurrentRoom);
    		if ('current_room' in $$props) $$invalidate(6, current_room = $$props.current_room);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		NewRoom: New_room,
    		socket,
    		onMount,
    		setCurrentRoom,
    		current_room,
    		socketValue,
    		search,
    		rooms,
    		openDialogBoxRoom,
    		handleChangeRoom,
    		setOpenDialogBoxRoom
    	});

    	$$self.$inject_state = $$props => {
    		if ('setCurrentRoom' in $$props) $$invalidate(5, setCurrentRoom = $$props.setCurrentRoom);
    		if ('current_room' in $$props) $$invalidate(6, current_room = $$props.current_room);
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('search' in $$props) $$invalidate(0, search = $$props.search);
    		if ('rooms' in $$props) $$invalidate(1, rooms = $$props.rooms);
    		if ('openDialogBoxRoom' in $$props) $$invalidate(2, openDialogBoxRoom = $$props.openDialogBoxRoom);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		search,
    		rooms,
    		openDialogBoxRoom,
    		handleChangeRoom,
    		setOpenDialogBoxRoom,
    		setCurrentRoom,
    		current_room,
    		change_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Room extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { setCurrentRoom: 5, current_room: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Room",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*setCurrentRoom*/ ctx[5] === undefined && !('setCurrentRoom' in props)) {
    			console.warn("<Room> was created without expected prop 'setCurrentRoom'");
    		}

    		if (/*current_room*/ ctx[6] === undefined && !('current_room' in props)) {
    			console.warn("<Room> was created without expected prop 'current_room'");
    		}
    	}

    	get setCurrentRoom() {
    		throw new Error("<Room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setCurrentRoom(value) {
    		throw new Error("<Room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current_room() {
    		throw new Error("<Room>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_room(value) {
    		throw new Error("<Room>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Messages/Header.svelte generated by Svelte v3.49.0 */
    const file$9 = "src/Components/Dashboard/Messages/Header.svelte";

    function create_fragment$b(ctx) {
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div0;
    	let t2_value = /*current_room*/ ctx[0].name + "";
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			attr_dev(img0, "id", "arrow");
    			if (!src_url_equal(img0.src, img0_src_value = "/left-arrow.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "left arrow");
    			add_location(img0, file$9, 7, 2, 154);
    			attr_dev(img1, "id", "room_image");
    			if (!src_url_equal(img1.src, img1_src_value = "/room_image.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "user_image");
    			add_location(img1, file$9, 13, 2, 255);
    			attr_dev(div0, "class", "Container");
    			add_location(div0, file$9, 14, 2, 320);
    			attr_dev(div1, "class", "Header");
    			add_location(div1, file$9, 6, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img0);
    			append_dev(div1, t0);
    			append_dev(div1, img1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, t2);

    			if (!mounted) {
    				dispose = listen_dev(
    					img0,
    					"click",
    					function () {
    						if (is_function(/*return_room*/ ctx[1])) /*return_room*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*current_room*/ 1 && t2_value !== (t2_value = /*current_room*/ ctx[0].name + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	let { current_room } = $$props;
    	let { return_room } = $$props;
    	const writable_props = ['current_room', 'return_room'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('current_room' in $$props) $$invalidate(0, current_room = $$props.current_room);
    		if ('return_room' in $$props) $$invalidate(1, return_room = $$props.return_room);
    	};

    	$$self.$capture_state = () => ({ current_room, return_room });

    	$$self.$inject_state = $$props => {
    		if ('current_room' in $$props) $$invalidate(0, current_room = $$props.current_room);
    		if ('return_room' in $$props) $$invalidate(1, return_room = $$props.return_room);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_room, return_room];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { current_room: 0, return_room: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*current_room*/ ctx[0] === undefined && !('current_room' in props)) {
    			console.warn("<Header> was created without expected prop 'current_room'");
    		}

    		if (/*return_room*/ ctx[1] === undefined && !('return_room' in props)) {
    			console.warn("<Header> was created without expected prop 'return_room'");
    		}
    	}

    	get current_room() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_room(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get return_room() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set return_room(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Messages/Messages_displaying.svelte generated by Svelte v3.49.0 */
    const file$8 = "src/Components/Dashboard/Messages/Messages_displaying.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (66:6) {:else}
    function create_else_block$4(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*msg*/ ctx[6].game + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*msg*/ ctx[6].message + "";
    	let t2;
    	let t3;
    	let if_block = /*msg*/ ctx[6].state === "Not started" && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "name");
    			add_location(div0, file$8, 67, 10, 1957);
    			attr_dev(div1, "class", "intro");
    			add_location(div1, file$8, 70, 10, 2026);
    			attr_dev(div2, "class", "content");
    			add_location(div2, file$8, 66, 8, 1925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    			if (if_block) if_block.m(div2, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t0_value !== (t0_value = /*msg*/ ctx[6].game + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*messages*/ 1 && t2_value !== (t2_value = /*msg*/ ctx[6].message + "")) set_data_dev(t2, t2_value);

    			if (/*msg*/ ctx[6].state === "Not started") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(66:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:6) {#if msg.type === "regular"}
    function create_if_block$7(ctx) {
    	let div;
    	let t_value = /*msg*/ ctx[6].message + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "content");
    			add_location(div, file$8, 64, 8, 1862);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t_value !== (t_value = /*msg*/ ctx[6].message + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(64:6) {#if msg.type === \\\"regular\\\"}",
    		ctx
    	});

    	return block;
    }

    // (72:10) {#if msg.state === "Not started"}
    function create_if_block_1$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*msg*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Start";
    			add_location(button, file$8, 72, 12, 2121);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(72:10) {#if msg.state === \\\"Not started\\\"}",
    		ctx
    	});

    	return block;
    }

    // (58:2) {#each messages as msg}
    function create_each_block$3(ctx) {
    	let li;
    	let div;
    	let t0_value = /*msg*/ ctx[6].user + "";
    	let t0;
    	let t1;
    	let t2;
    	let li_class_value;
    	let li_key_value;

    	function select_block_type(ctx, dirty) {
    		if (/*msg*/ ctx[6].type === "regular") return create_if_block$7;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			attr_dev(div, "class", "header");
    			add_location(div, file$8, 62, 6, 1782);

    			attr_dev(li, "class", li_class_value = `msg ${/*msg*/ ctx[6].user === /*usernameValue*/ ctx[1]
			? "me"
			: "other"}`);

    			attr_dev(li, "key", li_key_value = /*msg*/ ctx[6].id);
    			add_location(li, file$8, 58, 4, 1680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);
    			if_block.m(li, null);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*messages*/ 1 && t0_value !== (t0_value = /*msg*/ ctx[6].user + "")) set_data_dev(t0, t0_value);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t2);
    				}
    			}

    			if (dirty & /*messages, usernameValue*/ 3 && li_class_value !== (li_class_value = `msg ${/*msg*/ ctx[6].user === /*usernameValue*/ ctx[1]
			? "me"
			: "other"}`)) {
    				attr_dev(li, "class", li_class_value);
    			}

    			if (dirty & /*messages*/ 1 && li_key_value !== (li_key_value = /*msg*/ ctx[6].id)) {
    				attr_dev(li, "key", li_key_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(58:2) {#each messages as msg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let ul;
    	let each_value = /*messages*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", "chat");
    			attr_dev(ul, "class", "chat");
    			add_location(ul, file$8, 56, 0, 1622);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*messages, usernameValue, handleStartGame*/ 7) {
    				each_value = /*messages*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Messages_displaying', slots, []);
    	let messages = [];
    	let { current_room } = $$props;
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let usernameValue;
    	username.subscribe(val => $$invalidate(1, usernameValue = val));

    	//check for update
    	if (socketValue !== null) {
    		socketValue.on("new message", elt => {
    			if (elt.room === current_room.id) $$invalidate(0, messages = [...messages, elt]);
    		});

    		socketValue.on("update message", elt => {
    			$$invalidate(0, messages = messages.map(elm => {
    				if (elm !== undefined && elm.id === elt.id) elm = elt;
    			}));
    		});
    	}

    	afterUpdate(() => {
    		let obj = document.getElementById("chat");
    		obj.scrollTo(0, obj.scrollHeight);

    		if (messages.length !== 0 && !messages.at(-1).read.includes(usernameValue)) socketValue.emit("read", {
    			username: usernameValue,
    			room: current_room.id
    		});
    	});

    	function handleStartGame(name, id) {
    		currentGame.set(id);
    		if (name === "Tic-tac-toe") push("/tic-tac-toe"); else if (name === "Connect 4") push("/connect-4");
    	}

    	const writable_props = ['current_room'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Messages_displaying> was created with unknown prop '${key}'`);
    	});

    	const click_handler = msg => handleStartGame(msg.game, msg.game_id);

    	$$self.$$set = $$props => {
    		if ('current_room' in $$props) $$invalidate(3, current_room = $$props.current_room);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		socket,
    		username,
    		currentGame,
    		push,
    		afterUpdate,
    		messages,
    		current_room,
    		socketValue,
    		usernameValue,
    		handleStartGame
    	});

    	$$self.$inject_state = $$props => {
    		if ('messages' in $$props) $$invalidate(0, messages = $$props.messages);
    		if ('current_room' in $$props) $$invalidate(3, current_room = $$props.current_room);
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('usernameValue' in $$props) $$invalidate(1, usernameValue = $$props.usernameValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*current_room*/ 8) {
    			//get all the messages on the first load
    			if (current_room !== "") {
    				axios.get("http://" + 'localhost' + ":" + '4000' + "/getMsg", {
    					params: { room: current_room.id },
    					withCredentials: true
    				}).then(res => {
    					$$invalidate(0, messages = res.data.messages);
    				});
    			}
    		}
    	};

    	return [messages, usernameValue, handleStartGame, current_room, click_handler];
    }

    class Messages_displaying extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { current_room: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages_displaying",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*current_room*/ ctx[3] === undefined && !('current_room' in props)) {
    			console.warn("<Messages_displaying> was created without expected prop 'current_room'");
    		}
    	}

    	get current_room() {
    		throw new Error("<Messages_displaying>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_room(value) {
    		throw new Error("<Messages_displaying>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function assertNonEmptyString (str) {
      if (typeof str !== 'string' || !str) {
        throw new Error('expected a non-empty string, got: ' + str)
      }
    }

    function assertNumber (number) {
      if (typeof number !== 'number') {
        throw new Error('expected a number, got: ' + number)
      }
    }

    const DB_VERSION_CURRENT = 1;
    const DB_VERSION_INITIAL = 1;
    const STORE_EMOJI = 'emoji';
    const STORE_KEYVALUE = 'keyvalue';
    const STORE_FAVORITES = 'favorites';
    const FIELD_TOKENS = 'tokens';
    const INDEX_TOKENS = 'tokens';
    const FIELD_UNICODE = 'unicode';
    const INDEX_COUNT = 'count';
    const FIELD_GROUP = 'group';
    const FIELD_ORDER = 'order';
    const INDEX_GROUP_AND_ORDER = 'group-order';
    const KEY_ETAG = 'eTag';
    const KEY_URL = 'url';
    const KEY_PREFERRED_SKINTONE = 'skinTone';
    const MODE_READONLY = 'readonly';
    const MODE_READWRITE = 'readwrite';
    const INDEX_SKIN_UNICODE = 'skinUnicodes';
    const FIELD_SKIN_UNICODE = 'skinUnicodes';

    const DEFAULT_DATA_SOURCE$1 = 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json';
    const DEFAULT_LOCALE$1 = 'en';

    // like lodash's uniqBy but much smaller
    function uniqBy$1 (arr, func) {
      const set = new Set();
      const res = [];
      for (const item of arr) {
        const key = func(item);
        if (!set.has(key)) {
          set.add(key);
          res.push(item);
        }
      }
      return res
    }

    function uniqEmoji (emojis) {
      return uniqBy$1(emojis, _ => _.unicode)
    }

    function initialMigration (db) {
      function createObjectStore (name, keyPath, indexes) {
        const store = keyPath
          ? db.createObjectStore(name, { keyPath })
          : db.createObjectStore(name);
        if (indexes) {
          for (const [indexName, [keyPath, multiEntry]] of Object.entries(indexes)) {
            store.createIndex(indexName, keyPath, { multiEntry });
          }
        }
        return store
      }

      createObjectStore(STORE_KEYVALUE);
      createObjectStore(STORE_EMOJI, /* keyPath */ FIELD_UNICODE, {
        [INDEX_TOKENS]: [FIELD_TOKENS, /* multiEntry */ true],
        [INDEX_GROUP_AND_ORDER]: [[FIELD_GROUP, FIELD_ORDER]],
        [INDEX_SKIN_UNICODE]: [FIELD_SKIN_UNICODE, /* multiEntry */ true]
      });
      createObjectStore(STORE_FAVORITES, undefined, {
        [INDEX_COUNT]: ['']
      });
    }

    const openReqs = {};
    const databaseCache = {};
    const onCloseListeners = {};

    function handleOpenOrDeleteReq (resolve, reject, req) {
      // These things are almost impossible to test with fakeIndexedDB sadly
      /* istanbul ignore next */
      req.onerror = () => reject(req.error);
      /* istanbul ignore next */
      req.onblocked = () => reject(new Error('IDB blocked'));
      req.onsuccess = () => resolve(req.result);
    }

    async function createDatabase (dbName) {
      const db = await new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, DB_VERSION_CURRENT);
        openReqs[dbName] = req;
        req.onupgradeneeded = e => {
          // Technically there is only one version, so we don't need this `if` check
          // But if an old version of the JS is in another browser tab
          // and it gets upgraded in the future and we have a new DB version, well...
          // better safe than sorry.
          /* istanbul ignore else */
          if (e.oldVersion < DB_VERSION_INITIAL) {
            initialMigration(req.result);
          }
        };
        handleOpenOrDeleteReq(resolve, reject, req);
      });
      // Handle abnormal closes, e.g. "delete database" in chrome dev tools.
      // No need for removeEventListener, because once the DB can no longer
      // fire "close" events, it will auto-GC.
      // Unfortunately cannot test in fakeIndexedDB: https://github.com/dumbmatter/fakeIndexedDB/issues/50
      /* istanbul ignore next */
      db.onclose = () => closeDatabase(dbName);
      return db
    }

    function openDatabase (dbName) {
      if (!databaseCache[dbName]) {
        databaseCache[dbName] = createDatabase(dbName);
      }
      return databaseCache[dbName]
    }

    function dbPromise (db, storeName, readOnlyOrReadWrite, cb) {
      return new Promise((resolve, reject) => {
        // Use relaxed durability because neither the emoji data nor the favorites/preferred skin tone
        // are really irreplaceable data. IndexedDB is just a cache in this case.
        const txn = db.transaction(storeName, readOnlyOrReadWrite, { durability: 'relaxed' });
        const store = typeof storeName === 'string'
          ? txn.objectStore(storeName)
          : storeName.map(name => txn.objectStore(name));
        let res;
        cb(store, txn, (result) => {
          res = result;
        });

        txn.oncomplete = () => resolve(res);
        /* istanbul ignore next */
        txn.onerror = () => reject(txn.error);
      })
    }

    function closeDatabase (dbName) {
      // close any open requests
      const req = openReqs[dbName];
      const db = req && req.result;
      if (db) {
        db.close();
        const listeners = onCloseListeners[dbName];
        /* istanbul ignore else */
        if (listeners) {
          for (const listener of listeners) {
            listener();
          }
        }
      }
      delete openReqs[dbName];
      delete databaseCache[dbName];
      delete onCloseListeners[dbName];
    }

    function deleteDatabase (dbName) {
      return new Promise((resolve, reject) => {
        // close any open requests
        closeDatabase(dbName);
        const req = indexedDB.deleteDatabase(dbName);
        handleOpenOrDeleteReq(resolve, reject, req);
      })
    }

    // The "close" event occurs during an abnormal shutdown, e.g. a user clearing their browser data.
    // However, it doesn't occur with the normal "close" event, so we handle that separately.
    // https://www.w3.org/TR/IndexedDB/#close-a-database-connection
    function addOnCloseListener (dbName, listener) {
      let listeners = onCloseListeners[dbName];
      if (!listeners) {
        listeners = onCloseListeners[dbName] = [];
      }
      listeners.push(listener);
    }

    // list of emoticons that don't match a simple \W+ regex
    // extracted using:
    // require('emoji-picker-element-data/en/emojibase/data.json').map(_ => _.emoticon).filter(Boolean).filter(_ => !/^\W+$/.test(_))
    const irregularEmoticons = new Set([
      ':D', 'XD', ":'D", 'O:)',
      ':X', ':P', ';P', 'XP',
      ':L', ':Z', ':j', '8D',
      'XO', '8)', ':B', ':O',
      ':S', ":'o", 'Dx', 'X(',
      'D:', ':C', '>0)', ':3',
      '</3', '<3', '\\M/', ':E',
      '8#'
    ]);

    function extractTokens (str) {
      return str
        .split(/[\s_]+/)
        .map(word => {
          if (!word.match(/\w/) || irregularEmoticons.has(word)) {
            // for pure emoticons like :) or :-), just leave them as-is
            return word.toLowerCase()
          }

          return word
            .replace(/[)(:,]/g, '')
            .replace(/’/g, "'")
            .toLowerCase()
        }).filter(Boolean)
    }

    const MIN_SEARCH_TEXT_LENGTH$1 = 2;

    // This is an extra step in addition to extractTokens(). The difference here is that we expect
    // the input to have already been run through extractTokens(). This is useful for cases like
    // emoticons, where we don't want to do any tokenization (because it makes no sense to split up
    // ">:)" by the colon) but we do want to lowercase it to have consistent search results, so that
    // the user can type ':P' or ':p' and still get the same result.
    function normalizeTokens (str) {
      return str
        .filter(Boolean)
        .map(_ => _.toLowerCase())
        .filter(_ => _.length >= MIN_SEARCH_TEXT_LENGTH$1)
    }

    // Transform emoji data for storage in IDB
    function transformEmojiData (emojiData) {
      const res = emojiData.map(({ annotation, emoticon, group, order, shortcodes, skins, tags, emoji, version }) => {
        const tokens = [...new Set(
          normalizeTokens([
            ...(shortcodes || []).map(extractTokens).flat(),
            ...tags.map(extractTokens).flat(),
            ...extractTokens(annotation),
            emoticon
          ])
        )].sort();
        const res = {
          annotation,
          group,
          order,
          tags,
          tokens,
          unicode: emoji,
          version
        };
        if (emoticon) {
          res.emoticon = emoticon;
        }
        if (shortcodes) {
          res.shortcodes = shortcodes;
        }
        if (skins) {
          res.skinTones = [];
          res.skinUnicodes = [];
          res.skinVersions = [];
          for (const { tone, emoji, version } of skins) {
            res.skinTones.push(tone);
            res.skinUnicodes.push(emoji);
            res.skinVersions.push(version);
          }
        }
        return res
      });
      return res
    }

    // helper functions that help compress the code better

    function callStore (store, method, key, cb) {
      store[method](key).onsuccess = e => (cb && cb(e.target.result));
    }

    function getIDB (store, key, cb) {
      callStore(store, 'get', key, cb);
    }

    function getAllIDB (store, key, cb) {
      callStore(store, 'getAll', key, cb);
    }

    function commit (txn) {
      /* istanbul ignore else */
      if (txn.commit) {
        txn.commit();
      }
    }

    // like lodash's minBy
    function minBy (array, func) {
      let minItem = array[0];
      for (let i = 1; i < array.length; i++) {
        const item = array[i];
        if (func(minItem) > func(item)) {
          minItem = item;
        }
      }
      return minItem
    }

    // return an array of results representing all items that are found in each one of the arrays

    function findCommonMembers (arrays, uniqByFunc) {
      const shortestArray = minBy(arrays, _ => _.length);
      const results = [];
      for (const item of shortestArray) {
        // if this item is included in every array in the intermediate results, add it to the final results
        if (!arrays.some(array => array.findIndex(_ => uniqByFunc(_) === uniqByFunc(item)) === -1)) {
          results.push(item);
        }
      }
      return results
    }

    async function isEmpty (db) {
      return !(await get(db, STORE_KEYVALUE, KEY_URL))
    }

    async function hasData (db, url, eTag) {
      const [oldETag, oldUrl] = await Promise.all([KEY_ETAG, KEY_URL]
        .map(key => get(db, STORE_KEYVALUE, key)));
      return (oldETag === eTag && oldUrl === url)
    }

    async function doFullDatabaseScanForSingleResult (db, predicate) {
      // This batching algorithm is just a perf improvement over a basic
      // cursor. The BATCH_SIZE is an estimate of what would give the best
      // perf for doing a full DB scan (worst case).
      //
      // Mini-benchmark for determining the best batch size:
      //
      // PERF=1 yarn build:rollup && yarn test:adhoc
      //
      // (async () => {
      //   performance.mark('start')
      //   await $('emoji-picker').database.getEmojiByShortcode('doesnotexist')
      //   performance.measure('total', 'start')
      //   console.log(performance.getEntriesByName('total').slice(-1)[0].duration)
      // })()
      const BATCH_SIZE = 50; // Typically around 150ms for 6x slowdown in Chrome for above benchmark
      return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
        let lastKey;

        const processNextBatch = () => {
          emojiStore.getAll(lastKey && IDBKeyRange.lowerBound(lastKey, true), BATCH_SIZE).onsuccess = e => {
            const results = e.target.result;
            for (const result of results) {
              lastKey = result.unicode;
              if (predicate(result)) {
                return cb(result)
              }
            }
            if (results.length < BATCH_SIZE) {
              return cb()
            }
            processNextBatch();
          };
        };
        processNextBatch();
      })
    }

    async function loadData (db, emojiData, url, eTag) {
      try {
        const transformedData = transformEmojiData(emojiData);
        await dbPromise(db, [STORE_EMOJI, STORE_KEYVALUE], MODE_READWRITE, ([emojiStore, metaStore], txn) => {
          let oldETag;
          let oldUrl;
          let todo = 0;

          function checkFetched () {
            if (++todo === 2) { // 2 requests made
              onFetched();
            }
          }

          function onFetched () {
            if (oldETag === eTag && oldUrl === url) {
              // check again within the transaction to guard against concurrency, e.g. multiple browser tabs
              return
            }
            // delete old data
            emojiStore.clear();
            // insert new data
            for (const data of transformedData) {
              emojiStore.put(data);
            }
            metaStore.put(eTag, KEY_ETAG);
            metaStore.put(url, KEY_URL);
            commit(txn);
          }

          getIDB(metaStore, KEY_ETAG, result => {
            oldETag = result;
            checkFetched();
          });

          getIDB(metaStore, KEY_URL, result => {
            oldUrl = result;
            checkFetched();
          });
        });
      } finally {
      }
    }

    async function getEmojiByGroup (db, group) {
      return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
        const range = IDBKeyRange.bound([group, 0], [group + 1, 0], false, true);
        getAllIDB(emojiStore.index(INDEX_GROUP_AND_ORDER), range, cb);
      })
    }

    async function getEmojiBySearchQuery (db, query) {
      const tokens = normalizeTokens(extractTokens(query));

      if (!tokens.length) {
        return []
      }

      return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => {
        // get all results that contain all tokens (i.e. an AND query)
        const intermediateResults = [];

        const checkDone = () => {
          if (intermediateResults.length === tokens.length) {
            onDone();
          }
        };

        const onDone = () => {
          const results = findCommonMembers(intermediateResults, _ => _.unicode);
          cb(results.sort((a, b) => a.order < b.order ? -1 : 1));
        };

        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
          const range = i === tokens.length - 1
            ? IDBKeyRange.bound(token, token + '\uffff', false, true) // treat last token as a prefix search
            : IDBKeyRange.only(token); // treat all other tokens as an exact match
          getAllIDB(emojiStore.index(INDEX_TOKENS), range, result => {
            intermediateResults.push(result);
            checkDone();
          });
        }
      })
    }

    // This could have been implemented as an IDB index on shortcodes, but it seemed wasteful to do that
    // when we can already query by tokens and this will give us what we're looking for 99.9% of the time
    async function getEmojiByShortcode (db, shortcode) {
      const emojis = await getEmojiBySearchQuery(db, shortcode);

      // In very rare cases (e.g. the shortcode "v" as in "v for victory"), we cannot search because
      // there are no usable tokens (too short in this case). In that case, we have to do an inefficient
      // full-database scan, which I believe is an acceptable tradeoff for not having to have an extra
      // index on shortcodes.

      if (!emojis.length) {
        const predicate = _ => ((_.shortcodes || []).includes(shortcode.toLowerCase()));
        return (await doFullDatabaseScanForSingleResult(db, predicate)) || null
      }

      return emojis.filter(_ => {
        const lowerShortcodes = (_.shortcodes || []).map(_ => _.toLowerCase());
        return lowerShortcodes.includes(shortcode.toLowerCase())
      })[0] || null
    }

    async function getEmojiByUnicode (db, unicode) {
      return dbPromise(db, STORE_EMOJI, MODE_READONLY, (emojiStore, txn, cb) => (
        getIDB(emojiStore, unicode, result => {
          if (result) {
            return cb(result)
          }
          getIDB(emojiStore.index(INDEX_SKIN_UNICODE), unicode, result => cb(result || null));
        })
      ))
    }

    function get (db, storeName, key) {
      return dbPromise(db, storeName, MODE_READONLY, (store, txn, cb) => (
        getIDB(store, key, cb)
      ))
    }

    function set (db, storeName, key, value) {
      return dbPromise(db, storeName, MODE_READWRITE, (store, txn) => {
        store.put(value, key);
        commit(txn);
      })
    }

    function incrementFavoriteEmojiCount (db, unicode) {
      return dbPromise(db, STORE_FAVORITES, MODE_READWRITE, (store, txn) => (
        getIDB(store, unicode, result => {
          store.put((result || 0) + 1, unicode);
          commit(txn);
        })
      ))
    }

    function getTopFavoriteEmoji (db, customEmojiIndex, limit) {
      if (limit === 0) {
        return []
      }
      return dbPromise(db, [STORE_FAVORITES, STORE_EMOJI], MODE_READONLY, ([favoritesStore, emojiStore], txn, cb) => {
        const results = [];
        favoritesStore.index(INDEX_COUNT).openCursor(undefined, 'prev').onsuccess = e => {
          const cursor = e.target.result;
          if (!cursor) { // no more results
            return cb(results)
          }

          function addResult (result) {
            results.push(result);
            if (results.length === limit) {
              return cb(results) // done, reached the limit
            }
            cursor.continue();
          }

          const unicodeOrName = cursor.primaryKey;
          const custom = customEmojiIndex.byName(unicodeOrName);
          if (custom) {
            return addResult(custom)
          }
          // This could be done in parallel (i.e. make the cursor and the get()s parallelized),
          // but my testing suggests it's not actually faster.
          getIDB(emojiStore, unicodeOrName, emoji => {
            if (emoji) {
              return addResult(emoji)
            }
            // emoji not found somehow, ignore (may happen if custom emoji change)
            cursor.continue();
          });
        };
      })
    }

    // trie data structure for prefix searches
    // loosely based on https://github.com/nolanlawson/substring-trie

    const CODA_MARKER = ''; // marks the end of the string

    function trie (arr, itemToTokens) {
      const map = new Map();
      for (const item of arr) {
        const tokens = itemToTokens(item);
        for (const token of tokens) {
          let currentMap = map;
          for (let i = 0; i < token.length; i++) {
            const char = token.charAt(i);
            let nextMap = currentMap.get(char);
            if (!nextMap) {
              nextMap = new Map();
              currentMap.set(char, nextMap);
            }
            currentMap = nextMap;
          }
          let valuesAtCoda = currentMap.get(CODA_MARKER);
          if (!valuesAtCoda) {
            valuesAtCoda = [];
            currentMap.set(CODA_MARKER, valuesAtCoda);
          }
          valuesAtCoda.push(item);
        }
      }

      const search = (query, exact) => {
        let currentMap = map;
        for (let i = 0; i < query.length; i++) {
          const char = query.charAt(i);
          const nextMap = currentMap.get(char);
          if (nextMap) {
            currentMap = nextMap;
          } else {
            return []
          }
        }

        if (exact) {
          const results = currentMap.get(CODA_MARKER);
          return results || []
        }

        const results = [];
        // traverse
        const queue = [currentMap];
        while (queue.length) {
          const currentMap = queue.shift();
          const entriesSortedByKey = [...currentMap.entries()].sort((a, b) => a[0] < b[0] ? -1 : 1);
          for (const [key, value] of entriesSortedByKey) {
            if (key === CODA_MARKER) { // CODA_MARKER always comes first; it's the empty string
              results.push(...value);
            } else {
              queue.push(value);
            }
          }
        }
        return results
      };

      return search
    }

    const requiredKeys$1 = [
      'name',
      'url'
    ];

    function assertCustomEmojis (customEmojis) {
      const isArray = customEmojis && Array.isArray(customEmojis);
      const firstItemIsFaulty = isArray &&
        customEmojis.length &&
        (!customEmojis[0] || requiredKeys$1.some(key => !(key in customEmojis[0])));
      if (!isArray || firstItemIsFaulty) {
        throw new Error('Custom emojis are in the wrong format')
      }
    }

    function customEmojiIndex (customEmojis) {
      assertCustomEmojis(customEmojis);

      const sortByName = (a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;

      //
      // all()
      //
      const all = customEmojis.sort(sortByName);

      //
      // search()
      //
      const emojiToTokens = emoji => (
        [...new Set((emoji.shortcodes || []).map(shortcode => extractTokens(shortcode)).flat())]
      );
      const searchTrie = trie(customEmojis, emojiToTokens);
      const searchByExactMatch = _ => searchTrie(_, true);
      const searchByPrefix = _ => searchTrie(_, false);

      // Search by query for custom emoji. Similar to how we do this in IDB, the last token
      // is treated as a prefix search, but every other one is treated as an exact match.
      // Then we AND the results together
      const search = query => {
        const tokens = extractTokens(query);
        const intermediateResults = tokens.map((token, i) => (
          (i < tokens.length - 1 ? searchByExactMatch : searchByPrefix)(token)
        ));
        return findCommonMembers(intermediateResults, _ => _.name).sort(sortByName)
      };

      //
      // byShortcode, byName
      //
      const shortcodeToEmoji = new Map();
      const nameToEmoji = new Map();
      for (const customEmoji of customEmojis) {
        nameToEmoji.set(customEmoji.name.toLowerCase(), customEmoji);
        for (const shortcode of (customEmoji.shortcodes || [])) {
          shortcodeToEmoji.set(shortcode.toLowerCase(), customEmoji);
        }
      }

      const byShortcode = shortcode => shortcodeToEmoji.get(shortcode.toLowerCase());
      const byName = name => nameToEmoji.get(name.toLowerCase());

      return {
        all,
        search,
        byShortcode,
        byName
      }
    }

    // remove some internal implementation details, i.e. the "tokens" array on the emoji object
    // essentially, convert the emoji from the version stored in IDB to the version used in-memory
    function cleanEmoji (emoji) {
      if (!emoji) {
        return emoji
      }
      delete emoji.tokens;
      if (emoji.skinTones) {
        const len = emoji.skinTones.length;
        emoji.skins = Array(len);
        for (let i = 0; i < len; i++) {
          emoji.skins[i] = {
            tone: emoji.skinTones[i],
            unicode: emoji.skinUnicodes[i],
            version: emoji.skinVersions[i]
          };
        }
        delete emoji.skinTones;
        delete emoji.skinUnicodes;
        delete emoji.skinVersions;
      }
      return emoji
    }

    function warnETag (eTag) {
      if (!eTag) {
        console.warn('emoji-picker-element is more efficient if the dataSource server exposes an ETag header.');
      }
    }

    const requiredKeys = [
      'annotation',
      'emoji',
      'group',
      'order',
      'tags',
      'version'
    ];

    function assertEmojiData (emojiData) {
      if (!emojiData ||
        !Array.isArray(emojiData) ||
        !emojiData[0] ||
        (typeof emojiData[0] !== 'object') ||
        requiredKeys.some(key => (!(key in emojiData[0])))) {
        throw new Error('Emoji data is in the wrong format')
      }
    }

    function assertStatus (response, dataSource) {
      if (Math.floor(response.status / 100) !== 2) {
        throw new Error('Failed to fetch: ' + dataSource + ':  ' + response.status)
      }
    }

    async function getETag (dataSource) {
      const response = await fetch(dataSource, { method: 'HEAD' });
      assertStatus(response, dataSource);
      const eTag = response.headers.get('etag');
      warnETag(eTag);
      return eTag
    }

    async function getETagAndData (dataSource) {
      const response = await fetch(dataSource);
      assertStatus(response, dataSource);
      const eTag = response.headers.get('etag');
      warnETag(eTag);
      const emojiData = await response.json();
      assertEmojiData(emojiData);
      return [eTag, emojiData]
    }

    // TODO: including these in blob-util.ts causes typedoc to generate docs for them,
    /**
     * Convert an `ArrayBuffer` to a binary string.
     *
     * Example:
     *
     * ```js
     * var myString = blobUtil.arrayBufferToBinaryString(arrayBuff)
     * ```
     *
     * @param buffer - array buffer
     * @returns binary string
     */
    function arrayBufferToBinaryString(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var length = bytes.byteLength;
        var i = -1;
        while (++i < length) {
            binary += String.fromCharCode(bytes[i]);
        }
        return binary;
    }
    /**
     * Convert a binary string to an `ArrayBuffer`.
     *
     * ```js
     * var myBuffer = blobUtil.binaryStringToArrayBuffer(binaryString)
     * ```
     *
     * @param binary - binary string
     * @returns array buffer
     */
    function binaryStringToArrayBuffer(binary) {
        var length = binary.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        var i = -1;
        while (++i < length) {
            arr[i] = binary.charCodeAt(i);
        }
        return buf;
    }

    // generate a checksum based on the stringified JSON
    async function jsonChecksum (object) {
      const inString = JSON.stringify(object);
      const inBuffer = binaryStringToArrayBuffer(inString);
      // this does not need to be cryptographically secure, SHA-1 is fine
      const outBuffer = await crypto.subtle.digest('SHA-1', inBuffer);
      const outBinString = arrayBufferToBinaryString(outBuffer);
      const res = btoa(outBinString);
      return res
    }

    async function checkForUpdates (db, dataSource) {
      // just do a simple HEAD request first to see if the eTags match
      let emojiData;
      let eTag = await getETag(dataSource);
      if (!eTag) { // work around lack of ETag/Access-Control-Expose-Headers
        const eTagAndData = await getETagAndData(dataSource);
        eTag = eTagAndData[0];
        emojiData = eTagAndData[1];
        if (!eTag) {
          eTag = await jsonChecksum(emojiData);
        }
      }
      if (await hasData(db, dataSource, eTag)) ; else {
        if (!emojiData) {
          const eTagAndData = await getETagAndData(dataSource);
          emojiData = eTagAndData[1];
        }
        await loadData(db, emojiData, dataSource, eTag);
      }
    }

    async function loadDataForFirstTime (db, dataSource) {
      let [eTag, emojiData] = await getETagAndData(dataSource);
      if (!eTag) {
        // Handle lack of support for ETag or Access-Control-Expose-Headers
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers#Browser_compatibility
        eTag = await jsonChecksum(emojiData);
      }

      await loadData(db, emojiData, dataSource, eTag);
    }

    class Database {
      constructor ({ dataSource = DEFAULT_DATA_SOURCE$1, locale = DEFAULT_LOCALE$1, customEmoji = [] } = {}) {
        this.dataSource = dataSource;
        this.locale = locale;
        this._dbName = `emoji-picker-element-${this.locale}`;
        this._db = undefined;
        this._lazyUpdate = undefined;
        this._custom = customEmojiIndex(customEmoji);

        this._clear = this._clear.bind(this);
        this._ready = this._init();
      }

      async _init () {
        const db = this._db = await openDatabase(this._dbName);

        addOnCloseListener(this._dbName, this._clear);
        const dataSource = this.dataSource;
        const empty = await isEmpty(db);

        if (empty) {
          await loadDataForFirstTime(db, dataSource);
        } else { // offline-first - do an update asynchronously
          this._lazyUpdate = checkForUpdates(db, dataSource);
        }
      }

      async ready () {
        const checkReady = async () => {
          if (!this._ready) {
            this._ready = this._init();
          }
          return this._ready
        };
        await checkReady();
        // There's a possibility of a race condition where the element gets added, removed, and then added again
        // with a particular timing, which would set the _db to undefined.
        // We *could* do a while loop here, but that seems excessive and could lead to an infinite loop.
        if (!this._db) {
          await checkReady();
        }
      }

      async getEmojiByGroup (group) {
        assertNumber(group);
        await this.ready();
        return uniqEmoji(await getEmojiByGroup(this._db, group)).map(cleanEmoji)
      }

      async getEmojiBySearchQuery (query) {
        assertNonEmptyString(query);
        await this.ready();
        const customs = this._custom.search(query);
        const natives = uniqEmoji(await getEmojiBySearchQuery(this._db, query)).map(cleanEmoji);
        return [
          ...customs,
          ...natives
        ]
      }

      async getEmojiByShortcode (shortcode) {
        assertNonEmptyString(shortcode);
        await this.ready();
        const custom = this._custom.byShortcode(shortcode);
        if (custom) {
          return custom
        }
        return cleanEmoji(await getEmojiByShortcode(this._db, shortcode))
      }

      async getEmojiByUnicodeOrName (unicodeOrName) {
        assertNonEmptyString(unicodeOrName);
        await this.ready();
        const custom = this._custom.byName(unicodeOrName);
        if (custom) {
          return custom
        }
        return cleanEmoji(await getEmojiByUnicode(this._db, unicodeOrName))
      }

      async getPreferredSkinTone () {
        await this.ready();
        return (await get(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE)) || 0
      }

      async setPreferredSkinTone (skinTone) {
        assertNumber(skinTone);
        await this.ready();
        return set(this._db, STORE_KEYVALUE, KEY_PREFERRED_SKINTONE, skinTone)
      }

      async incrementFavoriteEmojiCount (unicodeOrName) {
        assertNonEmptyString(unicodeOrName);
        await this.ready();
        return incrementFavoriteEmojiCount(this._db, unicodeOrName)
      }

      async getTopFavoriteEmoji (limit) {
        assertNumber(limit);
        await this.ready();
        return (await getTopFavoriteEmoji(this._db, this._custom, limit)).map(cleanEmoji)
      }

      set customEmoji (customEmojis) {
        this._custom = customEmojiIndex(customEmojis);
      }

      get customEmoji () {
        return this._custom.all
      }

      async _shutdown () {
        await this.ready(); // reopen if we've already been closed/deleted
        try {
          await this._lazyUpdate; // allow any lazy updates to process before closing/deleting
        } catch (err) { /* ignore network errors (offline-first) */ }
      }

      // clear references to IDB, e.g. during a close event
      _clear () {
        // We don't need to call removeEventListener or remove the manual "close" listeners.
        // The memory leak tests prove this is unnecessary. It's because:
        // 1) IDBDatabases that can no longer fire "close" automatically have listeners GCed
        // 2) we clear the manual close listeners in databaseLifecycle.js.
        this._db = this._ready = this._lazyUpdate = undefined;
      }

      async close () {
        await this._shutdown();
        await closeDatabase(this._dbName);
      }

      async delete () {
        await this._shutdown();
        await deleteDatabase(this._dbName);
      }
    }

    // via https://unpkg.com/browse/emojibase-data@6.0.0/meta/groups.json
    const allGroups = [
      [-1, '✨', 'custom'],
      [0, '😀', 'smileys-emotion'],
      [1, '👋', 'people-body'],
      [3, '🐱', 'animals-nature'],
      [4, '🍎', 'food-drink'],
      [5, '🏠️', 'travel-places'],
      [6, '⚽', 'activities'],
      [7, '📝', 'objects'],
      [8, '⛔️', 'symbols'],
      [9, '🏁', 'flags']
    ].map(([id, emoji, name]) => ({ id, emoji, name }));

    const groups = allGroups.slice(1);
    const customGroup = allGroups[0];

    const MIN_SEARCH_TEXT_LENGTH = 2;
    const NUM_SKIN_TONES = 6;

    /* istanbul ignore next */
    const rIC = typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout;

    // check for ZWJ (zero width joiner) character
    function hasZwj (emoji) {
      return emoji.unicode.includes('\u200d')
    }

    // Find one good representative emoji from each version to test by checking its color.
    // Ideally it should have color in the center. For some inspiration, see:
    // https://about.gitlab.com/blog/2018/05/30/journey-in-native-unicode-emoji/
    //
    // Note that for certain versions (12.1, 13.1), there is no point in testing them explicitly, because
    // all the emoji from this version are compound-emoji from previous versions. So they would pass a color
    // test, even in browsers that display them as double emoji. (E.g. "face in clouds" might render as
    // "face without mouth" plus "fog".) These emoji can only be filtered using the width test,
    // which happens in checkZwjSupport.js.
    const versionsAndTestEmoji = {
      '🫠': 14,
      '🥲': 13.1, // smiling face with tear, technically from v13 but see note above
      '🥻': 12.1, // sari, technically from v12 but see note above
      '🥰': 11,
      '🤩': 5,
      '👱‍♀️': 4,
      '🤣': 3,
      '👁️‍🗨️': 2,
      '😀': 1,
      '😐️': 0.7,
      '😃': 0.6
    };

    const TIMEOUT_BEFORE_LOADING_MESSAGE = 1000; // 1 second
    const DEFAULT_SKIN_TONE_EMOJI = '🖐️';
    const DEFAULT_NUM_COLUMNS = 8;

    // Based on https://fivethirtyeight.com/features/the-100-most-used-emojis/ and
    // https://blog.emojipedia.org/facebook-reveals-most-and-least-used-emojis/ with
    // a bit of my own curation. (E.g. avoid the "OK" gesture because of connotations:
    // https://emojipedia.org/ok-hand/)
    const MOST_COMMONLY_USED_EMOJI = [
      '😊',
      '😒',
      '♥️',
      '👍️',
      '😍',
      '😂',
      '😭',
      '☺️',
      '😔',
      '😩',
      '😏',
      '💕',
      '🙌',
      '😘'
    ];

    // It's important to list Twemoji Mozilla before everything else, because Mozilla bundles their
    // own font on some platforms (notably Windows and Linux as of this writing). Typically Mozilla
    // updates faster than the underlying OS, and we don't want to render older emoji in one font and
    // newer emoji in another font:
    // https://github.com/nolanlawson/emoji-picker-element/pull/268#issuecomment-1073347283
    const FONT_FAMILY = '"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",' +
      '"Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif';

    /* istanbul ignore next */
    const DEFAULT_CATEGORY_SORTING = (a, b) => a < b ? -1 : a > b ? 1 : 0;

    // Test if an emoji is supported by rendering it to canvas and checking that the color is not black

    const getTextFeature = (text, color) => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;

      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = `100px ${FONT_FAMILY}`;
      ctx.fillStyle = color;
      ctx.scale(0.01, 0.01);
      ctx.fillText(text, 0, 0);

      return ctx.getImageData(0, 0, 1, 1).data
    };

    const compareFeatures = (feature1, feature2) => {
      const feature1Str = [...feature1].join(',');
      const feature2Str = [...feature2].join(',');
      // This is RGBA, so for 0,0,0, we are checking that the first RGB is not all zeroes.
      // Most of the time when unsupported this is 0,0,0,0, but on Chrome on Mac it is
      // 0,0,0,61 - there is a transparency here.
      return feature1Str === feature2Str && !feature1Str.startsWith('0,0,0,')
    };

    function testColorEmojiSupported (text) {
      // Render white and black and then compare them to each other and ensure they're the same
      // color, and neither one is black. This shows that the emoji was rendered in color.
      const feature1 = getTextFeature(text, '#000');
      const feature2 = getTextFeature(text, '#fff');
      return feature1 && feature2 && compareFeatures(feature1, feature2)
    }

    // rather than check every emoji ever, which would be expensive, just check some representatives from the

    function determineEmojiSupportLevel () {
      const entries = Object.entries(versionsAndTestEmoji);
      try {
        // start with latest emoji and work backwards
        for (const [emoji, version] of entries) {
          if (testColorEmojiSupported(emoji)) {
            return version
          }
        }
      } catch (e) { // canvas error
      } finally {
      }
      // In case of an error, be generous and just assume all emoji are supported (e.g. for canvas errors
      // due to anti-fingerprinting add-ons). Better to show some gray boxes than nothing at all.
      return entries[0][1] // first one in the list is the most recent version
    }

    // Check which emojis we know for sure aren't supported, based on Unicode version level
    const emojiSupportLevelPromise = new Promise(resolve => (
      rIC(() => (
        resolve(determineEmojiSupportLevel()) // delay so ideally this can run while IDB is first populating
      ))
    ));
    // determine which emojis containing ZWJ (zero width joiner) characters
    // are supported (rendered as one glyph) rather than unsupported (rendered as two or more glyphs)
    const supportedZwjEmojis = new Map();

    const VARIATION_SELECTOR = '\ufe0f';
    const SKINTONE_MODIFIER = '\ud83c';
    const ZWJ = '\u200d';
    const LIGHT_SKIN_TONE = 0x1F3FB;
    const LIGHT_SKIN_TONE_MODIFIER = 0xdffb;

    // TODO: this is a naive implementation, we can improve it later
    // It's only used for the skintone picker, so as long as people don't customize with
    // really exotic emoji then it should work fine
    function applySkinTone (str, skinTone) {
      if (skinTone === 0) {
        return str
      }
      const zwjIndex = str.indexOf(ZWJ);
      if (zwjIndex !== -1) {
        return str.substring(0, zwjIndex) +
          String.fromCodePoint(LIGHT_SKIN_TONE + skinTone - 1) +
          str.substring(zwjIndex)
      }
      if (str.endsWith(VARIATION_SELECTOR)) {
        str = str.substring(0, str.length - 1);
      }
      return str + SKINTONE_MODIFIER + String.fromCodePoint(LIGHT_SKIN_TONE_MODIFIER + skinTone - 1)
    }

    function halt (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Implementation left/right or up/down navigation, circling back when you
    // reach the start/end of the list
    function incrementOrDecrement (decrement, val, arr) {
      val += (decrement ? -1 : 1);
      if (val < 0) {
        val = arr.length - 1;
      } else if (val >= arr.length) {
        val = 0;
      }
      return val
    }

    // like lodash's uniqBy but much smaller
    function uniqBy (arr, func) {
      const set = new Set();
      const res = [];
      for (const item of arr) {
        const key = func(item);
        if (!set.has(key)) {
          set.add(key);
          res.push(item);
        }
      }
      return res
    }

    // We don't need all the data on every emoji, and there are specific things we need
    // for the UI, so build a "view model" from the emoji object we got from the database

    function summarizeEmojisForUI (emojis, emojiSupportLevel) {
      const toSimpleSkinsMap = skins => {
        const res = {};
        for (const skin of skins) {
          // ignore arrays like [1, 2] with multiple skin tones
          // also ignore variants that are in an unsupported emoji version
          // (these do exist - variants from a different version than their base emoji)
          if (typeof skin.tone === 'number' && skin.version <= emojiSupportLevel) {
            res[skin.tone] = skin.unicode;
          }
        }
        return res
      };

      return emojis.map(({ unicode, skins, shortcodes, url, name, category }) => ({
        unicode,
        name,
        shortcodes,
        url,
        category,
        id: unicode || name,
        skins: skins && toSimpleSkinsMap(skins),
        title: (shortcodes || []).join(', ')
      }))
    }

    // import rAF from one place so that the bundle size is a bit smaller
    const rAF = requestAnimationFrame;

    // Svelte action to calculate the width of an element and auto-update

    let resizeObserverSupported = typeof ResizeObserver === 'function';

    function calculateWidth (node, onUpdate) {
      let resizeObserver;
      if (resizeObserverSupported) {
        resizeObserver = new ResizeObserver(entries => (
          onUpdate(entries[0].contentRect.width)
        ));
        resizeObserver.observe(node);
      } else { // just set the width once, don't bother trying to track it
        rAF(() => (
          onUpdate(node.getBoundingClientRect().width)
        ));
      }

      // cleanup function (called on destroy)
      return {
        destroy () {
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
        }
      }
    }

    // get the width of the text inside of a DOM node, via https://stackoverflow.com/a/59525891/680742
    function calculateTextWidth (node) {
      /* istanbul ignore else */
      {
        const range = document.createRange();
        range.selectNode(node.firstChild);
        return range.getBoundingClientRect().width
      }
    }

    let baselineEmojiWidth;

    function checkZwjSupport (zwjEmojisToCheck, baselineEmoji, emojiToDomNode) {
      for (const emoji of zwjEmojisToCheck) {
        const domNode = emojiToDomNode(emoji);
        const emojiWidth = calculateTextWidth(domNode);
        if (typeof baselineEmojiWidth === 'undefined') { // calculate the baseline emoji width only once
          baselineEmojiWidth = calculateTextWidth(baselineEmoji);
        }
        // On Windows, some supported emoji are ~50% bigger than the baseline emoji, but what we really want to guard
        // against are the ones that are 2x the size, because those are truly broken (person with red hair = person with
        // floating red wig, black cat = cat with black square, polar bear = bear with snowflake, etc.)
        // So here we set the threshold at 1.8 times the size of the baseline emoji.
        const supported = emojiWidth / 1.8 < baselineEmojiWidth;
        supportedZwjEmojis.set(emoji.unicode, supported);
      }
    }

    // like lodash's uniq

    function uniq (arr) {
      return uniqBy(arr, _ => _)
    }

    /* src/picker/components/Picker/Picker.svelte generated by Svelte v3.46.4 */

    const { Map: Map_1 } = globals;

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	child_ctx[65] = i;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	child_ctx[65] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	child_ctx[65] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	child_ctx[65] = i;
    	return child_ctx;
    }

    // (43:38) {#each skinTones as skinTone, i (skinTone)}
    function create_each_block_4(key_1, ctx) {
    	let div;
    	let t_value = /*skinTone*/ ctx[72] + "";
    	let t;
    	let div_id_value;
    	let div_class_value;
    	let div_aria_selected_value;
    	let div_title_value;
    	let div_aria_label_value;

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			div = element("div");
    			t = text(t_value);
    			attr(div, "id", div_id_value = "skintone-" + /*i*/ ctx[65]);

    			attr(div, "class", div_class_value = "emoji hide-focus " + (/*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]
    			? 'active'
    			: ''));

    			attr(div, "aria-selected", div_aria_selected_value = /*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]);
    			attr(div, "role", "option");
    			attr(div, "title", div_title_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]]);
    			attr(div, "tabindex", "-1");
    			attr(div, "aria-label", div_aria_label_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]]);
    			this.first = div;
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, t);
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*skinTones*/ 512 && t_value !== (t_value = /*skinTone*/ ctx[72] + "")) set_data(t, t_value);

    			if (dirty[0] & /*skinTones*/ 512 && div_id_value !== (div_id_value = "skintone-" + /*i*/ ctx[65])) {
    				attr(div, "id", div_id_value);
    			}

    			if (dirty[0] & /*skinTones, activeSkinTone*/ 1049088 && div_class_value !== (div_class_value = "emoji hide-focus " + (/*i*/ ctx[65] === /*activeSkinTone*/ ctx[20]
    			? 'active'
    			: ''))) {
    				attr(div, "class", div_class_value);
    			}

    			if (dirty[0] & /*skinTones, activeSkinTone*/ 1049088 && div_aria_selected_value !== (div_aria_selected_value = /*i*/ ctx[65] === /*activeSkinTone*/ ctx[20])) {
    				attr(div, "aria-selected", div_aria_selected_value);
    			}

    			if (dirty[0] & /*i18n, skinTones*/ 513 && div_title_value !== (div_title_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]])) {
    				attr(div, "title", div_title_value);
    			}

    			if (dirty[0] & /*i18n, skinTones*/ 513 && div_aria_label_value !== (div_aria_label_value = /*i18n*/ ctx[0].skinTones[/*i*/ ctx[65]])) {
    				attr(div, "aria-label", div_aria_label_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (53:33) {#each groups as group (group.id)}
    function create_each_block_3(key_1, ctx) {
    	let button;
    	let div;
    	let t_value = /*group*/ ctx[69].emoji + "";
    	let t;
    	let button_aria_controls_value;
    	let button_aria_label_value;
    	let button_aria_selected_value;
    	let button_title_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[49](/*group*/ ctx[69]);
    	}

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			button = element("button");
    			div = element("div");
    			t = text(t_value);
    			attr(div, "class", "nav-emoji emoji");
    			attr(button, "role", "tab");
    			attr(button, "class", "nav-button");
    			attr(button, "aria-controls", button_aria_controls_value = "tab-" + /*group*/ ctx[69].id);
    			attr(button, "aria-label", button_aria_label_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name]);
    			attr(button, "aria-selected", button_aria_selected_value = !/*searchMode*/ ctx[4] && /*currentGroup*/ ctx[13].id === /*group*/ ctx[69].id);
    			attr(button, "title", button_title_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name]);
    			this.first = button;
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, div);
    			append(div, t);

    			if (!mounted) {
    				dispose = listen(button, "click", click_handler);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*groups*/ 4096 && t_value !== (t_value = /*group*/ ctx[69].emoji + "")) set_data(t, t_value);

    			if (dirty[0] & /*groups*/ 4096 && button_aria_controls_value !== (button_aria_controls_value = "tab-" + /*group*/ ctx[69].id)) {
    				attr(button, "aria-controls", button_aria_controls_value);
    			}

    			if (dirty[0] & /*i18n, groups*/ 4097 && button_aria_label_value !== (button_aria_label_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name])) {
    				attr(button, "aria-label", button_aria_label_value);
    			}

    			if (dirty[0] & /*searchMode, currentGroup, groups*/ 12304 && button_aria_selected_value !== (button_aria_selected_value = !/*searchMode*/ ctx[4] && /*currentGroup*/ ctx[13].id === /*group*/ ctx[69].id)) {
    				attr(button, "aria-selected", button_aria_selected_value);
    			}

    			if (dirty[0] & /*i18n, groups*/ 4097 && button_title_value !== (button_title_value = /*i18n*/ ctx[0].categories[/*group*/ ctx[69].name])) {
    				attr(button, "title", button_title_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (93:100) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "class", "custom-emoji");
    			if (!src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "loading", "lazy");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && !src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) {
    				attr(img, "src", img_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (93:40) {#if emoji.unicode}
    function create_if_block_1$1(ctx) {
    	let t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*currentEmojisWithCategories, currentSkinTone*/ 33024 && t_value !== (t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (88:53) {#each emojiWithCategory.emojis as emoji, i (emoji.id)}
    function create_each_block_2(key_1, ctx) {
    	let button;
    	let button_role_value;
    	let button_aria_selected_value;
    	let button_aria_label_value;
    	let button_title_value;
    	let button_class_value;
    	let button_id_value;

    	function select_block_type(ctx, dirty) {
    		if (/*emoji*/ ctx[63].unicode) return create_if_block_1$1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			button = element("button");
    			if_block.c();
    			attr(button, "role", button_role_value = /*searchMode*/ ctx[4] ? 'option' : 'menuitem');

    			attr(button, "aria-selected", button_aria_selected_value = /*searchMode*/ ctx[4]
    			? /*i*/ ctx[65] == /*activeSearchItem*/ ctx[5]
    			: '');

    			attr(button, "aria-label", button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]));
    			attr(button, "title", button_title_value = /*emoji*/ ctx[63].title);

    			attr(button, "class", button_class_value = "emoji " + (/*searchMode*/ ctx[4] && /*i*/ ctx[65] === /*activeSearchItem*/ ctx[5]
    			? 'active'
    			: ''));

    			attr(button, "id", button_id_value = "emo-" + /*emoji*/ ctx[63].id);
    			this.first = button;
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			if_block.m(button, null);
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}

    			if (dirty[0] & /*searchMode*/ 16 && button_role_value !== (button_role_value = /*searchMode*/ ctx[4] ? 'option' : 'menuitem')) {
    				attr(button, "role", button_role_value);
    			}

    			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem*/ 32816 && button_aria_selected_value !== (button_aria_selected_value = /*searchMode*/ ctx[4]
    			? /*i*/ ctx[65] == /*activeSearchItem*/ ctx[5]
    			: '')) {
    				attr(button, "aria-selected", button_aria_selected_value);
    			}

    			if (dirty[0] & /*currentEmojisWithCategories, currentSkinTone*/ 33024 && button_aria_label_value !== (button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]))) {
    				attr(button, "aria-label", button_aria_label_value);
    			}

    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && button_title_value !== (button_title_value = /*emoji*/ ctx[63].title)) {
    				attr(button, "title", button_title_value);
    			}

    			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem*/ 32816 && button_class_value !== (button_class_value = "emoji " + (/*searchMode*/ ctx[4] && /*i*/ ctx[65] === /*activeSearchItem*/ ctx[5]
    			? 'active'
    			: ''))) {
    				attr(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && button_id_value !== (button_id_value = "emo-" + /*emoji*/ ctx[63].id)) {
    				attr(button, "id", button_id_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if_block.d();
    		}
    	};
    }

    // (69:36) {#each currentEmojisWithCategories as emojiWithCategory, i (emojiWithCategory.category)}
    function create_each_block_1$1(key_1, ctx) {
    	let div0;

    	let t_value = (/*searchMode*/ ctx[4]
    	? /*i18n*/ ctx[0].searchResultsLabel
    	: /*emojiWithCategory*/ ctx[66].category
    		? /*emojiWithCategory*/ ctx[66].category
    		: /*currentEmojisWithCategories*/ ctx[15].length > 1
    			? /*i18n*/ ctx[0].categories.custom
    			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]) + "";

    	let t;
    	let div0_id_value;
    	let div0_class_value;
    	let div1;
    	let each_blocks = [];
    	let each_1_lookup = new Map_1();
    	let div1_role_value;
    	let div1_aria_labelledby_value;
    	let div1_id_value;
    	let each_value_2 = /*emojiWithCategory*/ ctx[66].emojis;
    	const get_key = ctx => /*emoji*/ ctx[63].id;

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			div0 = element("div");
    			t = text(t_value);
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(div0, "id", div0_id_value = "menu-label-" + /*i*/ ctx[65]);

    			attr(div0, "class", div0_class_value = "category " + (/*currentEmojisWithCategories*/ ctx[15].length === 1 && /*currentEmojisWithCategories*/ ctx[15][0].category === ''
    			? 'gone'
    			: ''));

    			attr(div0, "aria-hidden", "true");
    			attr(div1, "class", "emoji-menu");
    			attr(div1, "role", div1_role_value = /*searchMode*/ ctx[4] ? 'listbox' : 'menu');
    			attr(div1, "aria-labelledby", div1_aria_labelledby_value = "menu-label-" + /*i*/ ctx[65]);
    			attr(div1, "id", div1_id_value = /*searchMode*/ ctx[4] ? 'search-results' : '');
    			this.first = div0;
    		},
    		m(target, anchor) {
    			insert(target, div0, anchor);
    			append(div0, t);
    			insert(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*searchMode, i18n, currentEmojisWithCategories, currentGroup*/ 40977 && t_value !== (t_value = (/*searchMode*/ ctx[4]
    			? /*i18n*/ ctx[0].searchResultsLabel
    			: /*emojiWithCategory*/ ctx[66].category
    				? /*emojiWithCategory*/ ctx[66].category
    				: /*currentEmojisWithCategories*/ ctx[15].length > 1
    					? /*i18n*/ ctx[0].categories.custom
    					: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]) + "")) set_data(t, t_value);

    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div0_id_value !== (div0_id_value = "menu-label-" + /*i*/ ctx[65])) {
    				attr(div0, "id", div0_id_value);
    			}

    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div0_class_value !== (div0_class_value = "category " + (/*currentEmojisWithCategories*/ ctx[15].length === 1 && /*currentEmojisWithCategories*/ ctx[15][0].category === ''
    			? 'gone'
    			: ''))) {
    				attr(div0, "class", div0_class_value);
    			}

    			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem, labelWithSkin, currentSkinTone, unicodeWithSkin*/ 402686256) {
    				each_value_2 = /*emojiWithCategory*/ ctx[66].emojis;
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div1, destroy_block, create_each_block_2, null, get_each_context_2);
    			}

    			if (dirty[0] & /*searchMode*/ 16 && div1_role_value !== (div1_role_value = /*searchMode*/ ctx[4] ? 'listbox' : 'menu')) {
    				attr(div1, "role", div1_role_value);
    			}

    			if (dirty[0] & /*currentEmojisWithCategories*/ 32768 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = "menu-label-" + /*i*/ ctx[65])) {
    				attr(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (dirty[0] & /*searchMode*/ 16 && div1_id_value !== (div1_id_value = /*searchMode*/ ctx[4] ? 'search-results' : '')) {
    				attr(div1, "id", div1_id_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div0);
    			if (detaching) detach(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};
    }

    // (102:94) {:else}
    function create_else_block$3(ctx) {
    	let img;
    	let img_src_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "class", "custom-emoji");
    			if (!src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) attr(img, "src", img_src_value);
    			attr(img, "alt", "");
    			attr(img, "loading", "lazy");
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*currentFavorites*/ 1024 && !src_url_equal(img.src, img_src_value = /*emoji*/ ctx[63].url)) {
    				attr(img, "src", img_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    // (102:34) {#if emoji.unicode}
    function create_if_block$6(ctx) {
    	let t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "";
    	let t;

    	return {
    		c() {
    			t = text(t_value);
    		},
    		m(target, anchor) {
    			insert(target, t, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*currentFavorites, currentSkinTone*/ 1280 && t_value !== (t_value = /*unicodeWithSkin*/ ctx[27](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]) + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(t);
    		}
    	};
    }

    // (98:102) {#each currentFavorites as emoji, i (emoji.id)}
    function create_each_block$2(key_1, ctx) {
    	let button;
    	let button_aria_label_value;
    	let button_title_value;
    	let button_id_value;

    	function select_block_type_1(ctx, dirty) {
    		if (/*emoji*/ ctx[63].unicode) return create_if_block$6;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	return {
    		key: key_1,
    		first: null,
    		c() {
    			button = element("button");
    			if_block.c();
    			attr(button, "role", "menuitem");
    			attr(button, "aria-label", button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]));
    			attr(button, "title", button_title_value = /*emoji*/ ctx[63].title);
    			attr(button, "class", "emoji");
    			attr(button, "id", button_id_value = "fav-" + /*emoji*/ ctx[63].id);
    			this.first = button;
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			if_block.m(button, null);
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}

    			if (dirty[0] & /*currentFavorites, currentSkinTone*/ 1280 && button_aria_label_value !== (button_aria_label_value = /*labelWithSkin*/ ctx[28](/*emoji*/ ctx[63], /*currentSkinTone*/ ctx[8]))) {
    				attr(button, "aria-label", button_aria_label_value);
    			}

    			if (dirty[0] & /*currentFavorites*/ 1024 && button_title_value !== (button_title_value = /*emoji*/ ctx[63].title)) {
    				attr(button, "title", button_title_value);
    			}

    			if (dirty[0] & /*currentFavorites*/ 1024 && button_id_value !== (button_id_value = "fav-" + /*emoji*/ ctx[63].id)) {
    				attr(button, "id", button_id_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			if_block.d();
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let section;
    	let div0;
    	let div4;
    	let div1;
    	let input;
    	let input_placeholder_value;
    	let input_aria_expanded_value;
    	let input_aria_activedescendant_value;
    	let label;
    	let t0_value = /*i18n*/ ctx[0].searchLabel + "";
    	let t0;
    	let span0;
    	let t1_value = /*i18n*/ ctx[0].searchDescription + "";
    	let t1;
    	let div2;
    	let button0;
    	let t2;
    	let button0_class_value;
    	let div2_class_value;
    	let span1;
    	let t3_value = /*i18n*/ ctx[0].skinToneDescription + "";
    	let t3;
    	let div3;
    	let each_blocks_3 = [];
    	let each0_lookup = new Map_1();
    	let div3_class_value;
    	let div3_aria_label_value;
    	let div3_aria_activedescendant_value;
    	let div3_aria_hidden_value;
    	let div5;
    	let each_blocks_2 = [];
    	let each1_lookup = new Map_1();
    	let div5_aria_label_value;
    	let div7;
    	let div6;
    	let div8;
    	let t4;
    	let div8_class_value;
    	let div10;
    	let div9;
    	let each_blocks_1 = [];
    	let each2_lookup = new Map_1();
    	let div10_class_value;
    	let div10_role_value;
    	let div10_aria_label_value;
    	let div10_id_value;
    	let div11;
    	let each_blocks = [];
    	let each3_lookup = new Map_1();
    	let div11_class_value;
    	let div11_aria_label_value;
    	let button1;
    	let section_aria_label_value;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*skinTones*/ ctx[9];
    	const get_key = ctx => /*skinTone*/ ctx[72];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_3[i] = create_each_block_4(key, child_ctx));
    	}

    	let each_value_3 = /*groups*/ ctx[12];
    	const get_key_1 = ctx => /*group*/ ctx[69].id;

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks_2[i] = create_each_block_3(key, child_ctx));
    	}

    	let each_value_1 = /*currentEmojisWithCategories*/ ctx[15];
    	const get_key_2 = ctx => /*emojiWithCategory*/ ctx[66].category;

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key_2(child_ctx);
    		each2_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
    	}

    	let each_value = /*currentFavorites*/ ctx[10];
    	const get_key_3 = ctx => /*emoji*/ ctx[63].id;

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key_3(child_ctx);
    		each3_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	return {
    		c() {
    			section = element("section");
    			div0 = element("div");
    			div4 = element("div");
    			div1 = element("div");
    			input = element("input");
    			label = element("label");
    			t0 = text(t0_value);
    			span0 = element("span");
    			t1 = text(t1_value);
    			div2 = element("div");
    			button0 = element("button");
    			t2 = text(/*skinToneButtonText*/ ctx[21]);
    			span1 = element("span");
    			t3 = text(t3_value);
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			div7 = element("div");
    			div6 = element("div");
    			div8 = element("div");
    			t4 = text(/*message*/ ctx[18]);
    			div10 = element("div");
    			div9 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			div11 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			button1 = element("button");
    			button1.textContent = "😀";
    			attr(div0, "class", "pad-top");
    			attr(input, "id", "search");
    			attr(input, "class", "search");
    			attr(input, "type", "search");
    			attr(input, "role", "combobox");
    			attr(input, "enterkeyhint", "search");
    			attr(input, "placeholder", input_placeholder_value = /*i18n*/ ctx[0].searchLabel);
    			attr(input, "autocapitalize", "none");
    			attr(input, "autocomplete", "off");
    			attr(input, "spellcheck", "true");
    			attr(input, "aria-expanded", input_aria_expanded_value = !!(/*searchMode*/ ctx[4] && /*currentEmojis*/ ctx[1].length));
    			attr(input, "aria-controls", "search-results");
    			attr(input, "aria-describedby", "search-description");
    			attr(input, "aria-autocomplete", "list");

    			attr(input, "aria-activedescendant", input_aria_activedescendant_value = /*activeSearchItemId*/ ctx[26]
    			? `emo-${/*activeSearchItemId*/ ctx[26]}`
    			: '');

    			attr(label, "class", "sr-only");
    			attr(label, "for", "search");
    			attr(span0, "id", "search-description");
    			attr(span0, "class", "sr-only");
    			attr(div1, "class", "search-wrapper");
    			attr(button0, "id", "skintone-button");
    			attr(button0, "class", button0_class_value = "emoji " + (/*skinTonePickerExpanded*/ ctx[6] ? 'hide-focus' : ''));
    			attr(button0, "aria-label", /*skinToneButtonLabel*/ ctx[23]);
    			attr(button0, "title", /*skinToneButtonLabel*/ ctx[23]);
    			attr(button0, "aria-describedby", "skintone-description");
    			attr(button0, "aria-haspopup", "listbox");
    			attr(button0, "aria-expanded", /*skinTonePickerExpanded*/ ctx[6]);
    			attr(button0, "aria-controls", "skintone-list");

    			attr(div2, "class", div2_class_value = "skintone-button-wrapper " + (/*skinTonePickerExpandedAfterAnimation*/ ctx[19]
    			? 'expanded'
    			: ''));

    			attr(span1, "id", "skintone-description");
    			attr(span1, "class", "sr-only");
    			attr(div3, "id", "skintone-list");

    			attr(div3, "class", div3_class_value = "skintone-list " + (/*skinTonePickerExpanded*/ ctx[6]
    			? ''
    			: 'hidden no-animate'));

    			set_style(div3, "transform", "translateY(" + (/*skinTonePickerExpanded*/ ctx[6]
    			? 0
    			: 'calc(-1 * var(--num-skintones) * var(--total-emoji-size))') + ")");

    			attr(div3, "role", "listbox");
    			attr(div3, "aria-label", div3_aria_label_value = /*i18n*/ ctx[0].skinTonesLabel);
    			attr(div3, "aria-activedescendant", div3_aria_activedescendant_value = "skintone-" + /*activeSkinTone*/ ctx[20]);
    			attr(div3, "aria-hidden", div3_aria_hidden_value = !/*skinTonePickerExpanded*/ ctx[6]);
    			attr(div4, "class", "search-row");
    			attr(div5, "class", "nav");
    			attr(div5, "role", "tablist");
    			set_style(div5, "grid-template-columns", "repeat(" + /*groups*/ ctx[12].length + ", 1fr)");
    			attr(div5, "aria-label", div5_aria_label_value = /*i18n*/ ctx[0].categoriesLabel);
    			attr(div6, "class", "indicator");
    			set_style(div6, "transform", "translateX(" + (/*isRtl*/ ctx[24] ? -1 : 1) * /*currentGroupIndex*/ ctx[11] * 100 + "%)");
    			attr(div7, "class", "indicator-wrapper");
    			attr(div8, "class", div8_class_value = "message " + (/*message*/ ctx[18] ? '' : 'gone'));
    			attr(div8, "role", "alert");
    			attr(div8, "aria-live", "polite");

    			attr(div10, "class", div10_class_value = "tabpanel " + (!/*databaseLoaded*/ ctx[14] || /*message*/ ctx[18]
    			? 'gone'
    			: ''));

    			attr(div10, "role", div10_role_value = /*searchMode*/ ctx[4] ? 'region' : 'tabpanel');

    			attr(div10, "aria-label", div10_aria_label_value = /*searchMode*/ ctx[4]
    			? /*i18n*/ ctx[0].searchResultsLabel
    			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name]);

    			attr(div10, "id", div10_id_value = /*searchMode*/ ctx[4]
    			? ''
    			: `tab-${/*currentGroup*/ ctx[13].id}`);

    			attr(div10, "tabindex", "0");
    			attr(div11, "class", div11_class_value = "favorites emoji-menu " + (/*message*/ ctx[18] ? 'gone' : ''));
    			attr(div11, "role", "menu");
    			attr(div11, "aria-label", div11_aria_label_value = /*i18n*/ ctx[0].favoritesLabel);
    			set_style(div11, "padding-inline-end", /*scrollbarWidth*/ ctx[25] + "px");
    			attr(button1, "aria-hidden", "true");
    			attr(button1, "tabindex", "-1");
    			attr(button1, "class", "abs-pos hidden emoji");
    			attr(section, "class", "picker");
    			attr(section, "aria-label", section_aria_label_value = /*i18n*/ ctx[0].regionLabel);
    			attr(section, "style", /*pickerStyle*/ ctx[22]);
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, div0);
    			append(section, div4);
    			append(div4, div1);
    			append(div1, input);
    			set_input_value(input, /*rawSearchText*/ ctx[2]);
    			append(div1, label);
    			append(label, t0);
    			append(div1, span0);
    			append(span0, t1);
    			append(div4, div2);
    			append(div2, button0);
    			append(button0, t2);
    			append(div4, span1);
    			append(span1, t3);
    			append(div4, div3);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div3, null);
    			}

    			/*div3_binding*/ ctx[48](div3);
    			append(section, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append(section, div7);
    			append(div7, div6);
    			append(section, div8);
    			append(div8, t4);
    			append(section, div10);
    			append(div10, div9);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div9, null);
    			}

    			/*div10_binding*/ ctx[50](div10);
    			append(section, div11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div11, null);
    			}

    			append(section, button1);
    			/*button1_binding*/ ctx[51](button1);
    			/*section_binding*/ ctx[52](section);

    			if (!mounted) {
    				dispose = [
    					listen(input, "input", /*input_input_handler*/ ctx[47]),
    					listen(input, "keydown", /*onSearchKeydown*/ ctx[30]),
    					listen(button0, "click", /*onClickSkinToneButton*/ ctx[35]),
    					listen(div3, "focusout", /*onSkinToneOptionsFocusOut*/ ctx[38]),
    					listen(div3, "click", /*onSkinToneOptionsClick*/ ctx[34]),
    					listen(div3, "keydown", /*onSkinToneOptionsKeydown*/ ctx[36]),
    					listen(div3, "keyup", /*onSkinToneOptionsKeyup*/ ctx[37]),
    					listen(div5, "keydown", /*onNavKeydown*/ ctx[32]),
    					action_destroyer(/*calculateEmojiGridStyle*/ ctx[29].call(null, div9)),
    					listen(div10, "click", /*onEmojiClick*/ ctx[33]),
    					listen(div11, "click", /*onEmojiClick*/ ctx[33])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*i18n*/ 1 && input_placeholder_value !== (input_placeholder_value = /*i18n*/ ctx[0].searchLabel)) {
    				attr(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty[0] & /*searchMode, currentEmojis*/ 18 && input_aria_expanded_value !== (input_aria_expanded_value = !!(/*searchMode*/ ctx[4] && /*currentEmojis*/ ctx[1].length))) {
    				attr(input, "aria-expanded", input_aria_expanded_value);
    			}

    			if (dirty[0] & /*activeSearchItemId*/ 67108864 && input_aria_activedescendant_value !== (input_aria_activedescendant_value = /*activeSearchItemId*/ ctx[26]
    			? `emo-${/*activeSearchItemId*/ ctx[26]}`
    			: '')) {
    				attr(input, "aria-activedescendant", input_aria_activedescendant_value);
    			}

    			if (dirty[0] & /*rawSearchText*/ 4) {
    				set_input_value(input, /*rawSearchText*/ ctx[2]);
    			}

    			if (dirty[0] & /*i18n*/ 1 && t0_value !== (t0_value = /*i18n*/ ctx[0].searchLabel + "")) set_data(t0, t0_value);
    			if (dirty[0] & /*i18n*/ 1 && t1_value !== (t1_value = /*i18n*/ ctx[0].searchDescription + "")) set_data(t1, t1_value);
    			if (dirty[0] & /*skinToneButtonText*/ 2097152) set_data(t2, /*skinToneButtonText*/ ctx[21]);

    			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && button0_class_value !== (button0_class_value = "emoji " + (/*skinTonePickerExpanded*/ ctx[6] ? 'hide-focus' : ''))) {
    				attr(button0, "class", button0_class_value);
    			}

    			if (dirty[0] & /*skinToneButtonLabel*/ 8388608) {
    				attr(button0, "aria-label", /*skinToneButtonLabel*/ ctx[23]);
    			}

    			if (dirty[0] & /*skinToneButtonLabel*/ 8388608) {
    				attr(button0, "title", /*skinToneButtonLabel*/ ctx[23]);
    			}

    			if (dirty[0] & /*skinTonePickerExpanded*/ 64) {
    				attr(button0, "aria-expanded", /*skinTonePickerExpanded*/ ctx[6]);
    			}

    			if (dirty[0] & /*skinTonePickerExpandedAfterAnimation*/ 524288 && div2_class_value !== (div2_class_value = "skintone-button-wrapper " + (/*skinTonePickerExpandedAfterAnimation*/ ctx[19]
    			? 'expanded'
    			: ''))) {
    				attr(div2, "class", div2_class_value);
    			}

    			if (dirty[0] & /*i18n*/ 1 && t3_value !== (t3_value = /*i18n*/ ctx[0].skinToneDescription + "")) set_data(t3, t3_value);

    			if (dirty[0] & /*skinTones, activeSkinTone, i18n*/ 1049089) {
    				each_value_4 = /*skinTones*/ ctx[9];
    				each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx, each_value_4, each0_lookup, div3, destroy_block, create_each_block_4, null, get_each_context_4);
    			}

    			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && div3_class_value !== (div3_class_value = "skintone-list " + (/*skinTonePickerExpanded*/ ctx[6]
    			? ''
    			: 'hidden no-animate'))) {
    				attr(div3, "class", div3_class_value);
    			}

    			if (dirty[0] & /*skinTonePickerExpanded*/ 64) {
    				set_style(div3, "transform", "translateY(" + (/*skinTonePickerExpanded*/ ctx[6]
    				? 0
    				: 'calc(-1 * var(--num-skintones) * var(--total-emoji-size))') + ")");
    			}

    			if (dirty[0] & /*i18n*/ 1 && div3_aria_label_value !== (div3_aria_label_value = /*i18n*/ ctx[0].skinTonesLabel)) {
    				attr(div3, "aria-label", div3_aria_label_value);
    			}

    			if (dirty[0] & /*activeSkinTone*/ 1048576 && div3_aria_activedescendant_value !== (div3_aria_activedescendant_value = "skintone-" + /*activeSkinTone*/ ctx[20])) {
    				attr(div3, "aria-activedescendant", div3_aria_activedescendant_value);
    			}

    			if (dirty[0] & /*skinTonePickerExpanded*/ 64 && div3_aria_hidden_value !== (div3_aria_hidden_value = !/*skinTonePickerExpanded*/ ctx[6])) {
    				attr(div3, "aria-hidden", div3_aria_hidden_value);
    			}

    			if (dirty[0] & /*groups, i18n, searchMode, currentGroup*/ 12305 | dirty[1] & /*onNavClick*/ 1) {
    				each_value_3 = /*groups*/ ctx[12];
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx, each_value_3, each1_lookup, div5, destroy_block, create_each_block_3, null, get_each_context_3);
    			}

    			if (dirty[0] & /*groups*/ 4096) {
    				set_style(div5, "grid-template-columns", "repeat(" + /*groups*/ ctx[12].length + ", 1fr)");
    			}

    			if (dirty[0] & /*i18n*/ 1 && div5_aria_label_value !== (div5_aria_label_value = /*i18n*/ ctx[0].categoriesLabel)) {
    				attr(div5, "aria-label", div5_aria_label_value);
    			}

    			if (dirty[0] & /*isRtl, currentGroupIndex*/ 16779264) {
    				set_style(div6, "transform", "translateX(" + (/*isRtl*/ ctx[24] ? -1 : 1) * /*currentGroupIndex*/ ctx[11] * 100 + "%)");
    			}

    			if (dirty[0] & /*message*/ 262144) set_data(t4, /*message*/ ctx[18]);

    			if (dirty[0] & /*message*/ 262144 && div8_class_value !== (div8_class_value = "message " + (/*message*/ ctx[18] ? '' : 'gone'))) {
    				attr(div8, "class", div8_class_value);
    			}

    			if (dirty[0] & /*searchMode, currentEmojisWithCategories, activeSearchItem, labelWithSkin, currentSkinTone, unicodeWithSkin, i18n, currentGroup*/ 402694449) {
    				each_value_1 = /*currentEmojisWithCategories*/ ctx[15];
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_2, 1, ctx, each_value_1, each2_lookup, div9, destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    			}

    			if (dirty[0] & /*databaseLoaded, message*/ 278528 && div10_class_value !== (div10_class_value = "tabpanel " + (!/*databaseLoaded*/ ctx[14] || /*message*/ ctx[18]
    			? 'gone'
    			: ''))) {
    				attr(div10, "class", div10_class_value);
    			}

    			if (dirty[0] & /*searchMode*/ 16 && div10_role_value !== (div10_role_value = /*searchMode*/ ctx[4] ? 'region' : 'tabpanel')) {
    				attr(div10, "role", div10_role_value);
    			}

    			if (dirty[0] & /*searchMode, i18n, currentGroup*/ 8209 && div10_aria_label_value !== (div10_aria_label_value = /*searchMode*/ ctx[4]
    			? /*i18n*/ ctx[0].searchResultsLabel
    			: /*i18n*/ ctx[0].categories[/*currentGroup*/ ctx[13].name])) {
    				attr(div10, "aria-label", div10_aria_label_value);
    			}

    			if (dirty[0] & /*searchMode, currentGroup*/ 8208 && div10_id_value !== (div10_id_value = /*searchMode*/ ctx[4]
    			? ''
    			: `tab-${/*currentGroup*/ ctx[13].id}`)) {
    				attr(div10, "id", div10_id_value);
    			}

    			if (dirty[0] & /*labelWithSkin, currentFavorites, currentSkinTone, unicodeWithSkin*/ 402654464) {
    				each_value = /*currentFavorites*/ ctx[10];
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_3, 1, ctx, each_value, each3_lookup, div11, destroy_block, create_each_block$2, null, get_each_context$2);
    			}

    			if (dirty[0] & /*message*/ 262144 && div11_class_value !== (div11_class_value = "favorites emoji-menu " + (/*message*/ ctx[18] ? 'gone' : ''))) {
    				attr(div11, "class", div11_class_value);
    			}

    			if (dirty[0] & /*i18n*/ 1 && div11_aria_label_value !== (div11_aria_label_value = /*i18n*/ ctx[0].favoritesLabel)) {
    				attr(div11, "aria-label", div11_aria_label_value);
    			}

    			if (dirty[0] & /*scrollbarWidth*/ 33554432) {
    				set_style(div11, "padding-inline-end", /*scrollbarWidth*/ ctx[25] + "px");
    			}

    			if (dirty[0] & /*i18n*/ 1 && section_aria_label_value !== (section_aria_label_value = /*i18n*/ ctx[0].regionLabel)) {
    				attr(section, "aria-label", section_aria_label_value);
    			}

    			if (dirty[0] & /*pickerStyle*/ 4194304) {
    				attr(section, "style", /*pickerStyle*/ ctx[22]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(section);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].d();
    			}

    			/*div3_binding*/ ctx[48](null);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			/*div10_binding*/ ctx[50](null);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*button1_binding*/ ctx[51](null);
    			/*section_binding*/ ctx[52](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { skinToneEmoji } = $$props;
    	let { i18n } = $$props;
    	let { database } = $$props;
    	let { customEmoji } = $$props;
    	let { customCategorySorting } = $$props;

    	// private
    	let initialLoad = true;

    	let currentEmojis = [];
    	let currentEmojisWithCategories = []; // eslint-disable-line no-unused-vars
    	let rawSearchText = '';
    	let searchText = '';
    	let rootElement;
    	let baselineEmoji;
    	let tabpanelElement;
    	let searchMode = false; // eslint-disable-line no-unused-vars
    	let activeSearchItem = -1;
    	let message; // eslint-disable-line no-unused-vars
    	let skinTonePickerExpanded = false;
    	let skinTonePickerExpandedAfterAnimation = false; // eslint-disable-line no-unused-vars
    	let skinToneDropdown;
    	let currentSkinTone = 0;
    	let activeSkinTone = 0;
    	let skinToneButtonText; // eslint-disable-line no-unused-vars
    	let pickerStyle; // eslint-disable-line no-unused-vars
    	let skinToneButtonLabel = ''; // eslint-disable-line no-unused-vars
    	let skinTones = [];
    	let currentFavorites = []; // eslint-disable-line no-unused-vars
    	let defaultFavoriteEmojis;
    	let numColumns = DEFAULT_NUM_COLUMNS;
    	let isRtl = false;
    	let scrollbarWidth = 0; // eslint-disable-line no-unused-vars
    	let currentGroupIndex = 0;
    	let groups$1 = groups;
    	let currentGroup;
    	let databaseLoaded = false; // eslint-disable-line no-unused-vars
    	let activeSearchItemId; // eslint-disable-line no-unused-vars

    	//
    	// Utils/helpers
    	//
    	const focus = id => {
    		rootElement.getRootNode().getElementById(id).focus();
    	};

    	// fire a custom event that crosses the shadow boundary
    	const fireEvent = (name, detail) => {
    		rootElement.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
    	};

    	// eslint-disable-next-line no-unused-vars
    	const unicodeWithSkin = (emoji, currentSkinTone) => currentSkinTone && emoji.skins && emoji.skins[currentSkinTone] || emoji.unicode;

    	// eslint-disable-next-line no-unused-vars
    	const labelWithSkin = (emoji, currentSkinTone) => uniq([
    		emoji.name || unicodeWithSkin(emoji, currentSkinTone),
    		...emoji.shortcodes || []
    	]).join(', ');

    	// Detect a skintone option button
    	const isSkinToneOption = element => (/^skintone-/).test(element.id);

    	//
    	// Determine the emoji support level (in requestIdleCallback)
    	//
    	emojiSupportLevelPromise.then(level => {
    		// Can't actually test emoji support in Jest/JSDom, emoji never render in color in Cairo
    		/* istanbul ignore next */
    		if (!level) {
    			$$invalidate(18, message = i18n.emojiUnsupportedMessage);
    		}
    	});

    	//
    	// Calculate the width of the emoji grid. This serves two purposes:
    	// 1) Re-calculate the --num-columns var because it may have changed
    	// 2) Re-calculate the scrollbar width because it may have changed
    	//   (i.e. because the number of items changed)
    	// 3) Re-calculate whether we're in RTL mode or not.
    	//
    	// The benefit of doing this in one place is to align with rAF/ResizeObserver
    	// and do all the calculations in one go. RTL vs LTR is not strictly width-related,
    	// but since we're already reading the style here, and since it's already aligned with
    	// the rAF loop, this is the most appropriate place to do it perf-wise.
    	//
    	// eslint-disable-next-line no-unused-vars
    	function calculateEmojiGridStyle(node) {
    		return calculateWidth(node, width => {
    			/* istanbul ignore next */
    			{
    				// jsdom throws errors for this kind of fancy stuff
    				// read all the style/layout calculations we need to make
    				const style = getComputedStyle(rootElement);

    				const newNumColumns = parseInt(style.getPropertyValue('--num-columns'), 10);
    				const newIsRtl = style.getPropertyValue('direction') === 'rtl';
    				const parentWidth = node.parentElement.getBoundingClientRect().width;
    				const newScrollbarWidth = parentWidth - width;

    				// write to Svelte variables
    				$$invalidate(46, numColumns = newNumColumns);

    				$$invalidate(25, scrollbarWidth = newScrollbarWidth); // eslint-disable-line no-unused-vars
    				$$invalidate(24, isRtl = newIsRtl); // eslint-disable-line no-unused-vars
    			}
    		});
    	}

    	function checkZwjSupportAndUpdate(zwjEmojisToCheck) {
    		const rootNode = rootElement.getRootNode();
    		const emojiToDomNode = emoji => rootNode.getElementById(`emo-${emoji.id}`);
    		checkZwjSupport(zwjEmojisToCheck, baselineEmoji, emojiToDomNode);

    		// force update
    		$$invalidate(1, currentEmojis = currentEmojis); // eslint-disable-line no-self-assign
    	}

    	function isZwjSupported(emoji) {
    		return !emoji.unicode || !hasZwj(emoji) || supportedZwjEmojis.get(emoji.unicode);
    	}

    	async function filterEmojisByVersion(emojis) {
    		const emojiSupportLevel = await emojiSupportLevelPromise;

    		// !version corresponds to custom emoji
    		return emojis.filter(({ version }) => !version || version <= emojiSupportLevel);
    	}

    	async function summarizeEmojis(emojis) {
    		return summarizeEmojisForUI(emojis, await emojiSupportLevelPromise);
    	}

    	async function getEmojisByGroup(group) {

    		if (typeof group === 'undefined') {
    			return [];
    		}

    		// -1 is custom emoji
    		const emoji = group === -1
    		? customEmoji
    		: await database.getEmojiByGroup(group);

    		return summarizeEmojis(await filterEmojisByVersion(emoji));
    	}

    	async function getEmojisBySearchQuery(query) {
    		return summarizeEmojis(await filterEmojisByVersion(await database.getEmojiBySearchQuery(query)));
    	}

    	// eslint-disable-next-line no-unused-vars
    	function onSearchKeydown(event) {
    		if (!searchMode || !currentEmojis.length) {
    			return;
    		}

    		const goToNextOrPrevious = previous => {
    			halt(event);
    			$$invalidate(5, activeSearchItem = incrementOrDecrement(previous, activeSearchItem, currentEmojis));
    		};

    		switch (event.key) {
    			case 'ArrowDown':
    				return goToNextOrPrevious(false);
    			case 'ArrowUp':
    				return goToNextOrPrevious(true);
    			case 'Enter':
    				if (activeSearchItem !== -1) {
    					halt(event);
    					return clickEmoji(currentEmojis[activeSearchItem].id);
    				} else if (currentEmojis.length) {
    					$$invalidate(5, activeSearchItem = 0);
    				}
    		}
    	}

    	//
    	// Handle user input on nav
    	//
    	// eslint-disable-next-line no-unused-vars
    	function onNavClick(group) {
    		$$invalidate(2, rawSearchText = '');
    		$$invalidate(44, searchText = '');
    		$$invalidate(5, activeSearchItem = -1);
    		$$invalidate(11, currentGroupIndex = groups$1.findIndex(_ => _.id === group.id));
    	}

    	// eslint-disable-next-line no-unused-vars
    	function onNavKeydown(event) {
    		const { target, key } = event;

    		const doFocus = el => {
    			if (el) {
    				halt(event);
    				el.focus();
    			}
    		};

    		switch (key) {
    			case 'ArrowLeft':
    				return doFocus(target.previousSibling);
    			case 'ArrowRight':
    				return doFocus(target.nextSibling);
    			case 'Home':
    				return doFocus(target.parentElement.firstChild);
    			case 'End':
    				return doFocus(target.parentElement.lastChild);
    		}
    	}

    	//
    	// Handle user input on an emoji
    	//
    	async function clickEmoji(unicodeOrName) {
    		const emoji = await database.getEmojiByUnicodeOrName(unicodeOrName);
    		const emojiSummary = [...currentEmojis, ...currentFavorites].find(_ => _.id === unicodeOrName);
    		const skinTonedUnicode = emojiSummary.unicode && unicodeWithSkin(emojiSummary, currentSkinTone);
    		await database.incrementFavoriteEmojiCount(unicodeOrName);

    		fireEvent('emoji-click', {
    			emoji,
    			skinTone: currentSkinTone,
    			...skinTonedUnicode && { unicode: skinTonedUnicode },
    			...emojiSummary.name && { name: emojiSummary.name }
    		});
    	}

    	// eslint-disable-next-line no-unused-vars
    	async function onEmojiClick(event) {
    		const { target } = event;

    		if (!target.classList.contains('emoji')) {
    			return;
    		}

    		halt(event);
    		const id = target.id.substring(4); // replace 'emo-' or 'fav-' prefix

    		/* no await */
    		clickEmoji(id);
    	}

    	//
    	// Handle user input on the skintone picker
    	//
    	// eslint-disable-next-line no-unused-vars
    	async function onSkinToneOptionsClick(event) {
    		const { target } = event;

    		if (!isSkinToneOption(target)) {
    			return;
    		}

    		halt(event);
    		const skinTone = parseInt(target.id.slice(9), 10); // remove 'skintone-' prefix
    		$$invalidate(8, currentSkinTone = skinTone);
    		$$invalidate(6, skinTonePickerExpanded = false);
    		focus('skintone-button');
    		fireEvent('skin-tone-change', { skinTone });

    		/* no await */
    		database.setPreferredSkinTone(skinTone);
    	}

    	// eslint-disable-next-line no-unused-vars
    	async function onClickSkinToneButton(event) {
    		$$invalidate(6, skinTonePickerExpanded = !skinTonePickerExpanded);
    		$$invalidate(20, activeSkinTone = currentSkinTone);

    		if (skinTonePickerExpanded) {
    			halt(event);
    			rAF(() => focus(`skintone-${activeSkinTone}`));
    		}
    	}

    	// eslint-disable-next-line no-unused-vars
    	function onSkinToneOptionsKeydown(event) {
    		if (!skinTonePickerExpanded) {
    			return;
    		}

    		const changeActiveSkinTone = async nextSkinTone => {
    			halt(event);
    			$$invalidate(20, activeSkinTone = nextSkinTone);
    			await tick();
    			focus(`skintone-${activeSkinTone}`);
    		};

    		switch (event.key) {
    			case 'ArrowUp':
    				return changeActiveSkinTone(incrementOrDecrement(true, activeSkinTone, skinTones));
    			case 'ArrowDown':
    				return changeActiveSkinTone(incrementOrDecrement(false, activeSkinTone, skinTones));
    			case 'Home':
    				return changeActiveSkinTone(0);
    			case 'End':
    				return changeActiveSkinTone(skinTones.length - 1);
    			case 'Enter':
    				// enter on keydown, space on keyup. this is just how browsers work for buttons
    				// https://lists.w3.org/Archives/Public/w3c-wai-ig/2019JanMar/0086.html
    				return onSkinToneOptionsClick(event);
    			case 'Escape':
    				halt(event);
    				$$invalidate(6, skinTonePickerExpanded = false);
    				return focus('skintone-button');
    		}
    	}

    	// eslint-disable-next-line no-unused-vars
    	function onSkinToneOptionsKeyup(event) {
    		if (!skinTonePickerExpanded) {
    			return;
    		}

    		switch (event.key) {
    			case ' ':
    				// enter on keydown, space on keyup. this is just how browsers work for buttons
    				// https://lists.w3.org/Archives/Public/w3c-wai-ig/2019JanMar/0086.html
    				return onSkinToneOptionsClick(event);
    		}
    	}

    	// eslint-disable-next-line no-unused-vars
    	async function onSkinToneOptionsFocusOut(event) {
    		// On blur outside of the skintone options, collapse the skintone picker.
    		// Except if focus is just moving to another skintone option, e.g. pressing up/down to change focus
    		const { relatedTarget } = event;

    		if (!relatedTarget || !isSkinToneOption(relatedTarget)) {
    			$$invalidate(6, skinTonePickerExpanded = false);
    		}
    	}

    	function input_input_handler() {
    		rawSearchText = this.value;
    		$$invalidate(2, rawSearchText);
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			skinToneDropdown = $$value;
    			$$invalidate(7, skinToneDropdown);
    		});
    	}

    	const click_handler = group => onNavClick(group);

    	function div10_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tabpanelElement = $$value;
    			$$invalidate(3, tabpanelElement);
    		});
    	}

    	function button1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			baselineEmoji = $$value;
    			$$invalidate(17, baselineEmoji);
    		});
    	}

    	function section_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rootElement = $$value;
    			$$invalidate(16, rootElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('skinToneEmoji' in $$props) $$invalidate(40, skinToneEmoji = $$props.skinToneEmoji);
    		if ('i18n' in $$props) $$invalidate(0, i18n = $$props.i18n);
    		if ('database' in $$props) $$invalidate(39, database = $$props.database);
    		if ('customEmoji' in $$props) $$invalidate(41, customEmoji = $$props.customEmoji);
    		if ('customCategorySorting' in $$props) $$invalidate(42, customCategorySorting = $$props.customCategorySorting);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*customEmoji, database*/ 1280) {
    			/* eslint-enable no-unused-vars */
    			//
    			// Set or update the customEmoji
    			//
    			{
    				if (customEmoji && database) {
    					$$invalidate(39, database.customEmoji = customEmoji, database);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*i18n*/ 1 | $$self.$$.dirty[1] & /*database*/ 256) {
    			//
    			// Set or update the database object
    			//
    			{
    				// show a Loading message if it takes a long time, or show an error if there's a network/IDB error
    				async function handleDatabaseLoading() {
    					let showingLoadingMessage = false;

    					const timeoutHandle = setTimeout(
    						() => {
    							showingLoadingMessage = true;
    							$$invalidate(18, message = i18n.loadingMessage);
    						},
    						TIMEOUT_BEFORE_LOADING_MESSAGE
    					);

    					try {
    						await database.ready();
    						$$invalidate(14, databaseLoaded = true); // eslint-disable-line no-unused-vars
    					} catch(err) {
    						console.error(err);
    						$$invalidate(18, message = i18n.networkErrorMessage);
    					} finally {
    						clearTimeout(timeoutHandle);

    						if (showingLoadingMessage) {
    							// Seems safer than checking the i18n string, which may change
    							showingLoadingMessage = false;

    							$$invalidate(18, message = ''); // eslint-disable-line no-unused-vars
    						}
    					}
    				}

    				if (database) {
    					/* no await */
    					handleDatabaseLoading();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*groups, currentGroupIndex*/ 6144 | $$self.$$.dirty[1] & /*customEmoji*/ 1024) {
    			{
    				if (customEmoji && customEmoji.length) {
    					$$invalidate(12, groups$1 = [customGroup, ...groups]);
    				} else if (groups$1 !== groups) {
    					if (currentGroupIndex) {
    						// If the current group is anything other than "custom" (which is first), decrement.
    						// This fixes the odd case where you set customEmoji, then pick a category, then unset customEmoji
    						$$invalidate(11, currentGroupIndex--, currentGroupIndex);
    					}

    					$$invalidate(12, groups$1 = groups);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*rawSearchText*/ 4) {
    			/* eslint-enable no-unused-vars */
    			//
    			// Handle user input on the search input
    			//
    			{
    				rIC(() => {
    					$$invalidate(44, searchText = (rawSearchText || '').trim()); // defer to avoid input delays, plus we can trim here
    					$$invalidate(5, activeSearchItem = -1);
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*groups, currentGroupIndex*/ 6144) {
    			//
    			// Update the current group based on the currentGroupIndex
    			//
    			$$invalidate(13, currentGroup = groups$1[currentGroupIndex]);
    		}

    		if ($$self.$$.dirty[0] & /*databaseLoaded, currentGroup*/ 24576 | $$self.$$.dirty[1] & /*searchText*/ 8192) {
    			//
    			// Set or update the currentEmojis. Check for invalid ZWJ renderings
    			// (i.e. double emoji).
    			//
    			{
    				async function updateEmojis() {

    					if (!databaseLoaded) {
    						$$invalidate(1, currentEmojis = []);
    						$$invalidate(4, searchMode = false);
    					} else if (searchText.length >= MIN_SEARCH_TEXT_LENGTH) {
    						const currentSearchText = searchText;
    						const newEmojis = await getEmojisBySearchQuery(currentSearchText);

    						if (currentSearchText === searchText) {
    							// if the situation changes asynchronously, do not update
    							$$invalidate(1, currentEmojis = newEmojis);

    							$$invalidate(4, searchMode = true);
    						}
    					} else if (currentGroup) {
    						const currentGroupId = currentGroup.id;
    						const newEmojis = await getEmojisByGroup(currentGroupId);

    						if (currentGroupId === currentGroup.id) {
    							// if the situation changes asynchronously, do not update
    							$$invalidate(1, currentEmojis = newEmojis);

    							$$invalidate(4, searchMode = false);
    						}
    					}
    				}

    				/* no await */
    				updateEmojis();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*groups, searchMode*/ 4112) {
    			//
    			// Global styles for the entire picker
    			//
    			/* eslint-disable no-unused-vars */
    			$$invalidate(22, pickerStyle = `
  --font-family: ${FONT_FAMILY};
  --num-groups: ${groups$1.length}; 
  --indicator-opacity: ${searchMode ? 0 : 1}; 
  --num-skintones: ${NUM_SKIN_TONES};`);
    		}

    		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database*/ 256) {
    			//
    			// Set or update the preferred skin tone
    			//
    			{
    				async function updatePreferredSkinTone() {
    					if (databaseLoaded) {
    						$$invalidate(8, currentSkinTone = await database.getPreferredSkinTone());
    					}
    				}

    				/* no await */
    				updatePreferredSkinTone();
    			}
    		}

    		if ($$self.$$.dirty[1] & /*skinToneEmoji*/ 512) {
    			$$invalidate(9, skinTones = Array(NUM_SKIN_TONES).fill().map((_, i) => applySkinTone(skinToneEmoji, i)));
    		}

    		if ($$self.$$.dirty[0] & /*skinTones, currentSkinTone*/ 768) {
    			/* eslint-disable no-unused-vars */
    			$$invalidate(21, skinToneButtonText = skinTones[currentSkinTone]);
    		}

    		if ($$self.$$.dirty[0] & /*i18n, currentSkinTone*/ 257) {
    			$$invalidate(23, skinToneButtonLabel = i18n.skinToneLabel.replace('{skinTone}', i18n.skinTones[currentSkinTone]));
    		}

    		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database*/ 256) {
    			/* eslint-enable no-unused-vars */
    			//
    			// Set or update the favorites emojis
    			//
    			{
    				async function updateDefaultFavoriteEmojis() {
    					$$invalidate(45, defaultFavoriteEmojis = (await Promise.all(MOST_COMMONLY_USED_EMOJI.map(unicode => database.getEmojiByUnicodeOrName(unicode)))).filter(Boolean)); // filter because in Jest tests we don't have all the emoji in the DB
    				}

    				if (databaseLoaded) {
    					/* no await */
    					updateDefaultFavoriteEmojis();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*databaseLoaded*/ 16384 | $$self.$$.dirty[1] & /*database, numColumns, defaultFavoriteEmojis*/ 49408) {
    			{
    				async function updateFavorites() {
    					const dbFavorites = await database.getTopFavoriteEmoji(numColumns);
    					const favorites = await summarizeEmojis(uniqBy([...dbFavorites, ...defaultFavoriteEmojis], _ => _.unicode || _.name).slice(0, numColumns));
    					$$invalidate(10, currentFavorites = favorites);
    				}

    				if (databaseLoaded && defaultFavoriteEmojis) {
    					/* no await */
    					updateFavorites();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*currentEmojis, tabpanelElement*/ 10) {
    			// Some emojis have their ligatures rendered as two or more consecutive emojis
    			// We want to treat these the same as unsupported emojis, so we compare their
    			// widths against the baseline widths and remove them as necessary
    			{
    				const zwjEmojisToCheck = currentEmojis.filter(emoji => emoji.unicode).filter(emoji => hasZwj(emoji) && !supportedZwjEmojis.has(emoji.unicode)); // filter custom emoji

    				if (zwjEmojisToCheck.length) {
    					// render now, check their length later
    					rAF(() => checkZwjSupportAndUpdate(zwjEmojisToCheck));
    				} else {
    					$$invalidate(1, currentEmojis = currentEmojis.filter(isZwjSupported));

    					rAF(() => {
    						// Avoid Svelte doing an invalidation on the "setter" here.
    						// At best the invalidation is useless, at worst it can cause infinite loops:
    						// https://github.com/nolanlawson/emoji-picker-element/pull/180
    						// https://github.com/sveltejs/svelte/issues/6521
    						// Also note tabpanelElement can be null if the element is disconnected
    						// immediately after connected, hence `|| {}`
    						(tabpanelElement || {}).scrollTop = 0; // reset scroll top to 0 when emojis change
    					});
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*currentEmojis, currentFavorites*/ 1026 | $$self.$$.dirty[1] & /*initialLoad*/ 4096) ;

    		if ($$self.$$.dirty[0] & /*searchMode, currentEmojis*/ 18 | $$self.$$.dirty[1] & /*customCategorySorting*/ 2048) {
    			//
    			// Derive currentEmojisWithCategories from currentEmojis. This is always done even if there
    			// are no categories, because it's just easier to code the HTML this way.
    			//
    			{
    				function calculateCurrentEmojisWithCategories() {
    					if (searchMode) {
    						return [{ category: '', emojis: currentEmojis }];
    					}

    					const categoriesToEmoji = new Map();

    					for (const emoji of currentEmojis) {
    						const category = emoji.category || '';
    						let emojis = categoriesToEmoji.get(category);

    						if (!emojis) {
    							emojis = [];
    							categoriesToEmoji.set(category, emojis);
    						}

    						emojis.push(emoji);
    					}

    					return [...categoriesToEmoji.entries()].map(([category, emojis]) => ({ category, emojis })).sort((a, b) => customCategorySorting(a.category, b.category));
    				}

    				// eslint-disable-next-line no-unused-vars
    				$$invalidate(15, currentEmojisWithCategories = calculateCurrentEmojisWithCategories());
    			}
    		}

    		if ($$self.$$.dirty[0] & /*activeSearchItem, currentEmojis*/ 34) {
    			//
    			// Handle active search item (i.e. pressing up or down while searching)
    			//
    			/* eslint-disable no-unused-vars */
    			$$invalidate(26, activeSearchItemId = activeSearchItem !== -1 && currentEmojis[activeSearchItem].id);
    		}

    		if ($$self.$$.dirty[0] & /*skinTonePickerExpanded, skinToneDropdown*/ 192) {
    			// To make the animation nicer, change the z-index of the skintone picker button
    			// *after* the animation has played. This makes it appear that the picker box
    			// is expanding "below" the button
    			{
    				if (skinTonePickerExpanded) {
    					skinToneDropdown.addEventListener(
    						'transitionend',
    						() => {
    							$$invalidate(19, skinTonePickerExpandedAfterAnimation = true); // eslint-disable-line no-unused-vars
    						},
    						{ once: true }
    					);
    				} else {
    					$$invalidate(19, skinTonePickerExpandedAfterAnimation = false); // eslint-disable-line no-unused-vars
    				}
    			}
    		}
    	};

    	return [
    		i18n,
    		currentEmojis,
    		rawSearchText,
    		tabpanelElement,
    		searchMode,
    		activeSearchItem,
    		skinTonePickerExpanded,
    		skinToneDropdown,
    		currentSkinTone,
    		skinTones,
    		currentFavorites,
    		currentGroupIndex,
    		groups$1,
    		currentGroup,
    		databaseLoaded,
    		currentEmojisWithCategories,
    		rootElement,
    		baselineEmoji,
    		message,
    		skinTonePickerExpandedAfterAnimation,
    		activeSkinTone,
    		skinToneButtonText,
    		pickerStyle,
    		skinToneButtonLabel,
    		isRtl,
    		scrollbarWidth,
    		activeSearchItemId,
    		unicodeWithSkin,
    		labelWithSkin,
    		calculateEmojiGridStyle,
    		onSearchKeydown,
    		onNavClick,
    		onNavKeydown,
    		onEmojiClick,
    		onSkinToneOptionsClick,
    		onClickSkinToneButton,
    		onSkinToneOptionsKeydown,
    		onSkinToneOptionsKeyup,
    		onSkinToneOptionsFocusOut,
    		database,
    		skinToneEmoji,
    		customEmoji,
    		customCategorySorting,
    		initialLoad,
    		searchText,
    		defaultFavoriteEmojis,
    		numColumns,
    		input_input_handler,
    		div3_binding,
    		click_handler,
    		div10_binding,
    		button1_binding,
    		section_binding
    	];
    }

    class Picker extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				skinToneEmoji: 40,
    				i18n: 0,
    				database: 39,
    				customEmoji: 41,
    				customCategorySorting: 42
    			},
    			null,
    			[-1, -1, -1]
    		);
    	}
    }

    const DEFAULT_DATA_SOURCE = 'https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json';
    const DEFAULT_LOCALE = 'en';

    var enI18n = {
      categoriesLabel: 'Categories',
      emojiUnsupportedMessage: 'Your browser does not support color emoji.',
      favoritesLabel: 'Favorites',
      loadingMessage: 'Loading…',
      networkErrorMessage: 'Could not load emoji.',
      regionLabel: 'Emoji picker',
      searchDescription: 'When search results are available, press up or down to select and enter to choose.',
      searchLabel: 'Search',
      searchResultsLabel: 'Search results',
      skinToneDescription: 'When expanded, press up or down to select and enter to choose.',
      skinToneLabel: 'Choose a skin tone (currently {skinTone})',
      skinTonesLabel: 'Skin tones',
      skinTones: [
        'Default',
        'Light',
        'Medium-Light',
        'Medium',
        'Medium-Dark',
        'Dark'
      ],
      categories: {
        custom: 'Custom',
        'smileys-emotion': 'Smileys and emoticons',
        'people-body': 'People and body',
        'animals-nature': 'Animals and nature',
        'food-drink': 'Food and drink',
        'travel-places': 'Travel and places',
        activities: 'Activities',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags'
      }
    };

    const PROPS = [
      'customEmoji',
      'customCategorySorting',
      'database',
      'dataSource',
      'i18n',
      'locale',
      'skinToneEmoji'
    ];

    class PickerElement extends HTMLElement {
      constructor (props) {
        super();
        this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.textContent = ":host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.custom-emoji,.emoji,button.emoji{height:var(--total-emoji-size);width:var(--total-emoji-size)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;line-height:1;overflow:hidden;font-family:var(--font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.custom-emoji{padding:var(--emoji-padding);object-fit:contain;pointer-events:none;background-repeat:no-repeat;background-position:center center;background-size:var(--emoji-size) var(--emoji-size)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}";
        this.shadowRoot.appendChild(style);
        this._ctx = {
          // Set defaults
          locale: DEFAULT_LOCALE,
          dataSource: DEFAULT_DATA_SOURCE,
          skinToneEmoji: DEFAULT_SKIN_TONE_EMOJI,
          customCategorySorting: DEFAULT_CATEGORY_SORTING,
          customEmoji: null,
          i18n: enI18n,
          ...props
        };
        // Handle properties set before the element was upgraded
        for (const prop of PROPS) {
          if (prop !== 'database' && Object.prototype.hasOwnProperty.call(this, prop)) {
            this._ctx[prop] = this[prop];
            delete this[prop];
          }
        }
        this._dbFlush(); // wait for a flush before creating the db, in case the user calls e.g. a setter or setAttribute
      }

      connectedCallback () {
        this._cmp = new Picker({
          target: this.shadowRoot,
          props: this._ctx
        });
      }

      disconnectedCallback () {
        this._cmp.$destroy();
        this._cmp = undefined;

        const { database } = this._ctx;
        if (database) {
          database.close()
            // only happens if the database failed to load in the first place, so we don't care)
            .catch(err => console.error(err));
        }
      }

      static get observedAttributes () {
        return ['locale', 'data-source', 'skin-tone-emoji'] // complex objects aren't supported, also use kebab-case
      }

      attributeChangedCallback (attrName, oldValue, newValue) {
        // convert from kebab-case to camelcase
        // see https://github.com/sveltejs/svelte/issues/3852#issuecomment-665037015
        this._set(
          attrName.replace(/-([a-z])/g, (_, up) => up.toUpperCase()),
          newValue
        );
      }

      _set (prop, newValue) {
        this._ctx[prop] = newValue;
        if (this._cmp) {
          this._cmp.$set({ [prop]: newValue });
        }
        if (['locale', 'dataSource'].includes(prop)) {
          this._dbFlush();
        }
      }

      _dbCreate () {
        const { locale, dataSource, database } = this._ctx;
        // only create a new database if we really need to
        if (!database || database.locale !== locale || database.dataSource !== dataSource) {
          this._set('database', new Database({ locale, dataSource }));
        }
      }

      // Update the Database in one microtask if the locale/dataSource change. We do one microtask
      // so we don't create two Databases if e.g. both the locale and the dataSource change
      _dbFlush () {
        Promise.resolve().then(() => (
          this._dbCreate()
        ));
      }
    }

    const definitions = {};

    for (const prop of PROPS) {
      definitions[prop] = {
        get () {
          if (prop === 'database') {
            // in rare cases, the microtask may not be flushed yet, so we need to instantiate the DB
            // now if the user is asking for it
            this._dbCreate();
          }
          return this._ctx[prop]
        },
        set (val) {
          if (prop === 'database') {
            throw new Error('database is read-only')
          }
          this._set(prop, val);
        }
      };
    }

    Object.defineProperties(PickerElement.prototype, definitions);

    /* istanbul ignore else */
    if (!customElements.get('emoji-picker')) { // if already defined, do nothing (e.g. same script imported twice)
      customElements.define('emoji-picker', PickerElement);
    }

    /* src/Components/Dashboard/Messages/Sending.svelte generated by Svelte v3.49.0 */
    const file$7 = "src/Components/Dashboard/Messages/Sending.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (76:2) {#if gamesOpen}
    function create_if_block$5(ctx) {
    	let div;
    	let each_value = /*games*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "Games");
    			add_location(div, file$7, 76, 4, 2118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleCreateGame, games*/ 18) {
    				each_value = /*games*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(76:2) {#if gamesOpen}",
    		ctx
    	});

    	return block;
    }

    // (78:6) {#each games as game}
    function create_each_block$1(ctx) {
    	let div;
    	let t0_value = /*game*/ ctx[12].name + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*game*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "Game");
    			add_location(div, file$7, 78, 8, 2174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*games*/ 2 && t0_value !== (t0_value = /*game*/ ctx[12].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(78:6) {#each games as game}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div2;
    	let t0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let input;
    	let t2;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let div0;
    	let emoji_picker;
    	let t4;
    	let div1;
    	let img2;
    	let img2_src_value;
    	let mounted;
    	let dispose;
    	let if_block = /*gamesOpen*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			img0 = element("img");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			img1 = element("img");
    			t3 = space();
    			div0 = element("div");
    			emoji_picker = element("emoji-picker");
    			t4 = space();
    			div1 = element("div");
    			img2 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = "/games.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "games");
    			set_style(img0, "margin-right", "20px");
    			attr_dev(img0, "class", "hide");
    			add_location(img0, file$7, 89, 2, 2366);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "New message...");
    			input.value = /*current_message*/ ctx[2];
    			add_location(input, file$7, 98, 2, 2523);
    			if (!src_url_equal(img1.src, img1_src_value = "/emojis.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "emojis");
    			set_style(img1, "margin-right", "6px");
    			add_location(img1, file$7, 106, 2, 2685);
    			set_custom_element_data(emoji_picker, "class", "light");
    			add_location(emoji_picker, file$7, 113, 4, 2826);
    			attr_dev(div0, "class", "emoji-container");
    			add_location(div0, file$7, 112, 2, 2792);
    			if (!src_url_equal(img2.src, img2_src_value = "/send_button.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "send_button");
    			set_style(img2, "margin-left", "6px");
    			add_location(img2, file$7, 116, 4, 2893);
    			attr_dev(div1, "class", "border");
    			add_location(div1, file$7, 115, 2, 2868);
    			attr_dev(div2, "class", "sending");
    			add_location(div2, file$7, 74, 0, 2074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, img0);
    			append_dev(div2, t1);
    			append_dev(div2, input);
    			append_dev(div2, t2);
    			append_dev(div2, img1);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, emoji_picker);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, img2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img0, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[8], false, false, false),
    					listen_dev(img1, "click", openEmoji, false, false, false),
    					listen_dev(img2, "click", /*click_handler_2*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*gamesOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div2, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*current_message*/ 4 && input.value !== /*current_message*/ ctx[2]) {
    				prop_dev(input, "value", /*current_message*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function openEmoji() {
    	const emoji_container = document.querySelector(".emoji-container");
    	emoji_container.classList.toggle("shown");
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sending', slots, []);
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let usernameValue;
    	username.subscribe(val => usernameValue = val);
    	let { current_room } = $$props;
    	let gamesOpen = false;
    	let games = [];
    	let current_message = "";

    	onMount(() => {
    		document.querySelector("emoji-picker").addEventListener("emoji-click", event => $$invalidate(2, current_message += event.detail.unicode));
    		let input = document.querySelector(".sending input");

    		input.addEventListener("keyup", ({ key }) => {
    			if (key === "Enter") {
    				handleSubmitMessage();
    			}
    		});
    	});

    	function handleSubmitMessage() {
    		if (current_message === "" || current_room.name === "") return;

    		socketValue.emit("message", {
    			type: "regular",
    			user: usernameValue,
    			message: current_message,
    			room: current_room.id
    		});

    		$$invalidate(2, current_message = "");
    		const emoji_container = document.querySelector(".emoji-container");
    		if (emoji_container.classList.contains("shown")) emoji_container.classList.remove("shown");
    		$$invalidate(0, gamesOpen = false);
    	}

    	function handleCreateGame(game_name) {
    		if (current_room.name === "") return;

    		socketValue.emit("message", {
    			type: "game",
    			user: usernameValue,
    			message: usernameValue + " want to start a game : ",
    			room: current_room.id,
    			game: game_name,
    			state: "Not started"
    		});

    		$$invalidate(0, gamesOpen = false);
    	}

    	const writable_props = ['current_room'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sending> was created with unknown prop '${key}'`);
    	});

    	const click_handler = game => {
    		handleCreateGame(game.name);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, gamesOpen = !gamesOpen);
    	};

    	const change_handler = e => {
    		$$invalidate(2, current_message = e.target.value);
    	};

    	const click_handler_2 = e => {
    		e.preventDefault();
    		handleSubmitMessage();
    	};

    	$$self.$$set = $$props => {
    		if ('current_room' in $$props) $$invalidate(5, current_room = $$props.current_room);
    	};

    	$$self.$capture_state = () => ({
    		axios,
    		socket,
    		username,
    		onMount,
    		socketValue,
    		usernameValue,
    		current_room,
    		gamesOpen,
    		games,
    		current_message,
    		openEmoji,
    		handleSubmitMessage,
    		handleCreateGame
    	});

    	$$self.$inject_state = $$props => {
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('usernameValue' in $$props) usernameValue = $$props.usernameValue;
    		if ('current_room' in $$props) $$invalidate(5, current_room = $$props.current_room);
    		if ('gamesOpen' in $$props) $$invalidate(0, gamesOpen = $$props.gamesOpen);
    		if ('games' in $$props) $$invalidate(1, games = $$props.games);
    		if ('current_message' in $$props) $$invalidate(2, current_message = $$props.current_message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*current_room*/ 32) {
    			if (current_room !== "") {
    				axios.get("http://" + 'localhost' + ":" + '4000' + "/getGames", { withCredentials: true }).then(res => {
    					$$invalidate(1, games = res.data.games);
    				});
    			}
    		}
    	};

    	return [
    		gamesOpen,
    		games,
    		current_message,
    		handleSubmitMessage,
    		handleCreateGame,
    		current_room,
    		click_handler,
    		click_handler_1,
    		change_handler,
    		click_handler_2
    	];
    }

    class Sending extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { current_room: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sending",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*current_room*/ ctx[5] === undefined && !('current_room' in props)) {
    			console.warn("<Sending> was created without expected prop 'current_room'");
    		}
    	}

    	get current_room() {
    		throw new Error("<Sending>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_room(value) {
    		throw new Error("<Sending>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Log_Box.svelte generated by Svelte v3.49.0 */

    const file$6 = "src/Components/Dashboard/Log_Box.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*message*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Close";
    			add_location(button, file$6, 8, 4, 130);
    			attr_dev(div0, "class", "Container");
    			add_location(div0, file$6, 6, 2, 88);
    			attr_dev(div1, "class", "Dialog_box");
    			add_location(div1, file$6, 5, 0, 61);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t0, /*message*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Log_Box', slots, []);
    	let { message } = $$props;
    	let { open } = $$props;
    	const writable_props = ['message', 'open'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Log_Box> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		open(false);
    	};

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({ message, open });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, open, click_handler];
    }

    class Log_Box extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { message: 0, open: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Log_Box",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Log_Box> was created without expected prop 'message'");
    		}

    		if (/*open*/ ctx[1] === undefined && !('open' in props)) {
    			console.warn("<Log_Box> was created without expected prop 'open'");
    		}
    	}

    	get message() {
    		throw new Error("<Log_Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Log_Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Log_Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Log_Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Messages/Messages.svelte generated by Svelte v3.49.0 */
    const file$5 = "src/Components/Dashboard/Messages/Messages.svelte";

    // (27:2) {#if errorBox}
    function create_if_block$4(ctx) {
    	let log_box;
    	let current;

    	log_box = new Log_Box({
    			props: {
    				message: /*errorMsg*/ ctx[3],
    				open: /*setOpenErrorBox*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(log_box.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(log_box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const log_box_changes = {};
    			if (dirty & /*errorMsg*/ 8) log_box_changes.message = /*errorMsg*/ ctx[3];
    			log_box.$set(log_box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(log_box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(log_box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(log_box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(27:2) {#if errorBox}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let t0;
    	let header;
    	let t1;
    	let messagesdisplaying;
    	let t2;
    	let sending;
    	let current;
    	let if_block = /*errorBox*/ ctx[2] && create_if_block$4(ctx);

    	header = new Header({
    			props: {
    				current_room: /*current_room*/ ctx[0],
    				return_room: /*return_room*/ ctx[1]
    			},
    			$$inline: true
    		});

    	messagesdisplaying = new Messages_displaying({
    			props: { current_room: /*current_room*/ ctx[0] },
    			$$inline: true
    		});

    	sending = new Sending({
    			props: { current_room: /*current_room*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			create_component(messagesdisplaying.$$.fragment);
    			t2 = space();
    			create_component(sending.$$.fragment);
    			attr_dev(div, "class", "Message");
    			add_location(div, file$5, 25, 0, 633);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(header, div, null);
    			append_dev(div, t1);
    			mount_component(messagesdisplaying, div, null);
    			append_dev(div, t2);
    			mount_component(sending, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*errorBox*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*errorBox*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const header_changes = {};
    			if (dirty & /*current_room*/ 1) header_changes.current_room = /*current_room*/ ctx[0];
    			if (dirty & /*return_room*/ 2) header_changes.return_room = /*return_room*/ ctx[1];
    			header.$set(header_changes);
    			const messagesdisplaying_changes = {};
    			if (dirty & /*current_room*/ 1) messagesdisplaying_changes.current_room = /*current_room*/ ctx[0];
    			messagesdisplaying.$set(messagesdisplaying_changes);
    			const sending_changes = {};
    			if (dirty & /*current_room*/ 1) sending_changes.current_room = /*current_room*/ ctx[0];
    			sending.$set(sending_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(header.$$.fragment, local);
    			transition_in(messagesdisplaying.$$.fragment, local);
    			transition_in(sending.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(header.$$.fragment, local);
    			transition_out(messagesdisplaying.$$.fragment, local);
    			transition_out(sending.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(header);
    			destroy_component(messagesdisplaying);
    			destroy_component(sending);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Messages', slots, []);
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let { current_room } = $$props;
    	let { return_room } = $$props;
    	let errorBox = false;
    	let errorMsg = "";

    	socketValue.on("error message", elt => {
    		$$invalidate(2, errorBox = true);
    		$$invalidate(3, errorMsg = elt);
    	});

    	function setOpenErrorBox(val) {
    		$$invalidate(2, errorBox = val);
    	}

    	const writable_props = ['current_room', 'return_room'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Messages> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('current_room' in $$props) $$invalidate(0, current_room = $$props.current_room);
    		if ('return_room' in $$props) $$invalidate(1, return_room = $$props.return_room);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		MessagesDisplaying: Messages_displaying,
    		Sending,
    		Log_Box,
    		socket,
    		socketValue,
    		current_room,
    		return_room,
    		errorBox,
    		errorMsg,
    		setOpenErrorBox
    	});

    	$$self.$inject_state = $$props => {
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('current_room' in $$props) $$invalidate(0, current_room = $$props.current_room);
    		if ('return_room' in $$props) $$invalidate(1, return_room = $$props.return_room);
    		if ('errorBox' in $$props) $$invalidate(2, errorBox = $$props.errorBox);
    		if ('errorMsg' in $$props) $$invalidate(3, errorMsg = $$props.errorMsg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_room, return_room, errorBox, errorMsg, setOpenErrorBox];
    }

    class Messages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { current_room: 0, return_room: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Messages",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*current_room*/ ctx[0] === undefined && !('current_room' in props)) {
    			console.warn("<Messages> was created without expected prop 'current_room'");
    		}

    		if (/*return_room*/ ctx[1] === undefined && !('return_room' in props)) {
    			console.warn("<Messages> was created without expected prop 'return_room'");
    		}
    	}

    	get current_room() {
    		throw new Error("<Messages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_room(value) {
    		throw new Error("<Messages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get return_room() {
    		throw new Error("<Messages>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set return_room(value) {
    		throw new Error("<Messages>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Dashboard/Dashboard.svelte generated by Svelte v3.49.0 */
    const file$4 = "src/Components/Dashboard/Dashboard.svelte";

    function create_fragment$5(ctx) {
    	let div2;
    	let div0;
    	let room;
    	let t;
    	let div1;
    	let messages;
    	let current;

    	room = new Room({
    			props: {
    				setCurrentRoom: /*setCurrentRoom*/ ctx[1],
    				current_room: /*current_room*/ ctx[0]
    			},
    			$$inline: true
    		});

    	messages = new Messages({
    			props: {
    				current_room: /*current_room*/ ctx[0],
    				return_room
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(room.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(messages.$$.fragment);
    			attr_dev(div0, "id", "room_container");
    			add_location(div0, file$4, 18, 2, 608);
    			attr_dev(div1, "id", "message_container");
    			attr_dev(div1, "class", "hide");
    			add_location(div1, file$4, 19, 2, 682);
    			attr_dev(div2, "class", "Dashboard");
    			add_location(div2, file$4, 17, 0, 582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(room, div0, null);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    			mount_component(messages, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const room_changes = {};
    			if (dirty & /*current_room*/ 1) room_changes.current_room = /*current_room*/ ctx[0];
    			room.$set(room_changes);
    			const messages_changes = {};
    			if (dirty & /*current_room*/ 1) messages_changes.current_room = /*current_room*/ ctx[0];
    			messages.$set(messages_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(room.$$.fragment, local);
    			transition_in(messages.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(room.$$.fragment, local);
    			transition_out(messages.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(room);
    			destroy_component(messages);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function return_room() {
    	document.getElementById("room_container").classList.remove("hide");
    	document.getElementById("message_container").classList.add("hide");
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);
    	let current_room = { name: "" };

    	function setCurrentRoom(room) {
    		$$invalidate(0, current_room = room);
    		document.getElementById("room_container").classList.add("hide");
    		document.getElementById("message_container").classList.remove("hide");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Room,
    		Messages,
    		current_room,
    		setCurrentRoom,
    		return_room
    	});

    	$$self.$inject_state = $$props => {
    		if ('current_room' in $$props) $$invalidate(0, current_room = $$props.current_room);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_room, setCurrentRoom];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Components/Games/ConnectionBox.svelte generated by Svelte v3.49.0 */
    const file$3 = "src/Components/Games/ConnectionBox.svelte";

    // (34:2) {#if open}
    function create_if_block$3(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*message*/ ctx[0]);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Leave";
    			add_location(button, file$3, 37, 8, 930);
    			attr_dev(div0, "class", "Container");
    			add_location(div0, file$3, 35, 6, 880);
    			attr_dev(div1, "class", "Dialog_box");
    			add_location(div1, file$3, 34, 4, 849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleLeaveGame*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) set_data_dev(t0, /*message*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(34:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let if_block = /*open*/ ctx[1] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "Connection_Box");
    			add_location(div, file$3, 32, 0, 803);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ConnectionBox', slots, []);
    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let game_id;
    	currentGame.subscribe(val => game_id = val);
    	let usernameValue;
    	username.subscribe(val => usernameValue = val);
    	let message = "Waiting for informations...";
    	let open = true;

    	socketValue.on("Status update", msg => {
    		if (msg !== "") {
    			$$invalidate(1, open = true);
    			$$invalidate(0, message = msg);
    		} else {
    			$$invalidate(1, open = false);
    			$$invalidate(0, message = "Waiting for informations...");
    		}
    	});

    	function handleLeaveGame() {
    		socketValue.emit("leave", { id: game_id, username: usernameValue });
    		push("/dashboard");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ConnectionBox> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		push,
    		socket,
    		currentGame,
    		username,
    		socketValue,
    		game_id,
    		usernameValue,
    		message,
    		open,
    		handleLeaveGame
    	});

    	$$self.$inject_state = $$props => {
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('game_id' in $$props) game_id = $$props.game_id;
    		if ('usernameValue' in $$props) usernameValue = $$props.usernameValue;
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, open, handleLeaveGame];
    }

    class ConnectionBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConnectionBox",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/Games/Tic-tac-toe/Square.svelte generated by Svelte v3.49.0 */

    const file$2 = "src/Components/Games/Tic-tac-toe/Square.svelte";

    // (10:0) {:else}
    function create_else_block$2(ctx) {
    	let td;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			add_location(td, file$2, 10, 2, 233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (!mounted) {
    				dispose = listen_dev(
    					td,
    					"click",
    					function () {
    						if (is_function(/*handler*/ ctx[0])) /*handler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(10:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (8:24) 
    function create_if_block_1(ctx) {
    	let td;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "O.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "O");
    			add_location(img, file$2, 8, 25, 190);
    			add_location(td, file$2, 8, 2, 167);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, img);

    			if (!mounted) {
    				dispose = listen_dev(
    					td,
    					"click",
    					function () {
    						if (is_function(/*handler*/ ctx[0])) /*handler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(8:24) ",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if value === "X"}
    function create_if_block$2(ctx) {
    	let td;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			td = element("td");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "X.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "X");
    			add_location(img, file$2, 6, 25, 107);
    			add_location(td, file$2, 6, 2, 84);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, img);

    			if (!mounted) {
    				dispose = listen_dev(
    					td,
    					"click",
    					function () {
    						if (is_function(/*handler*/ ctx[0])) /*handler*/ ctx[0].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(6:0) {#if value === \\\"X\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*value*/ ctx[1] === "X") return create_if_block$2;
    		if (/*value*/ ctx[1] === "O") return create_if_block_1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Square', slots, []);
    	let { handler } = $$props;
    	let { value } = $$props;
    	const writable_props = ['handler', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Square> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('handler' in $$props) $$invalidate(0, handler = $$props.handler);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ handler, value });

    	$$self.$inject_state = $$props => {
    		if ('handler' in $$props) $$invalidate(0, handler = $$props.handler);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [handler, value];
    }

    class Square extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { handler: 0, value: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Square",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handler*/ ctx[0] === undefined && !('handler' in props)) {
    			console.warn("<Square> was created without expected prop 'handler'");
    		}

    		if (/*value*/ ctx[1] === undefined && !('value' in props)) {
    			console.warn("<Square> was created without expected prop 'value'");
    		}
    	}

    	get handler() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handler(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Games/Tic-tac-toe/Tic-tac-toe.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$1 = "src/Components/Games/Tic-tac-toe/Tic-tac-toe.svelte";

    // (102:6) {:else}
    function create_else_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "O.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "O");
    			add_location(img, file$1, 102, 8, 3056);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(102:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (100:6) {#if game[usernameValue] === "X"}
    function create_if_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "X.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "X");
    			add_location(img, file$1, 100, 8, 3006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(100:6) {#if game[usernameValue] === \\\"X\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let connection_box;
    	let t0;
    	let div0;
    	let table;
    	let tr0;
    	let square0;
    	let t1;
    	let square1;
    	let t2;
    	let square2;
    	let t3;
    	let tr1;
    	let square3;
    	let t4;
    	let square4;
    	let t5;
    	let square5;
    	let t6;
    	let tr2;
    	let square6;
    	let t7;
    	let square7;
    	let t8;
    	let square8;
    	let t9;
    	let div2;
    	let div1;
    	let t10;
    	let t11;
    	let t12_value = /*game*/ ctx[1].current_player + "";
    	let t12;
    	let current;
    	connection_box = new ConnectionBox({ $$inline: true });

    	square0 = new Square({
    			props: {
    				handler: /*func*/ ctx[3],
    				value: /*game*/ ctx[1].board[0]
    			},
    			$$inline: true
    		});

    	square1 = new Square({
    			props: {
    				handler: /*func_1*/ ctx[4],
    				value: /*game*/ ctx[1].board[1]
    			},
    			$$inline: true
    		});

    	square2 = new Square({
    			props: {
    				handler: /*func_2*/ ctx[5],
    				value: /*game*/ ctx[1].board[2]
    			},
    			$$inline: true
    		});

    	square3 = new Square({
    			props: {
    				handler: /*func_3*/ ctx[6],
    				value: /*game*/ ctx[1].board[3]
    			},
    			$$inline: true
    		});

    	square4 = new Square({
    			props: {
    				handler: /*func_4*/ ctx[7],
    				value: /*game*/ ctx[1].board[4]
    			},
    			$$inline: true
    		});

    	square5 = new Square({
    			props: {
    				handler: /*func_5*/ ctx[8],
    				value: /*game*/ ctx[1].board[5]
    			},
    			$$inline: true
    		});

    	square6 = new Square({
    			props: {
    				handler: /*func_6*/ ctx[9],
    				value: /*game*/ ctx[1].board[6]
    			},
    			$$inline: true
    		});

    	square7 = new Square({
    			props: {
    				handler: /*func_7*/ ctx[10],
    				value: /*game*/ ctx[1].board[7]
    			},
    			$$inline: true
    		});

    	square8 = new Square({
    			props: {
    				handler: /*func_8*/ ctx[11],
    				value: /*game*/ ctx[1].board[8]
    			},
    			$$inline: true
    		});

    	function select_block_type(ctx, dirty) {
    		if (/*game*/ ctx[1][/*usernameValue*/ ctx[0]] === "X") return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(connection_box.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			table = element("table");
    			tr0 = element("tr");
    			create_component(square0.$$.fragment);
    			t1 = space();
    			create_component(square1.$$.fragment);
    			t2 = space();
    			create_component(square2.$$.fragment);
    			t3 = space();
    			tr1 = element("tr");
    			create_component(square3.$$.fragment);
    			t4 = space();
    			create_component(square4.$$.fragment);
    			t5 = space();
    			create_component(square5.$$.fragment);
    			t6 = space();
    			tr2 = element("tr");
    			create_component(square6.$$.fragment);
    			t7 = space();
    			create_component(square7.$$.fragment);
    			t8 = space();
    			create_component(square8.$$.fragment);
    			t9 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t10 = text("You are :\n      ");
    			if_block.c();
    			t11 = text("\n    Current player : ");
    			t12 = text(t12_value);
    			add_location(tr0, file$1, 78, 6, 2119);
    			add_location(tr1, file$1, 83, 6, 2370);
    			add_location(tr2, file$1, 88, 6, 2621);
    			add_location(table, file$1, 77, 4, 2105);
    			attr_dev(div0, "class", "Board");
    			add_location(div0, file$1, 76, 2, 2081);
    			attr_dev(div1, "class", "youAre");
    			add_location(div1, file$1, 97, 4, 2921);
    			attr_dev(div2, "class", "Information");
    			add_location(div2, file$1, 96, 2, 2891);
    			attr_dev(div3, "class", "Tic-Tac-Toe");
    			add_location(div3, file$1, 74, 0, 2032);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(connection_box, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			append_dev(div0, table);
    			append_dev(table, tr0);
    			mount_component(square0, tr0, null);
    			append_dev(tr0, t1);
    			mount_component(square1, tr0, null);
    			append_dev(tr0, t2);
    			mount_component(square2, tr0, null);
    			append_dev(table, t3);
    			append_dev(table, tr1);
    			mount_component(square3, tr1, null);
    			append_dev(tr1, t4);
    			mount_component(square4, tr1, null);
    			append_dev(tr1, t5);
    			mount_component(square5, tr1, null);
    			append_dev(table, t6);
    			append_dev(table, tr2);
    			mount_component(square6, tr2, null);
    			append_dev(tr2, t7);
    			mount_component(square7, tr2, null);
    			append_dev(tr2, t8);
    			mount_component(square8, tr2, null);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t10);
    			if_block.m(div1, null);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const square0_changes = {};
    			if (dirty & /*game*/ 2) square0_changes.value = /*game*/ ctx[1].board[0];
    			square0.$set(square0_changes);
    			const square1_changes = {};
    			if (dirty & /*game*/ 2) square1_changes.value = /*game*/ ctx[1].board[1];
    			square1.$set(square1_changes);
    			const square2_changes = {};
    			if (dirty & /*game*/ 2) square2_changes.value = /*game*/ ctx[1].board[2];
    			square2.$set(square2_changes);
    			const square3_changes = {};
    			if (dirty & /*game*/ 2) square3_changes.value = /*game*/ ctx[1].board[3];
    			square3.$set(square3_changes);
    			const square4_changes = {};
    			if (dirty & /*game*/ 2) square4_changes.value = /*game*/ ctx[1].board[4];
    			square4.$set(square4_changes);
    			const square5_changes = {};
    			if (dirty & /*game*/ 2) square5_changes.value = /*game*/ ctx[1].board[5];
    			square5.$set(square5_changes);
    			const square6_changes = {};
    			if (dirty & /*game*/ 2) square6_changes.value = /*game*/ ctx[1].board[6];
    			square6.$set(square6_changes);
    			const square7_changes = {};
    			if (dirty & /*game*/ 2) square7_changes.value = /*game*/ ctx[1].board[7];
    			square7.$set(square7_changes);
    			const square8_changes = {};
    			if (dirty & /*game*/ 2) square8_changes.value = /*game*/ ctx[1].board[8];
    			square8.$set(square8_changes);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if ((!current || dirty & /*game*/ 2) && t12_value !== (t12_value = /*game*/ ctx[1].current_player + "")) set_data_dev(t12, t12_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(connection_box.$$.fragment, local);
    			transition_in(square0.$$.fragment, local);
    			transition_in(square1.$$.fragment, local);
    			transition_in(square2.$$.fragment, local);
    			transition_in(square3.$$.fragment, local);
    			transition_in(square4.$$.fragment, local);
    			transition_in(square5.$$.fragment, local);
    			transition_in(square6.$$.fragment, local);
    			transition_in(square7.$$.fragment, local);
    			transition_in(square8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(connection_box.$$.fragment, local);
    			transition_out(square0.$$.fragment, local);
    			transition_out(square1.$$.fragment, local);
    			transition_out(square2.$$.fragment, local);
    			transition_out(square3.$$.fragment, local);
    			transition_out(square4.$$.fragment, local);
    			transition_out(square5.$$.fragment, local);
    			transition_out(square6.$$.fragment, local);
    			transition_out(square7.$$.fragment, local);
    			transition_out(square8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(connection_box);
    			destroy_component(square0);
    			destroy_component(square1);
    			destroy_component(square2);
    			destroy_component(square3);
    			destroy_component(square4);
    			destroy_component(square5);
    			destroy_component(square6);
    			destroy_component(square7);
    			destroy_component(square8);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tic_tac_toe', slots, []);

    	const winningConditions = [
    		[0, 1, 2],
    		[3, 4, 5],
    		[6, 7, 8],
    		[0, 3, 6],
    		[1, 4, 7],
    		[2, 5, 8],
    		[0, 4, 8],
    		[2, 4, 6]
    	];

    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let game_id;
    	currentGame.subscribe(val => game_id = val);
    	let usernameValue;
    	username.subscribe(val => $$invalidate(0, usernameValue = val));

    	let game = {
    		board: ["", "", "", "", "", "", "", "", ""]
    	};

    	game[usernameValue] = "";
    	game.current_player = "";
    	game.winner = null;

    	if (socketValue === null) push("/dashboard"); else {
    		socketValue.emit("join", { id: game_id, username: usernameValue });

    		socketValue.on("Tic-tac-toe update", data => {
    			$$invalidate(1, game = data);
    		});
    	}

    	function handleClickCase(id) {
    		if (game.current_player != usernameValue) return;
    		if (game.board[id] !== "") return;
    		$$invalidate(1, game.board[id] = game[usernameValue], game);

    		for (const [key, value] of Object.entries(game)) {
    			if (game[usernameValue] === "O" && value === "X") $$invalidate(1, game.current_player = key, game); else if (game[usernameValue] === "X" && value === "O") $$invalidate(1, game.current_player = key, game);
    		}

    		//check win conditions
    		for (let i in winningConditions) {
    			let a = game.board[winningConditions[i][0]];
    			let b = game.board[winningConditions[i][1]];
    			let c = game.board[winningConditions[i][2]];

    			if (a === "" || b === "" || c === "") {
    				continue;
    			}

    			if (a === b && b === c) {
    				$$invalidate(1, game.winner = a, game);
    				break;
    			}
    		}

    		let draw = true;

    		for (let index in game.board) {
    			if (game.board[index] === "") draw = false;
    		}

    		if (draw) $$invalidate(1, game.winner = undefined, game);
    		socketValue.emit("Tic-tac-toe update-client", { id: game_id, game });
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tic_tac_toe> was created with unknown prop '${key}'`);
    	});

    	const func = () => handleClickCase(0);
    	const func_1 = () => handleClickCase(1);
    	const func_2 = () => handleClickCase(2);
    	const func_3 = () => handleClickCase(3);
    	const func_4 = () => handleClickCase(4);
    	const func_5 = () => handleClickCase(5);
    	const func_6 = () => handleClickCase(6);
    	const func_7 = () => handleClickCase(7);
    	const func_8 = () => handleClickCase(8);

    	$$self.$capture_state = () => ({
    		push,
    		socket,
    		currentGame,
    		username,
    		Connection_Box: ConnectionBox,
    		Square,
    		winningConditions,
    		socketValue,
    		game_id,
    		usernameValue,
    		game,
    		handleClickCase
    	});

    	$$self.$inject_state = $$props => {
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('game_id' in $$props) game_id = $$props.game_id;
    		if ('usernameValue' in $$props) $$invalidate(0, usernameValue = $$props.usernameValue);
    		if ('game' in $$props) $$invalidate(1, game = $$props.game);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		usernameValue,
    		game,
    		handleClickCase,
    		func,
    		func_1,
    		func_2,
    		func_3,
    		func_4,
    		func_5,
    		func_6,
    		func_7,
    		func_8
    	];
    }

    class Tic_tac_toe extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tic_tac_toe",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Components/Games/Connect_4.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src/Components/Games/Connect_4.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (503:6) {#each { length: 7 } as _, y}
    function create_each_block_1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*x*/ ctx[10], /*y*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", /*x*/ ctx[10] + "-" + /*y*/ ctx[12]);
    			attr_dev(div, "class", "tile");
    			add_location(div, file, 503, 8, 7564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(503:6) {#each { length: 7 } as _, y}",
    		ctx
    	});

    	return block;
    }

    // (502:4) {#each { length: 6 } as _, x}
    function create_each_block(ctx) {
    	let each_1_anchor;
    	let each_value_1 = { length: 7 };
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*handleClickCase*/ 4) {
    				each_value_1 = { length: 7 };
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(502:4) {#each { length: 6 } as _, x}",
    		ctx
    	});

    	return block;
    }

    // (517:6) {:else}
    function create_else_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Y");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(517:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (515:6) {#if game[usernameValue] === "R"}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("R");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(515:6) {#if game[usernameValue] === \\\"R\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let connection_box;
    	let t0;
    	let div0;
    	let t1;
    	let div2;
    	let div1;
    	let t2;
    	let t3;
    	let t4_value = /*game*/ ctx[1].current_player + "";
    	let t4;
    	let current;
    	connection_box = new ConnectionBox({ $$inline: true });
    	let each_value = { length: 6 };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*game*/ ctx[1][/*usernameValue*/ ctx[0]] === "R") return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			create_component(connection_box.$$.fragment);
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t2 = text("You are :\n      ");
    			if_block.c();
    			t3 = text("\n    Current player : ");
    			t4 = text(t4_value);
    			attr_dev(div0, "class", "Board");
    			add_location(div0, file, 500, 2, 7466);
    			attr_dev(div1, "class", "youAre");
    			add_location(div1, file, 512, 4, 7746);
    			attr_dev(div2, "class", "Information");
    			add_location(div2, file, 511, 2, 7716);
    			attr_dev(div3, "class", "Connect4");
    			add_location(div3, file, 498, 0, 7420);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			mount_component(connection_box, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			if_block.m(div1, null);
    			append_dev(div2, t3);
    			append_dev(div2, t4);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*handleClickCase*/ 4) {
    				each_value = { length: 6 };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if ((!current || dirty & /*game*/ 2) && t4_value !== (t4_value = /*game*/ ctx[1].current_player + "")) set_data_dev(t4, t4_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(connection_box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(connection_box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(connection_box);
    			destroy_each(each_blocks, detaching);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Connect_4', slots, []);

    	let winning_array = [
    		[[0, 0], [0, 1], [0, 2], [0, 3]],
    		[[0, 1], [0, 2], [0, 3], [0, 4]],
    		[[0, 2], [0, 3], [0, 4], [0, 5]],
    		[[0, 3], [0, 4], [0, 5], [0, 6]],
    		[[1, 0], [1, 1], [1, 2], [1, 3]],
    		[[1, 1], [1, 2], [1, 3], [1, 4]],
    		[[1, 2], [1, 3], [1, 4], [1, 5]],
    		[[1, 3], [1, 4], [1, 5], [1, 6]],
    		[[2, 0], [2, 1], [2, 2], [2, 3]],
    		[[2, 1], [2, 2], [2, 3], [2, 4]],
    		[[2, 2], [2, 3], [2, 4], [2, 5]],
    		[[2, 3], [2, 4], [2, 5], [2, 6]],
    		[[3, 0], [3, 1], [3, 2], [3, 3]],
    		[[3, 1], [3, 2], [3, 3], [3, 4]],
    		[[3, 2], [3, 3], [3, 4], [3, 5]],
    		[[3, 3], [3, 4], [3, 5], [3, 6]],
    		[[4, 0], [4, 1], [4, 2], [4, 3]],
    		[[4, 1], [4, 2], [4, 3], [4, 4]],
    		[[4, 2], [4, 3], [4, 4], [4, 5]],
    		[[4, 3], [4, 4], [4, 5], [4, 6]],
    		[[5, 0], [5, 1], [5, 2], [5, 3]],
    		[[5, 1], [5, 2], [5, 3], [5, 4]],
    		[[5, 2], [5, 3], [5, 4], [5, 5]],
    		[[5, 3], [5, 4], [5, 5], [5, 6]],
    		[[0, 0], [1, 0], [2, 0], [3, 0]],
    		[[1, 0], [2, 0], [3, 0], [4, 0]],
    		[[2, 0], [3, 0], [4, 0], [5, 0]],
    		[[0, 1], [1, 1], [2, 1], [3, 1]],
    		[[1, 1], [2, 1], [3, 1], [4, 1]],
    		[[2, 1], [3, 1], [4, 1], [5, 1]],
    		[[0, 2], [1, 2], [2, 2], [3, 2]],
    		[[1, 2], [2, 2], [3, 2], [4, 2]],
    		[[2, 2], [3, 2], [4, 2], [5, 2]],
    		[[0, 3], [1, 3], [2, 3], [3, 3]],
    		[[1, 3], [2, 3], [3, 3], [4, 3]],
    		[[2, 3], [3, 3], [4, 3], [5, 3]],
    		[[0, 4], [1, 4], [2, 4], [3, 4]],
    		[[1, 4], [2, 4], [3, 4], [4, 4]],
    		[[2, 4], [3, 4], [4, 4], [5, 4]],
    		[[0, 5], [1, 5], [2, 5], [3, 5]],
    		[[1, 5], [2, 5], [3, 5], [4, 5]],
    		[[2, 5], [3, 5], [4, 5], [5, 5]],
    		[[0, 6], [1, 6], [2, 6], [3, 6]],
    		[[1, 6], [2, 6], [3, 6], [4, 6]],
    		[[2, 6], [3, 6], [4, 6], [5, 6]],
    		[[2, 0], [3, 1], [4, 2], [5, 3]],
    		[[1, 0], [2, 1], [3, 2], [4, 3]],
    		[[2, 1], [3, 2], [4, 3], [5, 4]],
    		[[0, 0], [1, 1], [2, 2], [3, 3]],
    		[[1, 1], [2, 2], [3, 3], [4, 4]],
    		[[2, 2], [3, 3], [4, 4], [5, 5]],
    		[[0, 1], [1, 2], [2, 3], [3, 4]],
    		[[1, 2], [2, 3], [3, 4], [4, 5]],
    		[[2, 3], [3, 4], [4, 5], [5, 6]],
    		[[0, 2], [1, 3], [2, 4], [3, 5]],
    		[[1, 3], [2, 4], [3, 5], [4, 6]],
    		[[0, 3], [1, 4], [2, 5], [3, 6]],
    		[[0, 3], [1, 2], [2, 1], [3, 0]],
    		[[0, 4], [1, 3], [2, 2], [3, 1]],
    		[[1, 3], [2, 2], [3, 1], [4, 0]],
    		[[0, 5], [1, 4], [2, 3], [3, 2]],
    		[[1, 4], [2, 3], [3, 2], [4, 1]],
    		[[2, 3], [3, 2], [4, 1], [5, 0]],
    		[[0, 6], [1, 5], [2, 4], [3, 3]],
    		[[1, 5], [2, 4], [3, 3], [4, 2]],
    		[[2, 4], [3, 3], [4, 2], [5, 1]],
    		[[1, 6], [2, 5], [3, 4], [4, 3]],
    		[[2, 5], [3, 4], [4, 3], [5, 2]],
    		[[2, 6], [3, 5], [4, 4], [5, 3]]
    	];

    	let socketValue;
    	socket.subscribe(val => socketValue = val);
    	let game_id;
    	currentGame.subscribe(val => game_id = val);
    	let usernameValue;
    	username.subscribe(val => $$invalidate(0, usernameValue = val));
    	let game = {};

    	if (socketValue === null) push("/dashboard"); else {
    		socketValue.emit("join", { id: game_id, username: usernameValue });

    		socketValue.on("Connect-4 update", data => {
    			$$invalidate(1, game = data);

    			if (game.last_move !== undefined && game.last_move.p !== usernameValue) {
    				//update the grid on the front
    				let token = document.createElement("div");

    				token.classList.add(game[game.last_move.p]);
    				document.getElementById(game.last_move.x + "-" + game.last_move.y).appendChild(token);
    			}
    		});
    	}

    	function checkWinning() {
    		for (let i in winning_array) {
    			let [x1, y1] = winning_array[i][0];
    			let [x2, y2] = winning_array[i][1];
    			let [x3, y3] = winning_array[i][2];
    			let [x4, y4] = winning_array[i][3];
    			console.log("(" + x1 + ", " + y1 + ")");
    			let a = game.board[x1][y1];
    			let b = game.board[x2][y2];
    			let c = game.board[x3][y3];
    			let d = game.board[x4][y4];

    			if (a === "" || b === "" || c === "" || d === "") {
    				continue;
    			}

    			if (a === b && b === c && c === d) {
    				$$invalidate(1, game.winner = a, game);
    				break;
    			}
    		}

    		let draw = true;
    		for (let x = 0; x < 6; x++) for (let y = 0; y < 7; y++) if (game.board[x][y] === "") draw = false;
    		if (draw) $$invalidate(1, game.winner = undefined, game);
    	}

    	function handleClickCase(x, y) {
    		if (game.current_player !== usernameValue) return;
    		if (game.board[x][y] !== "") return;
    		let token = document.createElement("div");
    		token.classList.add(game[game.current_player]);
    		while (x < 5 && game.board[x + 1][y] === "") x++;
    		document.getElementById(x + "-" + y).appendChild(token);
    		$$invalidate(1, game.board[x][y] = game[game.current_player], game);
    		$$invalidate(1, game.last_move = { p: game.current_player, x, y }, game);
    		console.log(game.last_move);

    		for (const [key, value] of Object.entries(game)) {
    			if (game[usernameValue] === "Y" && value === "R") $$invalidate(1, game.current_player = key, game); else if (game[usernameValue] === "R" && value === "Y") $$invalidate(1, game.current_player = key, game);
    		}

    		checkWinning();
    		socketValue.emit("Connect-4 update-client", { id: game_id, game });
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Connect_4> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (x, y) => handleClickCase(x, y);

    	$$self.$capture_state = () => ({
    		push,
    		socket,
    		currentGame,
    		username,
    		Connection_Box: ConnectionBox,
    		winning_array,
    		socketValue,
    		game_id,
    		usernameValue,
    		game,
    		checkWinning,
    		handleClickCase
    	});

    	$$self.$inject_state = $$props => {
    		if ('winning_array' in $$props) winning_array = $$props.winning_array;
    		if ('socketValue' in $$props) socketValue = $$props.socketValue;
    		if ('game_id' in $$props) game_id = $$props.game_id;
    		if ('usernameValue' in $$props) $$invalidate(0, usernameValue = $$props.usernameValue);
    		if ('game' in $$props) $$invalidate(1, game = $$props.game);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [usernameValue, game, handleClickCase, click_handler];
    }

    class Connect_4 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Connect_4",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.49.0 */

    function create_fragment(ctx) {
    	let navbar;
    	let t;
    	let router;
    	let current;
    	navbar = new NavBar({ $$inline: true });

    	router = new Router({
    			props: {
    				routes: {
    					"/": wrap$1({
    						component: Dashboard,
    						conditions: [/*func*/ ctx[3]]
    					}),
    					"/home": Home,
    					"/about": About,
    					"/dashboard": wrap$1({
    						component: Dashboard,
    						conditions: [/*func_1*/ ctx[4]]
    					}),
    					"/register": Register,
    					"/login": wrap$1({
    						component: Login,
    						props: { fetchLogin: /*func_2*/ ctx[5] }
    					}),
    					"/tic-tac-toe": Tic_tac_toe,
    					"/connect-4": Connect_4
    				}
    			},
    			$$inline: true
    		});

    	router.$on("conditionsFailed", /*conditionsFailed*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*logged*/ 1) router_changes.routes = {
    				"/": wrap$1({
    					component: Dashboard,
    					conditions: [/*func*/ ctx[3]]
    				}),
    				"/home": Home,
    				"/about": About,
    				"/dashboard": wrap$1({
    					component: Dashboard,
    					conditions: [/*func_1*/ ctx[4]]
    				}),
    				"/register": Register,
    				"/login": wrap$1({
    					component: Login,
    					props: { fetchLogin: /*func_2*/ ctx[5] }
    				}),
    				"/tic-tac-toe": Tic_tac_toe,
    				"/connect-4": Connect_4
    			};

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let logged = false;
    	let usernameValue = "";
    	username.subscribe(val => usernameValue = val);

    	async function fetchLogin() {
    		try {
    			let response = await axios.get("http://" + 'localhost' + ":" + '4000' + "/verifToken", { withCredentials: true });

    			if (response.data.message === "OK") {
    				$$invalidate(0, logged = true);
    				username.set(response.data.username);
    				push("/dashboard");
    			}
    		} catch {
    			
    		}

    		if (username !== "") socket.set(lookup("http://" + 'localhost' + ":" + '4000', { query: { username: usernameValue } }));
    	}

    	fetchLogin();

    	function conditionsFailed(e) {
    		if (e.detail.route === "/") push("/home"); else push("/login");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = () => logged;
    	const func_1 = () => logged;
    	const func_2 = () => fetchLogin();

    	$$self.$capture_state = () => ({
    		axios,
    		NavBar,
    		socket,
    		username,
    		Router,
    		push,
    		wrap: wrap$1,
    		io: lookup,
    		About,
    		Home,
    		Register,
    		Login,
    		Dashboard,
    		TicTacToe: Tic_tac_toe,
    		Connect_4,
    		logged,
    		usernameValue,
    		fetchLogin,
    		conditionsFailed
    	});

    	$$self.$inject_state = $$props => {
    		if ('logged' in $$props) $$invalidate(0, logged = $$props.logged);
    		if ('usernameValue' in $$props) usernameValue = $$props.usernameValue;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [logged, fetchLogin, conditionsFailed, func, func_1, func_2];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
