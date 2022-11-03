
export default function Notification ({ data }) {
  return (
    <div className='notification is-danger mt-4'>
      {data.errorMessage} con el <strong><i>número de remisión N° {data.errorFields?.numeroRemision}</i></strong>
    </div>
  )
}
