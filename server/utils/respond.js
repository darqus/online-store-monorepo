export const ok = (res, data = null, meta = undefined) => {
  const payload = { success: true, data }
  if (meta) {
    payload.meta = meta
  }
  return res.status(200).json(payload)
}

export const created = (res, data = null) => {
  return res.status(201).json({ success: true, data })
}
