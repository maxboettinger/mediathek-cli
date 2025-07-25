
import oclif from 'eslint-config-oclif'

export default [
  ...oclif,
  {
    ignores: [
      'dist/**/*',
      'lib/**/*',
      'node_modules/**/*',
      '*.d.ts',
    ],
  },
]
