import { ExplorerRequest } from '@fathym/eac-azure/api';
import { loadEaCAzureAPISvc } from '@fathym/eac-azure/steward/clients';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OpenBiotechWebAPIState } from '@o-biotech/common/state';

export const handler: EaCRuntimeHandlerSet<OpenBiotechWebAPIState> = {
  async GET(_req, ctx) {
    const entLookup = ctx.State.EnterpriseLookup;

    const _username = ctx.State.Username;

    const cloudLookup = ctx.State.CloudLookup;

    const resGroupLookup = ctx.State.ResourceGroupLookup;

    const resLookups = ['iot-flow', 'iot-flow-warm'];

    const expReq: ExplorerRequest = {
      Query: `Devices
| order by EnqueuedTime desc
| take 100`,
    };

    const eacAzureSvc = await loadEaCAzureAPISvc(ctx.State.EaCJWT!);

    const queryResp = await eacAzureSvc.Explorer.Query(
      cloudLookup,
      resGroupLookup,
      resLookups,
      'Telemetry',
      expReq,
    );

    return Response.json(queryResp);
  },

  async POST(req, ctx) {
    const entLookup = ctx.State.EnterpriseLookup;

    const cloudLookup = ctx.State.CloudLookup;

    const resGroupLookup = ctx.State.ResourceGroupLookup;

    const resLookups = ['iot-flow', 'iot-flow-warm'];

    const expReq: ExplorerRequest = await req.json();

    const eacAzureSvc = await loadEaCAzureAPISvc(ctx.State.EaCJWT!);

    const queryResp = await eacAzureSvc.Explorer.Query(
      entLookup,
      cloudLookup,
      resGroupLookup,
      resLookups,
      'Telemetry',
      expReq,
    );

    return Response.json(queryResp);
  },
};
