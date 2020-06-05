//Meaningless validation. Simply here for more aesthetic structure to the fieldDefinitions. Essentially the validation of Strings or Dates
export const validate = (val) => {
  return [true, val]
}

//Tests if the given val can be converted to a int(usually via parseInt(val)) AND if val doesn't exceed the database Int limitations
export const validateInt = (val, precision) => {
  //returning false if val falls within the precision limitations, else continue
  if (parseInt(val).toString().length > precision) return [false, '-1']

  if (val === '') return [true, '0']
  else if (parseInt(val) > Number.MAX_SAFE_INTEGER || parseInt(val) < Number.MIN_SAFE_INTEGER) return [false, '-1']
  else if (!isNaN(val)) return [true, parseInt(val).toString()]
  else return [false, '-2']
}

//Tests if the given val can be converted to a float(usually via parseFloatt(val)) AND if val doesn't exceed the database Int limitations
export const validateFloat = (val, precision) => {
  //removing any white space
  val = val.trim()

  //returning false if val falls outside the precision limitations, else continue
  if (parseFloat(val).toString().replace('0.', '').replace('.', '').length > precision) {
    return [false, '-1']
  }

  //allowing '.' as an acceptable value as it would represent '0'.
  if (val === '.') {
    return [true, '0.']
  }
  //ensuring that a '0' is displayed if the user deletes the entire entry
  if (val === '') return [true, '0']
  //if val[0] is '0' AND val.length is 2, val is either '0.' or '01','02', etc. This makes sure '0.' is allowed and that '01' becomes '1'
  if (val[0] === '0' && val.length === 2) {
    if (val === '0.') return [true, val]
    else if (!isNaN(val)) return [true, val.substring(1)]
    else return [false, '-1']
  }

  //Making sure val is within the limitations of a Javascript Number
  if (parseInt(val) > Number.MAX_SAFE_INTEGER || parseInt(val) < Number.MIN_SAFE_INTEGER) return [false, '-1']

  //Final check. If val is not one of the above special cases, it must still be a number (!isNaN)
  if (!isNaN(val)) return [true, val]
  //return false since none of the valid inputs are met
  else return [false, '-1']
}
