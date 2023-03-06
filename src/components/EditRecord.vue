<template>
  <div class="">
    <base >
      <h2>ONDC Data Catalog</h2>
      <a href="/catalog">Back</a>
      <hr>
      <button :onclick="saveItem">Save</button>
      <form>
        <div class="form-table">
          <div v-for="field in ondcFields" class="form-group">
            <div>
              <label>{{ field.label }}</label>
            </div>
            <div>
              <pre v-if="field.fieldType == 'read-only'">{{ fetchFieldData(item, field) }}</pre>
              <input class="form-control" v-if="field.fieldType == 'str'" :onchange="updateValue" :name="field.field" :value="fetchFieldData(item, field)">
              <textarea class="form-control" v-if="field.fieldType == 'html'" :name="field.field">{{ fetchFieldData(item, field) }}</textarea>
              <input class="form-control" v-if="field.fieldType == 'date'" :name="field.field" :value="fetchFieldData(item, field)">
              <span v-if="field.fieldType == 'enum'">
                <select class="form-control" :name="field.field" :value="fetchFieldData(item, field)">
                  <template v-for="opt in getFieldOpts(item, field)">
                    <option :value="opt.choice">{{ opt.choice }}</option>
                  </template>
                </select>
              </span>
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
    updateValue: function(event) {
      console.log(event)
      console.log(event.target.name, event.target.value)
      if (event.target.name.startsWith("aristotle:")) {
        let field_name = event.target.name.split(":")[1]
        this.item[field_name] = event.target.value
      } else if (fieldSpec["field"].startsWith("ondc:")) {
        let customset = this.item.customvalue_set
        if (customset) {
          let cf_name = event.target.name.split(":")[1]
          customset[cf_name].content = event.target.value
        }
      }
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
          let cf_name = fieldSpec["field"].split(":")[1]
          let value = customset[cf_name]
          if (value) {
            return value.content
          } else {
            return ""
          }
          
        }
      }
    },
    getFieldOpts: function (item, fieldSpec) {
      console.log("FIELDSPEC", fieldSpec)
      let item_val = ""
      if (fieldSpec["field"].startsWith("ondc:")) {
        let customset = this.item.customvalue_set
        if (customset) {
          let cf_name = fieldSpec['field'].split(":")[1]
          if (customset[cf_name]) {
            item_val = customset[cf_name].content
          }
        }
      }
      return fieldSpec.choices.split(',').map((choice) => (
        {"choice": choice, "selected": (item_val == choice)}
      ))
      //  ondcFields[fieldSpec.name]
    },
    saveItem: function(event) {
      var data = this.item;
      // data.name = "HELLO"
      this.aristotleApi(
         `/api/v4/metadata/dataset/${this.$route.params.id}`,
         'patch',
        data,
      ).then((result) => {
        console.log(result)
        this.item = result.data
      })

      console.log("SAVED")
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
