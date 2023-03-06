<template>
  <div class="">
    <base >
      <h2>ONDC Data Catalog</h2>
      <a href="/catalog">Back</a>
      <button class="pull-right btn btn-primary">Download ONDC Catalog</button>
      <hr>
      <hr>
      <div>User {{ $route.params.id }}</div>
      <div>{{ mdr.url }}</div>
      <pre>{{ mdr.tokens.refresh }}</pre>
      <hr>
      <form>
        <div class="form-table">
          <div v-for="field in ondcFields">
            <div>{{ field.label }}</div>
            <div>
              <pre v-if="field.fieldType == 'read-only'">{{  field.field }}</pre>
              <input v-if="field.fieldType == 'str'" :name="field.field" :value="field.field">
              <textarea v-if="field.fieldType == 'html'" :name="field.field"></textarea>
              <input v-if="field.fieldType == 'date'" :name="field.field">
            </div>
          </div>
        </div>
      </form>
      
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ArgusApp from '../lib/argusjs/argus.vue'
import {allAttrs} from '../lib/ondc/fields.js'


function fieldPath (fieldSpec) {
  if (fieldSpec["field"].startsWith("aristotle:")) {
    return fieldSpec["field"].split(":")[1]
  } else if (fieldSpec["field"].startsWith("ondc:")) {
    return `custom_fields.${fieldSpec["field"]}.content`
  }
}

export default defineComponent({
  // type inference enabled
  extends: ArgusApp,
  props: {
  },
  data() {
    return {
      ondcItem: {},
      item: {},
      ondcFields: allAttrs
    }
  },
  mounted() {
    // this.name // type: string | undefined
    // this.msg // type: string
    // this.count // type: number
  },
  methods: {
    init: function() {
      this.fetchItem()
    },
    fetchItem: function() {
      this.aristotleApi(
         `/api/v4/metadata/dataset/${this.$route.params.id}`,
         'get',
        {},
      ).then((result) => {
        console.log("DATASET",result)
      })
    },
  }
})

</script>

<style scoped>
.form-table {
  display: table;
}
.form-table > div {
  display: table-row;
}
.form-table > div > div{
  display: table-cell;
  padding:5px;
}
</style>
