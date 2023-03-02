<template>
  <div class="">
    <base >
      <h2>ONDC Data Catalog</h2>
      <button class="pull-right btn btn-primary">Download ONDC Catalog</button>
      <hr>
      <hr>
      <hr>
      <ag-grid-vue
        style="width: 100%; height: 200px"
        class="ag-theme-alpine"
        rowSelection="single"
        :rowData="this.catalog.items"
        :columnDefs="ondcColDefs">
      </ag-grid-vue>

      <table v-if="ondcFieldsLoaded" class="table table-condensed table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>
              {{ ondcFields['ondc:security-classification'].name }}
              <span class="badge" :title="ondcFields['ondc:security-classification'].help_text">?</span>
            </th>
            <th>
              {{ ondcFields['ondc:resource-type'].name }}
              <span class="badge" :title="ondcFields['ondc:resource-type'].help_text">?</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in catalog.items" :key="item">
            <td><a :href="mdr.url + '/item/' + item.id" target="_parent">
              {{ item.name }}
            </a>
            </td>
            <td>
              <div v-html="item.definition"></div>
            </td>
            <td>
              {{ item.custom_fields['ondc:security-classification'].content }}
            </td>
            <td>
              {{ item.custom_fields['ondc:resource-type'].content }}
            </td>
            <td>
              <a href="/edit" class="btn btn-sm btn-default">Edit ONDC record</a>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ArgusApp from '../lib/argusjs/argus.vue'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

const ondcFieldSpec = {
  "aristotle:uuid": {"field":"aristotle:uuid","label":"Identifier","helpText":"The unique identifier of the asset.","fieldType":"read-only",},
  "aristotle:name": {"field":"aristotle:name","label":"Title","helpText":"The name or title by which the asset is known.","fieldType":"str",},
  "aristotle:definition": {"field":"aristotle:definition","label":"Description","helpText":"A descriptive statement of the asset.","fieldType":"html",},
  "aristotle:contact_point": {"field":"aristotle:contact_point","label":"Point of Contact","helpText":"The relevant contact information from which information for the asset can be obtained.","fieldType":"html",},
  "aristotle:rights": {"field":"aristotle:rights","label":"Access Rights","helpText":"Specifies access to the data asset.","fieldType":"html",},
  "ondc:security-classification": {"field":"ondc:security-classification","label":"Security Classification","helpText":"The security classification applied to the asset as specified by the Australian Government Protective Security Policy Framework.","fieldType":"enum","choices":"UNCLASSIFIED,OFFICIAL,OFFICIAL-SENSITIVE,SECURE,PROTECTED,SECRET,TOP-SECRET"},
  "ondc:data-custodian": {"field":"ondc:data-custodian","label":"Data Custodian","helpText":"The data custodian(s) of the data, according to the Data Availability and Transparency Act.","fieldType":"html",},
  "ondc:keyword": {"field":"ondc:keyword","label":"Keyword","helpText":"A keyword or tag describing the asset.","fieldType":"str",},
  "ondc:resource-type": {"field":"ondc:resource-type","label":"Resource Type","helpText":"The category of asset being described.","fieldType":"str",},
  "aristotle:updated_date": {"field":"aristotle:updated_date","label":"Date Modified","helpText":"The most recent date the data asset was changed, updated or modified.","fieldType":"date",},
  "aristotle:release_date": {"field":"aristotle:release_date","label":"Publish date","helpText":"The date on which the asset was formally issued or made available.","fieldType":"date",},
  "aristotle-adv-cov:temporal-from": {"field":"aristotle-adv-cov:temporal-from","label":"Temporal coverage from","helpText":"The start date of the period for which this asset is applicable","fieldType":"date",},
  "aristotle-adv-cov:temporal-to": {"field":"aristotle-adv-cov:temporal-to","label":"Temporal coverage to","helpText":"The end date of the period for which this asset is applicable","fieldType":"date",},
  "aristotle:frequency": {"field":"aristotle:frequency","label":"Update Frequency","helpText":"The frequency at which new, revised or updated versions of this data asset are made available.","fieldType":"str",},
  "ondc:purpose": {"field":"ondc:purpose","label":"Purpose","helpText":"A descriptive summary of the intentions with which the asset was developed.","fieldType":"html",},
  "aristotle:spatial": {"field":"aristotle:spatial","label":"Location","helpText":"The geographic area the asset applies to.","fieldType":"html",},
  "aristotle:landing_page": {"field":"aristotle:landing_page","label":"Access URL","helpText":"The file path and/or URL that gives access to a distribution of the resource.","fieldType":"str",},
  "aristotle:licence": {"field":"aristotle:licence","label":"Licence","helpText":"A legal document under which the asset is made available.","fieldType":"html",},
  "ondc:sensitive-data": {"field":"ondc:sensitive-data","label":"Sensitive Data","helpText":"The indicator of whether the data asset contains sensitive data.","fieldType":"str",},
  "ondc:legal-authority": {"field":"ondc:legal-authority","label":"Legal Authority","helpText":"The legal mandate under which the asset was collected, created, received, used or disclosed.","fieldType":"html",},
  "ondc:disposal": {"field":"ondc:disposal","label":"Disposal","helpText":"Information about current records authorities and the disposal actions that relate to the data asset.","fieldType":"html",},
  "ondc:data-status": {"field":"ondc:data-status","label":"Data Status","helpText":"A status that describes the state of progression or registration of the data asset.","fieldType":"enum","choices":"completed, historicalArchive, obsolete, onGoing, planned, required, underDevelopment, final, pending, retired, superseded, tentative, valid, accepted, notAccepted, withdrawn, proposed, deprecated"},
  "ondc:file-size": {"field":"ondc:file-size","label":"File size","helpText":"The size of the asset in bytes","fieldType":"str",},
  "ondc:format": {"field":"ondc:format","label":"Format","helpText":"The file format of the data distribution.","fieldType":"str",},
  "ondc:language": {"field":"ondc:language","label":"Language","helpText":"Language of the asset.","fieldType":"str",},
  "ondc:publisher": {"field":"ondc:publisher","label":"Publisher","helpText":"The name of an entity responsible for making the asset available.","fieldType":"html",},
}

const coreAttrs = [
  ondcFieldSpec["aristotle:uuid"],
  ondcFieldSpec["aristotle:name"],
  ondcFieldSpec["aristotle:definition"],
  ondcFieldSpec["aristotle:contact_point"],
  ondcFieldSpec["aristotle:rights"],
  ondcFieldSpec["ondc:security-classification"],
  ondcFieldSpec["ondc:data-custodian"],
  ondcFieldSpec["ondc:keyword"],
  ondcFieldSpec["ondc:resource-type"],
  ondcFieldSpec["aristotle:updated_date"],
]

function fieldPath (fieldSpec) {
  if (fieldSpec["field"].startsWith("aristotle:")) {
    return fieldSpec["field"].split(":")[1]
  } else if (fieldSpec["field"].startsWith("ondc:")) {
    return `custom_fields.${fieldSpec["field"]}.content`
  }
}

function createColDefs () {
  return coreAttrs.map((field) => (
    // { headerName: field['label'], field: fieldPath(field), cellRenderer: this.NameCellRenderer, pinned: 'left', headerTooltip: "HELLO"},
    { "headerName": field.label, "field": fieldPath(field), "headerTooltip": field.helpText}
  ))
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
      ondcColDefs: createColDefs(),
      nothing: [
        { headerName: "Name", field: "name", cellRenderer: this.NameCellRenderer, pinned: 'left', headerTooltip: "HELLO"},
        { headerName: "Definition", field: "definition", cellRenderer: this.HTMLCellRenderer, autoHeight: true},
        { headerName: "Contact Point", field: "contact_point" },
        { headerName: "Security Classification", field: "custom_fields.ondc:security-classification.content" },
        { headerName: "Data Custodian", field: "custom_fields.ondc:data-custodian.content" },
        // { headerName: "Keyword", field: "custom_fields.ondc:keyword.content" },
        { headerName: "Resource Type", field: "custom_fields.ondc:resource-type.content" },
        { headerName: "Resource Type", field: "updated_date" },
        { headerName: "Sensitive Data", field: "custom_fields.ondc:sensitive-data.content" },
        { headerName: "Legal Authority", field: "custom_fields.ondc:legal-authority.content" },
        { headerName: "Disposal", field: "custom_fields.ondc:disposal.content" },
        
        { headerName: "Actions", field: "id", cellRenderer: this.ActionCellRenderer, pinned: 'right' },
      ],
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
    HTMLCellRenderer: function (params) {
      return params.value
    },
    NameCellRenderer: function(params) {
      console.log("PARAMS", params)
      return `<a href="${this.mdr.url}/item/${params.data.id}">${params.value}</a>`
    },
    ActionCellRenderer: function(params) {
      return `<a class="btn btn-default" href="${this.mdr.url}/item/${params.data.id}">Edit record</a>`
    }
  }
})

</script>

<style scoped>

</style>
