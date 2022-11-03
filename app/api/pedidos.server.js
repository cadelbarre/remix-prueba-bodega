import db from '~/api/db'
import { formatDate, formaterNumber, sanitize } from '~/utils/utilities'

export const fetchResponse = {
  error: false,
  errorMessage: '',
  errorFields: {},
  result: {}
}

/** @param {string} numeroRemision */
export const getRemision = async (numeroRemision) => {
  const query =
    `SELECT 
      p.tipo, p.numero, p.fecha, trim(c.nombre) AS nombreCliente, p.cliente, c.nit, c.telefono, c.direccion, c.ciudad, p.observa, p.fecha, c.dias, p.formapago, p.items, m.nombre1, TRIM(m.codigobarra) AS codigobarra, m.grupo, m.ubicacion AS Ubicacion, p.lote, p.venceitem, p.cantidad, p.precio, p.iva, p.desto, p.valdestoitem, p.preciotot, p.venta, p.valoriva, p.valor 
    FROM pedidodr p 
    INNER JOIN clientes c ON p.cliente = c.codigo 
    INNER JOIN maesart m ON p.items = m.codigo 
    WHERE p.numero = ${numeroRemision} ORDER BY Ubicacion;`

  const connect = await db()
  try {
    const response = connect.execute(query)
    /** @type {{0: import('~/types/pedidos.types').Remision[]}} */
    const { 0: rows } = await response

    if (Array.isArray(rows) && rows.length === 0) {
      fetchResponse.error = true
      fetchResponse.errorMessage = 'No se encontró ninguna coincidencia'
      fetchResponse.errorFields = { numeroRemision }
      return fetchResponse
    }

    const { venta, valoriva, valor } = rows[0]
    const { nombreCliente, cliente, direccion, ciudad, fecha, numero, observa, tipo } = rows[0]

    let acumDesto = 0
    rows.forEach((item) => {
      acumDesto += Number(item.valdestoitem)
    })

    const subtotal = Number(venta) + acumDesto

    const total = {
      iva: formaterNumber(valoriva),
      descto: formaterNumber(acumDesto),
      subtotal: formaterNumber(subtotal),
      neto: formaterNumber(valor)
    }

    const client = {
      cliente: nombreCliente.trim(),
      nit: cliente.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      fechaRemision: formatDate(fecha),
      numeroRemision: numero,
      observacion: observa.trim(),
      tipo: tipo.trim()
    }

    const rowsSanitized = sanitize(rows)

    fetchResponse.result = { total, client, body: rowsSanitized }
    return fetchResponse
  } catch (error) {
    console.error({ error })
  } finally {
    connect.end()
  }
}

/** @param {string} numeroRemision */
export const getAllDraftOrders = async () => {
  const query = 'select distinct p.numero FROM pedidodr p ORDER BY numero;'

  const connect = await db()
  try {
    const response = connect.execute(query)
    const { 0: rows } = await response

    if (Array.isArray(rows) && rows.length === 0) {
      fetchResponse.error = true
      fetchResponse.errorMessage = 'No se encontró ninguna coincidencia'
      return fetchResponse
    }

    fetchResponse.result = { body: rows }
    return fetchResponse
  } catch (error) {
    console.error({ error })
    return error
  } finally {
    connect.end()
    connect.destroy()
  }
}

export const getProductsByBarcode = async (barcode) => {
  const query = `
    SELECT codigo, TRIM(nombre1) AS nombre, codigobarra  FROM maesart 
    WHERE  activo = "S" 
    AND nombre1 NOT LIKE "%***%" 
    AND nombre1 NOT LIKE "%INACTI%"
    AND codigobarra LIKE "%${barcode}%"
    ORDER BY nombre1 ASC
  `

  const connect = await db()
  try {
    const response = connect.execute(query)
    const { 0: rows } = await response

    if (Array.isArray(rows) && rows.length === 0) {
      fetchResponse.error = true
      fetchResponse.errorMessage = 'No se encontró ninguna coincidencia'
      return fetchResponse
    }

    fetchResponse.result = { body: rows }
    return fetchResponse
  } catch (error) {
    console.error({ error })
    return error
  } finally {
    connect.end()
    connect.destroy()
  }
}

export const saveProductIntoBackorder = async (values) => {
  const query = 'INSERT INTO backorder values (?,?,?,?,?,?,?,?,?,?,?, now())'

  const valuesEntries = []
  for (const item in values) {
    valuesEntries.push(values[item])
  }

  const connect = await db()

  try {
    const response = connect.execute(query, valuesEntries)
    const { 0: rows } = await response

    if (Array.isArray(rows) && rows.length === 0) {
      fetchResponse.error = true
      fetchResponse.errorMessage = 'No se encontró ninguna coincidencia'
      return fetchResponse
    }

    fetchResponse.result = { body: rows }
    return fetchResponse
  } catch (error) {
    console.error({ error })
    fetchResponse.result = { body: error }
    fetchResponse.error = true
    fetchResponse.errorMessage = `${error.code} - ${error.sqlMessage} - state: ${error.sqlState}`
    return fetchResponse
  } finally {
    connect.end()
    connect.destroy()
  }
}

export const updateOrderByIdOrder = async (values) => {
  const query = `
    UPDATE pedidosdr 
    SET cantidad = ?, precioneto = ?, preciotot = ?, venta = ?, valor = ?, valoriva = ?
    WHERE items = ? AND numero = ? AND cliente = ? AND lote = ?
  `

  const valuesEntries = []
  for (const item in values) {
    valuesEntries.push(values[item])
  }

  const connect = await db()
  try {
    const response = connect.execute(query, valuesEntries)
    const { 0: rows } = await response

    if (Array.isArray(rows) && rows.length === 0) {
      fetchResponse.error = true
      fetchResponse.errorMessage = 'No se encontró ninguna coincidencia'
      return fetchResponse
    }

    fetchResponse.result = { body: rows }
    return fetchResponse
  } catch (error) {
    console.error({ error })
    return error
  } finally {
    connect.end()
    connect.destroy()
  }
}
