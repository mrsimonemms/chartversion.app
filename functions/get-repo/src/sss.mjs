import drc from 'docker-registry-client';

var client = drc.createClientV2({
  // name: 'ghcr.io/mrsimonemms/sample-helm-oci/nginx-example',
  name: 'registry-1.docker.io/bitnamicharts/appsmith',
  // log: log,
  insecure: true,
  // username: opts.username,
  // password: opts.password
});

client.listTags((err, tags) => {
  client.close()
  console.log(err)
  console.log(tags)
})
