import {info, getInput, getMultilineInput, error, setFailed} from '@actions/core';
import {Session} from '@nikolay.matrosov/yc-ts-sdk';
import {completion} from '@nikolay.matrosov/yc-ts-sdk/lib/src/operation';
import {CacheService} from '@nikolay.matrosov/yc-ts-sdk/lib/api/cdn/v1';
import {PurgeCacheRequest} from '@nikolay.matrosov/yc-ts-sdk/lib/generated/yandex/cloud/cdn/v1/cache_service';
import {fromServiceAccountJsonFile} from '@nikolay.matrosov/yc-ts-sdk/lib/src/TokenService/iamTokenService';

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
    const cacheService = CacheService(session);

    const op = await cacheService.purge(
      PurgeCacheRequest.fromPartial({
        resourceId,
        paths,
      }),
    );
    const res = await completion(op, session);
    const err = res.error != null;
    info(`Operation ${res.id}  done:'${res.done}' has error:'${err}'`);
  } catch (err) {
    if (err instanceof Error) {
      error(err);
      setFailed(err.message);
    }
  }
}

run();
