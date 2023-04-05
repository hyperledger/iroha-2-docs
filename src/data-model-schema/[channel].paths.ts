import { renderSchema, type Schema } from '../../etc/render-schema'
import SCHEMA_DEV from '../snippets/data-model-schema.dev.json'
import SCHEMA_STABLE from '../snippets/data-model-schema.stable.json'
import SCHEMA_LTS from '../snippets/data-model-schema.lts.json'

const MAP = {
  dev: SCHEMA_DEV,
  lts: SCHEMA_LTS,
  stable: SCHEMA_STABLE,
} satisfies Record<'lts' | 'dev' | 'stable', Schema>

export default {
  paths() {
    const CHANNELS = ['stable', 'lts', 'dev'] as const

    return CHANNELS.map((channel) => {
      const json = MAP[channel]
      const schema = renderSchema(json)
      const content = `# Data Model Schema in \`iroha2-${channel}\`\n\n${schema}`

      return { params: { channel }, content }
    })
  },
}
