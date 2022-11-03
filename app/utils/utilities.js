// @ts-check
/**
 * Convert a type string number into a number format with decimals.
 * @param {string} str - Number which is in type string.
 */
export const formaterNumber = (str) => new Intl.NumberFormat('es-CO').format(Math.round(Number(str)))

/** @param {import('~/types/pedidos.types').Remision[]} array */
export const sanitize = (array) => {
  const arraySanitized = array.map(element => {
    const { items, nombre1, grupo, Ubicacion, lote, venceitem, cantidad, precio, iva, desto, preciotot, codigobarra } = element
    return {
      items: items.trim(),
      description: nombre1.trim(),
      lab: grupo.trim(),
      codigobarra: codigobarra.trim(),
      ubicacion: Ubicacion.trim(),
      lote: lote.trim(),
      venceitem: venceitem.trim(),
      cantidad: formaterNumber(cantidad),
      precio: formaterNumber(precio),
      iva: formaterNumber(iva),
      desto: formaterNumber(desto),
      preciotot: formaterNumber(preciotot)
    }
  })

  return arraySanitized
}

/**
 * Format string date into a datetime format.
 * @param {string} date - Date in type string.
 */
export const formatDate = (date) => {
  const currentDate = new Date(date)
  const formaterDate = new Intl.DateTimeFormat('es-CO').format(currentDate)
  return formaterDate
}

/**
 * Uppercase first letter from a text
 * @param {string} str
 */
export const upperFirstLetter = (str) => {
  const firstLetter = str.toLowerCase().slice(0, 1).toUpperCase()
  const rest = str.slice(1)

  return firstLetter + rest
}

/**
 * Search a element into an array of product.
 * @param {Object} params
 * @param {import('~/types/pedidos.types.js').Backorder[]} params.data
 * @param {string} params.field
 * @param {string} params.valueToSearch
 */
export const filteredArray = (params) => {
  const { data, field, valueToSearch } = params
  // @ts-ignore
  const [check] = data.filter((element) => element[field] === valueToSearch)
  // @ts-ignore
  const filteredResults = data.filter((element) => element[field] !== valueToSearch)
  return { check, filteredResults }
}
