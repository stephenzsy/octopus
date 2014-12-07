
namespace js Kraken

exception ValidationError {
  1: string errorCode,
  2: string message
}

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

const string STATUS_NOT_FOUND = "NOT_FOUND" // not imported yet
const string STATUS_IMPORTED = "IMPORTED" // document imported
const string STATUS_READY = "READY" // document parsed

struct ArchiveDailyIndex {
  // metadata fields
  1: string ArticleSourceId,
  2: string ArchiveDailyIndexId,
  3: string LocalDate,
  4: string Status,
  5: string SourceUrl,
  6: string ImportedDocumentId
}

struct GetArchiveDailyIndexRequest {
  1: string ArticleSourceId,
  2: string ArchiveDailyIndexId
}

struct ListArchiveDailyIndicesRequest {
  1: string ArticleSourceId,
  2: string LatestLocalDate, // ISO 8601 formatted
  3: i32 Limit, // limit on how many indices to fetch
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
  ArticleSource GetArticleSource(1: GetArticleSourceRequest request) throws (
    1: ValidationError validationError,
    2: InvalidArticleSourceIdNotFound invalidArticleSourceIdNotFound
  ),

  /**
   * List Archive Daily Indices
   **/
  list<ArchiveDailyIndex> ListArchiveDailyIndices(1: required ListArchiveDailyIndicesRequest request) throws (
    1: ValidationError validationError,
    2: InvalidArticleSourceIdNotFound invalidArticleSourceIdNotFound,
  ),

  /**
   * Get Archive Daily Index
   **/
  ArchiveDailyIndex GetArchiveDailyIndex(1: required GetArchiveDailyIndexRequest request) throws (
    1: ValidationError validationError,
    2: InvalidArticleSourceIdNotFound invalidArticleSourceIdNotFound,
  ),
}
