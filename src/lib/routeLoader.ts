import React, { lazy } from 'react'

const pageModules = import.meta.glob('../pages/**/*.{ts,tsx,js,jsx}')

const MissingComponent = () => <div>Component not found</div>

export function getLazyComponent(path: string) {
  const cleaned = path.replace(/^@\//, '../')
  const importer =
    pageModules[`${cleaned}.tsx`] ||
    pageModules[`${cleaned}.ts`] ||
    pageModules[`${cleaned}.jsx`] ||
    pageModules[`${cleaned}.js`]

  return importer ? lazy(importer as any) : MissingComponent
}

export { MissingComponent }
