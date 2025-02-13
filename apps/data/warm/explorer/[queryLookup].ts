import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OpenBiotechWebAPIState } from '@o-biotech/common/state';
import { loadEaCStewardSvc } from '@fathym/eac/steward/clients';
import { OpenBiotechEaC } from '@o-biotech/common/utils';
import { ExplorerRequest } from '@fathym/eac-azure/api';
import { loadEaCAzureAPISvc } from '@fathym/eac-azure/steward/clients';

export const handler: EaCRuntimeHandlerSet<OpenBiotechWebAPIState> = {
  async GET(_req, ctx) {
    const entLookup = ctx.State.EnterpriseLookup;

    const _username = ctx.State.Username;

    const cloudLookup = ctx.State.CloudLookup;

    const resGroupLookup = ctx.State.ResourceGroupLookup;

    const resLookups = ['iot-flow', 'iot-flow-warm'];

    const eacSvc = await loadEaCStewardSvc(ctx.State.EaCJWT!);

    const eac: OpenBiotechEaC = await eacSvc.EaC.Get(entLookup);

    let expReq: ExplorerRequest = {
      Query: `Devices
        | order by EnqueuedTime desc
        | take 100`,
    };

    if (
      eac.WarmStorageQueries &&
      ctx.Params.QueryLookup &&
      ctx.Params.QueryLookup in eac.WarmStorageQueries
    ) {
      expReq = {
        Query: eac.WarmStorageQueries[ctx.Params.QueryLookup].Details?.Query || '',
      };
    }

    const eacAzureSvc = await loadEaCAzureAPISvc(ctx.State.EaCJWT!);

    const queryResp = await eacAzureSvc.Explorer.Query(
      entLookup,
      cloudLookup,
      resGroupLookup,
      resLookups,
      'Telemetry',
      expReq,
    );

    return Response.json(JSON.stringify(queryResp));
  },
};
