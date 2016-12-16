Vue.component('select-chosen', {
  template: '<select :value="value" v-on:input="updateValue($event.target.value)" :data-placeholder="placeholder" :class="class1 || {}"><option v-for="(name, id) in options" :value="id">{{name}}</option></select>',
  props: {
    value: {type: String, required: true, default: ''},
    options: {type: Object, required: true},
    placeholder: {type: String, default: '選擇一個選項...'},
    class1: {type: Object, default: function(){ return {} } },
    debug: {type: Boolean, default: false},
  },
  mounted() {
    var my = this;
    $(this.$el).change(function(){
      if(this.debug) console.log('chosen:change', this.value);
      my.updateValue(this.value); // this == this.$el
    });
    this.init();
  },
  methods: {
    init() {
      if(this.debug) console.log('chosen:init');
      $(this.$el).chosen({
        disable_search_threshold: 5,
        inherit_select_classes: true,
        no_results_text: "什麼都沒找到...",
        search_contains: true,
        width: '100%',
      });
      this.$nextTick(function(){
        // 修正 select 在 value 為空時 inserted 後會自動選擇第一個的問題
        this.$el.value = this.value;
        $(this.$el).trigger('chosen:updated');
      });
      return this;
    },
    destroy() {
      if(this.debug) console.log('chosen:destroy');
      $(this.$el).chosen('destroy');
      return this;
    },
    updateValue(value) {
      this.$emit('input', value);
    },
  },
  watch: {
    value() {
      this.$nextTick(function(){
        if(this.debug) console.log('chosen:updated', this.value);
        $(this.$el).trigger('chosen:updated');
      });
    },
    options() {
      this.$nextTick(function(){
        if(this.debug) console.log('chosen:rebuild', this.options.length);
        this.destroy().init();
      });
    },
  },
});
