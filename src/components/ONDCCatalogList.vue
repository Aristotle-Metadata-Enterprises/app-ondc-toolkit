<template>
  <div class="">
    <base >
      <h2>ONDC Data Catalog</h2>
      <button class="pull-right btn btn-primary">Download ONDC Catalog</button>
      <hr>
      <hr>
      <hr>
      <ag-grid-vue
        style="width: 100%; height: 1200px"
        class="ag-theme-alpine"
        rowSelection="single"
        :rowData="this.catalog.items"
        :columnDefs="ondcColDefs">
      </ag-grid-vue>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ArgusApp from '../lib/argusjs/argus.vue'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
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
  components: {
    AgGridVue,
  },
  props: {
  },
  data() {
    return {
      catalog: {
        items: [],
        page: 1
      },
      ondcFields: {},
      ondcFieldsLoaded: false,
      ondcData: [
      ],
      ondcColDefs: this.createColDefs(),
      ondcGridOptions: {
        rowData: this.ondcData,
        columnDefs: this.ondcColDefs,
        rowSelection: 'single',

        // EVENTS
        // Add event handlers
        // onRowClicked: event => console.log('A row was clicked')
        // onColumnResized: event => console.log('A column was resized')
        // onGridReady: event => console.log('The grid is now ready')

        // // CALLBACKS
        // getRowHeight: (params) => 25
      },

    }
  },
  mounted() {
    // this.name // type: string | undefined
    // this.msg // type: string
    // this.count // type: number
  },
  methods: {
    init: function() {
      this.getOndcFields().then(
        this.initList()
      )
      console.log("ONDC", this.ondcFields)
    },
    initList: function() {
      this.aristotleApi(
         "/api/v4/metadata/dataset",
         'get',
        {},
      ).then((result) => {
        console.log(result.data.results)
        result.data.results.forEach(entry => {
          let clean_fields = {}
          entry.customvalue_set.forEach(cvs => {
            console.log([entry, this.ondcFields, `DB_ID:${entry.field}`, this.ondcFields[`DB_ID:${entry.field}`]])
            clean_fields[this.ondcFields[`DB_ID:${cvs.field}`]['system_name']] = cvs
          })
          entry.custom_fields = clean_fields
        })
        this.catalog.items = result.data.results
        console.log(this.catalog.items)
      })
    },
    getOndcFields: function () {
        return this.aristotleApi("/api/v4/custom_fields/list/", 'get').then(response => {
            response.data
            var cfs = {}
            response.data.forEach(cf => {
                // TODO: Only include dataset fields (but this isn't easy to look up yet)
                if (cf['system_name'].startsWith('ondc:')) {
                    cfs[cf.system_name] = cf
                    cfs[`DB_ID:${cf.id}`] = cf
                }
            })
            this.ondcFields = cfs
            this.ondcFieldsLoaded = true
        })
    },
    
    createColDefs: function () {
      let allCols = allAttrs.map((field) => (
        // { headerName: field['label'], field: fieldPath(field), cellRenderer: this.NameCellRenderer, pinned: 'left', headerTooltip: "HELLO"},
        {
          "headerName": field.label, "field": fieldPath(field), "headerTooltip": field.helpText,
          "cellRenderer": (field.fieldType == "html" ? this.HTMLCellRenderer : null),
          "autoHeight": (field.fieldType == "html"),
        }
      ))

      // allCols[0].cellRenderer = this.NameCellRenderer
      allCols[0].pinned = 'left'
      allCols[1].pinned = 'left'

      allCols = allCols.concat([
        { headerName: "Actions", field: "id", cellRenderer: this.ActionCellRenderer, pinned: 'right' },
      ])
      return allCols
    },
    HTMLCellRenderer: function (params) {
      return params.value
    },
    NameCellRenderer: function(params) {
      return `<a href="${this.mdr.url}/item/${params.data.id}">${params.value}</a>`
    },
    ActionCellRenderer: function(params) {
      return `<a class="btn btn-default" href="/editrecord/${params.data.id}">Edit record</a>`
    }
  }
})

</script>

<style scoped>

</style>
