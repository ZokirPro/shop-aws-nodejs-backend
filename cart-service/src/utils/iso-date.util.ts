function toISO (date: Date) {
  return date.toISOString().split('T')[0];
}

export {
  toISO,
}