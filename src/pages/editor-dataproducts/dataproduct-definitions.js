export const fieldDefinitions = {
  id: {
    type: 'Integer',
    editable: false,
    display: false,
    label: 'Dataproduct ID',
    pristine: true
  },
  title: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Title',
    pristine: true
  },
  publish_year: {
    type: 'Integer',
    editable: true,
    display: true,
    label: 'Year Published',
    pristine: true
  },
  publish_date: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Date Published',
    pristine: true
  },
  keywords: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Keywords',
    pristine: true
  },
  abstract: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Abstract',
    pristine: true
  },
  provider: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Provider',
    pristine: true
  },
  author: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Author',
    pristine: true
  },
  contact: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Contact',
    pristine: true
  },
  coverage_spatial: {
    type: 'JSON',
    editable: false,
    display: false,
    label: 'Spatial Coverage',
    pristine: true
  },
  coverage_temp_start: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Temperature Coverage Start Date',
    pristine: true
  },
  coverage_temp_end: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Temperature Coverage End Date',
    pristine: true
  },
  res_spatial: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Spatial Resolution',
    pristine: true
  },
  res_spatial_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Spatial Resolution Unit',
    pristine: true
  },
  res_temperature: {
    type: 'Float',
    editable: true,
    display: true,
    label: ' Temperature Resolution',
    pristine: true
  },
  res_temperature_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Temperature Resolution Unit',
    pristine: true
  },
  uncertainty: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'Uncertainty',
    pristine: true
  },
  uncertainty_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Uncertainty Unit',
    pristine: true
  },
  doi: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Digital Object Identifier (DOI)',
    pristine: true
  },
  license: {
    type: 'String',
    editable: true,
    display: true,
    label: 'License',
    pristine: true
  },
  url_download: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Download URL',
    pristine: true
  },
  file_format: {
    type: 'String',
    editable: true,
    display: true,
    label: 'File Format',
    pristine: true
  },
  file_size: {
    type: 'Float',
    editable: true,
    display: true,
    label: 'File Size',
    pristine: true
  },
  file_size_unit: {
    type: 'String',
    editable: true,
    display: true,
    label: 'File Size Unit',
    pristine: true
  },
  url_info: {
    type: 'String',
    editable: true,
    display: true,
    label: 'URL Information',
    pristine: true
  },
  created_by: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Created By',
    pristine: true
  },
  created_at: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Date Created',
    pristine: true
  },
  modified_by: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Modified By',
    pristine: true
  },
  modified_at: {
    type: 'Date',
    editable: true,
    display: true,
    label: 'Date Modified',
    pristine: true
  },
  present: {
    type: 'String',
    editable: true,
    display: true,
    label: 'Present',
    pristine: true
  }
}
