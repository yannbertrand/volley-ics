export default function getRequestBody(formData) {
  const form = new URLSearchParams(formData)

  return form.toString()
}
