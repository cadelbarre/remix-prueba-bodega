import db from '~/api/db'

export const fetchResponse = {
  error: false,
  errorMessage: '',
  errorFields: {},
  result: {}
}

export const getAllProducts = async () => {
  const query = `
    SELECT codigo, TRIM(nombre1) AS nombre FROM maesart 
    WHERE  activo = "S" 
    AND nombre1 NOT LIKE "%***%" 
    AND nombre1 NOT LIKE "%INACTI%"
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

export const getProductById = async (codigo) => {
  const query = `
      SELECT codigo, TRIM(nombre1) AS nombre FROM maesart 
      WHERE  activo = "S" 
      AND nombre1 NOT LIKE "%***%" 
      AND nombre1 NOT LIKE "%INACTI%"
      AND codigo = "${codigo}"
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
