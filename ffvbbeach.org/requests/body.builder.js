export default function getRequestBody(formData) {
  const form = new URLSearchParams(formData)
  const keysForDel = []
  form.forEach((value, key) => {
    if (value === 'null') {
      keysForDel.push(key)
    }
  })

  keysForDel.forEach((key) => {
    form.delete(key)
  })

  return form.toString()
}
