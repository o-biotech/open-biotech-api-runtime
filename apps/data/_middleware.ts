import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { loadEaCStewardSvc } from '@fathym/eac/steward/clients';
import { OpenBiotechWebAPIState } from '@o-biotech/common/state';

export const handler: EaCRuntimeHandlerSet<OpenBiotechWebAPIState> = async (
  _req,
  ctx,
) => {
  const parentEaCSvc = await loadEaCStewardSvc();

  const entLookup = ctx.State.EnterpriseLookup;

  const username = ctx.State.Username;

  const jwt = await parentEaCSvc.EaC.JWT(entLookup, username);

  ctx.State.EaCJWT = jwt.Token;

  return await ctx.Next();
};
