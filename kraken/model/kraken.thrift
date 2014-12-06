
namespace js Kraken

struct ArticleSource {
  1: string Id,
  2: string Name,
  3: string Url
}

const string TYPE_DAILY_INDEX = "ARCHIVE_DAILY_INDEX"
const string TYPE_ARTICLE = "ARTICLE"

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

const string STATUS_NOT_FOUND = "NOT_FOUND"
const string STATUS_IMPORTED = "IMPORTED"
const string STATUS_READY = "READY"

struct ArchiveDailyIndex {
  1: string ArticleSourceId,
  2: string LocalDate,
  3: string Status,
  4: string SourceUrl,
  5: string ImportedDocumentId
}

struct GetArchiveDailyIndexRequest {
  1: string ArticleSourceId,
  2: string DateTimestamp
}

struct GetArticleSourceRequest {
  1: required string ArticleSourceId
}

service KrakenService {
  void ping(),

  /**
   * List Article Sources
   */
  list<ArticleSource> ListArticleSources(),

  /**
   * Get Article Source By ID
   */
  ArticleSource GetArticleSource(1: GetArticleSourceRequest request)
    throws (1: InvalidArticleSourceIdNotFound e),

  /**
   * Get Archive Daily Index
   **/
  ArchiveDailyIndex GetArchiveDailyIndex(1: GetArchiveDailyIndexRequest request)
    throws (1: InvalidArticleSourceIdNotFound e),

  /**
   * Import document
   */
  ImportedDocument ImportDocument(
    1: string articleSourceId,
    2: string type,
    3: string localDate
  ) throws (
    1: InvalidArticleSourceIdNotFound e
  )
}
