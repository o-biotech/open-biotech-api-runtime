import { loadEaCAzureAPISvc } from '@fathym/eac-azure/steward/clients';
import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OpenBiotechWebAPIState } from '@o-biotech/common/state';

export const handler: EaCRuntimeHandlers<OpenBiotechWebAPIState> = {
  async GET(req, ctx) {
    const entLookup = ctx.State.EnterpriseLookup!;

    const cloudLookup = ctx.State.CloudLookup;

    const url = new URL(req.url);

    const scopes: string[] = (url.searchParams.get('scope') as string).split(
      ',',
    );

    const eacAzureSvc = await loadEaCAzureAPISvc(ctx.State.EaCJWT!);

    const authToken = await eacAzureSvc.Cloud.AuthToken(
      entLookup,
      cloudLookup,
      scopes,
    );

    return Response.json(authToken);
  },
};
