<template>
  <div class="">
    <base >
      <h2>ONDC Data Catalog</h2>
      <button class="pull-right btn btn-primary">Download ONDC Catalog</button>
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

export default defineComponent({
  // type inference enabled
  extends: ArgusApp,
  props: {
  },
  data() {
    return {
      catalog: {
        items: [],
        page: 1
      },
      ondcFields: {},
      ondcFieldsLoaded: false
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
            console.log(cfs)
            this.ondcFields = cfs
            this.ondcFieldsLoaded = true
        })
    }
  }
})

</script>

<style scoped>

</style>
