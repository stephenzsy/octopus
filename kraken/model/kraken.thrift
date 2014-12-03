
namespace js Kraken

struct ArticleSource {
  1: string Id,
  2: string Name,
  3: string Url
}

const string TYPE_DAILY_INDEX = "daily_index"
const string TYPE_ARTICLE = "article"

struct ImportedDocument {
  1: string ArticleSourceId,
  2: string Type,
  3: string Id,
  4: string SourceUrl,
  5: string ImportDateTime,
  6: string DocumentContent
}

exception InvalidArticleSourceIdNotFound {
  1: string errorCode,
  2: string message,
  3: string ArticleSourceId
}

service KrakenService {
  void ping(),

  /**
   * List Article Sources
   */
  list<ArticleSource> ListArticleSources(),

  /**
   * Import document
   */
  ImportedDocument ImportDocument(
    1: string articleSourceId,
    2: string type,
    3: string localDate)
      throws (1: InvalidArticleSourceIdNotFound e)
}
