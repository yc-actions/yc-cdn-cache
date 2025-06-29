import {error, getInput, getMultilineInput, info, setFailed} from '@actions/core';
import {PurgeCacheRequest} from '@yandex-cloud/nodejs-sdk/dist/generated/yandex/cloud/cdn/v1/cache_service';
import {fromServiceAccountJsonFile} from './service-account-json';
import {errors, serviceClients, Session} from '@yandex-cloud/nodejs-sdk';

async function run(): Promise<void> {
  try {
    info(`start`);
    const ycSaJsonCredentials = getInput('yc-sa-json-credentials', {
      required: true,
    });

    const resourceId = getInput('cdn-resource-id', {
      required: true,
    });
    const paths: string[] = getMultilineInput('cdn-paths') || [];
    info(`paths: ${JSON.stringify(paths)}`);

    const serviceAccountJson = fromServiceAccountJsonFile(JSON.parse(ycSaJsonCredentials));
    info('Parsed Service account JSON');

    const session = new Session({serviceAccountJson});
    const cacheService = session.client(serviceClients.CDNCacheServiceClient);

    const op = await cacheService.purge(
      PurgeCacheRequest.fromPartial({
        resourceId,
        paths,
      }),
    );
    const err = op.error != null;
    info(`Operation ${op.id}  done:'${op.done}' has error:'${err}'`);
  } catch (err) {
    if (err instanceof Error) {
      if (err instanceof errors.ApiError) {
        error(`${err.message}\nx-request-id: ${err.requestId}\nx-server-trace-id: ${err.serverTraceId}`);
      }
      error(err);
      setFailed(err.message);
    }
  }
}

run();
