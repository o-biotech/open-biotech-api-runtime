import { IoCContainer } from '@fathym/ioc';
import {
  EaCAzureAPIPlugin,
  EaCAzureCloudsStewardPlugin,
  EaCAzureSecretsStewardPlugin,
} from '@fathym/eac-azure/steward/plugins';
import { EaCRuntimeConfig, EaCRuntimePluginConfig } from '@fathym/eac/runtime/config';
import { EaCRuntimePlugin } from '@fathym/eac/runtime/plugins';
import { EverythingAsCode } from '@fathym/eac';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';
import { EaCAPIProcessor } from '@fathym/eac-applications/processors';
import { EaCLocalDistributedFileSystemDetails } from '@fathym/eac/dfs';
import { EaCJWTValidationModifierDetails } from '@fathym/eac-applications/modifiers';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications
    > = {
      Name: RuntimePlugin.name,
      Plugins: [
        new EaCAzureAPIPlugin({
          Application: {
            JWTValidationModifier: {
              Lookup: 'jwtValidate',
            },
          },
        }),
        new EaCAzureCloudsStewardPlugin({
          Application: {
            JWTValidationModifier: {
              Lookup: 'jwtValidate',
            },
          },
        }),
        new EaCAzureSecretsStewardPlugin({
          Application: {
            JWTValidationModifier: {
              Lookup: 'jwtValidate',
            },
          },
        }),
      ],
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'Sink Micro Applications',
              Description: 'The Kitchen Sink Micro Applications to use.',
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: config.Servers![0].port || 8000,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: config.Servers![0].port || 8000,
              },
              'host.docker.internal': {
                Hostname: 'host.docker.internal',
                Port: config.Servers![0].port || 8000,
              },
              'open-biotech.fathym.com': {
                Hostname: 'open-biotech.fathym.com',
              },
              'www.openbiotech.co': {
                Hostname: 'www.openbiotech.co',
              },
              'open-biotech-web-runtime.azurewebsites.net': {
                Hostname: 'open-biotech-web-runtime.azurewebsites.net',
              },
            },
            ModifierResolvers: {},
            ApplicationResolvers: {
              api: {
                PathPattern: '/api*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          api: {
            Details: {
              Name: 'Local API',
              Description: 'Default local APIs.',
            },
            Processor: {
              Type: 'API',
              DFSLookup: 'local:apps/data',
            } as EaCAPIProcessor,
          },
        },
        DFSs: {
          'local:apps/data': {
            Details: {
              Type: 'Local',
              FileRoot: './apps/data/',
              DefaultFile: 'index.ts',
              Extensions: ['ts'],
            } as EaCLocalDistributedFileSystemDetails,
          },
        },
        Modifiers: {
          jwtValidate: {
            Details: {
              Type: 'JWTValidation',
              Name: 'Validate JWT',
              Description: 'Validate incoming JWTs to restrict access.',
            } as EaCJWTValidationModifierDetails,
          },
        },
        $GlobalOptions: {
          DFSs: {
            PreventWorkers: true,
          },
        },
      },
    };

    return Promise.resolve(pluginConfig);
  }
}
