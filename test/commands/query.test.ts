import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('query', () => {
  it('should show error when no query provided', async () => {
    const {error} = await runCommand(['query'])
    expect(error?.message).to.contain('Missing required arg')
  })

  it('should execute query with search term', async () => {
    const {stdout} = await runCommand(['query', 'test', '-l', '1'])
    expect(stdout).to.contain('Showing page')
  })
})
