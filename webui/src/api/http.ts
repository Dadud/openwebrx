// HTTP API for fetching static resources and status

export async function fetchStatus(): Promise<any> {
  const response = await fetch('/status.json')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function fetchFeatures(): Promise<any> {
  const response = await fetch('/api/features')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

