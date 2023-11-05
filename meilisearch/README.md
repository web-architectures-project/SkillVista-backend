## ###Meiliesearch

We are using meilisearch for providing a very comprehensive search experience to the users.
Our database will be indexed by the meilisearch and it will provide a simple search response based on user query.

Reason for using meilisearch:
Handeling using queries for providing search results will be quite challening if we do it just by database queries or raw sql
Eg.
User query: Plumbers in Smithfield, D07

Passing this to the database and getting a valid response is quite challenging. So we're using meiliesearch to tackle this problem.

For installing the same on your machine you need to build the docker image using:
@/meiliesearch

```console
docker build -t skill-vista-meilisearch .
```

and then run the container using

```bash
docker run -d --name skill-vista-meilisearch -p 7000:7000 -p 7700:7700 skill-vista-meilisearch
```
