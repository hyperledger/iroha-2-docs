<script setup>
import { useData } from 'vitepress'

const { page } = useData()
</script>

::: info

This page contains the `api_spec.md` right from
`hyperledger/iroha#iroha2-dev`. You can read the most up-to-date version of
it on
[GitHub](https://github.com/hyperledger/iroha/blob/iroha2-dev/docs/source/references/api_spec.md).

Please note that this page was last updated at <b>{{ new Date(page.lastUpdated).toLocaleString() }}</b>.

:::

<!--@include: ../snippets/iroha2_dev_api_spec.md -->
