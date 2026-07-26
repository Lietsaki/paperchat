import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  {
    ignores: ['out/**', 'android/**', '.next/**', 'functions/**']
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    }
  }
]

export default eslintConfig