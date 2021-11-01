import * as core from '@actions/core';
import {Session} from '@nikolay.matrosov/yc-ts-sdk';
import {completion} from '@nikolay.matrosov/yc-ts-sdk/lib/src/operation';
import {CacheService} from '@nikolay.matrosov/yc-ts-sdk/lib/api/cdn/v1';
import {PurgeCacheRequest} from '@nikolay.matrosov/yc-ts-sdk/lib/generated/yandex/cloud/cdn/v1/cache_service';
import {fromServiceAccountJsonFile} from '@nikolay.matrosov/yc-ts-sdk/lib/src/TokenService/iamTokenService';

async function run(): Promise<void> {
  try {
    core.info(`start`);
    const ycSaJsonCredentials = core.getInput('yc-sa-json-credentials', {
      required: true,
    });

    const resourceId = core.getInput('cdn-resource-id', {
      required: true,
    });
    const paths: string[] = core.getMultilineInput('cdn-paths') || [];
    core.info(`paths: ${JSON.stringify(paths)}`);

    const serviceAccountJson = fromServiceAccountJsonFile(JSON.parse(ycSaJsonCredentials));
    core.info('Parsed Service account JSON');

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
    core.info(`Operation ${res.id}  done:'${res.done}' has error:'${err}'`);
  } catch (error) {
    if (error instanceof Error) {
      core.error(error);
      core.setFailed(error.message);
    }
  }
}

run();
