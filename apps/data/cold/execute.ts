import { loadEaCAzureAPISvc } from '@fathym/eac-azure/steward/clients';
import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OpenBiotechWebAPIState } from '@o-biotech/common/state';

export const handler: EaCRuntimeHandlers<OpenBiotechWebAPIState> = {
  async GET(req, ctx) {
    const entLookup = ctx.State.EnterpriseLookup;

    const _username = ctx.State.Username;

    const cloudLookup = ctx.State.CloudLookup;

    const resGroupLookup = ctx.State.ResourceGroupLookup;

    const resLookups = ['iot-flow', 'iot-flow-cold'];

    const eacAzureSvc = await loadEaCAzureAPISvc(ctx.State.EaCJWT!);

    const url = new URL(req.url);

    const resultType = url.searchParams.get('resultType') as
      | 'json'
      | 'csv'
      | 'jsonl';

    const flatten = JSON.parse(
      url.searchParams.get('flatten') || 'false',
    ) as boolean;

    const download = JSON.parse(
      url.searchParams.get('download') || 'false',
    ) as boolean;

    const resp = await eacAzureSvc.DataLake.Execute(
      cloudLookup,
      resGroupLookup,
      resLookups,
      'telemetry',
      resultType || 'jsonl',
      flatten,
      download,
    );

    return new Response(resp.body!, {
      headers: resp.headers,
    });
  },
};
