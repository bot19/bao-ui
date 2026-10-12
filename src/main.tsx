import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Catalog } from '@/catalog/Catalog'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root')

createRoot(root).render(
  <StrictMode>
    <Catalog />
  </StrictMode>,
)
