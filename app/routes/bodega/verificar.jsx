import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useTransition } from '@remix-run/react'
import Verificar from '~/components/Bodega/VerificarCodigoBarra'

import { getAllDraftOrders, getRemision, saveProductIntoBackorder } from '~/api/pedidos.server'

export const action = async ({ request }) => {
  const formData = await request.formData()

  const { _action } = Object.fromEntries(formData)

  if (_action === 'buscar-remision') {
    const remision = formData.get('remision')

    const result = await getRemision(remision)
    return json(result)
  } else {
    for (const jsonValue in Object.fromEntries(formData)) {
      const value = formData.get(jsonValue)
      const parsed = JSON.parse(value)
      if (parsed.cantidad <= 0) break

      const { error, result } = await saveProductIntoBackorder(parsed)
      if (error) return json({ result, error })
    }

    return null
  }
}

export const loader = async () => {
  const pedidosdr = await getAllDraftOrders()
  return json(pedidosdr)
}

export default function verificar () {
  const data = useActionData()
  const pedidodr = useLoaderData()
  const { result: resultLoader } = pedidodr ?? {}
  const { body } = resultLoader ?? {}

  const { state } = useTransition()
  const busy = state === 'submitting'

  const { result, error, errorMessage } = data ?? {}
  const { client } = result ?? {}

  return (
    <section className='section container'>
      <header>
        <div className='columns'>

          <div className='column'>
            <fieldset disabled={busy || client !== undefined}>
              <Form method='post' name='_action'>
                <label className='label'>Número de Remision</label>
                <div className='field has-addons'>
                  <div className='control'>
                    <input className={`input ${error ? 'is-danger' : ''}`} name='remision' id='remision' type='number' min='0' placeholder='N. Remisión' autoFocus />
                    {error && <p className='help is-danger'>{errorMessage}</p>}
                  </div>
                  <div className='control'>
                    <button type='submit' className='button is-link' name='_action' value='buscar-remision'>
                      {busy ? '⌛️ Buscando...' : 'Buscar'}
                    </button>
                  </div>
                </div>
              </Form>
            </fieldset>
          </div>

          {error === false &&
            <div className='column is-size-6 is-flex is-justify-content-end is-flex-direction-column'>
              <p className='has-text-weight-semibold'>
                <strong>Cliente: </strong>
                {client.cliente}
              </p>
              <p><strong>Nit: </strong>
                {client.nit}
              </p>
              <p>
                <strong>Dirección: </strong>
                {client.direccion}, {client.ciudad}
              </p>
            </div>}

          <div className='column'>
            <div className='box'>
              {
                body.map(({ numero }) => {
                  return (
                    <span className='tag mr-5' key={numero}>{numero}</span>
                  )
                })
              }
            </div>
          </div>

        </div>
      </header>
      <Verificar data={data} />
    </section>
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
