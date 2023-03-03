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
      <!-- <pre>{{ item }}</pre> -->
      <hr>
      <form>
        <div class="form-table">
          <div v-for="field in ondcFields">
            <div>{{ field.label }}</div>
            <div>
              <pre v-if="field.fieldType == 'read-only'">{{ fetchFieldData(item, field) }}</pre>
              <input v-if="field.fieldType == 'str'" :name="field.field" :value="fetchFieldData(item, field)">
              <textarea v-if="field.fieldType == 'html'" :name="field.field">{{ fetchFieldData(item, field) }}</textarea>
              <input v-if="field.fieldType == 'date'" :name="field.field" :value="fetchFieldData(item, field)">
            </div>
          </div>
        </div>
      </form>
      
  </div>
</template>

<script lang="ts">
import { ValueCache } from 'ag-grid-community'
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
      this.retrieveTokens()
      console.log("MY MDR", this.mdr)
      this.fetchItem()
    },
    fetchFieldData: function (item, fieldSpec) {
      if (!item) {
        return ""
      }
      if (fieldSpec["field"].startsWith("aristotle:")) {
        let field_name = fieldSpec["field"].split(":")[1]
        return item[field_name]
      } else if (fieldSpec["field"].startsWith("ondc:")) {
        let customset = item.customvalue_set
        if (customset) {
            1/0
          let cf_name = fieldSpec["field"].split(":")[1]
          let value = [cf_name]
          if (value) {
            return value.content
          } else {
            return ""
          }
          
        }
      }
    },
    fetchItem: function() {
      this.aristotleApi(
         `/api/v4/metadata/dataset/${this.$route.params.id}`,
         'get',
        {},
      ).then((result) => {
        console.log(result)
        this.item = result.data
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
