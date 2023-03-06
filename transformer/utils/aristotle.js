const axios = require('axios');
const extract = require("./extract");

var token="89d2b0afd99b081440a749124b080c285e936b02"
var base_url="https://aristotle.cloud"


async function convert (filename, options) {
    let ondcFieldSpecs = await get_ondc_fields()

    let content = extract.parseFromWord(filename, options)
    let data = {
        // "provenance_set": [],
        // "slots": [],
        // "customvalue_set": []
    }
    let customvalue_set = []
    let provenance_set = []
    for (const [field, value] of Object.entries(content)) {
        if (field.startsWith("aristotle:")) {
            let fieldName = field.split(":", 2)[1]
            if (aristotleDatasetFields.indexOf(fieldName) >= 0) {
                data[fieldName] = value
            }
            if (fieldName == "release_date") {
                data[fieldName] = value.split("T", 1)[0]
            }
        }
        if (field.startsWith("ondc")) {
            let cfdetails = ondcFieldSpecs[field]
            let fieldName = field.split(":", 2)[1]
            if (cfdetails) {
                if (value && value !== "<p/>") {
                    customvalue_set.push({
                        "field": cfdetails.id,
                        "name": fieldName,
                        "content": value,
                    })
                }
            }
        }
    }

    var lineageIndex = 0;
    content['data-lineage'].forEach(lineage => {
        if (lineage.name) {
            let record = {
                "generation" : `<p>Data asset name: ${lineage.name}</p>
                    <p>Details: ${lineage.definition}</p>
                    <p>Contact point: ${lineage['contact-point']}</p>
                    <p>Transformation details: ${lineage.provenance}</p>`,
                "source_datasets": [],
                "order": lineageIndex
            }
            lineageIndex++
            provenance_set.push(record)
        }
    })        

    data["customvalue_set"] = customvalue_set
    data["provenance_set"] = provenance_set
    console.log(data)
    return data

//     if identifier := fields.get('aristotle:identifier', None):
//         cv_ids = fetch_custom_value_ids(identifier)
//         for cv in customvalue_set:
//             if cv_id := cv_ids.get(cv['field']):
//                 cv['id'] = cv_id

//     data["customvalue_set"] = customvalue_set
//     return data
}


async function get_ondc_fields() {
    return axios.get(`${base_url}/api/v4/custom_fields/list/`, 
        {headers: {
            'Authorization': `Token ${token}`
        }},
    ).then(response => {
        response.data
        var cfs = {}
        response.data.forEach(cf => {
            // TODO: Only include dataset fields (but this isn't easy to look up yet)
            if (cf['system_name'].startsWith('ondc:')) {
                cfs[cf.system_name] = cf
            }
        })
        return cfs

    })
}


const aristotleDatasetFields = [
  "name",
  "definition",
  "version",
  "references",
  "origin",
  "comments",
  "license",
  "rights",
  "release_date",
  "updated_date",
  "frequency",
  "spatial",
  "temporal",
  "catalog",
  "landing_page",
  "contact_point",
  "conforming_specification",
]

module.exports = { convert };
