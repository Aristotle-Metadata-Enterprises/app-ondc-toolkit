
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
  
  const optionalAttrs = [
    ondcFieldSpec["aristotle:release_date"],
    // ondcFieldSpec["aristotle-adv-cov:temporal-from"],
    // ondcFieldSpec["aristotle-adv-cov:temporal-to"],
    ondcFieldSpec["aristotle:frequency"],
    ondcFieldSpec["ondc:purpose"],
    ondcFieldSpec["aristotle:spatial"],
    ondcFieldSpec["aristotle:landing_page"],
    ondcFieldSpec["aristotle:licence"],
    ondcFieldSpec["ondc:sensitive-data"],
    ondcFieldSpec["ondc:legal-authority"],
    ondcFieldSpec["ondc:disposal"],
    ondcFieldSpec["ondc:data-status"],
    ondcFieldSpec["ondc:file-size"],
    ondcFieldSpec["ondc:format"],
    ondcFieldSpec["ondc:language"],
    ondcFieldSpec["ondc:publisher"],
  ]
  
  export const allAttrs = coreAttrs.concat(optionalAttrs)
  