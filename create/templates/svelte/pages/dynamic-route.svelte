<Page>
  <Navbar title="Dynamic Route" backLink="Back" />
  <Block strong>
    <ul>
      <li><b>Url:</b> {zmproute.url}</li>
      <li><b>Path:</b> {zmproute.path}</li>
      <li><b>Hash:</b> {zmproute.hash}</li>
      <li><b>Params:</b>
        <ul>
          {#each Object.keys(zmproute.params) as key}
            <li><b>{key}:</b> {zmproute.params[key]}</li>
          {/each}
        </ul>
      </li>
      <li><b>Query:</b>
        <ul>
          {#each Object.keys(zmproute.query) as key}
            <li><b>{key}:</b> {zmproute.query[key]}</li>
          {/each}
        </ul>
      </li>
      <li><b>Route:</b> {zmproute.route.path}</li>
    </ul>
  </Block>
  <Block strong>
    <Link onClick={() => zmprouter.back()}>Go back via Router API</Link>
  </Block>
</Page>
<script>
  import { Page, Navbar, Block, Link } from 'zmp-svelte';

  export let zmproute;
  export let zmprouter;
</script>
