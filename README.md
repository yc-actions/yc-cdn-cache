## GitHub Action to purge Yandex Cloud CDN cache.

The action purges cache for the given CDN resource in Yandex Cloud.

**Table of Contents**

<!-- toc -->

- [Usage](#usage)
- [Permissions](#permissions)
- [License Summary](#license-summary)

<!-- tocstop -->

## Usage

```yaml
    - name: Purge CDN cache
      id: purge-cache
      uses: yc-actions/yc-cdn-cache@v1
      with:
        yc-sa-json-credentials: ${{ secrets.YC_SA_JSON_CREDENTIALS }}
        cdn-resource-id: bc8********
```
`yc-sa-json-credentials` should contain JSON with authorized key for Service Account. More info in [Yandex Cloud IAM documentation](https://cloud.yandex.ru/docs/container-registry/operations/authentication#sa-json).

See [action.yml](action.yml) for the full documentation for this action's inputs and outputs.

## Permissions

To perform this action, it is required that the service account on behalf of which we are acting has granted the `cdn.editor` role or greater.

## License Summary

This code is made available under the MIT license.
