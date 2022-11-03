import { useRef, useEffect, useState } from 'react'
import { Form, useActionData, useSubmit, useTransition } from '@remix-run/react'
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import FormData from 'form-data'

import Table from '../Common/Table'
import { validate } from '~/utils/validate'
import { filteredArray } from '~/utils/utilities'

const MySwal = withReactContent(swal)

const INITIAL_CHECKED = {
  items: '',
  description: '',
  lab: '',
  codigobarra: '',
  ubicacion: '',
  lote: '',
  venceitem: '',
  cantidad: '',
  precio: '',
  iva: '',
  desto: '',
  preciotot: '',
  backorder: ''
}

export default function VerificarCodigoBarra ({ data }) {
  const actionData = useActionData()
  const { state } = useTransition()
  const submit = useSubmit()

  const { error: errorAction, errorMessage } = actionData ?? {}

  const busy = state === 'submitting'
  const { result, error } = data ?? {}
  const { client, body } = result ?? {}

  const [checked, setChecked] = useState([INITIAL_CHECKED])
  const [filtered, setFiltered] = useState(body)
  const [backorder, setBackOrder] = useState([])
  const inputCantidad = useRef(null)
  const inputCodigo = useRef(null)

  if (client !== undefined) {
    // inputCodigo.current.focus()
  }

  const resetInputsValues = () => {
    inputCantidad.current.value = ''
    inputCodigo.current.value = ''
    inputCodigo.current.focus()
    inputCodigo.current.select()
  }

  const handleKeyup = (e) => {
    e.preventDefault()

    if (e.code === 'F3') {
      console.log('funcionando')
    }
  }

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const values = {
        codigobarra: String(inputCodigo.current.value),
        cantidad: String(inputCantidad.current.value)
      }

      const { success: successCodigo } = validate.isPositiveNumber(values.codigobarra)
      const { success: successCantidad } = validate.isPositiveNumber(values.cantidad)

      if (!successCodigo && !successCantidad) return
      const { check, filteredResults } = filteredArray({ data: filtered ?? body, field: 'codigobarra', valueToSearch: values.codigobarra })

      const { success } = validate.isEmpty(check)
      const isMayorThan = Number(values.cantidad) > Number(check.cantidad)

      if (success) {
        return MySwal.fire().then(() => {
          return MySwal.fire({
            title: 'Producto no encontrado',
            text: 'El producto no se encuentra dentro de la orden de pedido.',
            icon: 'error'
          })
        })
      }

      if (isMayorThan || !successCantidad) {
        return MySwal.fire().then(() => {
          return MySwal.fire({
            title: 'Error - Campo cantidad',
            text: 'La cantidad digitada debe ser mayor que cero y menor que la cantidad de la orden pedido',
            icon: 'error'
          })
        })
      }

      const percentages = (100 + Number(check.iva) - Number(check.desto)) / 100
      const precioTotal = Number(values.cantidad) * Number(check.precio.replace('.', '')) * percentages

      check.preciotot = precioTotal
      check.backorder = Number(check.cantidad) - Number(values.cantidad)
      check.cantidad = values.cantidad

      if (check.backorder >= 0) {
        const valuesEntries = {
          numero: client.numeroRemision,
          fecha: client.fechaRemision,
          codigocliente: client.nit,
          nombre: client.cliente,
          observa: client.observa ?? '',
          items: check.items,
          cantidad: check.backorder,
          precio: Number(check.precio.replace('.', '')),
          sucursal: '01',
          bodega: '01',
          lab: check.lab
        }

        setBackOrder(prev => [...prev, valuesEntries])
      }

      setChecked(prev => [...prev, check])
      if (!filteredResults.length) setFiltered([INITIAL_CHECKED])
      else setFiltered(filteredResults)

      resetInputsValues()
    }
  }

  const handlerSubmitBackorder = () => {
    const formData = new FormData()
    for (const [key, value] of Object.entries(backorder)) {
      formData.append(key, JSON.stringify(value))
    }
    submit(formData, { method: 'post', action: '/bodega/verificar', replace: true })
  }

  const handleCodigoBarra = (e) => {
    setTimeout(function () {
      inputCantidad.current.focus()
      inputCantidad.current.value = '1'
    }
    , 500)
  }

  useEffect(() => { }, [filtered])

  return (
    <>
      <fieldset disabled={client === undefined} className='mt-4'>
        <div className='field is-grouped'>
          <div className='control is-flex-grow-3'>
            <label className='label'>Codigo de Barra</label>
            <input ref={inputCodigo} className='input' type='number' min='0' name='codigobarra' id='codigobarra' placeholder='Codigo de Barra' onChange={handleCodigoBarra} onKeyUp={handleKeyup} />
          </div>
          <div className='control is-flex-grow-2'>
            <label className='label'>Cantidad</label>
            <input ref={inputCantidad} onKeyDown={handleSubmit} className='input' type='number' min='0' name='cantidad' id='cantidad' placeholder='Cant. producto' />
          </div>
          <div className='control is-flex-grow-1 is-flex is-align-items-end'>
            <button className='button is-link' onClick={handleSubmit}>Verificar</button>
          </div>
        </div>
      </fieldset>
      <hr />

      <div className='is-flex is-justify-content-center'>
        <Form>
          <button className='button is-link' type='submit' disabled={checked[1]?.items === undefined} onClick={handlerSubmitBackorder}>
            {busy ? '⌛️ Guardando...' : 'Actualizar Pedido'}
          </button>
          {errorAction ? <p class='help is-danger'>{errorMessage}</p> : ''}
        </Form>
      </div>

      {error === false && <Table body={filtered ?? body} title='Pedido Remisión' />}
      {error === false && <Table body={checked} title='Pedido Verificado ✓' />}
    </>
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
