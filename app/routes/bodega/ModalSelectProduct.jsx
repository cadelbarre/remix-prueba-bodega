import { useRef } from 'react'

export default function ModalSelectProduct () {
  const active = useRef(false)

  const toggleModal = () => active.current.classList.toggle('is-active')

  return (
    <div ref={active} className='modal is-active'>
      <div className='modal-background' onClick={toggleModal} />
      <div className='modal-content'>
        <div className='box'>
          <article>
            <table className='table is-fullwidth'>
              <thead>
                <tr>
                  <th>CheckBox</th>
                  <th>Codigo</th>
                  <th>Descripción del Producto</th>
                  <th>Codigo Barra</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className='has-text-centered'>
                    <label className='checkbox'>
                      <input type='checkbox' />
                    </label>
                  </th>
                  <td>1234</td>
                  <td>Naproxeno</td>
                  <td>38</td>
                </tr>
                <tr>
                  <th className='has-text-centered'>
                    <label className='checkbox'>
                      <input type='checkbox' />
                    </label>
                  </th>
                  <td>1234</td>
                  <td>Naproxeno</td>
                  <td>38</td>
                </tr>
              </tbody>
            </table>

          </article>
        </div>
      </div>
      <button className='modal-close is-large' aria-label='close' onClick={toggleModal} />
    </div>
  )
}
