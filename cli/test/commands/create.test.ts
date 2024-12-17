import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('create', () => {
  it('runs create cmd', async () => {
    const {stdout} = await runCommand('create')
    expect(stdout).to.contain('hello world')
  })

  it('runs create --name oclif', async () => {
    const {stdout} = await runCommand('create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
