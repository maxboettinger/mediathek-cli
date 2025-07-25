import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('detail', () => {
  it('should show error when no ID provided', async () => {
    const {error} = await runCommand(['detail'])
    expect(error?.message).to.contain('Missing required arg')
  })

  it('should show error when invalid ID provided', async () => {
    const {error} = await runCommand(['detail', '999'])
    expect(error?.message).to.contain('No entry found')
  })
})
