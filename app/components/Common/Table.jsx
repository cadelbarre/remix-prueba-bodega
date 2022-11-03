import { upperFirstLetter } from '~/utils/utilities'

export default function Table ({ body, title = '' }) {
  const headers = Object?.keys(body[0])

  return (
    <>
      <h1 className='has-text-weight-semibold is-size-5 has-text-link'>{title}</h1>
      <table id='productList' className='table is-striped is-hoverable is-fullwidth' style={{ fontSize: '13px' }}>
        <thead>
          <tr>
            {headers.map((head) => <th key={head}>{upperFirstLetter(head)}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            body.map((row) => (
              <tr key={row.items}>
                {
                  Object.values(row).map((cell, index) => <td key={index}>{cell}</td>)
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  )
}
