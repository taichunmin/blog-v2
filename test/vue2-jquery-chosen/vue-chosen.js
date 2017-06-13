/* global Vue, $ */
Vue.component('select-chosen', {
  template:
    '<select @input="emitValue" :data-placeholder="placeholder" :class="class1 || {}" :multiple="multiple">' +
    '<option v-for="(name, id) in normalOptions" :value="id">{{name}}</option>' +
    '<optgroup :label="label" v-for="(groupOptions, label) in optgroups">' +
    '<option v-for="(name, id) in groupOptions" :value="id">{{name}}</option>' +
    '</optgroup>' +
    '</select>',
  props: {
    value: {required: true},
    options: {type: Object, required: true},
    placeholder: {type: String, default: '選擇一個選項...'},
    class1: {type: Object, default: function () { return {} }},
    debug: {type: Boolean, default: false},
    multiple: {type: Boolean, default: false}
  },
  mounted () {
    $(this.$el).change(this.emitValue)
    this.init()
  },
  computed: {
    optgroups () {
      let result = {}
      let key
      for (key in this.options) {
        if (this.isObjectLike(this.options[key])) {
          result[key] = this.options[key]
        }
      }
      return result
    },
    normalOptions () {
      let result = {}
      let key
      for (key in this.options) {
        if (this.isNotObject(this.options[key])) {
          result[key] = this.options[key]
        }
      }
      return result
    }
  },
  methods: {
    init () {
      if (this.debug) console.log('chosen:init')
      $(this.$el).chosen({
        disable_search_threshold: 5,
        inherit_select_classes: true,
        no_results_text: '什麼都沒找到...',
        search_contains: true,
        width: '100%'
      })
      this.$nextTick(function () {
        // 修正 select 在 value 為空時 inserted 後會自動選擇第一個的問題
        if (this.debug) console.log('reset', this.value)
        $(this.$el).val(this.value).trigger('chosen:updated')
      })
      return this
    },
    destroy () {
      if (this.debug) console.log('chosen:destroy')
      $(this.$el).chosen('destroy')
      return this
    },
    emitValue () {
      let value = $(this.$el).val()
      if (this.multiple && value == null) value = []
      if (this.debug) console.log('emit', value)
      this.$emit('input', value, 1)
    },
    isObjectLike (value) {
      return value != null && typeof value === 'object'
    },
    isNotObject (value) {
      return value == null || typeof value !== 'object'
    }
  },
  watch: {
    value () {
      this.$nextTick(function () {
        if (this.debug) console.log('chosen:updated', this.value)
        $(this.$el).val(this.value).trigger('chosen:updated')
      })
    },
    options () {
      this.$nextTick(function () {
        if (this.debug) console.log('chosen:rebuild', this.options.length)
        this.destroy().init()
      })
    }
  },
  beforeDestroy () {
    if (this.debug) console.log('chosen:beforeDestroy')
    this.destroy()
    $(this.$el).unbind('change', this.emitValue)
  }
})
