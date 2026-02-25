import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '786ayc89',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})