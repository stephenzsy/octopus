
namespace js Kraken

struct ArticleSource {
  1: string Id,
  2: string Name,
  3: string Url
}

service KrakenService {
  void ping(),

  list<ArticleSource> ListArticleSources()
}
