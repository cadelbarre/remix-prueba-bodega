
import { json } from '@remix-run/node'
import { useFetcher, useTransition } from '@remix-run/react'
import { useEffect } from 'react'
import Table from '~/components/Common/Table'
import { getRemision } from '~/api/pedidos.server'

export const action = async ({ request }) => {
  const formData = await request.formData()
  const remision = formData.get('remision')

  const result = await getRemision(remision)
  return json(result)
}

// export const loader = async ({ request }) => {
//   const url = new URL(request.url)
//   const remision = url.searchParams.get('remision')
//   const result = await getRemision(remision)
//   return json(result)
// }

export default function Index () {
  const fetcher = useFetcher()

  const { state } = useTransition()
  const busy = state === 'submitting'

  const { result, error, errorMessage } = fetcher.data ?? {}
  const { client, body, total } = result ?? {}

  useEffect(() => { }, [fetcher])

  return (
    <main className='container'>
      <section className='section pb-0'>
        <fieldset disabled={busy}>
          <fetcher.Form method='post'>
            <div className='field'>
              <label className='label'>Número de la Remisión</label>
              <div className='control'>
                <input
                  className={`input ${error ? 'is-danger' : ''}`} type='number' placeholder='Ej: 123456' id='remision' name='remision' autoComplete='off' autoFocus
                  required
                />
                {error && <p className='help is-danger'>{errorMessage}</p>}
              </div>
            </div>
            <button className='button is-link' type='submit'>
              {busy ? '⌛️ Buscando...' : 'Buscar'}
            </button>
          </fetcher.Form>
        </fieldset>
      </section>

      {
        error === false &&

          <div id='printDocument'>
            <section className='section'>
              <article className='columns mb-0' style={{ fontSize: '13px' }}>
                <div className='column is-three-fifths'>
                  <p className='has-text-weight-semibold'>
                    <strong>Cliente:</strong>
                    {client.cliente}
                  </p>
                  <p><strong>Nit:</strong>
                    {client.nit}
                  </p>
                  <p>
                    <strong>Dirección:</strong>
                    {client.direccion}, {client.ciudad}
                  </p>
                  <p><strong>Observación:</strong>
                    {client.observacion}
                  </p>
                </div>
                <div className='column'>
                  <p><strong>Fecha Fact:</strong>
                    {client.fechaRemision}
                  </p>
                  <p><strong>Pedido:</strong>
                    {client.numeroRemision}
                  </p>
                  <p><strong>Cajas:</strong></p>
                </div>
                <div className='column'>
                  <p
                    id='PD' className='is-size-5 has-text-weight-semibold py-1 has-text-centered'
                    style={{ width: '100%', border: '1px solid #c9c9c9' }}
                  >
                    {client.tipo}
                    {client.numeroRemision}
                  </p>
                  <p><strong>Bolsa:</strong></p>
                </div>
              </article>

              <Table body={body} />

              <footer>
                <table className='table is-striped is-hoverable is-fullwidth has-text-centered' style={{ fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th className='has-text-centered'>Valor Subtotal</th>
                      <th className='has-text-centered'>Valor Total Descuento</th>
                      <th className='has-text-centered'>Valor Total Iva</th>
                      <th className='has-text-centered'>Total Pedido</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {total.subtotal}
                      </td>
                      <td>
                        {total.descto}
                      </td>
                      <td>
                        {total.iva}
                      </td>
                      <td>
                        {total.neto}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </footer>
            </section>
          </div>
      }

    </main>
  )
}

export const ErrorBoundary = ({ error }) => {
  const { message, stack } = error

  return (
    <section className='container section'>
      <div className='notification is-danger is-light'>
        <h2 className='has-text-centered has-text-weight-semibold mb-3'>Ha ocurrido un error 😓 ...</h2>
        <p><strong>Mensaje: </strong>{message}</p>
        <p><strong>Stack: </strong>{stack}</p>
      </div>
    </section>
  )
}
