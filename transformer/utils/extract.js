var libxslt = require('libxslt');
var AdmZip = require("adm-zip");
const fs = require('fs');

var xpath = require('xpath')
var dom = require('xmldom').DOMParser


function parse (filename, options) {
  let content = parseFromWord(filename, options)
  console.log("vv", content)
}


function parseFromWord(filename, options) {
    // reading archives
    var zip = new AdmZip(filename);
    
    let documentString = zip.readAsText("word/document.xml")
    let output = ""
    try {
      const stylesheetString = fs.readFileSync('./word-to-simple.xsl', 'utf8');
      var stylesheet = libxslt.parse(stylesheetString)
      
      // 'params' parameter is optional
      var result = stylesheet.apply(documentString)
      var doc = new dom().parseFromString(result)
      var rootkeys = xpath.select("/form/key", doc)
      // console.log(form)
      
      output = processFieldList(rootkeys)
      return output

    } catch (err) {
      console.error(err);
    }
}

function processFieldList(elements) {
    // results = OrderedDict()
    // for field in element.xpath("./key"):
    //     results[field.attrib['name']] = process_field(field)
    // return results
    let output = {}
    elements.forEach(field => {
      var fieldName = xpath.select1("./@name", field).value
      if (fieldName) {
        output[fieldName] = processField(field);
      }
    });
    return output
   
}

function processField(field) {
    var ftype = xpath.select1("./@type", field).value
    if (ftype == "text") {
        return xpath.select1("./@value", field).value
    } else if (ftype == "datetime") {
        return xpath.select1("./@value", field).value
    } else if (ftype == "richtext") {
        return xpath.select("./*", field).map(elem => elem.toString()).join("|")
    } else if (ftype == "select") {
        return xpath.select1("./@value", field).value
    } else if (ftype == "repeatingSection") {
        var output = []
        xpath.select("./item", field).forEach(item => {
          output.push(processFieldList(xpath.select("./key", item)))
        })
        return output
    }
}

module.exports = { parse, parseFromWord };